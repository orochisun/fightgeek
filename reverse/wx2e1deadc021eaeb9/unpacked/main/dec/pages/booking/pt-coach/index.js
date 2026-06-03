var e = require("../../../@babel/runtime/helpers/objectSpread2"), n = require("../../../@babel/runtime/helpers/regeneratorRuntime"), t = require("../../../@babel/runtime/helpers/asyncToGenerator"), r = require("../../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 3800 ], {
    2037: function(i, a, o) {
        var s = o(4779), u = o(2012), c = o(5797), l = o.n(c), d = o(6287), f = o.n(d), v = o(758), x = o(8149), h = o(686), b = o(3503), p = o(6255), _ = o(8491), m = o(8086), S = o(5399), k = o(4736), w = o(5453), C = o(4910), j = o(6312), T = o(8370), g = o(9219), y = o(613), A = "index__root___HXkC2", I = "index__sectionLabel___K1wDZ", N = "index__drawerContent___i1tnw", L = "index__selectCardLabel___EkDxC", B = "index__memberSelectBox___RLnHC", D = "index__confirmButtonBox___kkqdZ", q = "index__fixedBottomBox___OLPql", E = "index__bookButtonDisabled___e3g2e", H = "index__tipBox___llw0i", O = "index__tipHeader___cSH4u", R = "index__tipTitle___qSku9", z = "index__tipContent___CAMFf", J = o(6070);
        function P(e, n) {
            var t = n.match(/(\d{1,2}):(\d{2})/);
            if (!e || !t) return null;
            var i = r(t, 3), a = i[1], o = i[2];
            return f().unix(e.date).hour(Number(a)).minute(Number(o)).second(0).unix();
        }
        function Z() {
            var i = (0, v.useRef)(null), a = (0, C.k)(function(e) {
                return e.userInfo;
            }), o = (0, w.S)(), s = o.store, c = o.currentCoach, d = o.currentAvailableDate, Z = o.setCurrentAvailableDate, F = o.availableDateList, G = o.setAvailableDateList, K = o.currentCourse, M = o.setCurrentCourse, U = o.availableCoachTimeSlotList, W = o.setAvailableCoachTimeSlotList, X = o.currentCoachTimeSlot, Q = o.setCurrentCoachTimeSlot, V = (0, 
            v.useState)([]), Y = r(V, 2), $ = Y[0], ee = Y[1], ne = (0, v.useState)(null), te = r(ne, 2), re = te[0], ie = te[1], ae = (0, 
            v.useState)(null), oe = r(ae, 2), se = oe[0], ue = oe[1], ce = (0, v.useState)(!1), le = r(ce, 2), de = le[0], fe = le[1];
            (0, v.useEffect)(function() {
                s && c || (l().showToast({
                    title: "请先选择教练",
                    icon: "none"
                }), l().navigateBack());
            }, [ s, c ]), (0, v.useEffect)(function() {
                if (s && c) {
                    G([]), Z(null), M(null), W([]), Q("");
                    var e = !1;
                    return (0, k.s)({
                        storeId: s.id,
                        coachId: c.id
                    }).then(function(n) {
                        if (!e) {
                            var t = n.data.list || [];
                            if (G(t), 0 !== t.length) {
                                var r = function(e) {
                                    var n, t;
                                    return null !== (n = null !== (t = e.find(function(e) {
                                        return e.available && e.courseList.length > 0;
                                    })) && void 0 !== t ? t : e.find(function(e) {
                                        return e.available;
                                    })) && void 0 !== n ? n : e[0];
                                }(t), i = null == r ? void 0 : r.courseList[0];
                                if (r) {
                                    if (Z(r), !i) return M(null), W([]), void Q("");
                                    M(i);
                                }
                            }
                        }
                    }), function() {
                        e = !0;
                    };
                }
            }, [ s, c, G, Z, M, W, Q ]), (0, v.useEffect)(function() {
                if (s && c && d && K) {
                    Q("");
                    var e = !1;
                    return (0, S.y)({
                        courseId: K.id,
                        storeId: s.id,
                        date: d.date,
                        coachId: c.id
                    }).then(function(n) {
                        if (!e) {
                            var t = n.data.list || [];
                            W(t);
                        }
                    }), function() {
                        e = !0;
                    };
                }
            }, [ s, c, d, K, W, Q ]);
            var ve = function() {
                ue(null), ee([]), ie(null), fe(!1);
            }, xe = function() {
                var e = t(n().mark(function e() {
                    var t, r, i;
                    return n().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if (s && c && d && K) {
                                e.next = 2;
                                break;
                            }
                            return e.abrupt("return");

                          case 2:
                            return e.next = 4, (0, S.y)({
                                courseId: K.id,
                                storeId: s.id,
                                date: d.date,
                                coachId: c.id
                            });

                          case 4:
                            if (t = e.sent, r = t.data.list || [], W(r), 0 !== r.length) {
                                e.next = 8;
                                break;
                            }
                            return e.abrupt("return", void Q(""));

                          case 8:
                            i = r.find(function(e) {
                                return e.timeStr === X;
                            }), Q((null == i ? void 0 : i.timeStr) || "");

                          case 10:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                }));
                return function() {
                    return e.apply(this, arguments);
                };
            }(), he = function() {
                var e = t(n().mark(function e() {
                    var t, r, o, u;
                    return n().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if (null != a && a.id) {
                                e.next = 2;
                                break;
                            }
                            return e.abrupt("return", void l().navigateTo({
                                url: "/pages/user/login/index"
                            }));

                          case 2:
                            if (s && c && d && K) {
                                e.next = 4;
                                break;
                            }
                            return e.abrupt("return", void l().showToast({
                                title: "预约参数不完整",
                                icon: "none"
                            }));

                          case 4:
                            if (X) {
                                e.next = 6;
                                break;
                            }
                            return e.abrupt("return", void l().showToast({
                                title: "请选择时间段",
                                icon: "none"
                            }));

                          case 6:
                            if (t = P(d, X)) {
                                e.next = 9;
                                break;
                            }
                            return e.abrupt("return", void l().showToast({
                                title: "时间段解析失败",
                                icon: "none"
                            }));

                          case 9:
                            return r = {
                                courseId: K.id,
                                startTime: t,
                                coachId: c.id,
                                storeId: s.id
                            }, e.prev = 10, e.next = 13, (0, m.C)(r);

                          case 13:
                            if (200 === (u = e.sent).code) {
                                e.next = 16;
                                break;
                            }
                            return e.abrupt("return", void l().showToast({
                                title: u.msg,
                                icon: "none"
                            }));

                          case 16:
                            if (!(Array.isArray(u.data.list) && u.data.list.length > 0)) {
                                e.next = 18;
                                break;
                            }
                            return e.abrupt("return", (ue(r), ee(u.data.list), ie(u.data.list[0]), void (null === (o = i.current) || void 0 === o || o.open())));

                          case 18:
                            l().showToast({
                                title: "暂无可用会员卡",
                                icon: "none"
                            }), e.next = 24;
                            break;

                          case 21:
                            e.prev = 21, e.t0 = e.catch(10), console.error("pt pre-booking failed:", e.t0), 
                            l().showToast({
                                title: "获取会员卡失败",
                                icon: "none"
                            });

                          case 24:
                          case "end":
                            return e.stop();
                        }
                    }, e, null, [ [ 10, 21 ] ]);
                }));
                return function() {
                    return e.apply(this, arguments);
                };
            }(), be = function() {
                var r = t(n().mark(function t() {
                    var r, a;
                    return n().wrap(function(n) {
                        for (;;) switch (n.prev = n.next) {
                          case 0:
                            if (!se || null == re || !re.id || de) {
                                n.next = 21;
                                break;
                            }
                            return fe(!0), n.prev = 2, n.next = 5, (0, m.C)(e(e({}, se), {}, {
                                cardId: re.id
                            }));

                          case 5:
                            if (200 === (a = n.sent).code) {
                                n.next = 8;
                                break;
                            }
                            return n.abrupt("return", void l().showToast({
                                title: a.msg,
                                icon: "none"
                            }));

                          case 8:
                            return ve(), null !== (r = i.current) && void 0 !== r && r.close(), l().showToast({
                                title: "预约成功",
                                icon: "none"
                            }), n.next = 13, xe();

                          case 13:
                            n.next = 18;
                            break;

                          case 15:
                            n.prev = 15, n.t0 = n.catch(2), console.error("pt booking failed:", n.t0), l().showToast({
                                title: "预约失败",
                                icon: "none"
                            });

                          case 18:
                            return n.prev = 18, fe(!1), n.finish(18);

                          case 21:
                          case "end":
                            return n.stop();
                        }
                    }, t, null, [ [ 2, 15, 18, 21 ] ]);
                }));
                return function() {
                    return r.apply(this, arguments);
                };
            }();
            if (!s || !c) return (0, J.jsx)(u.Ss, {
                className: A,
                children: (0, J.jsx)(x.ah, {
                    size: 32,
                    color: "#fff"
                })
            });
            var pe = Boolean(s && c && d && K && X);
            return (0, J.jsxs)(u.Ss, {
                className: A,
                children: [ (0, J.jsx)(_.A, {
                    store: s
                }), (0, J.jsx)(u.Ss, {
                    className: I,
                    children: "当前教练"
                }), (0, J.jsx)(j.A, {
                    items: [ c ],
                    store: s,
                    current: 0,
                    showBookButton: !1
                }), (0, J.jsx)(g.A, {
                    items: F.map(function(e) {
                        return {
                            primary: f()(e.dateStr).format("DD"),
                            secondary: f()(e.dateStr).format("ddd"),
                            tertiary: e.available ? "可预约" : "排课中",
                            disabled: !e.available
                        };
                    }),
                    current: F.findIndex(function(e) {
                        return e.dateStr === (null == d ? void 0 : d.dateStr);
                    }),
                    onChange: function(e) {
                        var n = F[e];
                        if (n) {
                            Z(n);
                            var t = n.courseList[0];
                            if (!t) return M(null), W([]), Q(""), void l().showToast({
                                title: "该日期课程为空",
                                icon: "none"
                            });
                            M(t);
                        }
                    }
                }), (0, J.jsx)(T.A, {
                    items: (null == d ? void 0 : d.courseList.map(function(e) {
                        return e.name;
                    })) || [],
                    current: null == d ? void 0 : d.courseList.findIndex(function(e) {
                        return e.id === (null == K ? void 0 : K.id);
                    }),
                    onChange: function(e) {
                        var n = null == d ? void 0 : d.courseList[e];
                        n && M(n);
                    }
                }), (0, J.jsx)(y.A, {
                    items: U.map(function(e) {
                        return {
                            value: e.timeStr,
                            disabled: !e.available
                        };
                    }),
                    current: U.findIndex(function(e) {
                        return e.timeStr === X;
                    }),
                    onChange: function(e) {
                        var n = U[e];
                        n && Q(n.timeStr);
                    }
                }), (0, J.jsx)(u.Ss, {
                    className: q,
                    children: (0, J.jsx)(h.A, {
                        type: "primary",
                        fullWidth: !0,
                        disabled: !pe,
                        onClick: he,
                        className: pe ? void 0 : E,
                        children: "确认预约"
                    })
                }), (0, J.jsx)(b.A, {
                    showCloseButton: !0,
                    ref: i,
                    onClose: function() {
                        ve();
                    },
                    children: (0, J.jsxs)(u.Ss, {
                        className: N,
                        children: [ (0, J.jsx)(u.Ss, {
                            className: L,
                            children: "选择可用会员卡"
                        }), (0, J.jsx)(u.Ss, {
                            className: B,
                            children: (0, J.jsx)(p.A, {
                                value: re,
                                options: $,
                                onSelect: function(e) {
                                    ie(e);
                                }
                            })
                        }), (0, J.jsxs)(u.Ss, {
                            className: H,
                            children: [ (0, J.jsxs)(u.Ss, {
                                className: O,
                                children: [ (0, J.jsx)(u.In, {
                                    type: "warn",
                                    size: 14,
                                    color: "#e7262a"
                                }), (0, J.jsx)(u.Ss, {
                                    className: R,
                                    children: "温馨提示："
                                }) ]
                            }), (0, J.jsx)(u.Ss, {
                                className: z,
                                children: "课程开始前4小时内不可自行取消预约。"
                            }) ]
                        }), (0, J.jsx)(u.Ss, {
                            className: D,
                            children: (0, J.jsx)(h.A, {
                                type: "primary",
                                onClick: be,
                                children: "确认预约"
                            })
                        }) ]
                    })
                }) ]
            });
        }
        var F = (0, s.eU)(Z, "pages/booking/pt-coach/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "教练预约"
        } || {});
        Z && Z.behaviors && (F.behaviors = (F.behaviors || []).concat(Z.behaviors)), Page(F);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 2037, e(e.s = n);
        var n;
    }), e.O();
} ]);