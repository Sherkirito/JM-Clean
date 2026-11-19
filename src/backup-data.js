__d(function(global,require,_i,_a,module,exports,deps){
  const db=require(deps[0]).AsyncStorage, filters=require(deps[1]),history=require(deps[2]),fold=require(deps[3]).forMatching;
  const booksKey='jm2clean.history.books',pageKey='jm2clean.history.page.',modeKey='jm2clean.reader.mode';
  const modes=['vertical','horizontal','rtl','spread-ltr','spread-rtl'];
  const id=x=>typeof x==='string' && /^[1-9]\d{0,20}$/.test(x);
  const integer=x=>Number.isSafeInteger(x) && x>=0;
  const text=(x,max)=>typeof x==='string' && x.length<=max;
  const validPage=raw=>typeof raw==='string' && /^\d+$/.test(raw) && integer(Number(raw));
  function series(raw){
    try{const value=JSON.parse(raw);if(value && typeof value==='object')return value;}catch(_){}
    return {};
  }
  function check(ok){if(!ok)throw Error('备份格式不完整或版本不兼容');}
  function unpackRule(row){
    const [kind,value,customId]=row,learned=kind===2, type=kind===0?'keyword':'regex';
    return {kind:type,value,id:customId||(learned?'suggested':type)+'/'+value,learned};
  }
  function packRule(r){
    const row=[r.learned?2:r.kind==='keyword'?0:1,r.value];
    if(unpackRule(row).id!==r.id)row.push(r.id);
    return row;
  }
  function encodeFilters(v){
    const p=Object.assign({},v.presetChanges);
    for(const preset of filters.presets){
      const on=!v.disabled.includes(preset.id);
      if(on!==preset.defaultOn)p[preset.id]=Object.assign({enabled:on},p[preset.id]);
    }
    const result={r:v.rules.map(packRule),u:v.users.map(r=>[r.id,r.label]),c:v.comments.map(r=>
      r.author && Array.isArray(r.shapes) && r.shapes.length?[r.id,r.label,r.author,r.shapes.map(s=>[s.anchor,s.type])]:[r.id,r.label]),
      p,i:v.ignored,l:v.learning!==false};
    if(v.autoUsers.length)result.a=v.autoUsers;
    if(v.released.length)result.x=v.released;
    return result;
  }
  async function readHistory(){
    const keys=(await db.getAllKeys()).filter(k=>k===modeKey || /^(?:jm2clean\.history\.page\.|series_history_|series_latest_view_|last_viewed_chapter_)[1-9]\d{0,20}$/.test(k));
    const raw=new Map();
    for(let i=0;i<keys.length;i+=128)for(const [k,v] of await db.multiGet(keys.slice(i,i+128)))if(v!=null)raw.set(k,v);
    return raw;
  }
  function toArchive(books,raw,settings){
    const pages=[],groups=new Map();
    for(const [key,value] of raw){
      if(key===modeKey)continue;
      if(key.startsWith(pageKey)){
        if(validPage(value))pages.push([key.slice(pageKey.length),Number(value)]);
        continue;
      }
      const book=key.slice(key.lastIndexOf('_')+1);
      const row=groups.get(book)||[book,[],null,null];groups.set(book,row);
      if(key.startsWith('series_history_')){
        const data=series(value);
        if(Array.isArray(data[0]))row[1]=history.chapterIds(data[0]).map(String);
      }else if(key.startsWith('series_latest_view_')){if(id(value))row[2]=value;}
      else if(text(value,64))row[3]=value;
    }
    const f=encodeFilters(settings);
    return {jm:f.a || f.x?2:1,f,b:books.filter(validBook),h:Array.from(groups.values()).filter(r=>r[1].length || r[2]!=null || r[3]!=null),
      p:pages,m:modes.includes(raw.get(modeKey))?raw.get(modeKey):null};
  }
  function validBook(row){
    return Array.isArray(row) && row.length>=4 && row.length<=7 && id(row[0]) && id(row[1]) && text(row[2],16384) && integer(row[3]) && row[3]>0 &&
      (row[4]==null || integer(row[4]) || text(row[4],64)) && (row[5]==null || text(row[5],8192)) && (row[6]==null || integer(row[6]) || text(row[6],128));
  }
  function validate(a){
    check(a && [1,2].includes(a.jm) && a.f && Array.isArray(a.b) && Array.isArray(a.p) && Array.isArray(a.h));
    const f=a.f;
    check([f.r,f.u,f.c,f.i].every(Array.isArray) && f.p && typeof f.p==='object' && !Array.isArray(f.p) && typeof f.l==='boolean');
    check(a.m==null || modes.includes(a.m));
    for(const r of f.r){
      check(Array.isArray(r) && r.length>=2 && r.length<=3 && [0,1,2].includes(r[0]) && text(r[1],180) && r[1].trim() && (r[2]==null || text(r[2],512)));
      if(r[0])filters.compile(r[1]);
    }
    for(const r of f.u)check(Array.isArray(r) && r.length===2 && id(r[0]) && text(r[1],80));
    for(const k of ['a','x'])if(f[k]!==undefined)check(a.jm===2 && Array.isArray(f[k]) && f[k].every(id));
    for(const r of f.c){
      check(Array.isArray(r) && (r.length===2 || r.length===4) && id(r[0]) && text(r[1],80));
      if(r.length===4){
        check(id(r[2]) && Array.isArray(r[3]) && r[3].length<=filters.MAX_SHAPES);
        for(const s of r[3])check(Array.isArray(s) && s.length===2 && filters.validShape(s[0],s[1]));
      }
    }
    for(const key of Object.keys(f.p)){
      const v=f.p[key];check(/^[a-z][a-z0-9-]{0,48}$/.test(key) && v && typeof v==='object' && Object.keys(v).every(k=>['pattern','enabled','deleted'].includes(k)));
      if(v.pattern!=null){check(text(v.pattern,180));filters.compile(v.pattern);}
      if(v.enabled!=null)check(typeof v.enabled==='boolean');
      if(v.deleted!=null)check(typeof v.deleted==='boolean');
    }
    check(f.i.every(x=>text(x,512)));
    for(const row of a.b)check(validBook(row));
    for(const row of a.h)check(Array.isArray(row) && row.length===4 && id(row[0]) && Array.isArray(row[1]) && row[1].every(id) && (row[2]==null || id(row[2])) && (row[3]==null || text(row[3],64)));
    for(const row of a.p)check(Array.isArray(row) && row.length===2 && id(row[0]) && integer(row[1]));
    return a;
  }
  function mergeFilters(local,f){
    const next=Object.assign({},local,{users:local.users.slice(),comments:local.comments.slice(),rules:local.rules.slice(),
      presetChanges:Object.assign({},local.presetChanges),disabled:local.disabled.slice(),ignored:Array.from(new Set(local.ignored.concat(f.i)))});
    if(!local.learningSet && local.learning!==false){next.learning=f.l;next.learningSet=true;}
    const users=new Set(next.users.map(r=>r.id).concat(local.autoUsers));
    const released=new Set(local.released),comments=new Map(next.comments.map(r=>[r.id,r]));
    for(const [id,label] of f.u)if(!users.has(id) && !released.has(id)){next.users.push({id,label});users.add(id);}
    const manual=new Set(next.users.map(r=>r.id));
    next.autoUsers=filters.mergeRecent(local.autoUsers,(f.a||[]).filter(id=>!manual.has(id) && !released.has(id)),filters.limits.autoUsers);
    for(const id of next.autoUsers)users.add(id);
    next.released=filters.mergeRecent(local.released,(f.x||[]).filter(id=>!users.has(id)),filters.limits.released);
    const revived=new Set();
    for(const [index,[id,label,author,shapes]] of f.c.entries()){
      const previous=comments.get(id),row=previous?Object.assign({},previous):{id,label};
      // Restoring a saved sample is independent of collecting new samples.
      if(author && (!row.author || row.author===author)){
        const merged=new Map((row.shapes||[]).map(s=>[s.type+'/'+fold(s.anchor),s]));
        for(const [anchor,type] of shapes)if(!merged.has(type+'/'+fold(anchor)))merged.set(type+'/'+fold(anchor),{anchor,type});
        row.author=author;row.shapes=Array.from(merged.values()).slice(0,filters.MAX_SHAPES);
        if(previous && !previous.shapes && row.shapes.length && index>=f.c.length-filters.limits.samples)revived.add(id);
      }
      comments.set(id,row);
    }
    next.comments=filters.mergeRecent(local.comments.map(c=>c.id).filter(id=>!revived.has(id)),f.c.map(r=>r[0]),filters.limits.comments).map(id=>comments.get(id));
    const signature=r=>r.kind+'/'+(r.kind==='keyword'?fold(r.value).toLowerCase():r.value);
    const ids=new Set(next.rules.map(r=>r.id)),rules=new Set(next.rules.map(signature));
    for(const row of f.r){
      if(next.rules.length>=filters.limits.rules)break;
      const r=unpackRule(row),key=signature(r);
      if(!ids.has(r.id) && !rules.has(key)){next.rules.push(r);ids.add(r.id);rules.add(key);}
    }
    for(const p of filters.presets){
      if(!f.p[p.id] || local.presetChanges[p.id] || p.defaultOn===local.disabled.includes(p.id))continue;
      const change=Object.assign({},f.p[p.id]);next.presetChanges[p.id]=change;
      if(typeof change.enabled==='boolean'){
        next.disabled=next.disabled.filter(x=>x!==p.id);if(!change.enabled)next.disabled.push(p.id);
      }
    }
    return next;
  }
  function create(){
    return history.backupTransaction(books=>filters.backupTransaction(async v=>{
      const archive=validate(toArchive(books,await readHistory(),v));
      return JSON.stringify(archive);
    }));
  }
  function decode(raw){
    let value;try{value=JSON.parse(raw);}catch(e){throw Error('备份文件已损坏');}
    return validate(value);
  }
  function restore(a){
    validate(a);
    return history.backupTransaction((books,invalidate)=>filters.backupTransaction(async(local,commit)=>{
      const raw=await readHistory(),writes=new Map(), merged=books.slice(),known=new Set(books.map(r=>r[0]));
      for(const row of a.b)if(!known.has(row[0])){known.add(row[0]);merged.push(row);}
      if(merged.length!==books.length){
        const first=books.length?Math.floor(books.length/128):0;
        // An old single-key index needs all chunks on its first migration.
        const old=await db.getItem(booksKey),legacy=old && Array.isArray(JSON.parse(old));
        for(let i=legacy?0:first;i<Math.ceil(merged.length/128);i++)writes.set(booksKey+'.'+i,JSON.stringify(merged.slice(i*128,(i+1)*128)));
        writes.set(booksKey,JSON.stringify({v:2,parts:Math.ceil(merged.length/128)}));
      }
      function putMissing(k,v,valid){if(v!=null && !valid(raw.get(k)) && !writes.has(k))writes.set(k,String(v));}
      for(const [book,page] of a.p)putMissing(pageKey+book,page,validPage);
      for(const [book,visited,latest,episode] of a.h){
        const k='series_history_'+book, v=series(writes.get(k)||raw.get(k));
        if(visited.length){
          const old=Array.isArray(v[0])?v[0]:[], merged=history.chapterIds(old.concat(visited));
          if(JSON.stringify(old)!==JSON.stringify(merged)){v[0]=merged;writes.set(k,JSON.stringify(v));}
        }
        putMissing('series_latest_view_'+book,latest,id);putMissing('last_viewed_chapter_'+book,episode,v=>text(v,64));
      }
      putMissing(modeKey,a.m,v=>modes.includes(v));
      const next=mergeFilters(local,a.f);
      await commit(next,Array.from(writes));invalidate();
      const oldUsers=new Set(local.users.map(r=>r.id).concat(local.autoUsers));
      const newUsers=next.users.map(r=>r.id).concat(next.autoUsers).filter(id=>!oldUsers.has(id)).length;
      return '导入完成。新增 '+(merged.length-books.length)+' 本观看记录、'+(next.rules.length-local.rules.length)+' 条自定义规则、'+newUsers+' 个黑名单账号。';
    }));
  }
  exports.create=create;exports.restore=restore;exports.decode=decode;
},2176,[2,2169,2161,651]);
