__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,el=React.createElement;
  const lang=require(deps[3]).lang,size=10,groupWidth=88;
  function Chapters({chapter,onSelect}){
    const series=Array.isArray(chapter.series)?chapter.series:[];
    const current=series.findIndex(item=>item && String(item.id)===String(chapter.id));
    const [group,setGroup]=React.useState(Math.max(0,Math.floor(current/size)));
    const [visited,setVisited]=React.useState(()=>new Set());
    const groups=React.useMemo(()=>Array.from({length:Math.ceil(series.length/size)},(_,i)=>i),[series.length]);
    const dark=global.darkMode==='1',ink=dark?colors.textPrimaryDark:colors.main,muted=dark?'#aaa':colors.tertiary;
    React.useEffect(()=>{
      let live=true;
      RN.AsyncStorage.getItem('series_history_'+(Number(chapter.series_id)>0?chapter.series_id:chapter.id)).then(raw=>{
        const v=JSON.parse(raw);if(live && v && Array.isArray(v[0]))setVisited(new Set(v[0].map(String)));
      }).catch(()=>{});return ()=>{live=false;};
    },[chapter.id]);
    if(!series.length)return el(RN.Text,{style:{color:muted,padding:18}},lang('当前为单篇，没有其他章节'));
    const start=group*size;
    function renderGroup({item}){
      const name=(item*size+1)+'–'+Math.min(series.length,(item+1)*size);
      return el(RN.TouchableOpacity,{accessibilityRole:'tab',accessibilityLabel:lang('章节范围 ')+name,accessibilityState:{selected:item===group},onPress:()=>setGroup(item),
        style:{width:groupWidth,height:44,alignItems:'center',justifyContent:'center',borderBottomWidth:2,borderBottomColor:item===group?colors.secondary:'transparent'}},
        el(RN.Text,{style:{color:item===group?colors.secondary:muted,fontWeight:item===group?'bold':'normal'}},name));
    }
    return el(RN.View,{style:{flex:1}},groups.length>1 && el(RN.View,{style:{height:45,borderBottomWidth:RN.StyleSheet.hairlineWidth,borderColor:colors.tertiary}},
      el(RN.FlatList,{data:groups,horizontal:true,showsHorizontalScrollIndicator:false,initialScrollIndex:group,
        getItemLayout:(_,i)=>({length:groupWidth,offset:groupWidth*i,index:i}),keyExtractor:String,renderItem:renderGroup,extraData:group})),
      el(RN.ScrollView,{key:String(group),keyboardShouldPersistTaps:'handled',contentContainerStyle:{paddingHorizontal:12,paddingVertical:8,flexDirection:'row',flexWrap:'wrap'}},
        series.slice(start,start+size).map((item,i)=>{
          if(!item || item.id==null)return null;
          const active=String(item.id)===String(chapter.id),episode=item.sort||item.episode||start+i+1;
          const title=lang('第 '+episode+' 话'),name=String(item.name||'').trim();
          return el(RN.View,{key:String(item.id),style:{width:'50%',padding:3}},el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:title,accessibilityState:{selected:active},
            onPress:()=>onSelect(item,episode),style:{minHeight:48,borderRadius:5,paddingHorizontal:10,paddingVertical:6,justifyContent:'center',
              backgroundColor:active?colors.secondary:dark?'#323232':colors.primary}},
            el(RN.Text,{style:{fontSize:14,fontWeight:active?'bold':'normal',color:active?'white':visited.has(String(item.id))?colors.secondary:ink}},title),
            !!name && el(RN.Text,{numberOfLines:1,style:{fontSize:12,color:active?'white':muted}},name)));
        })));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=Chapters;
},2166,[55,2,729,651]);
