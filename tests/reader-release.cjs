const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const layout=fs.readFileSync(path.join(__dirname,'../src/reader-layout.js'),'utf8');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:640,height:480},hasTouch:true,isMobile:true});
    const touch=await page.context().newCDPSession(page);
    async function gesture(x1,x2){
      const send=(type,x)=>touch.send('Input.dispatchTouchEvent',{type,touchPoints:x==null?[]:[{x,y:210}]});
      await send('touchStart',x1);
      for(let i=1;i<=8;i++){await send('touchMove',x1+(x2-x1)*i/8);await page.waitForTimeout(12);}
      await send('touchEnd');
    }
    for(const mode of ['horizontal','rtl','spread-ltr','spread-rtl']){
      await page.goto('about:blank');
      const rows=Array.from({length:11},(_,i)=>'<div class="scramble-page" id="page_'+i+'"><img id="album_photo_'+i+'"></div>');
      await page.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}.hide{display:none!important}</style><div id="photo-container" class="owl-carousel">'+rows.join('')+'</div>');
      await page.addScriptTag({path:require.resolve('jquery')});await page.addScriptTag({path:require.resolve('owl.carousel')});
      await page.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
      await page.evaluate(async()=>{
        window.aid=101;window.scramble_id=1;window.speed='';window.events=[];window.unrelated=0;window.draws=0;
        window.ReactNativeWebView={postMessage:text=>events.push(JSON.parse(text))};
        const pixel=document.createElement('canvas');pixel.width=pixel.height=10;
        const uri=pixel.toDataURL();await Promise.all(Array.from(document.images,img=>{img.src=uri;return img.decode();}));
        window.scramble_image=img=>{
          let canvas=img.nextElementSibling;if(!canvas){canvas=document.createElement('canvas');img.after(canvas);}
          draws++;canvas.width=160;canvas.height=120;canvas.style.width='100%';
          canvas.getContext('2d').fillRect(0,0,160,120);img.classList.add('hide');
        };
        const slider=$('#photo-container');
        // The upstream template discards inactive canvases in dragged, while the stage is moving.
        slider.on('dragged.owl.carousel',()=>{
          document.querySelectorAll('.owl-item').forEach(item=>{
            if(!$(item).hasClass('active'))$(item).find('canvas').remove();
            else scramble_image(item.querySelector('img'),aid,scramble_id,false,speed);
          });
        });
        slider.on('dragged.owl.carousel',()=>unrelated++);
        slider.owlCarousel({items:1,smartSpeed:300,dots:false});
        Array.from(document.images).slice(0,6).forEach(img=>scramble_image(img));
      });
      await page.addScriptTag({content:'('+layout+')('+JSON.stringify({mode,count:11,initial:0,session:1})+')'});
      await page.waitForFunction(()=>events.some(e=>e.type==='jm2Ready'));
      const rtl=mode.endsWith('rtl'),step=mode.startsWith('spread')?2:1;
      await page.evaluate(()=>{window.first=document.querySelector('#page_0 canvas');window.visibleMissing=0;
        window.sample=()=>{for(const cell of document.querySelectorAll('.owl-item')){
          const r=cell.getBoundingClientRect();if(Math.min(innerWidth,r.right)-Math.max(0,r.left)>3 &&
            cell.querySelector('img.hide') && !cell.querySelector('canvas'))visibleMissing++;
        }requestAnimationFrame(sample);};sample();});
      const from=rtl?90:550,to=rtl?550:90;
      await gesture(from,to);await page.waitForTimeout(360);await gesture(to,from);await page.waitForTimeout(360);
      const observed=await page.evaluate(()=>({missing:visibleMissing,kept:first===document.querySelector('#page_0 canvas'),
        pages:events.filter(x=>x.type==='jm2Page').map(x=>x.page),dragged:unrelated}));
      assert.equal(observed.missing,0,mode+' visible frames without drawn pages');
      assert(observed.kept,mode+' immediately preceding page was redrawn');
      assert.deepEqual(observed.pages,[0,step,0]);assert.equal(observed.dragged,2);
      for(const target of [6,10,0]){
        await page.evaluate(n=>jm2Pager.go(n),target);await page.waitForTimeout(80);
        const size=await page.evaluate(n=>({count:document.querySelectorAll('.owl-item canvas').length,
          drawn:!!document.querySelector('#page_'+n+' canvas')}),target);
        assert(size.drawn);assert(size.count<=3*step);
      }
      await gesture(from,to);await gesture(to,from);await page.waitForTimeout(360);
      assert.equal(await page.evaluate(()=>visibleMissing),0,mode+' interrupted settling animation');
    }
    // Some chapters initialize Owl on DOM-ready after WebView injects our adapter.
    await page.goto('about:blank');
    await page.setContent('<div id="photo-container" class="owl-carousel"><div id="page_0"><canvas></canvas></div><div id="page_1"><canvas></canvas></div></div>');
    await page.addScriptTag({path:require.resolve('jquery')});await page.addScriptTag({path:require.resolve('owl.carousel')});
    await page.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
    await page.evaluate(()=>{window.events=[];window.ReactNativeWebView={postMessage:m=>events.push(JSON.parse(m))};});
    await page.addScriptTag({content:'('+layout+')({mode:"rtl",count:2,session:2,initial:0})'});
    assert.equal(await page.locator('.jm2-track').count(),0);
    await page.evaluate(()=>$('#photo-container').owlCarousel({items:1}));
    await page.waitForFunction(()=>events.some(e=>e.type==='jm2Ready'));
    assert(await page.locator('.owl-stage-outer').isVisible());
    // A vertical source switched to horizontal uses native scroll snapping. Holding
    // the drag past halfway must not commit a page that the finger can still take back.
    await page.goto('about:blank');
    await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0}</style>'+
      '<div id="photo-container"><div id="page_0"><canvas></canvas></div><div id="page_1"><canvas></canvas></div><div id="page_2"><canvas></canvas></div></div>');
    await page.evaluate(()=>{window.events=[];window.ReactNativeWebView={postMessage:m=>events.push(JSON.parse(m))};});
    await page.addScriptTag({content:'('+layout+')({mode:"vertical",count:3,session:3,initial:0});'});
    await page.waitForFunction(()=>events.some(e=>e.type==='jm2Ready'));
    await page.evaluate(()=>jm2Pager.setMode('horizontal',1));
    const move=(type,x)=>touch.send('Input.dispatchTouchEvent',{type,touchPoints:x==null?[]:[{x,y:200}]});
    await move('touchStart',590);
    for(const x of [500,400,300,200,100])await move('touchMove',x);
    await page.waitForTimeout(180);
    assert(await page.locator('.jm2-track').evaluate(node=>node.scrollLeft>node.clientWidth/2));
    assert.deepEqual(await page.evaluate(()=>events.filter(e=>e.type==='jm2Page').map(e=>e.page)),[0]);
    for(const x of [200,300,400,500,580])await move('touchMove',x);
    await move('touchEnd');await page.waitForTimeout(500);
    assert.deepEqual(await page.evaluate(()=>events.filter(e=>e.type==='jm2Page').map(e=>e.page)),[0]);
    await gesture(550,80);await page.waitForFunction(()=>events.some(e=>e.type==='jm2Page' && e.page===1));
    console.log('Touch release, reverse swipe, neighbouring canvas identity, and bounded canvas retention passed in four modes.');
  }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
