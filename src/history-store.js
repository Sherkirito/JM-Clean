__d(function(global,require,_i,_a,module,exports,deps){
  const storage=require(deps[0]).AsyncStorage, prefix='jm2clean.history.', indexKey=prefix+'books';
  const listeners=new Set(),pending=new Map(),positions=new Map();
  let queue=Promise.resolve(), flushing=null, index=null, changed=0;
  let encodedChunks=[];
  const chunkKey=i=>indexKey+'.'+i;
  function unpack(row){
    if(Array.isArray(row)){
      const [id,chapter,title,total,episode,image,update_at]=row;
      row={id,chapter,title,total,episode,image,update_at};
    }
    if(!row || row.id==null || row.chapter==null)return null;
    return Object.assign({},row,{id:String(row.id),chapter:String(row.chapter),title:String(row.title||row.id),total:Math.max(1,Number(row.total)||1)});
  }
  function pack(row){
    const fields=[row.id,row.chapter,row.title,row.total,row.episode,row.image,row.update_at];
    while(fields.length>4 && fields[fields.length-1]==null)fields.pop();
    return fields;
  }
  function parse(raw,fallback){try{return JSON.parse(raw)||fallback;}catch(_){return fallback;}}
  function chapterIds(ids){
    const valid=ids.filter(id=>(typeof id==='string' || Number.isSafeInteger(id)) && /^[1-9]\d{0,20}$/.test(String(id)));
    return Array.from(new Set(valid.map(String)),id=>Number.isSafeInteger(Number(id))?Number(id):id);
  }
  function notify(){changed++;listeners.forEach(fn=>fn(changed));}
  function serialize(fn){const next=queue.then(fn);queue=next.catch(()=>{});return next;}
  async function books(){
    if(index)return index;
    const rawIndex=await storage.getItem(indexKey);
    const value=rawIndex==null?[]:JSON.parse(rawIndex);
    if(Array.isArray(value)){index=value.map(unpack).filter(Boolean);return index;}
    if(!value || value.v!==2 || !Number.isSafeInteger(value.parts) || value.parts<0 || value.parts>100000)throw Error('观看记录索引无法读取');
    const rows=[],chunks=[];
    for(let start=0;start<value.parts;start+=64){
      const keys=Array.from({length:Math.min(64,value.parts-start)},(_,i)=>chunkKey(start+i));
      for(const [,raw] of await storage.multiGet(keys)){
        const part=parse(raw,null);
        if(!Array.isArray(part))throw Error('部分观看记录暂时无法读取');
        chunks.push(raw);
        part.forEach(row=>{const entry=unpack(row);if(entry)rows.push(entry);});
      }
    }
    encodedChunks=chunks;index=rows;
    return index;
  }
  function info(chapter,params,detail){
    const id=String(chapter.id==null?params.id:chapter.id),book=String(Number(chapter.series_id)>0?chapter.series_id:id);
    const series=Array.isArray(chapter.series)?chapter.series:[], item=series.find(x=>x && String(x.id)===id);
    const album=detail && String(detail.id)===book?detail:null;
    const image=album && album.image || chapter.image;
    const update=album && album.update_at || chapter.update_at;
    const metadata={};
    if(typeof image==='string' && image.trim())metadata.image=image.trim();
    if(typeof update==='number' || typeof update==='string' && update)metadata.update_at=update;
    return Object.assign(metadata,{id:book,chapter:id,title:String(album && album.name || chapter.name || book),episode:item && (item.sort||item.episode) || params.episode || (item?series.indexOf(item)+1:null),total:chapter.images.length});
  }
  function open(entry){
    return serialize(async()=>{
      const old=await books(),key='series_history_'+entry.id;
      const saved=parse(await storage.getItem(key),{});
      const prior=typeof saved==='object'?saved:{}, visited=Array.isArray(prior[0])?prior[0]:[];
      prior[0]=chapterIds(visited.concat(entry.chapter));
      const previousIndex=old.findIndex(row=>row.id===entry.id),previous=old[previousIndex];
      const list=[Object.assign({},previous,entry)].concat(old.filter(row=>row.id!==entry.id));
      const chunks=encodedChunks.slice();
      const values=[[key,JSON.stringify(prior)],['series_latest_view_'+entry.id,entry.chapter]];
      const end=encodedChunks.length && previousIndex>=0?previousIndex+1:list.length;
      for(let start=0;start<end;start+=128){
        const i=start/128, raw=JSON.stringify(list.slice(start,start+128).map(pack));
        chunks[i]=raw;if(raw!==encodedChunks[i])values.push([chunkKey(i),raw]);
      }
      if(!index || encodedChunks.length!==chunks.length)values.push([indexKey,JSON.stringify({v:2,parts:chunks.length})]);
      if(entry.episode!=null)values.push(['last_viewed_chapter_'+entry.id,String(entry.episode)]);
      await storage.multiSet(values);index=list;encodedChunks=chunks;notify();
    });
  }
  function flush(){
    if(flushing)return flushing;
    if(!pending.size)return Promise.resolve();
    const batch=Array.from(pending);
    flushing=serialize(()=>storage.multiSet(batch.map(([id,page])=>[prefix+'page.'+id,String(page)]))).then(()=>{
      batch.forEach(([id,page])=>{if(pending.get(id)===page)pending.delete(id);});
      flushing=null;return flush();
    },()=>{flushing=null;});
    return flushing;
  }
  function save(id,page){
    if(!Number.isInteger(page)||page<0)return;
    id=String(id);positions.delete(id);positions.set(id,page);
    if(positions.size>128)positions.delete(positions.keys().next().value);
    pending.set(id,page);flush();
  }
  async function position(id){
    id=String(id);if(pending.has(id))return pending.get(id);
    if(positions.has(id))return positions.get(id);
    const raw=await storage.getItem(prefix+'page.'+id);
    if(pending.has(id))return pending.get(id);
    if(positions.has(id))return positions.get(id);
    const value=Number(raw);return Number.isInteger(value)&&value>=0?value:0;
  }
  async function list(){
    const records=await serialize(books);
    if(!records.length)return [];
    const values=new Map();
    for(let start=0;start<records.length;start+=192){
      const keys=records.slice(start,start+192).map(row=>prefix+'page.'+row.chapter);
      for(const [key,page] of await storage.multiGet(keys))values.set(key,page);
    }
    return records.map(row=>Object.assign({},row,{page:pending.has(row.chapter)?pending.get(row.chapter):positions.has(row.chapter)?positions.get(row.chapter):
      Math.max(0,Math.min(row.total-1,Number(values.get(prefix+'page.'+row.chapter))||0))}));
  }
  function backupTransaction(work){
    return flush().then(()=>serialize(async()=>{
      if(pending.size)throw Error('阅读进度尚未写入，请重试');
      const records=await books();
      return work(records.map(pack),()=>{index=null;encodedChunks=[];positions.clear();notify();});
    }));
  }
  Object.assign(exports,{info,open,position,save,flush,list,notify,chapterIds,backupTransaction,subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);}});
},2161,[2]);
