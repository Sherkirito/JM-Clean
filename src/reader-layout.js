// Keep the site's original image and canvas nodes, including their loaders and click handlers.
function installLayout(options) {
  if(window.jm2Pager)return;
  if(options.offline && location.protocol!=='file:')return;
  const count=options.count, modes=['vertical','horizontal','rtl','spread-ltr','spread-rtl'];
  const selector='[id^="page_"],img[id^="album_photo_"]';
  let mode=options.mode, step=1, page=0, focus=options.initial, last=-1;
  let root,track,pages=[],owl,slider,blank=false,ready=false,changing=false,frame=0;
  let schedulePaint=null,settleFrame=0;
  let scrollTimer=0,touching=false;
  let restoring=true,pinned=false,resizeWatch,savedScrollY=0,wakeDisplay;
  const decoding=new WeakMap();
  let cache=options.cache,imageWindow,suspended=false,scrubbing=false,scrubTarget=null;
  let dragRequest=0;
  let autoDelay=0,autoTimer=0,autoRequest=0,autoTarget=null;
  // The source's lazy loaders still own image assignment and canvas drawing. Request
  // the saved screen as soon as its real URLs appear, even if window.load is stalled.
  function prioritizeResume(){
    const first=mode.startsWith('spread')?clamp(focus)-clamp(focus)%2:clamp(focus);
    const wanted=new Set([first]);
    if(mode.startsWith('spread') && first+1<count)wanted.add(first+1);
    let observer;
    function scan(){
      const container=document.getElementById('photo-container');
      if(!container || !document.head)return;
      for(const i of wanted){
        const img=document.getElementById('album_photo_'+i);
        if(!img || img.tagName!=='IMG' || !container.contains(img))continue;
        const lazy=(devicePixelRatio>1 && img.dataset.srcRetina)||img.dataset.src||img.dataset.original;
        if(!lazy)continue;
        wanted.delete(i);
        img.setAttribute('fetchpriority','high');
        let url;try{url=new URL(lazy,document.baseURI);}catch(_){continue;}
        if(!/^https?:$/.test(url.protocol) || img.currentSrc===url.href || img.src===url.href)continue;
        const link=document.createElement('link');
        link.rel='preload';link.as='image';link.href=url.href;link.setAttribute('fetchpriority','high');
        if(img.crossOrigin!=null)link.crossOrigin=img.crossOrigin;
        if(img.referrerPolicy)link.referrerPolicy=img.referrerPolicy;
        document.head.appendChild(link);
      }
      if(!wanted.size && observer)observer.disconnect();
    }
    scan();
    if(wanted.size && document.readyState!=='complete'){
      observer=new MutationObserver(scan);
      observer.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['data-src','data-original','data-src-retina']});
      window.addEventListener('load',()=>{scan();observer.disconnect();},{once:true});
    }
  }
  function send(type,extra){
    window.ReactNativeWebView.postMessage(JSON.stringify(Object.assign({type,session:options.session,page},extra)));
  }
  function clamp(n){return Math.max(0,Math.min(count-1,Math.floor(Number(n)||0)));}
  function anchor(n){return Math.floor(clamp(n)/step)*step;}
  function report(n){
    if(changing || restoring || autoTarget!=null || pinned && anchor(n)!==page)return;
    const next=anchor(n);
    if(scrubTarget!==null && next!==scrubTarget)return;
    if(next!==page)focus=next;
    page=next;
    if(imageWindow)imageWindow.schedule();
    if(scrubbing)return;
    if(page!==last){
      last=page;
      // Modern vertical templates observe individual images. A synthetic window scroll
      // would also remeasure every page against vertical offsets during horizontal motion.
      if(!owl && mode!=='vertical' && !window.IntersectionObserver)window.dispatchEvent(new Event('scroll'));
      if(schedulePaint)schedulePaint();
      send('jm2Page');
    }
  }
  // Chrome 85 changed RTL scrollLeft from "max at the start, 0 at the end" to
  // "0 at the start, negative toward the end". WebView 83 and older still use the
  // former, so paged RTL tracks measure their position as distance from the start.
  let rtlScroll='',touchFrom=null;
  function rtlScrollType(){
    if(rtlScroll)return rtlScroll;
    const box=document.createElement('div'),inner=document.createElement('div');
    box.dir='rtl';box.style.cssText='position:absolute;top:-9999px;width:4px;height:4px;overflow:scroll;visibility:hidden';
    inner.style.cssText='width:8px;height:1px';box.appendChild(inner);(document.body||document.documentElement).appendChild(box);
    if(box.scrollLeft>0)rtlScroll='max';
    else{box.scrollLeft=1;rtlScroll=box.scrollLeft===0?'negative':'positive';}
    box.remove();return rtlScroll;
  }
  function trackOffset(){
    const x=track.scrollLeft;
    if(!mode.endsWith('rtl'))return x;
    const type=rtlScrollType();
    return type==='negative'?-x:type==='positive'?x:Math.max(0,track.scrollWidth-track.clientWidth-x);
  }
  function setTrackOffset(value,smooth){
    let left=value;
    if(mode.endsWith('rtl')){
      const type=rtlScrollType();
      left=type==='negative'?-value:type==='positive'?value:track.scrollWidth-track.clientWidth-value;
    }
    if(smooth && typeof track.scrollTo==='function')track.scrollTo({left,behavior:'smooth'});
    else track.scrollLeft=left;
  }
  function go(n){
    n=clamp(n);
    const target=anchor(n);
    if(ready){
      if(mode==='vertical'){
        pages[target].scrollIntoView({block:'start',behavior:'instant'});
      }
      else if(owl)owl.to(target,0,true);
      else setTrackOffset(Math.floor(target/step)*track.clientWidth);
    }else if(mode==='vertical' && typeof window.gotopage==='function')window.gotopage(n);
    else if(mode==='horizontal' && typeof window.horizontalGotoPage==='function')window.horizontalGotoPage(n);
    report(target);focus=n;
    if(imageWindow)imageWindow.schedule();
  }
  function cancelSeek(notify){
    if(scrubbing && notify)send('jm2Scrubbed',{request:dragRequest,cancelled:true});
    scrubbing=false;scrubTarget=null;
  }
  function scrub(n,finish,request){
    if(restoring || suspended || request<dragRequest)return;
    stopAuto('manual');releaseAnchor();dragRequest=request;
    const at=anchor(n);
    scrubTarget=at;scrubbing=true;
    go(at);
    if(imageWindow)imageWindow.show(at);
    if(schedulePaint)schedulePaint();
    if(finish){
      scrubbing=false;scrubTarget=null;send('jm2Scrubbed',{request});last=-1;report(at);
    }
  }
  function realImage(img){
    const src=img.currentSrc||img.src;
    if(!img.getAttribute('src') || !img.complete || !img.naturalWidth || !img.naturalHeight ||
      /(?:app-loading|\/blank\.jpg(?:[?#]|$))/i.test(src))return false;
    // Some templates put a decoded data-URI placeholder in src before assigning the real lazy URL.
    const lazy=img.dataset.srcRetina||img.dataset.src||img.dataset.original;
    return !lazy || !src.startsWith('data:') || [img.dataset.src,img.dataset.srcRetina,img.dataset.original].includes(src);
  }
  function visible(node){
    const r=node.getBoundingClientRect(),css=getComputedStyle(node);
    return r.width>0 && r.height>0 && r.right>0 && r.left<innerWidth && r.bottom>0 && r.top<innerHeight &&
      css.visibility==='visible' && Number(css.opacity)>0;
  }
  function displayed(node){
    const img=node.matches('img')?node:node.querySelector('img[id^="album_photo_"]')||node.querySelector('img');
    const canvas=node.matches('canvas')?node:node.querySelector('canvas');
    if(img && !realImage(img))return false;
    if(canvas && canvas.width && canvas.height && visible(canvas))return true;
    return !!img && visible(img) && decoded(img);
  }
  function decoded(img){
    if(typeof img.decode!=='function')return true;
    const src=img.currentSrc||img.src;
    let record=decoding.get(img);
    if(!record || record.src!==src){
      record={src,done:false};decoding.set(img,record);
      img.decode().then(()=>{record.done=true;if(wakeDisplay)wakeDisplay();},()=>{});
    }
    return record.done;
  }
  function aligned(node,at=page){
    const r=node.getBoundingClientRect();
    if(r.width<=0 || r.height<=0 || r.bottom<=0 || r.top>=innerHeight)return false;
    if(mode==='vertical'){
      const doc=document.scrollingElement||document.documentElement;
      return Math.abs(r.top)<=2 || r.top>0 && doc.scrollTop+doc.clientHeight>=doc.scrollHeight-2;
    }
    if(ready && owl && (owl.relative(owl.current())!==at || owl.is('animating') || owl.is('dragging')))return false;
    const viewport=(ready && owl?owl.$stage[0].parentElement:track||root).getBoundingClientRect();
    const left=Math.max(0,viewport.left),right=Math.min(innerWidth,viewport.right);
    if(right<=left)return false;
    const slotWidth=(right-left)/step,column=node===resumeNode(at)?0:1;
    const center=left+slotWidth*((mode.endsWith('rtl')?step-1-column:column)+.5);
    const overlap=Math.min(right,r.right)-Math.max(left,r.left);
    return (!ready || r.left<=center && r.right>=center) && overlap>=Math.min(r.width,slotWidth)*.85;
  }
  function resumeNode(i){
    if(ready)return pages[i];
    const node=document.getElementById('page_'+i)||document.getElementById('album_photo_'+i);
    return node && root && root.contains(node)?node:null;
  }
  function alignSaved(){
    const node=resumeNode(page);
    if(node && !aligned(node)){
      if(mode==='vertical')node.scrollIntoView({block:'start',behavior:'instant'});
      else if(!ready || !owl)go(focus);
    }
  }
  // Preserve a newly restored strip across a layout change above it only while
  // the viewport is still parked at its original offset.
  function resizedStrip(){
    if(!pinned || suspended)return;
    if(window.scrollY!==savedScrollY){releaseAnchor();return;}
    alignSaved();savedScrollY=window.scrollY;
  }
  function releaseAnchor(event){
    if(restoring || !pinned || event && event.type==='pointermove' && !event.buttons)return;
    pinned=false;
    if(resizeWatch)resizeWatch.disconnect();
    for(const type of intentEvents)window.removeEventListener(type,releaseAnchor,true);
    if(!ready)send('jm2LegacyInput');
  }
  const intentEvents=['pointerdown','touchstart','touchmove','pointermove','wheel','keydown'];
  const stopOnTouch=()=>stopAuto('touch');
  const stopOnHide=()=>{if(document.hidden)stopAuto('hidden');};
  function stopAuto(reason){
    if(!autoDelay)return;
    clearTimeout(autoTimer);autoDelay=0;
    window.removeEventListener('pointerdown',stopOnTouch,true);
    window.removeEventListener('touchstart',stopOnTouch,true);
    window.removeEventListener('wheel',stopOnTouch,true);
    document.removeEventListener('visibilitychange',stopOnHide);
    if(autoTarget!=null){
      const at=autoTarget;autoTarget=null;report(at);
    }
    send('jm2Auto',{running:false,reason,request:autoRequest});
  }
  function remainingStrip(){
    if(mode!=='vertical')return 0;
    const doc=document.scrollingElement||document.documentElement,node=resumeNode(page);
    return node?Math.min(node.getBoundingClientRect().bottom-innerHeight,doc.scrollHeight-doc.clientHeight-doc.scrollTop):0;
  }
  function autoScreenShown(at){
    const first=resumeNode(at),end=resumeNode(Math.min(count-1,at+step-1));
    if(!first || !end || !displayed(first) || first!==end && !displayed(end))return false;
    return mode==='vertical' && autoTarget==null || aligned(first,at) && (first===end || aligned(end,at));
  }
  function waitForAutoPage(at,started){
    if(!autoDelay)return;
    if(document.hidden){stopAuto('hidden');return;}
    if(autoTarget==null)at=page;
    if(!autoScreenShown(at)){
      if(Date.now()-started>=25000){stopAuto('timeout');return;}
      autoTimer=setTimeout(()=>waitForAutoPage(at,started),150);return;
    }
    if(autoTarget!=null){autoTarget=null;report(at);}
    if(at+step>=count && remainingStrip()<=2){stopAuto('end');return;}
    autoTimer=setTimeout(()=>{
      if(document.hidden){stopAuto('hidden');return;}
      // A late reflow or image replacement can invalidate an already scheduled turn.
      if(at!==page || !autoScreenShown(at)){waitForAutoPage(page,Date.now());return;}
      releaseAnchor();
      const rest=remainingStrip();
      if(rest>2){
        window.scrollBy(0,Math.min(rest,Math.max(1,Math.floor(innerHeight*.85))));
        waitForAutoPage(page,Date.now());return;
      }
      if(page+step>=count){stopAuto('end');return;}
      autoTarget=page+step;go(autoTarget);
      waitForAutoPage(autoTarget,Date.now());
    },autoDelay);
  }
  function setAuto(seconds,request){
    stopAuto('pause');autoRequest=request;
    if(!seconds)return;
    if(scrubTarget!==null)cancelSeek(true);
    if(restoring || document.hidden || !Number.isInteger(seconds) || seconds<2 || seconds>30){
      send('jm2Auto',{running:false,request});return;
    }
    autoDelay=seconds*1000;
    window.addEventListener('pointerdown',stopOnTouch,{capture:true,passive:true});
    window.addEventListener('touchstart',stopOnTouch,{capture:true,passive:true});
    window.addEventListener('wheel',stopOnTouch,{capture:true,passive:true});
    document.addEventListener('visibilitychange',stopOnHide);
    send('jm2Auto',{running:true,request});waitForAutoPage(page,Date.now());
  }
  function awaitDisplay(){
    let previous=null,timer=0,paint=0;
    function wake(){
      clearTimeout(timer);
      if(!paint && restoring)paint=requestAnimationFrame(check);
    }
    function loaded(event){
      const node=resumeNode(page),end=resumeNode(Math.min(count-1,page+step-1));
      if(node && node.contains(event.target) || end && end.contains(event.target))wake();
    }
    function check(){
      paint=0;alignSaved();
      const first=resumeNode(page),end=resumeNode(Math.min(count-1,page+step-1));
      const firstShown=first && aligned(first) && displayed(first);
      const secondShown=first===end || end && aligned(end) && displayed(end);
      if(firstShown && secondShown){
        const rect=first.getBoundingClientRect(),geometry=[rect.left,rect.top,rect.width,rect.height];
        if(previous && geometry.every((v,i)=>Math.abs(v-previous[i])<=1)){
          restoring=false;wakeDisplay=null;document.removeEventListener('load',loaded,true);
          pinned=mode==='vertical' || !ready;
          if(pinned){
            savedScrollY=window.scrollY;
            for(const type of intentEvents)window.addEventListener(type,releaseAnchor,{capture:true,passive:true});
            if(mode==='vertical' && window.ResizeObserver){resizeWatch=new ResizeObserver(resizedStrip);resizeWatch.observe(root);}
          }
          send(ready?'jm2Ready':'jm2Legacy');report(page);
          return;
        }
        previous=geometry;wake();
      }else{previous=null;timer=setTimeout(wake,125);}
    }
    wakeDisplay=wake;document.addEventListener('load',loaded,true);wake();
  }
  function finishNativeScroll(){
    if(touching || !ready || changing || owl || mode==='vertical' || !track.clientWidth)return;
    const width=track.clientWidth,offset=trackOffset();
    // WebView 83 and older resolve RTL snap points at the wrong end, so those
    // tracks have CSS snapping turned off (jm2-nosnap) and settle here instead,
    // one group per swipe like scroll-snap-stop; the next scroll end reports it.
    let aligned=Math.min(Math.max(0,track.scrollWidth-width),Math.round(offset/width)*width);
    if(touchFrom!==null){
      // A deliberate drag turns one group in its direction; a short one returns.
      const from=Math.round(touchFrom/width)*width,delta=offset-from;
      aligned=Math.abs(delta)>width*0.12?from+Math.sign(delta)*width:from;
      aligned=Math.min(Math.max(0,track.scrollWidth-width),Math.max(0,aligned));
      touchFrom=null;
    }
    if(Math.abs(offset-aligned)>2){setTrackOffset(aligned,true);return;}
    report(Math.round(offset/width)*step);
  }
  function afterScroll(){
    clearTimeout(scrollTimer);
    scrollTimer=setTimeout(finishNativeScroll,120);
  }
  function onScroll(event){
    if(restoring)return;
    if(pinned){
      if(mode==='vertical' && window.scrollY!==savedScrollY)releaseAnchor();
      else return;
    }
    if(!owl && mode!=='vertical'){
      if(event.target===track && !('onscrollend' in track))afterScroll();
      return;
    }
    if(frame || changing || !ready || (owl && mode!=='vertical'))return;
    frame=requestAnimationFrame(()=>{
      frame=0;
      if(mode==='vertical'){
        const doc=document.scrollingElement||document.documentElement;
        if(doc.scrollTop>0 && doc.scrollTop+doc.clientHeight>=doc.scrollHeight-2){report(count-1);return;}
        let lo=0,hi=count-1;
        while(lo<hi){const mid=(lo+hi)>>1;if(pages[mid].getBoundingClientRect().bottom>innerHeight*.35)hi=mid;else lo=mid+1;}
        report(lo);
      }
    });
  }
  function findPages(){
    root=document.getElementById('photo-container');
    if(!root)return false;
    slider=window.jQuery && window.jQuery(root);
    owl=slider && slider.data('owl.carousel');
    // A template can create its carousel after document load. Installing a flex
    // track before Owl wraps these nodes would hide the new stage on its first frame.
    if(!owl && root.classList.contains('owl-carousel'))return false;
    if(owl){
      const items=owl.items();
      let books=items.filter(item=>item[0].matches(selector)||item[0].querySelector(selector));
      if(books.length!==count)books=items.filter(item=>!item[0].querySelector('.ad-body,.thewayhome,[data-jm2-ad]') && item[0].querySelector('img,canvas,.scramble-page'));
      if(books.length!==count)return false;
      pages=books.map(item=>item[0]);
      if(books.length!==items.length){
        const kept=new Set(books);
        for(let i=items.length-1;i>=0;i--)if(!kept.has(items[i]))owl.remove(i);
      }
      return true;
    }
    for(const query of ['.scramble-page','[id^="page_"]','img[id^="album_photo_"]']){
      const matches=Array.from(root.querySelectorAll(query)).filter(node=>query!=='.scramble-page'||node.matches(selector)||node.querySelector(selector));
      if(matches.length!==count)continue;
      // Promote nested images to their existing page wrappers without reparenting them.
      let parent=matches[0].parentElement;
      while(parent!==root && !matches.every(node=>parent.contains(node)))parent=parent.parentElement;
      const boxes=matches.map(node=>{while(node.parentElement!==parent)node=node.parentElement;return node;});
      if(new Set(boxes).size!==count)continue;
      pages=boxes;track=parent;return true;
    }
    return false;
  }
  function installImageWindow(){
    if(!cache)return null;
    const records=new Map(),resident=new Set(),recent=new Set(),indices=new WeakMap();
    let visiblePages=new Set(),frameId=0,zipTicket=0,zipWake=0;
    const zipQueue=new Map(),zipReading=new Set();
    function pumpZip(){
      while(!suspended && zipReading.size<2 && zipQueue.size){
        const first=autoTarget===null?page:autoTarget;
        const i=zipQueue.has(first)?first:step===2 && zipQueue.has(first+1)?first+1:zipQueue.keys().next().value;
        const ticket=zipQueue.get(i);zipQueue.delete(i);zipReading.add(ticket);
        send('jm2ZipPage',{index:i,ticket});
      }
    }
    // This Android WebView can defer a bridge callback on a stationary page.
    // Wake it only while an extraction is outstanding, including the second half of a spread.
    function wakePendingZip(){
      zipWake=0;
      if(suspended || ![...resident].some(i=>records.get(i).pending))return;
      send('jm2ZipWaiting');zipWake=setTimeout(wakePendingZip,200);
    }
    for(let i=0;i<count;i++){
      const box=pages[i]||resumeNode(i);
      let img=box && (box.matches('img')?box:box.querySelector('img[id^="album_photo_"]')||box.querySelector('img'));
      if(!img || img.closest('picture') || img.hasAttribute('srcset'))continue;
      const url=(devicePixelRatio>1 && img.dataset.srcRetina)||img.dataset.src||img.dataset.original||img.getAttribute('src');
      if(!url || /(?:app-loading|\/blank\.jpg(?:[?#]|$))/i.test(url))continue;
      let source;try{source=new URL(url,document.baseURI);}catch(_){continue;}
      const local=options.offline && location.protocol==='file:' && url==='p'+i+'.jpg' && source.protocol==='file:';
      if(!local && !/^https?:$/.test(source.protocol) && !/^data:image\//i.test(source.href))continue;
      // Source observers may have queued work on their lazy image nodes. Keep the
      // page wrapper and book metadata, but give those callbacks no ownership of the new image.
      if(img.matches('.owl-lazy,.lazy_img')){
        const original=img;
        const drawing=canvas(original);
        const keepDrawing=drawing && realImage(original) && original.src===source.href &&
          drawing.width===original.naturalWidth && drawing.height===original.naturalHeight;
        if(drawing && !keepDrawing)dropCanvas(original);
        img=document.createElement('img');
        for(const attr of original.attributes){
          if(!['src','loading','fetchpriority'].includes(attr.name))img.setAttribute(attr.name,attr.value);
        }
        img.classList.remove('owl-lazy','lazy_img','lazy-loaded');
        img.classList.toggle('hide',!!keepDrawing);
        img.style.visibility='';img.style.opacity='1';
        original.onload=null;
        original.replaceWith(img);
        if(pages[i]===original)pages[i]=img;
        original.removeAttribute('data-src');original.removeAttribute('data-src-retina');original.removeAttribute('data-original');
        original.removeAttribute('src');
      }
      const record={img,url:source.href,failed:false,local};
      records.set(i,record);indices.set(img,i);
      if(img.getAttribute('src') || (img.nextElementSibling&&img.nextElementSibling.tagName)==='CANVAS')resident.add(i);
      img.classList.add('jm2-image-slot','jm2-image-pending');
      if(!img.getAttribute('src') && !canvas(img))img.classList.add('jm2-image-idle');
    }
    if(!records.size)return null;
    function canvas(img){const node=img.nextElementSibling;return node&&node.tagName==='CANVAS'?node:null;}
    function dropCanvas(img){
      const node=canvas(img);
      if(node){img.classList.add('jm2-image-pending');img.classList.remove('hide');img.style.visibility='hidden';node.remove();node.width=0;node.height=0;}
    }
    function forget(i){
      const r=records.get(i),img=r.img;
      if(r.local && r.ticket && !zipQueue.delete(i))send('jm2ZipDrop',{index:i,ticket:r.ticket});
      r.ticket=0;r.pending=false;
      dropCanvas(img);img.classList.add('jm2-image-idle','jm2-image-pending');img.removeAttribute('src');
      decoding.delete(img);resident.delete(i);
    }
    function load(i,foreground){
      const r=records.get(i);if(!r)return;
      const img=r.img;
      if(!resident.has(i) || img.src!==r.url){
        if(r.local && resident.has(i) && (r.pending||r.failed))return;
        resident.add(i);r.failed=false;
        img.loading='eager';img.setAttribute('fetchpriority',foreground?'high':'low');
        if(r.local){
          r.pending=true;r.ticket=++zipTicket;zipQueue.set(i,r.ticket);pumpZip();
          if(!zipWake)zipWake=setTimeout(wakePendingZip,200);
        }
        else img.src=r.url;
      }
    }
    function paint(i){
      const r=records.get(i);if(!r || !realImage(r.img))return;
      const img=r.img;img.classList.remove('jm2-image-idle');
      if(typeof window.scramble_image==='function' && !canvas(img)){
        img.style.visibility='';
        window.scramble_image(img,window.aid,window.scramble_id,false,window.speed);
      }else if(!canvas(img)){
        img.style.visibility='';
        // Warm only the current and adjacent drawings for the next gesture.
        decoded(img);
      }
      // A source renderer may have finished before we adopted this slot.
      // Keep exactly one presentation, including the frame of a late image load.
      if(canvas(img))img.classList.add('hide');
      img.classList.remove('jm2-image-pending');
    }
    function refresh(){
      frameId=0;
      if(suspended || !root || changing || owl && (owl.is('dragging')||owl.is('animating')))return;
      // Automatic turns keep the old progress until the target has actually loaded.
      const at=autoTarget!==null?autoTarget:page;
      let first=at,end=Math.min(count-1,at+step-1);
      if(mode==='vertical' && ready){
        while(first>0){const r=pages[first-1].getBoundingClientRect();if(r.height<=0||r.bottom<=0||r.top>=innerHeight)break;first--;}
        while(end+1<count){const r=pages[end+1].getBoundingClientRect();if(r.height<=0||r.top>=innerHeight||r.bottom<=0)break;end++;}
      }
      const shown=new Set();
      for(let i=first;i<=end;i++){
        shown.add(i);recent.delete(i);
        const r=records.get(i);
        if(r && r.failed && !visiblePages.has(i))resident.delete(i);
        load(i,true);paint(i);
      }
      const wanted=new Set(shown);
      for(const i of visiblePages){
        const r=records.get(i);
        if(!shown.has(i) && r && realImage(r.img)){recent.delete(i);recent.add(i);}
      }
      visiblePages=shown;
      while(recent.size>cache.keep)recent.delete(recent.values().next().value);
      for(const i of recent)wanted.add(i);
      const ahead=Math.min(cache.ahead,count-end-1);
      for(let i=end+1;i<=end+ahead;i++)wanted.add(i);
      let pending=0;
      for(const i of resident){
        if(!wanted.has(i)){forget(i);continue;}
        const r=records.get(i);
        if(!shown.has(i)){
          if(!r.failed && (r.pending||!r.img.complete))pending++;
          // Retain the encoded image. Only adjacent pages need a decoded drawing surface.
          if(i<first-step || i>end+step)dropCanvas(r.img);else paint(i);
        }
      }
      if(!restoring && !scrubbing && [...shown].every(i=>!records.has(i)||realImage(records.get(i).img))){
        for(let i=end+1;i<=end+ahead && pending<2;i++){
          if(records.has(i) && !resident.has(i)){load(i,false);pending++;}
        }
      }
    }
    function schedule(){if(!suspended && !frameId)frameId=requestAnimationFrame(refresh);}
    function settled(event){
      const i=indices.get(event.target);if(i==null)return;
      const r=records.get(i),img=r.img;
      if(!resident.has(i) || img.src!==r.url)return;
      r.failed=event.type==='error';
      if(!r.failed && img.naturalWidth && img.naturalHeight){
        img.style.setProperty('--jm2-image-ratio',img.naturalWidth+' / '+img.naturalHeight);
        img.style.setProperty('--jm2-image-width',img.naturalWidth+'px');
        img.classList.remove('jm2-image-idle');
      }
      schedule();
    }
    root.addEventListener('load',settled,true);root.addEventListener('error',settled,true);
    function clear(){
      cancelAnimationFrame(frameId);frameId=0;
      clearTimeout(zipWake);zipWake=0;
      for(const i of resident)forget(i);
      recent.clear();visiblePages.clear();
    }
    function show(at){
      for(let i=at;i<Math.min(at+step,count);i++){
        if(!records.has(i))continue;
        load(i,true);paint(i);
      }
      schedule();
    }
    function zipPage(i,ticket,ok){
      zipReading.delete(ticket);
      const r=records.get(i);
      if(!r || !r.local || r.ticket!==ticket || !resident.has(i)){pumpZip();return;}
      r.pending=false;r.failed=!ok;
      if(ok)r.img.src=r.url;
      else if(i>=page && i<page+step && !scrubbing)send('jm2ZipError',{index:i});
      pumpZip();schedule();
    }
    return {schedule,clear,show,zipPage,owns:i=>records.has(i)};
  }
  function installCanvasWindow(){
    const jq=window.jQuery;
    if(typeof jq._data!=='function' || typeof window.scramble_image!=='function')return null;
    const handlers=(jq._data(root,'events')||{}).dragged||[];
    const cleanup=handlers.filter(record=>{
      const code=Function.prototype.toString.call(record.handler);
      return !record.selector && record.namespace.split('.').includes('carousel') &&
        ['.owl-item','active','canvas','scramble_image'].every(word=>code.includes(word)) && /\.remove\s*\(/.test(code);
    });
    if(cleanup.length!==1)return null;
    slider.off('dragged.'+cleanup[0].namespace,cleanup[0].handler);
    const indices=new WeakMap(),resident=new Set();
    pages.forEach((node,i)=>{
      indices.set(node,i);
      if(!(imageWindow&&imageWindow.owns(i)) && node.querySelector('img[id^="album_photo_"] + canvas'))resident.add(i);
    });
    let paintFrame=0;
    function paint(){
      paintFrame=0;
      if(!ready || changing || owl.is('dragging') || owl.is('animating'))return;
      let first=mode==='vertical'?page:anchor(owl.relative(owl.current())),lastPage=Math.min(count-1,first+step-1);
      if(mode==='vertical'){
        while(first>0 && pages[first-1].getBoundingClientRect().bottom>0)first--;
        while(lastPage+1<count && pages[lastPage+1].getBoundingClientRect().top<innerHeight)lastPage++;
      }
      const low=Math.max(0,first-step),high=Math.min(count-1,lastPage+step);
      // Drop only our known book canvases, after snapping. The original image reserves
      // the page's space and remains available to the source renderer on a return swipe.
      for(const i of resident){
        if(i>=low && i<=high)continue;
        const canvas=pages[i].querySelector('img[id^="album_photo_"] + canvas');
        if(canvas){
          const img=canvas.previousElementSibling;
          img.style.visibility='hidden';img.classList.remove('hide');
          canvas.remove();canvas.width=0;canvas.height=0;
        }
        resident.delete(i);
      }
      for(let i=low;i<=high;i++){
        if(imageWindow&&imageWindow.owns(i))continue;
        const img=pages[i].querySelector('img[id^="album_photo_"]');
        if(!img)continue;
        if(!img.nextElementSibling && realImage(img)){
          window.scramble_image(img,window.aid,window.scramble_id,false,window.speed);
        }
        if(img.nextElementSibling && img.nextElementSibling.tagName==='CANVAS')resident.add(i);
      }
      const counter=document.getElementById('nowpage');
      if(counter && mode!=='vertical')counter.value=String(first);
    }
    function schedule(){if(!paintFrame)paintFrame=requestAnimationFrame(paint);}
    slider.on('loaded.owl.lazy.jm2',event=>{
      const img=event.element && event.element[0],i=img && indices.get(img.closest('.owl-item'));
      if(i!=null && !(imageWindow&&imageWindow.owns(i))){resident.add(i);schedule();}
    });
    slider.on('dragged.owl.carousel.jm2 translated.owl.carousel.jm2',schedule);
    return schedule;
  }
  function settleOwl(){
    if(settleFrame)return;
    settleFrame=requestAnimationFrame(()=>{
      settleFrame=0;
      if(!ready || changing || mode==='vertical' || owl.is('dragging') || owl.is('animating'))return;
      const current=owl.relative(owl.current());
      report(current);
      if(schedulePaint)schedulePaint();
    });
  }
  function configure(next){
    mode=next;step=mode.startsWith('spread')?2:1;
    const rtl=mode.endsWith('rtl'),vertical=mode==='vertical';
    document.documentElement.classList.toggle('jm2-vertical',vertical && !!owl);
    root.classList.toggle('jm2-owl-vertical',vertical && !!owl);
    root.classList.toggle('jm2-owl-paged',!vertical && !!owl);
    if(owl){
      if(step===2 && count%2 && !blank){
        owl.add(window.jQuery('<div aria-hidden="true" class="jm2-blank"></div>'));blank=true;
      }else if(step===1 && blank){owl.remove(count);blank=false;}
      Object.assign(owl.options,{rtl,items:step,slideBy:step,loop:false,rewind:false,center:false,
        autoWidth:false,merge:false,stagePadding:0,margin:0,responsive:{},dots:false});
      root.classList.toggle(owl.options.rtlClass||'owl-rtl',rtl);
      owl.invalidate('settings');owl.refresh();
    }else{
      track.classList.toggle('jm2-track',!vertical);
      track.classList.toggle('jm2-rtl',rtl);
      // Chrome before 85 resolves RTL snap points at the wrong end; settle those tracks in script only.
      track.classList.toggle('jm2-nosnap',rtl && rtlScrollType()!=='negative');
      track.classList.toggle('jm2-spread',step===2);
      track.classList.toggle('jm2-pad',step===2 && count%2===1);
    }
  }
  function position(next,at){
    changing=true;
    try{
      if(frame){cancelAnimationFrame(frame);frame=0;}
      clearTimeout(scrollTimer);touching=false;
      configure(next);go(at);
    }finally{changing=false;}
    page=anchor(at);focus=clamp(at);report(page);
    if(schedulePaint)schedulePaint();
  }
  function setMode(next,request){
    if(restoring || !ready || !modes.includes(next)){send('jm2Mode',{ok:false,mode,request});return;}
    cancelSeek(true);stopAuto('mode');releaseAnchor();
    const previous=mode,at=focus;
    try{position(next,at);send('jm2Mode',{ok:true,mode,request});}
    catch(_){try{position(previous,at);}catch(ignore){}send('jm2Mode',{ok:false,mode,request});}
  }
  function boot(attempt){
    if(!findPages()){
      if(attempt<80){setTimeout(()=>boot(attempt+1),125);return;}
      if((mode==='vertical'||mode==='horizontal') && resumeNode(clamp(options.initial))){
        page=clamp(options.initial);imageWindow=installImageWindow();go(page);
        document.addEventListener('scroll',onScroll,{capture:true,passive:true});awaitDisplay();
      }else send('jm2Unavailable');
      return;
    }
    const style=document.createElement('style');
    style.textContent=`
      #photo-container .owl-item{box-sizing:border-box}
      #photo-container .jm2-image-pending{visibility:hidden!important}
      #photo-container img.jm2-image-slot:has(+canvas){display:none!important}
      #photo-container .jm2-image-slot.jm2-image-idle{display:inline-block!important;visibility:hidden!important;width:100%;width:min(100%,var(--jm2-image-width,100%));aspect-ratio:var(--jm2-image-ratio,2/3);height:auto}
      /* Divide Owl's stage itself into equal columns. Each stop uses the same
         coordinate system as its transform, even with fractional device pixels. */
      #photo-container.jm2-owl-paged .owl-stage{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);transition-property:transform!important}
      #photo-container.jm2-owl-paged .owl-stage::after{display:none}
      #photo-container.jm2-owl-paged{top:0!important;transform:none!important;height:100vh}
      #photo-container.jm2-owl-paged .owl-stage-outer,#photo-container.jm2-owl-paged .owl-stage,#photo-container.jm2-owl-paged .owl-item{height:100%}
      #photo-container.jm2-owl-paged .owl-item{display:flex;flex-direction:column;justify-content:center;width:100%!important;min-width:0}
      #photo-container .owl-item .scramble-page{width:100%!important;max-width:100%!important;text-align:center}
      #photo-container:not(.jm2-owl-vertical) .owl-item img,#photo-container:not(.jm2-owl-vertical) .owl-item canvas,.jm2-track img,.jm2-track canvas{max-width:100%!important;max-height:100vh!important;object-fit:contain}
      #photo-container .scramble-page canvas{width:auto!important;height:auto!important;max-width:100%!important}
      html.jm2-vertical{height:auto!important;overflow-y:auto!important;overflow-x:hidden!important}
      html.jm2-vertical body{height:auto!important;overflow:visible!important}
      #photo-container.jm2-owl-vertical{position:relative!important;top:auto!important;transform:none!important;direction:ltr}
      #photo-container.jm2-owl-vertical,#photo-container.jm2-owl-vertical .owl-stage-outer{height:auto!important;overflow:visible!important;touch-action:pan-y!important}
      #photo-container.jm2-owl-vertical .owl-stage{display:block!important;height:auto!important;width:100%!important;direction:ltr;transform:none!important;touch-action:pan-y!important}
      #photo-container.jm2-owl-vertical.owl-drag .owl-item,#photo-container.jm2-owl-vertical .owl-item{float:none!important;width:100%!important;height:auto!important;touch-action:pan-y pinch-zoom!important}
      #photo-container.jm2-owl-vertical img,#photo-container.jm2-owl-vertical canvas{max-width:100%!important;height:auto!important;max-height:none!important}
      .jm2-track{display:flex!important;flex-flow:row nowrap!important;width:100%!important;height:100vh!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory;scrollbar-width:none}
      .jm2-track::-webkit-scrollbar{display:none}.jm2-track.jm2-rtl{direction:rtl}.jm2-track.jm2-nosnap{scroll-snap-type:none!important}
      .jm2-track>.jm2-bookpage{flex:0 0 100%!important;box-sizing:border-box!important;min-width:0!important;margin:0!important;height:100%!important;scroll-snap-align:start;scroll-snap-stop:always;text-align:center}
      .jm2-track.jm2-spread>.jm2-bookpage{flex-basis:50%!important}
      .jm2-track.jm2-spread>.jm2-second{scroll-snap-align:none}
      .jm2-track.jm2-pad:after{content:'';flex:0 0 50%}
      .jm2-track>:not(.jm2-bookpage){display:none!important}`;
    document.head.appendChild(style);
    imageWindow=installImageWindow();
    if(owl){
      const closest=owl.closest;
      owl.closest=function(x,direction){
        const from=anchor(this.relative(this.current()));
        if(mode==='vertical')return from;
        const low=Math.max(0,from-step),high=Math.min(anchor(count-1),from+step);
        const to=closest.call(this,x,direction);
        if(to>=0 && to<count)return Math.max(low,Math.min(high,to));
        // Owl returns -1 for some exact RTL boundaries, then wraps it to the
        // last item. Resolve that boundary against the neighbouring stops.
        return [from,low,high].reduce((a,b)=>Math.abs(x-this.coordinates(b))<Math.abs(x-this.coordinates(a))?b:a);
      };
      if(imageWindow){owl.options.lazyLoadEager=0;owl.settings.lazyLoadEager=0;}
      schedulePaint=installCanvasWindow();
      slider.on('change.owl.carousel.jm2',event=>{
        if(changing || step!==2 || !event.property || event.property.name!=='position')return;
        const target=owl.relative(event.property.value),current=owl.relative(owl.current());
        if(target%2)event.data=anchor(target>current?target+1:target);
      });
      slider.on('changed.owl.carousel.jm2',event=>{
        if(mode!=='vertical' && event.property && event.property.name==='position')settleOwl();
      });
      slider.on('dragged.owl.carousel.jm2 translated.owl.carousel.jm2 refreshed.owl.carousel.jm2',settleOwl);
    }else{
      pages.forEach((node,i)=>{node.classList.add('jm2-bookpage');node.classList.toggle('jm2-second',i%2===1);});
      if('onscrollend' in track)track.addEventListener('scrollend',finishNativeScroll);
      else{
        track.addEventListener('touchstart',()=>{touching=true;touchFrom=trackOffset();clearTimeout(scrollTimer);},{passive:true});
        const released=()=>{touching=false;if(mode!=='vertical')afterScroll();};
        track.addEventListener('touchend',released,{passive:true});
        track.addEventListener('touchcancel',released,{passive:true});
      }
    }
    document.addEventListener('scroll',onScroll,{capture:true,passive:true});
    ready=true;position(mode,focus);awaitDisplay();
  }
  function setCache(value){
    if(!value || !Number.isInteger(value.keep) || value.keep<0 || value.keep>100 ||
         !Number.isInteger(value.ahead) || value.ahead<0 || value.ahead>20)return;
    cache=value;if(imageWindow)imageWindow.schedule();
  }
  function suspend(){
    suspended=true;stopAuto('hidden');cancelSeek(false);
    if(imageWindow)imageWindow.clear();
  }
  function resume(){suspended=false;if(imageWindow)imageWindow.schedule();}
  window.jm2Pager={go(n){if(!restoring){cancelSeek(true);stopAuto('manual');releaseAnchor();go(n);}},scrub,setMode,setAuto,setCache,suspend,resume,
    zipPage(i,ticket,ok){if(imageWindow)imageWindow.zipPage(i,ticket,ok);}};
  if(options.offline)document.addEventListener('click',()=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'imageClick'})));
  for(const type of ['pointerdown','touchstart','wheel','keydown'])window.addEventListener(type,()=>{if(scrubTarget!==null)cancelSeek(true);},{capture:true,passive:true});
  window.addEventListener('pagehide',suspend);
  window.addEventListener('pageshow',resume);
  prioritizeResume();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(1),{once:true});
  else boot(1);
}
