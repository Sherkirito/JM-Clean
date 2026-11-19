__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),store=require(deps[2]),lang=require(deps[3]).lang,colors=require(deps[4]).colors,nav=require(deps[5]),el=React.createElement;
  function useFilters(){
    const [state,setState]=React.useState(store.get),[error,setError]=React.useState(false);
    function load(){setError(false);store.load().catch(()=>setError(true));}
    React.useEffect(()=>{let mounted=true;const off=store.subscribe(setState);store.load().then(s=>{if(mounted)setState(s);},()=>{if(mounted)setError(true);});return ()=>{mounted=false;off();};},[]);
    return {state,error,retry:load};
  }
  function button(label,press,style){
    const color=global.darkMode==='1'?colors.primary:colors.tertiary;
    return el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:lang(label),onPress:press,style:{minHeight:44,paddingHorizontal:12,alignItems:'center',justifyContent:'center'}},el(RN.Text,{style:Object.assign({fontSize:14,color},style)},lang(label)));
  }
  function Manage(){return button('屏蔽管理',()=>nav.navigate('CommentFilters'));}
  function rememberAuthors(items,state){
    store.rememberAuthors(items,state).catch(()=>{
      setTimeout(()=>store.rememberAuthors(items,store.get()).catch(()=>{
        RN.ToastAndroid.show(lang('自动拉黑保存失败，重新打开评论可重试'),RN.ToastAndroid.SHORT);
      }),1000);
    });
  }
  function Actions({item}){
    const uid=store.userId(item),cid=store.commentId(item);
    if(!uid && !cid)return null;
    function save(group){store.hide(group,item).catch(()=>RN.Alert.alert(lang('保存失败'),lang('请重试')));}
    function menu(){
      const items=[{text:lang('取消'),style:'cancel'}];
      if(cid)items.push({text:lang('屏蔽这条评论'),onPress:()=>save('comments')});
      if(uid)items.push({text:lang('拉黑此用户'),onPress:()=>save('users')});
      RN.Alert.alert(lang('评论操作'),(item.username||'')+(uid?' · ID '+uid:'')+'\n'+lang('仅在本机生效，可在屏蔽管理中撤销。'),items,{cancelable:true,jmVerbatimMessage:true});
    }
    return el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:lang('评论操作')+' '+(item.username||''),onPress:menu,hitSlop:{top:3,bottom:3},style:{minWidth:44,minHeight:34,alignItems:'center',justifyContent:'center'}},el(RN.Text,{style:{color:global.darkMode==='1'?colors.primary:colors.tertiary,fontSize:20,fontWeight:'bold'}},'⋯'));
  }
  function withFilters(Component){
    return function FilteredForum(props){
      const {state,error,retry}=useFilters();
      return el(React.Fragment,null,error && button('读取屏蔽设置失败，点此重试',retry),el(Component,Object.assign({},props,{commentFilters:state})));
    };
  }
  Object.assign(exports,{useFilters,Manage,Actions,withFilters,rememberAuthors,visible:store.visible});
},2171,[55,2,2169,651,729,825]);
