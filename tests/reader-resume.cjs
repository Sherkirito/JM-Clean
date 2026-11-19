const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright-core');
const source=fs.readFileSync(path.join(__dirname,'../src/reader-layout.js'),'utf8');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const tab=await browser.newPage({viewport:{width:600,height:520}});
    for(const mode of ['vertical','horizontal','rtl','spread-ltr','spread-rtl']){
      const spread=mode.startsWith('spread'),initial=5,first=spread?4:5,count=9;
      await tab.goto('about:blank');
      const rows=Array.from({length:count},(_,i)=>'<section class="scramble-page" id="page_'+i+'"><img id="album_photo_'+i+'"></section>');
      await tab.setContent('<style>body{margin:0}section{height:600px}img{width:100%;height:100%}</style><main id="photo-container">'+rows.join('')+'</main>');
      await tab.evaluate(()=>{
        const svg=c=>'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="60"><rect width="40" height="60" fill="'+c+'"/></svg>');
        for(const img of document.images){img.dataset.original=svg('green');img.src=svg('gray');}
        window.events=[];window.ReactNativeWebView={postMessage:m=>events.push(JSON.parse(m))};
      });
      if(mode==='rtl'||mode==='spread-rtl'){
        await tab.addScriptTag({path:require.resolve('jquery')});
        await tab.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
        await tab.addScriptTag({path:require.resolve('owl.carousel')});
        await tab.evaluate(()=>$('#photo-container').addClass('owl-carousel').owlCarousel({items:1,dots:false}));
      }
      await tab.addScriptTag({content:'('+source+')('+JSON.stringify({count,mode,initial,session:3})+')'});
      await tab.waitForTimeout(130);
      assert.deepEqual(await tab.evaluate(()=>events),[],mode+' accepted a placeholder as a restored page');
      await tab.evaluate(()=>{jm2Pager.go(0);window.scrollTo(0,0);});
      if(spread){
        await tab.evaluate(i=>{const img=document.images[i];img.src=img.dataset.original;},first);
        await tab.waitForTimeout(200);
        assert.deepEqual(await tab.evaluate(()=>events),[],mode+' accepted an incomplete spread');
      }
      await tab.evaluate(i=>{
        const img=document.images[i],decode=img.decode.bind(img);
        img.decode=()=>new Promise(resolve=>{window.allowDecode=()=>resolve(decode());});
        img.src=img.dataset.original;
      },initial);
      await tab.waitForFunction(()=>!!window.allowDecode,null,{timeout:3500});
      assert.deepEqual(await tab.evaluate(()=>events),[],mode+' unlocked before the saved image decoded');
      await tab.evaluate(()=>allowDecode());
      await tab.waitForFunction(()=>events.some(m=>m.type==='jm2Ready'),null,{timeout:3500});
      const ready=await tab.evaluate(()=>events.find(m=>m.type==='jm2Ready'));
      assert.equal(ready.page,first);
      if(mode==='vertical'){
        await tab.evaluate(()=>{document.documentElement.style.overflowAnchor='none';document.querySelector('section').style.height='950px';});
        await tab.waitForTimeout(200);
        assert(Math.abs(await tab.locator('#page_5').evaluate(el=>el.getBoundingClientRect().top))<2,'late reflow moved restored page');
      }
      assert.deepEqual(await tab.evaluate(()=>events.filter(e=>e.type==='jm2Page').map(e=>e.page)),[first]);
      await tab.evaluate(target=>jm2Pager.go(target),spread?6:7);
      assert.equal(await tab.evaluate(()=>events.filter(e=>e.type==='jm2Page').at(-1).page),spread?6:7);
    }
    console.log('Resume on a slow image, both halves of a spread, late reflow and first deliberate turn passed in five modes.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
