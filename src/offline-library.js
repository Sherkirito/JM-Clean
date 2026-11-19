__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),fs=require(deps[2]);
  const base='content://com.jiaohua_cleaner.jmbackup/offline/',listeners=new Set();
  let pending=null,timer=null,appListener=null,snapshot={rows:[],loading:true,error:''};
  async function call(op,...args){
    const uri=base+[op,...args].map(x=>encodeURIComponent(String(x))).join('/');
    const result=JSON.parse(await fs.readFile(uri,'utf8'));if(result.error)throw Error(result.error);return result.value;
  }
  async function body(op,data){
    const dir=fs.CachesDirectoryPath+'/jm-download-requests',token=Date.now().toString(36)+Math.random().toString(36).slice(2);
    const f=dir+'/'+token+'.json';
    // The legacy Android bridge can otherwise leave the next file operation
    // queued until another touch when this screen is idle.
    const pulse=setInterval(()=>{},200);
    try{await fs.mkdir(dir);await fs.writeFile(f,JSON.stringify(data),'utf8');return await call(op,token);}
    finally{try{await fs.unlink(f).catch(()=>{});}finally{clearInterval(pulse);}}
  }
  const busy=row=>['verify','running','queued','paused'].includes(row.state);
  function refresh(){
    clearTimeout(timer);if(pending)return pending;
    pending=call('list').then(rows=>{
      rows.sort((a,b)=>b.stamp-a.stamp);snapshot={rows,loading:false,error:''};return rows;
    },()=>{snapshot={rows:snapshot.rows,loading:false,error:'暂时无法读取本地下载'};return snapshot.rows;}).finally(()=>{
      pending=null;listeners.forEach(fn=>fn(snapshot));
      if(listeners.size && RN.AppState.currentState==='active' && snapshot.rows.some(r=>r.state!=='verify' && busy(r)))timer=setTimeout(refresh,1250);
    });return pending;
  }
  function useRows(navigation){
    const [data,set]=React.useState(snapshot);
    React.useEffect(()=>{
      listeners.add(set);refresh();
      if(listeners.size===1){appListener=s=>{clearTimeout(timer);if(s==='active')refresh();};RN.AppState.addEventListener('change',appListener);}
      const off=navigation && navigation.addListener('focus',refresh);
      return ()=>{listeners.delete(set);if(off)off();if(!listeners.size){clearTimeout(timer);RN.AppState.removeEventListener('change',appListener);}};
    },[navigation]);return data;
  }
  function bookDetails(album){
    const details={id:String(album.id),description:String(album.description||'').slice(0,4000),
      hasSeries:Number(album.series_id)>0 || Array.isArray(album.series) && album.series.length>0};
    for(const k of ['tags','author','actors','works'])if(Array.isArray(album[k]))details[k]=album[k].filter(v=>typeof v==='string').slice(0,48).map(v=>v.slice(0,48));
    for(const k of ['likes','comment_total','total_views'])if(album[k]!=null && Number.isFinite(Number(album[k])))details[k]=Number(album[k]);
    return details;
  }
  function readDetails(id,publish){
    let live=true,task;
    (async()=>{
      const saved=await call('album',id).catch(()=>({}));
      if(!live)return;
      if(saved.id===id){publish(saved);return;}
      publish({id});
      if(!await call('connected') || !live)return;
      const client=require(deps[3]).default,api=require(deps[4]);
      task=client.fetchGet(api.API_COMBIC_DETAIL,{id},reply=>{
        const data=reply && reply.data;
        if(!live || !data || String(data.id)!==id || Number(reply.code)!==200)return;
        const updated=bookDetails(data);
        publish(updated);body('remember',updated).catch(()=>{});
      },()=>{});
    })().catch(()=>{});
    return ()=>{live=false;if(task)task.abort();};
  }
  function metadata(id,album,file,old){
    const series=album && Array.isArray(album.series)?album.series:[],i=series.findIndex(x=>x && String(x.id)===String(id));
    const valid=album && (String(album.id)===String(id)||i>=0),c=series[i]||{};
    if(!valid && old && String(old.id)===String(id))return {id:old.id,book:old.book,title:old.title,name:old.name,episode:old.episode,tags:old.tags,author:old.author};
    const names=v=>(Array.isArray(v)?v:[v]).map(x=>typeof x==='string'?x:x&&x.name).filter(Boolean).join(' · ');
    return {id:String(id),book:String(valid?album.id:id),title:valid && album.name || file.title || String(id),
      name:c.name || file.title || String(id),episode:Number(c.sort || c.episode)||Math.max(1,i+1),tags:valid?names(album.tags).slice(0,2000):'',author:valid?names(album.author).slice(0,500):'',album:valid?bookDetails(album):undefined};
  }
  async function begin(data){
    if(RN.Platform.Version<29){
      const p=RN.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      if(await RN.PermissionsAndroid.request(p)!=='granted')throw Error('需要存储权限才能保存到下载目录');
    }
    const result=await body('begin',data);await refresh();return result;
  }
  const readable=r=>r && (r.state==='ready'||r.state==='locked');
  function status(r){
    if(r.state==='running'||r.state==='paused'){
      const n=x=>(x/1048576).toFixed(1)+' MB';
      return (r.state==='paused'?'等待恢复':'正在下载')+' · '+(r.total>0?Math.min(100,Math.floor(r.done*100/r.total))+'%  '+n(r.done)+' / '+n(r.total):n(Math.max(0,r.done)));
    }
    return ({queued:'等待下载',verify:'等待完成验证',ready:(r.pages||0)+' 页',locked:'已下载 · 需要 ZIP 密码',missing:'ZIP 已移动或删除',failed:r.error||'下载失败',invalid:r.error||'无法读取 ZIP'})[r.state]||'暂不可用';
  }
  exports.open=(id,password='')=>body('open',{id:String(id),password,dark:global.darkMode==='1'});
  Object.assign(exports,{call,metadata,readDetails,refresh,useRows,begin,status,busy,readable});
},2184,[55,2,2118,648,650]);
