var e = require("../../@babel/runtime/helpers/regeneratorRuntime"), n = require("../../@babel/runtime/helpers/asyncToGenerator"), t = require("../../@babel/runtime/helpers/objectSpread2"), r = require("../../@babel/runtime/helpers/slicedToArray"), a = require("../../@babel/runtime/helpers/defineProperty");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 4618 ], {
    5211: function(o, i, s) {
        var c = s(4779), u = s(2012), l = s(5797), d = s.n(l), v = s(758), f = s(5119), p = s.n(f), x = s(2935), g = s(6298), _ = s(5727), h = s(7870), m = s(7338), b = s(6384), y = s(3059), k = {
            options: "index__options___HZ7wg",
            option: "index__option___LhYkx",
            selected: "index__selected___xQOne",
            label: "index__label___H3IuF"
        }, S = s(6070), T = (0, v.forwardRef)(function(e, n) {
            (0, v.useImperativeHandle)(n, function() {
                return {};
            });
            var t = e.label, r = e.options, o = void 0 === r ? [] : r;
            return (0, S.jsxs)(u.Ss, {
                className: k.root,
                children: [ (0, S.jsx)(u.Ss, {
                    className: k.label,
                    children: t
                }), (0, S.jsx)(u.Ss, {
                    className: k.options,
                    children: null == o ? void 0 : o.map(function(n) {
                        return (0, S.jsx)(u.Ss, {
                            className: p()(k.option, "press", a({}, k.selected, n.value === e.value)),
                            onClick: function() {
                                return function(n) {
                                    var t;
                                    null === (t = e.onSelect) || void 0 === t || t.call(e, n);
                                }(n.value);
                            },
                            children: n.label
                        }, n.value);
                    })
                }) ]
            });
        }), w = s(6643), j = s(7160), C = s(7634), N = s(4910), I = s(9706), P = s(2889), A = s(8149), D = s(6788), L = s(1042), q = s.n(L);
        function O(e, n) {
            for (var t = Object.keys(n), r = [], a = e, o = function() {
                var e, t = s[i], o = n[t], c = Object.keys(q()(a, t));
                -1 === c.indexOf(o) && (o = c[0]), r.push({
                    key: t,
                    value: o,
                    options: c
                }), a = null === (e = a) || void 0 === e ? void 0 : e.filter(function(e) {
                    return e[t] + "" == o + "";
                });
            }, i = 0, s = t; i < s.length; i++) o();
            return r;
        }
        function B(o) {
            var i = o.id, s = (0, I.A)().city, c = (0, v.useState)([]), u = r(c, 2), l = u[0], d = u[1], f = (0, 
            v.useState)([]), p = r(f, 2), x = p[0], g = p[1], _ = (0, v.useState)(0), h = r(_, 2), m = h[0], b = h[1], y = (0, 
            v.useCallback)(n(e().mark(function n() {
                var t, r, a, o, c, u, l, v, f;
                return e().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        if (console.log("fetchTplList"), console.log("id", i), console.log("city?.id", null == s ? void 0 : s.id), 
                        i) {
                            e.next = 2;
                            break;
                        }
                        return e.abrupt("return");

                      case 2:
                        if (null != s && s.id) {
                            e.next = 4;
                            break;
                        }
                        return e.abrupt("return");

                      case 4:
                        return e.next = 6, (0, D.TX)({
                            regionalId: null == s ? void 0 : s.id
                        });

                      case 6:
                        200 === (t = e.sent).code && (c = t.data.list.find(function(e) {
                            return e.id === Number(i);
                        }), u = {
                            validDays: (null == c ? void 0 : c.validDays) + "",
                            mode: (null == c ? void 0 : c.mode) + "",
                            countType: (null == c ? void 0 : c.countType) + "",
                            usageCount: (null == c ? void 0 : c.usageCount) + "",
                            giftCount: (null == c ? void 0 : c.giftCount) + ""
                        }, l = null === (r = t.data.list || []) || void 0 === r || null === (a = r.filter(function(e) {
                            return e.type === (null == c ? void 0 : c.type);
                        })) || void 0 === a || null === (o = a.sort(function(e, n) {
                            return e.validDays - n.validDays;
                        })) || void 0 === o ? void 0 : o.sort(function(e, n) {
                            return e.originPrice - n.originPrice;
                        }), d(l), v = O(l, u), g(v), f = l.findIndex(function(e) {
                            return e.id === Number(i);
                        }), b(f));

                      case 8:
                      case "end":
                        return e.stop();
                    }
                }, n);
            })), [ null == s ? void 0 : s.id, i ]);
            (0, v.useEffect)(function() {
                y();
            }, [ null == s ? void 0 : s.id, y ]);
            return {
                currentIndex: m,
                current: l[m] || {},
                tplList: l,
                fields: x,
                setValue: function(e, n) {
                    var r = t(t({}, x.reduce(function(e, n) {
                        return t(t({}, e), {}, a({}, n.key, n.value));
                    }, {})), {}, a({}, e, n)), o = O(l, r);
                    g(o);
                    var i = l.findIndex(function(e) {
                        var n = !0;
                        return o.forEach(function(t) {
                            e[t.key] + "" != t.value + "" && (n = !1);
                        }), n;
                    });
                    b(i);
                },
                moveToIndex: function(e) {
                    var n = l[e], t = {
                        validDays: (null == n ? void 0 : n.validDays) + "",
                        mode: (null == n ? void 0 : n.mode) + "",
                        countType: (null == n ? void 0 : n.countType) + "",
                        usageCount: (null == n ? void 0 : n.usageCount) + "",
                        giftCount: (null == n ? void 0 : n.giftCount) + ""
                    }, r = O(l, t);
                    g(r), b(e);
                }
            };
        }
        var G = s(1904), R = {
            validDays: "请选择天数",
            mode: "单 / 通店面选择",
            countType: "限次 / 无限卡",
            usageCount: "限次次数",
            giftCount: "赠送次数"
        }, V = {
            validDays: "请选择天数",
            mode: "单 / 通店面选择",
            countType: "限次 / 无限卡",
            usageCount: "限次次数",
            giftCount: "赠送天数"
        }, E = function(e, n) {
            return (2 === (null == n ? void 0 : n.countType) ? V : R)[e] || "";
        }, F = function(e, n, t) {
            var r = 2 === (null == t ? void 0 : t.countType) ? "天" : "次";
            switch (e) {
              case "validDays":
                return n + "天";

              case "mode":
                return G.V9[n] || "";

              case "countType":
                return G.n9[n] || "";

              case "usageCount":
                return 2 === (null == t ? void 0 : t.countType) ? "不限次" : n + r;

              case "giftCount":
                return n + r;

              default:
                return [];
            }
        }, Z = {
            root: "index__root___DXh9o",
            content: "index__content___c5f31",
            card: "index__card___yu1tP",
            picker: "index__picker___dVoZh",
            checkbox: "index__checkbox___AXcWm",
            forms: "index__forms___nV5gp",
            footerContent: "index__footerContent___SBxya",
            price: "index__price___Z2G81",
            now: "index__now___mq0RU",
            strong: "index__strong___G8Saa",
            original: "index__original___cBmYP",
            button: "index__button___cZtF9",
            disabled: "index__disabled___hjG0B"
        };
        function H() {
            var t = (0, v.useState)(0), o = r(t, 2), i = o[0], s = o[1];
            (0, v.useEffect)(function() {
                var e, n, t = null === (e = d().getCurrentInstance()) || void 0 === e || null === (n = e.router) || void 0 === n ? void 0 : n.params;
                s(Number(null == t ? void 0 : t.id));
            }, []);
            var c = B({
                id: i
            }), l = c.tplList, f = c.fields, k = c.setValue, D = c.moveToIndex, L = c.current, q = c.currentIndex, O = (0, 
            N.k)(function(e) {
                return e.userInfo;
            }), G = (0, I.A)().store, R = (0, v.useState)(null), V = r(R, 2), H = V[0], M = V[1], X = (0, 
            v.useState)(!0), J = r(X, 2), U = J[0], Y = J[1], $ = (0, v.useState)("wechat"), Q = r($, 2), W = Q[0], z = Q[1];
            function K(e) {
                return ee.apply(this, arguments);
            }
            function ee() {
                return (ee = n(e().mark(function n(t) {
                    var r, a, o, i;
                    return e().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            r = 10, a = 5e3, o = 0;

                          case 2:
                            if (!(o < r)) {
                                e.next = 27;
                                break;
                            }
                            return e.prev = 3, console.log("开始第".concat(o + 1, "次轮询支付状态")), e.next = 7, (0, 
                            C.G)({
                                sn: t,
                                orderType: 1
                            });

                          case 7:
                            if (i = e.sent, console.log("轮询结果:", i), 200 !== i.code || 1 !== i.data.tradeState) {
                                e.next = 10;
                                break;
                            }
                            return e.abrupt("return", (d().showToast({
                                title: "支付成功",
                                icon: "success"
                            }), {
                                status: "success"
                            }));

                          case 10:
                            if (200 !== i.code || 2 !== i.data.tradeState) {
                                e.next = 12;
                                break;
                            }
                            return e.abrupt("return", (d().showToast({
                                title: "支付失败",
                                icon: "none"
                            }), {
                                status: "failed"
                            }));

                          case 12:
                            if (e.t0 = o < r - 1, !e.t0) {
                                e.next = 16;
                                break;
                            }
                            return e.next = 16, new Promise(function(e) {
                                return setTimeout(e, a);
                            });

                          case 16:
                            e.next = 24;
                            break;

                          case 18:
                            if (e.prev = 18, e.t1 = e.catch(3), console.error("第".concat(o + 1, "次轮询支付状态失败:"), e.t1), 
                            o !== r - 1) {
                                e.next = 22;
                                break;
                            }
                            return e.abrupt("return", (d().showToast({
                                title: "查询支付状态失败，请稍后查看订单",
                                icon: "none"
                            }), {
                                status: "error"
                            }));

                          case 22:
                            return e.next = 24, new Promise(function(e) {
                                return setTimeout(e, a);
                            });

                          case 24:
                            o++, e.next = 2;
                            break;

                          case 27:
                            return e.abrupt("return", {
                                status: "timeout"
                            });

                          case 28:
                          case "end":
                            return e.stop();
                        }
                    }, n, null, [ [ 3, 18 ] ]);
                }))).apply(this, arguments);
            }
            var ne = (0, v.useCallback)(n(e().mark(function n() {
                var t, r, a, o, i, s;
                return e().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        if (!U) {
                            e.next = 49;
                            break;
                        }
                        return d().showLoading({
                            title: "创建订单中...",
                            mask: !0
                        }), e.prev = 2, e.next = 5, (0, j.fS)({
                            userId: null == O ? void 0 : O.id,
                            tplId: L.id,
                            tplType: L.type,
                            storeId: null == G ? void 0 : G.id,
                            singlePrice: L.regionalDiscount,
                            totalNumber: 1,
                            staffId: (null == H ? void 0 : H.id) || 0,
                            salerId: 0,
                            saleType: 1,
                            paymentType: "wechat" === W ? 1 : 2,
                            remark: "",
                            depositOrderId: 0,
                            originPrice: L.originPrice
                        });

                      case 5:
                        if (r = e.sent, console.log("创建订单结果:", r), 200 === r.code) {
                            e.next = 8;
                            break;
                        }
                        return e.abrupt("return", void d().showToast({
                            title: r.msg || "创建订单失败，请稍后再试",
                            icon: "none"
                        }));

                      case 8:
                        return e.next = 10, (0, C.L)({
                            orderSn: null == r || null === (t = r.data) || void 0 === t ? void 0 : t.sn,
                            payType: "wechat" === W ? 1 : 2,
                            serviceType: 1
                        });

                      case 10:
                        if (a = e.sent, console.log("创建支付结果:", a), 200 !== a.code) {
                            e.next = 41;
                            break;
                        }
                        return e.prev = 12, e.next = 15, d().requestPayment({
                            timeStamp: a.data.timestamp,
                            nonceStr: a.data.nonceStr,
                            package: a.data.package,
                            signType: a.data.signType,
                            paySign: a.data.paySign
                        });

                      case 15:
                        if (o = e.sent, console.log("支付结果:", o), "requestPayment:ok" !== o.errMsg) {
                            e.next = 33;
                            break;
                        }
                        return d().showLoading({
                            title: "支付成功，正在确认订单状态...",
                            mask: !0
                        }), e.next = 20, K(null == r || null === (i = r.data) || void 0 === i ? void 0 : i.sn);

                      case 20:
                        if (s = e.sent, d().hideLoading(), "success" !== s.status) {
                            e.next = 30;
                            break;
                        }
                        return d().showLoading({
                            title: "支付成功，正在创建电子合同...",
                            mask: !0
                        }), e.next = 25, (0, g.y1)();

                      case 25:
                        return e.next = 27, (0, P.yy)(1e4);

                      case 27:
                        return e.next = 29, (0, g.LF)();

                      case 29:
                        return e.abrupt("return", void e.sent);

                      case 30:
                        "failed" === s.status ? d().showToast({
                            title: "支付失败，请稍后再试",
                            icon: "none"
                        }) : d().showToast({
                            title: "支付状态确认中，请稍后查看订单",
                            icon: "none"
                        }), e.next = 34;
                        break;

                      case 33:
                        d().showToast({
                            title: "支付失败，请稍后再试",
                            icon: "none"
                        });

                      case 34:
                        e.next = 39;
                        break;

                      case 36:
                        e.prev = 36, e.t0 = e.catch(12), console.error("支付请求错误:", e.t0), "requestPayment:fail cancel" === e.t0.errMsg && (d().showToast({
                            title: "支付已取消",
                            icon: "none"
                        }), d().navigateTo({
                            url: "/pages/order/list/index"
                        }));

                      case 39:
                        e.next = 42;
                        break;

                      case 41:
                        d().showToast({
                            title: "创建支付失败，请稍后再试",
                            icon: "none"
                        });

                      case 42:
                        e.next = 46;
                        break;

                      case 44:
                        e.prev = 44, e.t1 = e.catch(2);

                      case 46:
                        d().hideLoading(), e.next = 50;
                        break;

                      case 49:
                        d().showToast({
                            title: "请同意极斗会员协议",
                            icon: "none"
                        });

                      case 50:
                      case "end":
                        return e.stop();
                    }
                }, n, null, [ [ 2, 44 ], [ 12, 36 ] ]);
            })), [ U, L, H, W, G, O ]), te = (0, v.useMemo)(function() {
                return (0, x.debounce)(ne, 1e3, {
                    leading: !0,
                    trailing: !1
                });
            }, [ ne ]);
            return 0 === l.length ? (0, S.jsx)(u.Ss, {
                className: Z.loading,
                children: (0, S.jsx)(A.ah, {})
            }) : (0, S.jsx)(_.A, {
                className: Z.layout,
                footerRender: (0, S.jsx)(w.A, {
                    children: (0, S.jsxs)(u.Ss, {
                        className: Z.footerContent,
                        children: [ (0, S.jsxs)(u.Ss, {
                            className: Z.price,
                            children: [ (0, S.jsxs)(u.Ss, {
                                className: Z.now,
                                children: [ "现价：", (0, S.jsx)(u.Ss, {
                                    className: Z.strong,
                                    children: (0, P.$g)(null == L ? void 0 : L.regionalDiscount)
                                }) ]
                            }), (0, S.jsxs)(u.Ss, {
                                className: Z.original,
                                children: [ "原价：", (0, P.$g)(null == L ? void 0 : L.originPrice) ]
                            }) ]
                        }), (0, S.jsx)(u.Ss, {
                            className: p()(Z.button, "press", a({}, Z.disabled, !U)),
                            onClick: function() {
                                te();
                            },
                            children: "立即支付"
                        }) ]
                    })
                }),
                children: (0, S.jsxs)(u.Ss, {
                    className: Z.root,
                    children: [ (0, S.jsx)(b.A, {
                        current: q,
                        list: l,
                        onChange: function(e) {
                            D(e);
                        }
                    }), (0, S.jsxs)(u.Ss, {
                        className: Z.content,
                        children: [ (0, S.jsx)(u.Ss, {
                            className: Z.card,
                            children: (0, S.jsx)(u.Ss, {
                                className: Z.forms,
                                children: null == f ? void 0 : f.map(function(e) {
                                    var n;
                                    return (0, S.jsx)(T, {
                                        label: E(e.key, L),
                                        value: e.value,
                                        options: null === (n = e.options) || void 0 === n ? void 0 : n.map(function(n) {
                                            return {
                                                label: F(e.key, n, L),
                                                value: n
                                            };
                                        }),
                                        onSelect: function(n) {
                                            console.log("Selected value:", n), k(e.key, n);
                                        }
                                    }, e.key);
                                })
                            })
                        }), (0, S.jsx)(u.Ss, {
                            className: p()(Z.card, Z.picker),
                            onClick: function() {
                                d().navigateTo({
                                    url: "/pages/store/select/index"
                                });
                            },
                            children: (0, S.jsx)(y.A, {
                                label: "门店选择",
                                value: null == G ? void 0 : G.name
                            })
                        }), (0, S.jsx)(u.Ss, {
                            className: p()(Z.card, Z.picker),
                            onClick: function() {
                                d().navigateTo({
                                    url: "/pages/customer-service/select/index",
                                    events: {
                                        acceptCustomerServiceFromOpenedPage: function(e) {
                                            M(e.customerService);
                                        }
                                    },
                                    success: function() {}
                                });
                            },
                            children: (0, S.jsx)(y.A, {
                                label: "专属客服",
                                value: null != H && H.id ? H.name : "选择专属客服，可为您提供更优质的服务"
                            })
                        }), (0, S.jsx)(u.Ss, {
                            className: p()(Z.card, Z.checkbox),
                            children: (0, S.jsx)(h.A, {
                                checked: U,
                                primary: "极斗会员协议",
                                secondary: "我已阅读并同意协议",
                                onChange: function(e) {
                                    console.log("Checkbox changed:", e), Y(e);
                                }
                            })
                        }), (0, S.jsx)(u.Ss, {
                            className: p()(Z.card),
                            style: {
                                padding: 0,
                                paddingRight: 10
                            },
                            children: (0, S.jsx)(m.A, {
                                value: W,
                                onChange: function(e) {
                                    console.log("Payment method changed:", e), z(e);
                                }
                            })
                        }) ]
                    }) ]
                })
            });
        }
        var M = (0, c.eU)(H, "pages/buy-card/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "购卡",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white",
            backgroundColor: "#f0f0f0"
        } || {});
        H && H.behaviors && (M.behaviors = (M.behaviors || []).concat(H.behaviors)), Page(M);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 5211, e(e.s = n);
        var n;
    }), e.O();
} ]);