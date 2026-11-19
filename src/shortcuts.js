__d(function (g, r, i, a, m, e, d) {
  var t = r(d[0]);
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var n = t(r(d[1])),
    o = t(r(d[2])),
    l = t(r(d[3])),
    u = t(r(d[4])),
    c = t(r(d[5])),
    f = w(r(d[6])),
    p = r(d[7]),
    s = t(r(d[8])),
    v = w(r(d[9])),
    y = r(d[10]),
    b = r(d[11]),
    k = r(d[12]);
  function h(_0x21418b) {
    if ("function" != typeof WeakMap) return null;
    var _0x30e00b = new WeakMap(),
      _0x51429e = new WeakMap();
    return (h = function (_0x1a14f8) {
      return _0x1a14f8 ? _0x51429e : _0x30e00b;
    })(_0x21418b);
  }
  function w(_0x1ad15e, _0x5c512c) {
    for (var _0x2229c0 = "2|5|4|1|6|3|0".split("|"), _0xbe31d1 = 0;;) {
      switch (_0x2229c0[_0xbe31d1++]) {
        case "0":
          return _0x4a740f.default = _0x1ad15e, _0x3ba3ba && _0x3ba3ba.set(_0x1ad15e, _0x4a740f), _0x4a740f;
        case "1":
          if (_0x3ba3ba && _0x3ba3ba.has(_0x1ad15e)) return _0x3ba3ba.get(_0x1ad15e);
          continue;
        case "2":
          if (!_0x5c512c && _0x1ad15e && _0x1ad15e.__esModule) return _0x1ad15e;
          continue;
        case "3":
          for (var _0x1a1a4d in _0x1ad15e) if ("default" !== _0x1a1a4d && Object.prototype.hasOwnProperty.call(_0x1ad15e, _0x1a1a4d)) {
            var _0x2f474d = _0x2f4fdb ? Object.getOwnPropertyDescriptor(_0x1ad15e, _0x1a1a4d) : null;
            _0x2f474d && (_0x2f474d.get || _0x2f474d.set) ? Object.defineProperty(_0x4a740f, _0x1a1a4d, _0x2f474d) : _0x4a740f[_0x1a1a4d] = _0x1ad15e[_0x1a1a4d];
          }
          continue;
        case "4":
          var _0x3ba3ba = h(_0x5c512c);
          continue;
        case "5":
          if (null === _0x1ad15e || "object" != typeof _0x1ad15e && "function" != typeof _0x1ad15e) return {
            default: _0x1ad15e
          };
          continue;
        case "6":
          var _0x4a740f = {},
            _0x2f4fdb = Object.defineProperty && Object.getOwnPropertyDescriptor;
          continue;
      }
      break;
    }
  }
  var O = function (_0x288f43) {
    (0, l.default)(_0xc26b9b, _0x288f43);
    var _0x30ac5d,
      _0x255ea3,
      _0x418a2c = (_0x30ac5d = _0xc26b9b, _0x255ea3 = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
        } catch (_0x2ab90a) {
          return !1;
        }
      }(), function () {
        var _0x490ec2,
          _0x3b33e6 = (0, c.default)(_0x30ac5d);
        if (_0x255ea3) {
          var _0x36b3bf = (0, c.default)(this).constructor;
          _0x490ec2 = Reflect.construct(_0x3b33e6, arguments, _0x36b3bf);
        } else _0x490ec2 = _0x3b33e6.apply(this, arguments);
        return (0, u.default)(this, _0x490ec2);
      });
    function _0xc26b9b() {
      return (0, n.default)(this, _0xc26b9b), _0x418a2c.apply(this, arguments);
    }
    return (0, o.default)(_0xc26b9b, [{
      key: "componentDidMount",
      value: function () {}
    }, {
      key: "render",
      value: function () {
        var _0x11d9f4 = [{
          icon: "paper-plane",
          title: (0, y.lang)("最新"),
          color: "#ff7a00",
          navigator: function () {
            return v.navigate("Categories", {
              order: "",
              cid: 0
            });
          }
        }, {
          icon: "fire",
          title: (0, y.lang)("熱門榜"),
          color: "red",
          navigator: function () {
            return v.navigate("Categories", {
              slug: "",
              order: "mv"
            });
          }
        }, {
          icon: "apple-alt",
          title: (0, y.lang)("韓漫"),
          color: "#6300bf",
          navigator: function () {
            return v.navigate("Categories", {
              slug: "hanman"
            });
          }
        }, {
          icon: "book-open",
          title: (0, y.lang)("單本"),
          color: "#70b603",
          navigator: function () {
            return v.navigate("Categories", {
              slug: "single"
            });
          }
        }, {
          icon: "boxes",
          title: (0, y.lang)("書庫"),
          color: "brown",
          navigator: function () {
            return v.navigate("Creator");
          }
        }];
        return f.default.createElement(p.View, {
          style: {
            backgroundColor: "1" === g.darkMode ? b.colors.backgroundDark : "white",
            flex: 1,
            flexDirection: "row",
            paddingLeft: 10,
            paddingRight: 10,
            marginBottom: 20,
            minHeight: 50
          }
        }, f.default.createElement(p.View, {
          style: [k.topBarStyle.topBar, "1" === g.darkMode && {
            backgroundColor: b.colors.backgroundDark
          }]
        }, _0x11d9f4.map(function (_0x541a4f, _0x1d89f6) {
          return f.default.createElement(p.TouchableHighlight, {
            style: {
              flex: 1,minHeight:44
            },
            key: _0x1d89f6,
            onPress: _0x541a4f.navigator
          }, f.default.createElement(p.View, {
            style: [k.topBarStyle.topBarItem, "1" === g.darkMode && {
              backgroundColor: b.colors.backgroundDark
            }]
          }, f.default.createElement(s.default, {
            name: _0x541a4f.icon,
            size: 15,
            color: _0x541a4f.color
          }), f.default.createElement(p.Text, {
            style: [k.topBarStyle.topBarItemText, "1" === g.darkMode && {
              color: "white"
            }]
          }, (0, y.lang)("" + _0x541a4f.title))));
        })));
      }
    }]), _0xc26b9b;
  }(f.Component);
  e.default = O;
}, 1420, [1, 155, 156, 157, 159, 162, 55, 2, 810, 825, 651, 729, 1421]);
