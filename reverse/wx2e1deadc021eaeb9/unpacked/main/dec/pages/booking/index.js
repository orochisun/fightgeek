var e = require("../../@babel/runtime/helpers/defineProperty"), n = require("../../@babel/runtime/helpers/regeneratorRuntime"), s = require("../../@babel/runtime/helpers/asyncToGenerator"), t = require("../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 7992 ], {
    563: function(a, r, i) {
        var c = i(4779), o = i(2012), l = i(758), u = i(6287), d = i.n(u), _ = i(5727), x = i(6584), h = i(1904), m = i(3503), f = i(5797), p = i.n(f), g = i(5119), v = i.n(g), S = i(7037), j = i(9300), N = {
            header: "index__header___keWLt",
            footer: "index__footer___lVODC",
            list: "index__list___KlfGt",
            item: "index__item____qi0W",
            left: "index__left___eB3L4",
            title: "index__title___rmYvo",
            class: "index__class___FTL08",
            cover: "index__cover___GQxxl",
            p: "index__p___SGb2h",
            tags: "index__tags___etfCh",
            tag: "index__tag___LIPYn",
            right: "index__right___lVuMc",
            qrcode: "index__qrcode___eM7xg",
            button: "index__button___vRSb4",
            next: "index__next___WD0x4",
            sign: "index__sign___Sg5Gd",
            hr: "index__hr___gJqip"
        }, b = i(6070);
        function y(e) {
            return null != e && e.startTime && null != e && e.duration ? d().unix(e.startTime).format("YYYY-MM-DD HH:mm") + " ~ " + d().unix(e.startTime).add(e.duration, "minute").format("HH:mm") : "";
        }
        function w() {
            var a = (0, l.useRef)(null), r = (0, l.useState)(null), i = t(r, 2), c = i[0], u = i[1], g = (0, 
            l.useState)(null), w = t(g, 2), T = w[0], k = w[1], C = (0, l.useState)(!1), q = t(C, 2), A = q[0], B = q[1], R = (0, 
            l.useState)([]), Y = t(R, 2), D = Y[0], G = Y[1], M = (0, l.useState)(d()().year()), H = t(M, 2), I = H[0], L = H[1], O = (0, 
            l.useState)(d()().month() + 1), E = t(O, 2), J = E[0], P = E[1], V = Array.from({
                length: 11
            }, function(e, n) {
                return d()().year() - 5 + n;
            }), W = Array.from({
                length: 12
            }, function(e, n) {
                return n + 1;
            }), z = (0, l.useCallback)(s(n().mark(function e() {
                var s, t, a;
                return n().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, x.rE)({
                            date: d()().year(I).month(J - 1).startOf("month").unix(),
                            pageSize: 100
                        });

                      case 3:
                        s = e.sent, console.log("预定列表:", s), 200 === s.code ? (a = null === (t = s.data.list) || void 0 === t ? void 0 : t.filter(function(e) {
                            return 2 !== e.status;
                        }), G(a)) : console.error("获取预定列表失败:", s.msg), e.next = 10;
                        break;

                      case 7:
                        e.prev = 7, e.t0 = e.catch(0), console.error("获取预定列表失败:", e.t0);

                      case 10:
                        B(!0);

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            })), [ I, J ]);
            function F() {
                return (F = s(n().mark(function e(s) {
                    var t, r;
                    return n().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            return console.log("显示详情:", s), e.next = 3, (0, x.q$)({
                                id: s.id,
                                idType: s.type
                            });

                          case 3:
                            r = e.sent, console.log("二维码信息:", r), k(r.data.qrCodeBase64), u(s), null === (t = a.current) || void 0 === t || t.open();

                          case 5:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                }))).apply(this, arguments);
            }
            function K() {
                return (K = s(n().mark(function e(s) {
                    var t;
                    return n().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            return e.next = 2, p().showModal({
                                title: "取消预约",
                                content: "确定要取消预约吗？"
                            });

                          case 2:
                            if (e.sent.confirm) {
                                e.next = 5;
                                break;
                            }
                            return e.abrupt("return");

                          case 5:
                            return e.next = 7, (0, x.Se)({
                                id: s.id,
                                idType: s.type
                            });

                          case 7:
                            200 === (t = e.sent).code ? (console.log("Cancellation successful:", t.data), p().showToast({
                                title: "取消预约成功",
                                icon: "none"
                            }), z()) : (console.error("Cancellation failed:", t.msg), p().showToast({
                                title: t.msg,
                                icon: "none"
                            }));

                          case 9:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                }))).apply(this, arguments);
            }
            return (0, l.useEffect)(function() {
                z();
            }, [ I, J, z ]), (0, f.useDidShow)(function() {
                A && z();
            }), (0, b.jsx)(_.A, {
                fixed: !0,
                headerRender: (0, b.jsx)(o.Ss, {
                    className: N.header,
                    children: (0, b.jsxs)(S.A, {
                        children: [ (0, b.jsx)(j.A, {
                            range: null == V ? void 0 : V.map(function(e) {
                                return "".concat(e, "年");
                            }),
                            value: V.findIndex(function(e) {
                                return e === I;
                            }),
                            onChange: function(e) {
                                var n = V[e.detail.value];
                                L(n);
                            },
                            text: "".concat(I, "年")
                        }), (0, b.jsx)(j.A, {
                            range: null == W ? void 0 : W.map(function(e) {
                                return "".concat(e, "月");
                            }),
                            value: W.findIndex(function(e) {
                                return e === J;
                            }),
                            onChange: function(e) {
                                var n = W[e.detail.value];
                                P(n);
                            },
                            text: "".concat(J, "月")
                        }) ]
                    })
                }),
                onRefresh: z,
                footerClassName: N.footer,
                footerRender: (0, b.jsx)(o.Ss, {
                    children: (0, b.jsx)(m.A, {
                        showCloseButton: !0,
                        ref: a,
                        children: (0, b.jsxs)(o.Ss, {
                            className: N.sign,
                            children: [ (0, b.jsx)(o.Ss, {
                                className: N.title,
                                children: "课程签到"
                            }), (0, b.jsx)(o.Ss, {
                                className: N.qrcode,
                                children: T && (0, b.jsx)(o._V, {
                                    style: {
                                        width: "160px",
                                        height: "160px"
                                    },
                                    src: "data:image/png;base64,".concat(T)
                                })
                            }), (0, b.jsx)(o.Ss, {
                                className: N.hr
                            }), (0, b.jsxs)(o.Ss, {
                                className: N.info,
                                children: [ (0, b.jsxs)(o.Ss, {
                                    className: N.p,
                                    children: [ "时间：", c && y(c) ]
                                }), (0, b.jsxs)(o.Ss, {
                                    className: N.p,
                                    children: [ "门店： ", null == c ? void 0 : c.storeName ]
                                }), (0, b.jsxs)(o.Ss, {
                                    className: N.p,
                                    children: [ "课程：", null == c ? void 0 : c.courseName ]
                                }) ]
                            }) ]
                        })
                    })
                }),
                children: (0, b.jsx)(o.Ss, {
                    children: (0, b.jsx)(o.Ss, {
                        className: N.list,
                        children: null == D ? void 0 : D.map(function(n, s) {
                            var t, a, r = y(n), i = 0 === s && d().unix(n.startTime).add(n.duration, "minute").isAfter(d()());
                            return (0, b.jsxs)(o.Ss, {
                                className: v()(N.item, e({}, N.next, i)),
                                children: [ (0, b.jsxs)(o.Ss, {
                                    className: N.left,
                                    children: [ (0, b.jsx)(o.Ss, {
                                        className: N.title,
                                        children: r
                                    }), (0, b.jsxs)(o.Ss, {
                                        className: N.class,
                                        children: [ (0, b.jsx)(o.Ss, {
                                            className: N.cover,
                                            style: {
                                                backgroundImage: "url(".concat(null == n || null === (t = n.coach) || void 0 === t ? void 0 : t.avatar, ")")
                                            }
                                        }), (0, b.jsxs)(o.Ss, {
                                            className: N.info,
                                            children: [ (0, b.jsx)(o.Ss, {
                                                className: N.p,
                                                children: n.cardName
                                            }), (0, b.jsxs)(o.Ss, {
                                                className: N.p,
                                                children: [ "教练 ", null == n || null === (a = n.coach) || void 0 === a ? void 0 : a.name, " ｜ ", n.courseName ]
                                            }), (0, b.jsxs)(o.Ss, {
                                                className: N.tags,
                                                children: [ (0, b.jsx)(o.Ss, {
                                                    className: N.tag,
                                                    children: 1 === n.type ? "私教" : "团课"
                                                }), (0, b.jsx)(o.Ss, {
                                                    className: N.tag,
                                                    children: h.ut[n.customerType]
                                                }) ]
                                            }) ]
                                        }) ]
                                    }) ]
                                }), (0, b.jsxs)(o.Ss, {
                                    className: N.right,
                                    children: [ (0, b.jsx)(o.Ss, {
                                        className: N.qrcode,
                                        onClick: function() {
                                            !function(e) {
                                                F.apply(this, arguments);
                                            }(n);
                                        }
                                    }), 0 === n.status && (0, b.jsx)(o.Ss, {
                                        className: N.button,
                                        onClick: function() {
                                            !function(e) {
                                                K.apply(this, arguments);
                                            }(n);
                                        },
                                        children: "取消预约"
                                    }), 2 === n.status && (0, b.jsx)(o.Ss, {
                                        className: N.button,
                                        children: "已取消"
                                    }), 3 === n.status && (0, b.jsx)(o.Ss, {
                                        className: N.button,
                                        children: "已签到"
                                    }) ]
                                }) ]
                            }, s);
                        })
                    })
                })
            });
        }
        var T = (0, c.eU)(w, "pages/booking/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "约课记录",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white"
        } || {});
        w && w.behaviors && (T.behaviors = (T.behaviors || []).concat(w.behaviors)), Page(T);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 563, e(e.s = n);
        var n;
    }), e.O();
} ]);