var e = require("../../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 8979 ], {
    2289: function(n, a, i) {
        var s = i(4779), l = i(2012), r = i(758), o = i(5797), c = i.n(o), t = i(8904), d = i(1904), _ = "index__root___RJkP9", u = "index__video___iBRXl", v = "index__coach___uCqR2", x = "index__cover___krvtq", h = "index__name___VS1P5", m = "index__address___SX2mN", g = "index__tags___AGoGr", p = "index__tag___5Y4Jk", j = "index__description___lIqR6", S = "index__paragraph___UJzKp", f = "index__swiper___dnmhg", N = "index__image___Z3Ydu", b = i(6070);
        function C() {
            var n, a, i, s, C = (0, r.useState)(), k = e(C, 2), w = k[0], A = k[1];
            (0, o.useLoad)(function() {
                var e = c().getCurrentInstance().page;
                e && void 0 !== (null == e ? void 0 : e.getOpenerEventChannel) ? (null == e ? void 0 : e.getOpenerEventChannel()).on("acceptDataFromOpenerPage", function(e) {
                    A(e.data);
                }) : console.error("当前页面不存在");
            });
            var y = w || {}, B = y.coach, J = y.store;
            y.city;
            return (0, b.jsxs)(l.Ss, {
                children: [ (0, b.jsx)(l.Ce, {
                    className: u,
                    src: null == B ? void 0 : B.videoUrl
                }), (0, b.jsxs)(l.Ss, {
                    className: _,
                    children: [ (0, b.jsx)(t.A, {
                        children: (0, b.jsxs)(l.Ss, {
                            className: v,
                            children: [ (0, b.jsx)(l.Ss, {
                                className: x,
                                style: {
                                    backgroundImage: "url(".concat(null == B ? void 0 : B.avatar, ")")
                                }
                            }), (0, b.jsx)(l.Ss, {
                                className: h,
                                children: null == B ? void 0 : B.name
                            }), (0, b.jsx)(l.Ss, {
                                className: m,
                                children: null == B ? void 0 : B.national
                            }), (0, b.jsx)(l.Ss, {
                                className: g,
                                children: null == B || null === (n = B.category) || void 0 === n ? void 0 : n.map(function(e) {
                                    return (0, b.jsx)(l.Ss, {
                                        className: p,
                                        children: d.m6[e] || "未知"
                                    }, e);
                                })
                            }) ]
                        })
                    }), (0, b.jsx)(t.A, {
                        title: "个人简介",
                        children: (0, b.jsx)(l.Ss, {
                            className: j,
                            children: null == B || null === (a = B.info) || void 0 === a || null === (i = a.split("\n")) || void 0 === i ? void 0 : i.map(function(e, n) {
                                return (0, b.jsx)(l.Ss, {
                                    className: S,
                                    children: e
                                }, n);
                            })
                        })
                    }), (0, b.jsx)(t.A, {
                        title: "所在场馆",
                        children: (0, b.jsxs)(l.Ss, {
                            className: "paragraph",
                            children: [ "今日：", null == J ? void 0 : J.name ]
                        })
                    }), (null == B ? void 0 : B.images) && (null == B ? void 0 : B.images.length) > 0 && (0, 
                    b.jsx)(t.A, {
                        title: "图片风采",
                        children: (0, b.jsx)(l.RC, {
                            className: f,
                            indicatorColor: "rgba(255, 255, 255, 0.3)",
                            indicatorActiveColor: "#fff",
                            circular: !0,
                            indicatorDots: !0,
                            children: null == B || null === (s = B.images) || void 0 === s ? void 0 : s.map(function(e, n) {
                                return (0, b.jsx)(l.wu, {
                                    onClick: function() {
                                        c().previewImage({
                                            urls: null == B ? void 0 : B.images,
                                            current: e
                                        });
                                    },
                                    children: (0, b.jsx)(l._V, {
                                        mode: "aspectFit",
                                        className: N,
                                        src: e
                                    })
                                }, n);
                            })
                        })
                    }) ]
                }) ]
            });
        }
        var k = (0, s.eU)(C, "pages/coach/detail/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "教练信息",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white"
        } || {});
        C && C.behaviors && (k.behaviors = (k.behaviors || []).concat(C.behaviors)), Page(k);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 2289, e(e.s = n);
        var n;
    }), e.O();
} ]);