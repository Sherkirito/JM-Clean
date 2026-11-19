__d(function(global,require,_i,_a,module,exports,deps){
  // Store only reusable shapes of manually hidden comments. Destinations and account numbers are discarded.
  const fold=require(deps[0]).forMatching;
  const number='[0-9零〇一二三四五六七八九幺两兩壹贰貳叁參肆伍陆陸柒捌玖]';
  const shapes=[
    {id:'link',title:'网址',detect:/https?:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+/ig,pattern:'https?://[a-z0-9-]+\\.[a-z0-9.-]+'},
    {id:'handle',title:'联系账号',detect:/@[a-z][a-z0-9_]{4,30}\b/ig,pattern:'@[a-z][a-z0-9_]{4,30}\\b'},
    {id:'number',title:'拆分或连续号码',detect:new RegExp(number+'(?:[ !.,，。·、_\\-]{0,3}'+number+'){5,13}','g'),pattern:number+'(?:[ !.,，。·、_\\-]{0,3}'+number+'){5,13}'},
    // Ads reuse the same sentence across accounts and split it with dashes, dots, spaces or emoji.
    {id:'phrase',title:'重复话术'}
  ];
  const skip=/(?:教程|翻译|翻譯|作者|来源|來源|原文|章节|章節|书号|書號|编号|編號|作品|话数|話數|頁碼|页码|发布日|發布日|公式|参考|參考|画师|畫師|出处|出處|漫画|漫畫|收藏|验证码|驗證碼|错误码|錯誤碼|生日|日期|更新时间|更新時間|官方群|官方網站|官方网站)/;
  const gap='[\\s:：=→👉(（【]{0,5}';
  // A learned phrase tolerates up to three non-Han characters between its characters.
  // Spell the range literally: RE2JS fails on \p{Han} together with case-insensitive matching.
  const joint='[^㐀-鿿]{0,3}';
  const han=/^[㐀-鿿]$/, clause=/^[，。！？；：、（）【】「」『』“”"'!?;:,()\n]$/;
  const PHRASE_MIN=6,PHRASE_MAX=12,MAX_SHAPES=5;
  function validShape(anchor,type){
    if(typeof anchor!=='string')return false;
    if(type==='phrase')return new RegExp('^[\\u3400-\\u9fff]{'+PHRASE_MIN+','+PHRASE_MAX+'}$').test(anchor);
    return ['link','number','handle'].includes(type) && /^[㐀-鿿]{3,10}$/.test(anchor);
  }
  function pattern(anchor,type){
    if(!validShape(anchor,type))return null;
    if(type==='phrase')return Array.from(anchor).join(joint);
    if(skip.test(anchor))return null;
    return anchor+gap+shapes.find(s=>s.id===type).pattern;
  }
  function canonicalPattern(source){
    // Older suggestions stored their literal anchor in its original script.
    // Recognize our exact template before folding that anchor alone.
    if(typeof source!=='string')return source;
    const end=source.indexOf(gap);
    if(end<3||end>10)return source;
    const anchor=source.slice(0,end);
    return shapes.some(shape=>shape.id!=='phrase' && pattern(anchor,shape.id)===source) ? fold(anchor)+source.slice(end) : source;
  }
  function phrases(text){
    // Join Han characters separated by at most three non-Han marks that do not end a clause.
    const runs=[];let run='',pending=0;
    for(const ch of Array.from(text)){
      if(han.test(ch)){run+=ch;pending=0;continue;}
      if(run && !clause.test(ch) && pending<3){pending++;continue;}
      if(run.length>=PHRASE_MIN)runs.push(run);
      run='';pending=0;
    }
    if(run.length>=PHRASE_MIN)runs.push(run);
    const seen=new Set();
    return runs.map(r=>r.slice(0,PHRASE_MAX)).filter(r=>!seen.has(r) && seen.add(r))
      .map((r,i)=>({r,i})).sort((a,b)=>b.r.length-a.r.length||a.i-b.i).slice(0,3).map(x=>x.r);
  }
  function extract(text){
    const found=[];
    for(const shape of shapes){
      if(!shape.detect)continue;
      shape.detect.lastIndex=0;
      let hit;
      while((hit=shape.detect.exec(text)) && found.length<3){
        // Do not learn a substring of a long sentence. Prefer a short standalone call to action.
        const lead=text.slice(Math.max(0,hit.index-22),hit.index);
        const anchor=/(?:^|[^㐀-鿿])([㐀-鿿]{3,10})[\s:：=→👉(（【]{0,5}$/.exec(lead);
        if(!anchor || !pattern(anchor[1],shape.id))continue;
        if(!found.some(x=>x.anchor===anchor[1] && x.type===shape.id))found.push({anchor:anchor[1],type:shape.id});
      }
    }
    for(const anchor of phrases(text)){
      if(found.length>=MAX_SHAPES)break;
      found.push({anchor,type:'phrase'});
    }
    return found;
  }
  function suggestions(v){
    if(v.learning===false)return [];
    const seen=new Map(),ignored=new Set((v.ignored||[]).map(canonicalPattern)),active=new Set(v.rules.filter(r=>r.kind==='regex').map(r=>r.learned?canonicalPattern(r.value):r.value));
    v.comments.slice(-100).forEach(c=>{
      if(!c || !c.author || !Array.isArray(c.shapes))return;
      c.shapes.forEach(shape=>{
        if(!shape || typeof shape.anchor!=='string')return;
        const anchor=fold(shape.anchor),source=pattern(anchor,shape.type);
        if(!source || active.has(source) || ignored.has(source))return;
        let item=seen.get(source);
        if(!item){
          const title=shapes.find(x=>x.id===shape.type).title;
          item={pattern:source,anchor,type:shape.type,title,label:shape.type==='phrase'?'「'+anchor+'」'+title:anchor+' ＋ '+title,cids:new Set(),authors:new Set()};
          seen.set(source,item);
        }
        item.cids.add(c.id);item.authors.add(c.author);
      });
    });
    // Two accounts repeating the same shape is enough evidence; a single account needs three comments.
    return Array.from(seen.values()).filter(x=>x.cids.size>=2 && (x.authors.size>=2 || x.cids.size>=3))
      .sort((a,b)=>b.authors.size-a.authors.size||b.cids.size-a.cids.size).slice(0,12)
      .map(x=>({pattern:x.pattern,anchor:x.anchor,title:x.title,label:x.label,count:x.cids.size,authors:x.authors.size}));
  }
  Object.assign(exports,{extract,suggestions,canonicalPattern,validShape,MAX_SHAPES});
},2174,[651]);
