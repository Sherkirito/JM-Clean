__d(function (g, r, i, a, m, e, d) {
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var t = function (_0x337c8d) {
    for (var _0x1044f5 = "3|0|1|2|5|4|7|6".split("|"), _0x3e8b7b = 0;;) {
      switch (_0x1044f5[_0x3e8b7b++]) {
        case "0":
          if (null === _0x337c8d || "object" != typeof _0x337c8d && "function" != typeof _0x337c8d) return {
            default: _0x337c8d
          };
          continue;
        case "1":
          var _0x44b719 = n(void 0);
          continue;
        case "2":
          if (_0x44b719 && _0x44b719.has(_0x337c8d)) return _0x44b719.get(_0x337c8d);
          continue;
        case "3":
          if (_0x337c8d && _0x337c8d.__esModule) return _0x337c8d;
          continue;
        case "4":
          for (var _0x58b97e in _0x337c8d) if ("default" !== _0x58b97e && Object.prototype.hasOwnProperty.call(_0x337c8d, _0x58b97e)) {
            var _0x58c0e9 = _0x2ff156 ? Object.getOwnPropertyDescriptor(_0x337c8d, _0x58b97e) : null;
            _0x58c0e9 && (_0x58c0e9.get || _0x58c0e9.set) ? Object.defineProperty(_0x4fed94, _0x58b97e, _0x58c0e9) : _0x4fed94[_0x58b97e] = _0x337c8d[_0x58b97e];
          }
          continue;
        case "5":
          var _0x4fed94 = {},
            _0x2ff156 = Object.defineProperty && Object.getOwnPropertyDescriptor;
          continue;
        case "6":
          return _0x4fed94;
        case "7":
          _0x4fed94.default = _0x337c8d, _0x44b719 && _0x44b719.set(_0x337c8d, _0x4fed94);
          continue;
      }
      break;
    }
  }(r(d[0]));
  function n(_0x3a7760) {
    if ("function" != typeof WeakMap) return null;
    var _0xe6aa5d = new WeakMap(),
      _0x3a2d62 = new WeakMap();
    return (n = function (_0x1d2f06) {
      return _0x1d2f06 ? _0x3a2d62 : _0xe6aa5d;
    })(_0x3a7760);
  }
  r(d[1]).exp;
  var o = {
    fomatFloat: function (_0x1f8517, _0x9307a9) {
      var _0x2694fc = "";
      return _0x1f8517 < 1e3 ? _0x1f8517 : (_0x2694fc = "K", (_0x1f8517 /= 1e3) > 100 && (_0x1f8517 /= 100, _0x2694fc = "M"), Math.round(_0x1f8517 * Math.pow(10, _0x9307a9)) / Math.pow(10, _0x9307a9) + _0x2694fc);
    },
    modifyData: function (_0x53855e) {
      var _0x19635f = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [],
        _0x1241c9 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3,
        _0x16ca28 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 6,
        _0xe5d8aa = [],
        _0x26bec5 = [];
      return _0x53855e && _0x53855e.forEach(function (_0x24eb18, _0x172fd8) {
        _0x172fd8 % _0x1241c9 == 0 && 0 != _0x172fd8 && (_0xe5d8aa.push(_0x26bec5), _0x26bec5 = []), _0x19635f.length > 0 && _0x172fd8 % _0x16ca28 == 0 && 0 != _0x172fd8 && (_0xe5d8aa.push({
          type: "banner",
          info: _0x19635f
        }), _0x26bec5 = []), _0x26bec5.push(_0x24eb18);
      }), _0xe5d8aa.push(_0x26bec5), _0xe5d8aa;
    },
    redirectToScreen: function (_0x41e565) {
      for (var _0x2b30bf = "2|5|6|0|1|3|4".split("|"), _0x50e4b6 = 0;;) {
        switch (_0x2b30bf[_0x50e4b6++]) {
          case "0":
            var _0x275e27 = _0x48c1e1[2],
              _0x5c2db7 = {};
            continue;
          case "1":
            _0x48c1e1.splice(0, 3);
            continue;
          case "2":
            continue;
          case "3":
            var _0x379c3c = _0x48c1e1;
            continue;
          case "4":
            _0x379c3c.forEach(function (_0x5b28f9, _0xa615db) {
              _0x5b28f9 && _0x379c3c[_0xa615db + 1] && (_0x5c2db7[_0x5b28f9] = _0x379c3c[_0xa615db + 1]);
            }), ["Main", "Home", "Categories", "Detail", "Chapter", "Member", "Forum", "Search", "Week", "MoreList", "MoreCategories", "Creator", "CreatorView", "CreatorWork", "SerializationList"].indexOf(_0x275e27) >= 0 && t.navigate(_0x275e27, _0x5c2db7);
            continue;
          case "5":
            var _0x48c1e1 = _0x41e565.split("/");
            continue;
          case "6":
            _0x48c1e1.length;
            continue;
        }
        break;
      }
    }
  };
  e.default = o;
}, 1628, [825, 740]);
