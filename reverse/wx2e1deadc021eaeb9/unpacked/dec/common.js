var e = require("@babel/runtime/helpers/objectWithoutProperties");

require("@babel/runtime/helpers/Objectentries"), require("@babel/runtime/helpers/Arrayincludes");

var n = require("@babel/runtime/helpers/createForOfIteratorHelper"), t = require("@babel/runtime/helpers/toConsumableArray"), r = require("@babel/runtime/helpers/regeneratorRuntime"), a = require("@babel/runtime/helpers/asyncToGenerator"), o = require("@babel/runtime/helpers/objectSpread2"), s = require("@babel/runtime/helpers/slicedToArray"), i = require("@babel/runtime/helpers/defineProperty"), c = [ "url", "doNotCheckToken" ];

(wx.webpackJsonp = wx.webpackJsonp || []).push([ [ 2076 ], {
    8135: function(e, n, t) {
        t.d(n, {
            A: function() {
                return s;
            }
        });
        var r = t(2012), a = "index__image___elc5w", o = t(6070), s = function(e) {
            var n = e.src, t = e.style;
            return (0, o.jsx)(r._V, {
                className: a,
                src: n,
                style: t
            });
        };
    },
    686: function(e, n, t) {
        t.d(n, {
            A: function() {
                return u;
            }
        });
        var r = t(2012), a = t(5119), o = t.n(a), s = {
            root: "index__root___mObdX",
            fullWidth: "index__fullWidth___lUBYu",
            primary: "index__primary___Q08jB",
            disabled: "index__disabled___jpmuI"
        }, c = t(6070), u = function(e) {
            var n, t = e.className, a = e.style, u = e.children, l = e.fullWidth, d = e.disabled, p = e.onClick, f = e.type, _ = e.size;
            return (0, c.jsx)(r.$n, {
                disabled: d,
                className: o()(s.root, t, l ? "press-lg" : "press", (n = {}, i(n, s.fullWidth, l), 
                i(n, s.disabled, d), i(n, s["".concat(f)], f), i(n, s["".concat(_)], _), n)),
                style: a,
                onClick: d ? void 0 : p,
                children: u
            });
        };
    },
    8904: function(e, n, t) {
        t.d(n, {
            A: function() {
                return i;
            }
        });
        var r = t(2012), a = "index__root___Qtuoc", o = "index__title___MnxHm", s = t(6070), i = function(e) {
            var n = e.title, t = e.children, i = e.style;
            return (0, s.jsxs)(r.Ss, {
                className: a,
                style: i,
                children: [ n && (0, s.jsx)(r.Ss, {
                    className: o,
                    children: n
                }), t ]
            });
        };
    },
    2217: function(e, n, t) {
        t.d(n, {
            A: function() {
                return c;
            }
        });
        var r = t(2012), a = t(9706), o = t(230), s = "index__root___J9WYl", i = t(6070), c = function(e) {
            var n = e.location, t = (0, a.A)().location;
            if (!t || !n) return null;
            var c = (0, o.gd)(t.latitude, t.longitude, n.latitude, n.longitude);
            return (0, i.jsxs)(r.Ss, {
                className: s,
                children: [ c.toFixed(1), "KM" ]
            });
        };
    },
    3503: function(e, n, t) {
        t.d(n, {
            A: function() {
                return l;
            }
        });
        var r = t(2012), a = t(758), o = t(8149), i = "index__root___jMKgY", c = "index__close___ymz1R", u = t(6070), l = (0, 
        a.forwardRef)(function(e, n) {
            (0, a.useImperativeHandle)(n, function() {
                return {
                    open: function() {
                        h(!0);
                    },
                    close: function() {
                        h(!1);
                    }
                };
            });
            var t = function() {
                var n;
                null !== (n = e.onClose) && void 0 !== n && n.call(e), h(!1);
            }, l = e.children, d = e.showCloseButton, p = (0, a.useState)(!1), f = s(p, 2), _ = f[0], h = f[1];
            return (0, u.jsx)(r.Ss, {
                className: i,
                children: (0, u.jsxs)(o.ei, {
                    isOpened: _,
                    onClose: function() {
                        return t();
                    },
                    children: [ l, d && (0, u.jsx)(r.Ss, {
                        className: c,
                        onClick: function() {
                            return t();
                        },
                        children: (0, u.jsx)(o.Xx, {
                            value: "close",
                            size: "16",
                            color: "#666666"
                        })
                    }) ]
                })
            });
        });
    },
    5727: function(e, n, t) {
        t.d(n, {
            A: function() {
                return v;
            }
        });
        var r = t(2012), a = t(5119), c = t.n(a), u = t(758), l = "index__root___fPHBH", d = "index__fixed___oqn3E", p = "index__header___fGD8S", f = "index__footer___q0rGN", _ = "index__content___MFiRe", h = t(6070), v = function(e) {
            var n = e.fixed, t = void 0 === n || n, a = e.scrollViewProps, v = e.onRefresh, m = (0, 
            u.useState)(!1), x = s(m, 2), g = x[0], y = x[1], b = "function" == typeof v;
            return (0, h.jsxs)(r.Ss, {
                className: c()("".concat(l, " ").concat(e.className), i({}, d, t)),
                children: [ e.headerRender && (0, h.jsx)(r.Ss, {
                    className: c()(p, e.headerClassName),
                    children: e.headerRender
                }), (0, h.jsx)(r.BM, o(o({
                    scrollY: !0,
                    className: c()(_, e.contentClassName),
                    refresherEnabled: b,
                    refresherTriggered: g,
                    onRefresherRefresh: function() {
                        b && v && (y(!0), v().finally(function() {
                            y(!1);
                        }));
                    }
                }, a), {}, {
                    children: e.children
                })), e.footerRender && (0, h.jsx)(r.Ss, {
                    className: c()(f, e.footerClassName),
                    children: e.footerRender
                }) ]
            });
        };
    },
    6643: function(e, n, t) {
        t.d(n, {
            A: function() {
                return s;
            }
        });
        var r = t(2012), a = "index__root___Ltwk1", o = t(6070), s = function(e) {
            var n = e.children, t = e.style;
            return (0, o.jsx)(r.Ss, {
                className: a,
                style: t,
                children: n
            });
        };
    },
    7338: function(e, n, t) {
        t.d(n, {
            A: function() {
                return y;
            }
        });
        var r = t(2012), a = t(758), o = t(5119), s = t.n(o), c = "index__root___iFxOV", u = "index__item___VcpC1", l = "index__left___Vx_oe", d = "index__wechat___CTdJ6", p = "index__icbc___IrK9v", f = "index__label___zZ7P0", _ = "index__blank___IQOcD", h = "index__right___L08eZ", v = "index__active___T1Cz6", m = "index__disabled___PWzHe", x = t(6070), g = [ {
            value: "wechat",
            label: "微信支付",
            className: d,
            disabled: !1
        }, {
            value: "icbc",
            label: "工行卡",
            className: p,
            disabled: !0
        } ], y = (0, a.forwardRef)(function(e, n) {
            (0, a.useImperativeHandle)(n, function() {
                return {};
            });
            var t = e.value, o = void 0 === t ? "wechat" : t, d = e.onChange;
            return (0, x.jsx)(r.Ss, {
                className: c,
                children: null == g ? void 0 : g.map(function(e) {
                    var n;
                    return (0, x.jsxs)(r.Ss, {
                        className: s()(u, e.className, (n = {}, i(n, v, o === e.value), i(n, m, e.disabled), 
                        n)),
                        onClick: function() {
                            e.disabled || d && d(e.value);
                        },
                        children: [ (0, x.jsx)(r.Ss, {
                            className: l
                        }), (0, x.jsx)(r.Ss, {
                            className: f,
                            children: e.label
                        }), (0, x.jsx)(r.Ss, {
                            className: _
                        }), (0, x.jsx)(r.Ss, {
                            className: h
                        }) ]
                    }, e.value);
                })
            });
        });
    },
    3059: function(e, n, t) {
        t.d(n, {
            A: function() {
                return l;
            }
        });
        var r = t(2012), a = t(758), o = t(8149), s = "index__root___xwnmT", i = "index__label___h4ocN", c = "index__value___zgKxn", u = t(6070), l = (0, 
        a.forwardRef)(function(e, n) {
            (0, a.useImperativeHandle)(n, function() {
                return {};
            });
            var t = e.label, l = e.value;
            return (0, u.jsxs)(r.Ss, {
                className: s,
                children: [ (0, u.jsxs)(r.Ss, {
                    children: [ (0, u.jsx)(r.Ss, {
                        className: i,
                        children: t
                    }), (0, u.jsx)(r.Ss, {
                        className: c,
                        children: l
                    }) ]
                }), (0, u.jsx)(o.Xx, {
                    value: "chevron-right",
                    size: "12",
                    color: "rgba(134, 145, 152, 1)"
                }) ]
            });
        });
    },
    7870: function(e, n, t) {
        t.d(n, {
            A: function() {
                return v;
            }
        });
        var r = t(2012), a = t(758), o = t(5119), s = t.n(o), c = "index__root___uwZrg", u = "index__icon___FjEa_", l = "index__primary___xp8O7", d = "index__secondary___OFg2h", p = "index__checked___czTh1", f = t(5797), _ = t.n(f), h = t(6070), v = (0, 
        a.forwardRef)(function(e, n) {
            (0, a.useImperativeHandle)(n, function() {
                return {};
            });
            var t = e.primary, o = e.checked, f = e.secondary, v = e.onChange;
            return (0, h.jsxs)(r.Ss, {
                className: s()(c, i({}, p, o)),
                onClick: function() {
                    console.log("Checkbox clicked", o), v && v(!o);
                },
                children: [ (0, h.jsxs)(r.Ss, {
                    children: [ (0, h.jsx)(r.Ss, {
                        className: l,
                        onClick: function(e) {
                            e.stopPropagation(), e.preventDefault(), _().navigateTo({
                                url: "/pages/member-policy/index"
                            });
                        },
                        children: t
                    }), (0, h.jsx)(r.Ss, {
                        className: d,
                        children: f
                    }) ]
                }), (0, h.jsx)(r.Ss, {
                    className: u
                }) ]
            });
        });
    },
    6384: function(e, n, t) {
        t.d(n, {
            A: function() {
                return _;
            }
        });
        var r = t(2012), a = t(758), o = t(5119), s = t.n(o), c = {
            card: "index__card___idVS_",
            tip1: "index__tip1___QAQ39",
            tip2: "index__tip2___pdn2Z",
            cardType1: "index__cardType1___jE4Pp",
            cardType2: "index__cardType2___QY_cG",
            cardType5: "index__cardType5___U80WL",
            text1: "index__text1___ZoKlR",
            head: "index__head___notuo",
            text: "index__text___x539t",
            icon: "index__icon___kXkkr",
            primary: "index__primary___cWpX6",
            secondary: "index__secondary___qxymg"
        }, u = t(6070);
        function l(e) {
            var n = [];
            return null != e && e.map(function(e) {
                if (e) {
                    var t = 1 === e.type ? "私教" : "团课", r = 2 === e.countType ? "".concat(t, "不限次") : "".concat(t).concat(e.usageCount, "次");
                    if (n.push(r), e.giftCount > 0) {
                        var a = "".concat(t, "赠送: ").concat(e.giftCount, "次");
                        n.push(a);
                    }
                }
            }), n;
        }
        var d = function(e) {
            var n = e.data, t = [], a = 0;
            return "groupTpl" in n || "personalTpl" in n ? (a = 5, (t = l([ n.groupTpl, n.personalTpl ])).push("有效期".concat(n.validDays, "天"))) : (a = n.type, 
            (t = l([ n ])).push("有效期".concat(n.validDays, "天"))), (0, u.jsxs)(r.Ss, {
                className: s()(c.card, "memberCard" + a),
                children: [ (0, u.jsx)(r.Ss, {
                    className: c.text1
                }), (0, u.jsx)(r.Ss, {
                    className: s()(c.tip2, i({}, c["cardType" + a], !0))
                }), (0, u.jsx)(r.Ss, {
                    className: c.primary,
                    children: null == n ? void 0 : n.name
                }), (0, u.jsx)(r.Ss, {
                    className: c.secondary,
                    children: t.join("｜")
                }) ]
            });
        }, p = "index__swiper___S6Oir", f = "index__swiperItem___kQsQS", _ = (0, a.forwardRef)(function(e, n) {
            (0, a.useImperativeHandle)(n, function() {
                return {};
            });
            var t = e.list, o = void 0 === t ? [] : t, s = e.current, i = e.onChange;
            return (0, u.jsx)(r.RC, {
                current: s,
                className: p,
                indicatorColor: "rgba(255, 255, 255, 0.3)",
                indicatorActiveColor: "#fff",
                circular: !0,
                indicatorDots: !0,
                duration: 300,
                onChange: function(e) {
                    i && i(e.detail.current);
                },
                children: null == o ? void 0 : o.map(function(e, n) {
                    return (0, u.jsx)(r.wu, {
                        className: f,
                        children: (0, u.jsx)(d, {
                            data: e
                        })
                    }, n);
                })
            });
        });
    },
    6255: function(e, n, t) {
        t.d(n, {
            A: function() {
                return p;
            }
        });
        var r = t(2012), a = t(758), o = t(5119), s = t.n(o), c = t(1904), u = t(8739), l = {
            label: "index__label___kP0UE",
            body: "index__body___sI4hv",
            card: "index__card___roGne",
            title: "index__title___FOlKM",
            icon: "index__icon___p2IWV",
            cardType1: "index__cardType1___LShfJ",
            cardType2: "index__cardType2___lr107",
            cardType3: "index__cardType3___HC0SN",
            cardType4: "index__cardType4___QJmxi",
            cardType5: "index__cardType5___Kczgt",
            cardType6: "index__cardType6____WCLU",
            content: "index__content___MpE0z",
            name: "index__name___o16r9",
            status: "index__status___uVwqE",
            info: "index__info___e4f2L",
            hr: "index__hr___TYqjL",
            footer: "index__footer___z9vW5",
            cardBox: "index__cardBox___HaOLi",
            options: "index__options___ZcgGl",
            option: "index__option___cMRcx",
            check: "index__check___QQZFy",
            selected: "index__selected___i1k9A"
        }, d = t(6070), p = (0, a.forwardRef)(function(e, n) {
            (0, a.useImperativeHandle)(n, function() {
                return {};
            });
            var t = e.value, o = e.options, p = void 0 === o ? [] : o, f = e.onSelect;
            return (0, d.jsx)(r.Ss, {
                className: l.options,
                children: null == p ? void 0 : p.map(function(e) {
                    var n;
                    return (0, d.jsx)(r.Ss, {
                        className: s()(l.option, "press-lg", i({}, l.selected, e.id === (null == t ? void 0 : t.id))),
                        onClick: function() {
                            return function(e) {
                                null == f || f(e);
                            }(e);
                        },
                        children: (0, d.jsxs)(r.Ss, {
                            className: l.cardBox,
                            children: [ (0, d.jsxs)(r.Ss, {
                                className: l.body,
                                children: [ (0, d.jsxs)(r.Ss, {
                                    className: s()(l.card, "memberCard" + (null == e ? void 0 : e.tplType), "onlineType" + (null == e ? void 0 : e.onlineType)),
                                    children: [ (0, d.jsx)(r.Ss, {
                                        className: s()(l.icon, (n = {}, i(n, l["cardType" + (null == e ? void 0 : e.tplType)], !0), 
                                        i(n, l["onlineType" + (null == e ? void 0 : e.onlineType)], !0), n))
                                    }), (0, d.jsx)(r.Ss, {
                                        className: l.title,
                                        children: (0, u.YQ)(e)
                                    }) ]
                                }), (0, d.jsxs)(r.Ss, {
                                    className: l.content,
                                    children: [ (0, d.jsxs)(r.Ss, {
                                        className: l.name,
                                        children: [ null == e ? void 0 : e.name, (0, d.jsx)(r.Ss, {
                                            className: s()(l.status, "memberCardStatus" + (null == e ? void 0 : e.status)),
                                            children: c.Sp[null == e ? void 0 : e.status]
                                        }) ]
                                    }), (0, d.jsx)(r.Ss, {
                                        className: l.info,
                                        children: (0, u.Is)({
                                            bodys: (null == e ? void 0 : e.bodys) || [],
                                            validDays: (null == e ? void 0 : e.validDays) || 0
                                        }).join(" | ")
                                    }) ]
                                }), (0, d.jsx)(r.Ss, {
                                    className: l.check
                                }) ]
                            }), (0, d.jsx)(r.Ss, {
                                className: l.hr
                            }), (0, d.jsx)(r.Ss, {
                                className: l.footer,
                                children: (0, u.bw)({
                                    bodys: (null == e ? void 0 : e.bodys) || [],
                                    expTime: (null == e ? void 0 : e.expTime) || 0
                                }).join(" | ")
                            }) ]
                        })
                    }, e.id);
                })
            });
        });
    },
    8739: function(e, n, t) {
        t.d(n, {
            Is: function() {
                return s;
            },
            YQ: function() {
                return c;
            },
            bw: function() {
                return i;
            }
        });
        var r = t(1904), a = t(6287), o = t.n(a);
        function s(e) {
            var n = e.bodys, t = e.validDays, r = [];
            return null != n && n.map(function(e) {
                var n = 1 === e.bodyType ? "私教" : "团课", t = 2 === e.countType ? "".concat(n, "不限次") : "".concat(n).concat(e.usageCount, "次");
                if (r.push(t), e.giftCount + e.couponCount > 0) {
                    var a = "".concat(n, "赠送").concat(e.giftCount + e.couponCount, "次");
                    r.push(a);
                }
            }), r.push("有效期".concat(t, "天")), r;
        }
        function i(e) {
            var n = e.bodys, t = e.expTime, r = [];
            if (null != n && n.map(function(e) {
                var n = 1 === e.bodyType ? "私教" : "团课", t = 2 === e.countType ? "".concat(n, "剩余: 不限次") : "".concat(n, "剩余: ").concat(e.usageCount - e.usedCount, "次");
                if (r.push(t), e.giftCount > 0) {
                    var a = "".concat(n, "赠送剩余: ").concat(e.giftCount - e.giftCountUsed, "次");
                    r.push(a);
                }
            }), t > 0) {
                var a = o().unix(t).format("YYYY-MM-DD");
                r.push("有效期至: ".concat(a));
            }
            return r;
        }
        function c(e) {
            var n = e.tplType, t = e.onlineType;
            return 5 === n && 1 === t ? "线上卡" : r.S6[n] || "未知类型";
        }
    },
    5956: function(e, n, t) {
        t.d(n, {
            T: function() {
                return i;
            }
        });
        var r = t(2012), a = t(8149), o = "index__tabs___fg8oh", s = t(6070);
        function i(e) {
            var n = e.current, t = e.onChange, i = e.tabList, c = void 0 === i ? [] : i;
            return (0, s.jsx)(r.Ss, {
                className: o,
                children: (0, s.jsx)(a.kF, {
                    current: n,
                    tabList: c,
                    onClick: t
                })
            });
        }
    },
    9300: function(e, n, t) {
        t.d(n, {
            A: function() {
                return c;
            }
        });
        var r = t(2012), a = t(8149), o = "index__picker___ALzdr", s = "index__selectText___kYXVk", i = t(6070), c = function(e) {
            var n = e.range, t = e.value, c = e.onChange, u = e.text;
            return (0, i.jsx)(r.LC, {
                range: n,
                value: t,
                onChange: c,
                children: (0, i.jsxs)(r.Ss, {
                    className: o,
                    children: [ (0, i.jsx)(r.Ss, {
                        className: s,
                        children: u
                    }), (0, i.jsx)(a.Xx, {
                        value: "chevron-down",
                        size: "16",
                        color: "#999"
                    }) ]
                })
            });
        };
    },
    7037: function(e, n, t) {
        t.d(n, {
            A: function() {
                return s;
            }
        });
        var r = t(2012), a = "index__selectContainer___h6irE", o = t(6070), s = function(e) {
            var n = e.children;
            return (0, o.jsx)(r.Ss, {
                className: a,
                children: n
            });
        };
    },
    8491: function(e, n, t) {
        t.d(n, {
            A: function() {
                return _;
            }
        });
        var r = t(2012), a = t(8149), o = t(2217), s = "index__root___sgUVU", i = "index__left___mBRX0", c = "index__primary___z_msX", u = "index__name___Bae95", l = "index__distance___sDke6", d = "index__detail___FLSWL", p = "index__button___VXrBa", f = t(6070);
        function _(e) {
            var n = e.store, t = e.onSwitch;
            return (0, f.jsxs)(r.Ss, {
                className: s,
                children: [ (0, f.jsxs)(r.Ss, {
                    className: i,
                    children: [ (0, f.jsxs)(r.Ss, {
                        className: c,
                        children: [ (0, f.jsx)(r.EY, {
                            className: u,
                            children: null == n ? void 0 : n.name
                        }), (0, f.jsxs)(r.Ss, {
                            className: l,
                            children: [ (0, f.jsx)(a.Xx, {
                                value: "map-pin",
                                size: "12",
                                color: "#fff"
                            }), (0, f.jsx)(o.A, {
                                location: {
                                    latitude: Number(null == n ? void 0 : n.latitude),
                                    longitude: Number(null == n ? void 0 : n.longitude)
                                }
                            }) ]
                        }) ]
                    }), (0, f.jsxs)(r.Ss, {
                        className: d,
                        children: [ null == n ? void 0 : n.startTime, " - ", null == n ? void 0 : n.endTime ]
                    }), (0, f.jsx)(r.Ss, {
                        className: d,
                        children: null == n ? void 0 : n.address
                    }) ]
                }), t && (0, f.jsxs)(r.Ss, {
                    className: p,
                    onClick: function() {
                        t();
                    },
                    children: [ "切换门店 ", (0, f.jsx)(a.Xx, {
                        value: "chevron-down",
                        size: "14",
                        color: "#fff"
                    }) ]
                }) ]
            });
        }
    },
    6395: function(e, n, t) {
        t.d(n, {
            A: function() {
                return c;
            }
        });
        var r = t(2012), a = t(758), o = {}, i = t(6070);
        function c(e) {
            var n = e.citys, t = e.stores, c = e.currentStore, u = e.setCurrentStore, l = e.setCurrentCity, d = (0, 
            a.useState)(0), p = s(d, 2), f = p[0], _ = p[1], h = (0, a.useState)(0), v = s(h, 2), m = v[0], x = v[1], g = n || [], y = (null == t ? void 0 : t.filter(function(e) {
                var t;
                return e.regionalId === (null === (t = n[f]) || void 0 === t ? void 0 : t.id);
            })) || [], b = [ null == g ? void 0 : g.map(function(e) {
                return e.city;
            }), null == y ? void 0 : y.map(function(e) {
                return e.name;
            }) ];
            return (0, i.jsx)(r.LC, {
                mode: "multiSelector",
                range: b,
                value: [ f, m ],
                onChange: function(e) {
                    var n = s(e.detail.value, 2), t = n[0], r = n[1];
                    console.log("picker onChange:", g[t], y[r]), l(g[t]), u(y[r]);
                },
                onColumnChange: function(e) {
                    var n = e.detail, t = n.column, r = n.value;
                    0 === t && _(r), 1 === t && x(r);
                },
                children: (0, i.jsx)(r.Ss, {
                    className: o.picker,
                    children: null == c ? void 0 : c.name
                })
            });
        }
    },
    7907: function(e, n, t) {
        t.d(n, {
            A: function() {
                return u;
            }
        });
        var r = t(2012), a = t(8149), o = t(5797), s = t.n(o), i = {
            userCard: "index__userCard___fpTia",
            nickname: "index__nickname___WFBox"
        }, c = t(6070), u = function(e) {
            var n = e.userInfo;
            return (0, c.jsxs)(r.Ss, {
                className: i.userCard,
                onClick: function() {
                    s().navigateTo({
                        url: "/pages/user-info/index"
                    });
                },
                children: [ (0, c.jsx)(a.Zy, {
                    className: i.avatar,
                    circle: !0,
                    image: null == n ? void 0 : n.avatar,
                    text: null == n ? void 0 : n.nickName
                }), (0, c.jsx)(r.Ss, {
                    className: i.nickname,
                    children: null == n ? void 0 : n.nickName
                }) ]
            });
        };
    },
    1681: function(e, n, t) {
        t.d(n, {
            A: function() {
                return f;
            }
        });
        var r = t(2012), a = t(5797), o = t.n(a), s = "index__userInfo___i1R_h", i = "index__infoCard___TAXni", c = "index__infoItem___yFtg1", u = "index__label___ckdIi", l = "index__value___GYVqL", d = "index__hr___IcW3f", p = t(6070), f = function(e) {
            var n = e.userInfo;
            return (0, p.jsx)(r.Ss, {
                className: s,
                children: (0, p.jsxs)(r.Ss, {
                    className: i,
                    children: [ (0, p.jsxs)(r.Ss, {
                        className: c,
                        onClick: function() {
                            o().navigateTo({
                                url: "/pages/my-card/list/index"
                            });
                        },
                        children: [ (0, p.jsx)(r.Ss, {
                            className: u,
                            children: "会员卡数"
                        }), (0, p.jsx)(r.Ss, {
                            className: l,
                            children: null == n ? void 0 : n.cardCount
                        }) ]
                    }), (0, p.jsx)(r.Ss, {
                        className: d
                    }), (0, p.jsxs)(r.Ss, {
                        className: c,
                        children: [ (0, p.jsx)(r.Ss, {
                            className: u,
                            children: "团课次数"
                        }), (0, p.jsx)(r.Ss, {
                            className: l,
                            children: (null == n ? void 0 : n.groupCount) >= 0 ? null == n ? void 0 : n.groupCount : "不限次"
                        }) ]
                    }), (0, p.jsx)(r.Ss, {
                        className: d
                    }), (0, p.jsxs)(r.Ss, {
                        className: c,
                        children: [ (0, p.jsx)(r.Ss, {
                            className: u,
                            children: "私教课次数"
                        }), (0, p.jsx)(r.Ss, {
                            className: l,
                            children: (null == n ? void 0 : n.personalCount) >= 0 ? null == n ? void 0 : n.personalCount : "不限次"
                        }) ]
                    }) ]
                })
            });
        };
    },
    2994: function(e, n, t) {
        t.d(n, {
            P: function() {
                return o;
            }
        });
        var r = t(758), a = t(9706);
        function o() {
            var e = (0, a.A)(), n = e.city, t = e.store, o = e.cityList, i = e.storeList, c = (0, 
            r.useState)(n), u = s(c, 2), l = u[0], d = u[1], p = (0, r.useState)(t), f = s(p, 2);
            return {
                citys: o,
                stores: i,
                currentCity: l,
                currentStore: f[0],
                setCurrentCity: d,
                setCurrentStore: f[1]
            };
        }
    },
    6312: function(e, n, t) {
        t.d(n, {
            A: function() {
                return p;
            }
        });
        var r = t(2012), a = t(5797), o = t.n(a), s = t(5119), c = t.n(s), u = t(8135), l = {
            items: "index__items___wpV_y",
            item: "index__item___FEWPJ",
            card: "index__card___cAnfA",
            content: "index__content___Jacxl",
            row: "index__row___MSeQh",
            name: "index__name___F2_tC",
            national: "index__national___qhgaN",
            info: "index__info___BAkpI",
            actions: "index__actions___qpK4O",
            detail: "index__detail___OUBir",
            button: "index__button___vejZ8"
        }, d = t(6070);
        function p(e) {
            var n = e.items, t = e.store, a = e.current, s = e.onChange, p = e.onBook, f = e.showBookButton, _ = void 0 === f || f, h = function(e) {
                var r = n[e];
                r && t && (o().navigateTo({
                    url: "/pages/coach/detail/index?id=".concat(r.id),
                    success: function(e) {
                        e.eventChannel.emit("acceptDataFromOpenerPage", {
                            data: {
                                coach: r,
                                store: t
                            }
                        });
                    }
                }), o().vibrateShort({
                    type: "light"
                }));
            };
            return (0, d.jsx)(r.Ss, {
                className: l.items,
                children: null == n ? void 0 : n.map(function(e, n) {
                    return (0, d.jsx)(r.Ss, {
                        className: c()(l.item, i({}, l.active, a === n)),
                        onClick: function() {
                            return function(e) {
                                null != s && s(e), o().vibrateShort({
                                    type: "light"
                                });
                            }(n);
                        },
                        children: (0, d.jsxs)(r.Ss, {
                            className: c()(l.card, ""),
                            children: [ (0, d.jsx)(u.A, {
                                src: e.avatar,
                                style: {
                                    width: "200rpx",
                                    height: "200rpx",
                                    borderRadius: "8px"
                                }
                            }), (0, d.jsxs)(r.Ss, {
                                className: l.content,
                                children: [ (0, d.jsxs)(r.Ss, {
                                    className: l.row,
                                    children: [ (0, d.jsx)(r.EY, {
                                        className: l.name,
                                        children: e.name
                                    }), (0, d.jsx)(r.EY, {
                                        className: l.national,
                                        children: e.national
                                    }) ]
                                }), (0, d.jsx)(r.EY, {
                                    className: l.info,
                                    children: e.info
                                }), (0, d.jsxs)(r.Ss, {
                                    className: l.actions,
                                    children: [ (0, d.jsx)(r.Ss, {
                                        className: l.detail,
                                        onClick: function(e) {
                                            e.stopPropagation(), h(n);
                                        },
                                        children: "详情 >"
                                    }), _ && (0, d.jsx)(r.Ss, {
                                        className: c()(l.button, "press"),
                                        onClick: function(e) {
                                            e.stopPropagation(), function(e) {
                                                null != p && p(e), o().vibrateShort({
                                                    type: "light"
                                                });
                                            }(n);
                                        },
                                        children: "会员预约"
                                    }) ]
                                }) ]
                            }) ]
                        })
                    }, e.id);
                })
            });
        }
    },
    8370: function(e, n, t) {
        t.d(n, {
            A: function() {
                return _;
            }
        });
        var r = t(2012), a = t(5797), o = t.n(a), s = t(5119), c = t.n(s), u = "index__items___ecmnG", l = "index__item___bSTwn", d = "index__text____9j5f", p = "index__active___PfiGt", f = t(6070);
        function _(e) {
            var n = e.items, t = e.current, a = e.onChange, s = function(e) {
                null != a && a(e), o().vibrateShort({
                    type: "light"
                });
            };
            return (0, f.jsx)(r.Ss, {
                className: u,
                children: null == n ? void 0 : n.map(function(e, n) {
                    var a;
                    return (0, f.jsx)(r.Ss, {
                        className: c()(l, (a = {}, i(a, p, t === n), i(a, "press", !0), a)),
                        onClick: function() {
                            return s(n);
                        },
                        children: (0, f.jsx)(r.EY, {
                            className: d,
                            children: e
                        })
                    }, "".concat(e, "-").concat(n));
                })
            });
        }
    },
    9219: function(e, n, t) {
        t.d(n, {
            A: function() {
                return m;
            }
        });
        var r = t(2012), a = t(5797), o = t.n(a), s = t(5119), c = t.n(s), u = "index__items___gVxPB", l = "index__item___cjvQP", d = "index__box___zp6r5", p = "index__primary___cit1I", f = "index__secondary___rZ_3A", _ = "index__disabled___tX6pW", h = "index__active___MC8eo", v = t(6070);
        function m(e) {
            var n = e.items, t = e.current, a = void 0 === t ? 0 : t, s = e.onChange, m = function(e) {
                null != s && s(e, n[e]), o().vibrateShort({
                    type: "light"
                });
            };
            return (0, v.jsx)(r.Ss, {
                className: u,
                children: null == n ? void 0 : n.map(function(e, n) {
                    var t;
                    return (0, v.jsx)(r.Ss, {
                        className: c()(l, (t = {}, i(t, h, a === n), i(t, _, e.disabled), i(t, "press", !e.disabled), 
                        t)),
                        onClick: function() {
                            return !e.disabled && m(n);
                        },
                        children: (0, v.jsxs)(r.Ss, {
                            className: d,
                            children: [ (0, v.jsx)(r.EY, {
                                className: p,
                                children: e.primary
                            }), (0, v.jsx)(r.EY, {
                                className: f,
                                children: e.secondary
                            }) ]
                        })
                    }, n);
                })
            });
        }
    },
    613: function(e, n, t) {
        t.d(n, {
            A: function() {
                return h;
            }
        });
        var r = t(2012), a = t(5797), o = t.n(a), s = t(5119), c = t.n(s), u = "index__items___cyw8o", l = "index__item___I4auK", d = "index__text___ydls7", p = "index__active___wg5Ic", f = "index__disabled____PG9K", _ = t(6070);
        function h(e) {
            var n = e.items, t = e.current, a = e.onChange, s = function(e) {
                null != a && a(e), o().vibrateShort({
                    type: "light"
                });
            };
            return (0, _.jsx)(r.Ss, {
                className: u,
                children: n.map(function(e, n) {
                    var a;
                    return (0, _.jsx)(r.Ss, {
                        className: c()(l, (a = {}, i(a, p, t === n), i(a, f, e.disabled), i(a, "press", !e.disabled), 
                        a)),
                        onClick: function() {
                            return !e.disabled && s(n);
                        },
                        children: (0, _.jsx)(r.EY, {
                            className: d,
                            children: e.value
                        })
                    }, "".concat(e.value, "-").concat(n));
                })
            });
        }
    },
    6584: function(e, n, o) {
        o.d(n, {
            Bj: function() {
                return _;
            },
            OH: function() {
                return v;
            },
            Qe: function() {
                return l;
            },
            Se: function() {
                return p;
            },
            jj: function() {
                return c;
            },
            q$: function() {
                return S;
            },
            rE: function() {
                return w;
            }
        });
        var i = o(6116);
        function c(e) {
            return u.apply(this, arguments);
        }
        function u() {
            return (u = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, i.E)({
                            url: (0, i.c)("/member/v1/class/list", n),
                            method: "GET",
                            doNotCheckToken: !0
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("getClassList failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function l(e) {
            return d.apply(this, arguments);
        }
        function d() {
            return (d = a(r().mark(function e(n) {
                var t, a, o;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.classId, a = n.cardId, e.prev = 1, e.next = 4, (0, i.E)({
                            url: "/member/v1/class/booking",
                            method: "POST",
                            data: {
                                classId: t,
                                cardId: a
                            }
                        });

                      case 4:
                        return o = e.sent, e.abrupt("return", o.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("classBooking failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
        function p(e) {
            return f.apply(this, arguments);
        }
        function f() {
            return (f = a(r().mark(function e(n) {
                var t, a, o, s;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.id, a = n.idType, e.prev = 1, o = {
                            id: t,
                            idType: a
                        }, e.next = 5, (0, i.E)({
                            url: (0, i.c)("/member/v1/class/booking", o),
                            method: "PUT"
                        });

                      case 5:
                        return s = e.sent, e.abrupt("return", s.data);

                      case 9:
                        throw e.prev = 9, e.t0 = e.catch(1), console.error("classBooking failed:", e.t0), 
                        e.t0;

                      case 12:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 9 ] ]);
            }))).apply(this, arguments);
        }
        function _(e) {
            return h.apply(this, arguments);
        }
        function h() {
            return (h = a(r().mark(function e(n) {
                var t, a, o, s, c, u, l;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.storeId, a = n.userId, o = n.lastId, s = void 0 === o ? 0 : o, c = n.pageSize, 
                        u = void 0 === c ? 10 : c, e.prev = 1, e.next = 4, (0, i.E)({
                            url: (0, i.c)("/member/v1/class/movie", {
                                userId: a,
                                storeId: t,
                                lastId: s,
                                pageSize: u
                            }),
                            method: "GET"
                        });

                      case 4:
                        return l = e.sent, e.abrupt("return", l.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("classBooking failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
        function v(e) {
            return m.apply(this, arguments);
        }
        function m() {
            return (m = a(r().mark(function e(n) {
                var t, a;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.id, e.prev = 1, e.next = 4, (0, i.E)({
                            url: (0, i.c)("/member/v1/class/moviedetail", {
                                id: t
                            }),
                            method: "GET"
                        });

                      case 4:
                        return a = e.sent, e.abrupt("return", a.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("classBooking failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
        function x(e) {
            return g.apply(this, arguments);
        }
        function g() {
            return (g = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return console.log("getClassBookingList params:", n), e.prev = 1, e.next = 4, (0, 
                        i.E)({
                            url: (0, i.c)("/member/v1/class/booking", n),
                            method: "GET"
                        });

                      case 4:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getClassList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
        function y(e) {
            return b.apply(this, arguments);
        }
        function b() {
            return (b = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return console.log("getPersonalClassBookingList params:", n), e.prev = 1, e.next = 4, 
                        (0, i.E)({
                            url: (0, i.c)("/member/v1/class/ptbooking", n),
                            method: "GET"
                        });

                      case 4:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getClassList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
        function w(e) {
            return k.apply(this, arguments);
        }
        function k() {
            return (k = a(r().mark(function e(n) {
                var a, o, i, c, u, l, d, p, f, _;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return console.log("getCombinedBookingList params:", n), e.prev = 1, e.next = 4, 
                        Promise.all([ x(n), y(n) ]);

                      case 4:
                        return c = e.sent, u = s(c, 2), l = u[0], d = u[1], p = null === (a = l.data.list || []) || void 0 === a ? void 0 : a.map(function(e) {
                            return {
                                id: e.class.id,
                                startTime: e.class.startTime,
                                duration: e.class.duration,
                                courseName: e.class.courseName,
                                customerType: e.class.customerType,
                                storeName: e.storeName,
                                type: 2,
                                status: e.status,
                                coach: e.class.coach,
                                capacity: e.class.capacity,
                                bookingNum: e.class.bookingNum,
                                cardName: e.cardName
                            };
                        }), f = null === (o = d.data.list || []) || void 0 === o ? void 0 : o.map(function(e) {
                            return {
                                id: e.id,
                                startTime: e.startTime,
                                duration: e.duration,
                                courseName: e.courseName,
                                customerType: e.customerType,
                                storeName: e.storeName,
                                type: 1,
                                coach: e.coach,
                                status: e.status,
                                cardName: e.cardName
                            };
                        }), _ = null === (i = [].concat(t(p), t(f))) || void 0 === i ? void 0 : i.sort(function(e, n) {
                            return n.startTime - e.startTime;
                        }), e.abrupt("return", {
                            code: 200,
                            msg: "success",
                            data: {
                                list: _
                            }
                        });

                      case 14:
                        throw e.prev = 14, e.t0 = e.catch(1), console.error("getCombinedBookingList failed:", e.t0), 
                        e.t0;

                      case 17:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 14 ] ]);
            }))).apply(this, arguments);
        }
        function S(e) {
            return j.apply(this, arguments);
        }
        function j() {
            return (j = a(r().mark(function e(n) {
                var t, a, o;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.id, a = n.idType, e.prev = 1, e.next = 4, (0, i.E)({
                            url: (0, i.c)("/member/v1/class/qrcode", {
                                id: t,
                                idType: a
                            }),
                            method: "GET"
                        });

                      case 4:
                        return o = e.sent, e.abrupt("return", o.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getClassList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
    },
    9690: function(e, n, t) {
        t.d(n, {
            l: function() {
                return s;
            }
        });
        var o = t(6116);
        function s(e) {
            return i.apply(this, arguments);
        }
        function i() {
            return (i = a(r().mark(function e(n) {
                var t, a, s;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.storeId, a = n.regionalId, e.prev = 1, e.next = 4, (0, o.E)({
                            url: (0, o.c)("/member/v1/coach/list", {
                                storeId: t,
                                regionalId: a
                            }),
                            method: "GET"
                        });

                      case 4:
                        return s = e.sent, e.abrupt("return", s.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getCoachList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
    },
    5042: function(e, n, t) {
        t.d(n, {
            UU: function() {
                return h;
            },
            Xi: function() {
                return u;
            },
            _7: function() {
                return d;
            },
            eA: function() {
                return f;
            }
        });
        var s = t(6116), i = t(5797), c = t.n(i);
        function u() {
            return l.apply(this, arguments);
        }
        function l() {
            return (l = a(r().mark(function e() {
                var n, t, a, o = arguments;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return n = o.length > 0 && void 0 !== o[0] ? o[0] : 0, t = o.length > 1 && void 0 !== o[1] ? o[1] : 100, 
                        e.prev = 2, e.next = 5, (0, s.E)({
                            url: (0, s.c)("/member/v1/esign/list", {
                                lastId: n,
                                pageSize: t
                            }),
                            method: "GET"
                        });

                      case 5:
                        return a = e.sent, e.abrupt("return", a.data);

                      case 9:
                        throw e.prev = 9, e.t0 = e.catch(2), console.error("getEsignList failed:", e.t0), 
                        e.t0;

                      case 12:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 2, 9 ] ]);
            }))).apply(this, arguments);
        }
        function d(e) {
            return p.apply(this, arguments);
        }
        function p() {
            return (p = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, s.E)({
                            url: "/member/v1/esign/detail?sn=".concat(n),
                            method: "POST"
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("getEsignDetail failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function f(e, n) {
            return _.apply(this, arguments);
        }
        function _() {
            return (_ = a(r().mark(function e(n, t) {
                var a;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, s.E)(o(o({}, t), {}, {
                            url: "/member/v1/esign/dl?sn=".concat(n),
                            method: "GET"
                        }));

                      case 3:
                        return a = e.sent, e.abrupt("return", a.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("getEsignDetail failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function h(e) {
            return v.apply(this, arguments);
        }
        function v() {
            return (v = a(r().mark(function e(n) {
                var t, a, o;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.flowId, a = n.accountId, o = "prod", e.abrupt("return", (console.log("env:", o), 
                        new Promise(function(e, n) {
                            c().navigateToMiniProgram({
                                appId: "wx1cf2708c2de46337",
                                path: "/pages/index/index",
                                extraData: {
                                    requestObj: {
                                        flowId: t,
                                        accountId: a,
                                        type: "SIGN",
                                        env: o
                                    },
                                    callbackObj: {
                                        from: "esign"
                                    }
                                },
                                envVersion: "release",
                                success: function(n) {
                                    console.log("Mini program launched successfully:", n), e(n);
                                },
                                fail: function(e) {
                                    console.log("Mini program launched fail:", e), n(e);
                                },
                                complete: function(e) {
                                    console.log("Mini program launched complete:", e);
                                }
                            });
                        })));

                      case 3:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
    },
    7160: function(e, n, t) {
        t.d(n, {
            $t: function() {
                return c;
            },
            fS: function() {
                return s;
            },
            n7: function() {
                return l;
            }
        });
        var o = t(6116);
        function s(e) {
            return i.apply(this, arguments);
        }
        function i() {
            return (i = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: "/order/v1/card/detail",
                            method: "POST",
                            data: n
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("createOrder failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function c() {
            return u.apply(this, arguments);
        }
        function u() {
            return (u = a(r().mark(function e() {
                var n;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: "/member/v1/card/list",
                            method: "GET"
                        });

                      case 3:
                        return n = e.sent, e.abrupt("return", n.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("getClassList failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function l(e) {
            return d.apply(this, arguments);
        }
        function d() {
            return (d = a(r().mark(function e(n) {
                var t, a, s, i, c;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.lastId, a = void 0 === t ? 0 : t, s = n.pageSize, i = void 0 === s ? 100 : s, 
                        e.prev = 1, e.next = 4, (0, o.E)({
                            url: (0, o.c)("/member/v1/order/list", {
                                lastId: a,
                                pageSize: i
                            }),
                            method: "GET"
                        });

                      case 4:
                        return c = e.sent, e.abrupt("return", c.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getClassList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
    },
    7634: function(e, n, t) {
        t.d(n, {
            G: function() {
                return c;
            },
            L: function() {
                return s;
            }
        });
        var o = t(6116);
        function s(e) {
            return i.apply(this, arguments);
        }
        function i() {
            return (i = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: "/payment/v1/minipay/detail",
                            method: "POST",
                            data: n
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("createPayment failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function c(e) {
            return u.apply(this, arguments);
        }
        function u() {
            return (u = a(r().mark(function e(n) {
                var t, a, s;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.sn, a = n.orderType, e.prev = 1, e.next = 4, (0, o.E)({
                            url: "/order/v1/tradestate",
                            method: "GET",
                            data: {
                                sn: t,
                                orderType: a
                            }
                        });

                      case 4:
                        return s = e.sent, e.abrupt("return", s.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("createPayment failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
    },
    8086: function(e, n, t) {
        t.d(n, {
            C: function() {
                return s;
            }
        });
        var o = t(6116);
        function s(e) {
            return i.apply(this, arguments);
        }
        function i() {
            return (i = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: "/member/v1/class/pt/booking",
                            method: "POST",
                            data: n
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("ptBooking failed:", e.t0), e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
    },
    5399: function(e, n, t) {
        t.d(n, {
            V: function() {
                return c;
            },
            y: function() {
                return s;
            }
        });
        var o = t(6116);
        function s(e) {
            return i.apply(this, arguments);
        }
        function i() {
            return (i = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: (0, o.c)("/member/v1/class/pt/bookinglist", n),
                            method: "GET"
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("getPtBookingList failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function c(e) {
            return u.apply(this, arguments);
        }
        function u() {
            return (u = a(r().mark(function e(n) {
                var t, a;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.storeId, e.prev = 1, e.next = 4, (0, o.E)({
                            url: (0, o.c)("/member/v1/class/pt/coach", {
                                storeId: t
                            }),
                            method: "GET"
                        });

                      case 4:
                        return a = e.sent, e.abrupt("return", a.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getPtCoachList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
    },
    4736: function(e, n, t) {
        t.d(n, {
            s: function() {
                return s;
            }
        });
        var o = t(6116);
        function s(e) {
            return i.apply(this, arguments);
        }
        function i() {
            return (i = a(r().mark(function e(n) {
                var t, a, s;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.storeId, a = n.coachId, e.prev = 1, e.next = 4, (0, o.E)({
                            url: (0, o.c)("/member/v1/class/pt/course", {
                                storeId: t,
                                coachId: a
                            }),
                            method: "GET"
                        });

                      case 4:
                        return s = e.sent, e.abrupt("return", s.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getPtAvailableDateList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
    },
    1273: function(e, n, t) {
        t.d(n, {
            G: function() {
                return s;
            },
            v: function() {
                return c;
            }
        });
        var o = t(6116);
        function s(e) {
            return i.apply(this, arguments);
        }
        function i() {
            return (i = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: (0, o.c)("/member/v1/store/list", {
                                regionalId: n
                            }),
                            method: "GET",
                            doNotCheckToken: !0
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("Registration failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function c(e) {
            return u.apply(this, arguments);
        }
        function u() {
            return (u = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: "/member/v1/store/detail?id=".concat(n),
                            method: "GET"
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("Failed to fetch store detail:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
    },
    6788: function(e, n, t) {
        t.d(n, {
            TX: function() {
                return i;
            },
            hB: function() {
                return d;
            },
            vC: function() {
                return u;
            }
        });
        var o = t(6116);
        function i(e) {
            return c.apply(this, arguments);
        }
        function c() {
            return (c = a(r().mark(function e(n) {
                var t, a;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.regionalId, e.prev = 1, e.next = 4, (0, o.E)({
                            url: (0, o.c)("/member/v1/tpl/list", {
                                regionalId: t
                            }),
                            method: "GET"
                        });

                      case 4:
                        return a = e.sent, e.abrupt("return", a.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getTplList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
        function u(e) {
            return l.apply(this, arguments);
        }
        function l() {
            return (l = a(r().mark(function e(n) {
                var t, a;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return t = n.regionalId, e.prev = 1, e.next = 4, (0, o.E)({
                            url: (0, o.c)("/member/v1/pkg/list", {
                                regionalId: t
                            }),
                            method: "GET"
                        });

                      case 4:
                        return a = e.sent, e.abrupt("return", a.data);

                      case 8:
                        throw e.prev = 8, e.t0 = e.catch(1), console.error("getPkgList failed:", e.t0), 
                        e.t0;

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 1, 8 ] ]);
            }))).apply(this, arguments);
        }
        function d(e) {
            return p.apply(this, arguments);
        }
        function p() {
            return (p = a(r().mark(function e(n) {
                var t, a, o, c, l, d, p;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return o = [], e.next = 3, Promise.all([ i({
                            regionalId: n
                        }), u({
                            regionalId: n
                        }) ]);

                      case 3:
                        return c = e.sent, l = s(c, 2), d = l[0], p = l[1], e.abrupt("return", (200 === d.code && null !== (t = d.data.list) && void 0 !== t && t.map(function(e) {
                            1 !== e.type && 2 !== e.type || o.push({
                                name: e.name,
                                id: e.id,
                                type: e.type,
                                validDays: e.validDays,
                                originPrice: e.originPrice,
                                regionalDiscount: e.regionalDiscount
                            });
                        }), 200 === p.code && null !== (a = p.data.list) && void 0 !== a && a.map(function(e) {
                            2 === e.type && o.push({
                                name: e.name,
                                id: e.id,
                                type: 5,
                                validDays: e.validDays,
                                originPrice: e.originPrice,
                                regionalDiscount: e.regionalDiscount
                            });
                        }), o));

                      case 8:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
    },
    6298: function(e, n, t) {
        t.d(n, {
            JC: function() {
                return q;
            },
            LF: function() {
                return A;
            },
            WG: function() {
                return y;
            },
            bu: function() {
                return F;
            },
            iD: function() {
                return C;
            },
            kz: function() {
                return S;
            },
            ri: function() {
                return z;
            },
            ug: function() {
                return T;
            },
            y1: function() {
                return E;
            }
        });
        var o = t(6116), s = t(5797), i = t.n(s), c = t(4910), u = t(743), l = t(230), d = t(9706), p = t(3372), f = t(7160), _ = t(1273), h = t(5042), v = "fgm_token", m = "fgm_token_expire";
        function x() {
            return g.apply(this, arguments);
        }
        function g() {
            return (g = a(r().mark(function e() {
                var n;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, i().getStorage({
                            key: v
                        });

                      case 2:
                        return n = e.sent, e.abrupt("return", n.data);

                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
        function y(e, n) {
            return b.apply(this, arguments);
        }
        function b() {
            return (b = a(r().mark(function e(n, t) {
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, i().setStorage({
                            key: v,
                            data: n
                        });

                      case 2:
                        return e.next = 4, i().setStorage({
                            key: m,
                            data: t
                        });

                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
        function w() {
            return k.apply(this, arguments);
        }
        function k() {
            return (k = a(r().mark(function e() {
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, i().removeStorage({
                            key: v
                        });

                      case 2:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
        function S(e, n) {
            return j.apply(this, arguments);
        }
        function j() {
            return (j = a(r().mark(function e(n, t) {
                var a;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: "/member/v1/user/wxMiniRegister",
                            method: "POST",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                jscode: n,
                                phoneCode: t
                            },
                            doNotCheckToken: !0
                        });

                      case 3:
                        return a = e.sent, e.abrupt("return", a.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("Registration failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function C(e) {
            return N.apply(this, arguments);
        }
        function N() {
            return (N = a(r().mark(function e(n) {
                var t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: "/member/v1/user/wxMiniLogin",
                            method: "POST",
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                code: n
                            },
                            doNotCheckToken: !0
                        });

                      case 3:
                        return t = e.sent, e.abrupt("return", t.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("Login failed:", e.t0), e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function T() {
            return I.apply(this, arguments);
        }
        function I() {
            return (I = a(r().mark(function e() {
                var n;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, o.E)({
                            url: "/member/v1/user/detail",
                            method: "GET",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        });

                      case 3:
                        return n = e.sent, e.abrupt("return", n.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("Get user info failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        function E() {
            return L.apply(this, arguments);
        }
        function L() {
            return (L = a(r().mark(function e() {
                var n, t, a;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, i().login();

                      case 2:
                        return n = e.sent, e.next = 5, C(n.code);

                      case 5:
                        return t = e.sent, e.next = 8, y(t.data.accessToken, t.data.accessExpire);

                      case 8:
                        return e.next = 10, T();

                      case 10:
                        a = e.sent, c.k.getState().setUserInfo(a.data.userInfo);

                      case 12:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
        function A() {
            return P.apply(this, arguments);
        }
        function P() {
            return (P = a(r().mark(function e() {
                var n, t, o, s;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, (0, h.Xi)();

                      case 2:
                        200 === (n = e.sent).code && (u.b.getState().setEsignList(n.data.list || []), Array.isArray(n.data.list) && n.data.list.length > 0) && (o = null === (t = n.data.list) || void 0 === t ? void 0 : t.filter(function(e) {
                            return 0 === e.status;
                        }), console.log("Unsign list:", o), s = (0, p.K)(o, {
                            status: function(e) {
                                return {
                                    0: 1e11,
                                    2: 2e11,
                                    3: 3e11
                                }[e] || 3e11;
                            },
                            orderTime: function(e) {
                                return -e;
                            }
                        }), console.log("sortedUnsignList:", s), s.length > 0 && i().showModal({
                            title: "极斗会员电子合同",
                            content: "尊敬的会员，您好！为保证您的权益，您办理的会员卡需签订电子合同才能激活所有功能！",
                            showCancel: !1,
                            success: function() {
                                var e = a(r().mark(function e() {
                                    var n, t, a;
                                    return r().wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                          case 0:
                                            return i().showLoading({
                                                title: "正在跳转签署...",
                                                mask: !0
                                            }), n = s[0], e.prev = 2, e.next = 5, (0, h._7)(n.sn);

                                          case 5:
                                            return t = e.sent, e.next = 8, (0, h.UU)({
                                                flowId: t.data.signFlowId,
                                                accountId: t.data.psnId
                                            });

                                          case 8:
                                            a = e.sent, console.log("writeEsign response:", a), e.next = 15;
                                            break;

                                          case 12:
                                            e.prev = 12, e.t0 = e.catch(2), console.log("writeEsign error:", e.t0);

                                          case 15:
                                            i().hideLoading(), i().navigateTo({
                                                url: "/pages/esign/list/index"
                                            });

                                          case 16:
                                          case "end":
                                            return e.stop();
                                        }
                                    }, e, null, [ [ 2, 12 ] ]);
                                }));
                                return function() {
                                    return e.apply(this, arguments);
                                };
                            }()
                        }));

                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
        function z() {
            return G.apply(this, arguments);
        }
        function G() {
            return (G = a(r().mark(function e() {
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, w();

                      case 2:
                        c.k.getState().clearUserInfo(), i().reLaunch({
                            url: "/pages/me/index"
                        });

                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
        function q() {
            return D.apply(this, arguments);
        }
        function D() {
            return (D = a(r().mark(function e() {
                var n;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, x();

                      case 3:
                        if (n = e.sent, console.log("Current token:", n), !n) {
                            e.next = 18;
                            break;
                        }
                        return console.log("Token exists, proceeding with silent login."), e.prev = 6, e.next = 9, 
                        E();

                      case 9:
                        e.next = 14;
                        break;

                      case 11:
                        e.prev = 11, e.t0 = e.catch(6), console.error("Silent login failed:", e.t0);

                      case 14:
                        return e.next = 16, Promise.all([ A(), a(r().mark(function e() {
                            var n;
                            return r().wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                  case 0:
                                    return e.next = 2, B();

                                  case 2:
                                    return n = e.sent, e.next = 5, R(n);

                                  case 5:
                                  case "end":
                                    return e.stop();
                                }
                            }, e);
                        }))() ]);

                      case 16:
                        e.next = 20;
                        break;

                      case 18:
                        return e.next = 20, R();

                      case 20:
                        e.next = 27;
                        break;

                      case 22:
                        return e.prev = 22, e.t1 = e.catch(0), console.error("Silent login failed:", e.t1), 
                        e.next = 27, R();

                      case 27:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 22 ], [ 6, 11 ] ]);
            }))).apply(this, arguments);
        }
        function F(e, n) {
            return M.apply(this, arguments);
        }
        function M() {
            return (M = a(r().mark(function e(n, t) {
                var a, o;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, x();

                      case 3:
                        if (a = e.sent) {
                            e.next = 6;
                            break;
                        }
                        throw new Error("User not logged in, cannot update user info.");

                      case 6:
                        return "/member/v1/user/detail", e.next = 9, i().uploadFile({
                            url: "https://mini.arfighter.com/fg/member/v1/user/detail",
                            filePath: n,
                            name: "file",
                            header: {
                                Authorization: "Bearer ".concat(a)
                            },
                            formData: {
                                nickName: t
                            }
                        });

                      case 9:
                        return o = e.sent, e.abrupt("return", (console.log("Update user info response:", o), 
                        200 === o.statusCode ? JSON.parse(o.data) : {
                            code: o.statusCode,
                            msg: "更新用户信息失败",
                            data: null
                        }));

                      case 13:
                        throw e.prev = 13, e.t0 = e.catch(0), console.error("Update user info failed:", e.t0), 
                        e.t0;

                      case 16:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 13 ] ]);
            }))).apply(this, arguments);
        }
        function B() {
            return O.apply(this, arguments);
        }
        function O() {
            return (O = a(r().mark(function e() {
                var n, t, a, o, s;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, f.$t)();

                      case 3:
                        if (!(200 === (t = e.sent).code && t.data.list.length > 0)) {
                            e.next = 11;
                            break;
                        }
                        return o = null === (a = t.data.list) || void 0 === a ? void 0 : a.sort(function(e, n) {
                            return n.createTime - e.createTime;
                        })[0], console.log("最近购买的会员卡:", o), e.next = 9, (0, _.v)(o.storeId);

                      case 9:
                        return s = e.sent, e.abrupt("return", (console.log("最近购买的会员卡店铺详情:", s.data.detail), 
                        n = s.data.detail, s.data.detail));

                      case 11:
                        console.error("获取订单列表失败:", t.msg), e.next = 17;
                        break;

                      case 14:
                        throw e.prev = 14, e.t0 = e.catch(0), console.error("Select default shop failed:", e.t0), 
                        e.t0;

                      case 17:
                        return e.abrupt("return", n);

                      case 18:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 14 ] ]);
            }))).apply(this, arguments);
        }
        function R(e) {
            return U.apply(this, arguments);
        }
        function U() {
            return (U = a(r().mark(function e(n) {
                var t, a, o, s, i;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return console.log("默认店铺:", n), e.next = 3, (0, l.iG)(n);

                      case 3:
                        t = e.sent, console.log("定位信息:", t), console.log("位置信息:", t.location), console.log("当前城市:", t.city), 
                        console.log("当前店铺:", t.store), a = d.A.getState(), o = a.setStore, s = a.setCity, 
                        i = a.setLocation, s(t.city), o(n || t.store), i(t.location);

                      case 7:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
    },
    743: function(e, n, t) {
        t.d(n, {
            b: function() {
                return r;
            }
        });
        var r = (0, t(8442).v)(function(e) {
            return {
                esignList: [],
                setEsignList: function(n) {
                    return e({
                        esignList: n
                    });
                },
                clearEsignList: function() {
                    return e({
                        esignList: []
                    });
                }
            };
        });
    },
    5453: function(e, n, t) {
        t.d(n, {
            S: function() {
                return r;
            }
        });
        var r = (0, t(8442).v)(function(e) {
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
                coachList: [],
                setCoachList: function(n) {
                    console.log("- Setting coachList:", n), e({
                        coachList: n
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
        });
    },
    9706: function(e, n, t) {
        t.d(n, {
            A: function() {
                return u;
            }
        });
        var o = t(8442), s = t(7747), i = t(5797), c = t.n(i), u = (0, o.v)()((0, s.Zr)(function(e) {
            return {
                city: null,
                store: null,
                location: null,
                cityList: [],
                storeList: [],
                setStore: function(n) {
                    console.log("- Setting store:", n), e({
                        store: n
                    });
                },
                clearStore: function() {
                    return e({
                        store: null
                    });
                },
                setCity: function(n) {
                    console.log("- Setting city:", n), e({
                        city: n
                    });
                },
                clearCity: function() {
                    return e({
                        city: null
                    });
                },
                setLocation: function(n) {
                    console.log("- Setting location:", n), e({
                        location: n
                    });
                },
                clearLocation: function() {
                    return e({
                        location: null
                    });
                },
                setCityList: function(n) {
                    console.log("- Setting cityList:", n), e({
                        cityList: n
                    });
                },
                setStoreList: function(n) {
                    console.log("- Setting storeList:", n), e({
                        storeList: n
                    });
                }
            };
        }, {
            name: "store-storage",
            storage: (0, s.KU)(function() {
                return {
                    getItem: (t = a(r().mark(function e(n) {
                        var t;
                        return r().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                              case 0:
                                return e.prev = 0, e.next = 3, c().getStorage({
                                    key: n
                                });

                              case 3:
                                return t = e.sent, e.abrupt("return", t.data);

                              case 7:
                                return e.prev = 7, e.t0 = e.catch(0), e.abrupt("return", null);

                              case 10:
                              case "end":
                                return e.stop();
                            }
                        }, e, null, [ [ 0, 7 ] ]);
                    })), function(e) {
                        return t.apply(this, arguments);
                    }),
                    setItem: (n = a(r().mark(function e(n, t) {
                        return r().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                              case 0:
                                return e.next = 2, c().setStorage({
                                    key: n,
                                    data: t
                                });

                              case 2:
                              case "end":
                                return e.stop();
                            }
                        }, e);
                    })), function(e, t) {
                        return n.apply(this, arguments);
                    }),
                    removeItem: (e = a(r().mark(function e(n) {
                        return r().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                              case 0:
                                return e.next = 2, c().removeStorage({
                                    key: n
                                });

                              case 2:
                              case "end":
                                return e.stop();
                            }
                        }, e);
                    })), function(n) {
                        return e.apply(this, arguments);
                    })
                };
                var e, n, t;
            })
        }));
    },
    4910: function(e, n, t) {
        t.d(n, {
            k: function() {
                return r;
            }
        });
        var r = (0, t(8442).v)(function(e) {
            return {
                userInfo: null,
                setUserInfo: function(n) {
                    return e({
                        userInfo: n
                    });
                },
                clearUserInfo: function() {
                    return e({
                        userInfo: null
                    });
                }
            };
        });
    },
    3372: function(e, n, t) {
        t.d(n, {
            $: function() {
                return u;
            },
            K: function() {
                return c;
            }
        });
        var r = t(644), a = t.n(r), o = t(5797), i = t.n(o);
        function c(e, n) {
            return Array.isArray(e) && 0 !== e.length ? e.sort(function(e, t) {
                var r = 0, o = 0;
                return Object.entries(n).forEach(function(n) {
                    var i = s(n, 2), c = i[0], u = i[1], l = a()(e, c);
                    r += Number(u(l));
                    var d = a()(t, c);
                    o += Number(u(d));
                }), r - o;
            }) : e;
        }
        function u() {
            var e, n, t = (null === (e = i().getCurrentInstance()) || void 0 === e || null === (n = e.router) || void 0 === n ? void 0 : n.params) || {};
            if (t.scene) try {
                return decodeURIComponent(t.scene).split("&").reduce(function(e, n) {
                    var t = n.split("=", 2), r = s(t, 2), a = r[0], o = r[1];
                    return a && o && (e[a] = o), e;
                }, {});
            } catch (t) {
                t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                return console.error("Error decoding scene", t), {};
            }
            return {};
        }
    },
    1904: function(e, n, t) {
        t.d(n, {
            S6: function() {
                return o;
            },
            Sp: function() {
                return u;
            },
            V9: function() {
                return i;
            },
            Yk: function() {
                return p;
            },
            eS: function() {
                return f;
            },
            m6: function() {
                return a;
            },
            n9: function() {
                return c;
            },
            rk: function() {
                return d;
            },
            sk: function() {
                return l;
            },
            t7: function() {
                return s;
            },
            ut: function() {
                return r;
            },
            w0: function() {
                return _;
            }
        });
        var r = {
            1: "通用",
            2: "成人",
            3: "儿童"
        }, a = {
            1: "泰拳",
            2: "柔术",
            3: "拳击",
            4: "格斗"
        }, o = {
            1: "私教卡",
            2: "团课卡",
            3: "体验卡",
            4: "预售卡",
            5: "特惠卡",
            6: "大客户卡"
        }, s = {
            0: "待支付",
            1: "已支付",
            4: "已过期",
            "-1": "已取消"
        }, i = {
            1: "单店",
            2: "通店"
        }, c = {
            2: "无限卡",
            1: "限次卡"
        }, u = {
            0: "未激活",
            1: "已激活",
            2: "停卡",
            3: "已过期",
            4: "延期",
            5: "待激活",
            6: "已失效",
            "-1": "未开卡"
        }, l = {
            1: "wechat",
            2: "cash",
            3: "pos",
            4: "bank_transfer",
            5: "review",
            6: "other"
        }, d = {
            wechat: 1,
            cash: 2,
            pos: 3,
            bank_transfer: 4,
            review: 5,
            other: 6
        }, p = {
            4: "客服",
            5: "店长"
        }, f = {
            0: "未签署",
            2: "已签署",
            3: "已作废"
        }, _ = {
            1: "购卡合同",
            2: "退费协议",
            3: "解约协议"
        };
    },
    230: function(e, o, i) {
        i.d(o, {
            gd: function() {
                return x;
            },
            iG: function() {
                return b;
            },
            jD: function() {
                return y;
            }
        });
        var c = i(5797), u = i.n(c), l = i(6116);
        function d() {
            return p.apply(this, arguments);
        }
        function p() {
            return (p = a(r().mark(function e() {
                var n;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, (0, l.E)({
                            url: "/member/v1/regional/list",
                            method: "GET",
                            doNotCheckToken: !0
                        });

                      case 3:
                        return n = e.sent, e.abrupt("return", n.data);

                      case 7:
                        throw e.prev = 7, e.t0 = e.catch(0), console.error("getRegionalList failed:", e.t0), 
                        e.t0;

                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 7 ] ]);
            }))).apply(this, arguments);
        }
        var f = i(1273), _ = i(1042), h = i.n(_), v = i(9706), m = function() {
            var e = a(r().mark(function e() {
                var n;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, u().getSetting();

                      case 3:
                        if (!e.sent.authSetting["scope.userFuzzyLocation"]) {
                            e.next = 8;
                            break;
                        }
                        console.log("用户已经授权模糊位置"), e.next = 12;
                        break;

                      case 8:
                        return console.log("用户未授权模糊位置，尝试授权"), e.next = 11, u().authorize({
                            scope: "scope.userFuzzyLocation"
                        });

                      case 11:
                        console.log("授权成功");

                      case 12:
                        return console.log("开始获取用户模糊位置"), e.next = 15, u().getFuzzyLocation({
                            type: "wgs84"
                        });

                      case 15:
                        return n = e.sent, e.abrupt("return", n);

                      case 19:
                        e.prev = 19, e.t0 = e.catch(0), console.error("获取用户模糊位置失败", e.t0), u().showModal({
                            title: "位置权限获取失败",
                            content: "请在设置中开启位置权限",
                            showCancel: !0,
                            confirmText: "去设置",
                            cancelText: "取消",
                            success: function(e) {
                                var n;
                                e.confirm && u().openSetting({
                                    success: (n = a(r().mark(function e(n) {
                                        var t;
                                        return r().wrap(function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                              case 0:
                                                if (console.log("设置页面返回", n), !n.authSetting["scope.userFuzzyLocation"]) {
                                                    e.next = 11;
                                                    break;
                                                }
                                                return e.prev = 1, e.next = 4, u().getFuzzyLocation({
                                                    type: "wgs84"
                                                });

                                              case 4:
                                                t = e.sent, console.log("重新获取位置成功:", t), e.next = 11;
                                                break;

                                              case 8:
                                                e.prev = 8, e.t0 = e.catch(1), console.error("重新获取位置失败:", e.t0);

                                              case 11:
                                              case "end":
                                                return e.stop();
                                            }
                                        }, e, null, [ [ 1, 8 ] ]);
                                    })), function(e) {
                                        return n.apply(this, arguments);
                                    })
                                });
                            }
                        });

                      case 22:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 19 ] ]);
            }));
            return function() {
                return e.apply(this, arguments);
            };
        }(), x = function(e, n, t, r) {
            var a = (t - e) * Math.PI / 180, o = (r - n) * Math.PI / 180, s = Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(e * Math.PI / 180) * Math.cos(t * Math.PI / 180) * Math.sin(o / 2) * Math.sin(o / 2);
            return 6371 * (2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)));
        }, g = function() {
            var e = a(r().mark(function e(t, a, o, s) {
                var i, c, u, l, d, p, f;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        e.prev = 0, console.log("获取到的店铺列表:", o), console.log("获取到的城市列表:", s), i = null, 
                        c = 1 / 0, u = n(o);
                        try {
                            for (u.s(); !(l = u.n()).done; ) (d = l.value).latitude && d.longitude && (p = x(t, a, parseFloat(d.latitude), parseFloat(d.longitude))) < c && (c = p, 
                            i = d);
                        } catch (e) {
                            e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                            u.e(e);
                        } finally {
                            u.f();
                        }
                        return f = (null == s ? void 0 : s.find(function(e) {
                            var n;
                            return e.id === (null === (n = i) || void 0 === n ? void 0 : n.regionalId);
                        })) || null, e.abrupt("return", {
                            store: i,
                            city: f
                        });

                      case 9:
                        return e.prev = 9, e.t0 = e.catch(0), e.abrupt("return", (console.error("获取最近店铺失败:", e.t0), 
                        {
                            store: null,
                            city: null
                        }));

                      case 12:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 9 ] ]);
            }));
            return function(n, t, r, a) {
                return e.apply(this, arguments);
            };
        }(), y = function() {
            var e = a(r().mark(function e(n) {
                var a;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.prev = 0, e.next = 3, m();

                      case 3:
                        if (null == (a = e.sent) || !a.latitude || null == a || !a.longitude) {
                            e.next = 6;
                            break;
                        }
                        return e.abrupt("return", t(n).sort(function(e, n) {
                            return (e.latitude && e.longitude ? x(a.latitude, a.longitude, parseFloat(e.latitude), parseFloat(e.longitude)) : 1 / 0) - (n.latitude && n.longitude ? x(a.latitude, a.longitude, parseFloat(n.latitude), parseFloat(n.longitude)) : 1 / 0);
                        }));

                      case 6:
                        e.next = 11;
                        break;

                      case 8:
                        e.prev = 8, e.t0 = e.catch(0), console.error("获取用户位置失败，使用默认排序", e.t0);

                      case 11:
                        return e.abrupt("return", n);

                      case 12:
                      case "end":
                        return e.stop();
                    }
                }, e, null, [ [ 0, 8 ] ]);
            }));
            return function(n) {
                return e.apply(this, arguments);
            };
        }(), b = function() {
            var e = a(r().mark(function e(n) {
                var t, a, o, i, c, u, l, p, _, x, y, b, w, k, S, j, C;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, m();

                      case 2:
                        if (!((t = e.sent) && t.latitude && t.longitude)) {
                            e.next = 25;
                            break;
                        }
                        return e.next = 6, Promise.all([ (0, f.G)(0), d() ]);

                      case 6:
                        if (o = e.sent, i = s(o, 2), c = i[0], u = i[1], l = v.A.getState(), p = l.setStoreList, 
                        _ = l.setCityList, x = Object.keys(h()(c.data.list, "regionalId")), y = null === (a = u.data.list) || void 0 === a ? void 0 : a.filter(function(e) {
                            return x.includes(e.id.toString());
                        }), console.log("过滤后的城市列表:", y), p(c.data.list), _(y), !n) {
                            e.next = 19;
                            break;
                        }
                        return console.log("使用传入的默认店铺，跳过距离计算"), w = n, k = (null == u || null === (b = u.data) || void 0 === b ? void 0 : b.list.find(function(e) {
                            return e.id === n.regionalId;
                        })) || null, e.abrupt("return", {
                            location: t,
                            city: k,
                            store: w
                        });

                      case 19:
                        return e.next = 21, g(t.latitude, t.longitude, c.data.list, y);

                      case 21:
                        return S = e.sent, j = S.store, C = S.city, e.abrupt("return", {
                            location: t,
                            city: C,
                            store: j
                        });

                      case 25:
                        return e.abrupt("return", (console.log("未能获取到有效的位置信息"), {
                            location: null,
                            city: null
                        }));

                      case 26:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }));
            return function(n) {
                return e.apply(this, arguments);
            };
        }();
    },
    6116: function(n, t, i) {
        i.d(t, {
            E: function() {
                return m;
            },
            c: function() {
                return v;
            }
        });
        var u = i(5797), l = i.n(u), d = i(8991).URLSearchParams, p = "fgm_token", f = "fgm_token_expire";
        function _() {
            return h.apply(this, arguments);
        }
        function h() {
            return (h = a(r().mark(function e() {
                var n, t;
                return r().wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                      case 0:
                        return e.next = 2, l().getStorage({
                            key: f
                        });

                      case 2:
                        if (!((n = e.sent).data && n.data < Date.now() / 1e3)) {
                            e.next = 5;
                            break;
                        }
                        throw console.warn("Token has expired"), new Error("Token has expired");

                      case 5:
                        return e.next = 7, l().getStorage({
                            key: p
                        });

                      case 7:
                        if ((t = e.sent).data) {
                            e.next = 10;
                            break;
                        }
                        throw console.warn("Token not found"), new Error("Token not found");

                      case 10:
                        return e.abrupt("return", t.data);

                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e);
            }))).apply(this, arguments);
        }
        function v(e, n) {
            var t = new d();
            n && Object.entries(n).forEach(function(e) {
                var n = s(e, 2), r = n[0], a = n[1];
                null != a && t.append(r, String(a));
            });
            var r = t.toString();
            return r ? "".concat(e, "?").concat(r) : e;
        }
        function m(e) {
            return x.apply(this, arguments);
        }
        function x() {
            return (x = a(r().mark(function n(t) {
                var a, s, i, u, d, p;
                return r().wrap(function(n) {
                    for (;;) switch (n.prev = n.next) {
                      case 0:
                        if (a = t.url, s = t.doNotCheckToken, i = e(t, c), a) {
                            n.next = 3;
                            break;
                        }
                        throw new Error("URL is required for the request");

                      case 3:
                        return u = a.startsWith("http") ? a : "https://mini.arfighter.com/fg" + a, d = "", 
                        n.prev = 5, n.next = 8, _();

                      case 8:
                        d = n.sent, n.next = 15;
                        break;

                      case 11:
                        if (n.prev = 11, n.t0 = n.catch(5), console.error("Error in getToken:", n.t0), s) {
                            n.next = 15;
                            break;
                        }
                        throw new Error("Token is required for this request");

                      case 15:
                        return n.next = 17, l().request(o(o({}, i), {}, {
                            header: o(o({}, i.header || {}), {}, {
                                Authorization: d
                            }),
                            url: u
                        }));

                      case 17:
                        return p = n.sent, n.abrupt("return", p);

                      case 19:
                      case "end":
                        return n.stop();
                    }
                }, n, null, [ [ 5, 11 ] ]);
            }))).apply(this, arguments);
        }
    },
    2889: function(e, n, t) {
        t.d(n, {
            $g: function() {
                return o;
            },
            Jf: function() {
                return s;
            },
            su: function() {
                return c;
            },
            yy: function() {
                return i;
            }
        });
        var r = t(5797), a = t.n(r), o = function(e) {
            if (null == e || "" === e) return "0";
            var n = "string" == typeof e ? parseFloat(e) : e;
            return Number.isNaN(n) ? "0" : n.toLocaleString("zh-CN");
        }, s = function(e) {
            return e ? e.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "";
        }, i = function(e) {
            return new Promise(function(n) {
                return setTimeout(n, e);
            });
        }, c = function() {
            try {
                var e = a().getAccountInfoSync();
                if (console.log("Account Info:", e), e && e.miniProgram && e.miniProgram.version) return e.miniProgram.version;
            } catch (e) {
                e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                console.log("Failed to get version from Taro:", e);
            }
            try {
                return t(8330).version || "1.0.0";
            } catch (e) {
                e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                return console.log("Failed to get version from package.json:", e), "1.0.0";
            }
        };
    },
    8330: function(e) {
        e.exports = JSON.parse('{"name":"jidou2","version":"1.0.0","private":true,"description":"","templateInfo":{"name":"default","typescript":true,"css":"Sass","framework":"React"},"scripts":{"dev":"npm run build:weapp -- --watch","build":"taro build --type weapp","build:weapp":"taro build --type weapp","build:swan":"taro build --type swan","build:alipay":"taro build --type alipay","build:tt":"taro build --type tt","build:h5":"taro build --type h5","build:rn":"taro build --type rn","build:qq":"taro build --type qq","build:jd":"taro build --type jd","build:harmony-hybrid":"taro build --type harmony-hybrid","dev:weapp":"npm run build:weapp -- --watch","dev:swan":"npm run build:swan -- --watch","dev:alipay":"npm run build:alipay -- --watch","dev:tt":"npm run build:tt -- --watch","dev:h5":"npm run build:h5 -- --watch","dev:rn":"npm run build:rn -- --watch","dev:qq":"npm run build:qq -- --watch","dev:jd":"npm run build:jd -- --watch","dev:harmony-hybrid":"npm run build:harmony-hybrid -- --watch"},"browserslist":["defaults and fully supports es6-module","maintained node versions"],"author":"","dependencies":{"@babel/runtime":"^7.24.4","@tarojs/components":"4.1.2","@tarojs/helper":"4.1.2","@tarojs/plugin-framework-react":"4.1.2","@tarojs/plugin-platform-alipay":"4.1.2","@tarojs/plugin-platform-h5":"4.1.2","@tarojs/plugin-platform-harmony-hybrid":"4.1.2","@tarojs/plugin-platform-jd":"4.1.2","@tarojs/plugin-platform-qq":"4.1.2","@tarojs/plugin-platform-swan":"4.1.2","@tarojs/plugin-platform-tt":"4.1.2","@tarojs/plugin-platform-weapp":"4.1.2","@tarojs/react":"4.1.2","@tarojs/runtime":"4.1.2","@tarojs/shared":"4.1.2","@tarojs/taro":"4.1.2","classnames":"^2.5.1","dayjs":"^1.11.13","lodash":"^4.17.21","react":"^18.0.0","react-dom":"^18.0.0","taro-ui":"^3.3.0","zustand":"^5.0.6"},"devDependencies":{"@babel/core":"^7.24.4","@babel/plugin-transform-class-properties":"7.25.9","@babel/preset-react":"^7.24.1","@pmmmwh/react-refresh-webpack-plugin":"^0.5.5","@tarojs/cli":"4.1.2","@tarojs/taro-loader":"4.1.2","@tarojs/webpack5-runner":"4.1.2","@types/node":"^18","@types/react":"^18.0.0","@types/webpack-env":"^1.13.6","babel-preset-taro":"4.1.2","eslint":"^8.57.0","eslint-config-taro":"4.1.2","eslint-plugin-react":"^7.34.1","eslint-plugin-react-hooks":"^4.4.0","postcss":"^8.4.38","react-refresh":"^0.14.0","sass":"^1.75.0","stylelint":"^16.4.0","tsconfig-paths-webpack-plugin":"^4.1.0","typescript":"^5.4.5","webpack":"5.91.0"}}');
    }
} ]);