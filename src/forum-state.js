__d(function (g, r, i, a, m, e, d) {
  0;
  var t = r(d[0]);
  Object.defineProperty(e, "__esModule", {
    "value": true
  }), e["default"] = void 0;
  var n = t(r(d[1])),
    o = function (_0x8ee5b3, _0x3e1b37) {
      var _0x57d569 = {
          "gosdf": "3|5|6|7|2|4|1|0",
          "kEGDD": function (_0x47a62d, _0x6b88e4) {
            return _0x47a62d && _0x6b88e4;
          },
          "bsSfb": function (_0x4ac5ff, _0xace80a) {
            return _0x4ac5ff !== _0xace80a;
          },
          "YlFPq": "default",
          "vclTJ": function (_0x148162, _0x3faa0b) {
            return _0x148162 === _0x3faa0b;
          },
          "KfDJS": function (_0x2b318d, _0x13d690) {
            return _0x2b318d != _0x13d690;
          },
          "yyVcW": "object",
          "CxjdP": "function",
          "bKCdN": function (_0x2e5700, _0x4e4618) {
            return _0x2e5700(_0x4e4618);
          }
        },
        _0x299050 = "3|5|6|7|2|4|1|0".split("|"),
        _0x37af6f = 0;
      while (true) {
        switch (_0x299050[_0x37af6f++]) {
          case "0":
            return _0x52a289;
          case "1":
            _0x52a289["default"] = _0x8ee5b3, _0x1b9daf && _0x1b9daf.set(_0x8ee5b3, _0x52a289);
            continue;
          case "2":
            var _0x52a289 = {},
              _0x63e17d = Object.defineProperty && Object.getOwnPropertyDescriptor;
            continue;
          case "3":
            if (!_0x3e1b37 && _0x8ee5b3 && _0x8ee5b3.__esModule) return _0x8ee5b3;
            continue;
          case "4":
            for (var _0xdd911b in _0x8ee5b3) if ("default" !== _0xdd911b && Object.prototype.hasOwnProperty.call(_0x8ee5b3, _0xdd911b)) {
              var _0x54b06e = _0x63e17d ? Object.getOwnPropertyDescriptor(_0x8ee5b3, _0xdd911b) : null;
              _0x54b06e && (_0x54b06e.get || _0x54b06e.set) ? Object.defineProperty(_0x52a289, _0xdd911b, _0x54b06e) : _0x52a289[_0xdd911b] = _0x8ee5b3[_0xdd911b];
            }
            continue;
          case "5":
            if (null === _0x8ee5b3 || "object" != typeof _0x8ee5b3 && "function" != typeof _0x8ee5b3) return {
              "default": _0x8ee5b3
            };
            continue;
          case "6":
            var _0x1b9daf = u(_0x3e1b37);
            continue;
          case "7":
            if (_0x1b9daf && _0x1b9daf.has(_0x8ee5b3)) return _0x1b9daf.get(_0x8ee5b3);
            continue;
        }
        break;
      }
    }(r(d[2]));
  function u(_0x453423) {
    var _0x56b130 = {
      "hiIko": function (_0x90a269, _0x5957dc) {
        return _0x90a269 != _0x5957dc;
      },
      "tPGXy": "function"
    };
    if ("function" != typeof WeakMap) return null;
    var _0x2584d0 = new WeakMap(),
      _0x46bd08 = new WeakMap();
    return (u = function (_0x25e6e8) {
      return _0x25e6e8 ? _0x46bd08 : _0x2584d0;
    })(_0x453423);
  }
  var s = {
      "forumList": {list:[],total:0},
      "isLoading": true,
      "isLoadMore": false,
      "isRefreshing": false,
      "isCommentResultLoading": false,
      "commentResult": null,
      "voteData": null,
      "isVoteLoading": false
    },
    f = function () {
      var _0x4ac775 = {
          "tcRWn": function (_0x56e2a7, _0x114b14) {
            return _0x56e2a7 > _0x114b14;
          },
          "AcKPM": function (_0x3708af, _0x3ffffc) {
            return _0x3708af !== _0x3ffffc;
          },
          "qdGgJ": function (_0x21ed8c, _0x5d1b15) {
            return _0x21ed8c > _0x5d1b15;
          }
        },
        _0x4c58b2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : s,
        _0x449578 = arguments.length > 1 ? arguments[1] : void 0;
      switch (_0x449578.type) {
        case o.LOAD_FORUM_LIST:
          return (0, n["default"])({}, _0x4c58b2, {
            "isLoading": _0x449578.isLoading,
            "isLoadMore": _0x449578.isLoadMore,
            "isRefreshing": _0x449578.isRefreshing
          });
        case o.GET_FORUM_LIST:
          return (0, n["default"])({}, _0x4c58b2, {
            "isLoading": false,
            "isRefreshing": false,
            "forumList": _0x449578.forumList && Array.isArray(_0x449578.forumList.list) ? _0x449578.forumList : {list:[],total:0}
          });
        case o.LOAD_COMMENT_DATA:
          return (0, n["default"])({}, _0x4c58b2, {
            "isCommentResultLoading": _0x449578.isCommentResultLoading
          });
        case o.GET_COMMENT_DATA:
          return (0, n["default"])({}, _0x4c58b2, {
            "isCommentResultLoading": false,
            "commentResult": _0x449578.commentResult
          });
        case o.LOAD_FORUM_VOTE_DATA:
          return (0, n["default"])({}, _0x4c58b2, {
            "isVoteLoading": _0x449578.isVoteLoading
          });
        case o.GET_FORUM_VOTE_DATA:
          return (0, n["default"])({}, _0x4c58b2, {
            "isVoteLoading": false,
            "voteData": _0x449578.voteData
          });
        default:
          return _0x4c58b2;
      }
    };
  e["default"] = f;
}, 671, [1, 58, 662]);
