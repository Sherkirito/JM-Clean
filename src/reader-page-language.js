__d(function(global,require,_i,_a,module,exports,deps){
  const locale=require(deps[0]);
  // Runs in the source chapter template. Only text and descriptive attributes are localized.
  function install(pairs){
    if(document.documentElement.lang!=='zh-CN')document.documentElement.lang='zh-CN';
    if(window.jm2ChineseText)return;
    window.jm2ChineseText=true;
    const map=Object.create(null);
    for(let i=0;i<pairs.length;i+=2)map[pairs[i]]=pairs[i+1];
    const han=/[\u3400-\u9fff\uf900-\ufaff]/, kana=/[\u3041-\u306d\u306f-\u30ff]/;
    const excluded='script,style,noscript,textarea,input,code,pre,canvas,svg,[contenteditable]:not([contenteditable="false"])';
    function simplify(text){
      if(!han.test(text))return text;
      return text.replace(/(?:https?:\/\/|mailto:)[^\s<>"「」。，！；]+|[@＠][a-zA-Z0-9_\-\u3400-\u9fff]+|[\u3041-\u30ff\u3400-\u9fff\uf900-\ufaff]+/gi,part=>{
        if(!han.test(part)||kana.test(part)||/^(?:https?:|mailto:|[@＠])/i.test(part))return part;
        return part.replace(/./g,c=>map[c]||c);
      });
    }
    function localizeText(node){
      if(!node.parentElement||node.parentElement.closest(excluded))return;
      const changed=simplify(node.data);
      if(changed!==node.data)node.data=changed;
    }
    const attrs=['alt','title','aria-label','placeholder'];
    function labels(node){
      for(const name of attrs){
        const value=node.getAttribute(name);
        if(value){const copy=simplify(value);if(copy!==value)node.setAttribute(name,copy);}
      }
    }
    function visit(node){
      if(node.nodeType===3){localizeText(node);return;}
      if(node.nodeType!==1||node.matches('script,style,canvas,svg'))return;
      labels(node);node.querySelectorAll('[alt],[title],[aria-label],[placeholder]').forEach(labels);
      const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);let text;
      while((text=walker.nextNode()))localizeText(text);
    }
    if(document.body){
      visit(document.body);
      new MutationObserver(changes=>changes.forEach(change=>{
        if(change.type==='attributes')labels(change.target);
        else if(change.type==='characterData')localizeText(change.target);
        else change.addedNodes.forEach(visit);
      })).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs});
    }
  }
  let cached;
  exports.script=function(){
    if(!cached){
      const map=locale.characters();
      const pairs=Object.keys(map).filter(k=>/^[\u3400-\u9fff\uf900-\ufaff]$/.test(k) && map[k].length===1 && k!==map[k]).map(k=>k+map[k]).join('');
      cached=';('+install.toString()+')('+JSON.stringify(pairs)+');true;';
    }
    return cached;
  };
},2175,[651]);
