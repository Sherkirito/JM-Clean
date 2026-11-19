const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright-core');
const layout=fs.readFileSync(path.join(__dirname,'../src/reader-layout.js'),'utf8');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const tab=await browser.newPage({viewport:{width:360,height:792},deviceScaleFactor:3.5});
    for(const [mode,initial,count,rounding] of [
      ['rtl',28,51,.085],['horizontal',28,51,.12],['spread-rtl',29,51,.15],
      ['spread-ltr',50,51,.15],['rtl',612,615,.4]
    ]){
      const step=mode.startsWith('spread')?2:1,at=initial-initial%step;
      await tab.goto('about:blank');
      // Reproduce Owl's nominal stride disagreeing with the width painted by WebView.
      const pages=Array.from({length:count},(_,i)=>'<div id="page_'+i+'"><canvas width="8" height="8"></canvas></div>');
      await tab.setContent('<style>body{margin:0}.jm2-owl-paged .owl-item{width:'+(360/step-rounding)+'px!important}</style><main class="owl-carousel" id="photo-container">'+pages.join('')+'</main>');
      await tab.addScriptTag({path:require.resolve('jquery')});
      await tab.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
      await tab.addScriptTag({path:require.resolve('owl.carousel')});
      await tab.evaluate(()=>{window.events=[];window.ReactNativeWebView={postMessage:s=>events.push(JSON.parse(s))};$('#photo-container').owlCarousel({items:1,dots:false});});
      await tab.addScriptTag({content:'('+layout+')('+JSON.stringify({count,mode,initial,session:28})+')'});
      await tab.waitForFunction(at=>events.some(e=>e.type==='jm2Ready'&&e.page===at),at,{timeout:2400});
      const rect=await tab.locator('#page_'+at).evaluate(el=>el.closest('.owl-item').getBoundingClientRect().toJSON());
      const left=mode.endsWith('rtl')?360-360/step:0;
      assert(Math.abs(rect.left-left)<2,JSON.stringify({mode,at,left,rect}));
      if(initial===28){
        await tab.evaluate(()=>jm2Pager.setAuto(2,2));
        await tab.waitForFunction(()=>events.some(e=>e.type==='jm2Page'&&e.page===29),null,{timeout:3500});
        await tab.evaluate(()=>jm2Pager.setAuto(0,3));
      }
    }
    console.log('Fractional carousel widths: page 29, both directions, both spreads, odd last page, automatic turns and page 613 passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
