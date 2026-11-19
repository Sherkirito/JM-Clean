__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,Chapters=require(deps[3]).default,Comments=require(deps[4]).default;
  const Icon=require(deps[5]).default,lang=require(deps[6]).lang,el=React.createElement;
  function Sheet({kind,chapter,feed,navigation,onDismiss,onSelect,reduceMotion}){
    const anim=React.useRef(new RN.Animated.Value(0)).current,closing=React.useRef(false),[ready,setReady]=React.useState(false);
    const dark=global.darkMode==='1',title=lang(kind==='chapters'?'章節':'評論');
    function move(to,duration,callback){
      RN.Animated.timing(anim,{toValue:to,duration:reduceMotion?0:duration,easing:RN.Easing.out(RN.Easing.cubic),useNativeDriver:true}).start(({finished})=>{if(finished)callback();});
    }
    function close(){
      if(!closing.current){closing.current=true;RN.Keyboard.dismiss();move(0,110,onDismiss);}
      return true;
    }
    React.useEffect(()=>{
      function opened(){if(!closing.current)setReady(true);}
      move(1,150,opened);
      const back=()=>navigation.isFocused() && close();
      const sub=RN.BackHandler.addEventListener('hardwareBackPress',back);
      return ()=>{closing.current=true;anim.stopAnimation();sub.remove();};
    },[]);
    return el(RN.View,{style:[RN.StyleSheet.absoluteFill,{zIndex:20,elevation:8,justifyContent:'flex-end'}]},
      el(RN.Animated.View,{pointerEvents:'none',style:[RN.StyleSheet.absoluteFill,{backgroundColor:'black',opacity:anim.interpolate({inputRange:[0,1],outputRange:[0,.4]})}]}),
      el(RN.TouchableWithoutFeedback,{accessibilityRole:'button',accessibilityLabel:lang('收起面板'),onPress:close},el(RN.View,{style:{flex:1}})),
      el(RN.Animated.View,{accessibilityViewIsModal:true,style:{height:'76%',backgroundColor:dark?colors.backgroundDark:'white',borderTopLeftRadius:10,borderTopRightRadius:10,overflow:'hidden',
        transform:[{translateY:anim.interpolate({inputRange:[0,1],outputRange:[36,0]})}],opacity:anim}},
        el(RN.View,{style:{backgroundColor:colors.main,minHeight:48,paddingLeft:15,flexDirection:'row',alignItems:'center'}},
          el(RN.Text,{accessibilityRole:'header',style:{flex:1,color:'white',fontSize:16,fontWeight:'bold'}},title),
          el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:lang('关闭面板'),onPress:close,style:{minHeight:48,width:48,alignItems:'center',justifyContent:'center'}},el(Icon,{name:'times',size:18,color:'white'}))),
        ready?(kind==='chapters'?el(Chapters,{chapter,onSelect}):el(Comments,{chapter,feed,navigation})):null));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=Sheet;
},2168,[55,2,729,2166,2167,810,651]);
