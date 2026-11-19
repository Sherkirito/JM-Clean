__d(function (g, r, i, a, m, e, d) {
  var t = r(d[0]);
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var n = t(r(d[1])),
    o = r(d[2]),
    l = r(d[3]),
    c = t(r(d[4])),
    u = function (_0x43fc76) {
      for (var _0x45f5b0 = "4|1|0|5|6|2|7|3".split("|"), _0xcac21f = 0;;) {
        switch (_0x45f5b0[_0xcac21f++]) {
          case "0":
            var _0x24ca37 = y(void 0);
            continue;
          case "1":
            if (null === _0x43fc76 || "object" != typeof _0x43fc76 && "function" != typeof _0x43fc76) return {
              default: _0x43fc76
            };
            continue;
          case "2":
            for (var _0x43cc3a in _0x43fc76) if ("default" !== _0x43cc3a && Object.prototype.hasOwnProperty.call(_0x43fc76, _0x43cc3a)) {
              var _0x6b87a6 = _0x2d7998 ? Object.getOwnPropertyDescriptor(_0x43fc76, _0x43cc3a) : null;
              _0x6b87a6 && (_0x6b87a6.get || _0x6b87a6.set) ? Object.defineProperty(_0x595daf, _0x43cc3a, _0x6b87a6) : _0x595daf[_0x43cc3a] = _0x43fc76[_0x43cc3a];
            }
            continue;
          case "3":
            return _0x595daf;
          case "4":
            if (_0x43fc76 && _0x43fc76.__esModule) return _0x43fc76;
            continue;
          case "5":
            if (_0x24ca37 && _0x24ca37.has(_0x43fc76)) return _0x24ca37.get(_0x43fc76);
            continue;
          case "6":
            var _0x595daf = {},
              _0x2d7998 = Object.defineProperty && Object.getOwnPropertyDescriptor;
            continue;
          case "7":
            _0x595daf.default = _0x43fc76, _0x24ca37 && _0x24ca37.set(_0x43fc76, _0x595daf);
            continue;
        }
        break;
      }
    }(r(d[5])),
    s = r(d[6]),
    f = r(d[7]),
    p = r(d[8]);
  function y(_0x112b6a) {
    if ("function" != typeof WeakMap) return null;
    var _0x34944f = new WeakMap(),
      _0x4f7aee = new WeakMap();
    return (y = function (_0x54c140) {
      return _0x54c140 ? _0x4f7aee : _0x34944f;
    })(_0x112b6a);
  }
  e.default = function (_0x4baf14) {
    var _0x50c3a3 = _0x4baf14.item,
      _0x2ef1fc = "26" === _0x50c3a3.id;
    return n.default.createElement(o.View, {
      style: [l.comicHorizontalListStyle.listBlock, (0, p.isDarkMode)() && {
        backgroundColor: f.colors.backgroundDark
      }]
    }, n.default.createElement(o.View, {
      style: {
        flexDirection: "row",
        alignItems: "center"
      }
    }, n.default.createElement(o.Text, {
      style: [l.comicHorizontalListStyle.listTitle, (0, p.isDarkMode)() && {
        color: f.colors.textPrimaryDark
      }]
    }, _0x2ef1fc ? (0, s.lang)(["週日連載更新", "週一連載更新", "週二連載更新", "週三連載更新", "週四連載更新", "週五連載更新", "週六連載更新"][new Date().getDay()]) : _0x50c3a3.title), _0x50c3a3.type && n.default.createElement(o.Pressable, {
      style: {
        marginLeft: "auto",
        paddingHorizontal: 10,
        paddingVertical: 5
      },
      onPress: function () {
        "26" === _0x50c3a3.id ? u.navigate("SerializationList") : "promote" === _0x50c3a3.type ? u.navigate("MoreList", {
          id: _0x50c3a3.id,
          page: 0,
          title: _0x50c3a3.title
        }) : u.navigate("Categories", {
          slug: _0x50c3a3.slug
        });
      }
    }, n.default.createElement(o.Text, {
      style: {
        color: f.colors.secondary
      }
    }, (0, s.lang)("查看更多")))), n.default.createElement(o.FlatList, {
      nestedScrollEnabled: !0,
      data: _0x50c3a3.content,
      renderItem: function (_0x3133c8) {
        var _0x1c1944 = _0x3133c8.item;
        return n.default.createElement(c.default, {
          showUpdate: _0x2ef1fc,
          item: _0x1c1944
        });
      },
      horizontal: !0,
      keyExtractor: function (_0x17117f) {
        return _0x17117f.id;
      },
      showsHorizontalScrollIndicator: !1,
      windowSize: 3,
      initialNumToRender: 4,
      maxToRenderPerBatch: 3
    }));
  };
}, 1422, [1, 55, 2, 1423, 1424, 825, 651, 729, 655]);
