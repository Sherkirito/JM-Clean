__d(function(global,require,_i,_a,module,exports,deps){
  // 阅读页底栏：进度条一行、功能按钮一行，同一块底色，没有分层和缝隙。
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,Icon=require(deps[3]).default;
  const Progress=require(deps[4]).default,Favorite=require(deps[5]).default,el=React.createElement;
  // 按钮行固定高度：原版收藏组件内部带有会撑高布局的元素，固定高度并裁掉溢出。
  const styles=RN.StyleSheet.create({
    row:{flexDirection:'row',alignItems:'center',paddingHorizontal:6,height:56,overflow:'hidden'},
    item:{flex:1,height:56,alignItems:'center',justifyContent:'center'},
    favorite:{flex:1,height:56,alignItems:'center',justifyContent:'center',overflow:'hidden'},
    favoriteInner:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center'},
    text:{color:'#e8e8ea',fontSize:11,marginTop:5}
  });
  function BottomBar(props){
    const {data,mode,autoRunning,autoSeconds,onAction}=props;
    const rtl=mode==='rtl'||mode==='spread-rtl';
    function item(key,label,icon,active){
      return el(RN.TouchableOpacity,{key,accessibilityRole:'button',accessibilityLabel:label,onPress:()=>onAction(key),style:styles.item},
        el(Icon,{name:icon,size:17,color:active?colors.secondary:'white',solid:true}),
        el(RN.Text,{numberOfLines:1,style:[styles.text,active&&{color:colors.secondary}]},label));
    }
    return el(RN.View,{style:{backgroundColor:'#161618',paddingTop:4}},
      el(Progress,{count:props.count,start:props.start,end:props.end,rtl,prev:props.prev,next:props.next,
        onChapter:props.onChapter,onScrub:props.onScrub,onTouch:props.onTouch}),
      el(RN.View,{style:styles.row},
        item('chapters','目录','list-ul'),
        item('comments','评论','comment-dots'),
        item('auto',autoRunning?'暂停 '+autoSeconds+'s':'自动翻页',autoRunning?'pause':'play',autoRunning),
        item('settings','设置','sliders-h'),
        !data.offline && el(RN.View,{key:'favorite',style:styles.favorite},
          el(Favorite,{data,containerStyle:styles.favoriteInner,textStyle:styles.text,color:'white',size:17}))));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=BottomBar;
},2057,[55,2,729,810,2163,2060]);
