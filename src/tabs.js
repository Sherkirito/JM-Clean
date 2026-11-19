__d(function (global, require, _i, _a, module, exports, deps) {
  const React=require(deps[0]), RN=require(deps[1]), connect=require(deps[2]).connect;
  const Tabs=require(deps[3]).createMaterialTopTabNavigator(), el=React.createElement;
  const Home=require(deps[4]).default, Forum=require(deps[5]).default, Member=require(deps[6]).default;
  const Bar=require(deps[7]).default;
  const login=require(deps[8]).login,notifications=require(deps[9]).notifications,api=require(deps[10]);
  function Main(props) {
    React.useEffect(function(){
      let active=true;
      RN.AsyncStorage.getItem('loginInfo').then(raw=>{
        if(!active || !raw)return;
        const saved=JSON.parse(raw);
        if(!saved || !saved.username || !saved.password)return;
        return Promise.resolve(props.login(api.API_MEMBER_LOGIN,saved,true)).then(reply=>{
          if(active && reply && reply.code===200)return props.notifications(api.API_API_NOTIFICATIONS_UNREAD,{},true);
        });
      }).catch(function(){});
      return ()=>{active=false;};
    },[]);
    const tab=(name,title,icon,view,unread)=>el(Tabs.Screen,{key:name,name:name,component:view,options:{title:title,tabBarAccessibilityLabel:title,icon:icon,unreadTotal:unread||0}});
    return el(RN.SafeAreaView,{style:{flex:1,paddingTop:RN.StatusBar.currentHeight || 0,backgroundColor:'#232323'}},
      el(Tabs.Navigator,{backBehavior:'history',lazy:true,swipeEnabled:false,tabBarPosition:'bottom',tabBar:p=>el(Bar,p)},
        tab('Home','首页','home',Home),tab('Categories','分类','th-large',require(deps[11]).default),tab('Forum','讨论区','comment-dots',Forum),tab('Member','个人中心','user-circle',Member,props.unread)));
  }
  Object.defineProperty(exports,'__esModule',{value:true});
  exports.default=connect(function(s){const n=s.Notifications.notifications || {};
    return {unread:s.Member.isLogin ? (Number(n.comic_follow)||0)+(Number(n.site_notice)||0) : 0};},{login:login,notifications:notifications})(Main);
},734,[55,2,410,735,803,1652,1871,2046,731,732,650,1661]);
