__d(function (g, r, i, a, m, e, d) {
  var t = r(d[0]);
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var n = t(r(d[1])),
    o = t(r(d[2])),
    l = t(r(d[3])),
    s = t(r(d[4])),
    u = t(r(d[5])),
    c = t(r(d[6])),
    f = z(r(d[7])),
    h = r(d[8]),
    p = t(r(d[9])),
    y = t(r(d[10])),
    w = r(d[11]),
    C = z(r(d[12])),
    k = t(r(d[13])),
    S = r(d[14]),
    T = t(r(d[15])),
    v = r(d[16]),
    I = r(d[17]),
    P = r(d[18]),
    B = z(r(d[19])),
    V = t(r(d[20])),
    L = r(d[21]);
  function O(_0x5e7994) {
    if ("function" != typeof WeakMap) return null;
    var _0x751dff = new WeakMap(),
      _0x3e2a92 = new WeakMap();
    return (O = function (_0x12daf3) {
      return _0x12daf3 ? _0x3e2a92 : _0x751dff;
    })(_0x5e7994);
  }
  function z(_0x185484, _0x1149cc) {
    for (var _0x5ad4bf = "2|5|3|4|0|1|6".split("|"), _0x4a858d = 0;;) {
      switch (_0x5ad4bf[_0x4a858d++]) {
        case "0":
          var _0x30fb95 = {},
            _0x5bf546 = Object.defineProperty && Object.getOwnPropertyDescriptor;
          continue;
        case "1":
          for (var _0x2691b0 in _0x185484) if ("default" !== _0x2691b0 && Object.prototype.hasOwnProperty.call(_0x185484, _0x2691b0)) {
            var _0x4d553e = _0x5bf546 ? Object.getOwnPropertyDescriptor(_0x185484, _0x2691b0) : null;
            _0x4d553e && (_0x4d553e.get || _0x4d553e.set) ? Object.defineProperty(_0x30fb95, _0x2691b0, _0x4d553e) : _0x30fb95[_0x2691b0] = _0x185484[_0x2691b0];
          }
          continue;
        case "2":
          if (!_0x1149cc && _0x185484 && _0x185484.__esModule) return _0x185484;
          continue;
        case "3":
          var _0x4cf319 = O(_0x1149cc);
          continue;
        case "4":
          if (_0x4cf319 && _0x4cf319.has(_0x185484)) return _0x4cf319.get(_0x185484);
          continue;
        case "5":
          if (null === _0x185484 || "object" != typeof _0x185484 && "function" != typeof _0x185484) return {
            default: _0x185484
          };
          continue;
        case "6":
          return _0x30fb95.default = _0x185484, _0x4cf319 && _0x4cf319.set(_0x185484, _0x30fb95), _0x30fb95;
      }
      break;
    }
  }
  var D = function (_0x5a327c) {
      (0, s.default)(_0x207cd3, _0x5a327c);
      var _0x30077d,
        _0x304cc0,
        _0x1c1911 = (_0x30077d = _0x207cd3, _0x304cc0 = function () {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
          } catch (_0x4c1c5a) {
            return !1;
          }
        }(), function () {
          var _0x310a0,
            _0x2039f7 = (0, c.default)(_0x30077d);
          if (_0x304cc0) {
            var _0x1e23e6 = (0, c.default)(this).constructor;
            _0x310a0 = Reflect.construct(_0x2039f7, arguments, _0x1e23e6);
          } else _0x310a0 = _0x2039f7.apply(this, arguments);
          return (0, u.default)(this, _0x310a0);
        });
      function _0x207cd3(_0x3b58b6) {
        var _0x4cadef;
        return (0, o.default)(this, _0x207cd3), (_0x4cadef = _0x1c1911.call(this, _0x3b58b6)).getShunt = function () {
          h.AsyncStorage.getItem("shunt").then(function (_0x342bdc) {
            _0x4cadef._isMounted && _0x4cadef.setState({
              currentShunt: parseInt(null != _0x342bdc ? _0x342bdc : 1, 10)
            });
          });
        }, _0x4cadef.confirmShunt = function (_0x57245a) {
          _0x4cadef.setState({
            isVisible: !1
          }), h.AsyncStorage.setItem("shunt", String(_0x57245a)).then(function () {
            var _0x13a198 = _0x4cadef.props.setting;
            _0x4cadef._isMounted && _0x4cadef.setState({
              currentShunt: parseInt(_0x57245a, 10)
            }), _0x13a198(v.API_APP_SETTING, {
              app_img_shunt: _0x57245a
            }, !0);
          }), _0x4cadef.props.refresh(_0x57245a);
        }, _0x4cadef.expressWay = function () {
          "off" === _0x4cadef.state.express && _0x4cadef.props.expressWayOn("on"), _0x4cadef.setState({
            express: "on",
            isVisible: !1
          });
        }, _0x4cadef.onChangeValue = function (_0x4c7dab) {
          _0x4cadef.setState({
            currentShunt: _0x4c7dab
          }), _0x4cadef.props.expressWayOn("off"), _0x4cadef.setState({
            express: "off"
          }), _0x4cadef.confirmShunt(_0x4c7dab);
        }, _0x4cadef.state = {
          isFavorite: _0x4cadef.props.data.is_favorite,
          isLiked: _0x4cadef.props.data.liked === true || Number(_0x4cadef.props.data.liked) === 1,
          isVisible: !1,
          express: "off"
        }, _0x4cadef.toast = f.default.createRef(), _0x4cadef;
      }
      return (0, l.default)(_0x207cd3, [{
        key: "componentDidMount",
        value: function () {
          this._isMounted = !0, this.getShunt();
        }
      }, {
        key: "componentWillUnmount",
        value: function () {
          this._isMounted = !1;
        }
      }, {
        key: "componentDidUpdate",
        value: function (_0x153f79) {
          var _0x574187 = this.props.Favorite;
          !0 === _0x153f79.Favorite.isLikeLoading && !1 === _0x574187.isLikeLoading && "success" == (200 !== _0x574187.likeResult.code ? "danger" : "success") && this._isMounted && this.setState({
            isLiked: !0
          });
        }
      }, {
        key: "render",
        value: function () {
          var _0x5b5e62 = this,
            _0x5c4f8d = this.props,
            _0x47e95a = _0x5c4f8d.data,
            _0x378ced = _0x5c4f8d.like,
            _0x318ba2 = _0x5c4f8d.IsShow,
            _0x43d62b = _0x5c4f8d.onReadModeChange,
            _0xc71cd5 = _0x5c4f8d.readMode,
            _0x4faf56 = _0x5c4f8d.totalPage,
            _0x1b77f1 = (_0x5c4f8d.canHorizontal, _0x5c4f8d.Setting),
            _0x222576 = this.state,
            _0x20dcf2 = _0x222576.isVisible,
            _0x245ff1 = _0x222576.currentShunt,
            _0x381602 = _0x222576.express,
            _0x3b9aaa = _0x1b77f1 && _0x1b77f1.info && Array.isArray(_0x1b77f1.info.app_shunts) ? _0x1b77f1.info.app_shunts.filter(item=>item && item.key!=null && typeof item.title==="string") : [];
          return f.default.createElement(f.default.Fragment, null, f.default.createElement(h.View, {
            style: j.centeredView
          }, f.default.createElement(h.Modal, {
            animationType: "slide",
            transparent: !0,
            visible: _0x20dcf2,
            onRequestClose:()=>this.setState({isVisible:false})
          }, f.default.createElement(h.View, {
            style: j.modalView
          }, f.default.createElement(h.View, {
            style: {
              width: "100%",
              flexDirection: "row-reverse"
            }
          }, f.default.createElement(h.TouchableOpacity, {
            title: "Hide modal",
            onPress: function () {
              return _0x5b5e62.setState({
                isVisible: !1
              });
            }
          }, f.default.createElement(p.default, {
            style: {
              alignSelf: "flex-start",
              padding: 10
            },
            name: "times",
            size: 20,
            color: "white"
          }))), f.default.createElement(h.Text, {
            style: [j.modalText, {
              marginTop: -30
            }]
          }, (0, P.lang)("切換圖源")), f.default.createElement(h.ScrollView, {
            style: {
              width: "100%",
              marginVertical: 10
            }
          }, f.default.createElement(h.View, {
            style: {
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 20
            }
          }, f.default.createElement(V.default, {
            width: 300,
            height: 250,
            group: "app_speed"
          })), f.default.createElement(h.View, {
            style: {
              width: 300,
              marginLeft: "auto",
              marginRight: "auto"
            }
          }, Boolean(_0x1b77f1 && _0x1b77f1.info && _0x1b77f1.info.is_cn) && f.default.createElement(h.TouchableHighlight, {
            style: {
              marginBottom: 10
            },
            onPress: this.expressWay
          }, f.default.createElement(h.Text, {
            style: [j.optionsButton, "on" === this.state.express ? j.optionsActiveButton : {}]
          }, (0, P.lang)("快速通道"))), _0x3b9aaa && _0x3b9aaa.map(function (_0x32af57, _0x9ab8f3) {
            return f.default.createElement(h.TouchableHighlight, {
              key: _0x9ab8f3,
              style: {
                marginBottom: 10
              },
              onPress: function () {
                return _0x5b5e62.onChangeValue(_0x32af57.key);
              }
            }, f.default.createElement(h.Text, {
              style: [j.optionsButton, _0x32af57.key === _0x245ff1 && "off" === _0x381602 ? j.optionsActiveButton : {}]
            }, _0x32af57.title));
          })))))), f.default.createElement(C.View, {
            animation: _0x318ba2 ? "slideInUp" : "slideOutDown",
            duration: 100,
            useNativeDriver: !0,
            style: [j.container]
          }, f.default.createElement(h.View, {
            animation: _0x318ba2 ? "slideInUp" : "slideOutDown",
            duration: 100,
            useNativeDriver: !0,
            style: j.pageContainer
          }, f.default.createElement(r(d[22]).default, {
            mode:_0xc71cd5,count:_0x4faf56,page:this.props.currentPage,scrub:this.props.onScrub,onCachePress:this.props.onCachePress,
            autoRunning:this.props.autoRunning,autoSeconds:this.props.autoSeconds,onAutoPress:this.props.onAutoPress,onPauseAuto:this.props.onPauseAuto,
            series:Array.isArray(_0x47e95a.series)?_0x47e95a.series:[],chapter:_0x47e95a.id,
            open:item=>B.navigate("Chapter",{id:item.id,episode:item.sort || item.episode,offlineBook:_0x47e95a.offline?_0x47e95a.series_id:undefined})
          }), f.default.createElement(k.default, {
            ref: function (_0x59da5f) {
              return _0x5b5e62.toast = _0x59da5f;
            }
          }), f.default.createElement(h.View, {
            style: [j.tabsContainer, {
              minHeight: 52
            }]
          }, !_0x47e95a.offline && f.default.createElement(h.TouchableOpacity,{accessibilityRole:"button",accessibilityLabel:"图源",style:j.tabsItem,onPress:()=>{this.props.onPauseAuto();this.setState({isVisible:true});}},f.default.createElement(p.default,{name:"bolt",color:w.colors.primary,size:16}),f.default.createElement(h.Text,{style:j.tabsItemText},"图源")),f.default.createElement(h.TouchableWithoutFeedback, {
            onPress: function () {
              _0x43d62b();
            }
          }, f.default.createElement(h.View, {
            style: j.tabsItem
          }, f.default.createElement(p.default, {
            name: _0xc71cd5.indexOf("spread")===0 ? "clone" : "file",
            color: w.colors.primary,
            size: 16
          }), f.default.createElement(h.Text, {
            style: j.tabsItemText
          }, "阅读方式"))), f.default.createElement(h.TouchableWithoutFeedback, {
            onPress: function () {
              _0x5b5e62.props.onOpenPanel("chapters");
            }
          }, f.default.createElement(h.View, {
            style: j.tabsItem
          }, f.default.createElement(p.default, {
            name: "list-ol",
            color: w.colors.primary,
            size: 16
          }), f.default.createElement(h.Text, {
            style: j.tabsItemText
          }, (0, P.lang)("章節")))), f.default.createElement(h.TouchableWithoutFeedback, {
            onPress: function () {
              _0x5b5e62.props.onOpenPanel("comments");
            }
          }, f.default.createElement(h.View, {
            style: j.tabsItem
          }, f.default.createElement(p.default, {
            name: "comment-dots",
            color: w.colors.primary,
            size: 16
          }), f.default.createElement(h.Text, {
            style: j.tabsItemText
          }, (0, P.lang)("評論")))), !_0x47e95a.offline && f.default.createElement(h.View, {
            style: [j.tabsItem]
          }, f.default.createElement(T.default, {
            data: _0x47e95a,
            containerStyle: [j.tabsItem],
            textStyle: j.tabsItemText,
            color: w.colors.primary,
            size: 16
          })), !_0x47e95a.offline && f.default.createElement(h.TouchableOpacity, {
            style: j.tabsItem,
            onPress: function () {
              _0x378ced(v.API_LIKE_DATA, {
                id: _0x47e95a.id
              }, !0);
            }
          }, f.default.createElement(h.View, {
            style: j.tabsItem
          }, f.default.createElement(p.default, {
            name: "heart",
            color: this.state.isLiked ? "red" : w.colors.secondary,
            size: 16,
            solid: this.state.isLiked
          }), f.default.createElement(h.Text, {
            style: j.tabsItemText
          }, (0, P.lang)("喜歡"))))))));
        }
      }]), _0x207cd3;
    }(f.Component),
    M = (0, S.connect)(function (_0x56d087) {
      return {
        Favorite: _0x56d087.Favorite,
        Setting: _0x56d087.Setting
      };
    }, {
      like: I.like,
      setting: L.setting
    })(D);
  e.default = M;
  var j = h.StyleSheet.create({
    container: {
      bottom: 0, left:0, right:0,
      position: "absolute"
    },
    pageContainer: {
      zIndex: 1,
      width: "100%"
    },
    tabsContainer: {
      backgroundColor: w.colors.main,
      height: 50,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 0,
      paddingLeft: 15,
      paddingRight: 15
    },
    tabsItem: {
      minHeight:44,minWidth:40,
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center"
    },
    tabsItemText: {
      color: w.colors.primary,
      fontSize: 12,
      paddingTop: 5
    },
    optionsButton: {
      backgroundColor: "transparent",
      color: "white",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: w.colors.secondary,
      overflow: "hidden"
    },
    optionsActiveButton: {
      backgroundColor: w.colors.secondary
    },
    centeredView: {
      justifyContent: "center",
      alignItems: "center"
    },
    modalView: {
      margin: 15,
      marginTop: 50,
      backgroundColor: w.colors.main,
      borderRadius: 20,
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: .25,
      shadowRadius: 4,
      elevation: 5,
      height: .7 * y.default.window.height
    },
    modalText: {
      marginBottom: 15,
      color: "white"
    }
  });
}, 2057, [1, 440, 155, 156, 157, 159, 162, 55, 2, 810, 718, 729, 829, 1640, 410, 2060, 650, 1425, 651, 825, 1629, 647, 2163]);
