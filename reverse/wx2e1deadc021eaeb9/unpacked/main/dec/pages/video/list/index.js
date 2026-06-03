var e = require("../../../@babel/runtime/helpers/defineProperty"), n = require("../../../@babel/runtime/helpers/toConsumableArray"), r = require("../../../@babel/runtime/helpers/regeneratorRuntime"), t = require("../../../@babel/runtime/helpers/asyncToGenerator"), s = require("../../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 5517 ], {
    8709: function(i, a, o) {
        var c = o(4779), l = o(2012), d = o(5797), u = o.n(d), _ = o(8149), h = o(6395), v = o(2994), m = o(758), x = o(6287), f = o.n(x), p = o(5119), S = o.n(p), g = o(5727), b = o(6584), j = o(4910);
        function k(e) {
            var i = e.currentStore, a = (0, j.k)(function(e) {
                return e.userInfo;
            }), o = (0, m.useState)(!1), c = s(o, 2), l = c[0], d = c[1], u = (0, m.useState)([]), _ = s(u, 2), h = _[0], v = _[1], x = (0, 
            m.useState)(!1), f = s(x, 2), p = f[0], S = f[1], g = (0, m.useState)(!1), k = s(g, 2), N = k[0], w = k[1], y = (0, 
            m.useCallback)(t(r().mark(function e() {
                var n;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return console.log("fetchData called with storeId:", null == i ? void 0 : i.id), 
                        S(!0), v([]), e.prev = 1, e.next = 4, (0, b.Bj)({
                            storeId: null == i ? void 0 : i.id,
                            userId: l ? null == a ? void 0 : a.id : void 0
                        });

                      case 4:
                        200 === (n = e.sent).code ? (v(n.data.list.sort(function(e, n) {
                            return n.id - e.id;
                        })), w(n.data.list.length > 0)) : console.error("Failed to fetch class movies:", n.msg), 
                        e.next = 10;
                        break;

                      case 8:
                        e.prev = 8, e.t0 = e.catch(1);

                      case 10:
                        S(!1);

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            })), [ null == i ? void 0 : i.id, null == a ? void 0 : a.id, l ]), C = (0, m.useCallback)(t(r().mark(function e() {
                var t, s, o;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        if (0 === h.length || p || !N) {
                            e.next = 13;
                            break;
                        }
                        return S(!0), e.prev = 2, t = h[h.length - 1].id, e.next = 6, (0, b.Bj)({
                            storeId: null == i ? void 0 : i.id,
                            userId: l ? null == a ? void 0 : a.id : void 0,
                            lastId: t
                        });

                      case 6:
                        200 === (s = e.sent).code ? (o = s.data.list.sort(function(e, n) {
                            return n.id - e.id;
                        }), v([].concat(n(h), n(o))), w(o.length > 0)) : console.error("Failed to fetch more class movies:", s.msg), 
                        e.next = 12;
                        break;

                      case 10:
                        e.prev = 10, e.t0 = e.catch(2);

                      case 12:
                        S(!1);

                      case 13:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 2, 10 ] ]);
            })), [ N, p, h, null == i ? void 0 : i.id, null == a ? void 0 : a.id, l ]);
            return (0, m.useEffect)(function() {
                y();
            }, [ y ]), {
                justShowMe: l,
                setJustShowMe: d,
                list: h,
                setList: v,
                fetchMore: C,
                loading: p,
                hasMore: N
            };
        }
        var N = {
            list: "index__list___o8ma2",
            item: "index__item___U3U4d",
            video: "index__video___jsO47",
            cover: "index__cover___Euzat",
            foot: "index__foot___Dsaoy",
            info: "index__info___wFpk7",
            primary: "index__primary___SbI32",
            secondary: "index__secondary___l0v60",
            storeIcon: "index__storeIcon___IwVH6",
            share: "index__share___B4Jm6",
            head: "index__head___BXql0",
            picker: "index__picker___w0Xji",
            checkBtn: "index__checkBtn___e60hH",
            active: "index__active___S4yV6",
            tip: "index__tip___oLBej",
            loading: "index__loading___iovNE"
        }, w = o(6070);
        function y() {
            var n = (0, v.P)(), r = n.citys, t = n.stores, i = n.currentStore, a = n.setCurrentStore, o = n.setCurrentCity, c = (0, 
            m.useState)(null), x = s(c, 2), p = x[0], b = x[1], j = k({
                currentStore: i
            }), y = j.list, C = j.fetchMore, I = j.justShowMe, M = j.setJustShowMe, B = j.loading, T = j.hasMore;
            return (0, d.useShareAppMessage)(function() {
                if (p) {
                    var e = y.find(function(e) {
                        return e.id === p;
                    });
                    if (e) return {
                        title: "影展 - ".concat(e.courseName),
                        path: "/pages/video/detail/index?id=".concat(e.id, "&from=share"),
                        imageUrl: e.coverUrl
                    };
                }
                return {
                    title: "影展 - ".concat(null == i ? void 0 : i.name),
                    path: "/pages/video/list/index?storeId=".concat((null == i ? void 0 : i.id) || "", "&from=share"),
                    imageUrl: ""
                };
            }), (0, d.useShareTimeline)(function() {
                return {
                    title: "影展 - ".concat(null == i ? void 0 : i.name)
                };
            }), console.log("loading", B), console.log("currentStore", i), (0, w.jsx)(g.A, {
                fixed: !0,
                scrollViewProps: {
                    onScrollToLower: function() {
                        C();
                    }
                },
                headerRender: (0, w.jsx)(l.Ss, {
                    className: N.container,
                    children: (0, w.jsxs)(l.Ss, {
                        className: N.head,
                        children: [ (0, w.jsx)(l.Ss, {
                            className: N.picker,
                            children: (0, w.jsx)(h.A, {
                                citys: r,
                                stores: t,
                                currentStore: i,
                                setCurrentStore: function(e) {
                                    return a(e);
                                },
                                setCurrentCity: function(e) {
                                    return o(e);
                                }
                            })
                        }), (0, w.jsx)(l.Ss, {
                            className: S()(N.checkBtn, e({}, N.active, I)),
                            onClick: function() {
                                return M(!I);
                            },
                            children: "我的视频"
                        }) ]
                    })
                }),
                children: (0, w.jsxs)(l.Ss, {
                    className: N.root,
                    children: [ (0, w.jsx)(l.Ss, {
                        className: N.list,
                        children: null == y ? void 0 : y.map(function(e) {
                            return (0, w.jsxs)(l.Ss, {
                                className: N.item,
                                onClick: function() {
                                    u().navigateTo({
                                        url: "/pages/video/detail/index?id=".concat(e.id)
                                    });
                                },
                                children: [ (0, w.jsx)(l.Ss, {
                                    className: N.cover,
                                    style: {
                                        backgroundImage: "url(".concat(e.coverUrl, ")")
                                    }
                                }), (0, w.jsxs)(l.Ss, {
                                    className: N.foot,
                                    children: [ (0, w.jsxs)(l.Ss, {
                                        className: N.info,
                                        children: [ (0, w.jsx)(l.Ss, {
                                            className: N.primary,
                                            children: e.courseName
                                        }), (0, w.jsxs)(l.Ss, {
                                            className: N.secondary,
                                            children: [ (0, w.jsx)(l.Ss, {
                                                className: N.storeIcon
                                            }), null == i ? void 0 : i.name, " ", f().unix(e.startTime).format("YYYY-MM-DD HH:mm") ]
                                        }) ]
                                    }), (0, w.jsx)(l.$n, {
                                        openType: "share",
                                        className: "".concat(N.share, " reset-button-to-view"),
                                        onClick: function(n) {
                                            n.stopPropagation(), n.preventDefault(), b(e.id);
                                        },
                                        children: (0, w.jsx)(_.Xx, {
                                            value: "share",
                                            size: "20",
                                            color: "#666"
                                        })
                                    }) ]
                                }) ]
                            }, e.id);
                        })
                    }), (0, w.jsxs)(l.Ss, {
                        className: N.loading,
                        children: [ B && 0 !== y.length && (0, w.jsx)(l.Ss, {
                            className: N.tip,
                            children: "数据加载中，请稍候..."
                        }), !B && 0 === y.length && (0, w.jsx)(l.Ss, {
                            className: N.tip,
                            children: "暂无数据"
                        }), !B && !T && y.length > 0 && (0, w.jsx)(l.Ss, {
                            className: N.tip,
                            children: "没有更多数据了"
                        }) ]
                    }) ]
                })
            });
        }
        y.enableShareTimeline = !0, y.enableShareAppMessage = !0;
        var C = (0, c.eU)(y, "pages/video/list/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "影展",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white",
            backgroundColor: "#f0f0f0",
            enableShareAppMessage: !0
        } || {});
        y && y.behaviors && (C.behaviors = (C.behaviors || []).concat(y.behaviors)), Page(C);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 8709, e(e.s = n);
        var n;
    }), e.O();
} ]);