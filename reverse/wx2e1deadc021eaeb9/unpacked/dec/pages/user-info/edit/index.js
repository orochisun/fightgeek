var e = require("../../../@babel/runtime/helpers/regeneratorRuntime"), n = require("../../../@babel/runtime/helpers/asyncToGenerator"), t = require("../../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 7512 ], {
    5789: function(r, a, i) {
        var s = i(4779), o = i(2012), u = i(5727), c = i(8135), l = i(758), h = i(4910), p = i(5119), d = i.n(p), x = i(6298), v = i(5797), b = i.n(v), f = "index__root___X00Xz", _ = "index__avatar___SJNT6", g = "index__input___A9ni3", k = "index__button___WVmxl", w = i(6070);
        function m() {
            var r = (0, h.k)(function(e) {
                return e.userInfo;
            }), a = (0, l.useState)(""), i = t(a, 2), s = i[0], p = i[1], v = (0, l.useState)((null == r ? void 0 : r.nickName) || ""), m = t(v, 2), T = m[0], y = m[1];
            if (null == r || !r.id) return (0, w.jsx)(o.Ss, {
                children: (0, w.jsx)(o.Ss, {
                    children: "请先登录"
                })
            });
            function S() {
                return (S = n(e().mark(function n() {
                    var t, r;
                    return e().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            if (s) {
                                e.next = 2;
                                break;
                            }
                            return e.abrupt("return", void b().showToast({
                                title: "请上传头像",
                                icon: "none"
                            }));

                          case 2:
                            if (T) {
                                e.next = 4;
                                break;
                            }
                            return e.abrupt("return", void b().showToast({
                                title: "请输入昵称",
                                icon: "none"
                            }));

                          case 4:
                            return e.next = 6, (0, x.bu)(s, T);

                          case 6:
                            if (t = e.sent, console.log("更新用户信息", t), 200 !== t.code) {
                                e.next = 12;
                                break;
                            }
                            return e.next = 10, (0, x.ug)();

                          case 10:
                            r = e.sent, h.k.getState().setUserInfo(r.data.userInfo), b().showToast({
                                title: "更新成功",
                                icon: "success"
                            }), b().navigateBack();

                          case 12:
                          case "end":
                            return e.stop();
                        }
                    }, n);
                }))).apply(this, arguments);
            }
            return (0, w.jsx)(u.A, {
                children: (0, w.jsxs)(o.Ss, {
                    className: f,
                    children: [ (0, w.jsx)(o.$n, {
                        className: d()("reset-button-to-view press", _),
                        openType: "chooseAvatar",
                        onChooseAvatar: function(e) {
                            p(e.detail.avatarUrl);
                        },
                        style: {
                            width: "64px",
                            height: "64px"
                        },
                        children: (0, w.jsx)(c.A, {
                            src: s,
                            style: {
                                width: "64px",
                                height: "64px"
                            }
                        })
                    }), (0, w.jsx)(o.pd, {
                        placeholder: "请输入昵称",
                        className: g,
                        defaultValue: T,
                        onInput: function(e) {
                            y(e.detail.value);
                        },
                        type: "nickname"
                    }), (0, w.jsx)(o.Ss, {
                        className: k,
                        onClick: function() {
                            return S.apply(this, arguments);
                        },
                        children: "保存"
                    }) ]
                })
            });
        }
        var T = (0, s.eU)(m, "pages/user-info/edit/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "个人信息",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white"
        } || {});
        m && m.behaviors && (T.behaviors = (T.behaviors || []).concat(m.behaviors)), Page(T);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return n = 5789, e(e.s = n);
        var n;
    }), e.O();
} ]);