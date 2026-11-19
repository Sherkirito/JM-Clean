__d(function(global,require,_i,_a,module,exports,deps){
  const storage=require(deps[0]).AsyncStorage, key='jm2clean.lines.v1', week=7*86400000;
  let data={hosts:{},chosen:''}, queue=Promise.resolve();
  const listeners=new Set();
  const ready=storage.getItem(key).then(raw=>{
    const saved=JSON.parse(raw);
    if(saved && saved.hosts && typeof saved.hosts==='object' && !Array.isArray(saved.hosts)){
      data={hosts:Object.create(null),chosen:typeof saved.chosen==='string'?saved.chosen:''};
      Object.keys(saved.hosts).forEach(host=>{
        const row=saved.hosts[host];
        if(row && typeof row==='object' && !Array.isArray(row))data.hosts[host]=row;
      });
    }
  }).catch(()=>{});
  function emit(){listeners.forEach(fn=>fn());}
  function persist(){const raw=JSON.stringify(data);queue=queue.then(()=>storage.setItem(key,raw)).catch(()=>{});emit();}
  function validHosts(value){return Array.isArray(value)?Array.from(new Set(value.filter(h=>typeof h==='string' && /^[a-z0-9.-]+(?::\d+)?$/i.test(h) && !(h in Object.prototype)))):[];}
  function hosts(){return validHosts((global.api_data||{}).Server);}
  function samples(host,kind){
    const values=(data.hosts[host]||{})[kind],cutoff=Date.now()-week;
    return Array.isArray(values)?values.filter(v=>v && Number.isFinite(v.t) && v.t>cutoff && Number.isFinite(v.ms)).slice(0,6):[];
  }
  function summary(host){
    let n=0,good=0,cost=0;
    const last={};
    ['home','chapter','reader','probe'].forEach(kind=>{
      const values=samples(host,kind);
      last[kind]=values[0];
      values.forEach((v,i)=>{
        const weight=(kind==='probe'?0.35:1)*Math.pow(.72,i)/(1+(Date.now()-v.t)/86400000);
        n+=weight;
        if(v.ok)good+=weight;
        cost+=weight*(v.ok?Math.min(12000,v.ms):16000);
      });
    });
    return {last:last,good:good,score:(cost+2400)/(n+0.3)};
  }
  function order(list){return validHosts(list).sort((a,b)=>summary(a).score-summary(b).score || Number(b===data.chosen)-Number(a===data.chosen));}
  function activate(host){global.api_host=host;global.api_line_index=hosts().indexOf(host)+1;}
  function configure(source){
    source=Object.assign({},source,{Server:validHosts(source && source.Server),Setting:validHosts(source && source.Setting)});
    global.api_data=source;global.setting_host=source.Setting[0];
    const list=hosts();if(list.length)activate(list.includes(data.chosen)?data.chosen:order(list)[0]);emit();
  }
  function choose(host){if(!hosts().includes(host))return;activate(host);data.chosen=host;persist();}
  function record(host,kind,ok,ms){
    if(!hosts().includes(host))return;
    const row=data.hosts[host]||(data.hosts[host]={});
    if(kind!=='probe'){
      row.failures=ok?0:1+(row.observed>Date.now()-week ? Number(row.failures)||0 : 0);row.observed=Date.now();
    }
    row[kind]=[{t:Date.now(),ok:!!ok,ms:Math.max(1,Math.round(ms))}].concat(samples(host,kind)).slice(0,6);
    Object.keys(data.hosts).filter(h=>!hosts().includes(h)).forEach(h=>delete data.hosts[h]);
    persist();
  }
  function fallback(original,other){
    const row=data.hosts[original]||{};
    if(global.api_host===original && row.observed>Date.now()-week && row.failures>=2)choose(other);
  }
  Object.assign(exports,{ready,hosts,order,summary,record,configure,choose,fallback,
    subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);}});
},2158,[2]);
