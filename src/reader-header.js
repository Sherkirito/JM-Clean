__d(function(global,require,_i,_a,module,exports,deps){
  // 阅读页顶栏：返回、回首页、书名与话数，在线时可喜欢和分享。
  const React=require(deps[0]),RN=require(deps[1]),Icon=require(deps[3]).default;
  const Controls=require(deps[4]).Controls,share=require(deps[5]).default,connect=require(deps[6]).connect;
  const actions=require(deps[7]),api=require(deps[8]),el=React.createElement;
  function TopBar({data,title,subtitle,Setting,Favorite,like}){
    const host=Setting && Setting.info && Setting.info.main_web_host;
    const [liked,setLiked]=React.useState(data.liked===true || Number(data.liked)===1);
    const waiting=React.useRef(false),loading=Favorite && Favorite.isLikeLoading;
    React.useEffect(()=>{
      if(waiting.current && loading===false){
        waiting.current=false;
        if(Favorite.likeResult && Number(Favorite.likeResult.code)===200)setLiked(true);
      }
    },[loading]);
    function button(label,icon,press,color,solid){
      return el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:label,onPress:press,
        style:{width:44,height:48,alignItems:'center',justifyContent:'center'}},el(Icon,{name:icon,size:18,color:color||'white',solid:!!solid}));
    }
    return el(RN.View,{style:{flexDirection:'row',alignItems:'center',minHeight:52,paddingRight:4,backgroundColor:'#161618'}},
      el(Controls,{}),
      el(RN.View,{style:{flex:1,marginHorizontal:4,justifyContent:'center'}},
        el(RN.Text,{numberOfLines:1,style:{color:'white',fontSize:15,fontWeight:'bold'}},title),
        !!subtitle && el(RN.Text,{numberOfLines:1,style:{color:'#a8a8ad',fontSize:12,marginTop:1}},subtitle)),
      !data.offline && button(liked?'已喜欢':'喜欢','heart',()=>{
        if(liked)return;
        waiting.current=true;like(api.API_LIKE_DATA,{id:data.id},true);
      },liked?'#ff5f57':'white',liked),
      !!host && !data.offline && button('分享','share-alt',()=>share.open({title:data.name,url:'https://'+host+'/album/'+data.id}).catch(()=>{})));
  }
  Object.defineProperty(exports,'__esModule',{value:true});
  exports.default=connect(state=>({Favorite:state.Favorite,Setting:state.Setting}),{like:actions.like})(TopBar);
},2061,[55,2,829,810,2180,2062,410,1425,650]);
