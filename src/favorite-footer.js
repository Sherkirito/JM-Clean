__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]), RN=require(deps[1]), el=React.createElement;
  exports.loadMore=function(view,url){
    const props=view.props, state=props.Favorite;
    if(state.requestId!=null)return;
    if(state.error && state.retryPage===1)return props.refreshData();
    if(!state.ended)return props.favorite(url,{folder_id:props.folder_id,o:props.sort},true,true);
  };
  exports.footer=function(view,styles,colors,dark){
    const state=view.props.Favorite, box={alignItems:'center',paddingVertical:16};
    if(state.isLoadMore)return el(RN.ActivityIndicator,{style:box,color:colors.secondary});
    if(state.ended && !state.error)return el(RN.View,{style:box},el(RN.Text,{
      style:{color:dark==='1'?colors.textPrimaryDark:colors.main}
    },'已经到底啦'));
    return el(RN.View,{style:box},el(RN.TouchableOpacity,{
      accessibilityRole:'button',style:styles.loadMoreButton,onPress:view.onEndReached
    },el(RN.Text,{style:styles.loadMoreText},state.error||'加载更多')));
  };
},2178,[55,2]);
