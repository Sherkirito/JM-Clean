__d(function(global,require,_i,_a,module,exports,deps){
  const storage=require(deps[0]).AsyncStorage, engine=require(deps[1]).RE2JS, presets=require(deps[2]).presets,learning=require(deps[3]);
  const fold=require(deps[4]).forMatching;
  const key='jm2clean.commentFilters.v1', listeners=new Set(), noRows=[];
  const limits={autoUsers:2000,released:500,comments:500,samples:100,rules:100};
  function mergeRecent(local,incoming,limit){
    const batch=new Set(Array.from(new Set(incoming)).slice(-limit));
    const ids=Array.from(new Set(local.concat(Array.from(batch))));
    let excess=ids.length-limit;
    // Keep the imported batch together so repeated imports at capacity are idempotent.
    return ids.filter(id=>{
      if(excess>0 && !batch.has(id)){excess--;return false;}
      return true;
    });
  }
  const accountId=id=>typeof id==='string' && /^[1-9]\d{0,20}$/.test(id);
  let current=null,loading=null,queue=Promise.resolve(),cache=new WeakMap();
  function initial(){return {rules:[],learning:true,ignored:[],disabled:presets.filter(p=>!p.defaultOn).map(p=>p.id),presetChanges:{},users:[],autoUsers:[],released:[],comments:[]};}
  function compile(pattern){
    if(!pattern || pattern.length>180)throw Error('正则长度须在 1 到 180 个字符之间');
    let re;
    try{re=engine.compile(pattern,engine.CASE_INSENSITIVE);}
    catch(_){throw Error('正则格式有误。请检查括号和转义；不支持前后断言或反向引用。');}
    if(re.programSize()>1200 || re.matcher('').find())throw Error('表达式过宽或过复杂，请再具体一些');
    return re;
  }
  const builtins=presets.map(p=>Object.assign({},p,{re:compile(p.pattern)}));
  function presetList(v){
    return presets.filter(p=>!(v.presetChanges[p.id]||{}).deleted).map(p=>Object.assign({},p,{pattern:(v.presetChanges[p.id]||{}).pattern||p.pattern}));
  }
  function usesTraditionalLiteral(pattern){
    // Inspect literals only to select the input text. Compile the user's RE2 source verbatim.
    const literals=pattern.replace(/\\(?:\\|Q[\s\S]*?(?:\\E|$)|x\{([0-9a-fA-F]+)\})/g,
      (escape,hex)=>hex ? String.fromCodePoint(parseInt(hex,16)) : escape);
    return fold(literals)!==literals;
  }
  function snapshot(saved){
    const value=Object.assign(initial(),saved);
    ['rules','disabled','comments','users','ignored'].forEach(k=>{if(!Array.isArray(value[k]))value[k]=[];});
    value.rules=value.rules.filter(r=>r && (r.kind==='keyword'||r.kind==='regex') && typeof r.value==='string' && r.value && r.value.length<=180);
    for(const field of ['users','comments']){
      const valid=value[field].filter(row=>row && accountId(String(row.id)));
      const rows=field==='comments'?valid.slice(-limits.comments):valid;
      value[field]=rows.map((row,index)=>{
        const item={id:String(row.id),label:typeof row.label==='string'?row.label.slice(0,80):''};
        if(field==='comments' && index>=rows.length-limits.samples && accountId(String(row.author)) && Array.isArray(row.shapes)){
          const shapes=row.shapes.filter(s=>s && learning.validShape(s.anchor,s.type)).slice(0,learning.MAX_SHAPES);
          if(shapes.length){item.author=String(row.author);item.shapes=shapes;}
        }
        return item;
      });
    }
    value.presetChanges=Object.assign({},value.presetChanges);
    const custom=[],keywords=[],automatic=[],presetMatchers=[];
    builtins.forEach(p=>{
      const change=Object.assign({},value.presetChanges[p.id]);
      let re=p.re;
      if(change.pattern!=null){
        try{if(typeof change.pattern!=='string')throw Error();re=compile(change.pattern);}
        catch(_){delete change.pattern;value.presetChanges[p.id]=change;}
      }
      if(!change.deleted && !value.disabled.includes(p.id))presetMatchers.push({re,strict:p.strict && !change.pattern});
    });
    value.rules.forEach(r=>{
      if(!r || typeof r.value!=='string' || !r.value)return;
      if(r.kind==='keyword')keywords.push(fold(r.value).toLowerCase());
      if(r.kind==='regex'){
        try{
          if(r.learned===true)automatic.push(compile(learning.canonicalPattern(r.value)));
          else custom.push({re:compile(r.value),original:usesTraditionalLiteral(r.value)});
        }catch(_){}
      }
    });
    const users=new Set(value.users.map(r=>r.id));
    for(const field of ['autoUsers','released']){
      const ids=Array.isArray(value[field])?value[field].filter(id=>accountId(id) && !users.has(id)):[];
      value[field]=Array.from(new Set(ids)).slice(-limits[field]);
      if(field==='autoUsers')value[field].forEach(id=>users.add(id));
    }
    return {value,custom,keywords,automatic,presetMatchers,users,released:new Set(value.released),comments:new Set(value.comments.map(r=>r.id)),matches:new WeakMap()};
  }
  function publish(s){current=s;cache=new WeakMap();listeners.forEach(fn=>fn(s));return s;}
  function load(){
    if(current)return Promise.resolve(current);
    if(!loading)loading=storage.getItem(key).then(async raw=>{
      const saved=raw?JSON.parse(raw):initial(),prepared=snapshot(saved);
      if(saved && ['autoUsers','released','comments'].some(k=>Array.isArray(saved[k]) && saved[k].length>limits[k]))
        await storage.setItem(key,JSON.stringify(prepared.value));
      return publish(prepared);
    }).catch(error=>{loading=null;throw error;});
    return loading;
  }
  function change(update){
    const operation=queue.then(load).then(s=>{
      const next=Object.assign({},s.value);update(next);
      const prepared=snapshot(next);
      return storage.setItem(key,JSON.stringify(prepared.value)).then(()=>publish(prepared));
    });
    queue=operation.catch(()=>{});return operation;
  }
  function save(kind,input,previous){
    return change(v=>{
      const value=String(input||'').trim();
      if(kind!=='regex' && kind!=='keyword')throw Error('请选择屏蔽方式');
      if(!value || value.length>180)throw Error('请输入 1 到 180 个字符');
      if(kind==='regex')compile(value);
      const same=x=>x.kind===kind && (kind==='keyword'?fold(x.value).toLowerCase()===fold(value).toLowerCase():x.value===value);
      if(v.rules.some(x=>x.id!==previous && same(x)))throw Error('已有相同规则');
      const rule={kind,value,id:previous||kind+'/'+value};
      const index=v.rules.findIndex(x=>x.id===previous);
      v.rules=v.rules.slice();if(index>=0)v.rules[index]=rule;else {
        if(v.rules.length>=limits.rules)throw Error('自定义规则已达 100 条');
        while(v.rules.some(x=>x.id===rule.id))rule.id+='~';
        v.rules.push(rule);
      }
    });
  }
  function updatePreset(v,id,patch){
    if(!presets.some(p=>p.id===id))throw Error('找不到该预置规则');
    v.presetChanges=Object.assign({},v.presetChanges,{[id]:Object.assign({},v.presetChanges[id],patch)});
    if(typeof patch.enabled==='boolean'){
      v.disabled=v.disabled.filter(x=>x!==id);if(!patch.enabled)v.disabled=v.disabled.concat(id);
    }
  }
  function togglePreset(id,enabled){return change(v=>updatePreset(v,id,{enabled}));}
  function editPreset(id,value){return change(v=>{value=String(value).trim();compile(value);updatePreset(v,id,{pattern:value});});}
  function deletePreset(id){return change(v=>updatePreset(v,id,{deleted:true}));}
  function backupTransaction(work){
    const result=queue.then(load).then(s=>work(s.value,async(next,extra)=>{
      const prepared=snapshot(next);
      await storage.multiSet(extra.concat([[key,JSON.stringify(prepared.value)]]));
      publish(prepared);
    }));
    queue=result.catch(()=>{});return result;
  }
  function remove(group,id){return change(v=>{
    if(group==='users' && (v.autoUsers.includes(id) || v.users.some(x=>x.id===id))){
      v.autoUsers=v.autoUsers.filter(x=>x!==id);
      if(!v.released.includes(id))v.released=v.released.concat(id);
    }
    v[group]=v[group].filter(x=>x.id!==id);
  });}
  function idOf(item,names){
    for(let i=0;i<names.length;i++){const v=item[names[i]];if(v!=null && /^[1-9][0-9]*$/.test(String(v)))return String(v);}
    return '';
  }
  function userId(item){
    for(const key of ['UID','uid','user_id']){
      const value=item[key];
      if(typeof value==='string' && accountId(value))return value;
      if(typeof value==='number' && Number.isSafeInteger(value) && value>0)return String(value);
    }
    return '';
  }
  function commentId(item){return idOf(item,['CID','cid','comment_id']);}
  function hide(group,item){return change(v=>{
    const id=group==='users'?userId(item):commentId(item);
    if(!id)throw Error('这条留言没有可用的编号');
    if(group==='users'){
      v.released=v.released.filter(x=>x!==id);
      v.autoUsers=v.autoUsers.filter(x=>x!==id);
    }
    const sample=()=>{
      if(v.learning===false || !userId(item))return null;
      const text=presetText(fold(plain(item.content)));
      return caution.test(text)?[]:learning.extract(text);
    };
    if(!v[group].some(x=>x.id===id)){
      const row={id,label:String(item.username||'').slice(0,80)};
      if(group==='comments'){const shapes=sample();if(shapes){row.shapes=shapes;if(shapes.length)row.author=userId(item);}}
      v[group]=v[group].concat(row);
    }
    // Blocking an account from one of its comments also teaches the suggestions; that comment stays hidden.
    const cid=group==='users' && commentId(item);
    if(cid && !v.comments.some(x=>x.id===cid)){
      const shapes=sample();
      if(shapes && shapes.length)v.comments=v.comments.concat({id:cid,label:String(item.username||'').slice(0,80),author:userId(item),shapes});
    }
  });}
  function plain(html){
    const entities={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
    return String(html||'').replace(/<br\b[^>]*>|<\/(?:p|div|li)>/gi,' ').replace(/<\/?[a-z][^>]*>/gi,'')
      .replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-f]+);/gi,(m,k)=>{
        k=k.toLowerCase();if(k[0]!=='#')return entities[k];
        const v=k[1]==='x'?parseInt(k.slice(2),16):Number(k.slice(1));
        return v>0 && v<=0x10ffff?String.fromCodePoint(v):m;
      }).replace(/[\u200b-\u200d\ufeff]/g,'');
  }
  const caution=/(?:不要|别|切勿)(?:再)?(?:轻信|信|加|进|扫|点|转|去|上当|受骗|下载|打开|联系|付|买)|小心(?:被骗|上当|诈骗)|警惕(?:诈骗|骗局|广告)|举报|防骗|骗局|骗子|诈骗|这条广告|上面的广告|有人冒充/;
  // Protect explicit reports and quotations, even when they reproduce a full contact number.
  const warning=/(?:^|[。！？!?；;，,])(?:大家|提醒大家|请|千万|大家千万)?(?:不要|别|切勿)(?:再)?(?:轻信|信|加|进|扫|点|转|上当|受骗)|(?:^|[。！？!?；;，,])(?:大家)?(?:小心(?:被骗|上当)|举报[:：]|这条广告说|上面的广告说|有人冒充)/;
  function presetText(text){return text.replace(/[\uff01-\uff5e]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0xfee0)).replace(/[\s\u3000]+/g,' ').trim();}
  function compactPreset(text){
    // The Android shell's bundled JSC crashes inside ICU normalization on this device.
    // Convert only number forms used in contact strings, without calling native ICU.
    return text.replace(/[\s\u200b-\u200f\u2060\ufe0e\ufe0f\u20e3\ufeff]/g,'')
      .replace(/[⓪⓿]/g,'0')
      .replace(/[①-⑨⑴-⑼❶-❾➀-➈➊-➒]/g,ch=>String('①②③④⑤⑥⑦⑧⑨⑴⑵⑶⑷⑸⑹⑺⑻⑼❶❷❸❹❺❻❼❽❾➀➁➂➃➄➅➆➇➈➊➋➌➍➎➏➐➑➒'.indexOf(ch)%9+1))
      .replace(/\ud835[\udfce-\udfff]/g,ch=>String((ch.charCodeAt(1)-0xdfce)%10));
  }
  function matchText(s,row){
    if(!s.custom.length && !s.presetMatchers.length && !s.automatic.length && !s.keywords.length)return '';
    const cached=s.matches.get(row);
    if(cached && cached.content===row.content)return cached.kind;
    const text=plain(row.content),simple=fold(text);
    let kind='';
    if(s.custom.some(rule=>rule.re.matcher(rule.original?text:simple).find()))kind='regex';
    if(!kind && (s.automatic.length || s.presetMatchers.length)){
      const normal=presetText(simple),compact=compactPreset(normal);
      const cautious=caution.test(compact),reported=cautious && warning.test(compact);
      if(s.presetMatchers.some(({re,strict})=>(!cautious || strict && !reported) && (re.matcher(normal).find() || re.matcher(compact).find())) ||
        !cautious && s.automatic.some(re=>re.matcher(normal).find()))kind='regex';
    }
    if(!kind && s.keywords.length){
      const lower=simple.toLowerCase();
      if(s.keywords.some(word=>lower.includes(word)))kind='keyword';
    }
    s.matches.set(row,{content:row.content,kind});return kind;
  }
  function allowLearning(on){return change(v=>{
    v.learning=on;v.learningSet=true;
    if(!on)v.comments=v.comments.map(r=>({id:r.id,label:r.label}));
  });}
  function decide(pattern,accept){return change(v=>{
    if(!learning.suggestions(v).some(x=>x.pattern===pattern))throw Error('建议已失效');
    if(accept){
      if(v.rules.length>=limits.rules)throw Error('自定义规则已达 100 条');
      compile(pattern);
      let id='suggested/'+pattern;while(v.rules.some(x=>x.id===id))id+='~';
      v.rules=v.rules.concat({kind:'regex',value:pattern,learned:true,id});
    }else v.ignored=v.ignored.filter(x=>x!==pattern).concat(pattern).slice(-100);
  });}
  function scan(rows,s){
    const old=cache.get(rows);if(old && old.state===s)return old;
    const discovered=new Set(),hidden=new Set();
    function inspect(row){
      if(!row || typeof row!=='object')return;
      const uid=userId(row);
      if(s.users.has(uid)){hidden.add(row);return;}
      const kind=matchText(s,row);
      if(kind==='regex' && uid && !s.released.has(uid))discovered.add(uid);
      if(kind || s.comments.has(commentId(row)))hidden.add(row);
    }
    for(const row of rows){
      inspect(row);
      if(row && Array.isArray(row.replys))row.replys.forEach(inspect);
    }
    const show=row=>row && typeof row==='object' && !hidden.has(row) && !discovered.has(userId(row));
    const list=[];
    rows.forEach(row=>{
      if(!show(row))return;
      if(Array.isArray(row.replys)){
        const replies=row.replys.filter(show);
        if(replies.length!==row.replys.length)row=Object.assign({},row,{replys:replies});
      }
      list.push(row);
    });
    const result={state:s,list,discovered};cache.set(rows,result);return result;
  }
  function visible(rows,s){return s && Array.isArray(rows)?scan(rows,s).list:noRows;}
  function rememberAuthors(rows,s){
    if(!s || !Array.isArray(rows) || !scan(rows,s).discovered.size)return Promise.resolve();
    // Commit after rendering. Recheck current rules and explicit unblocks in write order.
    const operation=queue.then(load).then(async latest=>{
      const ids=scan(rows,latest).discovered;if(!ids.size)return;
      const previous=latest.value.autoUsers;
      let autoUsers=previous.concat(Array.from(ids));
      if(autoUsers.length>limits.autoUsers){
        const batch=[],manual=new Set(latest.value.users.map(row=>row.id));
        const collect=row=>{
          if(!row || typeof row!=='object')return;
          const uid=userId(row);
          if(uid && !manual.has(uid) && !latest.released.has(uid) && matchText(latest,row)==='regex')batch.push(uid);
        };
        for(const row of rows){collect(row);if(row && Array.isArray(row.replys))row.replys.forEach(collect);}
        autoUsers=mergeRecent(previous,batch,limits.autoUsers);
        if(previous.length===autoUsers.length && previous.every((id,index)=>id===autoUsers[index]))return;
      }
      const value=Object.assign({},latest.value,{autoUsers});
      await storage.setItem(key,JSON.stringify(value));
      const users=new Set(latest.value.users.map(row=>row.id).concat(autoUsers));
      publish(Object.assign({},latest,{value,users}));
    });
    queue=operation.catch(()=>{});return operation;
  }
  Object.assign(exports,{get:()=>current,load,limits,mergeRecent,subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);},save,hide,remove,togglePreset,presetList,editPreset,deletePreset,backupTransaction,visible,rememberAuthors,plain,compile,userId,commentId,presets,allowLearning,decide,suggestions:learning.suggestions,validShape:learning.validShape,MAX_SHAPES:learning.MAX_SHAPES});
},2169,[2,2172,2173,2174,651]);
