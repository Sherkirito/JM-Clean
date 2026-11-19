const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const layout=fs.readFileSync(path.join(__dirname,'../src/reader-layout.js'),'utf8');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    for(const mode of ['vertical','rtl','horizontal','spread-rtl','spread-ltr']){
      const tab=await browser.newPage({viewport:{width:480,height:600}}),spread=mode.startsWith('spread'),step=spread?2:1;
      const attempts=[],pending=new Map(),slow=spread?17:16;
      await tab.route('https://reader.test/image/*',async route=>{
        const i=Number(route.request().url().split('/').at(-1));attempts.push(i);
        if(i===slow || i===22){await new Promise(resolve=>pending.set(i,resolve));}
        await route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="120"><rect width="96" height="120" fill="green"/></svg>'}).catch(()=>{});
      });
      const rows=Array.from({length:35},(_,i)=>'<section id="page_'+i+'" class="scramble-page"><img class="lazy_img" id="album_photo_'+i+'" data-original="https://reader.test/image/'+i+'"></section>');
      await tab.setContent('<style>body{margin:0}section{height:600px}img{width:100%;height:100%}</style><main id="photo-container">'+rows.join('')+'</main>');
      if(mode!=='vertical'){
        await tab.addScriptTag({path:require.resolve('jquery')});
        await tab.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
        await tab.addScriptTag({path:require.resolve('owl.carousel')});
        await tab.evaluate(()=>$('#photo-container').addClass('owl-carousel').owlCarousel({items:1,dots:false}));
      }
      await tab.evaluate(()=>{window.events=[];window.ReactNativeWebView={postMessage:s=>events.push(JSON.parse(s))};});
      await tab.addScriptTag({content:'('+layout+')('+JSON.stringify({mode,initial:4,count:35,session:31,cache:{keep:2,ahead:3}})+')'});
      async function loaded(ids){
        await tab.waitForFunction(expected=>{
          const live=[...document.images].filter(img=>img.getAttribute('src')&&img.complete&&img.naturalWidth).map(img=>Number(img.id.slice(12)));
          return JSON.stringify(live)===JSON.stringify(expected);
        },ids,{timeout:3800});
      }
      await tab.waitForFunction(()=>events.some(e=>e.type==='jm2Ready'));
      const range=(start,end)=>Array.from({length:end-start+1},(_,n)=>n+start);
      await loaded(range(4,4+step+2));
      assert(attempts.every(i=>i>=4 && i<=4+step+2),mode+' loaded outside the configured window');
      await tab.evaluate(()=>jm2Pager.go(10));
      await loaded([...range(4,4+step-1),...range(10,10+step+2)]);
      await tab.evaluate(()=>{jm2Pager.setCache({keep:0,ahead:0});});
      await loaded(range(10,10+step-1));
      await tab.evaluate(()=>{jm2Pager.scrub(20,false,1);});
      await loaded(range(20,20+step-1));
      assert((await tab.locator('#page_20').boundingBox()).x<480);
      assert.equal(await tab.evaluate(()=>events.some(e=>e.type==='jm2Page'&&e.page===20)),false);
      await tab.evaluate(()=>jm2Pager.scrub(16,true,2));
      await tab.waitForTimeout(120);
      assert(pending.has(slow));assert(await tab.evaluate(()=>events.some(e=>e.type==='jm2Page' && e.page===16)));
      assert(await tab.locator('#page_16').evaluate(node=>{
        const r=node.getBoundingClientRect();return r.right>0 && r.left<innerWidth && r.bottom>0 && r.top<innerHeight;
      }),mode+' did not move to the selected page before the image loaded');
      pending.get(slow)();
      await loaded(range(16,16+step-1));
      await tab.waitForFunction(()=>events.some(e=>e.type==='jm2Page'&&e.page===16));
      await tab.evaluate(()=>jm2Pager.scrub(22,false,3));await tab.waitForTimeout(130);
      assert(pending.has(22));
      await tab.evaluate(()=>jm2Pager.scrub(8,true,4));
      await loaded(range(8,8+step-1));pending.get(22)();await tab.waitForTimeout(160);
      assert.equal(await tab.evaluate(()=>events.filter(e=>e.type==='jm2Page').at(-1).page),8);
      assert(await tab.locator('#page_8').evaluate(node=>{const r=node.getBoundingClientRect();return r.right>0 && r.left<innerWidth && r.bottom>0 && r.top<innerHeight;}),mode+' late image moved the viewport');
      await tab.evaluate(()=>jm2Pager.suspend());await loaded([]);
      await tab.evaluate(()=>jm2Pager.resume());await loaded(range(8,8+step-1));
      if(mode==='horizontal'){
        await tab.evaluate(()=>jm2Pager.setCache({keep:12,ahead:4}));
        for(let i=0;i<=8;i++){
          await tab.evaluate(n=>jm2Pager.go(n),i);
          await tab.waitForFunction(n=>document.images[n].complete && document.images[n].naturalWidth>0,i);
        }
        const positions=await tab.evaluate(async()=>{
          const frame=()=>new Promise(requestAnimationFrame),seen=new Set();
          for(let i=7;i>=0;i--){
            jm2Pager.scrub(i,false,27-i);
            await frame();
            const shown=document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('.scramble-page');
            if(shown)seen.add(shown.id);
          }
          jm2Pager.scrub(0,true,30);
          jm2Pager.scrub(7,false,26);
          const last=events.filter(e=>e.type==='jm2Page').at(-1);
          if(last.page!==0 || !document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('#page_0'))throw Error('stale drag moved the settled page');
          return seen.size;
        });
        assert(positions>=6,'cached pages failed to keep up with successive frames: '+positions);
      }
      await tab.close();console.log('PASS',mode);
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
