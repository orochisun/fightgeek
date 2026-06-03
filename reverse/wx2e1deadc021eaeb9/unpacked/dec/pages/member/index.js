var e = require("../../@babel/runtime/helpers/regeneratorRuntime"), n = require("../../@babel/runtime/helpers/asyncToGenerator"), r = require("../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 663 ], {
    1018: function(i, t, a) {
        var s = a(4779), c = a(2012), o = a(5797), l = a.n(o), d = a(6298), u = a(4910), _ = a(6788), x = a(758), p = a(9706), f = a(1904), v = a(7907), g = a(1681), h = a(5119), y = a.n(h), b = {
            card: "index__card___ceOag",
            content: "index__content___b37tf",
            price: "index__price___HYRxl",
            type1: "index__type1___E1W26",
            type2: "index__type2___zhA8g",
            type5: "index__type5___ObA9r"
        }, m = a(6070), j = function(e) {
            var n = e.data;
            return (0, m.jsx)(c.Ss, {
                className: y()(b.card, b["type" + (null == n ? void 0 : n.type)]),
                children: (0, m.jsx)(c.Ss, {
                    className: b.content,
                    children: (0, m.jsx)(c.Ss, {
                        className: b.price,
                        children: null == n ? void 0 : n.regionalDiscount
                    })
                })
            });
        }, k = a(1042), S = a.n(k), N = a(8149), w = "index__unlogin___N8ufZ", T = "index__register___LFBXa", B = "index__root___F6MxL", A = "index__body___jII6v", I = "index__card___IfHHj", P = "index__title___Larla", C = "index__more___BngpZ", D = "index__plans___b3JPe", O = "index__plan___fyOex", F = "index__label___kXekl";
        function E() {
            var i, t = (0, p.A)().city, a = (0, x.useState)([]), s = r(a, 2), o = s[0], h = s[1], b = (0, 
            u.k)(function(e) {
                return e.userInfo;
            }), k = (0, x.useCallback)(n(e().mark(function n() {
                var r;
                return e().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        if (null != t && t.id) {
                            e.next = 2;
                            break;
                        }
                        return e.abrupt("return");

                      case 2:
                        return console.log("Fetching card list for city ID:", t.id), e.next = 5, (0, _.hB)(null == t ? void 0 : t.id);

                      case 5:
                        r = e.sent, h(r);

                      case 7:
                      case "end":
                        return e.stop();
                    }
                }, n);
            })), [ null == t ? void 0 : t.id ]);
            function E() {
                return (E = n(e().mark(function n(r) {
                    var i, t;
                    return e().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if ("getPhoneNumber:ok" !== r.detail.errMsg) {
                                e.next = 16;
                                break;
                            }
                            return e.next = 3, l().login();

                          case 3:
                            return i = e.sent, e.next = 6, (0, d.kz)(i.code, r.detail.code);

                          case 6:
                            if (t = e.sent, console.log("Registration response:", t), e.t0 = 200 === t.code, 
                            !e.t0) {
                                e.next = 14;
                                break;
                            }
                            return e.next = 12, (0, d.y1)();

                          case 12:
                            return e.next = 14, (0, d.LF)();

                          case 14:
                            e.next = 17;
                            break;

                          case 16:
                            console.error("Failed to get phone number:", r.detail.errMsg);

                          case 17:
                          case "end":
                            return e.stop();
                        }
                    }, n);
                }))).apply(this, arguments);
            }
            function L(e) {
                console.log("Card clicked:", e), 5 !== e.type ? l().navigateTo({
                    url: "/pages/buy-card/index?id=".concat(e.id, "&type=").concat(e.type, "&day=").concat(e.validDays)
                }) : l().navigateTo({
                    url: "/pages/buy-card-special/index?id=".concat(e.id, "&type=").concat(e.type, "&day=").concat(e.validDays)
                });
            }
            if ((0, x.useEffect)(function() {
                (null == t ? void 0 : t.id) && k();
            }, [ null == t ? void 0 : t.id, k ]), (0, x.useEffect)(function() {
                k();
            }, [ null == b ? void 0 : b.id ]), null == b || !b.id) return (0, m.jsx)(c.Ss, {
                className: w,
                children: (0, m.jsx)(c.$n, {
                    className: T,
                    openType: "getPhoneNumber",
                    onGetPhoneNumber: function(e) {
                        console.log("Button clicked, event:", e), function(e) {
                            E.apply(this, arguments);
                        }(e);
                    },
                    children: "Register"
                })
            });
            var R = S()(o, function(e) {
                return f.S6[e.type];
            }, {});
            return (0, m.jsxs)(c.Ss, {
                className: B,
                children: [ (0, m.jsx)(v.A, {
                    userInfo: b
                }), (0, m.jsxs)(c.Ss, {
                    className: A,
                    children: [ (0, m.jsx)(c.Ss, {
                        className: I,
                        children: (0, m.jsx)(g.A, {
                            userInfo: b
                        })
                    }), null === (i = Object.keys(R)) || void 0 === i ? void 0 : i.map(function(e) {
                        var n, r, i = null === (n = R[e]) || void 0 === n || null === (r = n.sort(function(e, n) {
                            return e.validDays - n.validDays;
                        })) || void 0 === r ? void 0 : r.sort(function(e, n) {
                            return e.originPrice - n.originPrice;
                        }).splice(0, 4);
                        return (0, m.jsxs)(c.Ss, {
                            className: I,
                            children: [ (0, m.jsxs)(c.Ss, {
                                className: P,
                                children: [ "超值", e ]
                            }), (0, m.jsxs)(c.Ss, {
                                className: C,
                                onClick: function() {
                                    L(i[0]);
                                },
                                children: [ (0, m.jsx)(c.Ss, {
                                    children: "查看更多"
                                }), (0, m.jsx)(N.Xx, {
                                    value: "chevron-right",
                                    size: "14",
                                    color: "rgba(134, 145, 152, 1)"
                                }) ]
                            }), (0, m.jsx)(c.Ss, {
                                className: D,
                                children: null == i ? void 0 : i.map(function(e) {
                                    return (0, m.jsxs)(c.Ss, {
                                        className: y()(O, "press"),
                                        onClick: function() {
                                            L(e);
                                        },
                                        children: [ (0, m.jsx)(j, {
                                            data: e
                                        }), (0, m.jsx)(c.Ss, {
                                            className: F,
                                            children: "会员价"
                                        }) ]
                                    }, e.id);
                                })
                            }) ]
                        }, e);
                    }) ]
                }) ]
            });
        }
        var L = (0, s.eU)(E, "pages/member/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "会员",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white",
            navigationStyle: "custom",
            backgroundColor: "#f2f2f2"
        } || {});
        E && E.behaviors && (L.behaviors = (L.behaviors || []).concat(E.behaviors)), Page(L);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 1018, e(e.s = n);
        var n;
    }), e.O();
} ]);