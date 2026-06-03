var e = require("../../../@babel/runtime/helpers/regeneratorRuntime"), i = require("../../../@babel/runtime/helpers/asyncToGenerator"), a = require("../../../@babel/runtime/helpers/slicedToArray");

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 56 ], {
    4235: function(n, s, r) {
        var t = r(4779), l = r(2012), o = r(758), c = r(1273), d = r(5797), _ = r.n(d), u = r(8904), m = r(5119), x = r.n(m), v = r(9690), h = r(8149), g = r(2217), p = {
            root: "index__root___Qw_4t",
            video: "index__video___rQtQ_",
            section1: "index__section1___JoT5U",
            name: "index__name___Q6hMu",
            logo: "index__logo___Ck34R",
            distance: "index__distance___QM0WD",
            serviceObject: "index__serviceObject___Nzcor",
            item: "index__item___xZdas",
            avatar: "index__avatar____A7pV",
            "item-adults": "index__item-adults___DzfGI",
            "item-children": "index__item-children___F9abU",
            "item-parking": "index__item-parking___fKyBs",
            "item-shower": "index__item-shower___gthDg",
            "item-drinkingWater": "index__item-drinkingWater___iClQG",
            "item-airConditioning": "index__item-airConditioning___efqte",
            "item-airPurification": "index__item-airPurification___QunF8",
            "item-changingRoom": "index__item-changingRoom___R2Mmg",
            "item-leisureArea": "index__item-leisureArea___SeA8P",
            label: "index__label___LrdBi",
            devices: "index__devices___w3XDa"
        }, j = r(6070), b = {
            adults: "成人",
            children: "儿童"
        }, N = {
            drinkingWater: "饮用水",
            airConditioning: "空调",
            airPurification: "空气净化",
            leisureArea: "休闲区",
            wifi: "WiFi",
            changingRoom: "更衣室",
            parking: "停车",
            shower: "淋浴"
        };
        function S() {
            var n, s, r, t, m = (0, o.useState)(), S = a(m, 2), f = S[0], k = S[1], w = (0, 
            o.useState)([]), A = a(w, 2), y = A[0], C = A[1];
            function T() {
                return (T = i(e().mark(function i(a) {
                    var n, s;
                    return e().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                          case 0:
                            return e.prev = 0, e.next = 3, (0, c.v)(a);

                          case 3:
                            if (n = e.sent, console.log("预定列表:", n), 200 !== n.code) {
                                e.next = 12;
                                break;
                            }
                            return k(n.data), e.next = 8, (0, v.l)({
                                storeId: a
                            });

                          case 8:
                            200 === (s = e.sent).code ? C(s.data.list || []) : console.error("获取教练列表失败", s.msg), 
                            e.next = 13;
                            break;

                          case 12:
                            console.error("获取预定列表失败:", n.msg);

                          case 13:
                            e.next = 18;
                            break;

                          case 15:
                            e.prev = 15, e.t0 = e.catch(0), console.error("获取预定列表失败:", e.t0);

                          case 18:
                          case "end":
                            return e.stop();
                        }
                    }, i, null, [ [ 0, 15 ] ]);
                }))).apply(this, arguments);
            }
            return (0, d.useLoad)(function() {
                var e, i = ((null === (e = _().getCurrentInstance().router) || void 0 === e ? void 0 : e.params) || {}).id;
                console.log("加载约课记录页面, id:", i), i ? function(e) {
                    T.apply(this, arguments);
                }(Number(i)) : console.error("缺少课程ID");
            }), console.log("门店详情数据:", f), (0, j.jsxs)(l.Ss, {
                children: [ (0, j.jsx)(l.Ce, {
                    className: p.video,
                    src: null == f || null === (n = f.detail) || void 0 === n ? void 0 : n.videoUrl,
                    poster: null == f || null === (s = f.detail) || void 0 === s ? void 0 : s.storeCover
                }), (0, j.jsxs)(l.Ss, {
                    className: p.root,
                    children: [ (0, j.jsx)(u.A, {
                        children: (0, j.jsxs)(l.Ss, {
                            className: p.section1,
                            children: [ (0, j.jsxs)(l.Ss, {
                                className: x()(p.name, "paragraph"),
                                children: [ (0, j.jsx)(l.Ss, {
                                    className: p.logo
                                }), null == f ? void 0 : f.detail.name ]
                            }), (0, j.jsxs)(l.Ss, {
                                className: "paragraph",
                                children: [ "营业时间：", null == f ? void 0 : f.detail.startTime, " - ", null == f ? void 0 : f.detail.endTime ]
                            }), (0, j.jsxs)(l.Ss, {
                                className: "paragraph",
                                children: [ "咨询电话：", null == f ? void 0 : f.detail.phone ]
                            }), (0, j.jsxs)(l.Ss, {
                                className: "paragraph",
                                children: [ "详细地址：", null == f ? void 0 : f.detail.address ]
                            }), (0, j.jsxs)(l.Ss, {
                                className: x()(p.distance, "paragraph"),
                                children: [ "距您", " ", (0, j.jsx)(g.A, {
                                    location: {
                                        latitude: Number(null == f ? void 0 : f.detail.latitude),
                                        longitude: Number(null == f ? void 0 : f.detail.longitude)
                                    }
                                }) ]
                            }) ]
                        })
                    }), (0, j.jsx)(u.A, {
                        title: "服务对象",
                        children: (0, j.jsx)(l.Ss, {
                            className: p.serviceObject,
                            children: null === (r = [ "adults", "children" ]) || void 0 === r ? void 0 : r.map(function(e) {
                                return (0, j.jsxs)(l.Ss, {
                                    className: x()(p.item, p["item-".concat(e)]),
                                    children: [ (0, j.jsx)(l.Ss, {
                                        className: p.avatar
                                    }), (0, j.jsx)(l.Ss, {
                                        className: p.label,
                                        children: b[e]
                                    }) ]
                                }, e);
                            })
                        })
                    }), (0, j.jsx)(u.A, {
                        title: "场馆设施",
                        children: (0, j.jsx)(l.Ss, {
                            className: p.devices,
                            children: null == f || null === (t = f.devices) || void 0 === t ? void 0 : t.map(function(e) {
                                var i = Object.keys(N).find(function(i) {
                                    return N[i] === e;
                                });
                                return (0, j.jsxs)(l.Ss, {
                                    className: x()(p.item, p["item-".concat(i)]),
                                    children: [ (0, j.jsx)(l.Ss, {
                                        className: p.avatar
                                    }), (0, j.jsx)(l.Ss, {
                                        className: p.label,
                                        children: e
                                    }) ]
                                }, e);
                            })
                        })
                    }), (0, j.jsx)(u.A, {
                        title: "今日教练",
                        children: (0, j.jsx)(l.Ss, {
                            className: p.serviceObject,
                            children: null == y ? void 0 : y.map(function(e) {
                                return (0, j.jsxs)(l.Ss, {
                                    className: x()(p.item),
                                    children: [ (0, j.jsx)(h.Zy, {
                                        className: p.avatar,
                                        circle: !0,
                                        image: e.avatar,
                                        text: e.name
                                    }), (0, j.jsx)(l.Ss, {
                                        className: p.label,
                                        children: e.name
                                    }) ]
                                }, e.id);
                            })
                        })
                    }), (0, j.jsx)(u.A, {
                        title: "团课预约"
                    }) ]
                }) ]
            });
        }
        var f = (0, t.eU)(S, "pages/store/detail/index", {
            root: {
                cn: []
            }
        }, {
            navigationBarTitleText: "门店详情",
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#E7262A",
            navigationBarTextStyle: "white"
        } || {});
        S && S.behaviors && (f.behaviors = (f.behaviors || []).concat(S.behaviors)), Page(f);
    }
}, function(e) {
    e.O(0, [ 6907, 8096, 2076 ], function() {
        return i = 4235, e(e.s = i);
        var i;
    }), e.O();
} ]);