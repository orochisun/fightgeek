var e = require("../../@babel/runtime/helpers/objectSpread2"), n = require("../../@babel/runtime/helpers/regeneratorRuntime"), t = require("../../@babel/runtime/helpers/asyncToGenerator"), r = require("../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 1421 ], {
    5068: function(s, a, i) {
        var o = i(4779), l = i(2012), c = i(5797), u = i.n(c), d = i(758), _ = i(2935), f = i(6287), x = i.n(f), h = i(6584), m = i(9706);
        function v() {
            var e = (0, m.A)().store, s = (0, d.useState)(!1), a = r(s, 2), i = a[0], o = a[1], l = (0, 
            d.useCallback)(t(n().mark(function t() {
                var r, s, a, i;
                return n().wrap(function(n) {
                    for (;;) switch (n.prev = n.next) {
                      case 0:
                        if (null != e && e.id) {
                            n.next = 2;
                            break;
                        }
                        return n.abrupt("return");

                      case 2:
                        return n.next = 4, (0, h.jj)({
                            storeId: e.id
                        });

                      case 4:
                        a = n.sent, i = null === (r = a.data.list || []) || void 0 === r || null === (s = r.filter(function(e) {
                            return e.startTime > x()().subtract(10, "minutes").unix();
                        })) || void 0 === s ? void 0 : s.sort(function(e, n) {
                            return e.startTime - n.startTime;
                        }), v(i), o(!0);

                      case 7:
                      case "end":
                        return n.stop();
                    }
                }, t);
            })), [ null == e ? void 0 : e.id ]);
            (0, d.useEffect)(function() {
                l();
            }, [ l, null == e ? void 0 : e.id ]), (0, c.useDidShow)(function() {
                i && l();
            });
            var u = (0, d.useState)([]), _ = r(u, 2), f = _[0], v = _[1];
            return {
                classList: f,
                refetch: l
            };
        }
        var p = i(4910), S = i(5727), b = i(3503), g = i(686), j = i(6255), C = i(5956), N = i(9219), k = i(8149), w = i(2217), y = "index__root___tNDzQ", T = "index__left___N2kwe", A = "index__primary___IvE9_", L = "index__name___u_82g", B = "index__distance___NfXtG", I = "index__detail___BCidP", D = "index__button___a1d32", F = i(6070);
        function E() {
            var e = (0, m.A)().store;
            return e ? (0, F.jsxs)(l.Ss, {
                className: y,
                children: [ (0, F.jsxs)(l.Ss, {
                    className: T,
                    children: [ (0, F.jsxs)(l.Ss, {
                        className: A,
                        children: [ (0, F.jsx)(l.EY, {
                            className: L,
                            children: null == e ? void 0 : e.name
                        }), (0, F.jsxs)(l.Ss, {
                            className: B,
                            children: [ (0, F.jsx)(k.Xx, {
                                value: "map-pin",
                                size: "12",
                                color: "#fff"
                            }), (0, F.jsx)(w.A, {
                                location: {
                                    latitude: Number(null == e ? void 0 : e.latitude),
                                    longitude: Number(null == e ? void 0 : e.longitude)
                                }
                            }) ]
                        }) ]
                    }), (0, F.jsxs)(l.Ss, {
                        className: I,
                        children: [ null == e ? void 0 : e.startTime, " - ", null == e ? void 0 : e.endTime ]
                    }), (0, F.jsx)(l.Ss, {
                        className: I,
                        children: null == e ? void 0 : e.address
                    }) ]
                }), (0, F.jsxs)(l.Ss, {
                    className: D,
                    onClick: function() {
                        u().navigateTo({
                            url: "/pages/store/select/index"
                        });
                    },
                    children: [ "切换门店 ", (0, F.jsx)(k.Xx, {
                        value: "chevron-down",
                        size: "14",
                        color: "#fff"
                    }) ]
                }) ]
            }) : (0, F.jsx)(l.Ss, {
                className: y,
                children: (0, F.jsx)(k.ah, {
                    size: 32,
                    color: "#fff"
                })
            });
        }
        var M = i(1904), H = i(5119), z = i.n(H), P = "index__root___M7ono", W = "index__time____W9bs", R = "index__name___KTtNN", G = "index__capacity___HIfrN", Q = "index__cover___PW10i", Y = "index__teacher___O5mgV", q = "index__avatar___V2CH6", J = "index__coach___GRoYR", K = "index__bookingButton___eW_94", V = "index__booked___yWzmu", X = "index__disabled___ptUfJ", Z = "index__ended___Y_K4p", O = {
            1: "linear-gradient(180deg, #6CDEFA 0%, #FEFAFF 100%)",
            2: "linear-gradient(180deg, #FCFF77 0%, #FFFFE4 100%)",
            3: "linear-gradient(180deg, #FD6154 0%, #FFFAF1 100%)"
        };
        function U(e) {
            var n, t, r, s, a, i, o, c, u = e.data, d = e.onBooking, _ = e.onCancel, f = e.showAction;
            return (0, F.jsxs)(l.Ss, {
                className: P,
                style: {
                    background: O[u.type]
                },
                children: [ (0, F.jsx)(l.Ss, {
                    className: Q,
                    style: {
                        backgroundImage: "url(".concat(u.courseCover, ")")
                    }
                }), (0, F.jsxs)(l.Ss, {
                    className: W,
                    children: [ x().unix(u.startTime).format("HH:mm"), " -", " ", x().unix(u.startTime).add(u.duration, "minutes").format("HH:mm") ]
                }), (0, F.jsx)(l.Ss, {
                    className: R,
                    children: u.courseName
                }), (0, F.jsxs)(l.Ss, {
                    className: G,
                    children: [ M.ut[u.customerType], " ", u.bookingNum, " / ", u.capacity ]
                }), (0, F.jsxs)(l.Ss, {
                    className: Y,
                    children: [ (0, F.jsxs)(l.Ss, {
                        className: J,
                        children: [ (0, F.jsx)(l.Ss, {
                            className: q,
                            style: {
                                backgroundImage: "url(".concat(null == u || null === (n = u.coach) || void 0 === n ? void 0 : n.avatar, ")")
                            }
                        }), (0, F.jsxs)(l.Ss, {
                            className: R,
                            children: [ " ", null == u || null === (t = u.coach) || void 0 === t ? void 0 : t.name ]
                        }) ]
                    }), 0 !== (null == u || null === (r = u.sndCoach) || void 0 === r ? void 0 : r.id) && (0, 
                    F.jsxs)(l.Ss, {
                        className: J,
                        children: [ (0, F.jsx)(l.Ss, {
                            className: q,
                            style: {
                                backgroundImage: "url(".concat(null == u || null === (s = u.sndCoach) || void 0 === s ? void 0 : s.avatar, ")")
                            }
                        }), (0, F.jsxs)(l.Ss, {
                            className: R,
                            children: [ " ", null == u || null === (a = u.sndCoach) || void 0 === a ? void 0 : a.name ]
                        }) ]
                    }), 0 !== (null == u || null === (i = u.thdCoach) || void 0 === i ? void 0 : i.id) && (0, 
                    F.jsxs)(l.Ss, {
                        className: J,
                        children: [ (0, F.jsx)(l.Ss, {
                            className: q,
                            style: {
                                backgroundImage: "url(".concat(null == u || null === (o = u.thdCoach) || void 0 === o ? void 0 : o.avatar, ")")
                            }
                        }), (0, F.jsxs)(l.Ss, {
                            className: R,
                            children: [ " ", null == u || null === (c = u.thdCoach) || void 0 === c ? void 0 : c.name ]
                        }) ]
                    }) ]
                }), x()().isAfter(x().unix(u.startTime).add(u.duration, "minutes")) ? (0, F.jsx)(l.Ss, {
                    className: z()(K, Z),
                    children: "已结束"
                }) : f && u.capacity > u.bookingNum && 0 === u.myBooking ? (0, F.jsx)(l.Ss, {
                    className: z()(K, "press"),
                    onClick: function() {
                        d && d();
                    },
                    children: "会员预约"
                }) : f && 1 === u.myBooking ? (0, F.jsx)(l.Ss, {
                    className: z()(K, "press", V),
                    onClick: function() {
                        _ && _();
                    },
                    children: "取消预约"
                }) : f && u.capacity <= u.bookingNum ? (0, F.jsx)(l.Ss, {
                    className: z()(K, "press", X),
                    children: "已约满"
                }) : void 0 ]
            });
        }
        var $ = (0, i(8442).v)(function(e) {
            return {
                store: null,
                setStore: function(n) {
                    console.log("- Setting store:", n), e({
                        store: n
                    });
                },
                storeList: [],
                setStoreList: function(n) {
                    console.log("- Setting storeList:", n), e({
                        storeList: n
                    });
                },
                availableDateList: [],
                setAvailableDateList: function(n) {
                    console.log("- Setting availableDateList:", n), e({
                        availableDateList: n
                    });
                },
                currentAvailableDate: null,
                setCurrentAvailableDate: function(n) {
                    console.log("- Setting currentAvailableDate:", n), e({
                        currentAvailableDate: n
                    });
                },
                currentCourse: null,
                setCurrentCourse: function(n) {
                    console.log("- Setting currentCourse:", n), e({
                        currentCourse: n
                    });
                },
                availableCoachTimeSlotList: [],
                setAvailableCoachTimeSlotList: function(n) {
                    console.log("- Setting availableCoachTimeSlotList:", n), e({
                        availableCoachTimeSlotList: n
                    });
                },
                currentCoachTimeSlot: null,
                setCurrentCoachTimeSlot: function(n) {
                    console.log("- Setting currentCoachTimeSlot:", n), e({
                        currentCoachTimeSlot: n
                    });
                },
                currentCoach: null,
                setCurrentCoach: function(n) {
                    console.log("- Setting currentCoach:", n), e({
                        currentCoach: n
                    });
                }
            };
        }), ee = i(6116);
        function ne() {
            return te.apply(this, arguments);
        }
        function te() {
            return (te = t(n().mark(function e() {
                var t;
                return n().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, ee.E)({
                            url: "/member/v1/class/pt/store",
                            method: "GET"
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("getPtStoreList failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        var re = i(4736), se = i(230), ae = i(5399), ie = i(8086), oe = i(8491), le = i(8370), ce = i(6312), ue = i(613), de = "index__root___mH0AR", _e = "index__header____PmGI", fe = "index__iconBox___jSxPW", xe = "index__icon___uBQMT", he = "index__textBox___YV7UB", me = "index__title___PYI7M", ve = "index__description___sfSxp", pe = "index__action___s59kb";
        function Se() {
            return (0, F.jsxs)(l.Ss, {
                className: de,
                children: [ (0, F.jsxs)(l.Ss, {
                    className: _e,
                    children: [ (0, F.jsx)(l.Ss, {
                        className: fe,
                        children: (0, F.jsx)(l.Ss, {
                            className: xe
                        })
                    }), (0, F.jsxs)(l.Ss, {
                        className: he,
                        children: [ (0, F.jsx)(l.Ss, {
                            className: me,
                            children: "私教体验，需开通私教会员卡"
                        }), (0, F.jsx)(l.Ss, {
                            className: ve,
                            children: "快去办理，解锁这群格斗高手！"
                        }) ]
                    }) ]
                }), (0, F.jsx)(g.A, {
                    fullWidth: !0,
                    type: "primary",
                    size: "large",
                    className: pe,
                    onClick: function() {
                        u().switchTab({
                            url: "/pages/member/index"
                        });
                    },
                    children: "立即加入"
                }) ]
            });
        }
        var be = "index__root___wByBZ", ge = "index__loadingBox___lrWjq", je = "index__drawerContent___gmS3o", Ce = "index__selectCardLabel___LZtCK", Ne = "index__memberSelectBox___s9bRZ", ke = "index__confirmButtonBox___D5BGO", we = "index__tipBox___eYZ3B", ye = "index__tipHeader___oP9rD", Te = "index__tipTitle___sKHBI", Ae = "index__tipContent___F7JzD";
        function Le(e) {
            var n;
            return null !== (n = e[0]) && void 0 !== n ? n : null;
        }
        function Be(e, n) {
            var t = n.match(/(\d{1,2}):(\d{2})/);
            if (!e || !t) return null;
            var s = r(t, 3), a = s[1], i = s[2];
            return x().unix(e.date).hour(Number(a)).minute(Number(i)).second(0).unix();
        }
        function Ie() {
            var s, a = (0, d.useRef)(null), i = (0, p.k)(function(e) {
                return e.userInfo;
            }), o = $(), c = o.store, _ = o.setStore, f = o.storeList, h = o.setStoreList, m = o.currentAvailableDate, v = o.setCurrentAvailableDate, S = o.availableDateList, C = o.setAvailableDateList, w = o.currentCourse, y = o.setCurrentCourse, T = o.availableCoachTimeSlotList, A = o.setAvailableCoachTimeSlotList, L = o.currentCoachTimeSlot, B = o.setCurrentCoachTimeSlot, I = o.currentCoach, D = o.setCurrentCoach, E = (0, 
            d.useState)([]), M = r(E, 2), H = M[0], z = M[1], P = (0, d.useState)(null), W = r(P, 2), R = W[0], G = W[1], Q = (0, 
            d.useState)(null), Y = r(Q, 2), q = Y[0], J = Y[1], K = (0, d.useState)(!1), V = r(K, 2), X = V[0], Z = V[1], O = (0, 
            d.useState)(!0), U = r(O, 2), ee = U[0], te = U[1];
            (0, d.useEffect)(function() {
                if (console.log("storeList:", f), !(f.length > 0)) {
                    var e = !1;
                    return te(!0), ne().then(function() {
                        var r = t(n().mark(function t(r) {
                            var s;
                            return n().wrap(function(n) {
                                for (;;) switch (n.prev = n.next) {
                                  case 0:
                                    if (!e) {
                                        n.next = 2;
                                        break;
                                    }
                                    return n.abrupt("return");

                                  case 2:
                                    if (r.data.list && 0 !== r.data.list.length) {
                                        n.next = 4;
                                        break;
                                    }
                                    return n.abrupt("return");

                                  case 4:
                                    return n.next = 6, (0, se.jD)(r.data.list);

                                  case 6:
                                    s = n.sent, c || _(s[0]), h(s);

                                  case 8:
                                  case "end":
                                    return n.stop();
                                }
                            }, t);
                        }));
                        return function(e) {
                            return r.apply(this, arguments);
                        };
                    }()).finally(function() {
                        e || te(!1);
                    }), function() {
                        e = !0;
                    };
                }
                te(!1);
            }, [ f, c, _, h ]), (0, d.useEffect)(function() {
                c && (0, re.s)({
                    storeId: c.id
                }).then(function(e) {
                    if (console.log("availableDateList:", e.data.list), C(e.data.list), e.data.list.length > 0) {
                        var n = function(e) {
                            var n, t;
                            return null !== (n = null !== (t = e.find(function(e) {
                                return e.available && e.courseList.length > 0;
                            })) && void 0 !== t ? t : e.find(function(e) {
                                return e.available;
                            })) && void 0 !== n ? n : e[0];
                        }(e.data.list), t = null == n ? void 0 : n.courseList[0];
                        if (!n) return;
                        if (v(n), !t) return y(null), A([]), B(""), void D(null);
                        y(t);
                    }
                });
            }, [ c, C, v, y, A, D, B ]), (0, d.useEffect)(function() {
                c && m && w && (B(""), D(null), (0, ae.y)({
                    courseId: w.id,
                    storeId: c.id,
                    date: m.date
                }).then(function(e) {
                    console.log("bookingList:", e.data.list), A(e.data.list);
                }));
            }, [ c, m, w, A, D, B ]), console.log("Current store:", c), console.log("Current available date:", m), 
            console.log("Current course:", w), console.log("Current coach availableCoachTimeSlotList:", T), 
            console.log("Current coach time slot:", L);
            var de = (null === (s = T.find(function(e) {
                return e.timeStr === L;
            })) || void 0 === s ? void 0 : s.coachList) || [], _e = function() {
                J(null), z([]), G(null), Z(!1);
            }, fe = function() {
                var e = t(n().mark(function e() {
                    var t, r, s;
                    return n().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if (c && m && w) {
                                e.next = 2;
                                break;
                            }
                            return e.abrupt("return");

                          case 2:
                            return e.next = 4, (0, ae.y)({
                                courseId: w.id,
                                storeId: c.id,
                                date: m.date
                            });

                          case 4:
                            if (t = e.sent, A(t.data.list), !(t.data.list.length > 0)) {
                                e.next = 11;
                                break;
                            }
                            if (r = t.data.list.find(function(e) {
                                return e.timeStr === L;
                            })) {
                                e.next = 9;
                                break;
                            }
                            return e.abrupt("return", (B(""), void D(null)));

                          case 9:
                            return s = r.coachList.find(function(e) {
                                return e.id === (null == I ? void 0 : I.id);
                            }), e.abrupt("return", (B(r.timeStr), void D(s || Le(r.coachList))));

                          case 11:
                            B(""), D(null);

                          case 12:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                }));
                return function() {
                    return e.apply(this, arguments);
                };
            }(), xe = function() {
                var e = t(n().mark(function e(t) {
                    var r, s, o, l;
                    return n().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if (null != i && i.id) {
                                e.next = 2;
                                break;
                            }
                            return e.abrupt("return", void u().navigateTo({
                                url: "/pages/user/login/index"
                            }));

                          case 2:
                            if (c && m && w) {
                                e.next = 4;
                                break;
                            }
                            return e.abrupt("return", void u().showToast({
                                title: "预约参数不完整",
                                icon: "none"
                            }));

                          case 4:
                            if (L) {
                                e.next = 6;
                                break;
                            }
                            return e.abrupt("return", void u().showToast({
                                title: "请选择时间段",
                                icon: "none"
                            }));

                          case 6:
                            if (r = Be(m, L)) {
                                e.next = 9;
                                break;
                            }
                            return e.abrupt("return", void u().showToast({
                                title: "时间段解析失败",
                                icon: "none"
                            }));

                          case 9:
                            return s = {
                                courseId: w.id,
                                startTime: r,
                                coachId: t.id,
                                storeId: c.id
                            }, D(t), e.prev = 11, e.next = 14, (0, ie.C)(s);

                          case 14:
                            if (200 === (l = e.sent).code) {
                                e.next = 17;
                                break;
                            }
                            return e.abrupt("return", void u().showToast({
                                title: l.msg,
                                icon: "none"
                            }));

                          case 17:
                            if (!(Array.isArray(l.data.list) && l.data.list.length > 0)) {
                                e.next = 19;
                                break;
                            }
                            return e.abrupt("return", (J(s), z(l.data.list), G(l.data.list[0]), void (null === (o = a.current) || void 0 === o || o.open())));

                          case 19:
                            u().showToast({
                                title: "暂无可用会员卡",
                                icon: "none"
                            }), e.next = 25;
                            break;

                          case 22:
                            e.prev = 22, e.t0 = e.catch(11), console.error("pt pre-booking failed:", e.t0), 
                            u().showToast({
                                title: "获取会员卡失败",
                                icon: "none"
                            });

                          case 25:
                          case "end":
                            return e.stop();
                        }
                    }, e, null, [ [ 11, 22 ] ]);
                }));
                return function(n) {
                    return e.apply(this, arguments);
                };
            }(), he = function() {
                var r = t(n().mark(function t() {
                    var r, s;
                    return n().wrap(function(n) {
                        for (;;) switch (n.prev = n.next) {
                          case 0:
                            if (!q || null == R || !R.id || X) {
                                n.next = 21;
                                break;
                            }
                            return Z(!0), n.prev = 2, n.next = 5, (0, ie.C)(e(e({}, q), {}, {
                                cardId: R.id
                            }));

                          case 5:
                            if (200 === (s = n.sent).code) {
                                n.next = 8;
                                break;
                            }
                            return n.abrupt("return", void u().showToast({
                                title: s.msg,
                                icon: "none"
                            }));

                          case 8:
                            return _e(), null !== (r = a.current) && void 0 !== r && r.close(), u().showToast({
                                title: "预约成功",
                                icon: "none"
                            }), n.next = 13, fe();

                          case 13:
                            n.next = 18;
                            break;

                          case 15:
                            n.prev = 15, n.t0 = n.catch(2), console.error("pt booking failed:", n.t0), u().showToast({
                                title: "预约失败",
                                icon: "none"
                            });

                          case 18:
                            return n.prev = 18, Z(!1), n.finish(18);

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
            return ee ? (0, F.jsx)(l.Ss, {
                className: ge,
                children: (0, F.jsx)(k.ah, {
                    mode: "center",
                    content: "加载中..."
                })
            }) : c ? (0, F.jsxs)(l.Ss, {
                className: be,
                children: [ (0, F.jsx)(oe.A, {
                    store: c,
                    onSwitch: function() {
                        u().showActionSheet({
                            itemList: f.map(function(e) {
                                return e.name;
                            }),
                            success: function(e) {
                                _(f[e.tapIndex]);
                            }
                        });
                    }
                }), (0, F.jsx)(N.A, {
                    items: null == S ? void 0 : S.map(function(e) {
                        return {
                            primary: x()(e.dateStr).format("DD"),
                            secondary: x()(e.dateStr).format("ddd"),
                            tertiary: e.available ? "可预约" : "排课中",
                            disabled: !e.available
                        };
                    }),
                    current: null == S ? void 0 : S.findIndex(function(e) {
                        return e.dateStr === (null == m ? void 0 : m.dateStr);
                    }),
                    onChange: function(e) {
                        var n = S[e];
                        if (n) {
                            v(n);
                            var t = n.courseList[0];
                            if (!t) return y(null), A([]), B(""), D(null), void u().showToast({
                                title: "该日期课程为空",
                                icon: "none"
                            });
                            y(t);
                        }
                    }
                }), (0, F.jsx)(le.A, {
                    items: (null == m ? void 0 : m.courseList.map(function(e) {
                        return e.name;
                    })) || [],
                    current: null == m ? void 0 : m.courseList.findIndex(function(e) {
                        return e.id === (null == w ? void 0 : w.id);
                    }),
                    onChange: function(e) {
                        var n = null == m ? void 0 : m.courseList[e];
                        n && y(n);
                    }
                }), (0, F.jsx)(ue.A, {
                    items: T.map(function(e) {
                        return {
                            value: e.timeStr,
                            disabled: !e.available
                        };
                    }),
                    current: T.findIndex(function(e) {
                        return e.timeStr === L;
                    }),
                    onChange: function(e) {
                        var n = T[e];
                        n && (B(n.timeStr), D(Le(n.coachList)));
                    }
                }), (0, F.jsx)(ce.A, {
                    items: de,
                    store: c,
                    current: de.findIndex(function(e) {
                        return e.id === (null == I ? void 0 : I.id);
                    }),
                    onChange: function(e) {
                        var n = de[e];
                        n && D(n);
                    },
                    onBook: function(e) {
                        var n = de[e];
                        n && xe(n);
                    }
                }), (0, F.jsx)(b.A, {
                    showCloseButton: !0,
                    ref: a,
                    onClose: function() {
                        _e();
                    },
                    children: (0, F.jsxs)(l.Ss, {
                        className: je,
                        children: [ (0, F.jsx)(l.Ss, {
                            className: Ce,
                            children: "选择可用会员卡"
                        }), (0, F.jsx)(l.Ss, {
                            className: Ne,
                            children: (0, F.jsx)(j.A, {
                                value: R,
                                options: H,
                                onSelect: function(e) {
                                    G(e);
                                }
                            })
                        }), (0, F.jsxs)(l.Ss, {
                            className: we,
                            children: [ (0, F.jsxs)(l.Ss, {
                                className: ye,
                                children: [ (0, F.jsx)(l.In, {
                                    type: "warn",
                                    size: 14,
                                    color: "#e7262a"
                                }), (0, F.jsx)(l.Ss, {
                                    className: Te,
                                    children: "温馨提示："
                                }) ]
                            }), (0, F.jsx)(l.Ss, {
                                className: Ae,
                                children: "课程开始前4小时内不可自行取消预约。"
                            }) ]
                        }), (0, F.jsx)(l.Ss, {
                            className: ke,
                            children: (0, F.jsx)(g.A, {
                                type: "primary",
                                onClick: he,
                                children: "确认预约"
                            })
                        }) ]
                    })
                }) ]
            }) : (0, F.jsx)(l.Ss, {
                className: be,
                children: (0, F.jsx)(Se, {})
            });
        }
        var De = i(5453), Fe = "index__root___B13iW", Ee = "index__loadingBox___migDf";
        function Me() {
            var e = (0, De.S)(), s = e.store, a = e.setStore, i = e.storeList, o = e.setStoreList, c = e.coachList, _ = e.setCoachList, f = e.currentCoach, x = e.setCurrentCoach, h = (0, 
            d.useState)(!0), m = r(h, 2), v = m[0], p = m[1];
            (0, d.useEffect)(function() {
                if (!(i.length > 0)) {
                    var e = !1;
                    return p(!0), ne().then(function() {
                        var r = t(n().mark(function t(r) {
                            var i;
                            return n().wrap(function(n) {
                                for (;;) switch (n.prev = n.next) {
                                  case 0:
                                    if (!e) {
                                        n.next = 2;
                                        break;
                                    }
                                    return n.abrupt("return");

                                  case 2:
                                    if (r.data.list && 0 !== r.data.list.length) {
                                        n.next = 4;
                                        break;
                                    }
                                    return n.abrupt("return");

                                  case 4:
                                    return n.next = 6, (0, se.jD)(r.data.list);

                                  case 6:
                                    i = n.sent, s || a(i[0]), o(i);

                                  case 8:
                                  case "end":
                                    return n.stop();
                                }
                            }, t);
                        }));
                        return function(e) {
                            return r.apply(this, arguments);
                        };
                    }()).finally(function() {
                        e || p(!1);
                    }), function() {
                        e = !0;
                    };
                }
                p(!1);
            }, [ i, s, a, o ]), (0, d.useEffect)(function() {
                if (s) {
                    var e = !1;
                    return (0, ae.V)({
                        storeId: s.id
                    }).then(function(n) {
                        if (!e) {
                            var t = n.list || [];
                            if (_(t), 0 !== t.length) {
                                var r = t.find(function(e) {
                                    return e.id === (null == f ? void 0 : f.id);
                                });
                                x(r || t[0]);
                            } else x(null);
                        }
                    }), function() {
                        e = !0;
                    };
                }
            }, [ s, null == f ? void 0 : f.id, _, x ]);
            return v ? (0, F.jsx)(l.Ss, {
                className: Ee,
                children: (0, F.jsx)(k.ah, {
                    mode: "center",
                    content: "加载中..."
                })
            }) : s ? (0, F.jsxs)(l.Ss, {
                className: Fe,
                children: [ (0, F.jsx)(oe.A, {
                    store: s,
                    onSwitch: function() {
                        u().showActionSheet({
                            itemList: i.map(function(e) {
                                return e.name;
                            }),
                            success: function(e) {
                                a(i[e.tapIndex]);
                            }
                        });
                    }
                }), (0, F.jsx)(ce.A, {
                    items: c,
                    store: s,
                    current: c.findIndex(function(e) {
                        return e.id === (null == f ? void 0 : f.id);
                    }),
                    onChange: function(e) {
                        var n = c[e];
                        n && (x(n), u().navigateTo({
                            url: "/pages/booking/pt-coach/index"
                        }));
                    },
                    showBookButton: !1
                }) ]
            }) : (0, F.jsx)(l.Ss, {
                className: Fe,
                children: (0, F.jsx)(Se, {})
            });
        }
        var He = "index__root___WAdHo", ze = "index__icon___lPK45", Pe = function(e) {
            return (0, F.jsxs)(l.Ss, {
                className: He,
                onClick: function() {
                    u().navigateTo({
                        url: "/pages/booking/index"
                    });
                },
                children: [ (0, F.jsx)(l.Ss, {
                    className: ze
                }), "约课记录" ]
            });
        }, We = "index__container___Vpi7T", Re = "index__tip___msj4E", Ge = "index__empty___rGCx5", Qe = "index__drawerContent___DSX7Q", Ye = "index__selectCardLabel___Xgh5F", qe = "index__tipBox___PidtB", Je = "index__tipHeader___Qc97z", Ke = "index__tipTitle___wNpUJ", Ve = "index__tipContent___aMQZo", Xe = "index__confirmButtonBox___hwwyN", Ze = [ {
            title: "团课预约"
        }, {
            title: "私教时间预约"
        }, {
            title: "私教教练预约"
        } ];
        function Oe() {
            var e = (0, d.useState)(0), s = r(e, 2), a = s[0], i = s[1], o = (0, d.useRef)(null), c = (0, 
            p.k)(function(e) {
                return e.userInfo;
            }), f = v(), m = f.classList, k = f.refetch, w = (0, d.useState)(null), y = r(w, 2), T = y[0], A = y[1], L = (0, 
            d.useState)([]), B = r(L, 2), I = B[0], D = B[1], M = (0, d.useState)(null), H = r(M, 2), z = H[0], P = H[1], W = (0, 
            d.useState)(x()()), R = r(W, 2), G = R[0], Q = R[1], Y = (0, d.useMemo)(function() {
                return (0, _.debounce)(function() {
                    var e = t(n().mark(function e(t) {
                        var r, s, a;
                        return n().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                              case 0:
                                if (null != c && c.id) {
                                    e.next = 2;
                                    break;
                                }
                                return e.abrupt("return", void u().navigateTo({
                                    url: "/pages/user/login/index"
                                }));

                              case 2:
                                return e.next = 4, (0, h.Qe)({
                                    classId: t.id,
                                    cardId: null == z ? void 0 : z.id
                                });

                              case 4:
                                if (200 !== (r = e.sent).code) {
                                    e.next = 11;
                                    break;
                                }
                                if (!(Array.isArray(r.data.list) && r.data.list.length >= 1)) {
                                    e.next = 8;
                                    break;
                                }
                                return e.abrupt("return", (A(t), D(r.data.list), P(r.data.list[0]), void (null === (s = o.current) || void 0 === s || s.open())));

                              case 8:
                                console.log("Booking successful:", r.data), A(null), D([]), P(null), null !== (a = o.current) && void 0 !== a && a.close(), 
                                u().showToast({
                                    title: "预约成功",
                                    icon: "none"
                                }), k(), e.next = 12;
                                break;

                              case 11:
                                console.error("Booking failed:", r.msg), u().showToast({
                                    title: r.msg,
                                    icon: "none"
                                });

                              case 12:
                              case "end":
                                return e.stop();
                            }
                        }, e);
                    }));
                    return function(n) {
                        return e.apply(this, arguments);
                    };
                }(), 500, {
                    leading: !0,
                    trailing: !1
                });
            }, [ c, z, k ]);
            function q() {
                return (q = t(n().mark(function e(t) {
                    var r;
                    return n().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            return e.next = 2, u().showModal({
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
                            return e.next = 7, (0, h.Se)({
                                id: t,
                                idType: 2
                            });

                          case 7:
                            200 === (r = e.sent).code ? (console.log("Cancellation successful:", r.data), u().showToast({
                                title: "取消预约成功",
                                icon: "none"
                            }), k()) : (console.error("Cancellation failed:", r.msg), u().showToast({
                                title: r.msg,
                                icon: "none"
                            }));

                          case 9:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                }))).apply(this, arguments);
            }
            var J = (0, d.useMemo)(function() {
                return function() {
                    for (var e = [], n = 0; n < 7; n++) e.push(x()().add(n, "day"));
                    return e;
                }();
            }, []), K = (0, d.useMemo)(function() {
                return J.map(function(e) {
                    return {
                        primary: e.format("DD"),
                        secondary: e.isSame(x()(), "day") ? "今天" : e.format("ddd"),
                        tertiary: "可预约"
                    };
                });
            }, [ J ]), V = (0, d.useMemo)(function() {
                return J.findIndex(function(e) {
                    return e.isSame(G, "day");
                });
            }, [ J, G ]), X = (0, d.useMemo)(function() {
                return function(e, n) {
                    return null == e ? void 0 : e.filter(function(e) {
                        return x().unix(e.startTime).isSame(n, "day");
                    });
                }(m, G);
            }, [ m, G ]);
            return (0, F.jsx)(S.A, {
                fixed: !0,
                headerRender: (0, F.jsx)(l.Ss, {
                    className: We,
                    children: (0, F.jsx)(C.T, {
                        current: a,
                        onChange: i,
                        tabList: Ze
                    })
                }),
                children: (0, F.jsxs)(l.Ss, {
                    className: We,
                    children: [ 0 === a && (0, F.jsx)(E, {}), 0 === a && (0, F.jsx)(N.A, {
                        items: K,
                        current: V,
                        onChange: function(e) {
                            var n = J[e];
                            n && Q(n);
                        }
                    }), 0 === a && (0, F.jsxs)(l.Ss, {
                        className: Re,
                        children: [ G.isSame(x()(), "day") ? "今天" : "", " ", G.format("MM.DD ddd") ]
                    }), 0 === a && 0 === X.length && (0, F.jsx)(l.Ss, {
                        className: Ge
                    }), 0 === a && (null == X ? void 0 : X.map(function(e) {
                        return (0, F.jsx)(l.Ss, {
                            children: (0, F.jsx)(U, {
                                data: e,
                                showAction: !0,
                                onBooking: function() {
                                    console.log("Booking class:", e), Y(e);
                                },
                                onCancel: function() {
                                    (function(e) {
                                        q.apply(this, arguments);
                                    })(e.id), console.log("Cancel booking for class:", e);
                                }
                            })
                        }, e.id);
                    })), 1 === a && (0, F.jsx)(Ie, {}), 2 === a && (0, F.jsx)(Me, {}), Boolean(null == c ? void 0 : c.id) && (0, 
                    F.jsx)(Pe, {}), (0, F.jsx)(b.A, {
                        showCloseButton: !0,
                        ref: o,
                        onClose: function() {
                            A(null), D([]), P(null);
                        },
                        children: (0, F.jsxs)(l.Ss, {
                            className: Qe,
                            children: [ (0, F.jsx)(l.Ss, {
                                className: Ye,
                                children: "选择可用会员卡"
                            }), (0, F.jsx)(l.Ss, {
                                style: {
                                    flex: 1,
                                    overflow: "auto",
                                    width: "100%"
                                },
                                children: (0, F.jsx)(j.A, {
                                    value: z,
                                    options: I,
                                    onSelect: function(e) {
                                        P(e);
                                    }
                                })
                            }), (0, F.jsxs)(l.Ss, {
                                className: qe,
                                children: [ (0, F.jsxs)(l.Ss, {
                                    className: Je,
                                    children: [ (0, F.jsx)(l.In, {
                                        type: "warn",
                                        size: 14,
                                        color: "#e7262a"
                                    }), (0, F.jsx)(l.Ss, {
                                        className: Ke,
                                        children: "温馨提示："
                                    }) ]
                                }), (0, F.jsx)(l.Ss, {
                                    className: Ve,
                                    children: "课程开始前4小时内不可自行取消预约。"
                                }) ]
                            }), (0, F.jsx)(l.Ss, {
                                className: Xe,
                                children: (0, F.jsx)(g.A, {
                                    type: "primary",
                                    onClick: function() {
                                        Y(T);
                                    },
                                    children: "确认"
                                })
                            }) ]
                        })
                    }) ]
                })
            });
        }
        var Ue = (0, o.eU)(Oe, "pages/index/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "约课",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white",
            backgroundColor: "#E7262A"
        } || {});
        Oe && Oe.behaviors && (Ue.behaviors = (Ue.behaviors || []).concat(Oe.behaviors)), 
        Page(Ue);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 5068, e(e.s = n);
        var n;
    }), e.O();
} ]);