__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0;
    var n = t(r(d[1])), o = t(r(d[2])), l = t(r(d[3])), s = t(r(d[4])), u = t(r(d[5])), f = A(r(d[6])), c = r(d[7]), h = t(r(d[8])), p = r(d[9]), b = r(d[10]), y = r(d[11]), v = r(d[12]), S = r(d[13]), w = t(r(d[14])), C = t(r(d[15])), x = t(r(d[16])), E = t(r(d[17])), R = t(r(d[18])), T = t(r(d[19])), k = t(r(d[20])), _ = t(r(d[21])), B = t(r(d[22])), M = t(r(d[23])), D = t(r(d[24])), V = t(r(d[25])), I = (t(r(d[26])), 
    t(r(d[27]))), O = A(r(d[28])), P = t(r(d[29])), W = r(d[30]), z = t(r(d[31]));
    function ignoreScroll() {}
    function j(_0x1bffc8) {
        if ("function" != typeof WeakMap) return null;
        var _0x328e78 = new WeakMap, _0x1ede9e = new WeakMap;
        return (j = function(_0x16aae3) {
            return _0x16aae3 ? _0x1ede9e : _0x328e78;
        })(_0x1bffc8);
    }
    function A(_0x333c21, _0x9e436b) {
        for (var _0x58fb64 = "1|5|0|4|2|3|6".split("|"), _0xafba3b = 0; ;) {
            switch (_0x58fb64[_0xafba3b++]) {
              case "0":
                var _0x44576d = j(_0x9e436b);
                continue;

              case "1":
                if (!_0x9e436b && _0x333c21 && _0x333c21.__esModule) return _0x333c21;
                continue;

              case "2":
                var _0x3ba447 = {}, _0x34e8b8 = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;

              case "3":
                for (var _0x1d53d5 in _0x333c21) if ("default" !== _0x1d53d5 && Object.prototype.hasOwnProperty.call(_0x333c21, _0x1d53d5)) {
                    var _0x4054d7 = _0x34e8b8 ? Object.getOwnPropertyDescriptor(_0x333c21, _0x1d53d5) : null;
                    _0x4054d7 && (_0x4054d7.get || _0x4054d7.set) ? Object.defineProperty(_0x3ba447, _0x1d53d5, _0x4054d7) : _0x3ba447[_0x1d53d5] = _0x333c21[_0x1d53d5];
                }
                continue;

              case "4":
                if (_0x44576d && _0x44576d.has(_0x333c21)) return _0x44576d.get(_0x333c21);
                continue;

              case "5":
                if (null === _0x333c21 || "object" != typeof _0x333c21 && "function" != typeof _0x333c21) return {
                    default: _0x333c21
                };
                continue;

              case "6":
                return _0x3ba447.default = _0x333c21, _0x44576d && _0x44576d.set(_0x333c21, _0x3ba447), 
                _0x3ba447;
            }
            break;
        }
    }
    var N = function(_0x38dcc7) {
        (0, l.default)(_0x4a8f87, _0x38dcc7);
        var _0x25b709, _0x23f246, _0x103ce9 = (_0x25b709 = _0x4a8f87, _0x23f246 = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0x3815d2) {
                return !1;
            }
        }(), function() {
            var _0x1effc6, _0x20354b = (0, u.default)(_0x25b709);
            if (_0x23f246) {
                var _0x67ad1f = (0, u.default)(this).constructor;
                _0x1effc6 = Reflect.construct(_0x20354b, arguments, _0x67ad1f);
            } else _0x1effc6 = _0x20354b.apply(this, arguments);
            return (0, s.default)(this, _0x1effc6);
        });
        function _0x4a8f87(_0x51ef54) {
            var _0x35ddfd;
            return (0, n.default)(this, _0x4a8f87), (_0x35ddfd = _0x103ce9.call(this, _0x51ef54)).toggleStatusBar = function() {
                _0x35ddfd.setState({
                    showStatusBar: !_0x35ddfd.state.showStatusBar
                }, function() {
                    setTimeout(function() {
                        _0x35ddfd.setState({
                            showStatusBar: !_0x35ddfd.state.showStatusBar
                        });
                    }, 50);
                });
            }, _0x35ddfd._setIsDragging = function(_0x37e808) {
                _0x35ddfd.setState({
                    isDragging: _0x37e808
                });
            }, _0x35ddfd.openSignList = function() {
                _0x35ddfd.setState({
                    signListVisible: !0
                });
            }, _0x35ddfd.toggleModal = function() {
                _0x35ddfd.setState({
                    signListVisible: !_0x35ddfd.state.signListVisible
                });
            }, _0x35ddfd.initData = function() {
                var _0x4cab93 = _0x35ddfd.props.login;
                c.AsyncStorage.getItem("loginInfo").then(function(_0x564078) {
                    if (_0x564078) {
                        var _0xafdebf = JSON.parse(_0x564078);
                        _0x4cab93(O.API_MEMBER_LOGIN, _0xafdebf, !0);
                    }
                });
            }, _0x35ddfd.onRefresh = function() {
                _0x35ddfd.setState({
                    isRefreshing: !0
                }, function() {
                    _0x35ddfd.initData(), setTimeout(function() {
                        return _0x35ddfd.setState({
                            isRefreshing: !1
                        });
                    }, 500);
                });
            }, _0x35ddfd.logoutRefresh = function() {
                _0x35ddfd.setState({
                    logoutRefreshing: !0
                }, function() {
                    setTimeout(function() {
                        _0x35ddfd.setState({
                            logoutRefreshing: !1
                        });
                    }, 500);
                });
            }, _0x35ddfd.renderContent = function(_0x85ea60) {
                var _0x123125 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, _0x3d2e96 = "1" === g.darkMode ? {
                    backgroundColor: S.colors.backgroundDark
                } : {
                    backgroundColor: "#ececec"
                };
                return f.default.createElement(c.View, {
                    style: [ _0x3d2e96, {
                        flex: 1
                    } ]
                }, f.default.createElement(_0x85ea60, _0x123125));
            }, _0x35ddfd.state = {
                showStatusBar: !0,
                isRefreshing: !1,
                favOnEnd: !1,
                isDragging: !1,
                signListVisible: !1,
                logoutRefreshing: !1
            }, _0x35ddfd.parallax = f.default.createRef(), _0x35ddfd;
        }
        return (0, o.default)(_0x4a8f87, [ {
            key: "componentDidMount",
            value: function() {
                for (var _0x327488 = "5|3|1|2|4".split("|"), _0x511b9c = 0; ;) {
                    switch (_0x327488[_0x511b9c++]) {
                      case "1":
                        this._unsubscribe = _0x1b520a.addListener("focus", this.toggleStatusBar), this.props.Member.isLogin || this.initData();
                        continue;

                      case "2":
                        var _0x950cd7 = this.props.Notifications, _0x11e639 = (null == _0x950cd7 || null == (_0x388568 = _0x950cd7.notifications) ? void 0 : _0x388568.comic_follow) + (null == _0x950cd7 || null == (_0xd3da0b = _0x950cd7.notifications) ? void 0 : _0xd3da0b.site_notice) || 0;
                        continue;

                      case "3":
                        var _0x1b520a = this.props.navigation;
                        continue;

                      case "4":
                        setTimeout(function() {
                            _0x11e639 > 0 && _0x2177e1.stickyParallax.goToPage(2);
                        }, 1e3);
                        continue;

                      case "5":
                        var _0x388568, _0xd3da0b, _0x2177e1 = this;
                        continue;
                    }
                    break;
                }
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                this._unsubscribe();
            }
        }, {
            key: "componentDidUpdate",
            value: function(_0x4edfb7) {
                var _0x5c3dec;
                null == (_0x5c3dec = this.parallax) || _0x5c3dec.setNativeProps({
                    scrollEnabled: !this.state.isDragging
                });
            }
        }, {
            key: "render",
            value: function() {
                var _0x59447a, _0x301e4c, _0x3a271f = this, _0x114d65 = this.state, _0x157f45 = _0x114d65.showStatusBar, _0x4316c6 = _0x114d65.isDragging, _0x3a7e8d = _0x114d65.signListVisible, _0x406b08 = _0x114d65.isRefreshing, _0x3b0dde = _0x114d65.logoutRefreshing, _0xff0070 = this.props, _0x4e2045 = _0xff0070.Member, _0x1a861f = _0xff0070.Setting, _0x1c6dde = _0xff0070.Logout, _0x3a7c8a = _0xff0070.Notifications, _0x57cea8 = (null == _0x3a7c8a || null == (_0x59447a = _0x3a7c8a.notifications) ? void 0 : _0x59447a.comic_follow) + (null == _0x3a7c8a || null == (_0x301e4c = _0x3a7c8a.notifications) ? void 0 : _0x301e4c.site_notice) || 0;
                return f.default.createElement(c.View, {
                    style: {
                        flex: 1
                    }
                }, f.default.createElement(c.View, {
                    style: {
                        flex: 1,
                        backgroundColor: S.colors.primary
                    }
                }, _0x157f45 && f.default.createElement(c.StatusBar, {
                    backgroundColor: "#323232",
                    translucent: !0,
                    barStyle: "light-content",
                    hidden: !1
                }), _0x3b0dde ? f.default.createElement(P.default, null) : f.default.createElement(h.default, {
                    snapToEdge: !1,
                    onRef: function(_0x3792a0) {
                        _0x3a271f.stickyParallax = _0x3792a0;
                    },
                    scrollRef: function(_0x371435) {
                        _0x3a271f.parallax = _0x371435;
                    },
                    foreground: f.default.createElement(C.default, {
                        Member: _0x4e2045,
                        Setting: _0x1a861f,
                        Logout: _0x1c6dde,
                        isRefreshing: _0x406b08,
                        refreshData: this.onRefresh
                    }),
                    header: f.default.createElement(c.View, null),
                    parallaxHeight: 300,
                    headerHeight: 0,
                    headerSize: function() {},
                    disableScroll: _0x4316c6,
                    bounces: !1,
                    scrollEvent: ignoreScroll,
                    refreshControl: "android" === c.Platform.OS ? f.default.createElement(c.RefreshControl, {
                        refreshing: _0x406b08,
                        onRefresh: this.onRefresh,
                        progressViewOffset: 10
                    }) : null,
                    tabs: [ {
                        title: (0, W.lang)("我的收藏"),
                        content: this.renderContent(x.default, {
                            favOnEnd: this.state.favOnEnd
                        })
                    }, {
                        title: (0, W.lang)("觀看紀錄"),
                        content: this.renderContent(B.default, {
                            navigation: this.props.navigation
                        })
                    }, {
                        title: "本地下载",
                        content: this.renderContent(r(d[32]).Books,{navigation:this.props.navigation})
                    }, {
                        content: this.renderContent(R.default),
                        icon: f.default.createElement(c.View, {
                            style: {
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 12,
                                paddingVertical: 4
                            }
                        }, f.default.createElement(c.Text, {
                            style: {
                                fontSize: 14,
                                lineHeight: 18,
                                color: "white"
                            }
                        }, (0, W.lang)("信箱")), _0x57cea8 > 0 && _0x4e2045.isLogin && f.default.createElement(c.View, {
                            style: U.unreadBadge
                        }, f.default.createElement(c.Text, {
                            style: U.unreadText
                        }, _0x57cea8 > 99 ? "99+" : _0x57cea8)))
                    }, {
                        title: (0, W.lang)("追蹤連載"),
                        content: this.renderContent(T.default)
                    }, {
                        title: (0, W.lang)("成就任務"),
                        content: this.renderContent(k.default, {
                            _setIsDragging: this._setIsDragging
                        })
                    }, {
                        title: (0, W.lang)("簽到活動"),
                        content: this.renderContent(_.default, {
                            openSignList: this.openSignList
                        })
                    }, {
                        title: (0, W.lang)("標籤收藏"),
                        content: this.renderContent(E.default)
                    }, {
                        title: (0, W.lang)("留言紀錄"),
                        content: this.renderContent(M.default)
                    }, {
                        title: (0, W.lang)("個人資料"),
                        content: this.renderContent(D.default, {
                            Member: _0x4e2045,
                            Setting: _0x1a861f
                        })
                    }, {
                        title: (0, W.lang)("設定"),
                        content: this.renderContent(V.default, {
                            onRefresh: this.logoutRefresh,
                            Setting: _0x1a861f
                        })
                    } ],
                    contentContainerStyles: "1" === g.darkMode ? {
                        backgroundColor: S.colors.primaryDark
                    } : {},
                    tabTextStyle: U.tabText,
                    tabTextContainerStyle: U.tabTextContainerStyle,
                    tabTextContainerActiveStyle: U.tabTextContainerActiveStyle,
                    tabsContainerBackgroundColor: "#323232",
                    tabsWrapperStyle: U.tabsWrapper
                }), f.default.createElement(z.default, {
                    isVisible: _0x3a7e8d,
                    toggleModal: this.toggleModal
                }), null));
            }
        } ]), _0x4a8f87;
    }(f.Component), F = (0, p.connect)(function(_0x39be99) {
        return {
            Member: _0x39be99.Member,
            Setting: _0x39be99.Setting,
            Favorite: _0x39be99.Favorite,
            Notifications: _0x39be99.Notifications
        };
    }, function(_0x3ea898) {
        return {
            login: function(_0x5c8062, _0x33fd03, _0x55bfb4) {
                return _0x3ea898((0, b.login)(_0x5c8062, _0x33fd03, _0x55bfb4));
            },
            favorite: function(_0x53df69, _0x38b5c0) {
                return _0x3ea898((0, y.favorite)(_0x53df69, _0x38b5c0));
            },
            setMemberInfo: function(_0x25d680) {
                return _0x3ea898((0, b.setMemberInfo)(_0x25d680));
            }
        };
    })(N);
    e.default = F;
    var U = c.StyleSheet.create({
        tabText: {
            fontSize: 14,
            lineHeight: 18,
            paddingHorizontal: 12,
            paddingVertical: 8,
            color: "white"
        },
        tabTextContainerStyle: {
            backgroundColor: "transparent",
            borderTopLeftRadius: 7,
            borderTopRightRadius: 7
        },
        tabTextContainerActiveStyle: {
            backgroundColor: "#232323",
            borderBottomWidth: 3,
            borderBottomColor: S.colors.secondary,
            borderStyle: "solid"
        },
        tabsWrapper: {
            paddingVertical: 10
        },
        unreadBadge: {
            backgroundColor: "red",
            width: 25,
            height: 25,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 5
        },
        unreadText: {
            color: "white",
            fontSize: 12,
            fontWeight: "bold"
        }
    });
}, 1871, [ 1, 155, 156, 157, 159, 162, 55, 2, 1872, 410, 731, 1425, 1918, 729, 718, 1919, 2017, 2021, 2022, 2024, 2025, 2033, 2162, 2037, 2038, 2039, 1629, 730, 650, 805, 651, 1635, 2185 ]);
