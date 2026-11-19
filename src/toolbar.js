__d(function (g, r, i, a, m, e, d) {
  var t = r(d[0]);
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var n = t(r(d[1])),
    o = t(r(d[2])),
    u = t(r(d[3])),
    l = t(r(d[4])),
    c = t(r(d[5])),
    s = w(r(d[6])),
    f = r(d[7]),
    h = r(d[8]),
    p = t(r(d[9])),
    y = w(r(d[10])),
    S = r(d[11]),
    v = r(d[12]),
    b = r(d[13]),
    M = t(r(d[14])),
    _ = r(d[15]),
    P = r(d[16]);
  function E(_0x150721) {
    if ("function" != typeof WeakMap) return null;
    var _0x2e96d3 = new WeakMap(),
      _0x3d04cf = new WeakMap();
    return (E = function (_0x536119) {
      return _0x536119 ? _0x3d04cf : _0x2e96d3;
    })(_0x150721);
  }
  function w(_0x2b6f1f, _0x2581c8) {
    for (var _0x1f879d = "1|6|4|0|5|3|2".split("|"), _0x94159 = 0;;) {
      switch (_0x1f879d[_0x94159++]) {
        case "0":
          if (_0x14a295 && _0x14a295.has(_0x2b6f1f)) return _0x14a295.get(_0x2b6f1f);
          continue;
        case "1":
          if (!_0x2581c8 && _0x2b6f1f && _0x2b6f1f.__esModule) return _0x2b6f1f;
          continue;
        case "2":
          return _0x14882e.default = _0x2b6f1f, _0x14a295 && _0x14a295.set(_0x2b6f1f, _0x14882e), _0x14882e;
        case "3":
          for (var _0x2a5938 in _0x2b6f1f) if ("default" !== _0x2a5938 && Object.prototype.hasOwnProperty.call(_0x2b6f1f, _0x2a5938)) {
            var _0x562827 = _0x427daa ? Object.getOwnPropertyDescriptor(_0x2b6f1f, _0x2a5938) : null;
            _0x562827 && (_0x562827.get || _0x562827.set) ? Object.defineProperty(_0x14882e, _0x2a5938, _0x562827) : _0x14882e[_0x2a5938] = _0x2b6f1f[_0x2a5938];
          }
          continue;
        case "4":
          var _0x14a295 = E(_0x2581c8);
          continue;
        case "5":
          var _0x14882e = {},
            _0x427daa = Object.defineProperty && Object.getOwnPropertyDescriptor;
          continue;
        case "6":
          if (null === _0x2b6f1f || "object" != typeof _0x2b6f1f && "function" != typeof _0x2b6f1f) return {
            default: _0x2b6f1f
          };
          continue;
      }
      break;
    }
  }
  var k = function (_0xc5e696) {
      (0, u.default)(_0x183e7a, _0xc5e696);
      var _0x2df9dc,
        _0x1c55c9,
        _0x216e3c = (_0x2df9dc = _0x183e7a, _0x1c55c9 = function () {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
          } catch (_0x1cc448) {
            return !1;
          }
        }(), function () {
          var _0x4650dc,
            _0x27052b = (0, c.default)(_0x2df9dc);
          if (_0x1c55c9) {
            var _0x529596 = (0, c.default)(this).constructor;
            _0x4650dc = Reflect.construct(_0x27052b, arguments, _0x529596);
          } else _0x4650dc = _0x27052b.apply(this, arguments);
          return (0, l.default)(this, _0x4650dc);
        });
      function _0x183e7a() {
        for (var _0x5e95c9 = "2|1|4|0|3".split("|"), _0x1ace95 = 0;;) {
          switch (_0x5e95c9[_0x1ace95++]) {
            case "0":
              for (var _0x5b300b = arguments.length, _0x4e3a55 = new Array(_0x5b300b), _0x287db0 = 0; _0x287db0 < _0x5b300b; _0x287db0++) _0x4e3a55[_0x287db0] = arguments[_0x287db0];
              continue;
            case "1":
              var _0x4a4dc6;
              continue;
            case "2":
              continue;
            case "3":
              return (_0x4a4dc6 = _0x216e3c.call.apply(_0x216e3c, [this].concat(_0x4e3a55))).state = {
                currentShunt: 1,
                isShuntVisible: !1
              }, _0x4a4dc6.confirmShunt = function (_0x302221) {
                _0x4a4dc6.toggleShuntModal(), f.AsyncStorage.setItem("shunt", String(_0x302221)).then(function () {
                  var _0x1978f6 = _0x4a4dc6.props.setting;
                  _0x4a4dc6._isMounted && _0x4a4dc6.setState({
                    currentShunt: parseInt(_0x302221, 10)
                  }), _0x1978f6(_.API_APP_SETTING, {
                    app_img_shunt: _0x302221
                  }, !0);
                });
              }, _0x4a4dc6.getShunt = function () {
                f.AsyncStorage.getItem("shunt").then(function (_0x3b9a51) {
                  _0x4a4dc6._isMounted && _0x4a4dc6.setState({
                    currentShunt: parseInt(null != _0x3b9a51 ? _0x3b9a51 : 1, 10)
                  });
                });
              }, _0x4a4dc6.toggleShuntModal = function () {
                _0x4a4dc6.setState({
                  isShuntVisible: !_0x4a4dc6.state.isShuntVisible
                }), _0x4a4dc6.getShunt();
              }, _0x4a4dc6;
            case "4":
              (0, n.default)(this, _0x183e7a);
              continue;
          }
          break;
        }
      }
      return (0, o.default)(_0x183e7a, [{
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
        key: "render",
        value: function () {
          var _0x26eeef = this.props,
            _0x1df2db = _0x26eeef.backgroundOpacity,
            _0x3bd72a = _0x26eeef.Setting,
            _0x5d1d17 = this.state.isShuntVisible,
            _0x32c612 = Array.isArray(_0x3bd72a.info.app_shunts) ? _0x3bd72a.info.app_shunts : [],
            _0x4f3bce = function (_0x49d76c) {
              var _0x947f33 = _0x49d76c.onPress,
                _0x6658e2 = _0x49d76c.icon;
              const title=S.lang(_0x49d76c.label || {search:'搜索',calendar:'每周更新',bolt:'图源',signal:'线路'}[_0x6658e2]);
              return s.default.createElement(f.TouchableOpacity,{
                onPress:_0x947f33,accessibilityRole:'button',accessibilityLabel:title,
                style:{minHeight:44,paddingHorizontal:3,minWidth:40,alignItems:'center',justifyContent:'center'}
              },s.default.createElement(p.default,{name:_0x6658e2,size:17,color:'white'}),
              s.default.createElement(f.Text,{numberOfLines:1,style:{fontSize:11,color:'white',marginTop:2}},title));
            };
          return s.default.createElement(f.Animated.View, {
            style: [h.mainStyle.header, {
              backgroundColor: null != _0x1df2db ? _0x1df2db : P.colors.main,
              top: 0
            }, this.props.homeToolbar ? {
              position: "relative",
              alignSelf: "stretch",
              width: "100%",
              height: 45,
              flexShrink: 0,
              alignItems: "center"
            } : null]
          }, s.default.createElement(M.default, {
            title: "" + (0, S.lang)("切換圖源，加速你的體驗"),
            currentValue: this.state.currentShunt,
            cancelText: (0, S.lang)("我覺得現在很快了"),
            ignoreConfirm: !0,
            isModalVisible: _0x5d1d17,
            options: _0x32c612,
            toggleModal: this.toggleShuntModal,
            confirmCallback: this.confirmShunt
          }), s.default.createElement(f.View, {
            style: [h.mainStyle.shadow]
          }, !_0x3bd72a.isLoading && s.default.createElement(f.Image, {
            style: [h.mainStyle.headerLogo],
            resizeMode: "contain",
            source: {
              uri: _0x3bd72a.info.img_host + "/media/logo/new_logo.png?v=2020000813"
            }
          })), s.default.createElement(f.View, {
            style: [h.mainStyle.headerRight]
          }, s.default.createElement(_0x4f3bce, {
            onPress: this.toggleShuntModal,
            icon: "bolt"
          }), s.default.createElement(_0x4f3bce, {
            onPress: function () {
              return _0x26eeef.onLines ? _0x26eeef.onLines() : y.navigate("LineSettings",{returnToMain:true});
            },
            icon: "signal"
          }), s.default.createElement(_0x4f3bce, {
            onPress: function () {
              return y.navigate("Week");
            },
            icon: "calendar"
          }), this.props.onDailySign ? s.default.createElement(_0x4f3bce, {
            onPress: this.props.onDailySign,
            icon: "check",
            label: "每日簽到"
          }) : null, s.default.createElement(_0x4f3bce, {
            onPress: function () {
              return y.navigate("Search");
            },
            icon: "search"
          })));
        }
      }]), _0x183e7a;
    }(s.Component),
    V = (0, v.connect)(function (_0xc5f3ae) {
      return {
        Setting: _0xc5f3ae.Setting
      };
    }, {
      setting: b.setting
    })(k);
  e.default = V;
}, 808, [1, 155, 156, 157, 159, 162, 55, 2, 809, 810, 825, 651, 410, 647, 826, 650, 729]);
