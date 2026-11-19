__d(function(g, r, i, a, m, e, d) {
    var t = r(d[0]);
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = void 0, t(r(d[1]));
    var o = t(r(d[2])), l = t(r(d[3])), u = t(r(d[4])), s = t(r(d[5])), c = t(r(d[6])), f = C(r(d[7])), p = r(d[8]), h = t(r(d[9])), y = t(r(d[10])), w = C(r(d[11])), b = t(r(d[12])), v = r(d[13]), _ = r(d[14]), S = t(r(d[15])), B = t(r(d[16])), x = C(r(d[17]));
    function V(_0x5c043e) {
        if ("function" != typeof WeakMap) return null;
        var _0x396f92 = new WeakMap, _0x3e2680 = new WeakMap;
        return (V = function(_0x1aff3e) {
            return _0x1aff3e ? _0x3e2680 : _0x396f92;
        })(_0x5c043e);
    }
    function C(_0xb753e6, _0x35005b) {
        for (var _0xf51afd = "5|1|4|3|6|2|0".split("|"), _0x31db25 = 0; ;) {
            switch (_0xf51afd[_0x31db25++]) {
              case "0":
                return _0x2f3578.default = _0xb753e6, _0x23d4a1 && _0x23d4a1.set(_0xb753e6, _0x2f3578), 
                _0x2f3578;

              case "1":
                if (null === _0xb753e6 || "object" != typeof _0xb753e6 && "function" != typeof _0xb753e6) return {
                    default: _0xb753e6
                };
                continue;

              case "2":
                for (var _0x4e06c0 in _0xb753e6) if ("default" !== _0x4e06c0 && Object.prototype.hasOwnProperty.call(_0xb753e6, _0x4e06c0)) {
                    var _0x539d59 = _0x5774ff ? Object.getOwnPropertyDescriptor(_0xb753e6, _0x4e06c0) : null;
                    _0x539d59 && (_0x539d59.get || _0x539d59.set) ? Object.defineProperty(_0x2f3578, _0x4e06c0, _0x539d59) : _0x2f3578[_0x4e06c0] = _0xb753e6[_0x4e06c0];
                }
                continue;

              case "3":
                if (_0x23d4a1 && _0x23d4a1.has(_0xb753e6)) return _0x23d4a1.get(_0xb753e6);
                continue;

              case "4":
                var _0x23d4a1 = V(_0x35005b);
                continue;

              case "5":
                if (!_0x35005b && _0xb753e6 && _0xb753e6.__esModule) return _0xb753e6;
                continue;

              case "6":
                var _0x2f3578 = {}, _0x5774ff = Object.defineProperty && Object.getOwnPropertyDescriptor;
                continue;
            }
            break;
        }
    }
    var k = function(_0x1dfeea) {
        (0, u.default)(_0x307838, _0x1dfeea);
        var _0x33f9a0, _0x506c28, _0x538512 = (_0x33f9a0 = _0x307838, _0x506c28 = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), 
                !0;
            } catch (_0x32570b) {
                return !1;
            }
        }(), function() {
            var _0x14a20c, _0x5811e9 = (0, c.default)(_0x33f9a0);
            if (_0x506c28) {
                var _0x2186a1 = (0, c.default)(this).constructor;
                _0x14a20c = Reflect.construct(_0x5811e9, arguments, _0x2186a1);
            } else _0x14a20c = _0x5811e9.apply(this, arguments);
            return (0, s.default)(this, _0x14a20c);
        });
        function _0x307838() {
            var _0x1cd02e;
            (0, o.default)(this, _0x307838);
            for (var _0x41f3ec = arguments.length, _0x1f74d5 = new Array(_0x41f3ec), _0x178ff0 = 0; _0x178ff0 < _0x41f3ec; _0x178ff0++) _0x1f74d5[_0x178ff0] = arguments[_0x178ff0];
            return (_0x1cd02e = _0x538512.call.apply(_0x538512, [ this ].concat(_0x1f74d5))).state = {
                currentStorage: [],
                latestViewId: 0,
                modalVisible: !1
            }, _0x1cd02e.getHistoryData = async function() {
                const data = _0x1cd02e.props.data, id = data && (Number(data.series_id) > 0 ? data.series_id : data.id);
                if (!id) return;
                const rev = (_0x1cd02e.historyRevision || 0) + 1;
                _0x1cd02e.historyRevision = rev;
                try {
                    const values = await p.AsyncStorage.multiGet([ "series_history_" + id, "series_latest_view_" + id ]);
                    let visited = {};
                    try {
                        visited = JSON.parse(values[0][1]) || {};
                    } catch (_) {}
                    _0x1cd02e._isMounted && rev === _0x1cd02e.historyRevision && _0x1cd02e.setState({
                        currentStorage: Array.isArray(visited[0]) ? visited[0] : [],
                        latestViewId: /^[1-9]\d*$/.test(values[1][1])?values[1][1]:_0x1cd02e.props.historyChapter || 0, historyBook:String(id),historyError:false
                    });
                } catch (_) {
                    if(_0x1cd02e._isMounted && rev===_0x1cd02e.historyRevision)_0x1cd02e.setState({historyBook:String(id),historyError:true,latestViewId:0});
                }
            }, _0x1cd02e.handleModal = function() {
                _0x1cd02e.props.handleModal();
            }, _0x1cd02e.coinBuyComics = function() {
                var _0x54ab78 = _0x1cd02e.props.data;
                B.default.fetchPost(x.API_COIN_BUY_COMICS, {
                    id: _0x54ab78.id
                }, function(_0x3fa757) {
                    var _0x4124d7 = _0x3fa757.data.msg, _0x58b66c = {
                        duration: 3e3,
                        style: {
                            padding: 0,
                            zIndex: 9999
                        },
                        textStyle: {
                            fontSize: 16
                        },
                        type: "fail" === _0x3fa757.data.status ? "danger" : "success"
                    };
                    "fail" === _0x3fa757.data.status && _0x1cd02e.toast.show(_0x4124d7, _0x58b66c), 
                    "ok" === _0x3fa757.data.status && (_0x1cd02e.setState({
                        modalVisible: !_0x1cd02e.state.modalVisible
                    }), g.toastTop.show(_0x4124d7, _0x58b66c), setTimeout(function() {
                        return _0x1cd02e.props.refreshData();
                    }, 1e3));
                });
            }, _0x1cd02e;
        }
        return (0, l.default)(_0x307838, [ {
            key: "componentDidMount",
            value: function() {
                this._isMounted = !0, this.removeHistoryListener = r(d[18]).subscribe(this.getHistoryData), 
                this.getHistoryData();
            }
        }, {
            key: "componentDidUpdate",
            value: function(prev) {
                prev.data && this.props.data && prev.data.id !== this.props.data.id && this.getHistoryData();
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                this._isMounted = !1, this.removeHistoryListener && this.removeHistoryListener();
            }
        }, {
            key: "render",
            value: function() {
                var _0x12ebf6 = this.props, _0x37adca = _0x12ebf6.data, _0x10989d = _0x12ebf6.preview_image, _0x4f7b15 = _0x12ebf6.Setting, _0xd00240 = _0x12ebf6.backgroundHeight;
                const book=_0x37adca,bookKey=String(Number(book.series_id)>0?book.series_id:book.id);
                const available=book.offline?book.series.filter(item=>['ready','locked'].includes(item.localRow.state)):null;
                const pending=this.state.historyBook!==bookKey,latest=!pending && this.state.latestViewId && (!available || available.some(item=>String(item.id)===String(this.state.latestViewId))) && this.state.latestViewId;
                const readButton=(title,restart)=>f.default.createElement(p.TouchableOpacity,{
                    accessibilityRole:'button',accessibilityLabel:title,disabled:pending,style:[I.readAction,restart && I.readDivider],
                    onPress:()=>{
                        if(this.state.historyError){this.getHistoryData();return;}
                        if(available){
                            const item=(!restart && available.find(row=>String(row.id)===String(latest))) || available[0] || book.series[0];
                            this.props.openLocalChapter(item,restart);return;
                        }
                        if(book.is_aids && !book.purchased){this.handleModal();return;}
                        const series=Array.isArray(book.series)?book.series:[];
                        const first=series.find(item=>Number(item.sort||item.episode)===1)||series[0];
                        const id=(!restart && latest) || (first && first.id) || book.id;
                        const params={id};
                        if(restart)params.restartChapter=String(id);
                        if(this.props.historyChapter)params.fromHistory=true;
                        w.navigate('Chapter',params);
                    }
                },f.default.createElement(p.Text,{style:I.readButton},title));
                return f.default.createElement(p.ImageBackground, {
                    style: [ I.imageBackground, {
                        height: _0xd00240
                    } ],
                    source: _0x10989d?{uri:_0x10989d}:undefined
                }, f.default.createElement(S.default, {
                    style: I.linearGradientTop,
                    colors: [ "rgba(0, 0, 0, 0.8)", "rgba(35, 35, 35, 0)" ]
                }, f.default.createElement(r(d[19]).Controls, {}), _0x4f7b15 && _0x4f7b15.info && _0x4f7b15.info.main_web_host && f.default.createElement(p.TouchableOpacity, {
                    style: I.iconButton,
                    onPress: function() {
                        b.default.open({
                            title: _0x37adca.name,
                            url: "https://" + _0x4f7b15.info.main_web_host + "/album/" + _0x37adca.id
                        });
                    }
                }, f.default.createElement(h.default, {
                    name: "share-alt",
                    size: 24,
                    color: "white"
                }))), f.default.createElement(p.View, {
                    style: {
                        width: "100%",
                        height: .7 * _0xd00240
                    }
                }, f.default.createElement(S.default, {
                    style: I.linearGradientBottom,
                    colors: [ "rgba(35, 35, 35, 0)", "rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 1)" ]
                }, f.default.createElement(p.View, {
                    style: I.infoContainer
                }, _0x37adca.is_aids && f.default.createElement(p.Text, {
                    style: I.title,
                    numberOfLines: 1
                }, (0, v.lang)("[禁漫去碼]")), f.default.createElement(p.Text, {
                    style: I.title,
                    numberOfLines: 2
                }, _0x37adca.name), f.default.createElement(p.View, {
                    style: I.authorContainer
                }, f.default.createElement(p.Text, {
                    style: I.author
                }, _0x37adca.author))), f.default.createElement(p.View,{style:I.readBar},
                    readButton(pending?'正在读取进度':this.state.historyError?'读取进度失败，点此重试':latest?'继续阅读':available && !available.length?'查看下载':'开始阅读',false),
                    !!latest && readButton('从头开始',true)))));
            }
        } ]), _0x307838;
    }(f.Component), I = p.StyleSheet.create({
        imageBackground: {
            width: "100%",
            justifyContent: "space-between"
        },
        modalContainer: {
            paddingVertical: 10,
            backgroundColor: "white",
            alignItems: "center"
        },
        modalTitle: {
            color: _.colors.secondary,
            fontWeight: "bold",
            fontSize: 24,
            marginVertical: 10
        },
        coinInfo: {
            flexDirection: "row",
            marginVertical: 5
        },
        coinImage: {
            width: 15,
            height: 15,
            alignSelf: "center",
            marginRight: 5
        },
        modalText: {
            marginVertical: 5
        },
        modalSubText: {
            color: _.colors.tertiary,
            fontSize: 11,
            marginBottom: 20
        },
        confirmButton: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: _.colors.secondary,
            marginVertical: 5,
            borderRadius: 5
        },
        confirmButtonText: {
            color: "white"
        },
        cancelButton: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            color: _.colors.tertiary,
            borderRadius: 5
        },
        linearGradientTop: {
            width: y.default.window.width,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between"
        },
        iconButton: {
            margin: 5
        },
        linearGradientBottom: {
            height: "100%",
            justifyContent: "flex-end"
        },
        infoContainer: {
            paddingHorizontal: 20,
            marginVertical: 10
        },
        title: {
            color: "white",
            marginBottom: 10,
            fontSize: 15,
            fontWeight: "bold"
        },
        authorContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline"
        },
        author: {
            color: _.colors.secondary,
            fontSize: 13
        },
        readBar:{flexDirection:'row',backgroundColor:_.colors.secondary},
        readAction:{flex:1,minHeight:48,alignItems:'center',justifyContent:'center'},
        readDivider:{borderLeftWidth:1,borderLeftColor:'rgba(0,0,0,0.32)'},
        readButton: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#28221B",
            textAlign: "center",
            paddingVertical: 15
        }
    }), E = k;
    e.default = E;
}, 2106, [ 1, 440, 155, 156, 157, 159, 162, 55, 2, 810, 718, 825, 2062, 651, 729, 1636, 648, 650, 2161, 2180 ]);
