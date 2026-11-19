__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0;
    var n = t(r(d[1])), o = t(r(d[2])), l = t(r(d[3])), s = t(r(d[4])), u = t(r(d[5])), c = O(r(d[6])), f = r(d[7]), p = t(r(d[8])), h = O(r(d[9])), y = t(r(d[10])), E = r(d[11]), L = t(r(d[12])), b = O(r(d[13])), R = r(d[14]), M = r(d[15]), v = t(r(d[16])), C = t(r(d[17])), S = t(r(d[18])), I = t(r(d[19])), k = r(d[20]), T = r(d[21]);
    function D(_0x2db48a) {
        if ("function" != typeof WeakMap) return null;
        var _0x184127 = new WeakMap, _0x419dd1 = new WeakMap;
        return (D = function(_0x170c10) {
            return _0x170c10 ? _0x419dd1 : _0x184127;
        })(_0x2db48a);
    }
    function O(_0xea327e, _0x32bcf6) {
        for (var _0x566612 = "0|2|4|5|3|6|1".split("|"), _0x51b6a9 = 0; ;) {
            switch (_0x566612[_0x51b6a9++]) {
              case "0":
                if (!_0x32bcf6 && _0xea327e && _0xea327e.__esModule) return _0xea327e;
                continue;

              case "1":
                return _0x1a605a.default = _0xea327e, _0x2e9fa1 && _0x2e9fa1.set(_0xea327e, _0x1a605a), 
                _0x1a605a;

              case "2":
                if (null === _0xea327e || "object" != typeof _0xea327e && "function" != typeof _0xea327e) return {
                    default: _0xea327e
                };
                continue;

              case "3":
                var _0x1a605a = {}, _0x4e9606 = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;

              case "4":
                var _0x2e9fa1 = D(_0x32bcf6);
                continue;

              case "5":
                if (_0x2e9fa1 && _0x2e9fa1.has(_0xea327e)) return _0x2e9fa1.get(_0xea327e);
                continue;

              case "6":
                for (var _0x329276 in _0xea327e) if ("default" !== _0x329276 && Object.prototype.hasOwnProperty.call(_0xea327e, _0x329276)) {
                    var _0x49b2f1 = _0x4e9606 ? Object.getOwnPropertyDescriptor(_0xea327e, _0x329276) : null;
                    _0x49b2f1 && (_0x49b2f1.get || _0x49b2f1.set) ? Object.defineProperty(_0x1a605a, _0x329276, _0x49b2f1) : _0x1a605a[_0x329276] = _0xea327e[_0x329276];
                }
                continue;
            }
            break;
        }
    }
    var F = function(_0x4d4d51) {
        (0, l.default)(_0x2c877f, _0x4d4d51);
        var _0xfd89cf, _0x5197af, _0x5ea112 = (_0xfd89cf = _0x2c877f, _0x5197af = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0x4a479d) {
                return !1;
            }
        }(), function() {
            var _0x3c5568, _0x283176 = (0, u.default)(_0xfd89cf);
            if (_0x5197af) {
                var _0x44ffe1 = (0, u.default)(this).constructor;
                _0x3c5568 = Reflect.construct(_0x283176, arguments, _0x44ffe1);
            } else _0x3c5568 = _0x283176.apply(this, arguments);
            return (0, s.default)(this, _0x3c5568);
        });
        function _0x2c877f(_0x1b9ee5) {
            var _0x4f85c1;
            return (0, n.default)(this, _0x2c877f), (_0x4f85c1 = _0x5ea112.call(this, _0x1b9ee5)).toggleLoginModal = function() {
                _0x4f85c1.setState({
                    isLoginModalVisible: !_0x4f85c1.state.isLoginModalVisible
                });
            }, _0x4f85c1._renderItem = function(_0x302c77) {
                var _0x18ebef = _0x302c77.item, _0x394f3b = (_0x302c77.index, _0x4f85c1.props), _0x589c8f = _0x394f3b.hideReplyInput, _0x59f017 = _0x394f3b.commentOpenModal, _0x3052c0 = _0x394f3b.Setting, _0x4e67cf = _0x394f3b.Member, _0x3b633b = _0x394f3b.Forum;
                return c.default.createElement(f.View, {
                    style: [ {
                        flex: 1,
                        flexDirection: "column",
                        paddingBottom: 5,
                        paddingTop: 5
                    }, "1" === g.darkMode ? {
                        backgroundColor: k.colors.primaryDark
                    } : {} ]
                }, c.default.createElement(y.default, {
                    avatarBasePath: _0x3052c0.info.img_host + "/media/users/",
                    item: _0x18ebef,
                    isReply: !1
                }), Array.isArray(_0x18ebef.replys) && _0x18ebef.replys.filter(item=>item && typeof item==="object").map(function(_0x4f8a5c, _0x69f02a) {
                    return c.default.createElement(y.default, {
                        avatarBasePath: _0x3052c0.info.img_host + "/media/users/",
                        key: _0x4f8a5c.CID || _0x69f02a,
                        item: _0x4f8a5c,
                        isReply: !0
                    });
                }), !_0x589c8f && _0x59f017 ? c.default.createElement(f.TouchableOpacity, {
                    style: [ {
                        flexDirection: "row",
                        backgroundColor: "rgba(236, 236, 236, 0.6)",
                        padding: 10,
                        paddingLeft: 15,
                        paddingRight: 15
                    }, "1" === g.darkMode ? {
                        backgroundColor: "rgba(200, 200, 200, 0.6)"
                    } : {} ],
                    onPress: function() {
                        return !0 === _0x4e67cf.isLogin ? h.navigate("CommentModal", {
                            aid: _0x18ebef.AID
                        }) : _0x4f85c1.toggleLoginModal();
                    }
                }, c.default.createElement(f.TextInput, {
                    editable: !1,
                    placeholder: (0, T.lang)("給個回應"),
                    dismiss: !0,
                    disableFullscreenUI: !0,
                    style: {
                        width: "90%",
                        height: 40,
                        borderRadius: 10,
                        paddingLeft: 5,
                        backgroundColor: "white",
                        borderColor: "transparent",
                        borderWidth: 1
                    }
                }), c.default.createElement(f.View, {
                    style: {
                        padding: 3,
                        paddingLeft: 10
                    }
                }, c.default.createElement(p.default, {
                    name: "reply",
                    size: 15,
                    color: "#ececec",
                    style: {
                        backgroundColor: "#aaa",
                        borderRadius: 20,
                        padding: 8
                    }
                }))) : !_0x589c8f && c.default.createElement(f.View, {
                    style: [ {
                        flexDirection: "row",
                        backgroundColor: "rgba(236, 236, 236, 0.6)",
                        padding: 10,
                        paddingLeft: 15,
                        paddingRight: 15
                    }, "1" === g.darkMode ? {
                        backgroundColor: "rgba(100, 100, 100, 0.6)"
                    } : {} ]
                }, c.default.createElement(S.default, {
                    isLogin: _0x4e67cf.isLogin,
                    toggleLoginModal: _0x4f85c1.toggleLoginModal,
                    item: _0x18ebef,
                    sendComment: _0x4f85c1.sendComment,
                    isReplyEditing: _0x4f85c1.state.isReplyEditing,
                    setReplyEditing: _0x4f85c1.setReplyEditing
                }), c.default.createElement(f.TouchableOpacity, {
                    onPress: function() {
                        return _0x4e67cf.isLogin ? _0x4f85c1.sendComment(_0x18ebef) : _0x4f85c1.toggleLoginModal();
                    },
                    disabled: _0x3b633b.isCommentResultLoading
                }, c.default.createElement(f.View, {
                    style: {
                        padding: 3,
                        paddingLeft: 10
                    }
                }, c.default.createElement(p.default, {
                    name: "reply",
                    size: 15,
                    color: "#ececec",
                    style: {
                        backgroundColor: "#aaa",
                        borderRadius: 20,
                        padding: 8
                    }
                })))));
            }, _0x4f85c1.setReplyEditing = function(_0x50972b, _0x576bc9) {
                _0x4f85c1.setState({
                    isReplyEditing: _0x50972b,
                    commentText: _0x576bc9
                });
            }, _0x4f85c1._renderFooter = function() {
                var _0x4d8ff4 = _0x4f85c1.props.footerInputContainerStyle;
                return c.default.createElement(L.default, {
                    initData: function() {
                        return _0x4f85c1.initData();
                    },
                    aid: _0x4f85c1.props.aid,
                    bid: _0x4f85c1.props.bid,
                    newTheme: !0,
                    footerInputContainerStyle: _0x4d8ff4
                });
            }, _0x4f85c1.initData = function() {
                const view=_0x4f85c1, props=view.props;
                if(view.feed)view.feed.dispose();
                const scope={mode:props.mode};
                if(Number(props.uid)>0)scope.uid=props.uid;
                if(props.bid)scope.bid=props.bid;
                const feed=view.feed=r(d[23]).create(props.aid || undefined,scope);
                feed.subscribe(state=>view.setState({
                    list:state.items, page:state.page, isLoading:state.busy, isRefreshing:state.refreshing,
                    isLoadFinishedAll:!!state.page && !state.more, pageError:state.error
                }));
                feed.load('open');
            }, _0x4f85c1.sendComment = function(_0x29beb1, _0x128571) {
                var _0x9f4046 = _0x4f85c1.props, _0x2a302b = _0x9f4046.comment, _0x120dc4 = _0x9f4046.aid, _0x2873f4 = _0x9f4046.bid, _0x41e087 = {
                    comment: null != _0x128571 ? _0x128571 : _0x4f85c1.state.commentText
                };
                _0x120dc4 && (_0x41e087.aid = _0x120dc4), _0x29beb1.CID && (_0x41e087.comment_id = parseInt(_0x29beb1.CID, 10)), 
                _0x2873f4 && (_0x41e087.bid = _0x2873f4), _0x4f85c1.setState({
                    commentText: "",
                    isCommentResultLoading: !0
                }), _0x2a302b(b.API_COMMENT_SEND, _0x41e087, !0);
            }, _0x4f85c1.onRefresh = function() {
                if(_0x4f85c1.feed)_0x4f85c1.feed.load('refresh');
            }, _0x4f85c1.renderLoadMore = function() {
                var _0x4e7bee = _0x4f85c1.props, _0x79acd6 = _0x4e7bee.isBlogView, _0x216dc9 = _0x4e7bee.isMemberSite, _0x3b8373 = _0x4f85c1.state, _0x139d43 = _0x4f85c1.state.isLoadFinishedAll;
                return !_0x216dc9 || _0x139d43 || _0x3b8373.isLoading ? _0x216dc9 && !_0x139d43 && _0x3b8373.isLoading && _0x3b8373.page>0 ? c.default.createElement(v.default, {
                    source: r(d[22]),
                    style: {
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        marginTop: 20
                    }
                }) : _0x216dc9 && _0x139d43 ? c.default.createElement(f.Text, {
                    style: [ {
                        flex: 1,
                        alignSelf: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20
                    }, "1" === g.darkMode ? {
                        color: k.colors.textPrimaryDark
                    } : {} ]
                }, (0, T.lang)("已經到底啦")) : _0x4f85c1.state.isLoadFinishedAll ? _0x4f85c1.state.isLoadFinishedAll ? c.default.createElement(f.Text, {
                    style: [ {
                        flex: 1,
                        alignSelf: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20
                    }, "1" === g.darkMode ? {
                        color: k.colors.textPrimaryDark
                    } : {} ]
                }, (0, T.lang)("已經到底啦")) : void 0 : c.default.createElement(v.default, {
                    source: r(d[22]),
                    style: [ {
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        marginTop: 20,
                        marginBottom: 40
                    }, _0x79acd6 && {
                        width: 40,
                        height: 40,
                        marginTop: 10,
                        marginBottom: 0
                    } ]
                }) : c.default.createElement(f.View, {
                    style: {
                        alignItems: "center"
                    }
                }, c.default.createElement(f.TouchableOpacity, {
                    onPress: function() {
                        _0x4f85c1.handleLoadMore();
                    },
                    style: _.loadMoreButton
                }, c.default.createElement(f.Text, {
                    style: _.loadMoreText
                }, (0, T.lang)("加載更多"))));
            }, _0x4f85c1.handleLoadMore = function() {
                if(_0x4f85c1.feed)_0x4f85c1.feed.load('more');
            }, _0x4f85c1.onEndReached = function() {
                if(_0x4f85c1.onEndReachedCalledDuringMomentum || _0x4f85c1.state.pageError)return;
                _0x4f85c1.onEndReachedCalledDuringMomentum=true;
                _0x4f85c1.handleLoadMore();
            }, _0x4f85c1.state = {
                page: 1,
                list: [],
                isLoading: !0,
                isReplyEditing: !1,
                isCommentResultLoading: !1,
                isRefreshing: !1,
                isLoadFinishedAll: !1,
                commentText: "",
                commentIndex: 0,
                onEnd: !1,
                commentOnEnd: !1
            }, _0x4f85c1.onEndReachedCalledDuringMomentum = !1, _0x4f85c1;
        }
        return (0, o.default)(_0x2c877f, [ {
            key: "componentDidUpdate",
            value: function(_0x41685a,previousState) {
                const current=this.props, forum=current.Forum;
                if(previousState.list!==this.state.list || _0x41685a.commentFilters!==current.commentFilters)
                    E.rememberAuthors(this.state.list,current.commentFilters);
                if(['aid','bid','mode','uid'].some(key=>current[key]!==_0x41685a[key]))this.initData();
                else if((current.favOnEnd && !_0x41685a.favOnEnd)||(current.commentOnEnd && !_0x41685a.commentOnEnd))this.handleLoadMore();
                if(_0x41685a.Forum.isCommentResultLoading && !forum.isCommentResultLoading && this.state.isCommentResultLoading){
                    const result=forum.commentResult||{},ok=Number(result.code)===200;
                    if(Number(result.code)===401)this.toggleLoginModal();
                    const message=ok && result.data && result.data.msg || result.errorMsg || (ok?'已发送':'发送失败，请重试');
                    if(g.toastTop)g.toastTop.show(String(message),{duration:3000,type:ok?'success':'danger'});
                    this.setState({isCommentResultLoading:false});
                    if(ok && this.feed)this.feed.load('refresh');
                }
            }
        }, {
            key: "componentWillUnmount",
            value: function(){if(this.feed)this.feed.dispose();}
        }, {
            key: "componentDidMount",
            value: function() {
                this.initData();
            }
        }, {
            key: "render",
            value: function() {
                var _0x510606 = this, _0x1fab0e = this.props, _0x2c2bd9 = _0x1fab0e.hideFooter, _0x59acf9 = _0x1fab0e.listHeaderComponent, _0x53e926 = _0x1fab0e.scrollEnabled, _0x2d8ccc = _0x1fab0e.Forum, _0x35ce96 = _0x1fab0e.scroll;
                return c.default.createElement(f.View, {
                    style: {
                        flex: 1
                    }
                }, c.default.createElement(f.View, {
                    style: {
                        alignItems: "flex-end"
                    }
                }, c.default.createElement(E.Manage)), this.state.pageError && c.default.createElement(f.TouchableOpacity, {
                    accessibilityRole:'button',onPress:()=>this.feed.load(this.state.pageError===1?'refresh':'more'),style:_.loadMoreButton
                },c.default.createElement(f.Text,{style:_.loadMoreText},'讨论加载失败，点击重试')), this.state.isLoading && !this.state.page && c.default.createElement(I.default, null), _0x2c2bd9 && !0 === _0x2c2bd9 || this.state.isReplyEditing ? c.default.createElement(c.default.Fragment, null) : this._renderFooter(), this.state.list.length > 0 && this.state.list[0] && c.default.createElement(f.View, {
                    style: [ {
                        flex: 1
                    }, "1" === g.darkMode ? {
                        backgroundColor: k.colors.primaryDark
                    } : {} ]
                }, c.default.createElement(C.default, {
                    isModalVisible: this.state.isLoginModalVisible,
                    toggleModal: this.toggleLoginModal
                }), c.default.createElement(f.FlatList, {
                    data: E.visible(this.state.list, this.props.commentFilters),
                    ListEmptyComponent: this.props.commentFilters && c.default.createElement(f.Text, {
                        style: {
                            textAlign: "center",
                            padding: 10,
                            color: k.colors.tertiary
                        }
                    }, T.lang("本页评论已被屏蔽")),
                    ListHeaderComponent: null != _0x59acf9 ? _0x59acf9 : c.default.createElement(c.default.Fragment, null),
                    renderItem: this._renderItem,
                    keyExtractor: function(_0x595d82, _0x5d43e5) {
                        return _0x595d82.CID + "_" + _0x595d82.UID;
                    },
                    onEndReached: this.state.isLoading || this.state.isLoadFinishedAll || !E.visible(this.state.list, this.props.commentFilters).length ? void 0 : this.onEndReached,
                    onEndReachedThreshold: .3,
                    onMomentumScrollBegin: function() {
                        _0x510606.onEndReachedCalledDuringMomentum = !1;
                    },
                    ListFooterComponent: function() {
                        return !_0x510606.props.commentFilters || _0x510606.state.isLoadFinishedAll || _0x510606.state.isLoading || E.visible(_0x510606.state.list, _0x510606.props.commentFilters).length ? _0x510606.renderLoadMore() : c.default.createElement(f.TouchableOpacity, {
                            onPress: _0x510606.handleLoadMore,
                            style: _.loadMoreButton
                        }, c.default.createElement(f.Text, {
                            style: _.loadMoreText
                        }, T.lang("加载更多")));
                    },
                    contentContainerStyle: {
                        paddingBottom: 20
                    },
                    scrollEnabled: null == _0x53e926 || _0x53e926,
                    keyboardDismissMode: "interactive",
                    initialNumToRender: 10,
                    windowSize: 3,
                    removeClippedSubviews: !0,
                    maxToRenderPerBatch: 10,
                    updateCellsBatchingPeriod: 50,
                    refreshControl: c.default.createElement(f.RefreshControl, {
                        refreshing: this.state.isRefreshing,
                        onRefresh: this.onRefresh,
                        progressViewOffset: 10
                    }),
                    onScroll: _0x35ce96 ? f.Animated.event([ {
                        nativeEvent: {
                            contentOffset: {
                                y: _0x35ce96
                            }
                        }
                    } ], {
                        useNativeDriver: !0
                    }) : function() {}
                })), !this.state.list.length > 0 && !this.state.isLoading && !this.state.pageError && c.default.createElement(f.View, {
                    style: [ {
                        height: 65,
                        justifyContent: "center",
                        alignItems: "center"
                    }, "1" === g.darkMode ? {
                        backgroundColor: k.colors.backgroundDark
                    } : {} ]
                }, c.default.createElement(f.Text, {
                    style: "1" === g.darkMode ? {
                        color: k.colors.textPrimaryDark
                    } : {}
                }, (0, T.lang)("目前沒有留言"))));
            }
        } ]), _0x2c877f;
    }(c.Component), w = (0, R.connect)(function(_0x339447) {
        return {
            Forum: _0x339447.Forum,
            Setting: _0x339447.Setting,
            Member: _0x339447.Member
        };
    }, {
        forum: M.forum,
        comment: M.comment
    })(F);
    e.default = E.withFilters(w);
    var _ = f.StyleSheet.create({
        loadMoreButton: {
            padding: 10,
            backgroundColor: k.colors.secondary,
            borderRadius: 8,
            margin: 10
        },
        loadMoreText: {
            color: "#fff"
        }
    });
}, 1653, [ 1, 155, 156, 157, 159, 162, 55, 2, 810, 825, 1654, 2171, 1657, 650, 410, 1655, 730, 1639, 1658, 805, 729, 651, 807, 2165 ]);
