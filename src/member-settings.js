__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0;
    var n = t(r(d[1])), o = t(r(d[2])), l = t(r(d[3])), s = t(r(d[4])), u = t(r(d[5])), c = t(r(d[6])), f = t(r(d[7])), p = I(r(d[8])), h = r(d[9]), y = t(r(d[10])), k = t(r(d[11])), M = r(d[12]), b = t(r(d[13])), v = r(d[14]), w = r(d[15]), S = r(d[16]), _ = r(d[17]), R = I(r(d[18])), V = t(r(d[19])), L = r(d[20]), E = I(r(d[21])), P = t(r(d[22])), D = r(d[23]);
    function A(_0x59cd3d) {
        if ("function" != typeof WeakMap) return null;
        var _0x204a54 = new WeakMap, _0x30c315 = new WeakMap;
        return (A = function(_0x1cc982) {
            return _0x1cc982 ? _0x30c315 : _0x204a54;
        })(_0x59cd3d);
    }
    function I(_0x1eb4d0, _0x2dc244) {
        for (var _0x18c2c6 = "5|6|1|0|3|2|4".split("|"), _0x4d4925 = 0; ;) {
            switch (_0x18c2c6[_0x4d4925++]) {
              case "0":
                if (_0x1d2675 && _0x1d2675.has(_0x1eb4d0)) return _0x1d2675.get(_0x1eb4d0);
                continue;

              case "1":
                var _0x1d2675 = A(_0x2dc244);
                continue;

              case "2":
                for (var _0x486967 in _0x1eb4d0) if ("default" !== _0x486967 && Object.prototype.hasOwnProperty.call(_0x1eb4d0, _0x486967)) {
                    var _0x4d492f = _0x2ec6df ? Object.getOwnPropertyDescriptor(_0x1eb4d0, _0x486967) : null;
                    _0x4d492f && (_0x4d492f.get || _0x4d492f.set) ? Object.defineProperty(_0x1d9a3c, _0x486967, _0x4d492f) : _0x1d9a3c[_0x486967] = _0x1eb4d0[_0x486967];
                }
                continue;

              case "3":
                var _0x1d9a3c = {}, _0x2ec6df = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;

              case "4":
                return _0x1d9a3c.default = _0x1eb4d0, _0x1d2675 && _0x1d2675.set(_0x1eb4d0, _0x1d9a3c), 
                _0x1d9a3c;

              case "5":
                if (!_0x2dc244 && _0x1eb4d0 && _0x1eb4d0.__esModule) return _0x1eb4d0;
                continue;

              case "6":
                if (null === _0x1eb4d0 || "object" != typeof _0x1eb4d0 && "function" != typeof _0x1eb4d0) return {
                    default: _0x1eb4d0
                };
                continue;
            }
            break;
        }
    }
    var x = function(_0x31c736) {
        (0, u.default)(_0x1e78ef, _0x31c736);
        var _0x490619, _0x366636, _0x3f43c8 = (_0x490619 = _0x1e78ef, _0x366636 = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0xeeb97a) {
                return !1;
            }
        }(), function() {
            var _0xfa8e66, _0x950252 = (0, f.default)(_0x490619);
            if (_0x366636) {
                var _0x4e8f6c = (0, f.default)(this).constructor;
                _0xfa8e66 = Reflect.construct(_0x950252, arguments, _0x4e8f6c);
            } else _0xfa8e66 = _0x950252.apply(this, arguments);
            return (0, c.default)(this, _0xfa8e66);
        });
        function _0x1e78ef() {
            for (var _0x38eb94 = "4|3|1|2|0".split("|"), _0x26c975 = 0; ;) {
                switch (_0x38eb94[_0x26c975++]) {
                  case "0":
                    return (_0x42069a = _0x3f43c8.call.apply(_0x3f43c8, [ this ].concat(_0x1d9e8b))).state = {
                        isShuntVisible: !1,
                        isLogoutVisible: !1,
                        isBulletinVisible: !1,
                        isDarkModeVisible: !1,
                        isAdShow: !1,
                        currentShunt: 1,
                        currentDarkMode: "0",
                        exchange_link: [],
                        bulletin: (0, L.lang)("加載中...")
                    }, _0x42069a.getAdData = function(_0x3f63e7) {
                        "exchange_link" !== _0x3f63e7.group && h.AsyncStorage.getItem(_0x3f63e7.group).then(function(_0x38c6ae) {
                            if(!_0x42069a._isMounted)return;
                            var _0x19ce7e;
                            try{_0x19ce7e=JSON.parse(_0x38c6ae)||{};}catch(error){_0x19ce7e={};}
                            if (_0x19ce7e.ad_version && _0x19ce7e.ad_version === g.ad_cache_version) _0x42069a.setState((0, 
                            o.default)({}, _0x3f63e7.group, _0x19ce7e.ad_data)); else {
                                var _0x7f0d66 = _0x3f63e7.type, _0x1f2dd7 = _0x3f63e7.group;
                                P.default.fetchSkipEc(R.API_ADVERTISE, {
                                    type: _0x7f0d66,
                                    group: _0x1f2dd7,
                                    v: g.ad_cache_version,
                                    lang: (0, D.getLanguage)(),
                                    ipcountry: (0, D.getIpCountry)()
                                }, function(_0x5371f2) {
                                    if(!_0x42069a._isMounted)return;
                                    var _0x5ae0e7, _0x80e732;
                                    if (_0x5371f2.data && ((null == (_0x5ae0e7 = _0x5371f2.data) || null == (_0x80e732 = _0x5ae0e7.adv) ? void 0 : _0x80e732.length) > 0 || _0x5371f2.data.content)) {
                                        var _0x10ae82, _0x199992;
                                        if ((null == (_0x10ae82 = _0x5371f2.data) || null == (_0x199992 = _0x10ae82.adv) ? void 0 : _0x199992.length) > 0) {
                                            _0x42069a.setState((0, o.default)({}, _0x1f2dd7, _0x5371f2.data.adv));
                                            var _0x1fd73b = {
                                                ad_version: g.ad_cache_version,
                                                ad_data: _0x5371f2.data.adv,
                                                group: _0x1f2dd7
                                            };
                                            _0x42069a.setAdData(_0x1fd73b);
                                        }
                                        if (_0x5371f2.data.content) {
                                            _0x42069a.setState((0, o.default)({}, _0x1f2dd7, _0x5371f2.data.content));
                                            var _0x96ef69 = {
                                                ad_version: g.ad_cache_version,
                                                ad_data: _0x5371f2.data.content,
                                                group: _0x1f2dd7
                                            };
                                            _0x42069a.setAdData(_0x96ef69);
                                        }
                                    }
                                });
                            }
                        });
                    }, _0x42069a.setAdData = function(_0x1b549b) {
                        "" !== _0x1b549b && h.AsyncStorage.setItem(_0x1b549b.group, JSON.stringify(_0x1b549b));
                    }, _0x42069a.toggleModal = function(_0x59fadf) {
                        "isBulletinVisible" !== _0x59fadf || _0x42069a.state.isBulletinVisible || _0x42069a.getAdData({
                            type: "text",
                            group: "bulletin",
                            v: g.ad_cache_version
                        }), _0x42069a.setState(function(_0x4b64ea) {
                            return (0, o.default)({}, _0x59fadf, !_0x4b64ea[_0x59fadf]);
                        });
                    }, _0x42069a.getShunt = function() {
                        h.AsyncStorage.getItem("shunt").then(function(_0x31463e) {
                            _0x42069a._isMounted && _0x42069a.setState({
                                currentShunt: parseInt(null != _0x31463e ? _0x31463e : 1)
                            });
                        });
                    }, _0x42069a.confirmShunt = function(_0x10c52a) {
                        h.AsyncStorage.setItem("shunt", String(_0x10c52a)).then(function() {
                            var _0x523763 = _0x42069a.props.setting;
                            _0x42069a._isMounted && _0x42069a.setState({
                                currentShunt: parseInt(_0x10c52a)
                            }), _0x523763(R.API_APP_SETTING, {
                                app_img_shunt: _0x10c52a
                            }, !0);
                        });
                    }, _0x42069a.getDarkMode = function() {
                        h.AsyncStorage.getItem("dark_mode").then(function(_0xfeacb1) {
                            _0x42069a._isMounted && _0x42069a.setState({
                                currentDarkMode: null != _0xfeacb1 ? _0xfeacb1 : "0"
                            });
                        });
                    }, _0x42069a.confirmDarkMode = function(_0x3e04a0) {
                        g.darkMode = _0x3e04a0, _0x42069a.forceUpdate(), _0x42069a.props.onRefresh(), E.navigate("Splash"), 
                        h.AsyncStorage.setItem("dark_mode", String(_0x3e04a0)).then(function() {
                            _0x42069a._isMounted && _0x42069a.setState({
                                currentDarkMode: _0x3e04a0
                            }), (0, _0x42069a.props.setDark)(R.API_APP_SETTING, {
                                darkMode: _0x3e04a0
                            }, _0x3e04a0);
                        });
                    }, _0x42069a.confirmLogout = function() {
                        var _0x1c2524 = _0x42069a.props, _0x1e6ec1 = _0x1c2524.logout, _0x5ed50b = _0x1c2524.setMemberInfo;
                        _0x1e6ec1(R.API_MEMBER_LOOUT, {}, !0), _0x42069a.removeAccount(_0x42069a.props.onRefresh()), 
                        _0x5ed50b({});
                    }, _0x42069a.removeAccount = function() {
                        return n.default.async(function(_0xaf96a6) {
                            for (;;) switch (_0xaf96a6.prev = _0xaf96a6.next) {
                              case 0:
                                return _0xaf96a6.next = 2, n.default.awrap(h.AsyncStorage.removeItem("loginInfo"));

                              case 2:
                              case "end":
                                return _0xaf96a6.stop();
                            }
                        }, null, null, null, Promise);
                    }, _0x42069a.closePopBanner = function() {
                        _0x42069a.setState({
                            isAdShow: !1
                        });
                    }, _0x42069a;

                  case "1":
                    (0, l.default)(this, _0x1e78ef);
                    continue;

                  case "2":
                    for (var _0x1a131f = arguments.length, _0x1d9e8b = new Array(_0x1a131f), _0x570125 = 0; _0x570125 < _0x1a131f; _0x570125++) _0x1d9e8b[_0x570125] = arguments[_0x570125];
                    continue;

                  case "3":
                    var _0x42069a;
                    continue;

                  case "4":
                    continue;
                }
                break;
            }
        }
        return (0, s.default)(_0x1e78ef, [ {
            key: "componentDidMount",
            value: function() {
                this._isMounted = !0, this.getShunt(), this.getAdData({
                    type: "link",
                    group: "exchange_link",
                    v: g.ad_cache_version
                });
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                this._isMounted = !1;
            }
        }, {
            key: "componentDidUpdate",
            value: function(_0x15137e) {
                var _0x9c9613 = this.props, _0x30f089 = _0x9c9613.Logout, _0x1f85bf = _0x9c9613.setMemberInfo;
                !0 === _0x15137e.Logout.isLoading && _0x30f089.isLoading && _0x1f85bf({});
            }
        }, {
            key: "render",
            value: function() {
                var _0x1a5687 = this, _0x586c36 = this.state, _0x5568ea = _0x586c36.isShuntVisible, _0x41f110 = _0x586c36.isLogoutVisible, _0x5cde91 = _0x586c36.isBulletinVisible, _0x1329e2 = (_0x586c36.isAdShow, 
                _0x586c36.isDarkModeVisible), _0x582cbd = Array.isArray(_0x586c36.exchange_link)?_0x586c36.exchange_link.filter(item=>item && typeof item.link==="string"):[], _0x25532a = _0x586c36.bulletin, _0x5e115e = this.props, _0x116a69 = _0x5e115e.Member, _0x25c28e = _0x5e115e.Setting, _0x137a14 = Array.isArray(_0x25c28e.info.app_shunts) ? _0x25c28e.info.app_shunts.filter(item=>item && item.key!=null && typeof item.title==="string") : [], _0x2d0bb0 = _0x116a69.isLogin, _0x434c91 = [ {
                    title: (0, L.lang)("查看進版文章"),
                    onPress: function() {
                        _0x1a5687.toggleModal("isBulletinVisible");
                    }
                }, {
                    title: (0, L.lang)("查看JM公告"),
                    onPress: function() {
                        return h.Linking.openURL("https://trello.com/b/McDZAm8C/");
                    }
                }, {
                    title: (0, L.lang)("查看網址發布頁"),
                    onPress: function() {
                        return h.Linking.openURL("https://jm365.work/AwNzE2");
                    }
                } ], _0x3eafc7 = function(_0x1c7633) {
                    var _0x268a02 = _0x1c7633.title, _0x8545bc = _0x1c7633.onPress, _0x3fac91 = _0x1c7633.content, _0x490cb5 = _0x1c7633.icon;
                    return p.default.createElement(h.View, {
                        style: [ B.infoRow, "1" === g.darkMode ? {
                            backgroundColor: M.colors.backgroundDark
                        } : {} ]
                    }, p.default.createElement(h.Text, {
                        style: [ B.infoRowLeft, "1" === g.darkMode ? {
                            color: M.colors.textPrimaryDark
                        } : {} ]
                    }, _0x268a02), p.default.createElement(h.TouchableHighlight, {
                        style: B.infoRowRightButton,
                        onPress: _0x8545bc
                    }, p.default.createElement(h.View, {
                        style: {
                            flexDirection: "row",
                            alignItems: "center"
                        }
                    }, p.default.createElement(h.Text, {
                        style: _0x490cb5 ? B.infoRowRightButtonText : B.settingRowRightText
                    }, _0x3fac91), _0x490cb5 && p.default.createElement(y.default, {
                        style: {
                            marginHorizontal: 5
                        },
                        color: "1" === g.darkMode ? "white" : "black",
                        name: "chevron-right",
                        size: 12
                    }))));
                };
                return p.default.createElement(h.View, {
                    style: [ B.infoPanel, "1" === g.darkMode ? {
                        backgroundColor: M.colors.primaryDark
                    } : {} ]
                }, p.default.createElement(b.default, {
                    title: "" + (0, L.lang)("切換圖源，加速你的體驗"),
                    currentValue: this.state.currentShunt,
                    cancelText: (0, L.lang)("我覺得現在很快了"),
                    ignoreConfirm: !0,
                    isModalVisible: _0x5568ea,
                    options: _0x137a14,
                    toggleModal: function() {
                        _0x1a5687.toggleModal("isShuntVisible");
                    },
                    confirmCallback: this.confirmShunt
                }), p.default.createElement(b.default, {
                    title: "" + (0, L.lang)("夜間模式"),
                    currentValue: "" + g.darkMode,
                    isModalVisible: _0x1329e2,
                    options: [ {
                        key: "0",
                        title: (0, L.lang)("關閉")
                    }, {
                        key: "1",
                        title: (0, L.lang)("開啟")
                    } ],
                    toggleModal: function() {
                        return _0x1a5687.toggleModal("isDarkModeVisible");
                    },
                    confirmCallback: this.confirmDarkMode
                }), p.default.createElement(b.default, {
                    cancelText: "" + (0, L.lang)("沒事"),
                    isModalVisible: _0x41f110,
                    content: "" + (0, L.lang)("確認要登出帳號嗎?"),
                    toggleModal: function() {
                        _0x1a5687.toggleModal("isLogoutVisible");
                    },
                    confirmCallback: this.confirmLogout
                }), p.default.createElement(b.default, {
                    titleStyle: {
                        color: "black"
                    },
                    rightCloseColor: "black",
                    containerStyle: {
                        backgroundColor: "white"
                    },
                    isModalVisible: _0x5cde91,
                    title: (0, L.lang)("公告"),
                    type: "html",
                    content: {
                        html: _0x25532a
                    },
                    toggleModal: function() {
                        _0x1a5687.toggleModal("isBulletinVisible");
                    }
                }), p.default.createElement(k.default, {
                    isVisible: !1,
                    swipeDirection: [ "up", "left", "right", "down" ],
                    useNativeDriver: !0
                }, p.default.createElement(h.View, {
                    style: {
                        padding: 10,
                        justifyContent: "center",
                        alignItems: "center"
                    }
                }, p.default.createElement(V.default, {
                    width: 300,
                    height: 250,
                    group: "setting-ad",
                    closeCallBack: this.closePopBanner,
                    isCanClose: !0
                }))), p.default.createElement(h.View, {
                    style: B.settingRow
                }, _0x434c91.map(function(_0xd857cc, _0x1f6a32) {
                    return p.default.createElement(_0x3eafc7, {
                        key: _0x1f6a32,
                        title: 0 === _0x1f6a32 && (0, L.lang)("最新消息"),
                        onPress: _0xd857cc.onPress,
                        content: (0, L.lang)("" + _0xd857cc.title)
                    });
                })), _0x582cbd.length > 0 && p.default.createElement(h.View, {
                    style: B.settingRow
                }, _0x582cbd.map(function(_0x2b7d40, _0x179cf1) {
                    return p.default.createElement(_0x3eafc7, {
                        key: _0x179cf1,
                        title: 0 === _0x179cf1 && (0, L.lang)("友站連結"),
                        onPress: function() {
                            return h.Linking.openURL(_0x2b7d40.link);
                        },
                        content: (0, L.lang)("" + _0x2b7d40.title)
                    });
                })), p.default.createElement(h.View, {
                    style: B.settingRow
                }, p.default.createElement(h.View, {
                    style: B.infoRow
                }, p.default.createElement(h.Text, {
                    style: B.infoRowLeft
                }, "界面语言"), p.default.createElement(h.Text, {
                    style: B.settingRowRightText
                }, "简体中文")), p.default.createElement(h.View, {
                    style: B.infoRow
                }, p.default.createElement(h.Text, {
                    style: B.infoRowLeft
                }, "应用版本"), p.default.createElement(h.Text, {
                    style: B.settingRowRightText
                }, "JM洁净版 1.0")), p.default.createElement(_0x3eafc7, {
                    title: "备份与恢复",content:"导入 / 导出",onPress:r(d[24]).show,icon:true
                }), p.default.createElement(_0x3eafc7, {
                    title: (0, L.lang)("切換圖源"),
                    onPress: function() {
                        _0x1a5687.toggleModal("isShuntVisible");
                    },
                    content: (0, L.lang)("切換圖源"),
                    icon: !0
                }), p.default.createElement(_0x3eafc7, {
                    title: (0, L.lang)("夜間模式"),
                    onPress: function() {
                        _0x1a5687.toggleModal("isDarkModeVisible");
                    },
                    content: "0" === g.darkMode ? (0, L.lang)("關閉") : (0, L.lang)("開啟"),
                    icon: !0
                })), p.default.createElement(h.View, {
                    style: B.settingRow
                }, p.default.createElement(_0x3eafc7, {
                    title: (0, L.lang)("贊助禁漫"),
                    onPress: function() {
                        return h.Linking.openURL("https://jm365.work/dFTN82");
                    },
                    content: (0, L.lang)("打賞禁漫")
                }), null), p.default.createElement(h.View, {
                    style: B.settingRow
                }, p.default.createElement(_0x3eafc7, {
                    title: (0, L.lang)("聯絡禁漫"),
                    onPress: function() {
                        return h.Linking.openURL("mailto:www18comic@gmail.com");
                    },
                    content: (0, L.lang)("廣告洽詢")
                })), _0x2d0bb0 && p.default.createElement(h.View, {
                    style: [ B.logoutRow, "1" === g.darkMode ? {
                        backgroundColor: M.colors.backgroundDark
                    } : {} ]
                }, p.default.createElement(h.TouchableHighlight, {
                    style: B.logoutItem,
                    onPress: function() {
                        _0x1a5687.toggleModal("isLogoutVisible");
                    }
                }, p.default.createElement(h.Text, {
                    style: B.logoutText
                }, (0, L.lang)("會員登出")))));
            }
        } ]), _0x1e78ef;
    }(p.Component), T = (0, _.connect)(function(_0x2ee0fe) {
        return {
            Logout: _0x2ee0fe.Logout,
            Member: _0x2ee0fe.Member,
            Setting: _0x2ee0fe.Setting
        };
    }, {
        logout: v.logout,
        setMemberInfo: S.setMemberInfo,
        setting: w.setting,
        setDark: w.setDark
    })(x);
    e.default = T;
    var B = h.StyleSheet.create({
        infoPanel: {
            backgroundColor: "#ececec",
            flex: 1,
            paddingTop: 15,
            paddingBottom: 40
        },
        infoRow: {
            flexDirection: "row",
            marginBottom: 1,
            backgroundColor: "white",
            paddingLeft: 5,
            paddingRight: 5,
            justifyContent: "space-between"
        },
        infoRowLeft: {
            padding: 10,
            fontSize: 14
        },
        infoRowRight: {
            padding: 10,
            fontSize: 14
        },
        infoRowRightButton: {
            marginLeft: 10
        },
        infoRowRightButtonText: {
            fontSize: 14,
            padding: 10,
            color: M.colors.secondary
        },
        settingRowRightText: {
            fontSize: 14,
            padding: 10,
            color: "#7F7F7F"
        },
        settingRow: {
            marginBottom: 15
        },
        logoutRow: {
            backgroundColor: "white",
            justifyContent: "center",
            flexDirection: "row"
        },
        logoutItem: {
            justifyContent: "center",
            alignItems: "stretch",
            alignSelf: "stretch",
            flex: 1
        },
        logoutText: {
            color: M.colors.secondary,
            textAlign: "center",
            padding: 15
        }
    });
}, 2039, [ 1, 440, 481, 155, 156, 157, 159, 162, 55, 2, 810, 827, 729, 826, 2040, 647, 731, 410, 650, 1629, 651, 825, 648, 655, 2177 ]);
