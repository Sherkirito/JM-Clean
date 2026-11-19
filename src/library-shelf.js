__d(function (g, r, i, a, m, e, d) {
  var t = r(d[0]);
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var o = t(r(d[1])),
    n = r(d[2]),
    l = function (_0x2c5f82) {
      for (var _0xe00c00 = "7|3|2|0|1|4|5|6".split("|"), _0x2e2dc0 = 0;;) {
        switch (_0xe00c00[_0x2e2dc0++]) {
          case "0":
            if (_0x598cba && _0x598cba.has(_0x2c5f82)) return _0x598cba.get(_0x2c5f82);
            continue;
          case "1":
            var _0xa4cc71 = {},
              _0xd08b0c = Object.defineProperty && Object.getOwnPropertyDescriptor;
            continue;
          case "2":
            var _0x598cba = p(void 0);
            continue;
          case "3":
            if (null === _0x2c5f82 || "object" != typeof _0x2c5f82 && "function" != typeof _0x2c5f82) return {
              default: _0x2c5f82
            };
            continue;
          case "4":
            for (var _0x8a4c4f in _0x2c5f82) if ("default" !== _0x8a4c4f && Object.prototype.hasOwnProperty.call(_0x2c5f82, _0x8a4c4f)) {
              var _0x525d2a = _0xd08b0c ? Object.getOwnPropertyDescriptor(_0x2c5f82, _0x8a4c4f) : null;
              _0x525d2a && (_0x525d2a.get || _0x525d2a.set) ? Object.defineProperty(_0xa4cc71, _0x8a4c4f, _0x525d2a) : _0xa4cc71[_0x8a4c4f] = _0x2c5f82[_0x8a4c4f];
            }
            continue;
          case "5":
            _0xa4cc71.default = _0x2c5f82, _0x598cba && _0x598cba.set(_0x2c5f82, _0xa4cc71);
            continue;
          case "6":
            return _0xa4cc71;
          case "7":
            if (_0x2c5f82 && _0x2c5f82.__esModule) return _0x2c5f82;
            continue;
        }
        break;
      }
    }(r(d[3])),
    c = r(d[4]),
    u = r(d[5]),
    f = t(r(d[6])),
    s = r(d[7]),
    k = r(d[8]),
    y = t(r(d[9]));
  function p(_0x35b787) {
    if ("function" != typeof WeakMap) return null;
    var _0x4a9960 = new WeakMap(),
      _0x4de248 = new WeakMap();
    return (p = function (_0xc40189) {
      return _0xc40189 ? _0x4de248 : _0x4a9960;
    })(_0x35b787);
  }
  var w = (0, k.connect)(function (_0x5130a5) {
    return {
      Setting: _0x5130a5.Setting
    };
  })(function (_0x18aa5c) {
    var _0x142b11 = _0x18aa5c.Setting,
      _0x13a4dd = _0x18aa5c.item;
    return o.default.createElement(n.View, {
      style: [v.listBlock, "1" === g.darkMode ? {
        backgroundColor: u.colors.backgroundDark
      } : {}]
    }, o.default.createElement(n.View, {
      style: {
        flexDirection: "row"
      }
    }, o.default.createElement(n.Text, {
      style: [v.listTitle, "1" === g.darkMode ? {
        color: u.colors.textPrimaryDark
      } : {}]
    }, _0x13a4dd.title), o.default.createElement(n.Text, {
      onPress: function () {
        return _0x13a4dd.type, void l.navigate("Creator");
      },
      style: {
        marginLeft: "auto",
        marginRight: 10,
        color: u.colors.secondary
      }
    }, (0, c.lang)("查看更多"))), o.default.createElement(n.FlatList, {
      nestedScrollEnabled: !0,
      data: _0x13a4dd.content,
      renderItem: function (_0x3bb026) {
        var _0xadd664,
          _0x1ffa41 = _0x3bb026.item;
        return _0xadd664 = _0x1ffa41, o.default.createElement(n.Pressable, {
          onPress: function () {
            return _0x239fdf = _0xadd664.id, void l.navigate("CreatorView", {
              workId: _0x239fdf
            });
            var _0x239fdf;
          },
          key: _0xadd664.id,
          style: [v.workCard, (0, s.isDarkMode)() && {
            backgroundColor: u.colors.backgroundDark
          }]
        }, o.default.createElement(f.default, {
          source: {
            uri: _0x142b11.info.img_host + "" + _0xadd664.image
          },
          style: v.workImage
        }), o.default.createElement(n.Text, {
          numberOfLines: 1,
          style: [v.workTitle, (0, s.isDarkMode)() && {
            color: u.colors.textPrimaryDark
          }]
        }, _0xadd664.name), o.default.createElement(n.Text, {
          style: v.author
        }, _0xadd664.author));
      },
      horizontal: !0,
      keyExtractor: function (_0x34313d) {
        return _0x34313d.id;
      },
      showsHorizontalScrollIndicator: !1,
      windowSize: 3,
      initialNumToRender: 4,
      maxToRenderPerBatch: 3
    }));
  });
  e.default = w;
  var v = n.StyleSheet.create({
    listBlock: {
      padding: 8,
      backgroundColor: "white",
      overflow: "hidden",
      marginBottom: 20
    },
    listTitle: {
      paddingLeft: 10
    },
    workCard: {
      width: .32 * y.default.window.width,
      height: "auto",
      paddingTop: 5,
      padding: 3
    },
    workImage: {
      marginTop: 5,
      width: "100%",
      aspectRatio: 1
    },
    workTitle: {
      padding: 8,
      fontSize: 16,
      color: u.colors.tertiary
    },
    author: {
      padding: 8,
      fontSize: 14,
      color: u.colors.tertiary,
      textDecorationLine: "underline"
    }
  });
}, 1598, [1, 55, 2, 825, 651, 729, 730, 655, 410, 718]);
