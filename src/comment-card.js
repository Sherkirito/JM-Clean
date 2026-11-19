__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0;
    var o = t(r(d[1])), n = t(r(d[2])), l = t(r(d[3])), c = t(r(d[4])), s = t(r(d[5])), u = L(r(d[6])), f = r(d[7]), p = t(r(d[8])), h = t(r(d[9])), y = r(d[10]), v = L(r(d[11])), b = L(r(d[12])), k = r(d[13]), w = r(d[14]), x = t(r(d[15])), E = r(d[16]), T = t(r(d[17]));
    function D(_0x59b192) {
        if ("function" != typeof WeakMap) return null;
        var _0x15c3d1 = new WeakMap, _0x29725d = new WeakMap;
        return (D = function(_0x470cc4) {
            return _0x470cc4 ? _0x29725d : _0x15c3d1;
        })(_0x59b192);
    }
    function L(_0x1df992, _0xd3e8bf) {
        for (var _0x339ecf = "4|3|5|2|1|6|0".split("|"), _0x7a5756 = 0; ;) {
            switch (_0x339ecf[_0x7a5756++]) {
              case "0":
                return _0x10288b.default = _0x1df992, _0x2c089b && _0x2c089b.set(_0x1df992, _0x10288b), 
                _0x10288b;

              case "1":
                var _0x10288b = {}, _0x1a40ba = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;

              case "2":
                if (_0x2c089b && _0x2c089b.has(_0x1df992)) return _0x2c089b.get(_0x1df992);
                continue;

              case "3":
                if (null === _0x1df992 || "object" != typeof _0x1df992 && "function" != typeof _0x1df992) return {
                    default: _0x1df992
                };
                continue;

              case "4":
                if (!_0xd3e8bf && _0x1df992 && _0x1df992.__esModule) return _0x1df992;
                continue;

              case "5":
                var _0x2c089b = D(_0xd3e8bf);
                continue;

              case "6":
                for (var _0x2aa1f8 in _0x1df992) if ("default" !== _0x2aa1f8 && Object.prototype.hasOwnProperty.call(_0x1df992, _0x2aa1f8)) {
                    var _0x49b228 = _0x1a40ba ? Object.getOwnPropertyDescriptor(_0x1df992, _0x2aa1f8) : null;
                    _0x49b228 && (_0x49b228.get || _0x49b228.set) ? Object.defineProperty(_0x10288b, _0x2aa1f8, _0x49b228) : _0x10288b[_0x2aa1f8] = _0x1df992[_0x2aa1f8];
                }
                continue;
            }
            break;
        }
    }
    var V = function(_0x4a80fa) {
        (0, l.default)(_0x2a62e7, _0x4a80fa);
        var _0x3a7d86, _0x2c550f, _0x2fd03e = (_0x3a7d86 = _0x2a62e7, _0x2c550f = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0x1d0729) {
                return !1;
            }
        }(), function() {
            var _0x1b8102, _0x8d638a = (0, s.default)(_0x3a7d86);
            if (_0x2c550f) {
                var _0x13de8e = (0, s.default)(this).constructor;
                _0x1b8102 = Reflect.construct(_0x8d638a, arguments, _0x13de8e);
            } else _0x1b8102 = _0x8d638a.apply(this, arguments);
            return (0, c.default)(this, _0x1b8102);
        });
        function _0x2a62e7() {
            for (var _0x2098da = "3|2|0|1|4".split("|"), _0x2f4a39 = 0; ;) {
                switch (_0x2098da[_0x2f4a39++]) {
                  case "0":
                    (0, o.default)(this, _0x2a62e7);
                    continue;

                  case "1":
                    for (var _0x4cb258 = arguments.length, _0x128e17 = new Array(_0x4cb258), _0x33527e = 0; _0x33527e < _0x4cb258; _0x33527e++) _0x128e17[_0x33527e] = arguments[_0x33527e];
                    continue;

                  case "2":
                    var _0x1559bf, _0x4d0578, _0x2823c6;
                    continue;

                  case "3":
                    continue;

                  case "4":
                    return (_0x2823c6 = _0x2fd03e.call.apply(_0x2fd03e, [ this ].concat(_0x128e17))).state = {
                        voteLoading: !1,
                        isLiked: null != (_0x1559bf = _0x2823c6.props.item.liked) && _0x1559bf,
                        likeCount: null != (_0x4d0578 = _0x2823c6.props.item.likes) ? _0x4d0578 : 0,
                        isVisible: !1,
                        spoiled: _0x2823c6.props.item.spoiler
                    }, _0x2823c6.votingComment = function() {
                        var _0x58165b = _0x2823c6.props, _0x17875f = _0x58165b.vote, _0x14ce89 = _0x58165b.item;
                        _0x2823c6.setState({
                            voteLoading: !0
                        }, function() {
                            _0x17875f(b.API_COMMENT_VOTE, {
                                c_id: _0x14ce89.CID
                            }, !0);
                        });
                    }, _0x2823c6;
                }
                break;
            }
        }
        return (0, n.default)(_0x2a62e7, [ {
            key: "componentDidUpdate",
            value: function(_0x45a356, _0x23950e) {
                if (!0 === _0x45a356.Forum.isVoteLoading && !1 === this.props.Forum.isVoteLoading && !0 === this.state.voteLoading) {
                    const result=this.props.Forum.voteData || {}, data=result.data || {};
                    const ok=Number(result.code)===200 && typeof result.data==='object' && result.data!==null;
                    var _0x93eb1d = ok ? data.msg || "已点赞" : result.errorMsg || "点赞失败，请重试", _0xc530de = ok ? "success" : "danger", _0x8304a6 = {
                        duration: 3e3,
                        style: {
                            padding: 0,
                            zIndex: 9999
                        },
                        textStyle: {
                            fontSize: 16
                        },
                        type: _0xc530de
                    }, _0x5064f6 = {
                        voteLoading: !1,
                        isLiked: ok || this.state.isLiked
                    };
                    if(ok && String(data.status)==="1")_0x5064f6.likeCount=(parseInt(this.state.likeCount,10)||0)+1;
                    this.setState(_0x5064f6);
                    if(g.toastTop)g.toastTop.show(String(_0x93eb1d), _0x8304a6);
                }
            }
        }, {
            key: "render",
            value: function() {
                var _0x3cb7ec = this, _0x3e7625 = this.props, _0x24190f = _0x3e7625.item, _0x24e0dd = _0x3e7625.isReply, _0x2c0506 = _0x3e7625.hideAvatar, _0x3fa479 = _0x3e7625.avatarBasePath, _0x1b54fc = _0x3e7625.Setting, _0x5329c9 = this.state, _0x28ef70 = _0x5329c9.isVisible, _0x3f61d2 = _0x5329c9.active, _0x2de5ec = "1" === g.darkMode ? y.colors.textPrimaryDark : "black", _0x551306 = {
                    img: {
                        height: "auto"
                    },
                    p: {
                        color: "" + _0x2de5ec
                    },
                    span: {
                        color: "" + _0x2de5ec
                    },
                    body: {
                        backgroundColor: "" + ("1" === g.darkMode ? y.colors.backgroundDark : "white")
                    }
                };
                const experience=_0x24190f.expinfo || {};
                const badges=Array.isArray(experience.badges)?experience.badges.filter(badge=>badge && typeof badge.content==="string").slice(0,5):[];
                return u.default.createElement(f.View, {
                    style: [ R.container, "1" === g.darkMode ? {
                        backgroundColor: y.colors.backgroundDark
                    } : {} ]
                }, u.default.createElement(f.View, {
                    style: {
                        flexDirection: "row"
                    }
                }, _0x2c0506 && !0 === _0x2c0506 ? u.default.createElement(u.default.Fragment, null) : u.default.createElement(f.View, {
                    style: {
                        marginRight: 10
                    }
                }, u.default.createElement(f.Image, {
                    style: _0x24e0dd ? R.replyAvatar : R.avatar,
                    source: {
                        uri: _0x3fa479 + _0x24190f.photo
                    }
                }), u.default.createElement(f.Text, {
                    style: R.blockHeaderLevel
                }, experience.level==null?"":"Lv."+String(experience.level))), u.default.createElement(f.View, {
                    style: R.block
                }, u.default.createElement(f.View, {
                    style: R.blockHeader
                }, u.default.createElement(f.View, {
                    style: R.blockHeaderInfo
                }, u.default.createElement(f.View, {
                    style: {
                        flexDirection: "row",
                        marginBottom: 5
                    }
                }, u.default.createElement(f.Text, {
                    jmVerbatim: true, style: R.blockHeaderUsername
                }, _0x24190f.username), u.default.createElement(f.Text, {
                    style: R.blockHeaderTitle
                }, experience.level_name?" · "+String(experience.level_name):"")), u.default.createElement(f.View, {
                    style: {
                        width: "100%",
                        flexDirection: "row",
                        marginBottom: 5,
                        alignItems: "center"
                    }
                }, u.default.createElement(f.View, {
                    style: {
                        flexDirection: "row",
                        marginRight: "auto"
                    }
                }, badges.map(function(_0x21776e, _0x45eb42) {
                    return u.default.createElement(f.View, {
                        key: _0x45eb42,
                        style: {
                            position: "relative"
                        }
                    }, u.default.createElement(f.TouchableWithoutFeedback, {
                        onPress: function() {
                            _0x3cb7ec.setState({
                                isVisible: !0,
                                active: _0x21776e.id
                            });
                        }
                    }, u.default.createElement(h.default, {
                        source: {
                            uri: _0x1b54fc.info.img_host + _0x21776e.content
                        },
                        style: {
                            width: 25,
                            height: 25,
                            alignSelf: "center",
                            marginRight: 10
                        }
                    })), u.default.createElement(f.View, {
                        style: {
                            position: "absolute",
                            left: 26,
                            top: 26
                        }
                    }, _0x28ef70 && _0x3f61d2 === _0x21776e.id && u.default.createElement(f.Text, {
                        style: {
                            width: "100%",
                            paddingHorizontal: 7,
                            fontSize: 14,
                            height: 25,
                            color: "white",
                            borderWidth: 1,
                            borderColor: "black",
                            borderRadius: 7,
                            borderTopLeftRadius: 0,
                            backgroundColor: "#232323",
                            overflow: "hidden",
                            fontWeight: "bold"
                        }
                    }, _0x21776e.name)));
                })), u.default.createElement(f.Text, {
                    style: {
                        color: "#777",
                        marginLeft: "auto",
                        fontSize: 12,
                        fontWeight: "bold"
                    }
                }, _0x24190f.addtime), u.default.createElement(r(d[18]).Actions, {
                    item: _0x24190f
                })))), "1" === this.state.spoiled && u.default.createElement(T.default, {
                    source: {
                        html: "<span>" + _0x24190f.content + "</span>"
                    },
                    contentWidth: x.default.window.width,
                    tagsStyles: _0x551306
                }), "2" === this.state.spoiled && u.default.createElement(f.Text, {
                    style: [ R.blockContent, "1" === g.darkMode ? {
                        color: y.colors.primary
                    } : {} ]
                }, (0, E.lang)("此篇評論有劇透")), u.default.createElement(f.View, {
                    style: {
                        flexDirection: "row",
                        marginTop: 10
                    }
                }, "2" === this.state.spoiled && u.default.createElement(f.Text, {
                    style: {
                        zIndex: 0,
                        color: y.colors.secondary
                    },
                    onPress: function() {
                        _0x3cb7ec.setState({
                            spoiled: "1"
                        });
                    }
                }, (0, E.lang)("我還是想看")), "1" === this.state.spoiled && u.default.createElement(f.TouchableOpacity, {
                    onPress: this.votingComment
                }, u.default.createElement(f.View, {
                    style: {
                        flexDirection: "row",
                        top: 4
                    }
                }, this.state.isLiked ? u.default.createElement(p.default, {
                    name: "heart",
                    solid: !0,
                    color: "red"
                }) : u.default.createElement(p.default, {
                    name: "heart",
                    solid: !0,
                    color: y.colors.secondary
                }), u.default.createElement(f.Text, {
                    style: {
                        color: this.state.voteLoading ? y.colors.primary : "#6d6d6d",
                        paddingLeft: 5,
                        position: "relative",
                        top: -4,
                        marginRight: "auto"
                    }
                }, this.state.likeCount), this.state.voteLoading && u.default.createElement(f.ActivityIndicator, {
                    size: "small",
                    color: y.colors.secondary
                }))), "" !== _0x24190f.name && _0x24190f.name && u.default.createElement(f.TouchableOpacity, {
                    style: {
                        marginLeft: "auto",
                        maxWidth: .5 * x.default.window.width
                    },
                    onPress: function() {
                        return v.navigate("Detail", {
                            id: _0x24190f.AID
                        });
                    }
                }, u.default.createElement(f.Text, {
                    style: R.comicTitle,
                    numberOfLines: 1
                }, _0x24190f.name))))));
            }
        } ]), _0x2a62e7;
    }(u.Component), C = (0, k.connect)(function(_0x17044c) {
        var _0xb8e351 = _0x17044c.Setting;
        return {
            Forum: _0x17044c.Forum,
            Setting: _0xb8e351
        };
    }, {
        vote: w.vote
    })(V);
    e.default = C;
    var R = f.StyleSheet.create({
        container: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 15,
            paddingRight: 5,
            backgroundColor: "white"
        },
        comicTitle: {
            fontSize: 12,
            paddingRight: 10,
            color: "#7F7F7F",
            textAlign: "right"
        },
        replyAvatar: {
            width: 30,
            height: 30,
            borderRadius: 30,
            marginRight: 10,
            marginTop: 10,
            marginLeft: 30,
            position: "relative",
            top: -10
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 50,
            marginTop: 10,
            position: "relative",
            backgroundColor: "white",
            top: -10
        },
        block: {
            flex: 1,
            flexDirection: "column"
        },
        blockHeader: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 10,
            zIndex: 10
        },
        blockHeaderInfo: {
            flexDirection: "column"
        },
        blockHeaderUsername: {
            fontSize: 13,
            color: y.colors.secondary,
            fontWeight: "bold"
        },
        blockHeaderTitle: {
            fontSize: 13,
            color: "#777"
        },
        blockHeaderLevel: {
            fontSize: 13,
            textAlign: "center",
            color: "#777"
        },
        blockHeaderDate: {
            fontSize: 13,
            color: "#7F7F7F"
        },
        blockContent: {
            fontSize: 13,
            color: "#000",
            marginTop: 5,
            zIndex: 0
        }
    });
}, 1654, [ 1, 155, 156, 157, 159, 162, 55, 2, 810, 730, 729, 825, 650, 410, 1655, 718, 651, 852, 2171 ]);
