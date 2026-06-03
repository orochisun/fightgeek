var e = require("../../@babel/runtime/helpers/regeneratorRuntime"), s = require("../../@babel/runtime/helpers/asyncToGenerator"), n = require("../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 1404 ], {
    2802: function(a, r, t) {
        var i = t(4779), c = t(5797), o = t.n(c), l = t(2012), d = t(758), _ = t(5727), u = t(2994), x = t(9690), m = t(1904), h = t(9300), g = t(7037), p = t(2217), v = t(4910), S = t(6395), j = t(5956), N = {
            header: "index__header___NlWuZ",
            selectContainer: "index__selectContainer___HeQ7Q",
            picker: "index__picker___N7zXP",
            pickerContainer: "index__pickerContainer___xbIyb",
            selectText: "index__selectText___oaZIg",
            root: "index__root___qRclB",
            pane1: "index__pane1___Ed2A4",
            img1: "index__img1___YOGeM",
            text: "index__text___i4eRx",
            img2: "index__img2___LghKm",
            stores: "index__stores___AoS78",
            store: "index__store___JK1W8",
            cover: "index__cover___cTLka",
            name: "index__name___VfSHV",
            address: "index__address___jJwpp",
            tags: "index__tags___jyou3",
            tag: "index__tag___hsIa9",
            position: "index__position___n7tqD",
            coaches: "index__coaches___DF0_g",
            coach: "index__coach___rKiFH"
        }, f = t(6070), b = [ {
            title: "品牌介绍"
        }, {
            title: "场馆介绍"
        }, {
            title: "私教介绍"
        } ];
        function C() {
            var a = (0, d.useState)(0), r = n(a, 2), t = r[0], i = r[1], c = (0, v.k)(function(e) {
                return e.userInfo;
            }), C = (0, d.useState)([]), y = n(C, 2), k = y[0], T = y[1], A = (0, u.P)(), I = A.stores, w = A.citys, q = A.currentCity, B = A.currentStore, E = A.setCurrentStore, O = A.setCurrentCity, P = (0, 
            d.useCallback)(s(e().mark(function s() {
                var n;
                return e().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, (0, x.l)({
                            storeId: null == B ? void 0 : B.id
                        });

                      case 2:
                        200 === (n = e.sent).code ? T(n.data.list || []) : console.error("获取教练列表失败", n.msg);

                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, s);
            })), [ null == B ? void 0 : B.id ]);
            (0, d.useEffect)(function() {
                (null == B ? void 0 : B.id) && P();
            }, [ null == B ? void 0 : B.id, P, null == c ? void 0 : c.id ]);
            var D = I.filter(function(e) {
                return e.regionalId === (null == q ? void 0 : q.id);
            });
            return (0, f.jsx)(_.A, {
                fixed: !0,
                headerRender: (0, f.jsxs)(l.Ss, {
                    className: N.header,
                    children: [ (0, f.jsx)(j.T, {
                        current: t,
                        onChange: i,
                        tabList: b
                    }), 1 === t && (0, f.jsx)(l.Ss, {
                        style: {
                            marginTop: "8px"
                        },
                        children: (0, f.jsx)(g.A, {
                            children: (0, f.jsx)(h.A, {
                                range: null == w ? void 0 : w.map(function(e) {
                                    return e.city;
                                }),
                                value: w.findIndex(function(e) {
                                    return e.id === (null == q ? void 0 : q.id);
                                }),
                                onChange: function(e) {
                                    O(w[e.detail.value]);
                                },
                                text: (null == q ? void 0 : q.city) || "选择城市"
                            })
                        })
                    }), 2 === t && (0, f.jsx)(l.Ss, {
                        style: {
                            marginTop: "8px"
                        },
                        children: (0, f.jsx)(l.Ss, {
                            className: N.selectContainer,
                            children: (0, f.jsx)(l.Ss, {
                                className: N.picker,
                                children: (0, f.jsx)(S.A, {
                                    citys: w,
                                    stores: I,
                                    currentStore: B,
                                    setCurrentStore: function(e) {
                                        return E(e);
                                    },
                                    setCurrentCity: function(e) {
                                        return O(e);
                                    }
                                })
                            })
                        })
                    }) ]
                }),
                className: N.root,
                children: (0, f.jsxs)(l.Ss, {
                    className: N.root,
                    children: [ 0 === t && (0, f.jsxs)(l.Ss, {
                        className: N.pane1,
                        children: [ (0, f.jsx)(l.Ss, {
                            style: {
                                padding: "12px"
                            },
                            children: (0, f.jsx)(l.Ss, {
                                className: N.img1
                            })
                        }), (0, f.jsx)(l.Ss, {
                            className: N.text,
                            children: "极斗为格斗、健身爱好者提供线上教学和交流平台，用户可接受一对一专业并且免费的指导，平台还提供格斗健身教学视频、全球赛事资讯、格斗健身知识以及智能设备等。"
                        }), (0, f.jsx)(l.Ss, {
                            className: N.img2
                        }) ]
                    }), 1 === t && (0, f.jsx)(l.Ss, {
                        className: N.stores,
                        children: null == D ? void 0 : D.map(function(e) {
                            return (0, f.jsx)(l.Ss, {
                                className: N.item,
                                onClick: function() {
                                    o().navigateTo({
                                        url: "/pages/store/detail/index?id=".concat(e.id)
                                    });
                                },
                                children: (0, f.jsxs)(l.Ss, {
                                    className: N.store,
                                    children: [ (0, f.jsx)(l.Ss, {
                                        className: N.cover,
                                        style: {
                                            backgroundImage: "url(".concat(e.storeCover, ")")
                                        }
                                    }), (0, f.jsx)(l.Ss, {
                                        className: N.name,
                                        children: e.name
                                    }), (0, f.jsx)(l.Ss, {
                                        className: N.address,
                                        children: e.address
                                    }), (0, f.jsxs)(l.Ss, {
                                        className: N.tags,
                                        children: [ (0, f.jsx)(l.Ss, {
                                            className: N.tag,
                                            children: "团课可约"
                                        }), (0, f.jsx)(l.Ss, {
                                            className: N.tag,
                                            children: "私教可约"
                                        }) ]
                                    }), (0, f.jsxs)(l.Ss, {
                                        className: N.position,
                                        children: [ "距您", " ", (0, f.jsx)(p.A, {
                                            location: {
                                                latitude: Number(e.latitude),
                                                longitude: Number(e.longitude)
                                            }
                                        }) ]
                                    }) ]
                                })
                            }, e.id);
                        })
                    }), 2 === t && (0, f.jsx)(l.Ss, {
                        className: N.coaches,
                        children: null == k ? void 0 : k.map(function(e) {
                            var s;
                            return (0, f.jsx)(l.Ss, {
                                className: N.item,
                                onClick: function() {
                                    o().navigateTo({
                                        url: "/pages/coach/detail/index?id=".concat(e.id),
                                        events: {
                                            acceptDataFromOpenedPage: function(e) {
                                                console.log(e);
                                            },
                                            someEvent: function(e) {
                                                console.log(e);
                                            }
                                        },
                                        success: function(s) {
                                            s.eventChannel.emit("acceptDataFromOpenerPage", {
                                                data: {
                                                    coach: e,
                                                    store: B,
                                                    city: q
                                                }
                                            });
                                        }
                                    });
                                },
                                children: (0, f.jsxs)(l.Ss, {
                                    className: N.coach,
                                    children: [ (0, f.jsx)(l.Ss, {
                                        className: N.cover,
                                        style: {
                                            backgroundImage: "url(".concat(e.avatar, ")")
                                        }
                                    }), (0, f.jsx)(l.Ss, {
                                        className: N.name,
                                        children: e.name
                                    }), (0, f.jsx)(l.Ss, {
                                        className: N.address,
                                        children: e.national
                                    }), (0, f.jsx)(l.Ss, {
                                        className: N.tags,
                                        children: null === (s = e.category) || void 0 === s ? void 0 : s.map(function(e) {
                                            return (0, f.jsx)(l.Ss, {
                                                className: N.tag,
                                                children: m.m6[e] || "未知"
                                            }, e);
                                        })
                                    }) ]
                                })
                            }, e.id);
                        })
                    }) ]
                })
            });
        }
        C.enableShareAppMessage = !0;
        var y = (0, i.eU)(C, "pages/home/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white",
            enableShareAppMessage: !0,
            backgroundColor: "#E7262A"
        } || {});
        C && C.behaviors && (y.behaviors = (y.behaviors || []).concat(C.behaviors)), Page(y);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return s = 2802, e(e.s = s);
        var s;
    }), e.O();
} ]);