__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]), RN=require(deps[1]), history=require(deps[2]), Cloud=require(deps[3]).default;
  const Card=require(deps[4]).default, grid=require(deps[5]).comicVerticalListStyle, colors=require(deps[6]).colors;
  const el=React.createElement;
  function History(props){
    const [remote,setRemote]=React.useState(false);
    const [rows,setRows]=React.useState(null),[error,setError]=React.useState(false);
    const dark=global.darkMode==='1',surface=dark?colors.backgroundDark:'white',ink=dark?colors.textPrimaryDark:colors.tertiary;
    React.useEffect(()=>{
      let rev=0,alive=true;
      function refresh(){const n=++rev;history.list().then(list=>{if(alive && n===rev){setRows(list);setError(false);}},()=>{if(alive && n===rev)setError(true);});}
      refresh();const off=history.subscribe(refresh);
      const focus=props.navigation && props.navigation.addListener('focus',refresh);
      return ()=>{alive=false;off();if(focus)focus();};
    },[]);
    function tab(title,value){
      const active=value===remote;
      return el(RN.TouchableOpacity,{accessibilityRole:'tab',accessibilityLabel:title,accessibilityState:{selected:active},onPress:()=>setRemote(value),
        style:{paddingHorizontal:14,minHeight:44,justifyContent:'center',borderBottomWidth:3,borderBottomColor:active?colors.secondary:'transparent'}},
        el(RN.Text,{style:{fontSize:14,color:ink,fontWeight:active?'bold':'normal'}},title));
    }
    function render({item}){
      const progress=(item.episode?'第 '+item.episode+' 话 · ':'')+'第 '+(item.page+1)+' / '+item.total+' 页';
      return el(Card,{item,readingProgress:progress,historyChapter:item.chapter,
        containerStyle:grid.listCardContainer,categoryStyle:grid.listCategory});
    }
    return el(RN.View,{style:{flex:1,backgroundColor:surface}},
      el(RN.View,{style:{flexDirection:'row',paddingHorizontal:4,borderBottomWidth:RN.StyleSheet.hairlineWidth,borderBottomColor:dark?colors.tertiary:colors.primary}},tab('本机记录',false),tab('账号记录',true)),
      remote?el(Cloud,props):rows===null && !error?el(RN.ActivityIndicator,{color:colors.secondary,style:{margin:20}}):
        el(RN.FlatList,{data:rows||[],numColumns:3,keyExtractor:item=>item.id,renderItem:render,initialNumToRender:6,maxToRenderPerBatch:6,windowSize:5,
          contentContainerStyle:{paddingHorizontal:'2%',paddingBottom:10},ListEmptyComponent:el(RN.Text,{style:{color:ink,margin:15}},error?'读取记录失败':'还没有本机观看记录')}));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=History;
},2162,[55,2,2161,2035,1424,1620,729]);
