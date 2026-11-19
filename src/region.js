__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.getCnWebHost = e.getIpCountry = e.getLanguage = e.isDarkMode = void 0;
    var n = t(r(d[1]));
    e.isDarkMode = function() {
        return "1" === g.darkMode;
    }, e.getLanguage = function() {
        return "CN";
    }, e.getIpCountry = function() {
        var _0x24deac, _0x2ff802, _0x1d3879 = n.default.getState();
        return (null == _0x1d3879 || null == (_0x24deac = _0x1d3879.Setting) || null == (_0x2ff802 = _0x24deac.info) ? void 0 : _0x2ff802.ipcountry) || "CN";
    }, e.getCnWebHost = function() {
        var _0x4e8066, _0xd67366, _0x1df919 = n.default.getState();
        return (null == _0x1df919 || null == (_0x4e8066 = _0x1df919.Setting) || null == (_0xd67366 = _0x4e8066.info) ? void 0 : _0xd67366.main_web_host) || "18comic.vip";
    };
}, 655, [ 1, 656 ]);
