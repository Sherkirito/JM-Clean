const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright-core');
const layout=fs.readFileSync(path.join(__dirname,'../src/reader-layout.js'),'utf8');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const tab=await browser.newPage({viewport:{width:400,height:500}});
    for(const mode of ['vertical','horizontal','rtl','spread-ltr','spread-rtl']){
      const step=mode.startsWith('spread')?2:1;
      await tab.goto('about:blank');
      await tab.setContent('<style>body{margin:0}.scramble-page{height:500px}canvas{width:100%;height:100%}</style>'+
        '<main id="photo-container">'+Array.from({length:5},(_,i)=>'<div class="scramble-page" id="page_'+i+'"><canvas></canvas></div>').join('')+'</main>');
      if(mode!=='vertical'){
        await tab.addScriptTag({path:require.resolve('jquery')});await tab.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
        await tab.addScriptTag({path:require.resolve('owl.carousel')});await tab.evaluate(()=>$('#photo-container').addClass('owl-carousel').owlCarousel({items:1,dots:false}));
      }
      await tab.evaluate(()=>{window.events=[];window.ReactNativeWebView={postMessage:s=>events.push({...JSON.parse(s),time:performance.now()})};});
      await tab.addScriptTag({content:'('+layout+')('+JSON.stringify({mode,initial:0,count:5,session:21})+')'});
      await tab.waitForFunction(()=>events.some(x=>x.type==='jm2Ready'));
      // The next screen must receive its complete reading interval after the picture arrives.
      const delayed=step===2?3:1;
      await tab.evaluate(i=>{document.querySelector('#page_'+i+' canvas').style.visibility='hidden';jm2Pager.setAuto(2,1);},delayed);
      await tab.waitForTimeout(3100);
      assert.deepEqual(await tab.evaluate(()=>events.filter(x=>x.type==='jm2Page').map(x=>x.page)),[0],mode+' recorded invisible page');
      const revealed=await tab.evaluate(i=>{document.querySelector('#page_'+i+' canvas').style.visibility='visible';return performance.now();},delayed);
      await tab.waitForFunction(i=>events.some(x=>x.type==='jm2Page'&&x.page===i),step);
      await tab.waitForFunction(i=>events.some(x=>x.type==='jm2Page'&&x.page===i),2*step);
      const turned=await tab.evaluate(i=>events.find(x=>x.type==='jm2Page'&&x.page===i).time,2*step);
      assert(turned-revealed>=1990,mode+' counted loading time as reading time');
      await tab.evaluate(()=>{jm2Pager.go(0);jm2Pager.setAuto(2,4);});
      await tab.evaluate(()=>window.dispatchEvent(new Event('pointerdown')));
      await tab.waitForTimeout(2150);
      assert.equal(await tab.evaluate(()=>events.filter(x=>x.type==='jm2Page').at(-1).page),0);
      await tab.evaluate(step=>{jm2Pager.go(4-step);jm2Pager.setAuto(2,2);},step);
      await tab.waitForFunction(()=>events.some(x=>x.type==='jm2Auto' && x.reason==='end' && x.request===2));
      assert.equal(await tab.evaluate(()=>events.filter(x=>x.type==='jm2Page').at(-1).page),4);
      if(mode==='vertical'){
        await tab.evaluate(()=>{document.getElementById('page_4').style.height='1700px';jm2Pager.go(4);jm2Pager.setAuto(2,3);});
        await tab.waitForTimeout(2200);
        assert(await tab.evaluate(()=>{const r=document.getElementById('page_4').getBoundingClientRect();return r.top<0 && r.bottom>innerHeight;}));
        await tab.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
        assert.equal(await tab.evaluate(()=>events.filter(x=>x.type==='jm2Auto').at(-1).reason),'hidden');
      }
    }
    console.log('Five timed modes: wait for visible media, tap to pause, correct direction, tall final image, background and chapter end passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
