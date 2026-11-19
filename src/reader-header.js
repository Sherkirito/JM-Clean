__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),Animated=require(deps[2]),Icon=require(deps[3]).default;
  const Controls=require(deps[4]).Controls,share=require(deps[5]).default,el=React.createElement;
  function Header({IsShow,data,Setting,paddingTop,topPosition,backgroundColor}){
    const host=Setting && Setting.info && Setting.info.main_web_host;
    return el(Animated.View,{pointerEvents:IsShow?'auto':'none',importantForAccessibility:IsShow?'auto':'no-hide-descendants',
      animation:IsShow?'slideInDown':'slideOutUp',useNativeDriver:true,duration:100,
      style:{position:'absolute',top:topPosition||0,left:0,right:0,zIndex:2,paddingTop:paddingTop||0,
        flexDirection:'row',alignItems:'center',backgroundColor:backgroundColor||'rgba(35,35,35,0.89)'}},
      el(Controls,{}),el(RN.Text,{numberOfLines:1,style:{flex:1,color:'white',marginHorizontal:5}},data.name),
      !!host && !data.offline && el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:'分享',style:{width:44,height:44,alignItems:'center',justifyContent:'center'},
        onPress:()=>share.open({title:data.name,url:'https://'+host+'/album/'+data.id}).catch(()=>{})},el(Icon,{name:'share-alt',size:19,color:'white'})));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=Header;
},2061,[55,2,829,810,2180,2062]);
