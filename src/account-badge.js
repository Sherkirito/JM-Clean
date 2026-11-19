__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0;
    var n = t(r(d[1])), l = t(r(d[2])), o = t(r(d[3])), c = t(r(d[4])), u = t(r(d[5])), s = t(r(d[6])), f = B(r(d[7])), h = r(d[8]), y = r(d[9]), p = t(r(d[10])), x = r(d[11]), E = t(r(d[12])), b = t(r(d[13])), w = t(r(d[14])), T = r(d[15]), I = B(r(d[16])), C = r(d[17]), V = t(r(d[18])), v = t(r(d[19])), P = B(r(d[20]));
    function z(_0x2ee96a) {
        if ("function" != typeof WeakMap) return null;
        var _0x446056 = new WeakMap, _0x2a3fbc = new WeakMap;
        return (z = function(_0x1ae21c) {
            return _0x1ae21c ? _0x2a3fbc : _0x446056;
        })(_0x2ee96a);
    }
    function B(_0x422f11, _0x5abb14) {
        for (var _0x261912 = "6|3|0|1|2|4|5".split("|"), _0x1d4a56 = 0; ;) {
            switch (_0x261912[_0x1d4a56++]) {
              case "0":
                var _0x577fe5 = z(_0x5abb14);
                continue;

              case "1":
                if (_0x577fe5 && _0x577fe5.has(_0x422f11)) return _0x577fe5.get(_0x422f11);
                continue;

              case "2":
                var _0x42aa51 = {}, _0x3a0772 = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;

              case "3":
                if (null === _0x422f11 || "object" != typeof _0x422f11 && "function" != typeof _0x422f11) return {
                    default: _0x422f11
                };
                continue;

              case "4":
                for (var _0x45f24b in _0x422f11) if ("default" !== _0x45f24b && Object.prototype.hasOwnProperty.call(_0x422f11, _0x45f24b)) {
                    var _0x367b66 = _0x3a0772 ? Object.getOwnPropertyDescriptor(_0x422f11, _0x45f24b) : null;
                    _0x367b66 && (_0x367b66.get || _0x367b66.set) ? Object.defineProperty(_0x42aa51, _0x45f24b, _0x367b66) : _0x42aa51[_0x45f24b] = _0x422f11[_0x45f24b];
                }
                continue;

              case "5":
                return _0x42aa51.default = _0x422f11, _0x577fe5 && _0x577fe5.set(_0x422f11, _0x42aa51), 
                _0x42aa51;

              case "6":
                if (!_0x5abb14 && _0x422f11 && _0x422f11.__esModule) return _0x422f11;
                continue;
            }
            break;
        }
    }
    var S = function(_0x56e8a5) {
        (0, c.default)(_0x464264, _0x56e8a5);
        var _0x12e405, _0x476625, _0xc9a14b = (_0x12e405 = _0x464264, _0x476625 = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0x334717) {
                return !1;
            }
        }(), function() {
            var _0x222ac5, _0x1a918c = (0, s.default)(_0x12e405);
            if (_0x476625) {
                var _0x444019 = (0, s.default)(this).constructor;
                _0x222ac5 = Reflect.construct(_0x1a918c, arguments, _0x444019);
            } else _0x222ac5 = _0x1a918c.apply(this, arguments);
            return (0, u.default)(this, _0x222ac5);
        });
        function _0x464264() {
            for (var _0xbbe9a7 = "3|2|1|0|4".split("|"), _0x2be93b = 0; ;) {
                switch (_0xbbe9a7[_0x2be93b++]) {
                  case "0":
                    for (var _0x1b2f97 = arguments.length, _0x1064e4 = new Array(_0x1b2f97), _0x12b601 = 0; _0x12b601 < _0x1b2f97; _0x12b601++) _0x1064e4[_0x12b601] = arguments[_0x12b601];
                    continue;

                  case "1":
                    (0, l.default)(this, _0x464264);
                    continue;

                  case "2":
                    var _0xe950f6;
                    continue;

                  case "3":
                    continue;

                  case "4":
                    return (_0xe950f6 = _0xc9a14b.call.apply(_0xc9a14b, [ this ].concat(_0x1064e4))).state = {
                        modalVisible: !1,
                        currentModal: 0
                    }, _0xe950f6.toggleModal = function(_0x33fd19) {
                        _0xe950f6.setState(function(_0x149999) {
                            return {
                                modalVisible: !_0x149999.modalVisible,
                                currentModal: void 0 !== _0x33fd19 ? _0x33fd19 : _0x149999.currentModal
                            };
                        });
                    }, _0xe950f6.onPressCopy = function() {
                        var _0xa3cf44, _0x5bd3a3 = _0xe950f6.props.Member;
                        h.Clipboard.setString(null == (_0xa3cf44 = _0x5bd3a3.memberInfo) ? void 0 : _0xa3cf44.invitation_url), 
                        _0xe950f6.toast.show("已複製到剪貼板", {
                            duration: 1e3,
                            type: "normal"
                        });
                    }, _0xe950f6.getNextQuarter = function() {
                        var _0x5d2bd0 = (new Date).getMonth() + 1;
                        return [ "1月", "4月", "7月", "10月" ][(Math.floor((_0x5d2bd0 - 1) / 3) + 1) % 4] + "重新計算";
                    }, _0xe950f6.renderHeader = function(_0x553054, _0x548653, _0x3fe1a7) {
                        return f.default.createElement(h.View, {
                            style: j.headContainer
                        }, _0x553054.title(), f.default.createElement(b.default, {
                            name: _0x3fe1a7 ? "angle-up" : "angle-down",
                            size: 16,
                            color: "white"
                        }));
                    }, _0xe950f6.renderBody = function(_0x4baeec) {
                        return f.default.createElement(h.View, {
                            style: j.body
                        }, f.default.createElement(h.Text, {
                            style: j.bodyText
                        }, _0x4baeec.body));
                    }, _0xe950f6.coinBuyCharge = function() {
                        v.default.fetchPost(P.API_COIN_BUY_CHARGE, {}, function(_0xf5b8c6) {
                            var _0x1e1c57 = _0xf5b8c6.data.msg, _0x466778 = {
                                duration: 3e3,
                                style: {
                                    padding: 0,
                                    zIndex: 9999
                                },
                                textStyle: {
                                    fontSize: 16
                                },
                                type: "fail" === _0xf5b8c6.data.status ? "danger" : "success"
                            };
                            "fail" === _0xf5b8c6.data.status && _0xe950f6.toast.show(_0x1e1c57, _0x466778), 
                            "ok" === _0xf5b8c6.data.status && (_0xe950f6.toggleModal(), g.toastTop.show(_0x1e1c57, _0x466778), 
                            setTimeout(function() {
                                return _0xe950f6.props.refreshData();
                            }, 1e3));
                        });
                    }, _0xe950f6;
                }
                break;
            }
        }
        return (0, o.default)(_0x464264, [ {
            key: "render",
            value: function() {
                var _0x23c586 = this, _0x35b6cc = [ {
                    id: 1,
                    title: function() {
                        return f.default.createElement(h.View, {
                            style: {
                                flexDirection: "row",
                                alignItems: "center"
                            }
                        }, f.default.createElement(h.Text, {
                            style: j.headText
                        }, (0, x.lang)("什麼是J罐")), f.default.createElement(E.default, {
                            source: r(d[21]),
                            style: j.headJarIcon
                        }), f.default.createElement(h.Text, {
                            style: j.headText
                        }, (0, x.lang)("?什麼是充能")), f.default.createElement(E.default, {
                            source: r(d[22]),
                            style: j.headChargeIcon
                        }), f.default.createElement(h.Text, {
                            style: j.headText
                        }, (0, x.lang)("?")));
                    },
                    body: (0, x.lang)("J罐是一種禁漫天堂專屬的能源道具，只要將J罐充能至滿後使用就能長時間隱蔽站內所有廣告")
                }, {
                    id: 2,
                    title: function() {
                        return f.default.createElement(h.View, {
                            style: {
                                flexDirection: "row",
                                alignItems: "center"
                            }
                        }, f.default.createElement(h.Text, {
                            style: j.headText
                        }, (0, x.lang)("如何賺取J罐")), f.default.createElement(E.default, {
                            source: r(d[21]),
                            style: j.headJarIcon
                        }), f.default.createElement(h.Text, {
                            style: j.headText
                        }, (0, x.lang)("or充能")), f.default.createElement(E.default, {
                            source: r(d[22]),
                            style: j.headChargeIcon
                        }), f.default.createElement(h.Text, {
                            style: j.headText
                        }, (0, x.lang)("?")));
                    },
                    body: (0, x.lang)("能量能藉由完成站內任務獲得後進行充能")
                }, {
                    id: 3,
                    title: function() {
                        return f.default.createElement(h.Text, {
                            style: j.headText
                        }, (0, x.lang)("未到期再兌換是否累加?"));
                    },
                    body: (0, x.lang)("未到期的能量都可以進行累加，但一旦到期便作廢，請注意使用期限")
                }, {
                    id: 4,
                    title: function() {
                        return f.default.createElement(h.Text, {
                            style: j.headText
                        }, (0, x.lang)("APP和網頁是否需要分開兌換?"));
                    },
                    body: (0, x.lang)("APP和網頁可以合併使用喔")
                } ], _0x13a9cb = this.props, _0x26ca4a = _0x13a9cb.Setting, _0x2d6cd1 = _0x13a9cb.Member, _0x10d7a8 = _0x13a9cb.isRefreshing, _0x2c5cb7 = this.state, _0x119009 = _0x2c5cb7.modalVisible, _0xdf56cb = _0x2c5cb7.currentModal, _0x570362 = _0x2d6cd1.isLogin, _0x38d7f5 = _0x2d6cd1.memberInfo, _0x4e99b3 = null == _0x38d7f5 ? void 0 : _0x38d7f5.ad_free, _0x293a42 = null == _0x38d7f5 ? void 0 : _0x38d7f5.ad_free_before, _0x5cab5e = null == _0x38d7f5 ? void 0 : _0x38d7f5.jar, _0x392e49 = null == _0x38d7f5 ? void 0 : _0x38d7f5.charge, _0x213d8e = null == _0x38d7f5 ? void 0 : _0x38d7f5.invitation_qrcode, _0xb4170d = null == _0x38d7f5 ? void 0 : _0x38d7f5.invitation_url, _0x4c825d = null == _0x38d7f5 ? void 0 : _0x38d7f5.invited_cnt;
                return f.default.createElement(h.View, null, f.default.createElement(h.View, {
                    style: j.headerPerson
                }, f.default.createElement(p.default, null), _0x570362 && f.default.createElement(h.View, {
                    style: j.headerPersonRow
                }, f.default.createElement(h.TouchableOpacity, {
                    onPress: function() {
                        _0x23c586.toggleModal(2);
                    }
                }, f.default.createElement(h.Image, {
                    source: {
                        uri: _0x26ca4a.info.img_host + "/media/users/" + _0x38d7f5.photo
                    },
                    style: j.headerPersonRowAvatar,
                    resizeMode: "cover"
                }), f.default.createElement(h.View, {
                    style: {
                        position: "absolute",
                        right: 0,
                        bottom: 20
                    }
                }, f.default.createElement(b.default, {
                    name: "qrcode",
                    size: 20,
                    color: "white"
                }))), f.default.createElement(h.View, null, f.default.createElement(h.View, {
                    style: j.memberInfoContainer
                }, f.default.createElement(h.Text, {
                    style: j.memberInfoText
                }, "你好！"), f.default.createElement(h.Text, {
                    style: [ j.memberInfoText, j.boldText ],
                    jmVerbatim: !0
                }, _0x38d7f5.username + " · "), f.default.createElement(h.Text, {
                    style: [ j.memberInfoText, j.secondaryText ]
                }, _0x38d7f5.level_name)), f.default.createElement(h.View, {
                    style: j.badgesContainer
                }, _0x2d6cd1.memberInfo.badges && _0x2d6cd1.memberInfo.badges.map(function(_0x1570fc, _0x5be227) {
                    return f.default.createElement(E.default, {
                        key: _0x5be227,
                        source: {
                            uri: _0x26ca4a.info.img_host + _0x1570fc.content
                        },
                        style: j.badge
                    });
                })), f.default.createElement(h.View, {
                    style: j.statusContainer
                }, f.default.createElement(h.Text, {
                    style: [ j.memberInfoText, j.boldText ]
                }, (0, x.lang)("狀態：")), f.default.createElement(h.Text, {
                    style: [ j.memberInfoText, j.secondaryText, j.boldText ]
                }, _0x4e99b3 ? (0, x.lang)("超級JM人") : (0, x.lang)("普通JM人")), f.default.createElement(h.View, {
                    style: [ j.statusTimeContainer, !_0x4e99b3 && {
                        backgroundColor: "none"
                    } ]
                }, f.default.createElement(h.Text, {
                    style: j.statusTimeText
                }, _0x4e99b3 ? _0x293a42 : "")))))), f.default.createElement(h.View, {
                    style: j.headerInfoContainer
                }, f.default.createElement(h.View, {
                    style: j.headerInfo
                }, f.default.createElement(h.View, {
                    style: [ j.headerInfoItem, {
                        flex: 2
                    } ]
                }, f.default.createElement(h.Text, {
                    style: j.headerInfoItemContent
                }, (0, x.lang)("經驗值")), f.default.createElement(h.Text, {
                    style: j.headerInfoItemTitle
                }, !_0x570362 || _0x10d7a8 ? "----" : _0x38d7f5.exp + "/" + _0x38d7f5.nextLevelExp)), f.default.createElement(h.View, {
                    style: [ j.headerInfoItem, {
                        flex: 1
                    } ]
                }, f.default.createElement(h.Text, {
                    style: j.headerInfoItemContent
                }, (0, x.lang)("LV")), f.default.createElement(h.Text, {
                    style: j.headerInfoItemTitle
                }, !_0x570362 || _0x10d7a8 ? "----" : _0x38d7f5.level)), f.default.createElement(h.View, {
                    style: [ j.headerInfoItem, {
                        flex: 1
                    } ]
                }, f.default.createElement(h.Text, {
                    style: j.headerInfoItemContent
                }, (0, x.lang)("J Coins")), f.default.createElement(h.Text, {
                    style: j.headerInfoItemTitle
                }, !_0x570362 || _0x10d7a8 ? "----" : _0x38d7f5.coin)), f.default.createElement(h.View, {
                    style: [ j.headerInfoItem, {
                        flex: 2
                    } ]
                }, f.default.createElement(h.Text, {
                    style: j.headerInfoItemContent
                }, (0, x.lang)("可收藏數量")), f.default.createElement(h.Text, {
                    style: j.headerInfoItemTitle
                }, !_0x570362 || _0x10d7a8 ? "----" : _0x38d7f5.album_favorites + "/" + _0x38d7f5.album_favorites_max))), f.default.createElement(h.View, {
                    style: j.headerInfo
                }, f.default.createElement(h.View, {
                    style: j.chargeAndJarWrapper
                }, function() {
                    var _0x437390 = 0;
                    if (_0x392e49 && "string" == typeof _0x392e49) {
                        var _0x62bfbe = _0x392e49.split("/").map(Number), _0x1c024a = (0, n.default)(_0x62bfbe, 2);
                        _0x437390 = _0x1c024a[0] / _0x1c024a[1] * 100;
                    }
                    var _0x326e85 = _0x437390.toFixed(2) + "%";
                    return f.default.createElement(h.View, {
                        style: j.chargeProgressContainer
                    }, f.default.createElement(h.Text, {
                        style: j.chargeInfoText
                    }, (0, x.lang)("充能")), f.default.createElement(h.View, {
                        style: j.chargeProgressInnerContainer
                    }, f.default.createElement(h.Text, {
                        style: j.chargeProgressText
                    }, !_0x570362 || _0x10d7a8 ? (0, x.lang)("????") : _0x392e49), f.default.createElement(h.View, {
                        style: j.chargeProgressIconContainer
                    }, f.default.createElement(E.default, {
                        style: j.chargeProgressIcon,
                        source: r(d[22])
                    })), f.default.createElement(h.View, {
                        style: j.chargeProgressBarWrapper
                    }, f.default.createElement(h.View, {
                        style: j.chargeProgressBarBackground
                    }, f.default.createElement(h.View, {
                        style: {
                            width: "100%",
                            backgroundColor: "white",
                            height: 12,
                            borderRadius: 16
                        }
                    }, f.default.createElement(h.View, {
                        style: [ j.chargeProgressBar, {
                            width: _0x326e85
                        } ]
                    }))))));
                }(), f.default.createElement(h.View, {
                    style: j.jarInfoContainer
                }, f.default.createElement(h.Text, {
                    style: j.chargeInfoText
                }, (0, x.lang)("J罐")), f.default.createElement(h.View, {
                    style: j.jarIconContainer
                }, f.default.createElement(E.default, {
                    style: j.jarIcon,
                    source: r(d[21])
                }), f.default.createElement(h.Text, {
                    style: j.jarInfoCount
                }, !_0x570362 || _0x10d7a8 ? (0, x.lang)("??/??") : _0x5cab5e))))), f.default.createElement(h.View, {
                    style: j.headerInfo
                }, f.default.createElement(h.View, {
                    style: j.actionButtonWrapper
                }, f.default.createElement(h.TouchableOpacity, {
                    disabled: !_0x570362 || _0x10d7a8,
                    onPress: function() {
                        return _0x23c586.toggleModal(0);
                    },
                    style: j.actionButton
                }, f.default.createElement(h.Text, {
                    style: j.actionButtonText
                }, (0, x.lang)("兌換充能"))), f.default.createElement(h.TouchableOpacity, {
                    disabled: !_0x570362 || _0x10d7a8,
                    onPress: function() {
                        return I.navigate("RedeemJCharge");
                    },
                    style: j.actionButton
                }, f.default.createElement(h.Text, {
                    style: j.actionButtonText
                }, (0, x.lang)("開啟無敵")))), f.default.createElement(h.View, {
                    style: j.helpButtonWrapper
                }, f.default.createElement(h.TouchableOpacity, {
                    style: j.helpButton,
                    onPress: function() {
                        return _0x23c586.toggleModal(1);
                    }
                }, f.default.createElement(b.default, {
                    name: "question-circle",
                    size: 16,
                    color: y.colors.secondary
                }), f.default.createElement(h.Text, {
                    style: j.helpButtonText
                }, (0, x.lang)("充能和J罐?")))))), f.default.createElement(w.default, {
                    animationType: "slide",
                    isVisible: _0x119009,onBackButtonPress:()=>_0x23c586.toggleModal()
                }, f.default.createElement(V.default, {
                    ref: function(_0x1dc8ca) {
                        return _0x23c586.toast = _0x1dc8ca;
                    },
                    placement: "top"
                }), 2 === _0xdf56cb && f.default.createElement(h.View, {
                    style: {
                        padding: 40,
                        paddingBottom: 5,
                        backgroundColor: "white",
                        margin: 20
                    }
                }, f.default.createElement(h.TouchableOpacity, {
                    onPress: function() {
                        return _0x23c586.toggleModal();
                    },
                    style: j.modalCloseButton
                }, f.default.createElement(b.default, {
                    name: "times",
                    size: 16,
                    color: y.colors.tertiary
                })), f.default.createElement(h.Text, {
                    style: {
                        fontSize: 20,
                        fontWeight: "bold",
                        alignSelf: "center"
                    },
                    jmVerbatim: !0
                }, _0x38d7f5.username), f.default.createElement(h.Text, {
                    style: {
                        fontSize: 18,
                        fontWeight: "bold",
                        alignSelf: "center"
                    }
                }, (0, x.lang)("邀請碼")), f.default.createElement(E.default, {
                    source: {
                        uri: _0x213d8e
                    },
                    style: {
                        width: 120,
                        height: 120,
                        marginBottom: 10,
                        alignSelf: "center"
                    }
                }), f.default.createElement(h.Text, {
                    style: {
                        fontSize: 14
                    }
                }, (0, x.lang)("邀請連結：")), f.default.createElement(h.View, {
                    style: {
                        flexDirection: "row"
                    }
                }, f.default.createElement(h.View, {
                    style: {
                        backgroundColor: y.colors.main,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        flex: 1,
                        borderTopLeftRadius: 3,
                        borderBottomLeftRadius: 3
                    }
                }, f.default.createElement(h.Text, {
                    style: {
                        fontSize: 12,
                        color: "white"
                    }
                }, _0xb4170d)), f.default.createElement(h.TouchableOpacity, {
                    onPress: this.onPressCopy,
                    style: {
                        backgroundColor: y.colors.secondary,
                        padding: 5,
                        borderTopRightRadius: 3,
                        borderBottomRightRadius: 3,
                        justifyContent: "center"
                    }
                }, f.default.createElement(h.Text, {
                    style: {
                        fontSize: 12,
                        color: "white"
                    }
                }, (0, x.lang)("複製")))), f.default.createElement(h.Text, {
                    style: {
                        fontSize: 12,
                        color: y.colors.secondary,
                        alignSelf: "center",
                        marginTop: 3
                    }
                }, "已邀請人數：" + _0x4c825d + "/10"), f.default.createElement(h.Text, {
                    style: {
                        fontSize: 12,
                        color: y.colors.secondary,
                        alignSelf: "center",
                        marginTop: 3
                    }
                }, this.getNextQuarter()), f.default.createElement(h.Text, {
                    style: {
                        fontSize: 14,
                        alignSelf: "center",
                        marginTop: 10
                    }
                }, (0, x.lang)("＊每季重置邀請人數，邀請1人+3充能"))), 1 === _0xdf56cb && f.default.createElement(h.View, {
                    style: {
                        padding: 20,
                        backgroundColor: "white",
                        alignItems: "center"
                    }
                }, f.default.createElement(h.TouchableOpacity, {
                    onPress: function() {
                        return _0x23c586.toggleModal();
                    },
                    style: j.modalCloseButton
                }, f.default.createElement(b.default, {
                    name: "times",
                    size: 16,
                    color: y.colors.tertiary
                })), f.default.createElement(h.Text, {
                    style: j.faqTitle
                }, (0, x.lang)("常見問題")), f.default.createElement(C.AccordionList, {
                    list: _0x35b6cc,
                    header: this.renderHeader,
                    body: this.renderBody,
                    keyExtractor: function(_0x58b3c8) {
                        return "" + _0x58b3c8.id;
                    }
                })), 0 === _0xdf56cb && f.default.createElement(h.View, {
                    style: {
                        paddingTop: 40,
                        paddingBottom: 20,
                        backgroundColor: "white",
                        alignItems: "center"
                    }
                }, f.default.createElement(h.TouchableOpacity, {
                    onPress: function() {
                        return _0x23c586.toggleModal();
                    },
                    style: j.modalCloseButton
                }, f.default.createElement(b.default, {
                    name: "times",
                    size: 16,
                    color: y.colors.tertiary
                })), f.default.createElement(h.View, {
                    style: {
                        flexDirection: "row",
                        alignItems: "center"
                    }
                }, f.default.createElement(E.default, {
                    source: r(d[23]),
                    style: {
                        width: 30,
                        height: 30,
                        marginRight: 10
                    }
                }), f.default.createElement(h.Text, {
                    style: {
                        fontSize: 26,
                        marginRight: 5,
                        fontWeight: "bold"
                    }
                }, (0, x.lang)("10,000")), f.default.createElement(h.Text, null, (0, x.lang)("JCoin"))), f.default.createElement(E.default, {
                    source: r(d[24]),
                    style: {
                        width: 30,
                        height: 30,
                        margin: 15
                    }
                }), f.default.createElement(h.View, {
                    style: {
                        flexDirection: "row",
                        alignItems: "center"
                    }
                }, f.default.createElement(E.default, {
                    source: r(d[22]),
                    style: {
                        width: 18,
                        height: 30,
                        marginRight: 10
                    }
                }), f.default.createElement(h.Text, {
                    style: {
                        fontSize: 26,
                        marginRight: 5,
                        fontWeight: "bold"
                    }
                }, (0, x.lang)("1")), f.default.createElement(h.Text, null, (0, x.lang)("充能"))), f.default.createElement(T.Divider, {
                    style: {
                        width: "90%",
                        height: 1,
                        marginVertical: 20
                    }
                }), f.default.createElement(h.TouchableOpacity, {
                    style: {
                        paddingVertical: 5,
                        paddingHorizontal: 30,
                        backgroundColor: y.colors.secondary,
                        marginVertical: 5,
                        borderRadius: 50
                    },
                    onPress: this.coinBuyCharge
                }, f.default.createElement(h.Text, {
                    style: {
                        color: "white",
                        fontSize: 26,
                        fontWeight: "bold"
                    }
                }, (0, x.lang)("確認兌換"))))));
            }
        } ]), _0x464264;
    }(f.Component);
    e.default = S;
    var j = h.StyleSheet.create({
        headerPerson: {
            flex: 1,
            flexDirection: "row",
            padding: 15,
            position: "absolute",
            zIndex: 3
        },
        headerPersonRow: {
            flexDirection: "row",
            marginLeft: 10
        },
        headerPersonRowAvatar: {
            width: 60,
            height: 60,
            borderRadius: 40,
            marginTop: 10
        },
        memberInfoContainer: {
            marginLeft: 15,
            flexDirection: "row",
            marginVertical: 5
        },
        memberInfoText: {
            fontSize: 13,
            color: "white"
        },
        boldText: {
            fontWeight: "bold"
        },
        secondaryText: {
            color: y.colors.secondary
        },
        badgesContainer: {
            flexDirection: "row",
            marginRight: "auto",
            marginLeft: 15,
            marginVertical: 5
        },
        badge: {
            width: 25,
            height: 25,
            alignSelf: "center",
            marginRight: 10
        },
        statusContainer: {
            flexDirection: "row",
            marginRight: "auto",
            marginLeft: 15,
            marginVertical: 5,
            alignItems: "center"
        },
        statusTimeContainer: {
            backgroundColor: "#232323",
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 20,
            marginLeft: 10
        },
        statusTimeText: {
            fontSize: 11,
            color: "white",
            fontWeight: "bold"
        },
        headerInfoContainer: {
            top: 100,
            margin: 15,
            backgroundColor: "#232323",
            borderRadius: 7
        },
        headerInfo: {
            flexDirection: "row",
            justifyContent: "space-between"
        },
        headerInfoItem: {
            alignItems: "center",
            justifyContent: "center",
            padding: 10
        },
        headerInfoItemTitle: {
            color: y.colors.secondary,
            fontSize: 12
        },
        headerInfoItemContent: {
            color: "white",
            marginVertical: 3,
            fontSize: 12
        },
        chargeAndJarWrapper: {
            paddingHorizontal: 15,
            paddingVertical: 10,
            width: "100%",
            flexDirection: "row"
        },
        chargeProgressContainer: {
            width: "70%",
            alignItems: "center",
            justifyContent: "center"
        },
        chargeProgressInnerContainer: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
        },
        chargeProgressText: {
            zIndex: 1,
            fontSize: 10
        },
        chargeProgressIconContainer: {
            backgroundColor: "white",
            zIndex: 1,
            position: "absolute",
            left: 0,
            width: 16,
            height: 16,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 16
        },
        chargeProgressIcon: {
            width: 9,
            height: 15
        },
        chargeProgressBarWrapper: {
            width: "100%",
            position: "absolute"
        },
        chargeProgressBarBackground: {
            width: "100%",
            backgroundColor: y.colors.secondary,
            height: 16,
            borderRadius: 16,
            padding: 2
        },
        chargeProgressBar: {
            backgroundColor: y.colors.secondary,
            height: 12,
            borderRadius: 16
        },
        jarInfoContainer: {
            width: "30%",
            alignItems: "center",
            justifyContent: "center"
        },
        chargeInfoText: {
            color: "white",
            marginBottom: 5,
            fontSize: 12
        },
        jarIconContainer: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
        },
        jarIcon: {
            width: 10,
            height: 16
        },
        jarInfoCount: {
            color: y.colors.secondary,
            fontSize: 12,
            marginLeft: 3
        },
        actionButtonWrapper: {
            paddingHorizontal: 15,
            paddingVertical: 10,
            width: "60%",
            flexDirection: "row"
        },
        actionButton: {
            backgroundColor: y.colors.secondary,
            padding: 5,
            borderRadius: 5,
            marginRight: 20,
            alignSelf: "center"
        },
        actionButtonText: {
            fontSize: 12,
            color: "white"
        },
        helpButtonWrapper: {
            paddingHorizontal: 15,
            paddingVertical: 10,
            width: "40%",
            flexDirection: "row"
        },
        helpButton: {
            padding: 5,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "auto"
        },
        helpButtonText: {
            fontSize: 12,
            color: y.colors.secondary
        },
        faqTitle: {
            fontSize: 36,
            color: y.colors.secondary,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10
        },
        headContainer: {
            backgroundColor: y.colors.secondary,
            marginTop: 10,
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
        },
        headChargeIcon: {
            width: 15,
            height: 25
        },
        headJarIcon: {
            width: 21.25,
            height: 25
        },
        headText: {
            fontSize: 18,
            color: "white",
            fontWeight: "bold"
        },
        body: {
            padding: 10,
            borderWidth: 1,
            borderColor: "rgb(187,187,187)"
        },
        bodyText: {
            textAlign: "center"
        },
        modalCloseButton: {
            position: "absolute",
            right: 0,
            top: 0,
            padding: 20
        }
    });
}, 1919, [ 1, 459, 155, 156, 157, 159, 162, 55, 2, 729, 1870, 651, 730, 810, 827, 1920, 825, 2008, 1640, 648, 650, 2014, 2015, 1650, 2016 ]);
