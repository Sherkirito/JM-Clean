const fs=require('fs'), assert=require('assert'),{chromium}=require('playwright-core');
(async function(){
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage({viewport:{width:720,height:600}}),source=fs.readFileSync(require('node:path').join(__dirname,'../src/reader-layout.js'),'utf8');
 const {readerScript}=require('./language.cjs');
 await page.setContent('<html lang="zh-TW"><body><span>閱讀進度</span><a href="/連結">連結</a><textarea>帳號</textarea><code>繁體[測試]</code></body></html>');
 await page.addScriptTag({content:readerScript()});
 assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
 assert.equal(await page.locator('span').innerText(),'阅读进度');
 await page.locator('span').evaluate(span=>{span.textContent='我的の漫畫';});
 await page.waitForFunction(()=>document.querySelector('span').textContent==='我的の漫画');
 assert.equal(await page.locator('a').getAttribute('href'),'/連結');
 assert.equal(await page.locator('textarea').inputValue(),'帳號');
 assert.equal(await page.locator('code').innerText(),'繁體[測試]');
 await page.evaluate(()=>{const hint=document.createElement('button');hint.textContent='請重試';hint.title='圖片';document.body.append(hint);});
 await page.waitForFunction(()=>document.querySelector('button').textContent==='请重试' && document.querySelector('button').title==='图片');
 for(const mode of ['vertical','horizontal','rtl','spread-ltr','spread-rtl'])for(const count of [1,2,5,6]){
  await page.goto('about:blank'); const paged=mode!=='vertical',spread=mode.startsWith('spread'),rtl=mode.endsWith('rtl');
  let slides=Array.from({length:count},(_,i)=>'<div class="scramble-page" id="page_'+i+'" style="height:570px"><canvas width="60" height="60"></canvas><span>PAGE '+(i+1)+'</span></div>');
  if(paged)slides.splice(1,0,'<div class="ad-body">placeholder</div>');
  await page.setContent('<style>body{margin:0}</style><main id="photo-container" class="'+(paged?'owl-carousel':'')+'">'+slides.join('')+'</main>');
  await page.addScriptTag({path:require.resolve('jquery')});
  await page.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
  await page.addScriptTag({path:require.resolve('owl.carousel')});
  await page.evaluate(paged=>{window.events=[];window.ReactNativeWebView={postMessage:m=>events.push(JSON.parse(m))};if(paged)window.jQuery('#photo-container').owlCarousel({items:1,loop:false,dots:false});},paged);
  await page.addScriptTag({content:'('+source+')('+JSON.stringify({mode,count,session:42,initial:0})+');'});
  await page.waitForFunction(()=>events.some(m=>m.type==='jm2Ready'));
  if(paged){
   const geometry=await page.evaluate(()=>{let s=$('#photo-container').data('owl.carousel');return s.items().slice(0,2).map(x=>[x[0].offsetWidth,x[0].getBoundingClientRect().x]);});
   assert(Math.abs(geometry[0][0]-(spread?360:720))<2,mode+' width');
   if(geometry.length===2)assert(rtl ? geometry[0][1]>geometry[1][1]:geometry[0][1]<geometry[1][1],mode+' direction');
  }
  await page.evaluate(n=>jm2Pager.go(n),count+20);
  let value=await page.evaluate(()=>events.filter(m=>m.type==='jm2Page').at(-1).page);assert.equal(value,spread?((count-1)>>1)*2:count-1);
  if(paged && count>=5){
   await page.evaluate(()=>jm2Pager.go(0));const from=rtl?160:550,to=rtl?550:160;
   await page.mouse.move(from,260);await page.mouse.down();await page.mouse.move(to,260,{steps:10});await page.mouse.up();
   await page.waitForTimeout(380);
   assert.equal(await page.evaluate(()=>events.filter(m=>m.type==='jm2Page').at(-1).page),spread?2:1,mode+' next swipe');
   await page.mouse.move(to,260);await page.mouse.down();await page.mouse.move(from,260,{steps:10});await page.mouse.up();await page.waitForTimeout(380);
   assert.equal(await page.evaluate(()=>events.filter(m=>m.type==='jm2Page').at(-1).page),0,mode+' prev swipe');
  }
  if(count===5){
   const at=spread?2:3;
   await page.evaluate(n=>{
     jm2Pager.go(n);window.originalPage=document.getElementById('page_'+n);
     window.originalDocument=document;window.originalPage.dataset.loaded='1';
   },at);
   for(const next of ['rtl','spread-rtl','spread-ltr','horizontal','vertical','rtl']){
    const result=await page.evaluate(next=>{
      jm2Pager.setMode(next,7);
      const node=window.originalPage,box=node.getBoundingClientRect();
      return {same:window.originalDocument===document && node===document.getElementById(node.id) && node.dataset.loaded==='1',
        event:events.filter(m=>m.type==='jm2Mode').at(-1),x:box.left,y:box.top,w:box.width};
    },next);
    assert(result.same && result.event.ok,next);assert.equal(result.event.mode,next);
    assert.equal(result.event.page,next.startsWith('spread')?at-at%2:at,next+' kept page');
    assert(result.x>=-2 && result.x<720 && result.y<600 && result.y>=-2,JSON.stringify({mode,next,result}));
    await page.waitForTimeout(45);
   }
  }
 }
 console.log('20 combinations: directions, spread widths, order, jumps, first/last and swipes passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

