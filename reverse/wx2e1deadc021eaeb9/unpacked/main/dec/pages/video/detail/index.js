var e = require("../../../@babel/runtime/helpers/regeneratorRuntime"), i = require("../../../@babel/runtime/helpers/asyncToGenerator"), n = require("../../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 3718 ], {
    4642: function(r, s, a) {
        var o = a(4779), l = a(2012), t = a(5727), c = a(8904), d = a(5797), u = a.n(d), _ = a(8149), m = a(758), v = a(6584), x = a(6287), h = a.n(x), g = {
            video: "index__video___m4lse",
            list: "index__list___MEQ_d",
            item: "index__item___ACTn3",
            foot: "index__foot___HEV2A",
            info: "index__info___dBPhl",
            primary: "index__primary___ytwwi",
            secondary: "index__secondary___GWAl5",
            storeIcon: "index__storeIcon___FYoIg",
            share: "index__share___wXd45",
            imgs: "index__imgs___SlgUV",
            img: "index__img___BzPSg"
        }, p = a(6070);
        function f() {
            var r, s, a, o = ((null === (r = u().getCurrentInstance()) || void 0 === r || null === (s = r.router) || void 0 === s ? void 0 : s.params) || {}).id, x = (0, 
            m.useState)(null), f = n(x, 2), S = f[0], b = f[1];
            function N() {
                return (N = i(e().mark(function i() {
                    var n;
                    return e().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            return e.next = 2, (0, v.OH)({
                                id: Number(o)
                            });

                          case 2:
                            200 === (n = e.sent).code ? b(n.data.detail) : console.error("Failed to fetch class movies:", n.msg);

                          case 4:
                          case "end":
                            return e.stop();
                        }
                    }, i);
                }))).apply(this, arguments);
            }
            return (0, d.useDidShow)(function() {
                !function() {
                    N.apply(this, arguments);
                }();
            }), (0, d.useShareAppMessage)(function() {
                return {
                    title: null == S ? void 0 : S.courseName,
                    imageUrl: null == S ? void 0 : S.coverUrl
                };
            }), (0, d.useShareTimeline)(function() {
                return {
                    title: "影展 - ".concat(null == S ? void 0 : S.courseName),
                    query: "id=".concat(null == S ? void 0 : S.id),
                    imageUrl: null == S ? void 0 : S.coverUrl
                };
            }), console.log("data:", S), (0, p.jsx)(t.A, {
                fixed: !0,
                children: (0, p.jsxs)(l.Ss, {
                    className: g.root,
                    children: [ (0, p.jsx)(l.Ce, {
                        className: g.video,
                        src: null == S ? void 0 : S.videoUrl
                    }), (0, p.jsxs)(l.Ss, {
                        className: g.list,
                        children: [ (0, p.jsx)(l.Ss, {
                            className: g.item,
                            children: (0, p.jsxs)(l.Ss, {
                                className: g.foot,
                                children: [ (0, p.jsxs)(l.Ss, {
                                    className: g.info,
                                    children: [ (0, p.jsx)(l.Ss, {
                                        className: g.primary,
                                        children: null == S ? void 0 : S.courseName
                                    }), (0, p.jsxs)(l.Ss, {
                                        className: g.secondary,
                                        children: [ (0, p.jsx)(l.Ss, {
                                            className: g.storeIcon
                                        }), null == S ? void 0 : S.storeName, " ", h().unix(null == S ? void 0 : S.startTime).format("YYYY-MM-DD  HH:mm") ]
                                    }) ]
                                }), (0, p.jsx)(l.$n, {
                                    openType: "share",
                                    className: "".concat(g.share, " reset-button-to-view"),
                                    onClick: function() {},
                                    children: (0, p.jsx)(_.Xx, {
                                        value: "share",
                                        size: "20",
                                        color: "#666"
                                    })
                                }) ]
                            })
                        }), (0, p.jsx)(c.A, {
                            title: "课程封面",
                            children: (0, p.jsx)(l.Ss, {
                                className: g.imgs,
                                children: (0, p.jsx)(l._V, {
                                    className: g.img,
                                    src: null == S ? void 0 : S.coverUrl,
                                    mode: "widthFix",
                                    onClick: function() {
                                        u().previewImage({
                                            urls: [ null == S ? void 0 : S.coverUrl ],
                                            current: null == S ? void 0 : S.coverUrl
                                        });
                                    }
                                })
                            })
                        }), (0, p.jsx)(c.A, {
                            title: "课程风采",
                            children: (0, p.jsx)(l.Ss, {
                                className: g.imgs,
                                children: null == S || null === (a = S.images) || void 0 === a ? void 0 : a.map(function(e) {
                                    return (0, p.jsx)(l._V, {
                                        src: e,
                                        className: g.img,
                                        mode: "widthFix",
                                        onClick: function() {
                                            u().previewImage({
                                                urls: (null == S ? void 0 : S.images) || [],
                                                current: e
                                            });
                                        }
                                    }, e);
                                })
                            })
                        }) ]
                    }) ]
                })
            });
        }
        f.enableShareTimeline = !0, f.enableShareAppMessage = !0;
        var S = (0, o.eU)(f, "pages/video/detail/index", {
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
        f && f.behaviors && (S.behaviors = (S.behaviors || []).concat(f.behaviors)), Page(S);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return i = 4642, e(e.s = i);
        var i;
    }), e.O();
} ]);