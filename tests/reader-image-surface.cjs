const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright-core');
const layout=fs.readFileSync(path.join(__dirname,'../src/reader-layout.js'),'utf8');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    for(const carousel of [false,true]){
      const tab=await browser.newPage({viewport:{width:400,height:600}});
      const rows=Array.from({length:5},(_,i)=>'<section class="scramble-page" id="page_'+i+'"><img id="album_photo_'+i+'" class="'+(carousel?'owl-lazy':'lazy_img')+'"></section>');
      await tab.setContent('<style>body{margin:0}.hide{display:none!important}canvas{display:block;margin:auto}</style><main id="photo-container">'+rows.join('')+'</main>');
      if(carousel){
        await tab.addScriptTag({path:require.resolve('jquery')});
        await tab.addStyleTag({path:require.resolve('owl.carousel/dist/assets/owl.carousel.css')});
        await tab.addScriptTag({path:require.resolve('owl.carousel')});
        await tab.evaluate(()=>$('#photo-container').addClass('owl-carousel').owlCarousel({items:1,dots:false}));
      }
      await tab.evaluate(async()=>{
        window.events=[];window.ReactNativeWebView={postMessage:s=>events.push(JSON.parse(s))};
        const original=document.createElement('canvas');original.width=640;original.height=400;
        const ctx=original.getContext('2d');
        ctx.fillStyle='blue';ctx.fillRect(0,0,640,200);
        ctx.fillStyle='red';ctx.fillRect(0,200,640,200);
        const uri=original.toDataURL();
        window.scramble_image=img=>{
          if(img.dataset.plain)return;
          const canvas=document.createElement('canvas');
          canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
          canvas.style.width=img.parentElement.offsetWidth+'px';
          const draw=canvas.getContext('2d');
          draw.drawImage(img,0,200,640,200,0,0,640,200);
          draw.drawImage(img,0,0,640,200,0,200,640,200);
          img.after(canvas);img.classList.add('hide');
        };
        for(const img of document.images)img.dataset.original=uri;
        document.images[4].dataset.plain='1';
        const first=document.images[0];first.src=uri;await first.decode();scramble_image(first);
        // A lazy loader can also leave a placeholder canvas behind.
        document.images[1].after(document.createElement('canvas'));
        window.rawFrames=0;
        function sample(){
          for(const img of document.querySelectorAll('.jm2-image-slot:not([data-plain])')){
            if(!img.complete || !img.naturalWidth)continue;
            const b=img.getBoundingClientRect(),css=getComputedStyle(img);
            if(css.visibility==='visible' && css.opacity!=='0' && b.width>0 && b.height>0 &&
               b.top<innerHeight && b.bottom>0 && b.left<innerWidth && b.right>0)rawFrames++;
          }
          requestAnimationFrame(sample);
        }
        sample();
      });
      await tab.addScriptTag({content:'('+layout+')('+JSON.stringify({count:5,initial:0,mode:'spread-rtl',session:1,cache:{keep:0,ahead:0}})+')'});
      await tab.waitForFunction(()=>events.some(e=>e.type==='jm2Ready'));
      async function check(i,width){
        await tab.waitForFunction(({i,width})=>{
          const img=document.images[i],canvas=img.nextElementSibling;
          if(!canvas || img.getBoundingClientRect().width!==0 || Math.abs(canvas.getBoundingClientRect().width-width)>1)return false;
          const ctx=canvas.getContext('2d');
          return ctx.getImageData(2,2,1,1).data[0]===255 && ctx.getImageData(2,398,1,1).data[2]===255;
        },{i,width},{timeout:3500});
      }
      await check(0,200);await check(1,200);
      await tab.evaluate(()=>jm2Pager.setMode('rtl',1));await check(0,400);
      await tab.evaluate(()=>jm2Pager.go(4));
      await tab.waitForFunction(()=>{const img=document.images[4];return img.naturalWidth>0 && !img.nextElementSibling && getComputedStyle(img).visibility==='visible' && document.images[0].getAttribute('src')===null;});
      await tab.evaluate(()=>jm2Pager.go(0));await check(0,400);
      await tab.evaluate(()=>jm2Pager.setMode('vertical',2));await check(0,400);
      assert.equal(await tab.evaluate(()=>rawFrames),0,'raw stripes became visible');
      console.log('PASS',carousel?'carousel template':'strip template');await tab.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
