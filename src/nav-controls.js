__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),Icon=require(deps[2]).default;
  const nav=require(deps[3]),colors=require(deps[4]).colors,el=React.createElement;
  function home(){
    const root=nav.navigationRef.current;
    if(root)root.resetRoot({index:0,routes:[{name:'Main'}]});
  }
  function Controls({beforeBack,ink}){
    // Bind to the visible entry. A second tap during dismissal must not pop its parent.
    const navigation=require(deps[5]).useNavigation();
    function back(){
      const root=nav.navigationRef.current;
      if(!root || !navigation.isFocused())return;
      const key=root.getCurrentRoute().key;
      if(beforeBack)beforeBack();
      if(root.getCurrentRoute().key===key)navigation.goBack();
    }
    function button(label,icon,press){
      return el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:label,onPress:press,
        style:{width:44,height:44,alignItems:'center',justifyContent:'center'}},el(Icon,{name:icon,size:19,color:ink||'white'}));
    }
    return el(RN.View,{style:{flexDirection:'row',alignItems:'center'}},
      button('返回上一层','chevron-left',back),button('回到首页','home',home));
  }
  function frame(content){
    return el(RN.View,{style:{flex:1,backgroundColor:colors.main,paddingTop:RN.StatusBar.currentHeight||0}},
      el(Controls,{}),content);
  }
  function surface(){return global.darkMode==='1'?colors.backgroundDark:'white';}
  function PageStatus({message,actions,loadingLabel}){
    const dark=global.darkMode==='1',ink=dark?colors.textPrimaryDark:colors.main;
    const accent=dark?'#FFAA67':'#964400',backgroundColor=surface();
    return el(RN.View,{style:{flex:1,backgroundColor,paddingTop:RN.StatusBar.currentHeight||0}},
      el(RN.StatusBar,{hidden:false,translucent:true,backgroundColor:'transparent',barStyle:dark?'light-content':'dark-content'}),
      el(Controls,{ink}),el(RN.View,{style:{flex:1,justifyContent:'center',alignItems:'center',padding:24}},
        message?el(RN.Text,{accessibilityLiveRegion:'polite',style:{fontSize:16,color:ink,textAlign:'center'}},message):
          el(RN.ActivityIndicator,{accessibilityLabel:loadingLabel||'正在加载',color:colors.secondary}),
        !message && loadingLabel && el(RN.Text,{style:{color:ink,marginTop:12,fontSize:14}},loadingLabel),
        !!message && (actions||[]).filter(Boolean).map(([label,press])=>el(RN.TouchableOpacity,{key:label,accessibilityRole:'button',onPress:press,
          style:{minHeight:44,paddingHorizontal:16,justifyContent:'center'}},el(RN.Text,{style:{color:accent,fontSize:16}},label)))));
  }
  exports.standalone=function(Component){
    return function Secondary(props){return frame(el(Component,props));};
  };
  exports.Controls=Controls;exports.PageStatus=PageStatus;exports.surface=surface;
},2180,[55,2,810,825,729,441]);
