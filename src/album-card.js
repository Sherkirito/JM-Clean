__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0;
    var o = t(r(d[1])), n = t(r(d[2])), l = t(r(d[3])), s = t(r(d[4])), c = t(r(d[5])), u = t(r(d[6])), f = F(r(d[7])), p = r(d[8]), h = F(r(d[9])), y = r(d[10]), v = t(r(d[11])), b = r(d[12]), S = r(d[13]), w = F(r(d[14])), _ = r(d[15]), E = r(d[16]), I = t(r(d[17])), T = t(r(d[18])), k = t(r(d[19])), R = t(r(d[20])), x = r(d[21]);
    function P(_0x505894) {
        if ("function" != typeof WeakMap) return null;
        var _0x65fc66 = new WeakMap, _0x365fd4 = new WeakMap;
        return (P = function(_0x409bda) {
            return _0x409bda ? _0x365fd4 : _0x65fc66;
        })(_0x505894);
    }
    function F(_0x1d3564, _0x5cc21b) {
        for (var _0x1dea17 = "2|3|4|5|1|0|6".split("|"), _0x4cf336 = 0; ;) {
            switch (_0x1dea17[_0x4cf336++]) {
              case "0":
                for (var _0x3549af in _0x1d3564) if ("default" !== _0x3549af && Object.prototype.hasOwnProperty.call(_0x1d3564, _0x3549af)) {
                    var _0x5767aa = _0x3a80c5 ? Object.getOwnPropertyDescriptor(_0x1d3564, _0x3549af) : null;
                    _0x5767aa && (_0x5767aa.get || _0x5767aa.set) ? Object.defineProperty(_0x3c603c, _0x3549af, _0x5767aa) : _0x3c603c[_0x3549af] = _0x1d3564[_0x3549af];
                }
                continue;

              case "1":
                var _0x3c603c = {}, _0x3a80c5 = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;

              case "2":
                if (!_0x5cc21b && _0x1d3564 && _0x1d3564.__esModule) return _0x1d3564;
                continue;

              case "3":
                if (null === _0x1d3564 || "object" != typeof _0x1d3564 && "function" != typeof _0x1d3564) return {
                    default: _0x1d3564
                };
                continue;

              case "4":
                var _0x450914 = P(_0x5cc21b);
                continue;

              case "5":
                if (_0x450914 && _0x450914.has(_0x1d3564)) return _0x450914.get(_0x1d3564);
                continue;

              case "6":
                return _0x3c603c.default = _0x1d3564, _0x450914 && _0x450914.set(_0x1d3564, _0x3c603c), 
                _0x3c603c;
            }
            break;
        }
    }
    var V = function(_0x3394ad) {
        (0, s.default)(_0x2c1b69, _0x3394ad);
        var _0x1c8af2, _0x35d1b0, _0x174219 = (_0x1c8af2 = _0x2c1b69, _0x35d1b0 = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0x55c39c) {
                return !1;
            }
        }(), function() {
            var _0x48ec96, _0x440aba = (0, u.default)(_0x1c8af2);
            if (_0x35d1b0) {
                var _0x59c816 = (0, u.default)(this).constructor;
                _0x48ec96 = Reflect.construct(_0x440aba, arguments, _0x59c816);
            } else _0x48ec96 = _0x440aba.apply(this, arguments);
            return (0, c.default)(this, _0x48ec96);
        });
        function _0x2c1b69() {
            for (var _0x797888 = "0|1|2|3|4".split("|"), _0x33a137 = 0; ;) {
                switch (_0x797888[_0x33a137++]) {
                  case "0":
                    continue;

                  case "1":
                    var _0xe7a69d;
                    continue;

                  case "2":
                    (0, n.default)(this, _0x2c1b69);
                    continue;

                  case "3":
                    for (var _0x533a6d = arguments.length, _0x145917 = new Array(_0x533a6d), _0x252d87 = 0; _0x252d87 < _0x533a6d; _0x252d87++) _0x145917[_0x252d87] = arguments[_0x252d87];
                    continue;

                  case "4":
                    return (_0xe7a69d = _0x174219.call.apply(_0x174219, [ this ].concat(_0x145917))).state = {
                        loading: !0,
                        loadStart: !1,
                        imageScaleValue: new p.Animated.Value(0),
                        isModalVisible: !1,
                        actionId: 0,
                        checked: !1,
                        pressed_Like: null,
                        pressed_Favorite: null,
                        selected: (0, _.lang)("選擇資料夾"),
                        folder_list: [],
                        isFolderVisible: !1
                    }, _0xe7a69d.setModalState = function(_0x4e861a) {
                        _0xe7a69d.setState({
                            isModalVisible: _0x4e861a
                        });
                    }, _0xe7a69d.setSelection = function(_0x378903) {
                        _0xe7a69d.setState({
                            isSelected: !_0x378903
                        });
                    }, _0xe7a69d.setModalFileState = function(_0x566639) {
                        _0xe7a69d.setState({
                            isFolderVisible: _0x566639
                        });
                    }, _0xe7a69d.sendMoveFolder = function() {
                        var _0xfda82d = _0xe7a69d.props.item;
                        R.default.fetchPost(w.API_FAVORITE_FOLDER, {
                            type: "move",
                            folder_id: _0xe7a69d.state.selected,
                            aid: Number(_0xfda82d.id)
                        }, function(_0x5050f2) {
                            var _0x2c24d2 = _0x5050f2.data.msg, _0x1914ac = "fail" === _0x5050f2.data.status ? "danger" : "success", _0x51260c = {
                                duration: 3e3,
                                style: {
                                    padding: 0,
                                    zIndex: 9999
                                },
                                textStyle: {
                                    fontSize: 16
                                },
                                type: _0x1914ac
                            };
                            "success" === _0x1914ac && _0xe7a69d.setModalFileState(!1), g.toastTop.show(_0x2c24d2, _0x51260c);
                        });
                    }, _0xe7a69d.getLastViewData = function() {
                        var _0x4bc843, _0x869a2b;
                        return o.default.async(function(_0x1a7c8b) {
                            for (;;) switch (_0x1a7c8b.prev = _0x1a7c8b.next) {
                              case 0:
                                return _0x4bc843 = "last_viewed_chapter_" + _0xe7a69d.props.item.id, _0x1a7c8b.next = 3, 
                                o.default.awrap(p.AsyncStorage.getItem(_0x4bc843));

                              case 3:
                                (_0x869a2b = _0x1a7c8b.sent) && _0xe7a69d.setState({
                                    last_viewed_chapter: _0x869a2b
                                });

                              case 5:
                              case "end":
                                return _0x1a7c8b.stop();
                            }
                        }, null, null, null, Promise);
                    }, _0xe7a69d.handleFav = function() {
                        var _0x10d522 = _0xe7a69d.props.item, _0x4c8296 = _0xe7a69d.state.folder_list;
                        R.default.fetchPost(w.API_FAVORITE_LIST, {
                            aid: Number(_0x10d522.id)
                        }, function(_0x125e9d) {
                            if (401 === _0x125e9d.code) {
                                var _0x311338 = _0x125e9d.errorMsg;
                                g.toastTop.show(_0x311338, {
                                    duration: 3e3,
                                    style: {
                                        padding: 0,
                                        zIndex: 9999
                                    },
                                    textStyle: {
                                        fontSize: 16
                                    },
                                    type: "danger"
                                });
                            }
                            if (200 === _0x125e9d.code) {
                                var _0x2433e7 = _0x125e9d.data.msg, _0x580c41 = {
                                    duration: 3e3,
                                    style: {
                                        padding: 0,
                                        zIndex: 9999
                                    },
                                    textStyle: {
                                        fontSize: 16
                                    },
                                    type: "remove" === _0x125e9d.data.type ? "danger" : "success"
                                };
                                g.toastTop.show(_0x2433e7, _0x580c41), "add" === _0x125e9d.data.type && (_0xe7a69d.setState({
                                    pressed_Favorite: _0x10d522.id,
                                    isFolderVisible: !0
                                }), 0 === _0x4c8296.length && R.default.fetchGet(w.API_FAVORITE_LIST, {}, function(_0x49a7b4) {
                                    var _0x39fa51 = _0x49a7b4.data.folder_list;
                                    _0xe7a69d.setState({
                                        folder_list: _0x39fa51
                                    });
                                })), "remove" === _0x125e9d.data.type && _0xe7a69d.setState({
                                    pressed_Favorite: null
                                });
                            }
                        });
                    }, _0xe7a69d.handleLike = function() {
                        var _0x22e754 = _0xe7a69d.props.item;
                        R.default.fetchPost(w.API_LIKE_DATA, {
                            id: Number(_0x22e754.id)
                        }, function(_0x33a62e) {
                            if ("success" === _0x33a62e.data.status) {
                                var _0x1f6d5c = _0x33a62e.data.msg;
                                g.toastTop.show(_0x1f6d5c, {
                                    duration: 3e3,
                                    style: {
                                        padding: 0,
                                        zIndex: 9999
                                    },
                                    textStyle: {
                                        fontSize: 16
                                    },
                                    type: "success"
                                }), _0xe7a69d.setState({
                                    pressed_Like: _0x22e754.id
                                });
                            }
                        });
                    }, _0xe7a69d.onImageLoadEnd = function() {
                        p.Animated.timing(_0xe7a69d.state.imageScaleValue, {
                            toValue: 1,
                            duration: 150,
                            delay: 5,
                            useNativeDriver: !0
                        }).start();
                    }, _0xe7a69d._onPressRow = function(_0x2bbd0f, _0x314a29) {
                        if(_0xe7a69d.props.isEdit)return;
                        const params={id:_0x2bbd0f};
                        if(_0xe7a69d.props.historyChapter)params.historyChapter=_0xe7a69d.props.historyChapter;
                        if(_0x314a29)h.push("Detail",params);else h.navigate("Detail",params);
                    }, _0xe7a69d;
                }
                break;
            }
        }
        return (0, l.default)(_0x2c1b69, [ {
            key: "componentDidUpdate",
            value: function(_0x9f3f49) {
                var _0x496854 = this.props, _0x1b12e2 = _0x496854.Favorite, _0xd04c12 = _0x496854.favorite, _0x153b87 = _0x496854.history, _0x418005 = _0x496854.History, _0x5869cd = _0x496854.isEdit;
                if (!0 === _0x9f3f49.Favorite.isAddOrRemoveLoading && !1 === _0x1b12e2.isAddOrRemoveLoading && this.state.actionId === this.props.item.id) {
                    var _0x1ae02b = 200 === _0x1b12e2.addOrRemoveResult.code ? _0x1b12e2.addOrRemoveResult.data.msg : _0x1b12e2.addOrRemoveResult.errorMsg, _0x363ebd = {
                        duration: 3e3,
                        style: {
                            padding: 0,
                            zIndex: 9999
                        },
                        textStyle: {
                            fontSize: 16
                        },
                        type: _0x1b12e2.addOrRemoveResult.errorMsg ? "danger" : "success"
                    };
                    _0xd04c12(w.API_FAVORITE_LIST, {
                        page: 1
                    }, !0, !1), g.toastTop.show(_0x1ae02b, _0x363ebd);
                }
                if (!0 === _0x9f3f49.History.isRemoveHistoryLoading && !1 === _0x418005.isRemoveHistoryLoading && this.state.actionId === this.props.item.id) {
                    var _0x4038a8 = 200 === _0x418005.removeHistoryResult.code ? _0x418005.removeHistoryResult.data.msg : _0x418005.removeHistoryResult.errorMsg, _0x330f67 = {
                        duration: 3e3,
                        style: {
                            padding: 0,
                            zIndex: 9999
                        },
                        textStyle: {
                            fontSize: 16
                        },
                        type: _0x418005.removeHistoryResult.errorMsg ? "danger" : "success"
                    };
                    _0x153b87(w.API_HISTORY_LIST, {
                        page: 1
                    }, !0, !1), g.toastTop.show(_0x4038a8, _0x330f67);
                }
                !_0x9f3f49.isEdit && _0x5869cd && this.setState({
                    checked: !1
                });
            }
        }, {
            key: "onChangeCheck",
            value: function() {
                this.state.checked ? this.props.setItemSelectedList("del", this.props.item.id) : this.props.setItemSelectedList("add", this.props.item.id), 
                this.setState({
                    checked: !this.state.checked
                });
            }
        }, {
            key: "onValueChange",
            value: function(_0x2efa58) {
                this.setState({
                    selected: _0x2efa58
                });
            }
        }, {
            key: "componentDidMount",
            value: function() {
                this.props.is_favorite && this.getLastViewData();
            }
        }, {
            key: "render",
            value: function() {
                var _0x5c68f2 = this, _0x570fb1 = this.props, _0x3e58d3 = _0x570fb1.item, _0x3849b5 = _0x570fb1.containerStyle, _0x109dc8 = _0x570fb1.imageStyle, _0x44bc7b = _0x570fb1.categoryStyle, _0x26ff7f = _0x570fb1.Setting, _0x38868c = _0x570fb1.addOrRemoveFavorite, _0x3c14bb = _0x570fb1.cardActionType, _0x1be0ca = _0x570fb1.removeHistory, _0x47bb80 = _0x570fb1.hideCategory, _0x4d743f = _0x570fb1.isPushStack, _0x56cdb4 = _0x570fb1.isEdit, _0x1b5fe6 = _0x570fb1.is_favorite, _0x4e7b12 = _0x570fb1.showUpdate, _0x78c958 = this.state, _0x2509ff = _0x78c958.isModalVisible, _0x5892b9 = _0x78c958.last_viewed_chapter, _0x36d869 = _0x78c958.pressed_Like, _0x16af81 = _0x78c958.pressed_Favorite, _0x1b2e4d = _0x78c958.folder_list, _0x5678fa = _0x78c958.isFolderVisible, _0x1f0929 = "", _0x23a538 = "";
                const liked = _0x36d869 === _0x3e58d3.id || _0x3e58d3.liked === true || Number(_0x3e58d3.liked) === 1;
                switch (_0x3c14bb) {
                  case "removeFavorite":
                    _0x1f0929 = (0, _.lang)("沒事"), _0x23a538 = (0, _.lang)("刪除收藏");
                    break;

                  case "removeHistory":
                    _0x1f0929 = (0, _.lang)("沒事"), _0x23a538 = (0, _.lang)("刪除紀錄");
                }
                var _0x2d0898, _0x16b038 = (_0x2d0898 = _0x3e58d3).image && "" !== _0x2d0898.image ? _0x2d0898.image.startsWith("http://") || _0x2d0898.image.startsWith("https://") ? _0x2d0898.image : _0x26ff7f.info.img_host + _0x2d0898.image : _0x26ff7f.info.img_host + "/media/albums/" + _0x2d0898.id + "_3x4.jpg?v=" + _0x2d0898.update_at, _0x561f01 = new Date(1e3 * _0x3e58d3.update_at), _0x8239fd = new Date, _0x317221 = _0x561f01 > new Date(_0x8239fd.getTime() - 2592e5);
                return f.default.createElement(f.default.Fragment, null, f.default.createElement(p.TouchableOpacity, {
                    onLongPress: function() {
                        return _0x3c14bb && _0x5c68f2.setModalState(!0);
                    },
                    underlayColor: "#E6E6E6",
                    accessibilityLabel: this.props.readingProgress ? _0x3e58d3.title + ", " + this.props.readingProgress : void 0,
                    onPress: this.props.isEdit ? function() {
                        return _0x5c68f2.onChangeCheck();
                    } : function() {
                        if (_0x5c68f2.props.beforeOpen) _0x5c68f2.props.beforeOpen();
                        return _0x5c68f2._onPressRow(_0x3e58d3.id, _0x4d743f);
                    }
                }, f.default.createElement(v.default, {
                    isVisible: _0x5678fa,onBackButtonPress:()=>_0x5c68f2.setModalFileState(false),
                    onSwipeComplete: function() {
                        return _0x5c68f2.setModalFileState(!1);
                    }
                }, f.default.createElement(p.View, {
                    style: {
                        backgroundColor: "white",
                        justifyContent: "center",
                        padding: 20
                    }
                }, f.default.createElement(p.TouchableOpacity, {
                    title: "Hide modal",
                    onPress: function() {
                        return _0x5c68f2.setModalFileState(!1);
                    }
                }, f.default.createElement(p.Text, {
                    style: {
                        textAlign: "right"
                    }
                }, f.default.createElement(k.default, {
                    style: {
                        alignSelf: "flex-start"
                    },
                    name: "times",
                    size: 20,
                    color: "black"
                }))), f.default.createElement(p.Text, {
                    style: {
                        marginBottom: 20
                    }
                }, (0, _.lang)("請選擇收藏資料夾:")), f.default.createElement(x.Form, null, f.default.createElement(x.Picker, {
                    note: !0,
                    mode: "dropdown",
                    style: {
                        width: 200,
                        marginBottom: 20
                    },
                    selectedValue: this.state.selected,
                    onValueChange: this.onValueChange.bind(this)
                }, f.default.createElement(x.Picker.Item, {
                    label: (0, _.lang)("選擇資料夾"),
                    value: (0, _.lang)("選擇資料夾")
                }), _0x1b2e4d && _0x1b2e4d.map(function(_0x428b5e, _0x2cb6db) {
                    return f.default.createElement(x.Picker.Item, {
                        key: _0x2cb6db,
                        label: _0x428b5e.name,
                        value: _0x428b5e.FID
                    });
                })), "android" === p.Platform.OS && f.default.createElement(p.Text, {
                    style: {
                        width: "100%",
                        height: 60,
                        position: "absolute",
                        bottom: 0,
                        left: 0
                    }
                }, " ")), f.default.createElement(p.Button, {
                    color: E.colors.secondary,
                    style: {
                        width: 100
                    },
                    onPress: function() {
                        return _0x5c68f2.sendMoveFolder();
                    },
                    title: (0, _.lang)("確認")
                }))), f.default.createElement(p.View, {
                    style: [ _0x3849b5 || L.listitem, {
                        opacity: this.state.checked && _0x56cdb4 ? .6 : 1
                    } ]
                }, f.default.createElement(p.View, null, _0x4e7b12 && _0x317221 && f.default.createElement(p.View, {
                    style: {
                        position: "absolute",
                        top: 10,
                        left: 10,
                        padding: 3,
                        backgroundColor: "red",
                        borderRadius: 4,
                        zIndex: 99
                    }
                }, f.default.createElement(p.Text, {
                    numberOfLines: 1,
                    style: {
                        color: "white",
                        fontSize: 12
                    }
                }, (0, _.lang)("更新"))), (null == _0x3e58d3 ? void 0 : _0x3e58d3.category) && "" !== _0x3e58d3.category.title && !_0x47bb80 && f.default.createElement(p.View, {
                    style: [ L.itemCategory, null != _0x44bc7b ? _0x44bc7b : {} ]
                }, f.default.createElement(p.Text, {
                    style: L.itemCategoryText
                }, _0x3e58d3.category.title)), this.props.readingProgress ? f.default.createElement(r(d[22]).default, {
                    item: _0x3e58d3,
                    host: _0x26ff7f.info.img_host,
                    style: _0x109dc8 || L.itemImage
                }) : f.default.createElement(p.Image, {
                    source: {
                        uri: _0x16b038
                    },
                    style: _0x109dc8 || L.itemImage
                }), !this.props.readingProgress && !_0x1b5fe6 && f.default.createElement(p.TouchableOpacity, {
                    accessibilityRole: "button", accessibilityLabel: liked ? "已点赞" : "点赞",
                    onPress: this.handleLike,
                    style: {
                        position: "absolute",
                        bottom: 5,
                        left: 5,
                        padding: 3,
                        backgroundColor: "rgba(85,85,85,0.5)",
                        borderRadius: 4,
                        zIndex: 99
                    }
                }, f.default.createElement(k.default, {
                    style: liked ? {
                        color: "red"
                    } : {
                        color: E.colors.secondary
                    },
                    name: "heart",
                    size: 17,
                    solid: liked
                })), !this.props.readingProgress && !_0x1b5fe6 && f.default.createElement(p.TouchableOpacity, {
                    onPress: this.handleFav,
                    style: {
                        position: "absolute",
                        bottom: 5,
                        right: 5,
                        padding: 3,
                        backgroundColor: "rgba(85,85,85,0.5)",
                        borderRadius: 4,
                        zIndex: 99
                    }
                }, f.default.createElement(k.default, {
                    style: (null === _0x16af81 ? _0x3e58d3.is_favorite : _0x16af81) ? {
                        color: E.colors.secondary
                    } : {
                        color: "white"
                    },
                    name: "bookmark",
                    size: 17,
                    solid: !(null === _0x16af81 ? !_0x3e58d3.is_favorite : !_0x16af81)
                }))), f.default.createElement(p.View, {
                    style: L.item
                }, f.default.createElement(p.View, {
                    style: L.itemContent
                }, _0x56cdb4 && f.default.createElement(p.View, {
                    style: {
                        zIndex: 0
                    }
                }, f.default.createElement(I.default, {
                    boxType: "square",
                    style: "ios" === p.Platform.OS ? {
                        position: "absolute",
                        top: -160,
                        left: 10,
                        zIndex: 9999
                    } : {
                        position: "absolute",
                        top: -160,
                        zIndex: 9999
                    },
                    value: this.state.checked
                })), f.default.createElement(p.Text, {
                    style: [ L.comicName, "1" === g.darkMode ? {
                        color: E.colors.textPrimaryDark
                    } : {} ],
                    numberOfLines: 1
                }, _0x3e58d3.name || _0x3e58d3.title), _0x1b5fe6 && f.default.createElement(p.Text, {
                    numberOfLines: 1,
                    style: L.author
                }, _0x5892b9 ? _0x5892b9 + "/" : _0x3e58d3.latest_ep ? (0, _.lang)("未讀/") : "", _0x3e58d3.latest_ep || (0, 
                _.lang)("單集")), !_0x1b5fe6 && f.default.createElement(p.Text, {
                    numberOfLines: 1,
                    style: L.author
                }, this.props.readingProgress || _0x3e58d3.author))))), f.default.createElement(v.default, {
                    isVisible: _0x2509ff,onBackButtonPress:()=>_0x5c68f2.setModalState(false),
                    onSwipeComplete: function() {
                        return _0x5c68f2.setModalState(!1);
                    },
                    swipeDirection: [ "up", "left", "right", "down" ],
                    useNativeDriver: !0
                }, f.default.createElement(p.View, {
                    style: L.mainContainer
                }, f.default.createElement(p.TouchableHighlight, {
                    style: {
                        margin: 5,
                        width: 100
                    },
                    onPress: function() {
                        _0x5c68f2.setState({
                            actionId: _0x3e58d3.id
                        }, function() {
                            switch (_0x3c14bb) {
                              case "removeFavorite":
                                _0x38868c(w.API_FAVORITE_LIST, {
                                    aid: _0x3e58d3.id
                                }, !0);
                                break;

                              case "removeHistory":
                                _0x1be0ca(w.API_HISTORY_LIST, {
                                    id: _0x3e58d3.id
                                }, !0);
                            }
                        });
                    }
                }, f.default.createElement(p.Text, {
                    style: [ L.confirmButton, {
                        backgroundColor: "transparent"
                    } ]
                }, _0x23a538)), f.default.createElement(p.TouchableHighlight, {
                    style: {
                        margin: 5,
                        width: 100
                    },
                    onPress: function() {
                        return _0x5c68f2.setModalState(!1);
                    }
                }, f.default.createElement(p.Text, {
                    style: [ L.confirmButton, {
                        color: "white"
                    } ]
                }, _0x1f0929)))));
            }
        } ]), _0x2c1b69;
    }(f.PureComponent), C = (0, y.connect)(function(_0xb75eda) {
        return {
            Setting: _0xb75eda.Setting,
            Favorite: _0xb75eda.Favorite,
            History: _0xb75eda.History
        };
    }, {
        favorite: b.favorite,
        addOrRemoveFavorite: b.addOrRemoveFavorite,
        removeHistory: S.removeHistory,
        history: S.history
    })(V);
    e.default = C;
    var L = p.StyleSheet.create({
        mainContainer: {
            backgroundColor: E.colors.main,
            width: 150,
            padding: 10,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)"
        },
        confirmButton: {
            backgroundColor: E.colors.secondary,
            color: E.colors.secondary,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: E.colors.secondary,
            textAlign: "center"
        },
        listitem: {
            width: .32 * T.default.window.width,
            height: "auto",
            paddingTop: 5,
            padding: 3
        },
        item: {
            width: "98%",
            marginTop: 5
        },
        itemCategory: {
            position: "absolute",
            top: 10,
            right: 10,
            padding: 3,
            backgroundColor: E.colors.secondary,
            borderRadius: 4,
            zIndex: 99
        },
        itemCategoryText: {
            color: "white",
            fontSize: 12
        },
        itemImage: {
            marginTop: 5,
            width: "100%",
            height: 160,
            borderRadius: 5
        },
        itemContent: {},
        comicName: {
            fontSize: 13
        },
        author: {
            marginTop: 7,
            marginBottom: 7,
            fontSize: 12,
            color: "#7F7F7F"
        },
        comicNameDark: {
            fontSize: 13,
            color: E.colors.textPrimaryDark
        }
    });
}, 1424, [ 1, 440, 155, 156, 157, 159, 162, 55, 2, 825, 410, 827, 1425, 1426, 650, 651, 729, 1427, 718, 810, 648, 1429, 2164 ]);
