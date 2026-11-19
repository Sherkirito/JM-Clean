__d(function(global,require,_i,_a,module,exports,deps){
  const simplify=require(deps[0]);
  const han=/[\u3400-\u9fff\uf900-\ufaff]/,kana=/[\u3041-\u306d\u306f-\u30ff]/;
  const tokens=/(?:https?:\/\/|mailto:)[^\s<>"「」。，！；]+|[@＠][a-zA-Z0-9_\-\u3400-\u9fff]+|[\u3041-\u30ff\u3400-\u9fff\uf900-\ufaff]+/gi;
  function convert(value,ui){
    if(typeof value!=='string'||!han.test(value))return value;
    return value.replace(tokens,part=>{
      if(!han.test(part)||kana.test(part)||/^(?:https?:|mailto:|[@＠])/i.test(part))return part;
      return simplify(ui?part.replace(phrases,word=>terms[word]):part);
    });
  }
  function display(value){return convert(value,false);}
  // Compare Chinese characters independently of surrounding markup, URLs or kana.
  // Preserve punctuation, whitespace and all non-Han characters for RE2.
  function forMatching(text){return text.replace(/[\u3400-\u9fff\uf900-\ufaff]+/g,simplify);}
  const terms={'觀看紀錄':'观看记录','搜尋':'搜索','帳號':'账号','紀錄':'记录','回覆':'回复','設定':'设置','登入':'登录','登出':'退出登录','資料夾':'文件夹','網路':'网络','載入':'加载','註冊':'注册'};
  const phrases=new RegExp(Object.keys(terms).join('|'),'g');
  function lang(value){
    if(typeof value!=='string')return value;
    if(value==='EMAIL')return '邮箱';
    if(value==='請輸入註冊時的EMAIL')return '请输入注册时的邮箱';
    if(value==='LV')return '等级';
    if(value==='Hi！')return '你好！';
    if(value==='OK')return '确定';
    if(value==='Ohoh...目前查無資料唷')return '暂无数据';
    // Terminology belongs to interface copy. Book titles and comments use display().
    return convert(value,true);
  }
  function children(value){
    if(!Array.isArray(value))return display(value);
    let result=value;
    value.forEach((part,i)=>{
      const rendered=children(part);
      if(rendered!==part){if(result===value)result=value.slice();result[i]=rendered;}
    });
    return result;
  }
  function textProps(props){
    if(props.jmVerbatim){const copy=Object.assign({},props);delete copy.jmVerbatim;return copy;}
    const content=children(props.children),label=display(props.accessibilityLabel);
    return content===props.children && label===props.accessibilityLabel?props:Object.assign({},props,{children:content,accessibilityLabel:label});
  }
  function inputProps(props){
    const hint=props.jmVerbatimPlaceholder?props.placeholder:lang(props.placeholder),label=lang(props.accessibilityLabel);
    if(!props.jmVerbatimPlaceholder && hint===props.placeholder && label===props.accessibilityLabel)return props;
    const copy=Object.assign({},props,{placeholder:hint,accessibilityLabel:label});delete copy.jmVerbatimPlaceholder;return copy;
  }
  Object.assign(exports,{display,lang,forMatching,textProps,inputProps,characters:simplify.characters});
},651,[654]);
