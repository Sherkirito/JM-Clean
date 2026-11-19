__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0;
    var o = t(r(d[1])), n = t(r(d[2])), l = t(r(d[3])), u = t(r(d[4])), f = t(r(d[5])), c = R(r(d[6])), s = r(d[7]), y = r(d[8]), b = r(d[9]), k = r(d[10]), p = R(r(d[11]));
    function w(_0x5c9e64) {
        if ("function" != typeof WeakMap) return null;
        var _0xc25cc2 = new WeakMap, _0x2d9cf0 = new WeakMap;
        return (w = function(_0x18bdde) {
            return _0x18bdde ? _0x2d9cf0 : _0xc25cc2;
        })(_0x5c9e64);
    }
    function R(_0xd8129c, _0x596ad6) {
        for (var _0x156817 = "3|6|0|1|2|4|5".split("|"), _0x57dc40 = 0; ;) {
            switch (_0x156817[_0x57dc40++]) {
              case "0":
                var _0x1c8e67 = w(_0x596ad6);
                continue;

              case "1":
                if (_0x1c8e67 && _0x1c8e67.has(_0xd8129c)) return _0x1c8e67.get(_0xd8129c);
                continue;

              case "2":
                var _0x1ce7d4 = {}, _0x30494b = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;

              case "3":
                if (!_0x596ad6 && _0xd8129c && _0xd8129c.__esModule) return _0xd8129c;
                continue;

              case "4":
                for (var _0x1c492b in _0xd8129c) if ("default" !== _0x1c492b && Object.prototype.hasOwnProperty.call(_0xd8129c, _0x1c492b)) {
                    var _0x45e557 = _0x30494b ? Object.getOwnPropertyDescriptor(_0xd8129c, _0x1c492b) : null;
                    _0x45e557 && (_0x45e557.get || _0x45e557.set) ? Object.defineProperty(_0x1ce7d4, _0x1c492b, _0x45e557) : _0x1ce7d4[_0x1c492b] = _0xd8129c[_0x1c492b];
                }
                continue;

              case "5":
                return _0x1ce7d4.default = _0xd8129c, _0x1c8e67 && _0x1c8e67.set(_0xd8129c, _0x1ce7d4), 
                _0x1ce7d4;

              case "6":
                if (null === _0xd8129c || "object" != typeof _0xd8129c && "function" != typeof _0xd8129c) return {
                    default: _0xd8129c
                };
                continue;
            }
            break;
        }
    }
    var v = function(_0x1a3fba) {
        (0, l.default)(_0x3d020c, _0x1a3fba);
        var _0x2e37ed, _0x28b824, _0x405236 = (_0x2e37ed = _0x3d020c, _0x28b824 = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0x11f1a1) {
                return !1;
            }
        }(), function() {
            var _0x1abbbd, _0x4cdb45 = (0, f.default)(_0x2e37ed);
            if (_0x28b824) {
                var _0x48a371 = (0, f.default)(this).constructor;
                _0x1abbbd = Reflect.construct(_0x4cdb45, arguments, _0x48a371);
            } else _0x1abbbd = _0x4cdb45.apply(this, arguments);
            return (0, u.default)(this, _0x1abbbd);
        });
        function _0x3d020c() {
            return (0, o.default)(this, _0x3d020c), _0x405236.apply(this, arguments);
        }
        return (0, n.default)(_0x3d020c, [ {
            key: "render",
            value: function() {
                var _0x566b2b = this.props.Member;
                return c.default.createElement(s.View, {
                    style: [ b.memberStyle.infoPanel, "1" === g.darkMode ? {
                        backgroundColor: y.colors.primaryDark
                    } : {} ]
                }, c.default.createElement(s.View, {
                    style: b.memberStyle.settingRow
                }, c.default.createElement(s.View, {
                    style: [ b.memberStyle.infoRow, "1" === g.darkMode ? {
                        backgroundColor: y.colors.backgroundDark
                    } : {} ]
                }, c.default.createElement(s.Text, {
                    style: [ b.memberStyle.infoRowLeft, "1" === g.darkMode ? {
                        color: y.colors.textPrimaryDark
                    } : {} ]
                }, (0, k.lang)("帳號")), c.default.createElement(s.Text, {
                    style: [ b.memberStyle.infoRowRight, "1" === g.darkMode ? {
                        color: y.colors.textPrimaryDark
                    } : {} ],
                    jmVerbatim: !0
                }, _0x566b2b.isLogin ? _0x566b2b.memberInfo.username : "-----")), c.default.createElement(s.View, {
                    style: [ b.memberStyle.infoRow, "1" === g.darkMode ? {
                        backgroundColor: y.colors.backgroundDark
                    } : {} ]
                }, c.default.createElement(s.Text, {
                    style: [ b.memberStyle.infoRowLeft, "1" === g.darkMode ? {
                        color: y.colors.textPrimaryDark
                    } : {} ]
                }, (0, k.lang)("EMAIL")), c.default.createElement(s.Text, {
                    style: [ b.memberStyle.infoRowRight, "1" === g.darkMode ? {
                        color: y.colors.textPrimaryDark
                    } : {} ]
                }, _0x566b2b.isLogin ? _0x566b2b.memberInfo.email : "-----")), _0x566b2b.isLogin && c.default.createElement(s.View, {
                    style: [ b.memberStyle.infoRow, "1" === g.darkMode ? {
                        backgroundColor: y.colors.backgroundDark
                    } : {} ]
                }, c.default.createElement(s.Text, {
                    style: [ b.memberStyle.infoRowLeft, "1" === g.darkMode ? {
                        color: y.colors.textPrimaryDark
                    } : {} ]
                }, (0, k.lang)("密碼")), c.default.createElement(s.TouchableHighlight, {
                    style: b.memberStyle.infoRowRightButton,
                    onPress: function() {
                        return p.navigate("UserEdit");
                    }
                }, c.default.createElement(s.Text, {
                    style: b.memberStyle.infoRowRightButtonText
                }, (0, k.lang)("修改"))))));
            }
        } ]), _0x3d020c;
    }(c.Component);
    e.default = v;
}, 2038, [ 1, 155, 156, 157, 159, 162, 55, 2, 729, 1918, 651, 825 ]);
