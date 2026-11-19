const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright-core');
const layout=fs.readFileSync(path.join(__dirname,'../src/reader-layout.js'),'utf8');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const files=[],held=new Set();
  const server=http.createServer((req,res)=>{
    if(req.url==='/slow-frame'){
      held.add(res);res.on('close',()=>held.delete(res));return;
    }
    if(req.url.startsWith('/image/')){
      files.push(Number(req.url.slice(7)));res.writeHead(200,{'Content-Type':'image/svg+xml','Cache-Control':'public,max-age=300'});
      res.end('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="200"><rect width="120" height="200" fill="green"/></svg>');return;
    }
    res.writeHead(200,{'Content-Type':'text/html'});res.end('<style>body{margin:0}section,img{height:500px;width:100%}</style><main id="photo-container">'+
      Array.from({length:400},(_,i)=>'<section class="scramble-page" id="page_'+i+'"><img id="album_photo_'+i+'" data-original="/image/'+i+'"></section>').join('')+
      '</main><img hidden src="/slow-frame"><script>const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.src=e.target.dataset.original;io.unobserve(e.target)}}));document.querySelectorAll("[data-original]").forEach(img=>io.observe(img));</script>');
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  try{
    for(const initial of [4,149,379]){
      files.length=0;
      const tab=await browser.newPage({viewport:{width:400,height:500}});
      await tab.addInitScript({content:'window.events=[];window.ReactNativeWebView={postMessage:s=>events.push(JSON.parse(s))};('+layout+')('+JSON.stringify({count:400,mode:'vertical',initial,session:4,cache:{keep:0,ahead:0}})+');'});
      await tab.goto('http://127.0.0.1:'+server.address().port+'/chapter',{waitUntil:'domcontentloaded'});
      await tab.waitForFunction(i=>events.some(e=>e.type==='jm2Ready' && e.page===i),initial,{timeout:4000});
      assert.equal(await tab.evaluate(()=>document.readyState),'interactive','blocked unrelated image should still be loading');
      assert(files.indexOf(initial)>=0 && files.indexOf(initial)<4,JSON.stringify(files));
      assert(files.every(i=>i<=1 || Math.abs(initial-i)<=1),'unexpected intervening page requested: '+files);
      assert.equal(files.filter(i=>i===initial).length,1,'duplicate target transfer');
      console.log('Page',initial+1,'of 400 ready in',Math.round(await tab.evaluate(()=>performance.now())),'ms; requested page numbers',files.map(i=>i+1));
      if(initial===4){
        await tab.evaluate(()=>{jm2Pager.setCache({keep:0,ahead:0});jm2Pager.scrub(24,true,1);});
        await tab.waitForFunction(()=>events.some(e=>e.type==='jm2Page' && e.page===24) && !document.querySelector('#album_photo_4').getAttribute('src'));
        await tab.evaluate(()=>jm2Pager.scrub(4,true,2));
        await tab.waitForFunction(()=>{
          const img=document.querySelector('#album_photo_4');
          return img.getAttribute('src') && img.complete && img.naturalWidth && events.filter(e=>e.type==='jm2Page').at(-1).page===4;
        });
        assert.equal(files.filter(i=>i===4).length,1,'returning 20 pages should reuse the HTTP-cached image');
      }
      await tab.close();
    }
  }finally{for(const res of held)res.destroy();server.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
