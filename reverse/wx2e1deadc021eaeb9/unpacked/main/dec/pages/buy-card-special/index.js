var e = require("../../@babel/runtime/helpers/defineProperty"), n = require("../../@babel/runtime/helpers/objectSpread2"), s = require("../../@babel/runtime/helpers/regeneratorRuntime"), t = require("../../@babel/runtime/helpers/asyncToGenerator"), a = require("../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 1052 ], {
    7439: function(r, i, o) {
        var c = o(4779), l = o(2012), d = o(5797), u = o.n(d), x = o(758), h = o(5119), p = o.n(h), _ = o(2935), f = o(5727), m = o(7870), g = o(7338), v = o(6384), b = o(3059), S = o(6643), k = o(7160), j = o(7634), y = o(4910), T = o(9706), N = o(2889), w = o(1904), C = o(6298), I = o(6788);
        function P() {
            var e = (0, T.A)().city, n = (0, x.useState)([]), r = a(n, 2), i = r[0], o = r[1], c = (0, 
            x.useState)(0), l = a(c, 2), d = l[0], u = l[1], h = (0, x.useCallback)(t(s().mark(function n() {
                var t, a, r;
                return s().wrap(function(n) {
                    for (;;) switch (n.prev = n.next) {
                      case 0:
                        return n.next = 2, (0, I.vC)({
                            regionalId: null == e ? void 0 : e.id
                        });

                      case 2:
                        200 === (t = n.sent).code && (r = null === (a = t.data.list || []) || void 0 === a ? void 0 : a.sort(function(e, n) {
                            return e.validDays - n.validDays;
                        }), o(r));

                      case 4:
                      case "end":
                        return n.stop();
                    }
                }, n);
            })), [ null == e ? void 0 : e.id ]);
            return (0, x.useEffect)(function() {
                (null == e ? void 0 : e.id) && h();
            }, [ null == e ? void 0 : e.id, h ]), {
                currentIndex: d,
                current: i[d] || {},
                tplList: i,
                setCurrentIndex: u
            };
        }
        var q = {
            root: "index__root___q33HT",
            content: "index__content___YH0KI",
            card: "index__card___v3EDa",
            picker: "index__picker___rzEQH",
            checkbox: "index__checkbox___QtMtf",
            forms: "index__forms___qHR6o",
            footerContent: "index__footerContent___rfWw6",
            price: "index__price___ZPcSS",
            now: "index__now___S6Nci",
            strong: "index__strong___hVYd3",
            original: "index__original___lcoTy",
            button: "index__button___R7Lt7",
            disabled: "index__disabled___WxaQj",
            card2: "index__card2___CRQEJ",
            infoSection: "index__infoSection___ZvcVq",
            title: "index__title___IIrhU",
            infos: "index__infos___yQSX4",
            info: "index__info___HkIaw"
        }, A = o(6070);
        function L() {
            var r = P(), i = r.tplList, o = r.current, c = r.currentIndex, d = r.setCurrentIndex, h = (0, 
            y.k)(function(e) {
                return e.userInfo;
            }), I = (0, x.useState)(null), L = a(I, 2), D = L[0], R = L[1], E = (0, x.useState)(!0), H = a(E, 2), Q = H[0], B = H[1], M = (0, 
            x.useState)("wechat"), O = a(M, 2), F = O[0], J = O[1], V = (0, T.A)().store;
            function G(e) {
                return U.apply(this, arguments);
            }
            function U() {
                return (U = t(s().mark(function e(n) {
                    var t, a, r, i;
                    return s().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            t = 10, a = 5e3, r = 0;

                          case 2:
                            if (!(r < t)) {
                                e.next = 27;
                                break;
                            }
                            return e.prev = 3, console.log("开始第".concat(r + 1, "次轮询支付状态")), e.next = 7, (0, 
                            j.G)({
                                sn: n,
                                orderType: 1
                            });

                          case 7:
                            if (i = e.sent, console.log("轮询结果:", i), 200 !== i.code || 1 !== i.data.tradeState) {
                                e.next = 10;
                                break;
                            }
                            return e.abrupt("return", (u().showToast({
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
                            return e.abrupt("return", (u().showToast({
                                title: "支付失败",
                                icon: "none"
                            }), {
                                status: "failed"
                            }));

                          case 12:
                            if (e.t0 = r < t - 1, !e.t0) {
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
                            if (e.prev = 18, e.t1 = e.catch(3), console.error("第".concat(r + 1, "次轮询支付状态失败:"), e.t1), 
                            r !== t - 1) {
                                e.next = 22;
                                break;
                            }
                            return e.abrupt("return", (u().showToast({
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
                            r++, e.next = 2;
                            break;

                          case 27:
                            return e.abrupt("return", {
                                status: "timeout"
                            });

                          case 28:
                          case "end":
                            return e.stop();
                        }
                    }, e, null, [ [ 3, 18 ] ]);
                }))).apply(this, arguments);
            }
            var W = (0, x.useCallback)(t(s().mark(function e() {
                var n, t, a, r, i, c;
                return s().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        if (!Q) {
                            e.next = 49;
                            break;
                        }
                        return u().showLoading({
                            title: "创建订单中...",
                            mask: !0
                        }), e.prev = 2, e.next = 5, (0, k.fS)({
                            userId: null == h ? void 0 : h.id,
                            tplId: o.id,
                            tplType: 5,
                            storeId: null == V ? void 0 : V.id,
                            singlePrice: o.regionalDiscount,
                            totalNumber: 1,
                            staffId: (null == D ? void 0 : D.id) || 0,
                            salerId: 0,
                            saleType: 1,
                            paymentType: "wechat" === F ? 1 : 2,
                            remark: "",
                            depositOrderId: 0,
                            originPrice: o.originPrice
                        });

                      case 5:
                        if (t = e.sent, console.log("创建订单结果:", t), 200 === t.code) {
                            e.next = 8;
                            break;
                        }
                        return e.abrupt("return", void u().showToast({
                            title: t.msg || "创建订单失败，请稍后再试",
                            icon: "none"
                        }));

                      case 8:
                        return e.next = 10, (0, j.L)({
                            orderSn: null == t || null === (n = t.data) || void 0 === n ? void 0 : n.sn,
                            payType: "wechat" === F ? 1 : 2,
                            serviceType: 1
                        });

                      case 10:
                        if (a = e.sent, console.log("创建支付结果:", a), 200 !== a.code) {
                            e.next = 41;
                            break;
                        }
                        return e.prev = 12, e.next = 15, u().requestPayment({
                            timeStamp: a.data.timestamp,
                            nonceStr: a.data.nonceStr,
                            package: a.data.package,
                            signType: a.data.signType,
                            paySign: a.data.paySign
                        });

                      case 15:
                        if (r = e.sent, console.log("支付结果:", r), "requestPayment:ok" !== r.errMsg) {
                            e.next = 33;
                            break;
                        }
                        return u().showLoading({
                            title: "支付成功，正在确认订单状态...",
                            mask: !0
                        }), e.next = 20, G(null == t || null === (i = t.data) || void 0 === i ? void 0 : i.sn);

                      case 20:
                        if (c = e.sent, u().hideLoading(), "success" !== c.status) {
                            e.next = 30;
                            break;
                        }
                        return u().showLoading({
                            title: "支付成功，正在创建电子合同...",
                            mask: !0
                        }), e.next = 25, (0, C.y1)();

                      case 25:
                        return e.next = 27, (0, N.yy)(1e4);

                      case 27:
                        return e.next = 29, (0, C.LF)();

                      case 29:
                        return e.abrupt("return", void e.sent);

                      case 30:
                        "failed" === c.status ? u().showToast({
                            title: "支付失败，请稍后再试",
                            icon: "none"
                        }) : u().showToast({
                            title: "支付状态确认中，请稍后查看订单",
                            icon: "none"
                        }), e.next = 34;
                        break;

                      case 33:
                        u().showToast({
                            title: "支付失败，请稍后再试",
                            icon: "none"
                        });

                      case 34:
                        e.next = 39;
                        break;

                      case 36:
                        e.prev = 36, e.t0 = e.catch(12), console.error("支付请求错误:", e.t0), "requestPayment:fail cancel" === e.t0.errMsg && (u().showToast({
                            title: "支付已取消",
                            icon: "none"
                        }), u().navigateTo({
                            url: "/pages/order/list/index"
                        }));

                      case 39:
                        e.next = 42;
                        break;

                      case 41:
                        u().showToast({
                            title: "创建支付失败，请稍后再试",
                            icon: "none"
                        });

                      case 42:
                        e.next = 46;
                        break;

                      case 44:
                        e.prev = 44, e.t1 = e.catch(2);

                      case 46:
                        u().hideLoading(), e.next = 50;
                        break;

                      case 49:
                        u().showToast({
                            title: "请同意极斗会员协议",
                            icon: "none"
                        });

                      case 50:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 2, 44 ], [ 12, 36 ] ]);
            })), [ Q, o, D, F, V, h ]), Y = (0, x.useMemo)(function() {
                return (0, _.debounce)(W, 1e3, {
                    leading: !0,
                    trailing: !1
                });
            }, [ W ]);
            if (0 === i.length) return (0, A.jsx)(l.Ss, {
                className: q.loading,
                children: "加载中..."
            });
            var Z = [];
            return o.personalTpl.id && Z.push(n(n({}, o.personalTpl), {}, {
                bodyType: 1
            })), o.groupTpl.id && Z.push(n(n({}, o.groupTpl), {}, {
                bodyType: 2
            })), (0, A.jsx)(f.A, {
                className: q.layout,
                footerRender: (0, A.jsx)(S.A, {
                    children: (0, A.jsxs)(l.Ss, {
                        className: q.footerContent,
                        children: [ (0, A.jsxs)(l.Ss, {
                            className: q.price,
                            children: [ (0, A.jsxs)(l.Ss, {
                                className: q.now,
                                children: [ "现价：", (0, A.jsx)(l.Ss, {
                                    className: q.strong,
                                    children: (0, N.$g)(null == o ? void 0 : o.regionalDiscount)
                                }) ]
                            }), (0, A.jsxs)(l.Ss, {
                                className: q.original,
                                children: [ "原价：", (0, N.$g)(null == o ? void 0 : o.originPrice) ]
                            }) ]
                        }), (0, A.jsx)(l.Ss, {
                            className: p()(q.button, "press", e({}, q.disabled, !Q)),
                            onClick: function() {
                                Y();
                            },
                            children: "立即支付"
                        }) ]
                    })
                }),
                children: (0, A.jsxs)(l.Ss, {
                    className: q.root,
                    children: [ (0, A.jsx)(v.A, {
                        current: c,
                        list: i,
                        onChange: function(e) {
                            d(e);
                        }
                    }), (0, A.jsxs)(l.Ss, {
                        className: q.content,
                        children: [ (0, A.jsx)(l.Ss, {
                            className: q.card,
                            children: (0, A.jsxs)(l.Ss, {
                                className: q.infoSection,
                                children: [ (0, A.jsx)(l.Ss, {
                                    className: q.title,
                                    children: "会员卡"
                                }), (0, A.jsx)(l.Ss, {
                                    className: q.infos,
                                    children: null == i ? void 0 : i.map(function(e) {
                                        return (0, A.jsx)(l.Ss, {
                                            className: q.info,
                                            style: {
                                                backgroundColor: o.id === e.id ? "rgba(231, 38, 42, 0.2);" : "#fff"
                                            },
                                            children: (0, A.jsx)(l.Ss, {
                                                className: q.label,
                                                children: e.name
                                            })
                                        }, e.id);
                                    })
                                }) ]
                            })
                        }), (0, A.jsx)(l.Ss, {
                            className: q.card,
                            children: (0, A.jsxs)(l.Ss, {
                                className: q.infoSection,
                                children: [ (0, A.jsx)(l.Ss, {
                                    className: q.title,
                                    children: "会员卡信息"
                                }), (0, A.jsxs)(l.Ss, {
                                    className: q.infos,
                                    children: [ (0, A.jsxs)(l.Ss, {
                                        className: q.info,
                                        children: [ (0, A.jsx)(l.Ss, {
                                            className: q.label,
                                            children: "有效期"
                                        }), (0, A.jsxs)(l.Ss, {
                                            className: q.value,
                                            children: [ (null == o ? void 0 : o.validDays) || 0, "天" ]
                                        }) ]
                                    }), (0, A.jsxs)(l.Ss, {
                                        className: q.info,
                                        children: [ (0, A.jsx)(l.Ss, {
                                            className: q.label,
                                            children: "单/通店"
                                        }), (0, A.jsx)(l.Ss, {
                                            className: q.value,
                                            children: w.V9[o.mode] || "-"
                                        }) ]
                                    }), null == Z ? void 0 : Z.map(function(e, n) {
                                        var s = 1 === e.bodyType ? "私教" : "团课";
                                        return (0, A.jsxs)(x.Fragment, {
                                            children: [ (0, A.jsxs)(l.Ss, {
                                                className: q.info,
                                                children: [ (0, A.jsxs)(l.Ss, {
                                                    className: q.label,
                                                    children: [ s, "次数" ]
                                                }), (0, A.jsxs)(l.Ss, {
                                                    className: q.value,
                                                    children: [ 1 === e.countType ? e.usageCount : "不限", "次" ]
                                                }) ]
                                            }), (0, A.jsxs)(l.Ss, {
                                                className: q.info,
                                                children: [ (0, A.jsxs)(l.Ss, {
                                                    className: q.label,
                                                    children: [ s, "赠送次数" ]
                                                }), (0, A.jsxs)(l.Ss, {
                                                    className: q.value,
                                                    children: [ e.giftCount || 0, "次" ]
                                                }) ]
                                            }) ]
                                        }, n);
                                    }) ]
                                }) ]
                            })
                        }), (0, A.jsx)(l.Ss, {
                            className: p()(q.card, q.picker),
                            onClick: function() {
                                u().navigateTo({
                                    url: "/pages/store/select/index"
                                });
                            },
                            children: (0, A.jsx)(b.A, {
                                label: "门店选择",
                                value: null == V ? void 0 : V.name
                            })
                        }), (0, A.jsx)(l.Ss, {
                            className: p()(q.card, q.picker),
                            onClick: function() {
                                u().navigateTo({
                                    url: "/pages/customer-service/select/index",
                                    events: {
                                        acceptCustomerServiceFromOpenedPage: function(e) {
                                            R(e.customerService);
                                        }
                                    },
                                    success: function(e) {}
                                });
                            },
                            children: (0, A.jsx)(b.A, {
                                label: "专属客服",
                                value: null != D && D.id ? D.name : "选择专属客服，可为您提供更优质的服务"
                            })
                        }), (0, A.jsx)(l.Ss, {
                            className: p()(q.card, q.checkbox),
                            children: (0, A.jsx)(m.A, {
                                checked: Q,
                                primary: "极斗会员协议",
                                secondary: "我已阅读并同意协议",
                                onChange: function(e) {
                                    console.log("Checkbox changed:", e), B(e);
                                }
                            })
                        }), (0, A.jsx)(l.Ss, {
                            className: p()(q.card),
                            style: {
                                padding: 0,
                                paddingRight: 10
                            },
                            children: (0, A.jsx)(g.A, {
                                value: F,
                                onChange: function(e) {
                                    console.log("Payment method changed:", e), J(e);
                                }
                            })
                        }) ]
                    }) ]
                })
            });
        }
        var D = (0, c.eU)(L, "pages/buy-card-special/index", {
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
        L && L.behaviors && (D.behaviors = (D.behaviors || []).concat(L.behaviors)), Page(D);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 7439, e(e.s = n);
        var n;
    }), e.O();
} ]);