const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright-core');

(async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'jm-local-reader-'));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const layout=await fs.readFile(path.join(__dirname,'../src/reader-layout.js'),'utf8');
    const count=10,rows=[];
    for(let i=0;i<count;i++){
      rows.push('<section class="scramble-page" id="page_'+i+'"><img id="album_photo_'+i+'" data-original="p'+i+'.jpg"></section>');
      const image='<svg xmlns="http://www.w3.org/2000/svg" width="260" height="320"><rect width="260" height="320" fill="blue"/></svg>';
      // Write genuine PNG bytes into the same extension-neutral slots as the Android reader.
      if(i===0){
        const draw=await browser.newPage({viewport:{width:260,height:320}});
        await draw.setContent(image);await draw.screenshot({path:path.join(dir,'sample.png')});await draw.close();
      }
      await fs.copyFile(path.join(dir,'sample.png'),path.join(dir,'p'+i+'.jpg'));
    }
    await fs.writeFile(path.join(dir,'index.html'),'<meta name="viewport" content="width=device-width"><style>body{margin:0}section{text-align:center}img{max-width:100%}</style><main id="photo-container">'+rows.join('')+'</main>');
    for(const mode of ['vertical','horizontal','rtl','spread-ltr','spread-rtl']){
      const tab=await browser.newPage({viewport:{width:440,height:640}}),spread=mode.startsWith('spread'),target=spread?8:9;
      await tab.goto(pathToFileURL(path.join(dir,'index.html')).href);
      await tab.evaluate(()=>{
        window.events=[];window.resident=new Set();
        window.ReactNativeWebView={postMessage(raw){
          const msg=JSON.parse(raw);events.push(msg);
          if(msg.type==='jm2ZipPage'){
            resident.add(msg.index);
            const finish=()=>jm2Pager.zipPage(msg.index,msg.ticket,true);
            if(window.holdReads)window.holdReads.push(finish);else setTimeout(finish,10);
          }else if(msg.type==='jm2ZipDrop')resident.delete(msg.index);
        }};
      });
      await tab.evaluate('('+layout+')('+JSON.stringify({offline:true,count,mode,initial:4,session:7,cache:{keep:0,ahead:0}})+')');
      await tab.waitForFunction(()=>events.some(e=>e.type==='jm2Ready'&&e.page===4));
      await tab.evaluate(n=>jm2Pager.scrub(n,true,1),target);
      await tab.waitForFunction(n=>events.some(e=>e.type==='jm2Page'&&e.page===n),target,{timeout:4000});
      await tab.waitForTimeout(220);
      assert.equal(await tab.evaluate(()=>events.filter(e=>e.type==='jm2Page').at(-1).page),target,mode);
      await tab.evaluate(()=>jm2Pager.scrub(0,true,2));
      await tab.waitForFunction(()=>events.some(e=>e.type==='jm2Page'&&e.page===0),null,{timeout:4000});
      assert(!(await tab.evaluate(()=>events.some(e=>e.type==='jm2ZipError'))));
      if(mode==='horizontal'){
        await tab.evaluate(async()=>{
          window.holdReads=[];
          for(let target=2;target<=9;target++){
            jm2Pager.scrub(target,target===9,10+target);
            await new Promise(requestAnimationFrame);
          }
        });
        assert(await tab.evaluate(()=>document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('#page_9')!=null));
        assert.equal(await tab.evaluate(()=>events.filter(e=>e.type==='jm2Page').at(-1).page),9);
        assert(await tab.evaluate(()=>holdReads.length<=2),'intermediate pages queued for extraction');
        await tab.evaluate(()=>{const pending=holdReads;window.holdReads=null;pending.forEach(f=>f());});
        await tab.waitForFunction(()=>document.images[9].naturalWidth>0);
      }
      await tab.evaluate(()=>jm2Pager.suspend());
      assert.equal(await tab.evaluate(()=>resident.size),0,mode);
      await tab.close();
    }
    console.log('Passed local ZIP reader restore, scrubbing and eviction in five reading modes');
  }finally{await browser.close();await fs.rm(dir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
