__d(function (g, r, i, a, m, e, d) {
  var t = r(d[0]);
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var o = t(r(d[1])),
    n = t(r(d[2])),
    l = t(r(d[3])),
    c = t(r(d[4])),
    s = t(r(d[5])),
    u = A(r(d[6])),
    f = r(d[7]),
    h = t(r(d[8])),
    y = r(d[9]),
    p = r(d[10]),
    k = t(r(d[11])),
    b = A(r(d[12])),
    x = r(d[13]),
    w = r(d[14]),
    C = A(r(d[15])),
    S = t(r(d[16])),
    E = t(r(d[17])),
    T = r(d[18]),
    reduceSearch = r(d[19]).default,
    R = t(r(d[20])),
    _ = t(r(d[21])),
    P = r(d[22]),
    L = t(r(d[23])),
    H = t(r(d[24])),
    I = t(r(d[25])),
    V = t(r(d[26]));
  function O(_0x60c6ee) {
    if ("function" != typeof WeakMap) return null;
    var _0xb6656c = new WeakMap(),
      _0xa3e7da = new WeakMap();
    return (O = function (_0x216057) {
      return _0x216057 ? _0xa3e7da : _0xb6656c;
    })(_0x60c6ee);
  }
  function A(_0x6bdb10, _0x3058e4) {
    for (var _0x1d595d = "4|1|5|0|6|3|2".split("|"), _0x5c42de = 0;;) {
      switch (_0x1d595d[_0x5c42de++]) {
        case "0":
          if (_0x2bcac1 && _0x2bcac1.has(_0x6bdb10)) return _0x2bcac1.get(_0x6bdb10);
          continue;
        case "1":
          if (null === _0x6bdb10 || "object" != typeof _0x6bdb10 && "function" != typeof _0x6bdb10) return {
            default: _0x6bdb10
          };
          continue;
        case "2":
          return _0x3651e0.default = _0x6bdb10, _0x2bcac1 && _0x2bcac1.set(_0x6bdb10, _0x3651e0), _0x3651e0;
        case "3":
          for (var _0x51b918 in _0x6bdb10) if ("default" !== _0x51b918 && Object.prototype.hasOwnProperty.call(_0x6bdb10, _0x51b918)) {
            var _0xfd9d63 = _0x129100 ? Object.getOwnPropertyDescriptor(_0x6bdb10, _0x51b918) : null;
            _0xfd9d63 && (_0xfd9d63.get || _0xfd9d63.set) ? Object.defineProperty(_0x3651e0, _0x51b918, _0xfd9d63) : _0x3651e0[_0x51b918] = _0x6bdb10[_0x51b918];
          }
          continue;
        case "4":
          if (!_0x3058e4 && _0x6bdb10 && _0x6bdb10.__esModule) return _0x6bdb10;
          continue;
        case "5":
          var _0x2bcac1 = O(_0x3058e4);
          continue;
        case "6":
          var _0x3651e0 = {},
            _0x129100 = Object.defineProperty && Object.getOwnPropertyDescriptor;
          continue;
      }
      break;
    }
  }
  var z = [{
      title: (0, P.lang)("最新"),
      key: ""
    }, {
      title: (0, P.lang)("最多點閱"),
      key: "mv"
    }, {
      title: (0, P.lang)("最多圖片"),
      key: "mp"
    }, {
      title: (0, P.lang)("最多愛心"),
      key: "tf"
    }],
    j = function (_0x5f23f6) {
      (0, l.default)(_0x409cb9, _0x5f23f6);
      var _0x492388,
        _0x569bb1,
        _0x1066f8 = (_0x492388 = _0x409cb9, _0x569bb1 = function () {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
          } catch (_0x42f484) {
            return !1;
          }
        }(), function () {
          var _0x2eff83,
            _0x5b61a1 = (0, s.default)(_0x492388);
          if (_0x569bb1) {
            var _0x209bd9 = (0, s.default)(this).constructor;
            _0x2eff83 = Reflect.construct(_0x5b61a1, arguments, _0x209bd9);
          } else _0x2eff83 = _0x5b61a1.apply(this, arguments);
          return (0, c.default)(this, _0x2eff83);
        });
      function _0x409cb9(_0x300e28) {
        var _0x56f59c;
        return (0, o.default)(this, _0x409cb9), (_0x56f59c = _0x1066f8.call(this, _0x300e28)).scroll = new f.Animated.Value(0), _0x56f59c.keyboardDidShowListener = {}, _0x56f59c.setModal = function (_0x206d26) {
          _0x56f59c.setState({
            isVisible: _0x206d26
          });
        }, _0x56f59c._renderHeader = function (_0x5a54e1) {
          var _0x4c3dac = Object.values(z).filter(function (_0x3205b2) {
            return _0x3205b2.key === _0x56f59c.state.sort;
          })[0].title;
          return u.default.createElement(f.View, {
            style: [{
              margin: 10
            }]
          }, u.default.createElement(f.View, {
            style: {
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 10
            }
          }, u.default.createElement(f.Text, {
            style: [{
              fontSize: 15,
              padding: 5
            }, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, _0x5a54e1), u.default.createElement(f.TouchableOpacity, {
            onPress: _0x56f59c.toggleSortModal,
            style: {
              marginRight: 15,
              padding: 5,
              borderColor: y.colors.secondary,
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "space-between"
            }
          }, u.default.createElement(f.Text, {
            style: [{
              marginRight: 10
            }, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, _0x4c3dac), u.default.createElement(h.default, {
            name: "sort-down",
            solid: !0,
            color: "1" === g.darkMode ? y.colors.textPrimaryDark : "black"
          }))));
        }, _0x56f59c._renderFloatButtons = function () {
          var _0x4e4244 = _0x56f59c.scroll.interpolate({
            inputRange: [200, 300],
            outputRange: [0, 1]
          });
          return u.default.createElement(f.Animated.View, {
            style: {
              position: "absolute",
              right: 10,
              bottom: 70,
              width: 50,
              height: 50,
              opacity: _0x4e4244,
              zIndex: _0x4e4244
            }
          }, u.default.createElement(f.View, {
            style: {
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: y.colors.secondary,
              justifyContent: "center",
              alignItems: "center"
            }
          }, u.default.createElement(h.default, {
            name: "angle-double-up",
            onPress: function () {
              _0x56f59c.heldOffset=null;
              if (_0x56f59c.FlatListRef) _0x56f59c.FlatListRef.scrollToOffset({offset:0,animated:true});
            },
            color: "white",
            size: 22,
            style: {
              padding: 13,
              paddingHorizontal: 18,
              borderRadius: 25
            }
          })));
        }, _0x56f59c.initData = function () {
          var _0x2fbeaf = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            _0x2895ee = _0x56f59c.props,
            _0x12d0cc = _0x56f59c.runSearch,
            _0xcd3bd3 = _0x2895ee.randomRecommend,
            _0x4f8e78 = _0x2895ee.route;
          _0xcd3bd3(C.API_COMBIC_RANDOM_RECOMMEND, {}, !0);
          var _0x34ebf7 = _0x4f8e78.params && _0x4f8e78.params.searchText;
          _0x56f59c.setState({
            text: null != _0x34ebf7 ? _0x34ebf7 : "",
            sort: ""
          }), _0x12d0cc(C.API_COMBIC_SEARCH, {
            search_query: null != _0x34ebf7 ? _0x34ebf7 : "",
            page: 1
          }, !0, !1, _0x2fbeaf), f.AsyncStorage.getItem("searchHistory").then(function (_0x570fdb) {
            let saved;try{saved=JSON.parse(_0x570fdb);}catch(error){}
            const _0x26e2aa=Array.isArray(saved)?saved.filter(item=>item && typeof item.title==='string').slice(0,5):[];
            if(!_0x56f59c.live)return;
            _0x56f59c.setState({
              searchHistory: _0x26e2aa
            }, function () {
              _0x34ebf7 && _0x56f59c.setHistory(_0x34ebf7);
            });
          }).catch(()=>{}), _0x56f59c.hotRequest=V.default.fetchSkipEc(C.API_COMBIC_HOT_TAGS, {}, function (_0x95ed93) {
            _0x56f59c.live && Array.isArray(_0x95ed93.data) && _0x95ed93.data.length > 0 && _0x56f59c.setState({
              hotTags: _0x95ed93.data.filter(tag=>typeof tag==='string')
            });
          }, function (_0x2e2932) {});
        }, _0x56f59c._onRefresh = function () {
          const view=_0x56f59c, query=(view.props.route.params||{}).searchText||'';
          view.resetPosition();
          view.runSearch(C.API_COMBIC_SEARCH,{search_query:query,page:1,o:view.state.sort},false,false,true);
        }, _0x56f59c.renderBook = function (entry) {
          const view=_0x56f59c,book=entry.item;
          return u.default.createElement(k.default,{
            item:book,categoryStyle:T.comicVerticalListStyle.listCategory,
            containerStyle:T.comicVerticalListStyle.listCardContainer,isPushStack:true,
            beforeOpen:view.holdPosition
          });
        }, _0x56f59c.onClear = function () {
          _0x56f59c.setState({
            text: ""
          }), _0x56f59c.props.navigation.setParams({
            searchText: ""
          });
        }, _0x56f59c.searchSubmit = function () {
          const view=_0x56f59c, query=view.state.text.trim(), params=view.props.route.params||{};
          f.Keyboard.dismiss();
          if(String(params.searchText||'')===query){
            view.resetPosition();
            view.runSearch(C.API_COMBIC_SEARCH,{search_query:query,page:1,o:view.state.sort},true);
          }else view.props.navigation.setParams({searchText:query});
        }, _0x56f59c.onPressTag = function (_0x5524fa) {
          _0x56f59c.setState({
            text: _0x5524fa
          }, function () {
            _0x56f59c.searchSubmit();
          });
        }, _0x56f59c.onChangeText = function (_0x1235ba) {
          _0x56f59c.setState({
            text: _0x1235ba
          });
        }, _0x56f59c.setHistory = function (_0x111e49) {
          if ("" !== _0x111e49) {
            var _0x4a7e53 = _0x56f59c.state.searchHistory;
            0 === _0x4a7e53.filter(function (_0x4b1a68) {
              return _0x4b1a68.title === _0x111e49;
            }).length && (_0x4a7e53.length >= 5 && _0x4a7e53.pop(), _0x4a7e53.unshift({
              title: _0x111e49
            }), _0x56f59c.setState({
              searchHistory: _0x4a7e53
            }), f.AsyncStorage.setItem("searchHistory", JSON.stringify(_0x4a7e53)));
          }
        }, _0x56f59c.delHistory = function (_0xf1e767) {
          if ("" !== _0xf1e767) {
            var _0x1cb7e4 = _0x56f59c.state.searchHistory;
            _0x1cb7e4 = _0x1cb7e4.filter(function (_0x59443f) {
              return _0x59443f.title !== _0xf1e767;
            }), _0x56f59c.setState({
              searchHistory: _0x1cb7e4
            }), f.AsyncStorage.setItem("searchHistory", JSON.stringify(_0x1cb7e4));
          }
        }, _0x56f59c.cleanHistory = function () {
          _0x56f59c.setState({
            searchHistory: []
          }), f.AsyncStorage.setItem("searchHistory", JSON.stringify([]));
        }, _0x56f59c.toggleSortModal = function () {
          _0x56f59c.setState({
            showSortModal: !_0x56f59c.state.showSortModal
          });
        }, _0x56f59c.confirmSort = function (_0x266d9d) {
          _0x56f59c.setState({
            sort: _0x266d9d
          });
          var _0x54b628 = _0x56f59c.props.route.params && _0x56f59c.props.route.params.searchText;
          _0x56f59c.resetPosition();
          _0x56f59c.runSearch(C.API_COMBIC_SEARCH, {
            search_query: _0x54b628,
            o: _0x266d9d
          }, !0, !1, !0);
        }, _0x56f59c.loadNext = function (retry) {
          const view=_0x56f59c, results=view.state.results, list=results.searchList;
          if(!view.props.navigation.isFocused() || results.isLoading || results.isRefreshing || results.isLoadMore ||
             (!retry && results.failed) || !list.content.length || list.redirect_aid ||
             (list.total!=null && list.content.length>=list.total))return;
          view.runSearch(C.API_COMBIC_SEARCH,{search_query:list.search_query,page:list.page+1,o:list.sort},false,true);
        }, _0x56f59c.session = w.createSearchSession(), _0x56f59c.runSearch = function (...args) {
          const view=_0x56f59c;
          return view.session.search(...args)(action=>{
            if(view.live)view.setState(state=>({results:reduceSearch(state.results,action)}));
          });
        }, _0x56f59c.offset=0, _0x56f59c.holdPosition=function(){
          if(_0x56f59c.heldOffset==null)_0x56f59c.heldOffset=_0x56f59c.offset;
        }, _0x56f59c.restorePosition=function(){
          const view=_0x56f59c;
          if(view.frame!=null)cancelAnimationFrame(view.frame);
          view.frame=requestAnimationFrame(()=>{
            view.frame=null;
            if(view.live && view.heldOffset>0 && view.FlatListRef && view.props.navigation.isFocused())
              view.FlatListRef.scrollToOffset({offset:view.heldOffset,animated:false});
          });
        }, _0x56f59c.resetPosition=function(){
          const view=_0x56f59c;
          view.offset=0;view.heldOffset=null;
          if(view.FlatListRef)view.FlatListRef.scrollToOffset({offset:0,animated:false});
          view.scroll.setValue(0);
        }, _0x56f59c.trackScroll=function(event){
          const view=_0x56f59c,y=Math.max(0,event.nativeEvent.contentOffset.y);
          if(!view.props.navigation.isFocused())return;
          if(view.heldOffset!=null && Math.abs(view.heldOffset-y)>2)return;
          view.heldOffset=null;view.offset=y;view.scroll.setValue(y);
        }, _0x56f59c.setListRef=function(list){
          _0x56f59c.FlatListRef=list;
          if(list && _0x56f59c.heldOffset>0)_0x56f59c.restorePosition();
        }, _0x56f59c.state = {
          text: "",
          searchHistory: [],
          results: reduceSearch(undefined,{}),
          showSortModal: !1,
          sort: "",
          isVisible: !1,
          searchSelection: "comic",
          hotTags: []
        }, _0x56f59c.searchBarRef = u.default.createRef(), _0x56f59c.FlatListRef = null, _0x56f59c;
      }
      return (0, n.default)(_0x409cb9, [{
        key: "componentDidUpdate",
        value: function (_0x366e4c, _0x5e21cd) {
          if ((_0x366e4c.route.params && _0x366e4c.route.params.searchText || "") !== (this.props.route.params && this.props.route.params.searchText || "")) {
            this.resetPosition();
            var _0xcd19e4 = this.props,
              _0x2c0075 = this.runSearch,
              _0x3d8dfe = _0xcd19e4.route,
              _0x1564a1 = _0x3d8dfe.params && _0x3d8dfe.params.searchText;
            _0x1564a1 && this.setHistory(_0x1564a1), _0x2c0075(C.API_COMBIC_SEARCH, {
              search_query: null != _0x1564a1 ? _0x1564a1 : "",
              o: this.state.sort
            }, !0);
          }
          const result=this.state.results.searchList, query=String((this.props.route.params||{}).searchText||'').trim();
          if(result && result!==_0x5e21cd.results.searchList && result.redirect_aid && result.requestId!==this.redirected &&
              query && result.search_query===query && String(this.state.text).trim()===query && this.props.navigation.isFocused()){
            this.redirected=result.requestId;
            f.Keyboard.dismiss();
            this.props.navigation.navigate('Detail',{id:result.redirect_aid});
          }
        }
      }, {
        key: "componentDidMount",
        value: function () {
          this.live=true;
          this.offBlur=this.props.navigation.addListener('blur',this.holdPosition);
          this.offFocus=this.props.navigation.addListener('focus',this.restorePosition);
          this.initData();
        }
      }, {
        key:"componentWillUnmount",
        value:function(){this.live=false;this.offBlur();this.offFocus();this.session.dispose();
          if(this.frame!=null)cancelAnimationFrame(this.frame);
          if(this.hotRequest && this.hotRequest.abort)this.hotRequest.abort();}
      }, {
        key: "render",
        value: function () {
          var _0x1ca810,
            _0x5d93c8 = this,
            _0xe84eed = this.state.results,
            _0x342ae5 = this.state,
            _0x2bef06 = _0x342ae5.searchHistory,
            _0x1a1461 = _0x342ae5.isVisible,
            _0x16b9d7 = (_0x342ae5.searchSelection, _0x342ae5.hotTags),
            _0x4b80e3 = _0xe84eed.searchList && _0xe84eed.searchList,
            _0x453137 = this.props.randomRecommendList,
            _0x23e04f = (0, P.lang)("搜尋") + ' "' + _0x4b80e3.search_query + '" ' + (0, P.lang)("共") + " " + (_0x4b80e3.total==null?_0x4b80e3.content.length:_0x4b80e3.total) + " " + (0, P.lang)("結果"),
            _0x1c175a = {
              content: null != (_0x1ca810 = _0x4b80e3.content) ? _0x1ca810 : []
            };
          return u.default.createElement(f.SafeAreaView, {
            style: [q.AndroidSafeArea, "1" === g.darkMode ? {
              backgroundColor: y.colors.backgroundDark
            } : {}]
          }, u.default.createElement(f.View, {
            style: {
              flex: 1
            }
          }, u.default.createElement(L.default, {
            title: "" + (0, P.lang)("排序"),
            currentValue: "" + this.state.sort,
            isModalVisible: this.state.showSortModal,
            options: z,
            toggleModal: this.toggleSortModal,
            confirmCallback: this.confirmSort,
            ignoreConfirm: !0
          }), u.default.createElement(f.StatusBar, {
            backgroundColor: "rgba(50, 50, 50,1)",
            translucent: !0,
            barStyle: "light-content",
            hidden: !1
          }), u.default.createElement(f.View, {
            style: {
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: y.colors.secondary
            }
          }, u.default.createElement(r(d[29]).Controls, {}), u.default.createElement(f.View, {
            style: {
              flex: 1
            }
          }, u.default.createElement(p.SearchBar, {
            ref: function (_0x5607cf) {
              return _0x5d93c8.searchBarRef = _0x5607cf;
            },
            onChangeText: this.onChangeText,
            value: this.state.text,
            containerStyle: q.searchBarContainer,
            inputContainerStyle: q.searchInputContainer,
            inputStyle: q.searchInput,
            placeholder: (0, P.lang)("搜索關鍵字"),
            searchIcon: function () {
              return u.default.createElement(f.TouchableHighlight, {
                onPress: function () {
                  return _0x5d93c8.searchSubmit();
                }
              }, u.default.createElement(h.default, {
                name: "search",
                size: 20,
                color: "#ababab"
              }));
            },
            onSubmitEditing: this.searchSubmit,
            onClear: this.onClear
          }), u.default.createElement(f.View, {
            style: {
              flexDirection: "row",
              marginLeft: 5
            }
          }, null), u.default.createElement(f.TouchableWithoutFeedback, {
            onPress: function () {
              return _0x5d93c8.setModal(!0);
            }
          }, u.default.createElement(f.View, {
            style: {
              flexDirection: "row",
              marginLeft: 8,
              marginBottom: 8,
              alignItems: "center"
            }
          }, u.default.createElement(h.default, {
            name: "question-circle",
            size: 16,
            color: "white"
          }), u.default.createElement(f.Text, {
            style: {
              marginLeft: 5,
              color: "white",
              fontSize: 12
            }
          }, (0, P.lang)("搜尋的最佳姿勢？")))))), u.default.createElement(H.default, {
            isVisible: _0x1a1461,onBackButtonPress:()=>this.setModal(false)
          }, u.default.createElement(f.View, {
            style: [{
              backgroundColor: "white",
              justifyContent: "center",
              padding: 20
            }, "1" === g.darkMode ? {
              backgroundColor: y.colors.backgroundDark
            } : {}]
          }, u.default.createElement(f.Text, {
            style: [{
              margin: 10,
              fontSize: 16,
              marginLeft: "auto",
              marginRight: "auto"
            }, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("搜尋的最佳姿勢？")), u.default.createElement(p.Divider, {
            style: {
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto"
            }
          }), u.default.createElement(f.ScrollView, {
            style: {
              maxHeight: .7 * I.default.window.height
            }
          }, u.default.createElement(f.View, {
            style: {
              width: "100%",
              marginTop: 20
            }
          }, u.default.createElement(f.Image, {
            style: {
              width: .6 * I.default.window.width,
              height: .6 * I.default.window.width / 756 * 766,
              marginLeft: "auto",
              marginRight: "auto"
            },
            resizeMode: "contain",
            source: r(d[27])
          })), u.default.createElement(f.Text, {
            style: [q.modalTitle, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("【包含搜尋】")), u.default.createElement(f.Text, {
            style: [q.modalContent, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("搜尋全彩[空格][+]人妻,僅顯示全彩且是人妻的本本")), u.default.createElement(f.Text, {
            style: [q.modalContent, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("範例:全彩 +人妻")), u.default.createElement(f.Text, {
            style: [q.modalTitle, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("【排除搜尋】")), u.default.createElement(f.Text, {
            style: [q.modalContent, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("搜尋全彩[空格][-]人妻,顯示全彩並排除人妻的本本")), u.default.createElement(f.Text, {
            style: [q.modalContent, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("範例:全彩 -人妻")), u.default.createElement(f.Text, {
            style: [q.modalTitle, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("【我都要搜尋】")), u.default.createElement(f.Text, {
            style: [q.modalContent, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("搜尋全彩[空格]人妻,會顯示所有包含全彩及人妻的本本")), u.default.createElement(f.Text, {
            style: [q.modalContent, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("範例:全彩 人妻"))), u.default.createElement(f.View, {
            style: {
              marginTop: 10,
              marginHorizontal: 50
            }
          }, u.default.createElement(f.Button, {
            title: (0, P.lang)("我都學會了！"),
            onPress: function () {
              return _0x5d93c8.setModal(!1);
            },
            color: "" + y.colors.secondary
          })))), _0x1c175a.content.length>0 && u.default.createElement(f.FlatList, {
            style:{flex:1,backgroundColor:g.darkMode==="1"?y.colors.backgroundDark:"white"},
            data:_0x1c175a.content,numColumns:3,columnWrapperStyle:{padding:6},
            keyExtractor:book=>String(book.id),renderItem:this.renderBook,ref:this.setListRef,
            ListHeaderComponent:this._renderHeader(_0x23e04f),
            ListFooterComponent:_0xe84eed.isLoadMore?u.default.createElement(f.ActivityIndicator,{color:y.colors.secondary}):
              (_0xe84eed.failed || _0x4b80e3.total==null || _0x1c175a.content.length<_0x4b80e3.total)?u.default.createElement(f.Text,{
                accessibilityRole:'button',onPress:_0xe84eed.failed && _0xe84eed.retryPage===1?this._onRefresh:()=>this.loadNext(true),
                style:{padding:12,textAlign:'center',color:y.colors.secondary}
              },_0xe84eed.failed?'加载失败，点此重试':'加载更多'):null,
            onEndReached:()=>this.loadNext(false),onEndReachedThreshold:0.4,
            refreshing:!!_0xe84eed.isRefreshing,onRefresh:this._onRefresh,onScroll:this.trackScroll,
            onScrollBeginDrag:()=>{this.heldOffset=null;},scrollEventThrottle:16,
            onContentSizeChange:this.restorePosition
          }), _0xe84eed.isLoading && !_0x1c175a.content.length ? u.default.createElement(E.default, null) : 0 === _0x1c175a.content.length && u.default.createElement(f.ScrollView, {
            style: [{
              paddingBottom: 50
            }, "1" === g.darkMode ? {
              backgroundColor: y.colors.primaryDark
            } : {}]
          }, !_0xe84eed.isLoading && !!_0x4b80e3.search_query && 0 === _0x1c175a.content.length && u.default.createElement(f.View, {
            style: [{
              backgroundColor: "white",
              padding: 15
            }, "1" === g.darkMode ? {
              backgroundColor: y.colors.primaryDark
            } : {}]
          }, u.default.createElement(f.Text, {
            style: q.noData,
            onPress:_0xe84eed.failed?this._onRefresh:undefined
          }, _0xe84eed.failed?"加载失败，点此重试":(0, P.lang)("Ohoh...目前查無資料唷"))), u.default.createElement(f.View, {
            style: [q.section, "1" === g.darkMode ? {
              backgroundColor: y.colors.backgroundDark
            } : {}]
          }, u.default.createElement(f.Text, {
            style: [q.sectionTitle, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("熱門成人主題")), u.default.createElement(f.View, {
            style: q.hotTags
          }, (null == _0x16b9d7 ? void 0 : _0x16b9d7.length) > 0 && _0x16b9d7.map(function (_0x564be1, _0x1637b8) {
            return u.default.createElement(f.TouchableWithoutFeedback, {
              key: _0x564be1 + "_" + _0x1637b8,
              onPress: function () {
                _0x5d93c8.onPressTag(null != _0x564be1 ? _0x564be1 : "");
              }
            }, u.default.createElement(f.Text, {
              style: [q.rowTag, "1" === g.darkMode ? {
                color: y.colors.textPrimaryDark,
                backgroundColor: y.colors.backgroundDark
              } : {}]
            }, "#", _0x564be1));
          }))), _0x2bef06 && _0x2bef06.length > 0 && u.default.createElement(f.View, {
            style: [q.section, "1" === g.darkMode ? {
              backgroundColor: y.colors.backgroundDark
            } : {}]
          }, u.default.createElement(f.Text, {
            style: [q.sectionTitle, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark
            } : {}]
          }, (0, P.lang)("搜尋紀錄")), _0x2bef06.map(function (_0x2f5fa5, _0x45e592) {
            return u.default.createElement(f.View, {
              key: _0x45e592,
              style: q.historyRow
            }, u.default.createElement(f.TouchableHighlight, {
              onPress: function () {
                var _0x22193a;
                _0x5d93c8.onPressTag(null != (_0x22193a = _0x2f5fa5.title) ? _0x22193a : "");
              },
              style: {
                padding: 5,
                flex: 1
              }
            }, u.default.createElement(f.Text, {
              style: ["1" === g.darkMode ? {
                color: y.colors.textPrimaryDark
              } : {
                color: "#7F7F7F"
              }]
            }, _0x2f5fa5.title)), u.default.createElement(f.TouchableHighlight, {
              onPress: function () {
                return _0x5d93c8.delHistory(_0x2f5fa5.title);
              },
              style: {
                padding: 5,
                paddingHorizontal: 10
              }
            }, u.default.createElement(h.default, {
              name: "times",
              style: {},
              size: 18,
              color: "#7f7f7f"
            })));
          }), u.default.createElement(f.TouchableOpacity, {
            style: q.historyRowClear,
            onPress: function () {
              return _0x5d93c8.cleanHistory();
            }
          }, u.default.createElement(f.Text, {
            style: {
              color: y.colors.secondary
            }
          }, (0, P.lang)("清除搜尋紀錄")))), this.props.isRandomRecommendLoading ? u.default.createElement(f.View, {
            style: {
              justifyContent: "center",
              flexDirection: "row"
            }
          }, u.default.createElement(S.default, {
            source: r(d[28]),
            style: {
              width: 50,
              height: 50
            }
          })) : 0 === _0x1c175a.content.length && u.default.createElement(f.View, {
            style: [q.section, "1" === g.darkMode ? {
              backgroundColor: y.colors.backgroundDark
            } : {}]
          }, u.default.createElement(f.Text, {
            style: [q.sectionTitle, "1" === g.darkMode ? {
              color: y.colors.textPrimaryDark,
              backgroundColor: y.colors.backgroundDark
            } : {}]
          }, (0, P.lang)("隨機推薦")), u.default.createElement(f.View, {
            style: [q.randomBlock, "1" === g.darkMode ? {
              backgroundColor: y.colors.backgroundDark
            } : {}]
          }, _0x453137.map(function (_0x157b32, _0xec6508) {
            return u.default.createElement(k.default, {
              key: _0xec6508,
              item: _0x157b32,
              imageStyle: {
                height: 145
              },
              contentContainerStyle: {
                flexDirection: "column",
                padding: 0
              }
            });
          })), u.default.createElement(f.TouchableOpacity, {
            onPress: function () {
              var _0x4fd27f,
                _0x88b430 = _0x453137 && _0x453137.length > 0 ? null == (_0x4fd27f = _0x453137[R.default.getRandom(0, _0x453137.length)]) ? void 0 : _0x4fd27f.id : 1e4;
              b.navigate("Detail", {
                id: _0x88b430
              });
            },
            style: [{
              padding: 15,
              alignItems: "center",
              borderColor: y.colors.primary,
              borderWidth: 1
            }, "1" === g.darkMode ? {
              backgroundColor: y.colors.backgroundDark
            } : {}]
          }, u.default.createElement(f.Text, {
            style: {
              color: y.colors.secondary
            }
          }, (0, P.lang)("隨機推薦")))), u.default.createElement(_.default, {
            width: I.default.window.width,
            height: I.default.window.width / 728 * 90,
            group: "app_search_bottom"
          })), this._renderFloatButtons()));
        }
      }]), _0x409cb9;
    }(u.Component),
    W = (0, x.connect)(function (_0x20c5dd) {
      return {
        randomRecommendList: _0x20c5dd.Search.randomRecommendList,
        isRandomRecommendLoading: _0x20c5dd.Search.isRandomRecommendLoading
      };
    }, {
      randomRecommend: w.randomRecommend
    })(j);
  e.default = W;
  var q = f.StyleSheet.create({
    AndroidSafeArea: {
      flex: 1,
      backgroundColor: y.colors.primary,
      paddingTop: "android" === f.Platform.OS ? f.StatusBar.currentHeight : 0
    },
    modalTitle: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 15,
      lineHeight: 20
    },
    modalContent: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 5,
      fontSize: 12
    },
    section: {
      backgroundColor: "white",
      marginTop: 10,
      paddingBottom: 10
    },
    sectionTitle: {
      fontWeight: "bold",
      margin: 10
    },
    randomBlock: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 7,
      backgroundColor: "white"
    },
    noData: {
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      color: "#7F7F7F"
    },
    searchBarContainer: {
      backgroundColor: y.colors.secondary,
      borderBottomColor: y.colors.secondary,
      borderTopColor: y.colors.secondary,
      flex: 14,
      height: 45,
      paddingBottom: 35,
      paddingTop: 7
    },
    searchInputContainer: {
      backgroundColor: "white",
      color: "black",
      height: 30
    },
    searchInput: {
      fontSize: 13,
      marginLeft: 4
    },
    hotTags: {
      paddingHorizontal: 10,
      flexDirection: "row",
      flexWrap: "wrap"
    },
    rowTag: {
      color: "black",
      margin: 5,
      padding: 5,
      borderRadius: 5,
      fontSize: 11,
      marginLeft: 0,
      borderWidth: 1,
      borderColor: "#7F7F7F"
    },
    historyRow: {
      borderBottomColor: y.colors.primary,
      borderBottomWidth: 1,
      color: y.colors.primary,
      paddingVertical: 5,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center"
    },
    historyRowClear: {
      justifyContent: "flex-end",
      flexDirection: "row",
      padding: 10,
      paddingRight: 10
    }
  });
}, 2108, [1, 155, 156, 157, 159, 162, 55, 2, 810, 729, 1920, 1424, 825, 410, 2109, 650, 730, 805, 1620, 667, 1599, 1629, 651, 826, 827, 718, 648, 2110, 807, 2180]);

