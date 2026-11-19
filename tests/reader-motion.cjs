const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path');
const {chromium}=require('playwright-core');
const layout=fs.readFileSync(path.join(__dirname,'../src/reader-layout.js'),'utf8');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    for(const mode of ['rtl','horizontal','spread-rtl','spread-ltr','vertical']){
      const tab=await browser.newPage({viewport:{width:400,height:600},hasTouch:true,isMobile:true});
      const initial=8,count=23,step=mode.startsWith('spread')?2:1;
      const slides=Array.from({length:count},(_,i)=>'<div class="scramble-page" id="page_'+i+'"><canvas width="640" height="820" style="width:200px;display:block;margin:auto"></canvas></div>');
      await tab.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}#container{overflow:hidden}.owl-carousel{position:absolute!important;top:50%;transform:translateY(-50%)}.owl-carousel.owl-drag .owl-item{touch-action:manipulation!important}</style><div id="container"><main class="owl-carousel" id="photo-container">'+slides.join('')+'</main></div>');
      await tab.addScriptTag({path:require.resolve('jquery')});
      await tab.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
      await tab.addScriptTag({path:require.resolve('owl.carousel')});
      await tab.evaluate(()=>{
        window.events=[];window.ReactNativeWebView={postMessage:s=>events.push(JSON.parse(s))};
        $('#photo-container').owlCarousel({items:1,smartSpeed:260,dots:false});
      });
      await tab.addScriptTag({content:'('+layout+')('+JSON.stringify({mode,count,initial,session:1})+')'});
      await tab.waitForFunction(()=>events.some(e=>e.type==='jm2Ready'),null,{timeout:4000});
      if(mode==='vertical'){
        // Accessibility and compositor scrolls can start without a touchmove in the page.
        await tab.evaluate(()=>{window.scrollBy(0,780);document.querySelector('canvas').dispatchEvent(new Event('load'));});
        await tab.waitForTimeout(300);
        assert(await tab.locator('#page_8').evaluate(el=>el.getBoundingClientRect().bottom<0),'restore pulled the strip back');
        await tab.evaluate(()=>{jm2Pager.scrub(6,true,1);window.scrollBy(0,720);});
        await tab.waitForTimeout(250);
        assert(await tab.evaluate(()=>events.filter(e=>e.type==='jm2Page').at(-1).page>6),'completed seek locked strip progress');
      }else{
        const touch=await tab.context().newCDPSession(tab);
        await tab.evaluate(()=>{
          const owl=$('#photo-container').data('owl.carousel'),is=owl.is.bind(owl);
          // On the device Owl has already left "animating" while WebView is still
          // compositing its transform. Check the movement itself, not just the last frame.
          owl.is=name=>name==='animating'?false:is(name);
        });
        for(const sign of [1,-1]){
          const start=sign===1?initial:initial+step,end=start+sign*step;
          await tab.evaluate(i=>{
            const cell=document.querySelector('#page_'+i).closest('.owl-item');
            window.samples=[];
            function sample(){samples.push(cell.getBoundingClientRect().left);window.sampling=requestAnimationFrame(sample);}
            sample();
          },start);
          const direction=(mode.endsWith('rtl')?1:-1)*sign;
          const move=(type,x)=>touch.send('Input.dispatchTouchEvent',{type,touchPoints:x==null?[]:[{x,y:300}]});
          await move('touchStart',200);
          for(const dx of [12,28,44,60,78]){await move('touchMove',200+direction*dx);await tab.waitForTimeout(12);}
          await move('touchEnd');
          await tab.waitForTimeout(620);
          const state=await tab.evaluate(()=>{cancelAnimationFrame(sampling);return {samples,pages:events.filter(e=>e.type==='jm2Page').map(e=>e.page)};});
          const distances=state.samples.map(x=>(x-state.samples[0])*direction);
          assert.equal(state.pages.at(-1),end,mode+' wrong destination');
          assert(Math.max(...distances)<=402,mode+' overshot the page by '+Math.round(Math.max(...distances)-400)+'px');
          assert(distances.every((d,i)=>!i||d>=distances[i-1]-2),mode+' reversed without a gesture');
        }
        if(step===2){
          const width=()=>tab.locator('#page_8 canvas').evaluate(c=>c.getBoundingClientRect().width);
          assert.equal(await width(),200);
          await tab.evaluate(mode=>jm2Pager.setMode(mode,2),mode.endsWith('rtl')?'rtl':'horizontal');
          assert.equal(await width(),400,'canvas kept the width used when it was drawn in a spread');
          await tab.evaluate(mode=>jm2Pager.setMode(mode,3),mode);
          assert.equal(await width(),200);
        }
      }
      console.log('PASS',mode);await tab.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
