var e = require("../../@babel/runtime/helpers/regeneratorRuntime"), s = require("../../@babel/runtime/helpers/asyncToGenerator");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 2231 ], {
    3202: function(a, r, n) {
        var i = n(4779), c = n(2012), l = n(5727), t = n(8149), o = n(5119), x = n.n(o), d = n(6643), h = n(6298), m = n(2889), u = n(4910), _ = n(5797), j = n.n(_), N = {
            items: "index__items___qIIZh",
            item: "index__item___D5fcN",
            left: "index__left___uNyb4",
            primary: "index__primary___WPfay",
            secondary: "index__secondary___bD44C",
            right: "index__right___YgNNO",
            avatar: "index__avatar___qoGXn",
            footerContent: "index__footerContent___qn7SM",
            button: "index__button___JQd38"
        }, v = n(6070);
        function f() {
            var a = (0, u.k)(function(e) {
                return e.userInfo;
            });
            return null != a && a.id ? (0, v.jsx)(l.A, {
                className: N.layout,
                footerClassName: N.footer,
                footerRender: (0, v.jsx)(d.A, {
                    children: (0, v.jsx)(c.Ss, {
                        className: N.footerContent,
                        children: (0, v.jsx)(c.$n, {
                            onClick: function() {
                                var a;
                                j().showModal({
                                    title: "提示",
                                    content: "确定要退出登录吗？",
                                    success: (a = s(e().mark(function s(a) {
                                        return e().wrap(function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                              case 0:
                                                a.confirm && (0, h.ri)();

                                              case 1:
                                              case "end":
                                                return e.stop();
                                            }
                                        }, s);
                                    })), function(e) {
                                        return a.apply(this, arguments);
                                    })
                                });
                            },
                            className: x()(N.button, "press-lg"),
                            children: "退出登录"
                        })
                    })
                }),
                children: (0, v.jsxs)(c.Ss, {
                    className: N.items,
                    children: [ (0, v.jsxs)(c.Ss, {
                        onClick: function() {
                            j().navigateTo({
                                url: "/pages/user-info/edit/index"
                            });
                        },
                        className: N.item,
                        children: [ (0, v.jsx)(c.Ss, {
                            className: N.left,
                            children: (0, v.jsx)(c.Ss, {
                                className: N.primary,
                                children: "头像"
                            })
                        }), (0, v.jsx)(c.Ss, {
                            className: N.right,
                            children: (0, v.jsx)(t.Zy, {
                                className: N.avatar,
                                circle: !0,
                                image: null == a ? void 0 : a.avatar,
                                text: null == a ? void 0 : a.name
                            })
                        }), (0, v.jsx)(t.Xx, {
                            value: "chevron-right",
                            size: "12",
                            color: "rgba(134, 145, 152, 1)"
                        }) ]
                    }), (0, v.jsxs)(c.Ss, {
                        onClick: function() {
                            j().navigateTo({
                                url: "/pages/user-info/edit/index"
                            });
                        },
                        className: N.item,
                        children: [ (0, v.jsxs)(c.Ss, {
                            className: N.left,
                            children: [ (0, v.jsx)(c.Ss, {
                                className: N.primary,
                                children: "昵称"
                            }), (0, v.jsx)(c.Ss, {
                                className: N.secondary,
                                children: a.nickName
                            }) ]
                        }), (0, v.jsx)(c.Ss, {
                            className: N.right
                        }), (0, v.jsx)(t.Xx, {
                            value: "chevron-right",
                            size: "12",
                            color: "rgba(134, 145, 152, 1)"
                        }) ]
                    }), (0, v.jsxs)(c.Ss, {
                        className: N.item,
                        children: [ (0, v.jsxs)(c.Ss, {
                            className: N.left,
                            children: [ (0, v.jsx)(c.Ss, {
                                className: N.primary,
                                children: "手机号"
                            }), (0, v.jsx)(c.Ss, {
                                className: N.secondary,
                                children: (0, m.Jf)(null == a ? void 0 : a.mobile)
                            }) ]
                        }), (0, v.jsx)(c.Ss, {
                            className: N.right
                        }), (0, v.jsx)(t.Xx, {
                            value: "chevron-right",
                            size: "12",
                            color: "rgba(134, 145, 152, 1)"
                        }) ]
                    }), (0, v.jsxs)(c.Ss, {
                        className: N.item,
                        children: [ (0, v.jsxs)(c.Ss, {
                            className: N.left,
                            children: [ (0, v.jsx)(c.Ss, {
                                className: N.primary,
                                children: "ID"
                            }), (0, v.jsx)(c.Ss, {
                                className: N.secondary,
                                children: null == a ? void 0 : a.id
                            }) ]
                        }), (0, v.jsx)(c.Ss, {
                            className: N.right
                        }), (0, v.jsx)(t.Xx, {
                            value: "chevron-right",
                            size: "12",
                            color: "rgba(134, 145, 152, 1)"
                        }) ]
                    }), (0, v.jsxs)(c.Ss, {
                        className: N.item,
                        children: [ (0, v.jsxs)(c.Ss, {
                            className: N.left,
                            children: [ (0, v.jsx)(c.Ss, {
                                className: N.primary,
                                children: "微信"
                            }), (0, v.jsx)(c.Ss, {
                                className: N.secondary,
                                children: "已绑定"
                            }) ]
                        }), (0, v.jsx)(c.Ss, {
                            className: N.right
                        }), (0, v.jsx)(t.Xx, {
                            value: "chevron-right",
                            size: "12",
                            color: "rgba(134, 145, 152, 1)"
                        }) ]
                    }) ]
                })
            }) : (0, v.jsx)(c.Ss, {
                children: (0, v.jsx)(c.Ss, {
                    children: "请先登录"
                })
            });
        }
        var g = (0, i.eU)(f, "pages/user-info/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "个人信息",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white"
        } || {});
        f && f.behaviors && (g.behaviors = (g.behaviors || []).concat(f.behaviors)), Page(g);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return s = 3202, e(e.s = s);
        var s;
    }), e.O();
} ]);