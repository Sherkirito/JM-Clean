__d(function (g, r, i, a, m, e, d) {
  var t = r(d[0]);
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.setDark = e.setting = void 0;
  var n = t(r(d[1])),
    u = function (_0x3d737f) {
      for (var _0x2e7034 = "2|7|6|5|1|0|4|3".split("|"), _0x4ffbb6 = 0;;) {
        switch (_0x2e7034[_0x4ffbb6++]) {
          case "0":
            for (var _0x2ed518 in _0x3d737f) if ("default" !== _0x2ed518 && Object.prototype.hasOwnProperty.call(_0x3d737f, _0x2ed518)) {
              var _0x53ef3c = _0x3286fd ? Object.getOwnPropertyDescriptor(_0x3d737f, _0x2ed518) : null;
              _0x53ef3c && (_0x53ef3c.get || _0x53ef3c.set) ? Object.defineProperty(_0x179ecd, _0x2ed518, _0x53ef3c) : _0x179ecd[_0x2ed518] = _0x3d737f[_0x2ed518];
            }
            continue;
          case "1":
            var _0x179ecd = {},
              _0x3286fd = Object.defineProperty && Object.getOwnPropertyDescriptor;
            continue;
          case "2":
            if (_0x3d737f && _0x3d737f.__esModule) return _0x3d737f;
            continue;
          case "3":
            return _0x179ecd;
          case "4":
            _0x179ecd.default = _0x3d737f, _0x43d25f && _0x43d25f.set(_0x3d737f, _0x179ecd);
            continue;
          case "5":
            if (_0x43d25f && _0x43d25f.has(_0x3d737f)) return _0x43d25f.get(_0x3d737f);
            continue;
          case "6":
            var _0x43d25f = o(void 0);
            continue;
          case "7":
            if (null === _0x3d737f || "object" != typeof _0x3d737f && "function" != typeof _0x3d737f) return {
              default: _0x3d737f
            };
            continue;
        }
        break;
      }
    }(r(d[2]));
  function o(_0x13e941) {
    if ("function" != typeof WeakMap) return null;
    var _0x27fe2e = new WeakMap(),
      _0x1a31ac = new WeakMap();
    return (o = function (_0x436b3a) {
      return _0x436b3a ? _0x1a31ac : _0x27fe2e;
    })(_0x13e941);
  }
  e.setting = function (_0x4ad408, _0x3fbef0, _0x1e457c) {
    return function (_0x9d94ff) {
      return _0x9d94ff(f(_0x1e457c)), n.default.fetchGet(_0x4ad408, _0x3fbef0, function (_0x47392b) {
        return _0x9d94ff(c(_0x47392b.data && "object" == typeof _0x47392b.data ? _0x47392b.data : {}));
      }, function (_0x5d2d74) {
        return _0x9d94ff(c({}));
      });
    };
  }, e.setDark = function (_0x51acfa, _0x385778, _0x109fcd) {
    return function (_0x416604) {
      return n.default.fetchPost(_0x51acfa, _0x385778, function (_0x485713) {
        return _0x416604(function () {
          return {
            type: u.SET_SETTING_DARK,
            darkMode: _0x109fcd
          };
        });
      }, function (_0x24b9b1) {
        return function () {
          return {
            type: u.SET_SETTING_DARK,
            darkMode: _0x109fcd
          };
        };
      });
    };
  };
  var f = function (_0x43142e) {
      return {
        type: u.LOAD_SETTING_INFO,
        isLoading: _0x43142e
      };
    },
    c = function (_0x27ae97) {
      return {
        type: u.GET_SETTING_INFO,
        info: _0x27ae97
      };
    };
}, 647, [1, 648, 662]);
