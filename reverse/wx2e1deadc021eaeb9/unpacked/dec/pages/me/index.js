var e = require("../../@babel/runtime/helpers/regeneratorRuntime"), n = require("../../@babel/runtime/helpers/asyncToGenerator");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 8707 ], {
    5334: function(r, s, i) {
        var o = i(4779), a = i(2012), l = i(5797), t = i.n(l), _ = i(6298), c = i(4910), u = i(8149), d = i(7907), x = i(1681), g = i(2889), b = i(5119), m = i.n(b), h = {
            unlogin: "index__unlogin___K7DZu",
            register: "index__register___WqcJD",
            root: "index__root___kd4at",
            body: "index__body___R6k6P",
            card: "index__card___ObF9u",
            title: "index__title___HLlxl",
            list: "index__list___YqMSi",
            item: "index__item___DTIWU",
            label: "index__label___xySiO",
            icon: "index__icon___uuL6p",
            badge: "index__badge___nGpbN",
            version: "index__version___RBp6T",
            message: "index__message___wuDRG",
            exclusive: "index__exclusive___UxVRP",
            booking: "index__booking___rMSA0",
            order: "index__order___yKXIb",
            agreement: "index__agreement___XEaB1",
            customer_service: "index__customer_service___q9LsX",
            feedback: "index__feedback___MPrcu",
            esign: "index__esign___yI8_e"
        }, p = i(6070);
        function v() {
            var r = (0, c.k)(function(e) {
                return e.userInfo;
            });
            function s() {
                return (s = n(e().mark(function n(r) {
                    var s, i;
                    return e().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if ("getPhoneNumber:ok" !== r.detail.errMsg) {
                                e.next = 16;
                                break;
                            }
                            return e.next = 3, t().login();

                          case 3:
                            return s = e.sent, e.next = 6, (0, _.kz)(s.code, r.detail.code);

                          case 6:
                            if (i = e.sent, console.log("Registration response:", i), e.t0 = 200 === i.code, 
                            !e.t0) {
                                e.next = 14;
                                break;
                            }
                            return e.next = 12, (0, _.y1)();

                          case 12:
                            return e.next = 14, (0, _.LF)();

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
            if (null == r || !r.id) return (0, p.jsx)(a.Ss, {
                className: h.unlogin,
                children: (0, p.jsx)(a.$n, {
                    className: h.register,
                    openType: "getPhoneNumber",
                    onGetPhoneNumber: function(e) {
                        console.log("Button clicked, event:", e), function(e) {
                            s.apply(this, arguments);
                        }(e);
                    },
                    children: "Register"
                })
            });
            var i = [ {
                key: "message",
                label: "消息通知",
                url: "/pages/message/index",
                showArrow: !0
            }, {
                key: "exclusive",
                label: "您的专属",
                url: "/pages/customer-service/list/index",
                showArrow: !0
            }, {
                key: "booking",
                label: "约课记录",
                url: "/pages/booking/index",
                showArrow: !0
            }, {
                key: "order",
                label: "购买记录",
                url: "/pages/order/list/index",
                showArrow: !0
            }, {
                key: "esign",
                label: "我的合同",
                url: "/pages/esign/list/index",
                showArrow: !0
            }, {
                key: "agreement",
                label: "极斗协议",
                url: "/pages/member-policy/index",
                showArrow: !0
            }, {
                key: "customer_service",
                openType: "contact",
                label: "联系客服",
                showArrow: !0
            }, {
                key: "feedback",
                label: "投诉建议",
                showArrow: !0
            }, {
                key: "version",
                label: "版本更新",
                value: (0, g.su)()
            } ];
            return (0, p.jsxs)(a.Ss, {
                className: h.root,
                children: [ (0, p.jsx)(d.A, {
                    userInfo: r
                }), (0, p.jsxs)(a.Ss, {
                    className: h.body,
                    children: [ (0, p.jsx)(a.Ss, {
                        className: h.card,
                        children: (0, p.jsx)(x.A, {
                            userInfo: r
                        })
                    }), (0, p.jsx)(a.Ss, {
                        className: h.card,
                        children: (0, p.jsx)(a.Ss, {
                            className: h.list,
                            children: null == i ? void 0 : i.map(function(e, n) {
                                return (0, p.jsxs)(a.$n, {
                                    className: m()(h.item, h[e.key], "press-lg"),
                                    openType: e.openType,
                                    onClick: function() {
                                        !function(e) {
                                            e.url && t().navigateTo({
                                                url: e.url
                                            });
                                        }(e);
                                    },
                                    children: [ (0, p.jsx)(a.Ss, {
                                        className: h.icon
                                    }), (0, p.jsx)(a.Ss, {
                                        className: h.label,
                                        children: e.label
                                    }), e.value && (0, p.jsxs)(a.Ss, {
                                        className: h.version,
                                        children: [ "v", e.value ]
                                    }), e.badge > 0 && (0, p.jsx)(a.Ss, {
                                        className: h.badge,
                                        children: e.badge
                                    }), e.showArrow && (0, p.jsx)(u.Xx, {
                                        value: "chevron-right",
                                        size: "12",
                                        color: "rgba(134, 145, 152, 1)"
                                    }) ]
                                }, n);
                            })
                        })
                    }) ]
                }) ]
            });
        }
        var k = (0, o.eU)(v, "pages/me/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "我的",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white",
            navigationStyle: "custom",
            backgroundColor: "#f2f2f2"
        } || {});
        v && v.behaviors && (k.behaviors = (k.behaviors || []).concat(v.behaviors)), Page(k);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 5334, e(e.s = n);
        var n;
    }), e.O();
} ]);