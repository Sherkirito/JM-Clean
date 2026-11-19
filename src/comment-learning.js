__d(function(global,require,_i,_a,module,exports,deps){
  // Store only reusable shapes of manually hidden comments. Destinations and account numbers are discarded.
  const fold=require(deps[0]).forMatching;
  const number='[0-9零〇一二三四五六七八九幺两兩壹贰貳叁參肆伍陆陸柒捌玖]';
  const shapes=[
    {id:'link',title:'网址',detect:/https?:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+/ig,pattern:'https?://[a-z0-9-]+\\.[a-z0-9.-]+'},
    {id:'handle',title:'联系账号',detect:/@[a-z][a-z0-9_]{4,30}\b/ig,pattern:'@[a-z][a-z0-9_]{4,30}\\b'},
    {id:'number',title:'拆分或连续号码',detect:new RegExp(number+'(?:[ !.,，。·、_\\-]{0,3}'+number+'){5,13}','g'),pattern:number+'(?:[ !.,，。·、_\\-]{0,3}'+number+'){5,13}'}
  ];
  const skip=/(?:教程|翻译|翻譯|作者|来源|來源|原文|章节|章節|书号|書號|编号|編號|作品|话数|話數|頁碼|页码|发布日|發布日|公式|参考|參考|画师|畫師|出处|出處|漫画|漫畫|收藏|验证码|驗證碼|错误码|錯誤碼|生日|日期|更新时间|更新時間|官方群|官方網站|官方网站)/;
  const gap='[\\s:：=→👉(（【]{0,5}';
  function pattern(anchor,type){
    const shape=shapes.find(s=>s.id===type);
    if(!shape || !/^[\u3400-\u9fff]{3,10}$/.test(anchor)||skip.test(anchor))return null;
    return anchor+gap+shape.pattern;
  }
  function canonicalPattern(source){
    // Older suggestions stored their literal anchor in its original script.
    // Recognize our exact template before folding that anchor alone.
    if(typeof source!=='string')return source;
    const end=source.indexOf(gap);
    if(end<3||end>10)return source;
    const anchor=source.slice(0,end);
    return shapes.some(shape=>pattern(anchor,shape.id)===source) ? fold(anchor)+source.slice(end) : source;
  }
  function extract(text){
    const found=[];
    for(const shape of shapes){
      shape.detect.lastIndex=0;
      let hit;
      while((hit=shape.detect.exec(text)) && found.length<3){
        // Do not learn a substring of a long sentence. Prefer a short standalone call to action.
        const lead=text.slice(Math.max(0,hit.index-22),hit.index);
        const anchor=/(?:^|[^\u3400-\u9fff])([\u3400-\u9fff]{3,10})[\s:：=→👉(（【]{0,5}$/.exec(lead);
        if(!anchor || !pattern(anchor[1],shape.id))continue;
        if(!found.some(x=>x.anchor===anchor[1] && x.type===shape.id))found.push({anchor:anchor[1],type:shape.id});
      }
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
        if(!item){item={pattern:source,anchor,type:shape.type,title:shapes.find(x=>x.id===shape.type).title,cids:new Set(),authors:new Set()};seen.set(source,item);}
        item.cids.add(c.id);item.authors.add(c.author);
      });
    });
    return Array.from(seen.values()).filter(x=>x.cids.size>=3 && x.authors.size>=2)
      .sort((a,b)=>b.cids.size-a.cids.size).slice(0,12).map(x=>({pattern:x.pattern,anchor:x.anchor,title:x.title,count:x.cids.size,authors:x.authors.size}));
  }
  Object.assign(exports,{extract,suggestions,canonicalPattern});
},2174,[651]);
