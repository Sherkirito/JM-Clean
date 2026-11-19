__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),Icon=require(deps[2]).default,Check=require(deps[3]).default;
  const Controls=require(deps[4]).Controls,colors=require(deps[5]).colors,el=React.createElement;
  function Header(props){
    const [checked,setChecked]=React.useState(false);
    return el(RN.View,{style:[{minHeight:45,flexDirection:'row',alignItems:'center',paddingRight:8,backgroundColor:colors.main},props.headerStyle]},
      el(Controls,{beforeBack:props.handleBackButtonClick}),el(RN.View,{style:{flex:1,marginHorizontal:5}},
        React.isValidElement(props.title)?props.title:el(RN.Text,{numberOfLines:1,style:{color:'white'}},props.title)),
      props.checkBox && el(Check,{boxType:'square',value:checked,tintColors:{true:'white',false:'white'},
        onValueChange:value=>{setChecked(value);props.setSpoiled(value?'2':'1');}}),
      props.checkBox && el(RN.Text,{style:{color:'white'}},'有剧透'),
      props.rightButtonFunction && el(RN.TouchableOpacity,{accessibilityRole:'button',onPress:props.rightButtonFunction,
        style:{minHeight:44,minWidth:42,alignItems:'center',justifyContent:'center',flexDirection:'row'}},
        props.rightButtonIcon && el(Icon,{name:props.rightButtonIcon,size:22,style:[{color:colors.secondary},props.rightButtonIconStyle]}),
        props.rightButtonText && el(RN.Text,{style:{color:colors.secondary}},props.rightButtonText)));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=Header;
},2048,[55,2,810,1427,2180,729]);
