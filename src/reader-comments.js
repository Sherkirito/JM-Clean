__d(function(global,require,_i,_a,module,exports,deps){
  const React=require(deps[0]),RN=require(deps[1]),colors=require(deps[2]).colors,connect=require(deps[3]).connect;
  const Comment=require(deps[4]).default,Login=require(deps[5]).default,client=require(deps[6]).default,api=require(deps[7]),el=React.createElement;
  const lang=require(deps[8]).lang;
  function rowsFor(items){
    const rows=[];
    items.forEach(parent=>{
      const children=Array.isArray(parent.replys)?parent.replys.filter(r=>r && typeof r==='object'):[];
      [parent].concat(children).forEach((item,i)=>{
        const info=item.expinfo||{};
        rows.push({key:i?parent.CID+'-r'+(item.CID||i)+'-'+i:String(parent.CID),parent,item:Object.assign({},item,{expinfo:Object.assign({},info,{badges:Array.isArray(info.badges)?info.badges:[]})}),reply:i>0,last:i===children.length});
      });
    });
    return rows;
  }
  function Comments({chapter,feed,navigation,loggedIn,host}){
    const [data,setData]=React.useState(feed.get),[rules,setRules]=React.useState(false),[login,setLogin]=React.useState(false);
    const live=React.useRef(false),compose=React.useRef(false),scroll=React.useRef(null),restore=React.useRef(feed.scrollY||0);
    const filters=require(deps[9]),settings=filters.useFilters();
    const rows=React.useMemo(()=>rowsFor(filters.visible(data.items,settings.state)),[data.items,settings.state]);
    React.useEffect(()=>{filters.rememberAuthors(data.items,settings.state);},[data.items,settings.state]);
    const target=rows.find(row=>!row.reply && String(row.parent.CID)===data.replyId);
    const reply=target && target.parent,draft=data.replyText||'',sending=data.sending;
    const dark=global.darkMode==='1',ink=dark?'white':colors.main,sub=dark?'#bbb':colors.tertiary,edge=dark?colors.tertiary:colors.primary;
    React.useEffect(()=>{
      live.current=true;const off=feed.subscribe(setData);setData(feed.get());
      const focus=navigation.addListener('focus',()=>{if(compose.current){compose.current=false;feed.load('refresh');}});
      return ()=>{live.current=false;off();focus();};
    },[feed,navigation]);
    function write(parent){
      if(!loggedIn){setLogin(true);return;}
      if(!parent){compose.current=true;navigation.navigate('NewThemeModal',{aid:chapter.id});return;}
      feed.selectReply(String(parent.CID));
    }
    function submit(){
      const ticket=feed.beginReply();
      if(!ticket)return;
      function done(ok,message){
        const active=feed.get().sending && feed.get().replyId===ticket.id;
        feed.finishReply(ticket,ok,message);
        if(ok && active && live.current)RN.Keyboard.dismiss();
      }
      client.fetchPost(api.API_COMMENT_SEND,{aid:chapter.id,comment_id:ticket.id,comment:ticket.text},res=>{
        if(res && Number(res.code)===401 && live.current)setLogin(true);
        done(!!res && Number(res.code)===200,res && res.errorMsg);
      },()=>done(false));
    }
    function btn(title,fn,color,disabled){
      title=lang(title);
      return el(RN.TouchableOpacity,{accessibilityRole:'button',accessibilityLabel:title,disabled:!!disabled,onPress:fn,style:{minHeight:44,paddingHorizontal:12,justifyContent:'center',opacity:disabled ? 0.45 : 1}},el(RN.Text,{style:{color:color||ink,fontSize:14}},title));
    }
    function render({item:row}){
      return el(RN.View,null,el(Comment,{item:row.item,isReply:row.reply,avatarBasePath:host+'/media/users/'}),
        row.last && el(RN.View,{style:{alignItems:'flex-end',borderBottomWidth:RN.StyleSheet.hairlineWidth,borderColor:edge}},btn('回复',()=>write(row.parent),sub)));
    }
    const status=data.busy?el(RN.ActivityIndicator,{accessibilityLabel:lang('正在加载评论'),color:colors.secondary,style:{padding:14}}):
      data.error?btn(chapter.offline?'评论暂时无法加载，点此重试':'加载失败，点此重试',()=>feed.load(data.error===1?'refresh':'more'),colors.secondary):
      data.more?btn('加载更多',()=>feed.load('more'),colors.secondary):null;
    if(chapter.offline && data.error && !data.items.length)return el(RN.View,{style:{padding:16,alignItems:'center'}},status);
    return el(RN.View,{style:{flex:1}},el(RN.FlatList,{ref:scroll,data:rows,keyExtractor:x=>x.key,renderItem:render,
      initialNumToRender:4,maxToRenderPerBatch:4,windowSize:5,keyboardShouldPersistTaps:'handled',
      onContentSizeChange:()=>{if(restore.current && rows.length && scroll.current){scroll.current.scrollToOffset({offset:restore.current,animated:false});restore.current=0;}},
      onScroll:e=>{feed.scrollY=e.nativeEvent.contentOffset.y;},scrollEventThrottle:80,
      onRefresh:()=>feed.load('refresh'),refreshing:data.refreshing,
      onEndReached:()=>{if(feed.scrolled && data.more && !data.busy && !data.error){feed.scrolled=false;feed.load('more');}},
      onScrollBeginDrag:()=>{feed.scrolled=true;},onEndReachedThreshold:.25,
      ListHeaderComponent:el(RN.View,null,el(RN.View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}},btn('讨论须知',()=>setRules(!rules),sub),el(filters.Manage)),
        settings.error && btn('读取屏蔽设置失败，点此重试',settings.retry,sub),
        rules && el(RN.Text,{style:{color:sub,fontSize:13,lineHeight:20,paddingHorizontal:12,paddingBottom:10}},lang('請遵守《社群規範》，劇透請開屏蔽。多次違規將永久刪除帳號。\n1.禁止任何政治話題\n2.禁止留個人聯絡資訊\n3.無意義評論管理員有權扣分/永BAN\n※何謂 【無意義評論】？5555,666,每日刷分,文不對題評論\n4.評論是自由的，但請互相尊重\n5.催更可以但口氣請注意(*重要)'))),
      ListEmptyComponent:!!settings.state && !data.busy && !data.error && el(RN.Text,{style:{color:sub,textAlign:'center',margin:20}},lang(data.items.length?'本页评论已被屏蔽':'暂无评论')),
      ListFooterComponent:status}),
      el(RN.View,{style:{borderTopWidth:RN.StyleSheet.hairlineWidth,borderColor:edge,paddingHorizontal:4}},reply?
        el(RN.View,null,el(RN.TextInput,{autoFocus:true,editable:!sending,accessibilityLabel:lang('回复内容'),jmVerbatimPlaceholder:true,placeholder:lang('回复 ')+(reply.username||''),placeholderTextColor:sub,value:draft,onChangeText:feed.editReply,style:{color:ink,minHeight:44,paddingHorizontal:8}}),
          !!data.replyError && el(RN.Text,{style:{color:ink}},data.replyError),
          el(RN.View,{style:{flexDirection:'row',justifyContent:'flex-end'}},btn(draft?'丢弃草稿':'取消',()=>{RN.Keyboard.dismiss();feed.discardReply();},sub,sending),btn('发送',submit,colors.secondary,sending||!draft.trim()))):
        btn('发表评论',()=>write(null),colors.secondary)),
      login && el(Login,{isModalVisible:true,toggleModal:()=>setLogin(false)}));
  }
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=connect(s=>({loggedIn:s.Member.isLogin,host:s.Setting && s.Setting.info && s.Setting.info.img_host||''}))(Comments);
},2167,[55,2,729,410,1654,1639,648,650,651,2171]);
