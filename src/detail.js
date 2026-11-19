__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0;
    var o = t(r(d[1])), l = t(r(d[2])), n = t(r(d[3])), s = t(r(d[4])), c = t(r(d[5])), u = L(r(d[6])), f = r(d[7]), h = r(d[8]), y = t(r(d[9])), w = t(r(d[10])), p = L(r(d[11])), k = r(d[12]), E = L(r(d[13])), T = t(r(d[14])), v = r(d[15]), b = t(r(d[16])), x = r(d[17]), M = t(r(d[18])), R = t(r(d[19])), _ = r(d[20]), D = (t(r(d[21])), 
    t(r(d[22]))), V = r(d[23]), I = (r(d[24]), t(r(d[25])));
    function C(_0x2f0349) {
        if ("function" != typeof WeakMap) return null;
        var _0x213a5c = new WeakMap, _0x5e356e = new WeakMap;
        return (C = function(_0x3ad6aa) {
            return _0x3ad6aa ? _0x5e356e : _0x213a5c;
        })(_0x2f0349);
    }
    function L(_0x2665eb, _0x5cc375) {
        for (var _0x39b134 = "4|3|2|1|0|5|6".split("|"), _0x5b2011 = 0; ;) {
            switch (_0x39b134[_0x5b2011++]) {
              case "0":
                var _0x3e7eb3 = {}, _0x4797c4 = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;

              case "1":
                if (_0x1c4aff && _0x1c4aff.has(_0x2665eb)) return _0x1c4aff.get(_0x2665eb);
                continue;

              case "2":
                var _0x1c4aff = C(_0x5cc375);
                continue;

              case "3":
                if (null === _0x2665eb || "object" != typeof _0x2665eb && "function" != typeof _0x2665eb) return {
                    default: _0x2665eb
                };
                continue;

              case "4":
                if (!_0x5cc375 && _0x2665eb && _0x2665eb.__esModule) return _0x2665eb;
                continue;

              case "5":
                for (var _0x18695d in _0x2665eb) if ("default" !== _0x18695d && Object.prototype.hasOwnProperty.call(_0x2665eb, _0x18695d)) {
                    var _0x2e4c41 = _0x4797c4 ? Object.getOwnPropertyDescriptor(_0x2665eb, _0x18695d) : null;
                    _0x2e4c41 && (_0x2e4c41.get || _0x2e4c41.set) ? Object.defineProperty(_0x3e7eb3, _0x18695d, _0x2e4c41) : _0x3e7eb3[_0x18695d] = _0x2665eb[_0x18695d];
                }
                continue;

              case "6":
                return _0x3e7eb3.default = _0x2665eb, _0x1c4aff && _0x1c4aff.set(_0x2665eb, _0x3e7eb3), 
                _0x3e7eb3;
            }
            break;
        }
    }
    function A(_0x338126) {
        var _0x1ef871 = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0x2dae58) {
                return !1;
            }
        }();
        return function() {
            var _0x173ce5, _0x5f48f6 = (0, c.default)(_0x338126);
            if (_0x1ef871) {
                var _0x276baf = (0, c.default)(this).constructor;
                _0x173ce5 = Reflect.construct(_0x5f48f6, arguments, _0x276baf);
            } else _0x173ce5 = _0x5f48f6.apply(this, arguments);
            return (0, s.default)(this, _0x173ce5);
        };
    }
    var z = function(_0x3a1fd4) {
        (0, n.default)(_0x4331dd, _0x3a1fd4);
        var _0x1488a1 = A(_0x4331dd);
        function _0x4331dd() {
            for (var _0x275b7c = "3|4|0|1|2".split("|"), _0x20acab = 0; ;) {
                switch (_0x275b7c[_0x20acab++]) {
                  case "0":
                    (0, o.default)(this, _0x4331dd);
                    continue;

                  case "1":
                    for (var _0x1be68c = arguments.length, _0x19a712 = new Array(_0x1be68c), _0x55449f = 0; _0x55449f < _0x1be68c; _0x55449f++) _0x19a712[_0x55449f] = arguments[_0x55449f];
                    continue;

                  case "2":
                    return (_0x42d2a4 = _0x1488a1.call.apply(_0x1488a1, [ this ].concat(_0x19a712))).state = {
                        isModalVisible: !1,
                        currentModal: 0,
                        bannerData: [],
                        isLiked: _0x42d2a4.props.data.liked,
                        tracking_state: !1,
                        isTrackLoading: !1,
                        isSeries: Number((_0x42d2a4.props.data || {}).series_id || 0) > 0 || (null == (_0x4c65f7 = _0x42d2a4.props.data) || null == (_0x463f59 = _0x4c65f7.series) ? void 0 : _0x463f59.length) > 0,
                        loginModalVisible: !1
                    }, _0x42d2a4.getTrackingState = function() {
                        var _0x2583a6 = _0x42d2a4.props.data;
                        D.default.fetchGet(E.API_ALBUM_SET_TRACKING, {
                            id: _0x2583a6.id
                        }, function(_0x574887) {
                            void 0 !== (null == _0x574887 ? void 0 : _0x574887.data) && _0x42d2a4.setState({
                                tracking_state: _0x574887.data
                            });
                        });
                    }, _0x42d2a4.handleTracking = function() {
                        if (_0x42d2a4.props.Member.isLogin) {
                            _0x42d2a4.setState({
                                isTrackLoading: !0
                            });
                            var _0x26941a = _0x42d2a4.props.data, _0x33833b = !_0x42d2a4.state.tracking_state;
                            D.default.fetchPost(E.API_ALBUM_SET_TRACKING, {
                                id: _0x26941a.id
                            }, function(_0x318db1) {
                                if (void 0 !== (null == _0x318db1 ? void 0 : _0x318db1.data)) {
                                    _0x42d2a4.setState({
                                        tracking_state: _0x33833b,
                                        isTrackLoading: !1
                                    });
                                    var _0x56c4ac = null == _0x318db1 ? void 0 : _0x318db1.data;
                                    g.toastTop.show(_0x56c4ac, {
                                        duration: 3e3,
                                        style: {
                                            padding: 0,
                                            zIndex: 9999
                                        },
                                        textStyle: {
                                            fontSize: 16
                                        },
                                        type: _0x33833b ? "success" : "danger"
                                    });
                                }
                            });
                        } else _0x42d2a4.toggleModal();
                    }, _0x42d2a4.toggleModal = function() {
                        _0x42d2a4.setState({
                            loginModalVisible: !_0x42d2a4.state.loginModalVisible
                        });
                    }, _0x42d2a4.fomatFloat = function(_0xa847ee, _0x5bcec0) {
                        if(_0xa847ee==null)return "—";
                        var _0x2e0867 = "";
                        return _0xa847ee < 1e3 ? _0xa847ee : (_0x2e0867 = "K", (_0xa847ee /= 1e3) > 100 && (_0xa847ee /= 100, 
                        _0x2e0867 = "M"), Math.round(_0xa847ee * Math.pow(10, _0x5bcec0)) / Math.pow(10, _0x5bcec0) + _0x2e0867);
                    }, _0x42d2a4.setModalState = function(_0x1afc3b) {
                        _0x42d2a4.setState({
                            isModalVisible: _0x1afc3b
                        });
                    }, _0x42d2a4.handleModal = function() {
                        _0x42d2a4.props.handleModal();
                    }, _0x42d2a4.handleDownload = function() {
                        var _0x56fc2d = _0x42d2a4.props.data;
                        if(_0x56fc2d.offline && _0x56fc2d.series.length===1){
                            const item=_0x56fc2d.series[0];p.navigate("DownloadPage",{id:item.id,offlineRow:item.localRow});return;
                        }
                        _0x56fc2d.is_aids && !_0x56fc2d.purchased ? _0x42d2a4.handleModal() : 0 === _0x56fc2d.series.length ? p.navigate("DownloadPage", {
                            id: _0x56fc2d.id
                        }) : _0x42d2a4.setState({
                            isModalVisible: !0,
                            currentModal: 0
                        });
                    }, _0x42d2a4;

                  case "3":
                    continue;

                  case "4":
                    var _0x4c65f7, _0x463f59, _0x42d2a4;
                    continue;
                }
                break;
            }
        }
        return (0, l.default)(_0x4331dd, [ {
            key: "componentDidMount",
            value: function() {
                var _0x49da87 = this.state.isSeries, _0x92550d = this.props.Member;
                _0x49da87 && _0x92550d.isLogin && this.props.data.hasSeries!==false && this.getTrackingState();
            }
        }, {
            key: "componentDidUpdate",
            value: function(_0x48f094) {
                var _0xc662a6 = this.props.Favorite;
                if (_0x48f094.Favorite.isLikeLoading && !_0xc662a6.isLikeLoading) {
                    var _0x3d3fa1 = 200 === _0xc662a6.likeResult.code ? _0xc662a6.likeResult.data.msg : _0xc662a6.likeResult.errorMsg, _0x41b638 = 200 !== _0xc662a6.likeResult.code ? "danger" : "success";
                    g.toastTop.show(_0x3d3fa1, {
                        duration: 3e3,
                        style: {
                            padding: 0,
                            zIndex: 9999
                        },
                        textStyle: {
                            fontSize: 16
                        },
                        type: _0x41b638
                    }), "success" === _0x41b638 && this.setState({
                        isLiked: !0
                    });
                }
                var _0x5c59f0 = this.props.Member;
                _0x48f094.Member.isLogin !== _0x5c59f0.isLogin && _0x5c59f0.isLogin && this.getTrackingState();
            }
        }, {
            key: "render",
            value: function() {
                var _0x41eaf8 = this, _0x37246e = this.props, _0x5170c3 = _0x37246e.data, _0x558000 = _0x37246e.like, _0x407d51 = this.state, _0x3eb445 = _0x407d51.isModalVisible, _0x659f54 = _0x407d51.currentModal, _0x20d135 = (_0x407d51.bannerData, 
                _0x407d51.tracking_state), _0x27c267 = _0x407d51.isTrackLoading, _0xfeb463 = _0x5170c3.offline && _0x5170c3.hasSeries!=null?_0x5170c3.hasSeries:_0x407d51.isSeries;
                return u.default.createElement(f.View, {
                    style: [ j.introContainer, "1" === g.darkMode ? {
                        backgroundColor: _.colors.primaryDark
                    } : {} ]
                }, u.default.createElement(f.View, {
                    style: j.introIconContainer
                }, u.default.createElement(f.TouchableOpacity, {
                    style: {
                        flex: 1
                    },
                    onPress: function() {
                        _0x558000(E.API_LIKE_DATA, {
                            id: _0x5170c3.id
                        }, !0);
                    }
                }, u.default.createElement(f.View, {
                    style: j.introIconRow
                }, u.default.createElement(w.default, {
                    name: "heart",
                    size: 17,
                    solid: this.state.isLiked,
                    color: "#7f7f7f"
                }), u.default.createElement(f.Text, {
                    style: [ j.introIconText, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, "" + this.fomatFloat(_0x5170c3.likes, 1)))), u.default.createElement(f.TouchableOpacity, {
                    style: {
                        flex: 1
                    },
                    onPress: function() {
                        return _0x41eaf8.props.goToPage();
                    }
                }, u.default.createElement(f.View, {
                    style: j.introIconRow
                }, u.default.createElement(w.default, {
                    name: "comment-dots",
                    size: 17,
                    solid: !0,
                    color: "#7f7f7f"
                }), u.default.createElement(f.Text, {
                    style: [ j.introIconText, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, "" + this.fomatFloat(_0x5170c3.comment_total, 1)))), u.default.createElement(f.View, {
                    style: {
                        flex: 1
                    }
                }, u.default.createElement(f.View, {
                    style: j.introIconRow
                }, u.default.createElement(w.default, {
                    name: "eye",
                    size: 17,
                    solid: !0,
                    color: "#7f7f7f"
                }), u.default.createElement(f.Text, {
                    style: [ j.introIconText, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, "" + this.fomatFloat(_0x5170c3.total_views, 1)))), u.default.createElement(T.default, {
                    style: {
                        flex: 1
                    },
                    containerStyle: j.introIconRow,
                    textStyle: j.introIconText,
                    iconStyle: {
                        color: "#7f7f7f"
                    },
                    data: _0x5170c3
                }), u.default.createElement(f.TouchableOpacity, {
                    style: {
                        flex: 1
                    },
                    onPress: this.handleDownload
                }, u.default.createElement(f.View, {
                    style: j.introIconRow
                }, u.default.createElement(w.default, {
                    name: "download",
                    size: 17,
                    solid: !0,
                    color: "#7f7f7f"
                }), u.default.createElement(f.Text, {
                    style: [ j.introIconText, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("下載")))), _0xfeb463 ? u.default.createElement(f.TouchableOpacity, {
                    style: {
                        flex: 1
                    },
                    disabled: _0x27c267,
                    onPress: this.handleTracking
                }, _0x27c267 ? u.default.createElement(f.ActivityIndicator, {
                    size: "small"
                }) : u.default.createElement(f.View, {
                    style: j.introIconRow
                }, u.default.createElement(w.default, {
                    name: "bell",
                    size: 17,
                    solid: _0x20d135,
                    color: _0x20d135 ? _.colors.secondary : "#7f7f7f"
                }), u.default.createElement(f.Text, {
                    style: [ j.introIconText, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, _0x20d135 ? (0, v.lang)("已追蹤") : (0, v.lang)("連載通知")))) : null, u.default.createElement(I.default, {
                    isModalVisible: this.state.loginModalVisible,
                    toggleModal: this.toggleModal
                }), u.default.createElement(b.default, {
                    animationType: "slide",
                    isVisible: _0x3eb445
                }, 0 === _0x659f54 ? u.default.createElement(f.View, {
                    style: {
                        paddingTop: 15,
                        backgroundColor: "white"
                    }
                }, u.default.createElement(f.View, {
                    style: {
                        flexDirection: "row",
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginBottom: 10
                    },
                    key: "space-between",
                    title: "Hide modal"
                }, u.default.createElement(f.Text, {
                    style: {
                        marginRight: "auto"
                    }
                }, (0, v.lang)("請選擇下載話數")), u.default.createElement(w.default, {
                    onPress: function() {
                        return _0x41eaf8.setModalState(!1);
                    },
                    style: [ x.mainStyle.headerGift ],
                    name: "times",
                    size: 20,
                    color: "black"
                })), u.default.createElement(f.ScrollView, {
                    style: {
                        maxHeight: .8 * M.default.window.height
                    },
                    nestedScrollEnabled: !0,
                    tabLabel: (0, v.lang)("目錄"),
                    scrollEnabled: !0
                }, u.default.createElement(R.default, {
                    data: _0x5170c3,
                    setModalState: this.setModalState
                }))) : null, 1 === _0x659f54 ? u.default.createElement(f.View, {
                    style: [ {
                        backgroundColor: "white",
                        justifyContent: "center",
                        padding: 20
                    }, "1" === g.darkMode ? {
                        backgroundColor: _.colors.backgroundDark
                    } : {} ]
                }, u.default.createElement(f.Text, {
                    style: [ {
                        margin: 10,
                        fontSize: 16,
                        marginLeft: "auto",
                        marginRight: "auto"
                    }, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("收藏正確姿勢")), u.default.createElement(V.Divider, {
                    style: {
                        width: "90%",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }
                }), u.default.createElement(f.ScrollView, {
                    style: {
                        maxHeight: .7 * M.default.window.height
                    }
                }, u.default.createElement(f.View, {
                    style: {
                        width: "100%",
                        marginTop: 20
                    }
                }, u.default.createElement(f.Image, {
                    style: {
                        width: .6 * M.default.window.width,
                        height: .6 * M.default.window.width / 1064 * 880,
                        marginLeft: "auto",
                        marginRight: "auto"
                    },
                    resizeMode: "contain",
                    source: r(d[26])
                })), u.default.createElement(f.Text, {
                    style: [ j.modalTitle, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("1.點 [漫畫] 點 [收藏] 即可選你要的標籤 全都要就點 [收藏全部標籤]")), u.default.createElement(f.Text, {
                    style: [ j.modalTitle, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("2.如何使用標籤 點 [個人中心]  點[收藏標籤] 點[標籤] 即可使用"))), u.default.createElement(f.View, {
                    style: {
                        marginTop: 10,
                        marginHorizontal: 50
                    }
                }, u.default.createElement(f.Button, {
                    title: (0, v.lang)("我都學會了！"),
                    onPress: function() {
                        return _0x41eaf8.setModalState(!1);
                    },
                    color: "" + _.colors.secondary
                }))) : null)), 0 !== Object.keys(_0x5170c3).length ? u.default.createElement(f.View, {
                    style: j.introRowContainer
                }, null != _0x5170c3.id ? u.default.createElement(f.View, {
                    style: j.introRow
                }, u.default.createElement(f.Text, {
                    style: [ j.introRowTitle, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("禁漫車")), u.default.createElement(f.Text, {
                    style: j.introRowContent
                }, "JM" + _0x5170c3.id)) : null, "string" == typeof _0x5170c3.description && "" !== _0x5170c3.description && _0x5170c3.description.length > 0 || _0x5170c3.tags && _0x5170c3.tags.length > 0 ? u.default.createElement(f.View, {
                    style: j.introRow
                }, u.default.createElement(f.Text, {
                    style: [ j.introRowTitle, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("描述")), "string" == typeof _0x5170c3.description && "" !== _0x5170c3.description ? u.default.createElement(f.Text, {
                    style: j.introRowContent
                }, _0x5170c3.description) : null, _0x5170c3.tags ? u.default.createElement(f.View, {
                    style: j.introRowTags
                }, u.default.createElement(B, {
                    searchTag:this.props.searchTag,tag: _0x5170c3.tags
                }), u.default.createElement(f.TouchableOpacity, {
                    style: {
                        marginLeft: 10
                    },
                    onPress: function() {
                        return _0x41eaf8.setState({
                            isModalVisible: !0,
                            currentModal: 1
                        });
                    }
                }, u.default.createElement(w.default, {
                    name: "question-circle",
                    size: 20,
                    color: _.colors.secondary
                }))) : null) : null, Array.isArray(_0x5170c3.author) && _0x5170c3.author.length > 0 ? u.default.createElement(f.View, {
                    style: j.introRow
                }, u.default.createElement(f.Text, {
                    style: [ j.introRowTitle, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("作者")), u.default.createElement(f.View, {
                    style: j.introRowTags
                }, u.default.createElement(B, {
                    searchTag:this.props.searchTag,tag: _0x5170c3.author
                }))) : null, Array.isArray(_0x5170c3.actors) && _0x5170c3.actors.length > 0 ? u.default.createElement(f.View, {
                    style: j.introRow
                }, u.default.createElement(f.Text, {
                    style: [ j.introRowTitle, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("登場人物")), u.default.createElement(f.View, {
                    style: j.introRowTags
                }, u.default.createElement(B, {
                    searchTag:this.props.searchTag,tag: _0x5170c3.actors
                }))) : null, Array.isArray(_0x5170c3.works) && _0x5170c3.works.length > 0 ? u.default.createElement(f.View, {
                    style: j.introRow
                }, u.default.createElement(f.Text, {
                    style: [ j.introRowTitle, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark
                    } : {} ]
                }, (0, v.lang)("作品")), u.default.createElement(f.View, {
                    style: j.introRowTags
                }, u.default.createElement(B, {
                    searchTag:this.props.searchTag,tag: _0x5170c3.works
                }))) : null) : null, !_0x5170c3.offline && u.default.createElement(f.View, {
                    style: j.introRowContainer
                }, u.default.createElement(y.default, {
                    item: {
                        id: "related",
                        title: (0, v.lang)("更多相關"),
                        content: _0x5170c3.related_list
                    }
                })));
            }
        } ]), _0x4331dd;
    }(u.Component), F = (0, k.connect)(function(_0x78e000) {
        return {
            Favorite: _0x78e000.Favorite,
            Member: _0x78e000.Member
        };
    }, {
        like: h.like
    })(z);
    e.default = F;
    var j = f.StyleSheet.create({
        introContainer: {
            flex: 1
        },
        introIconContainer: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10
        },
        introIconRow: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap"
        },
        introIconText: {
            marginTop: 5,
            fontSize: 12
        },
        introRowContainer: {
            padding: 10,
            flexDirection: "column"
        },
        introRow: {
            marginTop: 10,
            marginBottom: 10
        },
        introRowTitle: {
            fontWeight: "normal",
            fontSize: 16
        },
        introRowContent: {
            color: "#7F7F7F",
            paddingVertical: 10,
            fontSize: 14,
            lineHeight: 20
        },
        introRowTags: {
            paddingTop: 5,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center"
        },
        introRowTag: {
            color: "#7F7F7F",
            borderWidth: 1,
            borderColor: "#7F7F7F",
            margin: 5,
            padding: 5,
            borderRadius: 5,
            backgroundColor: "#ececec",
            fontSize: 12,
            marginLeft: 0,
            overflow: "hidden"
        },
        modalTitle: {
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 15,
            lineHeight: 20
        }
    }), B = function(_0xd1d145) {
        (0, n.default)(_0x2a4535, _0xd1d145);
        var _0x44d210 = A(_0x2a4535);
        function _0x2a4535() {
            var _0x20d3c6;
            (0, o.default)(this, _0x2a4535);
            for (var _0xb95eb9 = arguments.length, _0x3c12e3 = new Array(_0xb95eb9), _0xfe44d9 = 0; _0xfe44d9 < _0xb95eb9; _0xfe44d9++) _0x3c12e3[_0xfe44d9] = arguments[_0xfe44d9];
            return (_0x20d3c6 = _0x44d210.call.apply(_0x44d210, [ this ].concat(_0x3c12e3))).state = {
                showAll: !1
            }, _0x20d3c6.handleShowAll = function() {
                _0x20d3c6.setState(function(_0x57b9e5) {
                    return {
                        showAll: !_0x57b9e5.showAll
                    };
                });
            }, _0x20d3c6;
        }
        return (0, l.default)(_0x2a4535, [ {
            key: "render",
            value: function() {
                const searchTag=this.props.searchTag;
                var _0x5e3c0e = this.props.tag, _0x548b85 = this.state.showAll, _0x39baf0 = _0x548b85 ? _0x5e3c0e : _0x5e3c0e.slice(0, 7);
                return u.default.createElement(u.default.Fragment, null, _0x39baf0.map(function(_0x4ab0ab, _0x8f87c7) {
                    return u.default.createElement(f.TouchableOpacity, {
                        key: _0x8f87c7,
                        onPress: function() {
                            if(searchTag)return searchTag(_0x4ab0ab);
                            return p.navigate("Search", {
                                searchText: _0x4ab0ab
                            });
                        }
                    }, u.default.createElement(f.Text, {
                        style: [ j.introRowTag, "1" === g.darkMode ? {
                            color: _.colors.textPrimaryDark,
                            backgroundColor: _.colors.backgroundDark
                        } : {} ]
                    }, "#" + _0x4ab0ab));
                }), _0x5e3c0e.length > 7 ? u.default.createElement(f.TouchableOpacity, {
                    onPress: this.handleShowAll
                }, u.default.createElement(f.Text, {
                    style: [ j.introRowTag, {
                        color: _.colors.secondary,
                        borderColor: _.colors.secondary
                    }, "1" === g.darkMode ? {
                        color: _.colors.textPrimaryDark,
                        backgroundColor: _.colors.backgroundDark
                    } : {} ]
                }, _0x548b85 ? (0, v.lang)("顯示較少") : (0, v.lang)("顯示全部"))) : null);
            }
        } ]), _0x2a4535;
    }(u.default.Component);
}, 2103, [ 1, 155, 156, 157, 159, 162, 55, 2, 1425, 1422, 810, 825, 410, 650, 2060, 651, 827, 809, 718, 2104, 729, 852, 648, 1920, 655, 1639, 2105 ]);
