__d(function (global, require, _i, _a, module, exports, deps) {
  const React=require(deps[0]), RN=require(deps[1]), connect=require(deps[2]).connect;
  const api=require(deps[3]), client=require(deps[4]).default, WebView=require(deps[5]).WebView;
  const Header=require(deps[6]).default, Footer=require(deps[7]).default, keys=require(deps[8]).default || require(deps[8]);
  const el=React.createElement;
  const modes={vertical:'上下条漫',horizontal:'从左往右',rtl:'从右往左','spread-ltr':'双页 · 从左往右','spread-rtl':'双页 · 从右往左'};
  const history=require(deps[9]), health=require(deps[10]);
  const Picker=require(deps[11]).default,colors=require(deps[12]).colors;
  const Sheet=require(deps[13]).default,feeds=require(deps[14]);
  const pref='jm2clean.reader.mode';
  const autoPref='jm2clean.reader.autoSeconds',autoSettings=require(deps[17]);
  const cachePref='jm2clean.reader.imageCounts';
  const local=require(deps[18]);
  const installLayout=__READER_LAYOUT__;
  const protect=__READER_PROTECTION__;
  const styles=RN.StyleSheet.create({
    root:{flex:1}
  });
  class Reader extends React.Component {
    constructor(props) {
      super(props);
      this.state={chapter:null,error:null,webError:null,menu:false,panel:null,bar:true,mode:'vertical',page:0,shunt:1,express:'off',source:null,session:0,positioned:false};
      this.state.autoSeconds=8;this.state.autoRunning=false;this.state.cache=autoSettings.defaults;
      this.scrubSerial=0;
      this.sequence=0;this.web=null;this.session=0;this.active=false;this.autoSerial=0;
      this.onMessage=this.onMessage.bind(this);
      this.openPanel=name=>{
        if(!this.webReady || this.state.panel || !this.state.chapter || !this.props.navigation.isFocused())return;
        this.pauseAuto();
        if(name==='comments'){
          if(!this.feed)this.feed=feeds.create(this.state.chapter.id);
          this.feed.load('open');
        }
        this.setState({panel:name});
      };
      this.dismissPanel=()=>this.setState({panel:null});
      this.selectChapter=(item,episode)=>{
        this.dismissPanel();
        if(String(item.id)!==String(this.state.chapter.id))this.props.navigation.navigate('Chapter',{id:item.id,episode,offlineBook:this.props.route.params.offlineBook});
      };
    }
    componentDidMount() {
      this.active=true;
      if(RN.AccessibilityInfo.isReduceMotionEnabled)RN.AccessibilityInfo.isReduceMotionEnabled().then(value=>{this.reduceMotion=value;}).catch(()=>{});
      this.finish=()=>{history.flush();this.commitBook();if(this.opened)history.notify();};
      this.background=/^(inactive|background)$/.test(RN.AppState.currentState);
      this.onAppState=state=>{
        this.background=state!=='active';
        if(this.background){clearTimeout(this.watch);this.pauseAuto();this.finish();}
        else{history.flush();this.onFocus();}
      };
      RN.AppState.addEventListener('change',this.onAppState);
      this.offBlur=this.props.navigation.addListener('blur',()=>{
        clearTimeout(this.watch);
        this.pauseAuto();this.resetScrub();this.finish();if(this.feed)this.feed.clearDrafts();
        if(this.web)this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.suspend();true;');
      });
      this.offFocus=this.props.navigation.addListener('focus',()=>this.onFocus());
      RN.AsyncStorage.multiGet([pref,'shunt',autoPref,cachePref]).then(pairs=>{
        if(!this.active)return;
        const mode=pairs[0][1],shunt=parseInt(pairs[1][1],10)||1;
        const saved=Number(pairs[2] && pairs[2][1]);
        let cache;try{cache=JSON.parse(pairs[3][1]);}catch(_){}
        this.setState({mode:Object.prototype.hasOwnProperty.call(modes,mode)?mode:'vertical',shunt:shunt,
          autoSeconds:autoSettings.valid(saved)?saved:8,cache:autoSettings.validCache(cache)?cache:autoSettings.defaults},()=>this.fetchChapter());
      }).catch(()=>{if(this.active)this.fetchChapter();});
      if (keys && keys.onKeyUpListener)keys.onKeyUpListener(event=>{
        if(!this.active || this.state.panel || this.state.menu || !this.props.navigation.isFocused())return;
        const step=this.state.mode.indexOf('spread')===0?2:1;
        if(event.keyCode===24 || event.keyCode===25)this.go(this.state.page+(event.keyCode===25 ? step : -step));
      });
    }
    componentDidUpdate(prev,previousState) {
      if(prev.route.params.id!==this.props.route.params.id || prev.route.params.offlineBook!==this.props.route.params.offlineBook)this.fetchChapter();
      else if(prev.account!==this.props.account && this.feed)this.feed.clearDrafts();
      if(this.archive && this.state.source && previousState.session!==this.state.session){
        // This WebView version may load the source before applying allowFileAccess
        // in the same native update. Navigate only after its initial mount.
        const session=this.state.session;
        requestAnimationFrame(()=>{if(this.active && session===this.session)this.setState({fileReady:session});});
      }
    }
    componentWillUnmount() {this.closeLocal();if(this.feed)this.feed.dispose();this.resetScrub();this.finish();this.offBlur();this.offFocus();RN.AppState.removeEventListener('change',this.onAppState);this.active=false;this.sequence++;clearTimeout(this.watch);clearTimeout(this.modeTimer);if(this.request)this.request.abort();if(keys && keys.removeKeyUpListener)keys.removeKeyUpListener();}
    closeLocal(){if(this.archive){local.call('close',this.archive.token).catch(()=>{});this.archive=null;}}
    fetchChapter(password='') {
      this.closeLocal();
      this.resetScrub();
      this.pauseAuto();
      clearTimeout(this.modeTimer);this.pendingMode=null;this.webReady=false;
      if(this.feed){this.feed.dispose();this.feed=null;}
      this.commitBook();this.entry=null;this.lastPage=null;this.opened=false;this.openPending=false;
      const generation=++this.sequence,params=this.props.route.params;
      this.session++;this.pendingReady=null;this.legacy=false;clearTimeout(this.watch);if(this.request)this.request.abort();
      this.setState({chapter:null,error:null,source:null,webError:null,page:0,positioned:false,menu:false,panel:null,bar:true,needsPassword:false,password:''});
      this.restartPending=params.restartChapter===String(params.id);
      const savedPosition=this.restartPending?Promise.resolve(0):history.position(String(params.id)).catch(()=>null);
      if(params.offlineBook){
        this.openLocal(params,generation,savedPosition,password);
        return;
      }
      const failed=reason=>{
        const missing=[404,410].includes(Number(reason && reason.status));
        if(this.active && generation===this.sequence)this.setState({error:missing?this.missingChapter():'章节数据暂时无法读取'});
      };
      this.request=client.fetchGet(api.API_COMBIC_CHAPTER,{id:params.id,skip:''},(reply,route)=>{
        if(!this.active || generation!==this.sequence)return;
        const data=reply && reply.data;
        if(reply && reply.code!=null && Number(reply.code)!==200)return failed({status:reply.code});
        if(!data || (data.id!=null && String(data.id)!==String(params.id)) || !Array.isArray(data.images) || !data.images.length)return failed();
        const series=Array.isArray(data.series)?data.series.filter(item=>item && (typeof item.id==='string' || typeof item.id==='number')):[];
        const chapter=Object.assign({},data,{id:data.id==null?params.id:data.id,series});
        this.chapterHost=route && route.host || global.api_host;
        this.entry=history.info(chapter,params,this.props.album);
        savedPosition.then(saved=>{
          if(!this.active || generation!==this.sequence)return;
          if(saved==null){this.setState({error:'暂时无法读取本机阅读进度，请重试'});return;}
          this.setState({chapter:chapter},()=>this.reload(Math.min(saved,chapter.images.length-1)));
        });
      },failed);
    }
    async openLocal(params,generation,position,password){
      try{
        const rows=(await local.refresh()).filter(r=>r.book===String(params.offlineBook)&&local.readable(r)).sort((a,b)=>a.episode-b.episode);
        const row=rows.find(r=>r.id===String(params.id));if(!row)throw Error('本地 ZIP 已移动、删除或尚未下载');
        const saved=await position;if(saved==null)throw Error('暂时无法读取本机阅读进度');
        if(row.state==='locked' && !password)throw Error('请输入来源提供的 ZIP 密码');
        const archive=await local.open(row.id,password);
        if(!this.active || generation!==this.sequence){local.call('close',archive.token).catch(()=>{});return;}
        this.archive=archive;
        const chapter={offline:true,id:row.id,series_id:row.book,name:row.name,images:Array(archive.pages).fill(0),
          series:rows.map(c=>({id:c.id,name:c.name,sort:c.episode}))};
        this.entry=history.info(chapter,params,{id:row.book,name:row.title});
        this.setState({chapter},()=>this.reload(Math.min(saved,archive.pages-1)));
      }catch(e){if(this.active && generation===this.sequence)this.setState({error:e.message||'无法打开本地 ZIP',needsPassword:/密码/.test(e.message||'')});}
    }
    commitBook(){
      const entry=this.entry;
      if(!entry || !this.opened || this.openPending)return;
      this.openPending=true;
      history.open(entry).catch(()=>{if(this.entry===entry)this.openPending=false;});
    }
    observed(page,ready){
      if(!this.entry || !Number.isInteger(page)||page<0||page>=this.entry.total)return;
      // A two-page spread may start one page before the exact saved page.
      if(ready){
        this.lastPage=page;this.opened=true;this.commitBook();
        if(this.restartPending){
          history.save(this.entry.chapter,page);this.restartPending=false;
          this.props.navigation.setParams({restartChapter:undefined});
        }
      }
      if(!this.opened || !this.webReady)return;
      if(page!==this.lastPage){this.lastPage=page;history.save(this.entry.chapter,page);}
      if(this.state.page!==page)this.setState({page:page});
    }
    reload(initial) {
      if(!this.active || !this.state.chapter)return;
      this.pauseAuto();
      clearTimeout(this.modeTimer);this.pendingMode=null;
      const state=this.state, session=++this.session, stamp=String(Math.floor(Date.now()/1000));
      this.pendingReady=null;
      const host=this.chapterHost || global.api_host;
      if(!this.archive && !host){this.setState({webError:'线路尚未就绪'});return;}
      const params={id:this.props.route.params.id,mode:state.mode==='vertical'?'vertical':'horizontal',page:initial,
        app_img_shunt:state.shunt,express:state.express,v:global.ad_cache_version || 0};
      const url='https://'+host+'/chapter_view_template?'+Object.keys(params).map(k=>k+'='+encodeURIComponent(params[k])).join('&');
      this.resetScrub();
      const options={count:state.chapter.images.length,mode:state.mode,initial:initial,session:session,cache:state.cache,offline:!!this.archive};
      this.earlyLayout=protect+'\n;('+installLayout.toString()+')('+JSON.stringify(options)+');true;';
      this.layout=this.earlyLayout+'\n'+require(deps[15]).script();
      this.restorePage=state.mode.startsWith('spread')?initial-initial%2:initial;
      this.webReady=false;this.loadStarted=this.archive?0:Date.now();this.legacy=false;this.legacyInput=false;clearTimeout(this.watch);
      this.watchLoad(session);
      this.setState({source:this.archive?{uri:this.archive.uri}:{uri:url,headers:client.headers(stamp)},session:session,webError:null,templateUnavailable:false,page:initial,positioned:false,panel:null,menu:false});
    }
    missingChapter(){
      return this.props.route.params.fromHistory?'章节已下架或不存在，本机观看记录已保留':'章节已下架或不存在';
    }
    watchLoad(session){
      clearTimeout(this.watch);
      if(!this.background && this.props.navigation.isFocused() && !this.webReady && !this.pendingReady)
        this.watch=setTimeout(()=>this.failWeb(session,this.archive?'本地图包读取超时':'来源阅读页加载超时'),25000);
    }
    onFocus(){
      if(this.background || !this.active || !this.props.navigation.isFocused())return;
      this.completeReady();
      if(this.state.source && this.state.session===this.session)this.watchLoad(this.session);
      if(this.web)this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.resume();true;');
    }
    failWeb(session,text,local,templateUnavailable=false) {
      if(!this.active || session!==this.session)return;
      this.pauseAuto();
      this.session++;this.pendingReady=null;this.webReady=false;clearTimeout(this.modeTimer);this.pendingMode=null;
      if(this.loadStarted && !local)health.record(this.chapterHost,'reader',false,Date.now()-this.loadStarted);
      this.loadStarted=0;clearTimeout(this.watch);this.setState({webError:text,templateUnavailable,panel:null});
    }
    completeReady(){
      const ready=this.pendingReady;
      if(!ready || ready.session!==this.session || !this.active || this.background || !this.props.navigation.isFocused())return;
      this.pendingReady=null;this.legacy=ready.type==='jm2Legacy';this.webReady=true;
      this.observed(ready.page,true);this.setState({positioned:true});
    }
    go(value) {
      if(!this.web || !this.state.chapter)return;
      this.pauseAuto();
      const page=Math.min(this.state.chapter.images.length-1,Math.max(0,Math.round(value)));
      if(Number.isFinite(page) && this.webReady){
        const target=this.state.mode.indexOf('spread')===0?page-page%2:page;
        this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.go('+target+');true;');
      }
    }
    resetScrub(){
      if(this.scrubFrame)cancelAnimationFrame(this.scrubFrame);
      this.scrubFrame=0;this.scrubPending=0;
    }
    scrub(value,finished){
      if(!this.webReady || !this.web || !this.state.chapter || !Number.isInteger(value))return;
      this.pauseAuto();
      const page=Math.max(0,Math.min(this.state.chapter.images.length-1,value));
      this.scrubPending=++this.scrubSerial;this.scrubPage=page;
      const deliver=()=>{
        this.scrubSent=this.scrubPending;
        if(this.web && this.webReady)this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.scrub('+this.scrubPage+','+finished+','+this.scrubPending+');true;');
      };
      if(finished){
        if(this.scrubFrame)cancelAnimationFrame(this.scrubFrame);
        this.scrubFrame=0;this.setState({page});deliver();
      }else if(!this.scrubFrame){
        deliver();
        this.scrubFrame=requestAnimationFrame(()=>{
          this.scrubFrame=0;
          if(this.scrubSent!==this.scrubPending)deliver();
        });
      }
    }
    saveCache(cache){
      if(!autoSettings.validCache(cache))return;
      this.setState({cache,menu:false});
      if(this.web)this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.setCache('+JSON.stringify(cache)+');true;');
      RN.AsyncStorage.setItem(cachePref,JSON.stringify(cache)).catch(()=>RN.ToastAndroid.show('本次设置已生效，保存失败',RN.ToastAndroid.SHORT));
    }
    pauseAuto(){
      if(!this.autoActive)return;
      this.autoActive=false;this.setState({autoRunning:false});
      const serial=++this.autoSerial;
      if(this.web && this.webReady)this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.setAuto(0,'+serial+');true;');
    }
    startAuto(value){
      const seconds=Number(value);
      if(!autoSettings.valid(seconds) || !this.webReady || !this.web || !this.props.navigation.isFocused() || RN.AppState.currentState==='background')return;
      this.autoActive=true;this.setState({menu:false,autoSeconds:seconds,autoRunning:true});
      RN.AsyncStorage.setItem(autoPref,String(seconds)).catch(()=>{});
      this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.setAuto('+seconds+','+(++this.autoSerial)+');true;');
    }
    changeMode(mode){
      if(!Object.prototype.hasOwnProperty.call(modes,mode) || mode===this.state.mode && !this.pendingMode)return;
      if(!this.webReady || !this.web){RN.ToastAndroid.show('请等当前页加载完成后再切换',RN.ToastAndroid.SHORT);return;}
      const request=this.modeSerial=(this.modeSerial||0)+1;
      this.pendingMode={request,mode};clearTimeout(this.modeTimer);
      this.modeTimer=setTimeout(()=>{this.pendingMode=null;RN.ToastAndroid.show('切换未完成，请重试',RN.ToastAndroid.SHORT);},4000);
      this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.setMode('+JSON.stringify(mode)+','+request+');true;');
    }
    onMessage(event,session) {
      if(!this.active || session!==this.session)return;
      let msg;try{msg=JSON.parse(event.nativeEvent.data);}catch(_){return;}
      if(!msg || typeof msg!=='object')return;
      if(msg.session===session){
        if(this.archive && (msg.type==='jm2ZipPage'||msg.type==='jm2ZipDrop')){
          const {index,ticket}=msg;
          if(!Number.isInteger(index)||index<0||index>=this.archive.pages||!Number.isSafeInteger(ticket)||ticket<1)return;
          const extract=msg.type==='jm2ZipPage';
          const acknowledge=ok=>{
            if(extract && this.active && session===this.session && this.web)this.web.injectJavaScript('window.jm2Pager && window.jm2Pager.zipPage('+index+','+ticket+','+(ok===true)+');true;');
          };
          local.call(extract?'page':'drop',this.archive.token,session,index,ticket).then(acknowledge,()=>acknowledge(false));return;
        }
        if(msg.type==='jm2ZipError' && this.archive)return this.failWeb(session,'本地 ZIP 中的第 '+(msg.index+1)+' 页无法读取',true);
        if(msg.type==='jm2Scrubbed'){
          if(msg.request===this.scrubPending){
            this.scrubPending=0;
            if(msg.failed || msg.cancelled)this.setState({page:msg.page});
            if(msg.failed)RN.ToastAndroid.show('目标页暂时无法读取，已停在第 '+(msg.page+1)+' 页',RN.ToastAndroid.SHORT);
          }
          return;
        }
        if(msg.type==='jm2Auto'){
          if(msg.request!==this.autoSerial)return;
          this.autoActive=msg.running===true;this.setState({autoRunning:this.autoActive});
          if(msg.reason==='timeout'||msg.reason==='end')RN.ToastAndroid.show(msg.reason==='end'?'已到本章末页':'图片加载超时，自动翻页已暂停',RN.ToastAndroid.SHORT);
          return;
        }
        if(msg.type==='jm2Mode'){
          if(!this.pendingMode || msg.request!==this.pendingMode.request)return;
          const mode=this.pendingMode.mode;this.pendingMode=null;clearTimeout(this.modeTimer);
          if(!msg.ok || msg.mode!==mode){RN.ToastAndroid.show('此章节模板暂不支持就地切换',RN.ToastAndroid.SHORT);return;}
          this.setState({mode});this.observed(msg.page,false);RN.AsyncStorage.setItem(pref,mode).catch(()=>{});return;
        }
        if(msg.type==='jm2Unavailable')return this.failWeb(session,'阅读模板与章节页数不匹配',false,true);
        if(msg.type==='jm2Ready'||msg.type==='jm2Legacy'){
          if(this.webReady || this.pendingReady || msg.page!==this.restorePage)return;
          clearTimeout(this.watch);this.pendingReady=msg;
          if(this.loadStarted)health.record(this.chapterHost,'reader',true,Date.now()-this.loadStarted);
          this.loadStarted=0;this.completeReady();
        }else if(msg.type==='jm2LegacyInput' && this.legacy)this.legacyInput=true;
        else if(msg.type==='jm2Page' && !this.scrubPending)this.observed(msg.page,false);
      } else if(msg.session==null && this.webReady){
        if(this.legacyInput && !this.autoActive && !this.scrubPending)this.observed(msg.page,false);
        if(msg.type==='toolBar' && (msg.toolBar==='show'||msg.toolBar==='hidden'))this.setState({bar:msg.toolBar==='show'});
        else if(msg.type==='imageClick')this.setState(s=>({bar:!s.bar}));
      }
    }
    render() {
      const s=this.state,chapter=s.chapter,settings=this.props.Setting;
      const error=s.error||s.webError;
      const presentation=require(deps[16]),backgroundColor=presentation.surface();
      if(s.needsPassword){
        const color=global.darkMode==='1'?'white':colors.main;
        return el(RN.View,{style:{flex:1,backgroundColor,justifyContent:'center',paddingHorizontal:24}},
          el(RN.Text,{style:{color,fontSize:16}},error),el(RN.TextInput,{secureTextEntry:true,value:s.password,accessibilityLabel:'ZIP 密码',
            style:{color,minHeight:48},onChangeText:password=>this.setState({password}),onSubmitEditing:()=>s.password && this.fetchChapter(s.password)}),
          el(RN.Button,{title:'打开章节',disabled:!s.password,color:colors.secondary,onPress:()=>this.fetchChapter(s.password)}),
          el(RN.Button,{title:'返回',color:colors.tertiary,onPress:()=>this.props.navigation.goBack()}));
      }
      if(error || !s.source || !chapter)return el(presentation.PageStatus,{message:error,actions:[
        ['重试',()=>s.error?this.fetchChapter():this.reload(s.page)],
        s.webError && s.templateUnavailable && s.mode!=='vertical' && ['改用条漫重开',()=>{
          this.setState({mode:'vertical'},()=>this.reload(s.page));
          RN.AsyncStorage.setItem(pref,'vertical').catch(()=>{});
        }],
        s.webError && !this.archive && ['切换线路',()=>{
          const hosts=(global.api_data||{}).Server||[],current=this.chapterHost || global.api_host;
          if(hosts.length)this.chapterHost=hosts[(hosts.indexOf(current)+1)%hosts.length];
          this.reload(s.page);
        }]]});
      const waitingForAccess=this.archive && s.fileReady!==s.session;
      return el(RN.View,{style:[styles.root,{backgroundColor}]},el(RN.StatusBar,{hidden:!s.bar,translucent:true,barStyle:'light-content'}),
        el(RN.View,{style:{flex:1},pointerEvents:s.positioned?'auto':'none',importantForAccessibility:s.panel||!s.positioned?'no-hide-descendants':'auto',accessibilityElementsHidden:!!s.panel||!s.positioned},
        el(WebView,{key:s.session,ref:view=>{this.web=view;},style:{flex:1,backgroundColor},containerStyle:{backgroundColor},source:waitingForAccess?undefined:s.source,cacheMode:this.archive?'LOAD_NO_CACHE':'LOAD_DEFAULT',
          allowFileAccess:!!this.archive,allowFileAccessFromFileURLs:false,allowUniversalAccessFromFileURLs:false,
          originWhitelist:this.archive?['*']:['http://*','https://*'],injectedJavaScriptBeforeContentLoaded:waitingForAccess?undefined:this.earlyLayout,injectedJavaScript:waitingForAccess?undefined:this.layout,
          onMessage:event=>this.onMessage(event,s.session),onError:()=>this.failWeb(s.session,'阅读页连接失败'),
          onHttpError:event=>{
            const {url,statusCode}=event.nativeEvent,missing=[404,410].includes(Number(statusCode));
            if(url===s.source.uri)this.failWeb(s.session,missing?this.missingChapter():'来源阅读页暂时无法访问',missing);
          },
          onRenderProcessGone:()=>this.failWeb(s.session,'阅读进程已退出，可以重新加载',true),
          onShouldStartLoadWithRequest:req=>req.url==='about:blank'||req.url.split('#')[0]===s.source.uri,
          setSupportMultipleWindows:false,javaScriptCanOpenWindowsAutomatically:false,allowsFullscreenVideo:false}),
        s.positioned && el(Header,{data:chapter,IsShow:s.bar,Setting:settings,paddingTop:RN.StatusBar.currentHeight}),
        s.positioned && el(Footer,{key:String(chapter.id),IsShow:s.bar,data:chapter,navigation:this.props.navigation,
          totalPage:chapter.images.length,currentPage:s.page,onScrub:(n,done)=>this.scrub(n,done),paddingTop:(RN.StatusBar.currentHeight || 0)+10,
          onOpenPanel:this.openPanel,canHorizontal:true,readMode:s.mode,onReadModeChange:()=>{this.pauseAuto();this.setState({menu:'mode'});},
          autoRunning:s.autoRunning,autoSeconds:s.autoSeconds,onPauseAuto:()=>this.pauseAuto(),
          onAutoPress:()=>this.autoActive?this.pauseAuto():this.setState({menu:'auto'}),
          onCachePress:()=>{this.pauseAuto();this.setState({menu:'cache'});},
          refresh:n=>this.setState({shunt:n},()=>this.reload(s.page)),expressWayOn:value=>this.setState({express:value},()=>this.reload(s.page))}),
        ),!s.positioned && el(RN.View,{style:RN.StyleSheet.absoluteFill},el(presentation.PageStatus,{
          loadingLabel:s.page>0?'正在恢复到第 '+(s.page+1)+' 页':'正在加载第 1 页'})),
        s.panel && el(Sheet,{key:chapter.id+'-'+s.panel,kind:s.panel,chapter,feed:this.feed,navigation:this.props.navigation,
          onDismiss:this.dismissPanel,onSelect:this.selectChapter,reduceMotion:this.reduceMotion}),
        s.menu==='auto' && el(autoSettings.IntervalSheet,{seconds:s.autoSeconds,onClose:()=>this.setState({menu:false}),onStart:value=>this.startAuto(value)}),
        s.menu==='cache' && el(autoSettings.CacheSheet,{cache:s.cache,onClose:()=>this.setState({menu:false}),onSave:c=>this.saveCache(c)}),
        el(Picker,{isModalVisible:s.menu==='mode',title:'阅读方式',cancelText:'取消',ignoreConfirm:true,
          currentValue:s.mode,options:Object.keys(modes).map(key=>({key,title:modes[key]})),
          toggleModal:()=>this.setState({menu:false}),confirmCallback:value=>this.changeMode(value)}));
    }
  }
  Object.defineProperty(exports,'__esModule',{value:true});
  exports.default=connect(state=>({Setting:state.Setting,album:state.Detail && state.Detail.detailList,
    account:state.Member && state.Member.isLogin && (state.Member.memberInfo||{}).username}))(Reader);
},2054,[55,2,410,650,648,1630,2061,2057,2100,2161,2158,826,729,2168,2165,2175,2180,2183,2184]);
