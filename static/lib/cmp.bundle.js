/**
 * @license RequireJS text 2.0.5 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

define("text", [ "module" ], function(e) {
    var t, n, r = [ "Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0" ], i = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, s = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, o = typeof location != "undefined" && location.href, u = o && location.protocol && location.protocol.replace(/\:/, ""), a = o && location.hostname, f = o && (location.port || undefined), l = [], c = e.config && e.config() || {};
    t = {
        version: "2.0.5",
        strip: function(e) {
            if (e) {
                e = e.replace(i, "");
                var t = e.match(s);
                t && (e = t[1]);
            } else e = "";
            return e;
        },
        jsEscape: function(e) {
            return e.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029");
        },
        
createXhr: c.createXhr || function() {
            var e, t, n;
            if (typeof XMLHttpRequest != "undefined") return new XMLHttpRequest;
            if (typeof ActiveXObject != "undefined") for (t = 0; t < 3; t += 1) {
                n = r[t];
                try {
                    e = new ActiveXObject(n);
                } catch (i) {}
                if (e) {
                    r = [ n ];
                    break;
                }
            }
            return e;
        },
        parseName: function(e) {
            var t, n, r, i = !1, s = e.indexOf("."), o = e.indexOf("./") === 0 || e.indexOf("../") === 0;
            return s !== -1 && (!o || s > 1) ? (t = e.substring(0, s), n = e.substring(s + 1, e.length)) : t = e, r = n || t, s = r.indexOf("!"), s !== -1 && (i = r.substring(s + 1) === "strip", r = r.substring(0, s), n ? n = r : t = r), {
                moduleName: t,
                ext: n,
                strip: i
            };
        },
        xdRegExp
: /^((\w+)\:)?\/\/([^\/\\]+)/,
        useXhr: function(e, n, r, i) {
            var s, o, u, a = t.xdRegExp.exec(e);
            return a ? (s = a[2], o = a[3], o = o.split(":"), u = o[1], o = o[0], (!s || s === n) && (!o || o.toLowerCase() === r.toLowerCase()) && (!u && !o || u === i)) : !0;
        },
        finishLoad: function(e, n, r, i) {
            r = n ? t.strip(r) : r, c.isBuild && (l[e] = r), i(r);
        },
        load: function(e, n, r, i) {
            if (i.isBuild && !i.inlineText) {
                r();
                return;
            }
            c.isBuild = i.isBuild;
            var s = t.parseName(e), l = s.moduleName + (s.ext ? "." + s.ext : ""), h = n.toUrl(l), p = c.useXhr || t.useXhr;
            !o || p(h, u, a, f) ? t.get(h, function(n) {
                t.finishLoad(e, s.strip, n, r);
            }, function(e) {
                r.error && r.error(e);
            }) : n([ l ], function(e) {
                t.finishLoad(s.moduleName + "." + s.ext, s
.strip, e, r);
            });
        },
        write: function(e, n, r, i) {
            if (l.hasOwnProperty(n)) {
                var s = t.jsEscape(l[n]);
                r.asModule(e + "!" + n, "define(function () { return '" + s + "';});\n");
            }
        },
        writeFile: function(e, n, r, i, s) {
            var o = t.parseName(n), u = o.ext ? "." + o.ext : "", a = o.moduleName + u, f = r.toUrl(o.moduleName + u) + ".js";
            t.load(a, r, function(n) {
                var r = function(e) {
                    return i(f, e);
                };
                r.asModule = function(e, t) {
                    return i.asModule(e, f, t);
                }, t.write(e, a, r, s);
            }, s);
        }
    };
    if (c.env === "node" || !c.env && typeof process != "undefined" && process.versions && !!process.versions.node) n = require.nodeRequire("fs"), t.get = function(e, t) {
        var r = n.readFileSync(e, "utf8");
        r.indexOf("\ufeff") === 0 && 
(r = r.substring(1)), t(r);
    }; else if (c.env === "xhr" || !c.env && t.createXhr()) t.get = function(e, n, r, i) {
        var s = t.createXhr(), o;
        s.open("GET", e, !0);
        if (i) for (o in i) i.hasOwnProperty(o) && s.setRequestHeader(o.toLowerCase(), i[o]);
        c.onXhr && c.onXhr(s, e), s.onreadystatechange = function(t) {
            var i, o;
            s.readyState === 4 && (i = s.status, i > 399 && i < 600 ? (o = new Error(e + " HTTP status: " + i), o.xhr = s, r(o)) : n(s.responseText));
        }, s.send(null);
    }; else if (c.env === "rhino" || !c.env && typeof Packages != "undefined" && typeof java != "undefined") t.get = function(e, t) {
        var n, r, i = "utf-8", s = new java.io.File(e), o = java.lang.System.getProperty("line.separator"), u = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(s), i)), a = "";
        try {
            n = new java.lang.StringBuffer, r = u.readLine(), r && r.length() && r.charAt(0) === 65279 && 
(r = r.substring(1)), n.append(r);
            while ((r = u.readLine()) !== null) n.append(o), n.append(r);
            a = String(n.toString());
        } finally {
            u.close();
        }
        t(a);
    };
    return t;
}), define("text!modules/app.xml", [], function() {
    return '<application>\r\n    <region  id="editor" name="codeEditor" controller="@binding[codeEditor]" height="100%"></region>\r\n    <region  id="cmd" name="shellCmd" controller="@binding[shellCmd]" height="100%"></region>\r\n    <vbox height="100%">\r\n        <container prefer="30" style="margin-bottom:3px;">\r\n            <region name="toolbar" controller="@binding[toolbar]" height="100%"></region>\r\n        </container>\r\n        <hbox class="flexBox"> \r\n            <tab prefer="230"  maxTabWidth="30" minTabWidth="30" class="leftTabContent" >\r\n                <panel title="\u9879\u76ee\u7ec4\u4ef6">\r\n                    <tab prefer="200" maxTabWidth="50" minTabWidth="50" height="100%">\r\n                        <panel title="PAGE" >\r\n                            <region name="page" controller="@binding[page]" style="height:100%"></region>\r\n                        </panel>\r\n                        <panel title="\u7ec4\u4ef6">\r\n                            <region name="component" controller="@binding[component]" style="height:100%"></region>\r\n                        </panel>\r\n                        <panel title="\u5c42\u7ea7">\r\n                            <region name="hierarchy" controller="@binding[hierarchy]" style="height:100%"></region>\r\n                        </panel>\r\n                        <panel title="MOCK">\r\n                            <region name="dataMock" controller="@binding[dataMock]" style="height:100%"></region>\r\n                        </panel>\r\n                    </tab>\r\n                </panel>\r\n                <panel title="\u7f51\u7edc\u7ec4\u4ef6">\r\n                    <region name="pool" controller="@binding[pool]" style="height:100%"></region>\r\n                </panel>\r\n                <panel title="\u6a21\u677f\u89c4\u8303">\r\n                    <region name="template" controller="@binding[template]" style="height:100%"></region>\r\n                </panel>\r\n                <panel title="\u63d2\u4ef6\u6269\u5c55">\r\n                </panel>\r\n            </tab>\r\n            <region flex="1" name="viewport" class="mainContent" style="margin:0 5px;webkit-box-flex: 1;flex: 1;" controller="@binding[viewport]"></region>\r\n            <region class="propContent" prefer="280" name="property" controller="@binding[property]"></region>\r\n        </hbox>\r\n    </vbox>\r\n</application>\r\n\r\n'
;
}), define("modules/router", [ "require" ], function(e) {
    var t = Router();
    return t.configure({
        recurse: "forward"
    }), t;
}), define("controllerConfig", {
    navigator: {
        "modules/navigator/index": {
            url: "*"
        }
    },
    viewport: {
        "modules/viewport/index": {
            url: "*"
        }
    },
    property: {
        "modules/property/index": {
            url: "*"
        }
    },
    toolbar: {
        "modules/toolbar/index": {
            url: "*"
        }
    },
    hierarchy: {
        "modules/hierarchy/index": {
            url: "*"
        }
    },
    component: {
        "modules/component/index": {
            url: "*"
        }
    },
    page: {
        "modules/page/index": {
            url: "*"
        }
    },
    template: {
        "modules/template/index": {
            url: "*"
        }
    },
    pool: {
        "modules/pool/index": {
            url: "*"
        }
    },
    codeEditor: {
        "modules/codeEditor/index"
: {
            url: "*"
        }
    },
    shellCmd: {
        "modules/shellCmd/index": {
            url: "*"
        }
    },
    dataMock: {
        "modules/dataMock/index": {
            url: "*"
        }
    }
}), define("app", [ "require", "qpf", "_", "text!modules/app.xml", "modules/router", "./controllerConfig", "knockout" ], function(e) {
    function u() {
        var n = e("knockout"), o = t.use("core/xmlparser"), u = o.parse(r);
        document.getElementById("CMP").appendChild(u), n.applyBindings(s, u), i.init("/");
    }
    var t = e("qpf"), n = e("_"), r = e("text!modules/app.xml"), i = e("modules/router"), s = e("./controllerConfig"), o = t.use("core/mixin/event"), a = {
        start: u
    };
    return n.extend(a, o), a;
}), define("core/command", [], function() {
    var e = {}, t = [], n = [], r = {
        execute: function(t) {
            var r = Array.prototype.slice.call(arguments, 1);
            if (e[t]) {
                var i = e[t].execute.apply(window
, r);
                return t.unexecute && n.push({
                    command: t,
                    args: r
                }), i;
            }
        },
        undo: function() {
            var r = n.pop(), i = r.command, s = r.args;
            e[i] && (e[i].unexecute.apply(window, s), t.push(r));
        },
        redo: function() {
            var r = t.pop(), i = r.command, s = r.args;
            e[i] && (e[i].execute.apply(window, s), n.push(r));
        },
        register: function(t, n) {
            e[t] = n;
        }
    };
    return r;
}), define("modules/common/modal", [ "require", "qpf", "knockout" ], function(e) {
    function l() {
        var e = new r({
            attributes: {
                "class": "qpf-modal"
            }
        });
        return e.body = new i, e.buttons = new s, e.applyButton = new o({
            attributes: {
                text: "\u786e \u5b9a"
            }
        }), e.cancelButton = new o({
            attributes: {
                
text: "\u53d6 \u6d88"
            }
        }), e.add(e.body), e.add(e.buttons), e.buttons.add(e.applyButton), e.buttons.add(e.cancelButton), e.render(), document.body.appendChild(e.$el[0]), e.$mask = $('<div class="qpf-mask"></div>'), document.body.appendChild(e.$mask[0]), e.$el.hide(), e.$mask.hide(), f++, e;
    }
    var t = e("qpf"), n = t.use("core/clazz"), r = t.use("container/window"), i = t.use("container/container"), s = t.use("container/inline"), o = t.use("meta/button"), u = t.use("meta/label"), a = e("knockout"), f = 0, c = l(), h = n.derive(function() {
        return {
            title: "",
            body: null,
            onApply: function(e) {
                e();
            },
            onCancel: function(e) {
                e();
            }
        };
    }, {
        show: function(e) {
            var t = this;
            e || (t.wind = l(), c = t.wind), c.title(this.title), c.body.removeAll(), this.body && c.body.add(this.body), c.applyButton.off("click"
), c.cancelButton.off("click"), c.applyButton.on("click", function() {
                t.onApply(t.hide);
            }), c.cancelButton.on("click", function() {
                t.onCancel(t.hide);
            }), c.$el.show(), c.$mask.show(), c.left(($(window).width() - c.$el.width()) / 2), c.top(($(window).height() - c.$el.height()) / 2 - 100);
        },
        hide: function() {
            var e = this;
            e.wind ? (e.wind.$el.remove(), e.wind.$mask.remove()) : (c.$el.remove(), c.$mask.remove()), f--, f < 1 && (f = 1);
        }
    });
    return h.popup = function(e, t, n, r, i) {
        var s = new h({
            title: e,
            body: t,
            onApply: function(e) {
                n && n(), e.call(s);
            },
            onCancel: function(e) {
                r && r(), e.call(s);
            }
        });
        return s.body.render(), s.show(), i && (f > 6 && (f = 1), s.wind.$el.css("margin-top", (f - 2) * 100 - 60 + "px"), setTimeout(function(
) {
            s.hide();
        }, +i)), s;
    }, h.confirm = function(e, t, n, r, i) {
        var s = new h({
            title: e,
            body: new u({
                attributes: {
                    text: t
                },
                temporary: !0
            }),
            onApply: function(e) {
                n && n(), e.call(s);
            },
            onCancel: function(e) {
                r && r(), e.call(s);
            }
        });
        return s.body.render(), s.show(), i && (f > 6 && (f = 1), s.wind.$el.css("margin-top", (f - 2) * 100 - 60 + "px"), setTimeout(function() {
            s.hide();
        }, +i)), s;
    }, h;
}), define("text!template/hover/hover.html", [], function() {
    return '<div class="e-hover-target">\r\n    <div class="e-hover-arrow"></div>\r\n    <div class="e-hover-arrow-border"></div>\r\n    <div class="e-hover-content"></div>\r\n</div>\r\n';
}), define("text!template/hover/hover.css", [], function() {
    return ".e-hover-source:hover .e-hover-target {\r\n    display: block;\r\n}\r\n\r\n.e-hover-source:hover .e-hover-code {\r\n    display: block;\r\n}\r\n\r\n.e-hover-target {\r\n    display: none;\r\n    position: absolute;\r\n    left: 50%;\r\n    margin-top: -2px;\r\n    padding-top: 14px;\r\n    top: 100%;\r\n}\r\n\r\n.e-hover-target.left {\r\n    top: -50%;\r\n    margin-right: -2px;\r\n    padding-right: 14px;\r\n    padding-top: 0px;\r\n    right: 100%;\r\n    left: auto;\r\n}\r\n.e-hover-target.right {\r\n    top: -50%;\r\n    margin-left: -2px;\r\n    padding-left: 14px;\r\n    padding-top: 0px;\r\n    right: auto;\r\n    left: 100%;\r\n}\r\n\r\n.e-hover-code {\r\n    display: none;\r\n}\r\n\r\n.e-hover-arrow {\r\n    position: absolute;\r\n    top: 5px;\r\n    width: 1px;\r\n    height: 1px;\r\n    border: 9px solid transparent;\r\n    border-bottom-color: #ddd;\r\n    z-index: 3;\r\n    border-top-width: 0px;\r\n}\r\n\r\n.e-hover-arrow.left {\r\n    position: absolute;\r\n    width: 1px;\r\n    right: 5px;\r\n    height: 1px;\r\n    border: 9px solid transparent;\r\n    border-left-color: #ddd;\r\n    z-index: 3;\r\n    border-right-width: 0px;\r\n}\r\n.e-hover-arrow.right {\r\n    position: absolute;\r\n    width: 1px;\r\n    left: 5px;\r\n    height: 1px;\r\n    border: 9px solid transparent;\r\n    border-right-color: #ddd;\r\n    z-index: 3;\r\n    border-left-width: 0px;\r\n}\r\n\r\n.e-hover-arrow-border {\r\n    position: absolute;\r\n    width: 1px;\r\n    height: 1px;\r\n    top: 6px;\r\n    border: 9px solid transparent;\r\n    border-bottom-color: #fff;\r\n    border-top-width: 0px;\r\n    z-index: 3;\r\n}\r\n\r\n.e-hover-arrow-border.left {\r\n    position: absolute;\r\n    width: 1px;\r\n    height: 1px;\r\n    right: 6px;\r\n    border: 9px solid transparent;\r\n    border-left-color: #fff;\r\n    border-right-width: 0px;\r\n    z-index: 3;\r\n}\r\n.e-hover-arrow-border.right {\r\n    position: absolute;\r\n    width: 1px;\r\n    height: 1px;\r\n    left: 6px;\r\n    border: 9px solid transparent;\r\n    border-right-color: #fff;\r\n    border-left-width: 0px;\r\n    z-index: 3;\r\n}\r\n\r\n\r\n.e-hover-content {\r\n    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);\r\n    padding: 15px 15px 15px;\r\n    background: #fff;\r\n    border: 1px solid #ddd;\r\n}\r\n"
;
}), define("text!template/css/base.css", [], function() {
    return '.f-fl {\r\n    float: left;\r\n}\r\n\r\n.f-fr {\r\n    float: right;\r\n}\r\n.f-cb:after {\r\n    display: block;\r\n    clear: both;\r\n    visibility: hidden;\r\n    height: 0;\r\n    overflow: hidden;\r\n    content: ".";\r\n}\r\n.f-line,\r\n.f-thide {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n.f-2lines {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    display: -webkit-box;\r\n    -webkit-line-clamp: 2;\r\n    -webkit-box-orient: vertical;\r\n}\r\n\r\n.f-3lines {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    display: -webkit-box;\r\n    -webkit-line-clamp: 3;\r\n    -webkit-box-orient: vertical;\r\n}\r\n\r\n.f-4lines {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    display: -webkit-box;\r\n    -webkit-line-clamp: 4;\r\n    -webkit-box-orient: vertical;\r\n}\r\n.f-transition {\r\n    -moz-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;\r\n    -o-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;\r\n    -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;\r\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;\r\n}\r\n'
;
}), define("text!template/cache/cacheItem.js", [], function() {
    return "/**\r\n     * __name__\r\n     * @param  {Object} _data\r\n     */\r\n    _p._$__name__ = function (_data, _onLoad) {\r\n        _cache._$request({\r\n            url: '__url__',\r\n            method: '__method__',\r\n            data: _data,\r\n            onload: _onLoad,\r\n            notShowLoading: true\r\n        });\r\n    };\r\n";
}), define("text!template/cache/dwrItem.js", [], function() {
    return "/**\r\n     * __name__\r\n     */\r\n    _p._$__name__ = function (_data, _onLoad) {\r\n        _dwr._$postDWR({\r\n            key: \"__name__\",\r\n            url: '__url__',\r\n            param: [_data],\r\n            onload: _onLoad\r\n        });\r\n    };\r\n";
}), define("text!template/cache/callCache.js", [], function() {
    return "__nameCamel__Cache._$__funcName__(__reqData__, function (_data) {\r\n                __cb__\r\n            }._$bind(this));\r\n";
}), define("text!template/animate/animate.json"
, [], function() {
    return '{\r\n    "common": ".animated{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both}.animated.infinite{-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.animated.hinge{-webkit-animation-duration:2s;animation-duration:2s}.animated.bounceIn,.animated.bounceOut{-webkit-animation-duration:.75s;animation-duration:.75s}.animated.flipOutX,.animated.flipOutY{-webkit-animation-duration:.75s;animation-duration:.75s}",\r\n    "list": {\r\n        "none": "",\r\n        "bounce": "@-webkit-keyframes bounce{0%,20%,53%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}40%,43%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0)}70%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0)}90%{-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0)}}@keyframes bounce{0%,20%,53%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}40%,43%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0)}70%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0)}90%{-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0)}}.bounce{-webkit-animation-name:bounce;animation-name:bounce;-webkit-transform-origin:center bottom;transform-origin:center bottom}",\r\n        "flash": "@-webkit-keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}@keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}.flash{-webkit-animation-name:flash;animation-name:flash}",\r\n        "pulse": "@-webkit-keyframes pulse{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}50%{-webkit-transform:scale3d(1.05,1.05,1.05);transform:scale3d(1.05,1.05,1.05)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes pulse{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}50%{-webkit-transform:scale3d(1.05,1.05,1.05);transform:scale3d(1.05,1.05,1.05)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.pulse{-webkit-animation-name:pulse;animation-name:pulse}",\r\n        "rubberBand": "@-webkit-keyframes rubberBand{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}30%{-webkit-transform:scale3d(1.25,0.75,1);transform:scale3d(1.25,0.75,1)}40%{-webkit-transform:scale3d(0.75,1.25,1);transform:scale3d(0.75,1.25,1)}50%{-webkit-transform:scale3d(1.15,0.85,1);transform:scale3d(1.15,0.85,1)}65%{-webkit-transform:scale3d(.95,1.05,1);transform:scale3d(.95,1.05,1)}75%{-webkit-transform:scale3d(1.05,.95,1);transform:scale3d(1.05,.95,1)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes rubberBand{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}30%{-webkit-transform:scale3d(1.25,0.75,1);transform:scale3d(1.25,0.75,1)}40%{-webkit-transform:scale3d(0.75,1.25,1);transform:scale3d(0.75,1.25,1)}50%{-webkit-transform:scale3d(1.15,0.85,1);transform:scale3d(1.15,0.85,1)}65%{-webkit-transform:scale3d(.95,1.05,1);transform:scale3d(.95,1.05,1)}75%{-webkit-transform:scale3d(1.05,.95,1);transform:scale3d(1.05,.95,1)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.rubberBand{-webkit-animation-name:rubberBand;animation-name:rubberBand}",\r\n        "shake": "@-webkit-keyframes shake{0%,100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}}@keyframes shake{0%,100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}}.shake{-webkit-animation-name:shake;animation-name:shake}",\r\n        "swing": "@-webkit-keyframes swing{20%{-webkit-transform:rotate3d(0,0,1,15deg);transform:rotate3d(0,0,1,15deg)}40%{-webkit-transform:rotate3d(0,0,1,-10deg);transform:rotate3d(0,0,1,-10deg)}60%{-webkit-transform:rotate3d(0,0,1,5deg);transform:rotate3d(0,0,1,5deg)}80%{-webkit-transform:rotate3d(0,0,1,-5deg);transform:rotate3d(0,0,1,-5deg)}100%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}}@keyframes swing{20%{-webkit-transform:rotate3d(0,0,1,15deg);transform:rotate3d(0,0,1,15deg)}40%{-webkit-transform:rotate3d(0,0,1,-10deg);transform:rotate3d(0,0,1,-10deg)}60%{-webkit-transform:rotate3d(0,0,1,5deg);transform:rotate3d(0,0,1,5deg)}80%{-webkit-transform:rotate3d(0,0,1,-5deg);transform:rotate3d(0,0,1,-5deg)}100%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}}.swing{-webkit-transform-origin:top center;transform-origin:top center;-webkit-animation-name:swing;animation-name:swing}",\r\n        "tada": "@-webkit-keyframes tada{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}10%,20%{-webkit-transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes tada{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}10%,20%{-webkit-transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.tada{-webkit-animation-name:tada;animation-name:tada}",\r\n        "wobble": "@-webkit-keyframes wobble{0%{-webkit-transform:none;transform:none}15%{-webkit-transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg);transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{-webkit-transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg);transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{-webkit-transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg);transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{-webkit-transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg);transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{-webkit-transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg);transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}100%{-webkit-transform:none;transform:none}}@keyframes wobble{0%{-webkit-transform:none;transform:none}15%{-webkit-transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg);transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{-webkit-transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg);transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{-webkit-transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg);transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{-webkit-transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg);transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{-webkit-transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg);transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}100%{-webkit-transform:none;transform:none}}.wobble{-webkit-animation-name:wobble;animation-name:wobble}",\r\n        "jello": "@-webkit-keyframes jello{11.1%{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-0.78125deg) skewY(-0.78125deg);transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-0.1953125deg) skewY(-0.1953125deg);transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}100%{-webkit-transform:none;transform:none}}@keyframes jello{11.1%{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-0.78125deg) skewY(-0.78125deg);transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-0.1953125deg) skewY(-0.1953125deg);transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}100%{-webkit-transform:none;transform:none}}.jello{-webkit-animation-name:jello;animation-name:jello;-webkit-transform-origin:center;transform-origin:center}",\r\n        "bounceIn": "@-webkit-keyframes bounceIn{0%,20%,40%,60%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes bounceIn{0%,20%,40%,60%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.bounceIn{-webkit-animation-name:bounceIn;animation-name:bounceIn}",\r\n        "bounceInDown": "@-webkit-keyframes bounceInDown{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,-3000px,0);transform:translate3d(0,-3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,25px,0);transform:translate3d(0,25px,0)}75%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}90%{-webkit-transform:translate3d(0,5px,0);transform:translate3d(0,5px,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInDown{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,-3000px,0);transform:translate3d(0,-3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,25px,0);transform:translate3d(0,25px,0)}75%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}90%{-webkit-transform:translate3d(0,5px,0);transform:translate3d(0,5px,0)}100%{-webkit-transform:none;transform:none}}.bounceInDown{-webkit-animation-name:bounceInDown;animation-name:bounceInDown}",\r\n        "bounceInLeft": "@-webkit-keyframes bounceInLeft{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(-3000px,0,0);transform:translate3d(-3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(25px,0,0);transform:translate3d(25px,0,0)}75%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}90%{-webkit-transform:translate3d(5px,0,0);transform:translate3d(5px,0,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInLeft{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(-3000px,0,0);transform:translate3d(-3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(25px,0,0);transform:translate3d(25px,0,0)}75%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}90%{-webkit-transform:translate3d(5px,0,0);transform:translate3d(5px,0,0)}100%{-webkit-transform:none;transform:none}}.bounceInLeft{-webkit-animation-name:bounceInLeft;animation-name:bounceInLeft}",\r\n        "bounceInRight": "@-webkit-keyframes bounceInRight{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(3000px,0,0);transform:translate3d(3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(-25px,0,0);transform:translate3d(-25px,0,0)}75%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}90%{-webkit-transform:translate3d(-5px,0,0);transform:translate3d(-5px,0,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInRight{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(3000px,0,0);transform:translate3d(3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(-25px,0,0);transform:translate3d(-25px,0,0)}75%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}90%{-webkit-transform:translate3d(-5px,0,0);transform:translate3d(-5px,0,0)}100%{-webkit-transform:none;transform:none}}.bounceInRight{-webkit-animation-name:bounceInRight;animation-name:bounceInRight}",\r\n        "bounceInUp": "@-webkit-keyframes bounceInUp{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,3000px,0);transform:translate3d(0,3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,3000px,0);transform:translate3d(0,3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;animation-name:bounceInUp}",\r\n        "bounceOut": "@-webkit-keyframes bounceOut{20%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}}@keyframes bounceOut{20%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}}.bounceOut{-webkit-animation-name:bounceOut;animation-name:bounceOut}",\r\n        "bounceOutDown": "@-webkit-keyframes bounceOutDown{20%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}@keyframes bounceOutDown{20%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}.bounceOutDown{-webkit-animation-name:bounceOutDown;animation-name:bounceOutDown}",\r\n        "bounceOutLeft": "@-webkit-keyframes bounceOutLeft{20%{opacity:1;-webkit-transform:translate3d(20px,0,0);transform:translate3d(20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}@keyframes bounceOutLeft{20%{opacity:1;-webkit-transform:translate3d(20px,0,0);transform:translate3d(20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}.bounceOutLeft{-webkit-animation-name:bounceOutLeft;animation-name:bounceOutLeft}",\r\n        "bounceOutRight": "@-webkit-keyframes bounceOutRight{20%{opacity:1;-webkit-transform:translate3d(-20px,0,0);transform:translate3d(-20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}@keyframes bounceOutRight{20%{opacity:1;-webkit-transform:translate3d(-20px,0,0);transform:translate3d(-20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}.bounceOutRight{-webkit-animation-name:bounceOutRight;animation-name:bounceOutRight}",\r\n        "bounceOutUp": "@-webkit-keyframes bounceOutUp{20%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,20px,0);transform:translate3d(0,20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}@keyframes bounceOutUp{20%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,20px,0);transform:translate3d(0,20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}.bounceOutUp{-webkit-animation-name:bounceOutUp;animation-name:bounceOutUp}",\r\n        "fadeIn": "@-webkit-keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}.fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}",\r\n        "fadeInDown": "@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInDown{-webkit-animation-name:fadeInDown;animation-name:fadeInDown}",\r\n        "fadeInDownBig": "@-webkit-keyframes fadeInDownBig{0%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInDownBig{0%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInDownBig{-webkit-animation-name:fadeInDownBig;animation-name:fadeInDownBig}",\r\n        "fadeInLeft": "@-webkit-keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInLeft{-webkit-animation-name:fadeInLeft;animation-name:fadeInLeft}",\r\n        "fadeInLeftBig": "@-webkit-keyframes fadeInLeftBig{0%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInLeftBig{0%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInLeftBig{-webkit-animation-name:fadeInLeftBig;animation-name:fadeInLeftBig}",\r\n        "fadeInRight": "@-webkit-keyframes fadeInRight{0%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInRight{0%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInRight{-webkit-animation-name:fadeInRight;animation-name:fadeInRight}",\r\n        "fadeInRightBig": "@-webkit-keyframes fadeInRightBig{0%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInRightBig{0%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInRightBig{-webkit-animation-name:fadeInRightBig;animation-name:fadeInRightBig}",\r\n        "fadeInUp": "@-webkit-keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp}",\r\n        "fadeInUpBig": "@-webkit-keyframes fadeInUpBig{0%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInUpBig{0%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInUpBig{-webkit-animation-name:fadeInUpBig;animation-name:fadeInUpBig}",\r\n        "fadeOut": "@-webkit-keyframes fadeOut{0%{opacity:1}100%{opacity:0}}@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}.fadeOut{-webkit-animation-name:fadeOut;animation-name:fadeOut}",\r\n        "fadeOutDown": "@-webkit-keyframes fadeOutDown{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}@keyframes fadeOutDown{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}.fadeOutDown{-webkit-animation-name:fadeOutDown;animation-name:fadeOutDown}",\r\n        "fadeOutDownBig": "@-webkit-keyframes fadeOutDownBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}@keyframes fadeOutDownBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}.fadeOutDownBig{-webkit-animation-name:fadeOutDownBig;animation-name:fadeOutDownBig}",\r\n        "fadeOutLeft": "@-webkit-keyframes fadeOutLeft{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}@keyframes fadeOutLeft{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}.fadeOutLeft{-webkit-animation-name:fadeOutLeft;animation-name:fadeOutLeft}",\r\n        "fadeOutLeftBig": "@-webkit-keyframes fadeOutLeftBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}@keyframes fadeOutLeftBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}.fadeOutLeftBig{-webkit-animation-name:fadeOutLeftBig;animation-name:fadeOutLeftBig}",\r\n        "fadeOutRight": "@-webkit-keyframes fadeOutRight{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}@keyframes fadeOutRight{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}.fadeOutRight{-webkit-animation-name:fadeOutRight;animation-name:fadeOutRight}",\r\n        "fadeOutRightBig": "@-webkit-keyframes fadeOutRightBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}@keyframes fadeOutRightBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}.fadeOutRightBig{-webkit-animation-name:fadeOutRightBig;animation-name:fadeOutRightBig}",\r\n        "fadeOutUp": "@-webkit-keyframes fadeOutUp{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}@keyframes fadeOutUp{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}.fadeOutUp{-webkit-animation-name:fadeOutUp;animation-name:fadeOutUp}",\r\n        "fadeOutUpBig": "@-webkit-keyframes fadeOutUpBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}@keyframes fadeOutUpBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}.fadeOutUpBig{-webkit-animation-name:fadeOutUpBig;animation-name:fadeOutUpBig}",\r\n        "flip": "@-webkit-keyframes flip{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-360deg);transform:perspective(400px) rotate3d(0,1,0,-360deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}40%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}50%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}80%{-webkit-transform:perspective(400px) scale3d(.95,.95,.95);transform:perspective(400px) scale3d(.95,.95,.95);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}100%{-webkit-transform:perspective(400px);transform:perspective(400px);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}}@keyframes flip{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-360deg);transform:perspective(400px) rotate3d(0,1,0,-360deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}40%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}50%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}80%{-webkit-transform:perspective(400px) scale3d(.95,.95,.95);transform:perspective(400px) scale3d(.95,.95,.95);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}100%{-webkit-transform:perspective(400px);transform:perspective(400px);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}}.animated.flip{-webkit-backface-visibility:visible;backface-visibility:visible;-webkit-animation-name:flip;animation-name:flip}",\r\n        "flipInX": "@-webkit-keyframes flipInX{0%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(1,0,0,10deg);transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-5deg);transform:perspective(400px) rotate3d(1,0,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInX{0%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(1,0,0,10deg);transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-5deg);transform:perspective(400px) rotate3d(1,0,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}.flipInX{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInX;animation-name:flipInX}",\r\n        "flipInY": "@-webkit-keyframes flipInY{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-20deg);transform:perspective(400px) rotate3d(0,1,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(0,1,0,10deg);transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-5deg);transform:perspective(400px) rotate3d(0,1,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInY{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-20deg);transform:perspective(400px) rotate3d(0,1,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(0,1,0,10deg);transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-5deg);transform:perspective(400px) rotate3d(0,1,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}.flipInY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInY;animation-name:flipInY}",\r\n        "flipOutX": "@-webkit-keyframes flipOutX{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}@keyframes flipOutX{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}.flipOutX{-webkit-animation-name:flipOutX;animation-name:flipOutX;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}",\r\n        "flipOutY": "@-webkit-keyframes flipOutY{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-15deg);transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}@keyframes flipOutY{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-15deg);transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}.flipOutY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipOutY;animation-name:flipOutY}",\r\n        "lightSpeedIn": "@-webkit-keyframes lightSpeedIn{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg);opacity:1}100%{-webkit-transform:none;transform:none;opacity:1}}@keyframes lightSpeedIn{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg);opacity:1}100%{-webkit-transform:none;transform:none;opacity:1}}.lightSpeedIn{-webkit-animation-name:lightSpeedIn;animation-name:lightSpeedIn;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}",\r\n        "lightSpeedOut": "@-webkit-keyframes lightSpeedOut{0%{opacity:1}100%{-webkit-transform:translate3d(100%,0,0) skewX(30deg);transform:translate3d(100%,0,0) skewX(30deg);opacity:0}}@keyframes lightSpeedOut{0%{opacity:1}100%{-webkit-transform:translate3d(100%,0,0) skewX(30deg);transform:translate3d(100%,0,0) skewX(30deg);opacity:0}}.lightSpeedOut{-webkit-animation-name:lightSpeedOut;animation-name:lightSpeedOut;-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}",\r\n        "rotateIn": "@-webkit-keyframes rotateIn{0%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,-200deg);transform:rotate3d(0,0,1,-200deg);opacity:0}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateIn{0%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,-200deg);transform:rotate3d(0,0,1,-200deg);opacity:0}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:none;transform:none;opacity:1}}.rotateIn{-webkit-animation-name:rotateIn;animation-name:rotateIn}",\r\n        "rotateInDownLeft": "@-webkit-keyframes rotateInDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInDownLeft{-webkit-animation-name:rotateInDownLeft;animation-name:rotateInDownLeft}",\r\n        "rotateInDownRight": "@-webkit-keyframes rotateInDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInDownRight{-webkit-animation-name:rotateInDownRight;animation-name:rotateInDownRight}",\r\n        "rotateInUpLeft": "@-webkit-keyframes rotateInUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInUpLeft{-webkit-animation-name:rotateInUpLeft;animation-name:rotateInUpLeft}",\r\n        "rotateInUpRight": "@-webkit-keyframes rotateInUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-90deg);transform:rotate3d(0,0,1,-90deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-90deg);transform:rotate3d(0,0,1,-90deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInUpRight{-webkit-animation-name:rotateInUpRight;animation-name:rotateInUpRight}",\r\n        "rotateOut": "@-webkit-keyframes rotateOut{0%{-webkit-transform-origin:center;transform-origin:center;opacity:1}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,200deg);transform:rotate3d(0,0,1,200deg);opacity:0}}@keyframes rotateOut{0%{-webkit-transform-origin:center;transform-origin:center;opacity:1}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,200deg);transform:rotate3d(0,0,1,200deg);opacity:0}}.rotateOut{-webkit-animation-name:rotateOut;animation-name:rotateOut}",\r\n        "rotateOutDownLeft": "@-webkit-keyframes rotateOutDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}}@keyframes rotateOutDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}}.rotateOutDownLeft{-webkit-animation-name:rotateOutDownLeft;animation-name:rotateOutDownLeft}",\r\n        "rotateOutDownRight": "@-webkit-keyframes rotateOutDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}@keyframes rotateOutDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}.rotateOutDownRight{-webkit-animation-name:rotateOutDownRight;animation-name:rotateOutDownRight}",\r\n        "rotateOutUpLeft": "@-webkit-keyframes rotateOutUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}@keyframes rotateOutUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}.rotateOutUpLeft{-webkit-animation-name:rotateOutUpLeft;animation-name:rotateOutUpLeft}",\r\n        "rotateOutUpRight": "@-webkit-keyframes rotateOutUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,90deg);transform:rotate3d(0,0,1,90deg);opacity:0}}@keyframes rotateOutUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,90deg);transform:rotate3d(0,0,1,90deg);opacity:0}}.rotateOutUpRight{-webkit-animation-name:rotateOutUpRight;animation-name:rotateOutUpRight}",\r\n        "hinge": "@-webkit-keyframes hinge{0%{-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}20%,60%{-webkit-transform:rotate3d(0,0,1,80deg);transform:rotate3d(0,0,1,80deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}40%,80%{-webkit-transform:rotate3d(0,0,1,60deg);transform:rotate3d(0,0,1,60deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;opacity:1}100%{-webkit-transform:translate3d(0,700px,0);transform:translate3d(0,700px,0);opacity:0}}@keyframes hinge{0%{-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}20%,60%{-webkit-transform:rotate3d(0,0,1,80deg);transform:rotate3d(0,0,1,80deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}40%,80%{-webkit-transform:rotate3d(0,0,1,60deg);transform:rotate3d(0,0,1,60deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;opacity:1}100%{-webkit-transform:translate3d(0,700px,0);transform:translate3d(0,700px,0);opacity:0}}.hinge{-webkit-animation-name:hinge;animation-name:hinge}",\r\n        "rollIn": "@-webkit-keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg);transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg);transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}100%{opacity:1;-webkit-transform:none;transform:none}}.rollIn{-webkit-animation-name:rollIn;animation-name:rollIn}",\r\n        "rollOut": "@-webkit-keyframes rollOut{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg);transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}@keyframes rollOut{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg);transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}.rollOut{-webkit-animation-name:rollOut;animation-name:rollOut}",\r\n        "zoomIn": "@-webkit-keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}.zoomIn{-webkit-animation-name:zoomIn;animation-name:zoomIn}",\r\n        "zoomInDown": "@-webkit-keyframes zoomInDown{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInDown{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInDown{-webkit-animation-name:zoomInDown;animation-name:zoomInDown}",\r\n        "zoomInLeft": "@-webkit-keyframes zoomInLeft{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(10px,0,0);transform:scale3d(.475,.475,.475) translate3d(10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInLeft{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(10px,0,0);transform:scale3d(.475,.475,.475) translate3d(10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInLeft{-webkit-animation-name:zoomInLeft;animation-name:zoomInLeft}",\r\n        "zoomInRight": "@-webkit-keyframes zoomInRight{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInRight{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInRight{-webkit-animation-name:zoomInRight;animation-name:zoomInRight}",\r\n        "zoomInUp": "@-webkit-keyframes zoomInUp{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInUp{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInUp{-webkit-animation-name:zoomInUp;animation-name:zoomInUp}",\r\n        "zoomOut": "@-webkit-keyframes zoomOut{0%{opacity:1}50%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}100%{opacity:0}}@keyframes zoomOut{0%{opacity:1}50%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}100%{opacity:0}}.zoomOut{-webkit-animation-name:zoomOut;animation-name:zoomOut}",\r\n        "zoomOutDown": "@-webkit-keyframes zoomOutDown{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomOutDown{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomOutDown{-webkit-animation-name:zoomOutDown;animation-name:zoomOutDown}",\r\n        "zoomOutLeft": "@-webkit-keyframes zoomOutLeft{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(42px,0,0);transform:scale3d(.475,.475,.475) translate3d(42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(-2000px,0,0);transform:scale(.1) translate3d(-2000px,0,0);-webkit-transform-origin:left center;transform-origin:left center}}@keyframes zoomOutLeft{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(42px,0,0);transform:scale3d(.475,.475,.475) translate3d(42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(-2000px,0,0);transform:scale(.1) translate3d(-2000px,0,0);-webkit-transform-origin:left center;transform-origin:left center}}.zoomOutLeft{-webkit-animation-name:zoomOutLeft;animation-name:zoomOutLeft}",\r\n        "zoomOutRight": "@-webkit-keyframes zoomOutRight{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-42px,0,0);transform:scale3d(.475,.475,.475) translate3d(-42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(2000px,0,0);transform:scale(.1) translate3d(2000px,0,0);-webkit-transform-origin:right center;transform-origin:right center}}@keyframes zoomOutRight{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-42px,0,0);transform:scale3d(.475,.475,.475) translate3d(-42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(2000px,0,0);transform:scale(.1) translate3d(2000px,0,0);-webkit-transform-origin:right center;transform-origin:right center}}.zoomOutRight{-webkit-animation-name:zoomOutRight;animation-name:zoomOutRight}",\r\n        "zoomOutUp": "@-webkit-keyframes zoomOutUp{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomOutUp{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomOutUp{-webkit-animation-name:zoomOutUp;animation-name:zoomOutUp}",\r\n        "slideInDown": "@-webkit-keyframes slideInDown{0%{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInDown{0%{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInDown{-webkit-animation-name:slideInDown;animation-name:slideInDown}",\r\n        "slideInLeft": "@-webkit-keyframes slideInLeft{0%{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInLeft{0%{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInLeft{-webkit-animation-name:slideInLeft;animation-name:slideInLeft}",\r\n        "slideInRight": "@-webkit-keyframes slideInRight{0%{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInRight{0%{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInRight{-webkit-animation-name:slideInRight;animation-name:slideInRight}",\r\n        "slideInUp": "@-webkit-keyframes slideInUp{0%{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInUp{0%{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInUp{-webkit-animation-name:slideInUp;animation-name:slideInUp}",\r\n        "slideOutDown": "@-webkit-keyframes slideOutDown{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}@keyframes slideOutDown{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}.slideOutDown{-webkit-animation-name:slideOutDown;animation-name:slideOutDown}",\r\n        "slideOutLeft": "@-webkit-keyframes slideOutLeft{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}@keyframes slideOutLeft{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}.slideOutLeft{-webkit-animation-name:slideOutLeft;animation-name:slideOutLeft}",\r\n        "slideOutRight": "@-webkit-keyframes slideOutRight{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}@keyframes slideOutRight{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}.slideOutRight{-webkit-animation-name:slideOutRight;animation-name:slideOutRight}",\r\n        "slideOutUp": "@-webkit-keyframes slideOutUp{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}@keyframes slideOutUp{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}.slideOutUp{-webkit-animation-name:slideOutUp;animation-name:slideOutUp}"\r\n    }\r\n}\r\n'
;
}), define("text!template/animate/animate.js", [], function() {
    return '//\u89e3\u51b3IE8\u4e4b\u7c7b\u4e0d\u652f\u6301getElementsByClassName\r\nif (!document.getElementsByClassName) {\r\n    document.getElementsByClassName = function (className, element) {\r\n        var children = (element || document).getElementsByTagName(\'*\');\r\n        var elements = new Array();\r\n        for (var i = 0; i < children.length; i++) {\r\n            var child = children[i];\r\n            var classNames = child.className.split(\' \');\r\n            for (var j = 0; j < classNames.length; j++) {\r\n                if (classNames[j] == className) {\r\n                    elements.push(child);\r\n                    break;\r\n                }\r\n            }\r\n        }\r\n        return elements;\r\n    };\r\n}\r\n/** \u6eda\u52a8\u5230\u663e\u793a\u7684\u65f6\u5019 \u89e6\u53d1\u52a8\u753b **/\r\nfunction scrollShow() {\r\n    var x = document.getElementsByClassName("animated");\r\n    for (i = 0; i < x.length; i++) {\r\n        var item = x[i];\r\n        var _cls = item.className;\r\n        if (_cls.indexOf("aniover") >= 0) {\r\n            return;\r\n        }\r\n        var top = item.getBoundingClientRect().top;\r\n        var se = document.documentElement.clientHeight;\r\n\r\n        if (top <= se) {\r\n            var _ani = _cls.substring(_cls.indexOf("animated") + 1);\r\n            _ani = "animated " + _ani.substring(_cls.indexOf(" "));\r\n            item.className = _cls.substring(0, _cls.indexOf("animated"));\r\n            setTimeout(function () {\r\n                item.className = item.className + " " + _ani + " aniover";\r\n            }, 50);\r\n\r\n        }\r\n    }\r\n}\r\nscrollShow();\r\nif (window.attachEvent) {\r\n    window.attachEvent("scroll", scrollShow);\r\n} else {\r\n    window.addEventListener("scroll", scrollShow);\r\n}\r\n'
;
}), define("core/element", [ "require", "qpf", "knockout", "$", "_", "onecolor", "ko.mapping", "modules/common/modal", "./command", "text!template/hover/hover.html", "text!template/hover/hover.css", "text!template/css/base.css", "text!template/cache/cacheItem.js", "text!template/cache/dwrItem.js", "text!template/cache/callCache.js", "text!template/animate/animate.json", "text!template/animate/animate.js" ], function(e) {
    function x(e) {
        return S[e] || (S[e] = 0), e + "_" + S[e]++;
    }
    function N() {
        return T++;
    }
    function k() {
        return C++;
    }
    var t = e("qpf"), n = e("knockout"), r = e("$"), i = e("_"), s = e("onecolor"), o = e("ko.mapping"), u = e("modules/common/modal"), a = e("./command"), f = e("text!template/hover/hover.html"), l = e("text!template/hover/hover.css"), c = e("text!template/css/base.css"), h = e("text!template/cache/cacheItem.js"), p = e("text!template/cache/dwrItem.js"), d = e("text!template/cache/callCache.js"), v = 
t.helper.Draggable, m = JSON.parse(e("text!template/animate/animate.json")), g = e("text!template/animate/animate.js"), y = [];
    for (var b in m.list) y.push({
        text: b,
        value: b
    });
    var w = /background\-color\:\s*rgba\((.*)\)/g, E = t.core.Clazz.derive(function() {
        var e = n.observable(!1), t = n.computed({
            read: function() {
                return o.properties.positionStr() == "relative";
            },
            deferEvaluation: !0
        }), i = n.computed({
            read: function() {
                return e() && o.properties.backgroundImageType() === "gradient";
            },
            deferEvaluation: !0
        }), s = n.computed({
            read: function() {
                return e() && o.properties.backgroundImageType() === "file";
            }
        }), o = {
            tempAniStr: "",
            tempEventName: "",
            name: "",
            icon: "",
            eid: N(),
            $wrapper: r("<div><a style='display:inline-block;width:100%;'></a></div>"
),
            type: "ELEMENT",
            properties: {
                id: n.observable(""),
                rid: n.observable(""),
                typeStr: n.observable(""),
                displayStr: n.observable(""),
                width: n.observable(100),
                minWidth: n.observable(),
                height: n.observable(100),
                left: n.observable(0),
                top: n.observable(0),
                zIndex: n.observable(),
                boxColor: n.observable(),
                boxFontSize: n.observable(),
                borderStyle: n.observable(""),
                borderTop: n.observable(0),
                borderRight: n.observable(0),
                borderBottom: n.observable(0),
                borderLeft: n.observable(0),
                borderColor: n.observable(5617961),
                borderAlpha: n.observable(1),
                background: e,
                backgroundColor: n.observable(16777215),
                backgroundAlpha
: n.observable(1),
                backgroundImageType: n.observable("none"),
                backgroundGradientStops: n.observableArray([ {
                    percent: n.observable(0),
                    color: n.observable("rgba(255, 255, 255, 1)")
                }, {
                    percent: n.observable(1),
                    color: n.observable("rgba(0, 0, 0, 1)")
                } ]),
                backgroundGradientAngle: n.observable(180),
                backgroundImageStr: n.observable(""),
                borderTopLeftRadius: n.observable(0),
                borderTopRightRadius: n.observable(0),
                borderBottomRightRadius: n.observable(0),
                borderBottomLeftRadius: n.observable(0),
                marginTop: n.observable(),
                marginRight: n.observable(),
                marginBottom: n.observable(),
                marginLeft: n.observable(),
                paddingTop: n.observable(),
                paddingRight: n.observable
(),
                paddingBottom: n.observable(),
                paddingLeft: n.observable(),
                hasShadow: n.observable(!1),
                shadowOffsetX: n.observable(0),
                shadowOffsetY: n.observable(0),
                shadowBlur: n.observable(10),
                shadowColor: n.observable(0),
                shadowColorAlpha: n.observable(1),
                newBlank: n.observable(!1),
                targetUrl: n.observable(""),
                boxClassStr: n.observable(""),
                overflow: n.observable(!1),
                hover: n.observable(""),
                hoverComponent: n.observable(""),
                hoverStr: n.observable(""),
                titleStr: n.observable(""),
                animateStr: n.observable("none"),
                dataCate: n.observable(""),
                dataAction: n.observable(""),
                dataLabel: n.observable(""),
                positionStr: n.observable("absolute"),
                floatStr
: n.observable(""),
                eventName: n.observable(""),
                eventHandler: n.observable("")
            },
            onResize: function() {},
            onMove: function() {},
            onCreate: function() {},
            onRemove: function() {},
            onExport: function() {},
            onImport: function() {},
            onOutput: function() {}
        }, u = o.properties;
        return o.uiConfig = {
            id: {
                label: "\u6807\u5fd7id",
                field: "style",
                ui: "textfield",
                text: u.id
            },
            rid: {
                label: "\u5143\u7d20id",
                ui: "textfield",
                text: u.rid
            },
            position: {
                label: "\u4f4d\u7f6e",
                ui: "vector",
                field: "layout",
                items: [ {
                    name: "left",
                    type: "textfield",
                    value: u.left
,
                    text: u.left
                }, {
                    name: "top",
                    type: "textfield",
                    value: u.top,
                    text: u.top
                } ]
            },
            positionStr: {
                label: "position",
                ui: "combobox",
                "class": "small",
                field: "layout",
                items: [ {
                    text: "absolute",
                    value: "absolute"
                }, {
                    text: "fixed",
                    value: "fixed"
                }, {
                    text: "relative",
                    value: "relative"
                }, {
                    text: "static",
                    value: "static"
                } ],
                value: u.positionStr
            },
            typeStr: {
                label: "\u7c7b\u578b*",
                ui: "combobox",
                "class": "small",
                field: "style"
,
                items: [ {
                    text: "\u666e\u901a\u5143\u7d20",
                    value: "ELEMENT"
                }, {
                    text: "\u56fe\u7247",
                    value: "IMAGE"
                }, {
                    text: "\u6587\u672c",
                    value: "TEXT"
                }, {
                    text: "\u51fd\u6570",
                    value: "FUNC"
                }, {
                    text: "\u6a21\u5757UMI",
                    value: "UMI"
                } ],
                value: u.typeStr
            },
            displayStr: {
                label: "\u76d2\u6a21\u578b*",
                ui: "combobox",
                "class": "small",
                field: "style",
                items: [ {
                    text: "\u65e0",
                    value: ""
                }, {
                    text: "block",
                    value: "block"
                }, {
                    text: "inline-block",
                    
value: "inline-block"
                }, {
                    text: "none",
                    value: "none"
                } ],
                value: u.displayStr
            },
            floatStr: {
                label: "float",
                ui: "combobox",
                "class": "small",
                field: "layout",
                items: [ {
                    text: "\u65e0",
                    value: ""
                }, {
                    text: "left",
                    value: "left"
                }, {
                    text: "right",
                    value: "right"
                }, {
                    text: "clearBoth",
                    value: "both"
                } ],
                value: u.floatStr,
                visible: t
            },
            size: {
                label: "\u5bbd\u9ad8",
                ui: "vector",
                field: "layout",
                items: [ {
                    name: "width",
                    
type: "textfield",
                    text: u.width,
                    value: u.width
                }, {
                    name: "height",
                    type: "textfield",
                    text: u.height,
                    value: u.height
                } ],
                constrainType: "no"
            },
            zIndex: {
                label: "Z",
                ui: "spinner",
                field: "layout",
                value: u.zIndex,
                step: 1,
                precision: 0
            },
            minWidth: {
                label: "minWidth",
                ui: "textfield",
                field: "layout",
                text: u.minWidth
            },
            borderStyle: {
                label: "\u8fb9\u6846\u7c7b\u578b",
                ui: "combobox",
                "class": "small",
                field: "style",
                items: [ {
                    text: "\u65e0",
                    value: ""
                
}, {
                    text: "\u5b9e\u7ebf",
                    value: "solid"
                }, {
                    text: "\u95f4\u9694\u6a2a\u7ebf",
                    value: "dashed"
                }, {
                    text: "\u70b9\u70b9\u70b9",
                    value: "dotted"
                } ],
                value: u.borderStyle
            },
            borderWidth: {
                label: "border",
                ui: "vector",
                field: "style",
                items: [ {
                    name: "top",
                    type: "slider",
                    value: u.borderTop,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20
                }, {
                    name: "right",
                    type: "slider",
                    value: u.borderRight,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20
                
}, {
                    name: "bottom",
                    type: "slider",
                    value: u.borderBottom,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20
                }, {
                    name: "left",
                    type: "slider",
                    value: u.borderLeft,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20
                } ],
                constrainProportion: n.observable(!0)
            },
            borderColor: {
                label: "\u8fb9\u6846\u8272",
                ui: "color",
                field: "style",
                color: u.borderColor,
                alpha: u.borderAlpha
            },
            background: {
                label: "\u80cc\u666f",
                ui: "checkbox",
                field: "style",
                checked: e
            },
            backgroundColor
: {
                label: "\u80cc\u666f\u8272",
                ui: "color",
                field: "style",
                color: u.backgroundColor,
                alpha: u.backgroundAlpha,
                visible: e
            },
            backgroundImageType: {
                label: "\u80cc\u666f\u56fe\u7247",
                ui: "combobox",
                "class": "small",
                field: "style",
                items: [ {
                    text: "\u65e0",
                    value: "none"
                }, {
                    text: "\u6e10\u53d8",
                    value: "gradient"
                }, {
                    text: "\u56fe\u7247\u6587\u4ef6",
                    value: "file"
                } ],
                value: u.backgroundImageType,
                visible: e
            },
            backgroundImageStr: {
                label: "\u80cc\u666fURL",
                field: "style",
                ui: "textfield",
                text: u.
backgroundImageStr,
                visible: s
            },
            backgroundGradient: {
                ui: "gradient",
                field: "style",
                stops: u.backgroundGradientStops,
                angle: u.backgroundGradientAngle,
                visible: i
            },
            borderRadius: {
                label: "\u5706\u89d2",
                ui: "vector",
                field: "style",
                items: [ {
                    name: "top-left",
                    type: "slider",
                    value: u.borderTopLeftRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "top-right",
                    type: "slider",
                    value: u.borderTopRightRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "bottom-right",
                    type: "slider"
,
                    value: u.borderBottomRightRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "bottom-left",
                    type: "slider",
                    value: u.borderBottomLeftRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                } ],
                constrainProportion: n.observable(!0)
            },
            margin: {
                label: "margin",
                ui: "vector",
                field: "layout",
                items: [ {
                    name: "top",
                    type: "textfield",
                    text: u.marginTop,
                    value: u.marginTop
                }, {
                    name: "right",
                    type: "textfield",
                    text: u.marginRight,
                    value: u.marginRight
                }, {
                    name: "bottom"
,
                    type: "textfield",
                    text: u.marginBottom,
                    value: u.marginBottom
                }, {
                    name: "left",
                    type: "textfield",
                    text: u.marginLeft,
                    value: u.marginLeft
                } ],
                constrainProportion: n.observable(!0)
            },
            padding: {
                label: "padding",
                ui: "vector",
                field: "layout",
                items: [ {
                    name: "top",
                    type: "textfield",
                    text: u.paddingTop,
                    value: u.paddingTop
                }, {
                    name: "right",
                    type: "textfield",
                    text: u.paddingRight,
                    value: u.paddingRight
                }, {
                    name: "bottom",
                    type: "textfield",
                    text: u.paddingBottom
,
                    value: u.paddingBottom
                }, {
                    name: "left",
                    type: "textfield",
                    text: u.paddingLeft,
                    value: u.paddingLeft
                } ],
                constrainProportion: n.observable(!0)
            },
            shadow: {
                label: "\u9634\u5f71",
                ui: "checkbox",
                field: "style",
                checked: u.hasShadow
            },
            shadowSize: {
                field: "style",
                ui: "slider",
                min: 1,
                max: 50,
                precision: 0,
                value: u.shadowBlur,
                visible: u.hasShadow
            },
            shadowOffset: {
                ui: "vector",
                field: "style",
                items: [ {
                    name: "shadowOffsetX",
                    type: "slider",
                    min: -50,
                    max: 50,
                    
precision: 0,
                    value: u.shadowOffsetX
                }, {
                    name: "shadowOffsetY",
                    type: "slider",
                    min: -50,
                    max: 50,
                    precision: 0,
                    value: u.shadowOffsetY
                } ],
                visible: u.hasShadow
            },
            shadowColor: {
                ui: "color",
                field: "style",
                color: u.shadowColor,
                alpha: u.shadowColorAlpha,
                visible: u.hasShadow
            },
            boxFontSize: {
                label: "Box\u5927\u5c0f",
                ui: "spinner",
                field: "style",
                value: u.boxFontSize
            },
            boxColor: {
                label: "Box\u989c\u8272",
                ui: "textfield",
                field: "style",
                text: u.boxColor
            },
            href: {
                label: "\u8d85\u94fe\u63a5"
,
                ui: "vector",
                items: [ {
                    label: "\u65b0\u5f00\u9875\u9762",
                    type: "checkbox",
                    checked: u.newBlank,
                    value: u.newBlank
                }, {
                    name: "URL",
                    type: "textfield",
                    text: u.targetUrl,
                    value: u.targetUrl
                } ]
            },
            boxClassStr: {
                label: "Box\u7c7b\u540d",
                ui: "textarea",
                field: "style",
                text: u.boxClassStr
            },
            overflow: {
                label: "overflow",
                ui: "combobox",
                "class": "small",
                field: "layout",
                items: [ {
                    text: "\u9ed8\u8ba4",
                    value: "visiable"
                }, {
                    text: "overflowX",
                    value: "overflowX"
                
}, {
                    text: "overflowY",
                    value: "overflowY"
                }, {
                    text: "overflowXY",
                    value: "overflowXY"
                } ],
                value: u.overflow
            },
            hover: {
                label: "Hover",
                ui: "combobox",
                "class": "small",
                field: "layout",
                items: [ {
                    text: "\u65e0",
                    value: ""
                }, {
                    text: "\u4e0b\u65b9Hover",
                    value: "bottom"
                }, {
                    text: "\u4e0b\u53f3\u65b9Hover",
                    value: "bottom-right"
                }, {
                    text: "\u5de6\u8fb9Hover",
                    value: "left"
                }, {
                    text: "\u53f3\u8fb9Hover",
                    value: "right"
                } ],
                value: u.hover
            },
            
hoverComponent: {
                label: "HoverC",
                ui: "textfield",
                field: "layout",
                text: u.hoverComponent,
                visible: u.hover
            },
            hoverStr: {
                label: "CSS(&)",
                ui: "codearea",
                text: u.hoverStr
            },
            animateStr: {
                label: "\u52a8\u753b",
                ui: "combobox",
                "class": "small",
                items: y,
                value: u.animateStr
            },
            dataCate: {
                label: "dataCate",
                ui: "textfield",
                text: u.dataCate
            },
            dataAction: {
                label: "dataAction",
                ui: "textfield",
                text: u.dataAction
            },
            dataLabel: {
                label: "dataLabel",
                ui: "textfield",
                text: u.dataLabel
            },
            titleStr: 
{
                label: "\u63cf\u8ff0\u63d0\u793a",
                ui: "textfield",
                text: u.titleStr
            },
            eventName: {
                label: "on-",
                ui: "textfield",
                field: "event",
                text: u.eventName
            },
            eventHandler: {
                label: "\u64cd\u4f5c",
                ui: "textfield",
                field: "event",
                text: u.eventHandler
            }
        }, o;
    }, {
        initialize: function(e) {
            function c(e) {
                return e.indexOf("<") >= 0 || e.indexOf(".") >= 0;
            }
            this.$wrapper.attr("data-cmp-eid", this.eid);
            var t = this, o = t.properties;
            e && o.typeStr(e.type);
            if (e) {
                if (e.extendProperties) {
                    var u = e.extendProperties.call(this);
                    u && i.extend(o, u);
                }
                if (e.extendUIConfig
) {
                    var a = e.extendUIConfig.call(this);
                    a && i.extend(this.uiConfig, a);
                }
            }
            e && i.extend(t, i.omit(e, "properties"));
            var l = !0;
            n.computed({
                read: function() {
                    var e = o.left(), n = o.top();
                    t.$wrapper.css({
                        left: e + "px",
                        top: n + "px"
                    }), l || t.onMove(e, n);
                }
            }), n.computed({
                read: function() {
                    var e = o.width(), n = o.height();
                    t.resize(e, n), l || t.onResize(e, n), l = !1;
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.zIndex();
                    e > 0 && t.$wrapper.css({
                        "z-index": t.properties.zIndex()
                    }), t.$wrapper.css({
                        "min-width"
: t.properties.minWidth() + "px",
                        display: t.properties.displayStr()
                    });
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.rid();
                    e ? t.$wrapper.attr({
                        id: t.properties.rid()
                    }) : t.$wrapper.removeAttr("id");
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.targetUrl();
                    e ? r(t.$wrapper.find("a")[0]).attr({
                        href: e
                    }) : r(t.$wrapper.find("a")[0]).removeAttr("href");
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.boxClassStr(), n = t.properties.titleStr();
                    t.$wrapper.attr({
                        "class": e
                    }), n ? t.$wrapper.attr({
                        title
: n
                    }) : t.$wrapper.removeAttr("title");
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.hoverStr();
                    r.trim(e).length ? t.$wrapper.attr({
                        hoverStyle: e
                    }) : t.$wrapper.removeAttr("hoverStyle");
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.newBlank(), n = t.properties.targetUrl();
                    n.length && (e ? r(t.$wrapper.find("a")[0]).attr({
                        target: "_blank"
                    }) : r(t.$wrapper.find("a")[0]).attr({
                        target: "_top"
                    }));
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.overflow();
                    switch (e) {
                      case "visiable":
                        t.$wrapper.css({
                            
overflow: "visiable"
                        });
                        break;
                      case "overflowX":
                        t.$wrapper.css({
                            "overflow-x": "hidden"
                        });
                        break;
                      case "overflowY":
                        t.$wrapper.css({
                            "overflow-y": "hidden"
                        });
                        break;
                      case "overflowXY":
                        t.$wrapper.css({
                            overflow: "hidden"
                        });
                    }
                }
            }), n.computed({
                read: function() {
                    var e = t.uiConfig.borderRadius.items, n = t.uiConfig.margin.items, r = t.uiConfig.padding.items;
                    t.$wrapper.css({
                        "border-radius": i.map(e, function(e) {
                            return Math.round(e.value()) + "px"
;
                        }).join(" "),
                        margin: i.map(n, function(e) {
                            return isNaN(+e.value()) ? e.value() : Math.round(e.value()) + "px";
                        }).join(" "),
                        padding: i.map(r, function(e) {
                            return Math.round(e.value()) + "px";
                        }).join(" ")
                    });
                }
            }), n.computed(function() {
                t.$wrapper.css({
                    color: t.properties.boxColor(),
                    "font-size": t.properties.boxFontSize()
                });
            }), n.computed(function() {
                var e = t.properties.animateStr(), n = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
                e && (t.$wrapper.hasClass("animated") || t.$wrapper.addClass("animated"), t.tempAniStr && t.tempAniStr != e && t.$wrapper.removeClass(t.tempAniStr), t.tempAniStr = e, t.$wrapper
.addClass(e).one(n, function() {}));
            }), n.computed({
                read: function() {
                    var e = t.properties.borderStyle(), n = t.properties.borderColor(), r = t.properties.borderAlpha(), o = s(n);
                    o._alpha = r;
                    var u = t.uiConfig.borderWidth.items;
                    e ? (t.$wrapper.css({
                        "border-style": e
                    }), t.$wrapper.css({
                        "border-color": o.cssa()
                    }), t.$wrapper.css({
                        "border-width": i.map(u, function(e) {
                            return Math.round(e.value()) + "px";
                        }).join(" ")
                    })) : t.$wrapper.css({
                        border: ""
                    });
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.background(), n = t.properties.backgroundColor(), r = t.properties.backgroundAlpha
(), o = s(n);
                    o._alpha = r;
                    var u = t.properties.backgroundImageStr();
                    if (e) {
                        t.$wrapper.css({
                            "background-color": o.cssa()
                        });
                        switch (t.properties.backgroundImageType()) {
                          case "none":
                            t.$wrapper.css({
                                "background-image": ""
                            });
                            break;
                          case "gradient":
                            var a = t.properties.backgroundGradientStops(), f = t.properties.backgroundGradientAngle(), l = "linear-gradient(" + f + "deg, " + i.map(a, function(e) {
                                return s(e.color()).cssa() + " " + Math.round(e.percent() * 100) + "%";
                            }).join(", ") + ")";
                            t.$wrapper.css({
                                "background-image"
: "-webkit-" + l,
                                "background-image": "-moz-" + l,
                                "background-image": l
                            });
                            break;
                          case "file":
                            u.indexOf("url") >= 0 ? t.$wrapper.css({
                                background: u
                            }) : t.$wrapper.css({
                                background: "url('" + u + "')"
                            });
                        }
                    } else t.$wrapper.css({
                        background: ""
                    });
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.hover(), n = t.properties.hoverComponent();
                    e ? c(n) ? (t.$wrapper.find(".e-hover-code").remove(), t.$wrapper.find(".e-hover-target").remove(), t.$wrapper.append(r("<div></div>").append(r("<div></div>").addClass("e-hover-code"
).append(n)).html()), t.$wrapper.css({
                        cursor: "auto"
                    })) : (t.$wrapper.find(".e-hover-code").remove(), t.$wrapper.find(".e-hover-target").remove(), t.properties.boxClassStr().indexOf("e-hover-source") < 0 && t.properties.boxClassStr(t.properties.boxClassStr() + " e-hover-source"), t.$wrapper.css({
                        cursor: "pointer"
                    }), t.$wrapper.append(f), e == "left" && t.$wrapper.find(".e-hover-target").addClass("left"), e == "right" && t.$wrapper.find(".e-hover-target").addClass("right"), n && t.trigger("addHoverComponent", n, t.$wrapper.find(".e-hover-content"), e)) : (t.$wrapper.removeClass("e-hover-source"), t.$wrapper.find(".e-hover-target").remove(), t.$wrapper.find(".e-hover-code").remove());
                }
            }), n.computed({
                read: function() {
                    var e = t.properties, n = Math.round(e.shadowOffsetX()) + "px", r = Math.round(e.shadowOffsetY()) + "px", i = Math.
round(e.shadowBlur()) + "px", o = Math.round(e.shadowColor()), u = e.shadowColorAlpha(), a = s(o);
                    a._alpha = u, i && e.hasShadow() ? t.$wrapper.css({
                        "box-shadow": [ n, r, i, a.cssa() ].join(" ")
                    }) : t.$wrapper.css({
                        "box-shadow": ""
                    });
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.floatStr();
                    t.properties.positionStr() != "relative" && t.properties.floatStr(""), e == "both" ? t.$wrapper.css({
                        clear: "both"
                    }) : t.$wrapper.css({
                        position: t.properties.positionStr(),
                        "float": t.properties.floatStr(),
                        clear: "none"
                    });
                }
            }), n.computed({
                read: function() {
                    t.type = t.properties.typeStr();
                
}
            }), n.computed({
                read: function() {
                    var e = t.properties.eventName(), n = t.properties.eventHandler();
                    e ? (t.tempEventName = e, t.$wrapper.attr("on-" + e, "{" + n + "}")) : (t.$wrapper.removeAttr("on-" + t.tempEventName), t.tempEventName = "");
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.dataCate(), n = t.properties.dataAction(), r = t.properties.dataLabel();
                    e && t.$wrapper.attr({
                        "data-cate": e
                    }), n && t.$wrapper.attr({
                        "data-action": n
                    }), r && t.$wrapper.attr({
                        "data-label": r
                    }), (e || n || r) && t.properties.boxClassStr().indexOf("ga-click") < 0 && t.properties.boxClassStr(t.properties.boxClassStr() + " ga-click");
                }
            }), t.$wrapper.css({
                position
: "absolute"
            }), this.properties.boxClassStr("cmp-element cmp-" + (this.type || "element").toLowerCase() + " " + this.properties.boxClassStr()), this.onCreate(this.$wrapper), this.properties.id() || this.properties.id(x(this.type || "element"));
        },
        syncPositionManually: function() {
            var e = parseInt(this.$wrapper.css("left")), t = parseInt(this.$wrapper.css("top"));
            this.properties.left(e), this.properties.top(t);
        },
        resize: function(e, t) {
            this.$wrapper.width(e), this.$wrapper.height(t), this.$wrapper.find("a").height(t);
        },
        rasterize: function() {},
        "export": function() {
            var e = {
                eid: this.eid,
                type: this.type,
                properties: o.toJS(this.properties),
                assets: {
                    images: {}
                }
            };
            return this.onExport(e), e;
        },
        isContainer: function() {
            
return this.properties.id().indexOf("container") < 0 ? !1 : !0;
        },
        isCache: function() {
            return this.type == "FUNC" && this.properties.funcType() == "CACHE";
        },
        exportCache: function() {
            var e = "", t = "";
            return this.properties.requestType() != "dwr" ? e = h.replace(/\_\_name\_\_/g, this.properties.requestName()).replace(/\_\_url\_\_/g, this.properties.requestUrl()).replace(/\_\_method\_\_/g, this.properties.requestType()) : e = p.replace(/\_\_name\_\_/g, this.properties.requestName()).replace(/\_\_url\_\_/g, this.properties.requestUrl()), t = d.replace(/\_\_funcName\_\_/g, this.properties.requestName()).replace(/\_\_reqData\_\_/g, this.properties.requestParam()).replace(/\_\_cb\_\_/g, this.properties.onLoadFunc()), {
                cacheItem: e,
                cacheItemCall: t
            };
        },
        getLeft: function() {
            return this.properties.left();
        },
        getTop: function() {
            
return this.properties.top();
        },
        getZ: function() {
            return this.properties.zIndex();
        },
        setLeft: function(e) {
            this.properties.left(e);
        },
        setTop: function(e) {
            this.properties.top(e);
        },
        setZ: function(e) {
            this.properties.zIndex(e);
        },
        setPosition: function(e) {
            this.$wrapper.css({
                position: e
            });
        },
        getName: function() {
            var e = this.properties.id();
            return this.isContainer() ? e.substring(0, e.indexOf("container") - 1) : e;
        },
        getCss: function(e, t, n) {
            if (e.children().length < 1) return;
            var i = this, s = "", o = t, u = "";
            r.each(e.children(), function(e, a) {
                u = r(a).attr("class");
                if (u) {
                    var f = r.trim(i.removeCMPClass(u));
                    f.length ? r(a).attr({
                        "class"
: f
                    }) : r(a).removeAttr("class");
                }
                s = r(a).attr("style"), u = r(a).attr("class"), o = t + " > " + (u && u.length ? "." + u.split(" ").join(".") : r(a).prop("tagName").toLowerCase());
                if (s) {
                    var l = w.exec(s);
                    l && +l[1].split(",")[3] > 0 && (s = "background-color:rgb(" + l[1].split(",").slice(0, 3).join(",") + ");filter:alpha(opacity=" + +l[1].split(",")[3] * 100 + ");" + s), n.push(o + "{" + s + "}");
                    var c = r(a).attr("hoverstyle");
                    c && (c.indexOf("{") >= 0 ? n.push(c.replace(/\&/g, o)) : n.push(o + ":hover{" + i.getCSS3String(c) + "}"), r(a).removeAttr("hoverstyle")), r(a).removeAttr("style");
                }
                i.getCss(r(a), o, n);
            });
        },
        getHTMLCSS: function(e, t) {
            var n = r("<div></div>").append(e), i = [];
            return this.getCss(n, "." + t, i), {
                html
: n.html(),
                css: i.join("")
            };
        },
        removeCMPClass: function(e) {
            return e = r.trim(e), i.each(e.split(" "), function(t, n) {
                if (t.indexOf("cmp") >= 0 || t.indexOf("qpf") >= 0) e = e.replace(t, "");
            }), e = e.replace(/\s+/g, " "), e;
        },
        getCSS3String: function(e) {
            return e.replace(/(box\-shadow|transition):[\s\S]*?\;/g, function(e) {
                var t = e.split(":");
                return "-webkit-" + t[0] + ":" + t[1] + "-moz-" + t[0] + ":" + t[1] + "-o-" + t[0] + ":" + t[1] + t[0] + ":" + t[1];
            });
        },
        exportHTMLCSS: function() {
            this.$wrapper.find(".element-select-outline").remove();
            var e = "", t = this.type, n = this.properties.boxClassStr(), r = this.properties.hoverStr(), i = this.properties.titleStr(), s = this.properties.animateStr(), o = this.properties.rid(), a = "", f = "", h = this.$wrapper.html();
            
s != "none" ? (f += m.common, f += m.list[s], n = this.removeCMPClass(n) + " animated " + s) : n = this.removeCMPClass(n), h.indexOf("animated") >= 0 && u.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u5d4c\u5957\u4e2d\u542b\u6709\u52a8\u753b\uff0c\u8bf7\u4e0b\u8f7d<a style='color:#fff;' href='style/lib/animate.min.css' target='_blank'>animate.min.css</a>\u6837\u5f0f\u548c\u6eda\u52a8\u52a0\u8f7d\u52a8\u753b\u5904\u7406\u51fd\u6570<a style='color:#fff;' href='style/lib/animate.js' target='_blank'>animate.js</a>"), o && (a = " id='" + o + "'");
            var p = {};
            !this.$wrapper.hasClass("e-hover-source") && !this.$wrapper.hasClass("cmp-func") && !this.$wrapper.find("a").attr("href") ? p = this.getHTMLCSS(this.$wrapper.find("a").length ? this.$wrapper.find("a").html() : h, this.properties.id()) : p = this.getHTMLCSS(h, this.properties.id());
            if (this.type == "FUNC" && this.properties.funcType() == "CACHE") e = "", f = ""; else {
                e = "<div" + a + " class='" + 
this.properties.id() + " " + n + "'";
                var d = this.properties.eventName(), v = this.properties.eventHandler();
                d && (e += " on-" + d + "={" + v + "}");
                var g = this.properties.dataCate().replace(/\"/g, "'"), y = this.properties.dataAction().replace(/\"/g, "'"), b = this.properties.dataLabel().replace(/\"/g, "'");
                g && (e += ' data-cate="' + g + '" '), y && (e += ' data-action="' + y + '" '), b && (e += ' data-label="' + b + '" '), i && (e += ' title="' + i + '" '), e += ">" + p.html + "</div>", f += p.css;
                var E = this.$wrapper.attr("style");
                this.isContainer() && (E = E.replace("absolute", "relative"));
                var S = w.exec(E);
                S && +S[1].split(",")[3] > 0 && (E = "background-color:rgb(" + S[1].split(",").slice(0, 3).join(",") + ");filter:alpha(opacity=" + +S[1].split(",")[3] * 100 + ");" + E), f += "." + this.properties.id() + " {" + E + "}", r && (r.indexOf("{") >= 0 ? 
(f += r.replace(/\&/g, "." + this.properties.id()), f = this.getCSS3String(f)) : f += "." + this.properties.id() + ":hover {" + this.getCSS3String(r) + "}");
            }
            if (h.indexOf("e-hover-target") >= 0 || h.indexOf("e-hover-code") >= 0) f += l;
            return /.*f-.?line.*/g.test(h) && (f += c), e = e.replace(/data-cmp-eid\=\"(\d*)\"/g, "").replace(/\s+\'/g, "'"), {
                html: e,
                css: f
            };
        },
        "import": function(e) {
            o.fromJS(e.properties, {}, this.properties), delete this.properties.__ko_mapping__, this.onImport(e);
        },
        makeAsset: function(e, t, n, r) {
            var i = this.eid + "#" + t;
            return r[e] || (r[e] = {}), r[e][i] = {
                data: n,
                type: e
            }, "url(" + e + "/" + i + ")";
        },
        build: function() {}
    }), S = {}, T = 1, C = 1;
    return E;
}), define("core/factory", [ "require", "./element", "ko.mapping", "_"
, "$" ], function(e) {
    var t = e("./element"), n = e("ko.mapping"), r = e("_"), i = e("$"), s = {}, o = {}, u = {
        register: function(e, t) {
            s[e] = t;
        },
        create: function(e, r) {
            var i = new t;
            o[i.eid] = i;
            var u = s[e];
            return i.initialize(u), r && (n.fromJS(r, {}, i.properties), delete i.properties.__ko_mapping__), i;
        },
        clone: function(e) {
            var t = e.type.toLowerCase(), r = n.toJS(e.properties), i = e.__original__ ? e.__original__.properties.id() : e.properties.id();
            r.id = a(i), r.left = parseInt(r.left) + 10, r.top = parseInt(r.top) + 10;
            var s = u.create(t, r);
            return s.__original__ = e.__original__ || e, s;
        },
        getByEID: function(e) {
            return o[e];
        },
        removeByEID: function(e) {
            delete o[e];
        },
        remove: function(e) {
            delete o[e.eid];
        }
    }, 
a = function() {
        var e = {};
        return function(t) {
            e[t] || (e[t] = 0);
            var n = t + "_\u590d\u5236";
            return e[t] && (n += e[t]), e[t]++, n;
        };
    }();
    return u;
}), define("core/service", [ "require", "$", "modules/common/modal" ], function(e) {
    var t = e("$"), n = e("modules/common/modal"), r = {
        saveApi: function(e, r, i) {
            t.post(e, r, function(e) {
                typeof i == "function" ? i(e) : n.confirm("\u63d0\u793a", e.message || i, null, null, 3e3);
            });
        }
    };
    return r;
}), define("elements/func", [ "require", "core/factory", "knockout" ], function(e) {
    var t = e("core/factory"), n = e("knockout");
    t.register("func", {
        type: "FUNC",
        extendProperties: function() {
            return {
                text: n.observable("\u51fd\u6570"),
                funcType: n.observable(""),
                funcLanguage: n.observable(""),
                ifFuncItem
: n.observable(""),
                trueFuncBody: n.observable(""),
                elseIfSwitch: n.observable(!1),
                elseIfFuncItem: n.observable(""),
                elseIfFuncBody: n.observable(""),
                elseIfSwitch2: n.observable(!1),
                elseIfFuncItem2: n.observable(""),
                elseIfFuncBody2: n.observable(""),
                falseFuncBody: n.observable(""),
                forFuncItem: n.observable(""),
                forFuncBody: n.observable(""),
                requestName: n.observable(""),
                requestUrl: n.observable(""),
                requestType: n.observable("post"),
                requestParam: n.observable("{}"),
                onLoadFunc: n.observable(""),
                includeBody: n.observable("")
            };
        },
        extendUIConfig: function() {
            var e = this;
            return {
                funcType: {
                    label: "\u51fd\u6570\u7c7b\u578b",
                    
ui: "combobox",
                    "class": "small",
                    field: "func",
                    items: [ {
                        text: "IF\u51fd\u6570",
                        value: "IF"
                    }, {
                        text: "FOR\u51fd\u6570",
                        value: "FOR"
                    }, {
                        text: "Include\u51fd\u6570",
                        value: "INCLUDE"
                    }, {
                        text: "Cache\u51fd\u6570",
                        value: "CACHE"
                    } ],
                    value: this.properties.funcType
                },
                funcLanguage: {
                    label: "\u51fd\u6570\u8bed\u8a00",
                    ui: "combobox",
                    "class": "small",
                    field: "func",
                    items: [ {
                        text: "FTL\u6a21\u677f",
                        value: "FTL"
                    }, {
                        
text: "Regular\u6a21\u677f",
                        value: "Regular"
                    }, {
                        text: "JS\u51fd\u6570",
                        value: "JS"
                    } ],
                    value: this.properties.funcLanguage
                },
                includeBody: {
                    label: "\u5305\u542b\u7ec4\u4ef6",
                    ui: "textarea",
                    field: "func",
                    text: this.properties.includeBody,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "INCLUDE";
                        }
                    })
                },
                ifFuncItem: {
                    label: "IfItem",
                    ui: "textfield",
                    field: "func",
                    text: this.properties.ifFuncItem,
                    visible: n.computed({
                        read: function() {
                            
return e.properties.funcType() == "IF";
                        }
                    })
                },
                trueFuncBody: {
                    label: "IfTrue",
                    ui: "textarea",
                    field: "func",
                    text: this.properties.trueFuncBody,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "IF";
                        }
                    })
                },
                elseIfFuncItem: {
                    label: "elseIfItem",
                    ui: "textfield",
                    field: "func",
                    text: this.properties.elseIfFuncItem,
                    visible: n.computed({
                        read: function() {
                            return e.properties.elseIfSwitch();
                        }
                    })
                },
                elseIfFuncBody: {
                    
label: "elseIfBody",
                    ui: "textarea",
                    field: "func",
                    text: this.properties.elseIfFuncBody,
                    visible: n.computed({
                        read: function() {
                            return e.properties.elseIfSwitch();
                        }
                    })
                },
                elseIfFuncItem2: {
                    label: "elseIfItem",
                    ui: "textfield",
                    field: "func",
                    text: this.properties.elseIfFuncItem2,
                    visible: n.computed({
                        read: function() {
                            return e.properties.elseIfSwitch2();
                        }
                    })
                },
                elseIfFuncBody2: {
                    label: "elseIfBody",
                    ui: "textarea",
                    field: "func",
                    text: this.properties.elseIfFuncBody2,
                    
visible: n.computed({
                        read: function() {
                            return e.properties.elseIfSwitch2();
                        }
                    })
                },
                falseFuncBody: {
                    label: "IfFalse",
                    ui: "textarea",
                    field: "func",
                    text: this.properties.falseFuncBody,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "IF";
                        }
                    })
                },
                forFuncItem: {
                    label: "ForItem",
                    ui: "textfield",
                    field: "func",
                    text: this.properties.forFuncItem,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "FOR";
                        }
                    
})
                },
                forFuncBody: {
                    label: "ForBody",
                    ui: "textarea",
                    field: "func",
                    text: this.properties.forFuncBody,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "FOR";
                        }
                    })
                },
                requestName: {
                    label: "\u65b9\u6cd5\u540d\u79f0",
                    ui: "textfield",
                    field: "func",
                    text: this.properties.requestName,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "CACHE";
                        }
                    })
                },
                requestUrl: {
                    label: "\u8bf7\u6c42\u5730\u5740",
                    ui: "textfield",
                    
field: "func",
                    text: this.properties.requestUrl,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "CACHE";
                        }
                    })
                },
                requestType: {
                    label: "\u8bf7\u6c42\u7c7b\u578b",
                    ui: "combobox",
                    "class": "small",
                    field: "func",
                    items: [ {
                        text: "POST",
                        value: "post"
                    }, {
                        text: "GET",
                        value: "get"
                    }, {
                        text: "DWR",
                        value: "dwr"
                    } ],
                    value: this.properties.requestType,
                    visible: n.computed({
                        read: function() {
                            return e.properties
.funcType() == "CACHE";
                        }
                    })
                },
                requestParam: {
                    label: "\u8bf7\u6c42\u53c2\u6570",
                    ui: "textarea",
                    field: "func",
                    text: this.properties.requestParam,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "CACHE";
                        }
                    })
                },
                onLoadFunc: {
                    label: "\u6210\u529f\u56de\u6389",
                    ui: "textarea",
                    field: "func",
                    text: this.properties.onLoadFunc,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "CACHE";
                        }
                    })
                }
            };
        },
        onCreate
: function(e) {
            function i(e) {
                return e.indexOf("<") >= 0 || e.indexOf(".") >= 0;
            }
            var t = $("<span></span>"), r = this;
            e.find("a").length ? $(e.find("a")[0]).append(t) : e.append(t), n.computed(function() {
                var n = r.properties.funcType(), s = r.properties.funcLanguage();
                n == "CACHE" && r.properties.funcLanguage("JS"), t.html(n + "\u51fd\u6570<br/>" + r.properties.funcLanguage() + "\u6a21\u677f/\u8bed\u8a00");
                var o = "", u = r.properties.id();
                if (n == "IF") {
                    var a = r.properties.ifFuncItem(), f = r.properties.elseIfSwitch(), l = r.properties.elseIfSwitch2(), c = r.properties.elseIfFuncItem(), h = r.properties.elseIfFuncItem2();
                    if (!a) return;
                    r.$wrapper.empty();
                    var p = u + "-t", d = u + "-f", v = u + "-elf", m = u + "-elf2", g = r.properties.trueFuncBody(), y = r.properties
.falseFuncBody(), b = r.properties.elseIfFuncBody(), w = r.properties.elseIfFuncBody2();
                    s == "FTL" ? (o = "<#if " + a + "><div class='" + p + "'></div>", f && b && (o += "<#elseif " + c + "><div class='" + v + "'></div>"), l && w && (o += "<#elseif " + h + "><div class='" + m + "'></div>"), o += "<#else><div class='" + d + "'></div>&lt;/#if>") : s == "Regular" && (o = "{#if " + a + "}<div class='" + p + "'></div>", f && b && (o += "{#elseif " + c + "}<div class='" + v + "'></div>"), l && w && (o += "{#elseif " + h + "}<div class='" + m + "'></div>"), o += "{#else}<div class='" + d + "'></div>{/if}"), r.$wrapper.append(o), g ? i(g) ? r.$wrapper.find("." + p).append(g) : r.trigger("addFuncComponent", g, r.$wrapper.find("." + p)) : r.$wrapper.find("." + p).remove(), b ? i(b) ? r.$wrapper.find("." + v).append(b) : r.trigger("addFuncComponent", b, r.$wrapper.find("." + v)) : r.$wrapper.find("." + v).remove(), w ? i(w) ? r.$wrapper.find("." + m).append(w) : r.trigger("addFuncComponent"
, w, r.$wrapper.find("." + m)) : r.$wrapper.find("." + m).remove(), y ? i(y) ? r.$wrapper.find("." + d).append(y) : r.trigger("addFuncComponent", y, r.$wrapper.find("." + d)) : r.$wrapper.find("." + d).remove();
                } else if (n == "FOR") {
                    if (!r.properties.forFuncItem()) return;
                    if (!r.properties.forFuncBody()) return;
                    r.$wrapper.empty();
                    var E = u + "-f";
                    s == "FTL" ? o = "<#if " + r.properties.forFuncItem() + "??><#list " + r.properties.forFuncItem() + " as item><div class='" + E + "'></div>&lt;/#list>&lt;/#if>" : s == "Regular" && (o = "{#if " + r.properties.forFuncItem() + "}{#list " + r.properties.forFuncItem() + " as item}<div class='" + E + "'></div>{/list}{/if}"), r.$wrapper.append(o);
                    var S = r.properties.forFuncBody();
                    S && (i(S) ? r.$wrapper.find("." + E).append(S) : r.trigger("addFuncComponent", r.properties.forFuncBody(), 
r.$wrapper.find("." + E)));
                } else if (n == "CACHE") r.$wrapper.empty(), r.$wrapper.css({
                    color: "#fff",
                    background: "#56278f"
                }), r.$wrapper.append("CACHE"), r.$wrapper.addClass("cmp-umi"); else if (n == "INCLUDE") {
                    r.$wrapper.empty();
                    var x = r.properties.includeBody();
                    if (x) {
                        var T = u + "-i";
                        o = "<div class='" + T + "'></div>", r.$wrapper.append(o), i(x) ? x.indexOf("<#include") < 0 && s == "FTL" ? r.$wrapper.find("." + T).append('<#include "' + x + '"/>') : r.$wrapper.find("." + T).append(x) : r.trigger("addFuncComponent", x, r.$wrapper.find("." + T));
                    } else e.append(t);
                } else r.$wrapper.empty();
            });
        }
    });
}), define("elements/image", [ "require", "core/factory", "knockout", "_" ], function(e) {
    var t = e("core/factory"), n = e("knockout"
), r = e("_");
    t.register("image", {
        type: "IMAGE",
        extendProperties: function() {
            return {
                src: n.observable(""),
                alt: n.observable(""),
                classStr: n.observable("")
            };
        },
        extendUIConfig: function() {
            return {
                src: {
                    label: "\u56fe\u7247\u5730\u5740",
                    ui: "textfield",
                    text: this.properties.src
                },
                alt: {
                    label: "alt\u5185\u5bb9",
                    ui: "textfield",
                    text: this.properties.alt
                },
                classStr: {
                    label: "class",
                    ui: "textfield",
                    text: this.properties.classStr
                }
            };
        },
        onCreate: function(e) {
            var t = document.createElement("img"), i = this, s = function(e, n) {
                
t.width = e, t.height = n, $(t).css({
                    width: e,
                    height: n
                });
            }, o = i.properties.width(), u = i.properties.height();
            s(o, u), t.alt = i.properties.alt(), n.computed(function() {
                t.onload = function() {
                    var e = t.width, n = t.height;
                    i.properties.width() || i.properties.width(e), i.properties.height() || i.properties.height(n), s(i.properties.width(), i.properties.height()), t.onload = null;
                }, t.src = i.properties.src();
                var e = i.uiConfig.size.items;
                s(e[0].value(), e[1].value());
            }), n.computed({
                read: function() {
                    var e = i.uiConfig.borderRadius.items, n = i.properties.alt();
                    $(t).css({
                        "border-radius": r.map(e, function(e) {
                            return e.value() + "px";
                        }).join(" "
)
                    }), n ? $(t).attr({
                        alt: n
                    }) : $(t).removeAttr("alt");
                }
            }), n.computed(function() {
                var e = i.properties.classStr();
                e && $(t).addClass(e);
            }), n.computed(function() {
                var e = i.properties.width(), t = i.properties.height();
                s(e, t);
            }), e.find("a").length ? $(e.find("a")[0]).append(t) : e.append(t);
        },
        onExport: function(e) {}
    });
}), define("elements/timeline", [ "require", "core/factory", "knockout", "_", "sequence" ], function(e) {
    var t = e("core/factory"), n = e("knockout"), r = e("_");
    e("sequence"), t.register("timeline", {
        type: "TIMELINE",
        extendProperties: function() {
            return {
                timelineCode: n.observable("")
            };
        },
        extendUIConfig: function() {
            return {
                timelineCode: {
                    
label: "\u65f6\u5e8f\u56fe",
                    ui: "codearea",
                    field: "timeline",
                    text: this.properties.timelineCode
                }
            };
        },
        refreshDiagram: function(e) {
            $("#drawDiagram").text(e), $("#drawDiagram").sequenceDiagram({
                theme: "simple"
            });
        },
        onCreate: function(e) {
            var t = this;
            t.properties.width(800), t.properties.height(600), n.computed(function() {
                t.refreshDiagram("");
                var e = t.properties.timelineCode();
                t.refreshDiagram(e);
            });
        }
    });
}), define("modules/module", [ "require", "qpf", "knockout" ], function(e) {
    var t = e("qpf"), n = t.use("base"), r = e("knockout"), i = t.use("core/xmlparser"), s = t.use("core/mixin/derive"), o = t.use("core/mixin/event"), u = new Function;
    _.extend(u, s), _.extend(u.prototype, o);
    var a = u.derive(function(
) {
        return {
            name: "",
            $el: $("<div style='position:relative'></div>"),
            xml: "",
            context: {},
            mainComponent: null
        };
    }, {
        start: function() {
            return this.xml && this.applyXML(this.xml), this.trigger("start"), this.$el;
        },
        enable: function(e) {
            this.$el.show(), this.trigger("enable"), e && e();
        },
        disable: function(e) {
            this.$el.hide(), this.trigger("disable"), e && e();
        },
        setContext: function(e) {
            this._defaultContext || (this._defaultContext = {}, _.each(this.context, function(e, t) {
                this._defaultContext[t] = e();
            }, this));
            for (var t in this.context) typeof e[t] != "undefined" ? this.context[t](e[t]) : this.context[t](this._defaultContext[t]);
            n.prototype._mappingAttributes.call(this.context, e, !0);
        },
        dispose: function() {
            
n.disposeByDom(this.$el[0]), this.$el.remove();
        },
        loadingStart: function() {
            this._$mask && this._$mask.addClass("loading").show();
        },
        loadingEnd: function() {
            this._$mask && this._$mask.removeClass("loading").hide();
        },
        applyXML: function(e) {
            i.parse(e, this.$el[0]), r.applyBindings(this, this.$el[0]);
            var t = this.$el[0].firstChild;
            t && (this.mainComponent = n.getByDom(t));
        }
    });
    return a;
}), define("text!modules/hierarchy/hierarchy.xml", [], function() {
    return '<container id="Hierarchy">\r\n    <list id="ElementsList" dataSource="@binding[elementsList]" itemView="@binding[ElementView]" onselect="@binding[_selectElements]"></list>\r\n</container>';
}), define("text!modules/property/property.xml", [], function() {
    return '<tab id="Property">\r\n    <panel title="\u5e03\u5c40">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[layoutProperties]"></list>\r\n    </panel>\r\n    <panel title="\u6837\u5f0f">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[styleProperties]"></list>\r\n    </panel>\r\n    <panel title="\u5176\u4ed6">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[customProperties]"></list>\r\n    </panel>\r\n    <panel title="\u51fd\u6570">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[funcProperties]"></list>\r\n    </panel>\r\n    <panel title="\u4e8b\u4ef6">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[eventProperties]"></list>\r\n    </panel>\r\n    <panel title="\u65f6\u5e8f">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[timeProperties]"></list>\r\n    </panel>\r\n</tab>\r\n'
;
}), define("text!modules/property/property.html", [], function() {
    return '<div class="qpf-property-left" data-bind="if:label">\r\n    <div data-bind=\'qpf:{type:"label", text:label}\'></div>\r\n</div>\r\n<div class="qpf-property-right">\r\n    <div data-bind=\'qpf:config\'></div>\r\n</div>';
}), define("modules/property/property", [ "require", "qpf", "knockout", "text!./property.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.widget.Widget, i = r.derive(function() {
        return {
            label: n.observable(""),
            config: n.observable()
        };
    }, {
        type: "PROPERTY",
        css: "property",
        template: e("text!./property.html")
    });
    return i;
}), define("modules/property/index", [ "require", "qpf", "knockout", "../module", "text!./property.xml", "_", "./property" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("../module"), i = e("text!./property.xml"), s = e("_"), o = e("./property"), u = new r({
        
name: "property",
        xml: i,
        layoutProperties: n.observableArray([]),
        styleProperties: n.observableArray([]),
        customProperties: n.observableArray([]),
        funcProperties: n.observableArray([]),
        eventProperties: n.observableArray([]),
        timeProperties: n.observableArray([]),
        showProperties: function(e) {
            var t = [], r = [], i = [], o = [], u = [], a = [];
            s.each(e, function(e) {
                if (e.ui) {
                    e.type = e.ui;
                    var f = s.omit(e, "label", "ui", "field", "visible"), l = {
                        label: e.label,
                        config: n.observable(f)
                    };
                    e.visible && (l.visible = e.visible);
                    switch (e.field) {
                      case "layout":
                        t.push(l);
                        break;
                      case "style":
                        r.push(l);
                        
break;
                      case "func":
                        o.push(l);
                        break;
                      case "event":
                        u.push(l);
                        break;
                      case "timeline":
                        a.push(l);
                        break;
                      default:
                        i.push(l);
                    }
                }
            }), this.layoutProperties(t), this.styleProperties(r), this.customProperties(i), this.funcProperties(o), this.eventProperties(u), this.timeProperties(a);
        },
        PropertyItemView: o
    });
    return u;
}), define("text!modules/dataMock/property.xml", [], function() {
    return '<list class="dataModal" itemView="@binding[PropertyItemView]" dataSource="@binding[dataProperties]"></list>\r\n';
}), define("text!modules/dataMock/property.html", [], function() {
    return '<div class="qpf-property-left" data-bind="if:label">\r\n    <div data-bind=\'qpf:{type:"label", text:label}\'></div>\r\n</div>\r\n<div class="qpf-property-right">\r\n    <div data-bind=\'qpf:config\'></div>\r\n</div>'
;
}), define("modules/dataMock/property", [ "require", "qpf", "knockout", "text!./property.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.widget.Widget, i = r.derive(function() {
        return {
            label: n.observable(""),
            config: n.observable()
        };
    }, {
        type: "PROPERTY",
        css: "property",
        template: e("text!./property.html")
    });
    return i;
}), define("modules/dataMock/index", [ "require", "qpf", "knockout", "../module", "text!./property.xml", "_", "./property" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("../module"), i = e("text!./property.xml"), s = e("_"), o = e("./property"), u = new r({
        name: "property",
        xml: i,
        dataProperties: n.observableArray([]),
        dataValue: {},
        showProperties: function(e) {
            var t = [];
            s.each(e, function(e) {
                if (e.ui) {
                    e.type = e.ui;
                    var r = 
s.omit(e, "label", "ui", "field", "visible"), i = {
                        label: e.label,
                        config: n.observable(r)
                    };
                    e.visible && (i.visible = e.visible);
                    switch (e.field) {
                      case "data":
                        t.push(i);
                        break;
                      default:
                        t.push(i);
                    }
                }
            }), this.dataProperties(t);
        },
        detect: function() {
            var e = this;
            e.dataValue = {};
            var t = $(".qpf-viewport-elements-container").html();
            t = t.substr(t.indexOf("cmp-element")).replace(/\&amp\;/g, "&").replace(/\&gt\;/g, ">").replace(/\&lt\;/g, "<").replace(/\&quot\;/g, '"').replace(/\n/g, "").replace(/hoverstyle\=\"[\s\S]*?\"/g, "");
            var r = new RegExp("{([\\s\\S]+?)}", "igm"), i = t.match(r);
            if (i) {
                i.forEach(function(
e, t, n) {
                    e = e.replace(/\{/g, "").replace(/\}/g, "").replace(/\#/g, "").replace(/if/g, "").replace(/list/g, "").replace(/else/g, "").replace(/\//g, ""), n[t] = e;
                });
                var s = i.filter(function(e) {
                    return e && e.indexOf(";") < 0;
                }), o = {}, a = [];
                $.each(s, function(t, r) {
                    var i = r.replace(/\".*?\"/g, " ").replace(/\'.*?\'/g, " ").replace(/\&/g, " ").replace(/\>/g, " ").replace(/\?/g, " ").replace(/\"/g, " ").replace(/\'/g, " ").replace(/\:/g, " ").replace(/\!/g, " ").replace(/\(/g, " ").replace(/\)/g, " ").replace(/\[/g, " ").replace(/\]/g, " ").replace(/\|/g, " ").replace(/\=/g, " ").replace(/\,/g, " ").replace(/\.length/g, " ").replace(/\$event/g, " ").trim();
                    i.indexOf(" as ") > 0 && a.push({
                        seq: i.split(" as ")[0].trim(),
                        item: i.split(" as ")[1].trim()
                    }), i = i.replace
(/as.*/g, " ");
                    var s = i.split(" ").filter(function(e) {
                        return e.trim().length && e.trim() != "f-dn" && isNaN(+e);
                    }), u = "";
                    $.each(s, function(t, r) {
                        if (r[0] == "." || r.indexOf("_index") > 0) return !0;
                        u = "", r.indexOf(".") > 0 && (u = r.split(".")[1], r = r.split(".")[0]);
                        if (r == "this") return !0;
                        if (!o[r]) {
                            e.dataValue[r] = n.observable("");
                            if (u) {
                                var i = {};
                                i[u] = "", e.dataValue[r](JSON.stringify(i));
                            }
                            o[r] = {
                                label: r,
                                field: "data",
                                ui: "textfield",
                                text: e.dataValue[r]
                            
};
                        } else if (u) {
                            o[r].ui = "textarea";
                            var s = e.dataValue[r](), a = {};
                            s.length > 1 && (a = JSON.parse(s)), a[u] = "", e.dataValue[r](JSON.stringify(a).replace(/\,/g, ",\n"));
                        }
                    });
                }), $.each(a, function(t, r) {
                    var i = [];
                    e.dataValue[r.seq] = n.observable(""), e.dataValue[r.item] && (i.push(JSON.parse(e.dataValue[r.item]())), e.dataValue[r.seq](JSON.stringify(i).replace(/\,/g, ",\n")), o[r.seq] = {
                        label: r.seq,
                        field: "data",
                        ui: "textarea",
                        text: e.dataValue[r.seq]
                    }, delete o[r.item], delete e.dataValue[r.item]);
                });
                var f = [];
                for (var l in o) f.push(o[l]);
                f.push({
                    label: "- Dispaly with mock data"
,
                    field: "data",
                    ui: "button",
                    text: "Click && MockPage"
                }), f.push({
                    label: "- save in caseIns",
                    field: "data",
                    ui: "button",
                    text: "Save in Test Case"
                }), f.push({
                    label: "- get case in caseIns",
                    field: "data",
                    ui: "button",
                    text: "Get Data"
                }), f.push({
                    label: "- show the test result",
                    field: "data",
                    ui: "button",
                    text: "Show Test"
                }), e.showProperties(f), $($(".dataModal button")[0]).click(function() {
                    $(".switchDesign .mock").trigger("click"), u.showMockViewIframe();
                }), $($(".dataModal button")[1]).click(function() {
                    u.trigger("save2test");
                }), $($(".dataModal button"
)[2]).click(function() {
                    u.trigger("getTestData");
                }), $($(".dataModal button")[3]).click(function() {
                    $(".switchDesign .mock").trigger("click"), u.trigger("showTestResult");
                });
            }
        },
        setDataValue: function(e) {
            for (var t in e) u.dataValue[t](JSON.stringify(e[t]).replace(/\,/g, ",\n"));
        },
        getDataValue: function() {
            var e = this, t = {};
            for (var n in e.dataValue) try {
                t[n] = JSON.parse(e.dataValue[n]());
            } catch (r) {
                t[n] = e.dataValue[n]();
            }
            return t;
        },
        addCss: function(e) {
            var t = document.createElement("style");
            t.type = "text/css", t.id = "tempStyle", t.styleSheet ? t.styleSheet.cssText = e : t.innerHTML = e, document.getElementsByTagName("head")[0].appendChild(t);
        },
        showMockViewIframe: function() {
            
var e = this, t = e.getDataValue();
            u.trigger("refreshExample", t);
        },
        showMockView: function(e, t, n) {
            var r = this, i = r.getDataValue();
            n = n.replace(/\{\s?this\.[\s\S]*?\}/g, "");
            var s = Regular.extend({
                template: n
            });
            $("#tempStyle").remove(), u.addCss(t), $("#drawMockView").empty(), (new s({
                data: i
            })).$inject("#drawMockView"), $("#drawMockView .element-select-outline").remove(), $("#drawMockView .cmp-umi").remove();
        },
        PropertyItemView: o
    });
    return u;
}), define("modules/common/listitem", [ "require", "qpf", "knockout" ], function(e) {
    var t = e("qpf"), n = t.use("meta/meta"), r = e("knockout"), i = n.derive(function() {
        return {
            title: r.observable(""),
            icon: r.observable(""),
            href: r.observable("")
        };
    }, {
        type: "LISTITEM",
        css: "list-item",
        
initialize: function() {
            this.$el.mousedown(function(e) {
                e.preventDefault();
            });
            var e = this;
            this.$el.click(function() {
                var t = e.href();
                t && t.indexOf("#") == 0 && (window.location.hash = t);
            });
        },
        template: '<div class="icon" data-bind="css:icon"></div>                    <div class="title" data-bind="html:title"></div>'
    });
    return i;
}), define("modules/common/list", [ "require", "qpf", "./listitem", "knockout" ], function(e) {
    var t = e("qpf"), n = e("./listitem"), r = t.use("container/container"), i = e("knockout"), s = r.derive(function() {
        return {
            dataSource: i.observableArray([]),
            itemView: i.observable(n),
            selected: i.observableArray([]),
            multipleSelect: !1,
            dragSort: !1
        };
    }, {
        type: "LIST",
        css: "list",
        template: '<div data-bind="foreach:children" >                        <div class="qpf-container-item">                            <div data-bind="qpf_view:$data"></div>                        </div>                    </div>'
,
        eventsProvided: _.union(r.prototype.eventsProvided, "select"),
        initialize: function() {
            var e = _.clone(this.dataSource()), t = this;
            this.dataSource.subscribe(function(t) {
                this._update(e, t), e = _.clone(t), _.each(e, function(e, t) {
                    i.utils.unwrapObservable(e.selected) && this.selected(t);
                }, this);
            }, this), this.selected.subscribe(function(e) {
                this._unSelectAll(), _.each(e, function(e) {
                    var t = this.children()[e];
                    t && t.$el.addClass("selected");
                }, this), t.trigger("select", this._getSelectedData());
            }, this), this.$el.delegate(".qpf-container-item", "click", function() {
                var e = i.contextFor(this);
                t.selected([ e.$index() ]);
            }), this._update([], e);
        },
        _getSelectedData: function() {
            var e = this.dataSource(), t = _.map
(this.selected(), function(t) {
                return e[t];
            }, this);
            return t;
        },
        _update: function(e, t) {
            var n = this.children(), r = this.itemView(), s = [], o = i.utils.compareArrays(e, t), u = [];
            _.each(o, function(t) {
                if (t.status === "retained") {
                    var i = e.indexOf(t.value);
                    s[i] = n[i];
                } else if (t.status === "added") {
                    var o = new r({
                        attributes: t.value
                    });
                    s[t.index] = o, n.splice(t.index, 0, o), u.push(o);
                }
            }, this), this.children(s), _.each(u, function(e) {
                e.render();
            });
        },
        _unSelectAll: function() {
            _.each(this.children(), function(e, t) {
                e && e.$el.removeClass("selected");
            }, this);
        }
    });
    return r.provideBinding("list", 
s), s;
}), define("modules/common/contextmenu", [ "require", "qpf", "knockout", "./list" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("./list"), i = t.meta.Meta.derive(function() {
        return {
            label: n.observable(),
            exec: n.observable(function() {})
        };
    }, {
        type: "CONTEXTMENUITEM",
        css: "context-menu-item",
        template: "<div data-bind='html:label'></div>",
        initialize: function() {
            var e = this;
            this.$el.click(function() {
                var t = e.exec();
                t && t(), s.hide();
            });
        }
    }), s = new r({
        attributes: {
            "class": "qpf-context-menu",
            itemView: i
        }
    });
    return s.$el.attr("tabindex", 0), s.show = function(e, t, n) {
        s.$el.show().offset({
            left: t + 5,
            top: n + 5
        }), s.dataSource(e), s.$el.focus();
    }, s.hide = function() {
        s.$el.hide();
    
}, s.bindTo = function(e, t) {
        var n = function(e) {
            e.preventDefault(), s.show(typeof t == "function" ? t(e.target) : t, e.pageX, e.pageY);
        };
        $(e).bind("contextmenu", n);
    }, s.$el.blur(function() {
        s.hide();
    }), s.hide(), document.body.appendChild(s.$el[0]), s.render(), s;
}), define("text!modules/hierarchy/element.html", [], function() {
    return '<div data-bind="attr: { class: typeStr},text:id"></div>\r\n';
}), define("modules/hierarchy/element", [ "require", "qpf", "knockout", "text!./element.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.meta.Meta.derive(function() {
        return {
            id: n.observable(""),
            typeStr: n.observable(""),
            target: n.observable()
        };
    }, {
        type: "ELEMENT",
        css: "element",
        template: e("text!./element.html")
    });
    return r;
}), define("modules/hierarchy/index", [ "require", "qpf", "knockout", "core/factory", "core/command"
, "../module", "text!./hierarchy.xml", "_", "../property/index", "../dataMock/index", "modules/common/contextmenu", "modules/common/modal", "./element" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("core/factory"), i = e("core/command"), s = e("../module"), o = e("text!./hierarchy.xml"), u = e("_"), a = e("../property/index"), f = e("../dataMock/index"), l = e("modules/common/contextmenu"), c = e("modules/common/modal"), h = t.use("meta/textfield"), p = t.use("container/container"), d = t.use("container/inline"), v = t.use("meta/label"), m = e("./element"), g = new s({
        name: "hierarchy",
        xml: o,
        elementsList: n.observableArray([]),
        selectedElements: n.observableArray([]),
        ElementView: m,
        _selectElements: function(e) {
            g.selectedElements(u.map(e, function(e) {
                return e.target;
            }));
        },
        selectElementsByEID: function(e) {
            var t = [];
            return u.each
(e, function(e) {
                var n = r.getByEID(e);
                n && t.push(n);
            }), g.selectedElements(t), t;
        },
        load: function(e) {
            console.log("\u5f00\u59cb\u7ed8\u5236\u5143\u7d20"), this.removeAll(), this.elementsList(u.map(e, function(e) {
                return {
                    id: e.properties.id,
                    typeStr: e.type.toLowerCase(),
                    target: e
                };
            })), u.each(e, function(e) {
                g.trigger("create", e);
            }), f.detect();
        },
        refreshList: function() {
            var e = g.elements();
            this.removeAll(), this.elementsList(u.map(e, function(e) {
                return {
                    id: e.properties.id,
                    typeStr: e.type.toLowerCase(),
                    target: e
                };
            })), u.each(e, function(e) {
                g.trigger("create", e);
            });
        },
        
loadElement: function(e) {
            var t = u.find(this.elementsList(), function(t) {
                return t.id() == e.properties.id;
            });
            t ? (t.target.properties.moduleHTML(e.properties.moduleHTML), t.target.properties.moduleJS(e.properties.moduleJS)) : g.trigger("create", e);
        },
        removeAll: function() {
            $(".qpf-viewport-elements-container .cmp-element").remove(), $("#drawArrow svg line").remove(), $("#drawDiagram").empty(), $("#drawArrow").hide(), $("#drawDiagram").css("opacity", 0);
        }
    });
    g.editModule = function(e) {
        g.trigger("editModule", e);
    }, g.elements = n.computed({
        read: function() {
            return u.map(g.elementsList(), function(e) {
                return e.target;
            });
        },
        deferEvaluation: !0
    }), g.on("start", function() {
        g.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function(e) {
            g.trigger("focus", $(this).qpf("get"
)[0].target());
        }), l.bindTo(g.mainComponent.$el, function(e) {
            var t = $(e).parents(".qpf-ui-element");
            if (t.length) {
                var n = [ {
                    label: "\u5220\u9664",
                    exec: function() {
                        i.execute("remove", t.qpf("get")[0].target());
                    }
                }, {
                    label: "\u590d\u5236",
                    exec: function() {
                        i.execute("copy", t.qpf("get")[0].target());
                    }
                }, {
                    label: "\u4fdd\u5b58\u4e3a\u72ec\u7acb\u7ec4\u4ef6",
                    exec: function() {
                        g.trigger("saveElement", function() {
                            i.execute("remove", t.qpf("get")[0].target());
                        });
                    }
                } ], r = -1;
                return u.find(g.elementsList(), function(e) {
                    return r++, e.id() == 
t.qpf("get")[0].target().properties.id();
                }), r > 0 && n.push({
                    label: "\u4e0a\u79fb",
                    exec: function() {
                        i.execute("upElement", r);
                    }
                }), r < g.elementsList().length - 1 && n.push({
                    label: "\u4e0b\u79fb",
                    exec: function() {
                        i.execute("downElement", r);
                    }
                }), n;
            }
            return [ {
                label: "\u7c98\u8d34",
                exec: function() {
                    var e = i.execute("paste");
                }
            } ];
        });
    }), n.computed(function() {
        var e = g.selectedElements(), t = e[e.length - 1];
        if (t) {
            a.showProperties(t.uiConfig);
            var n = 0;
            u.find(g.elementsList(), function(e) {
                return n++, e.id() == t.properties.id();
            }), t.type == "UMI" || 
t.type == "FUNC" && t.properties.funcType() == "CACHE" ? $(".switchDesign .umi").trigger("click") : t.type == "TIMELINE" ? $(".switchDesign .timeline").trigger("click") : $(".switchDesign .page").trigger("click"), $($("#Hierarchy .qpf-ui-list .qpf-container-item")[--n]).trigger("click");
        }
        g.trigger("select", e);
    }), i.register("create", {
        execute: function(e, t) {
            var n = r.create(e, t);
            g.elementsList.push({
                id: n.properties.id,
                target: n
            }), g.trigger("create", n), g.selectedElements([ n ]);
        },
        unexecute: function(e, t) {}
    }), i.register("upElement", {
        execute: function(e) {
            g.elementsList().splice(e - 1, 0, g.elementsList()[e]), g.elementsList().splice(e + 1, 1), g.elementsList(g.elementsList()), g.trigger("saveProject");
        },
        unexecute: function() {}
    }), i.register("downElement", {
        execute: function(e) {
            g.elementsList
().splice(e + 2, 0, g.elementsList()[e]), g.elementsList().splice(e, 1), g.elementsList(g.elementsList()), g.trigger("saveProject");
        },
        unexecute: function() {}
    }), i.register("remove", {
        execute: function(e) {
            typeof e == "string" && (e = r.getByEID(e)), r.remove(e), g.selectedElements.remove(e), g.elementsList.remove(function(t) {
                return t.id() == e.properties.id();
            }), g.refreshList(), a.showProperties([]), g.trigger("remove", e), e.type == "UMI" && $(e.pointLine[0]).remove();
        },
        unexecute: function() {}
    }), i.register("removeselected", {
        execute: function() {},
        unexecute: function() {}
    });
    var y = [];
    return i.register("copy", {
        execute: function(e) {
            typeof e == "string" && (e = r.getByEID(e)), y = [ e ];
        }
    }), i.register("copyselected", {
        execute: function() {}
    }), i.register("paste", {
        execute: function() {
            
function e(e) {
                var t = [];
                return u.each(y, function(n) {
                    var i = r.clone(n);
                    e >= 0 ? g.elementsList.splice(e, 0, {
                        target: i,
                        id: i.properties.id
                    }) : g.elementsList.push({
                        target: i,
                        id: i.properties.id
                    }), g.trigger("create", i), t.push(i);
                }), g.selectedElements(t), t;
            }
            var t = new p, n = new d;
            n.add(new v({
                attributes: {
                    text: "\u63d2\u5165\u4f4d\u7f6e\uff1a"
                }
            }));
            var i = new h({
                attributes: {
                    placeholder: "\u9ed8\u8ba4\u63d2\u5165\u6700\u540e"
                }
            });
            n.add(i), t.add(n), c.popup("\u8bf7\u8f93\u5165\u76f8\u5173\u5185\u5bb9", t, function() {
                var t = parseInt(
i.text());
                e(t);
            }, function() {
                e(-1);
            });
        },
        unexecute: function() {}
    }), g;
}), define("elements/umi", [ "require", "core/factory", "knockout", "_", "../modules/hierarchy/index", "d3" ], function(e) {
    var t = e("core/factory"), n = e("knockout"), r = e("_"), i = e("../modules/hierarchy/index"), s = e("d3"), o = [ "#61C5C9", "#CC9E82", "#4F8DB1", "#F9C63D", "#60ADD5", "#8EB93B", "#B31800", "#EB3F2F", "#abcc39" ], u = s.select("#drawArrow").append("svg").attr("width", parseInt(s.select("#drawArrow").attr("width"))).attr("height", parseInt(s.select("#drawArrow").attr("height"))), a = u.append("defs"), f = a.append("marker").attr("id", "arrow").attr("markerUnits", "strokeWidth").attr("markerWidth", "12").attr("markerHeight", "12").attr("viewBox", "0 0 12 12").attr("refX", "6").attr("refY", "6").attr("orient", "auto"), l = "M2,2 L10,6 L2,10 L6,6 L2,2";
    f.append("path").attr("d", l).attr("fill", "#000"), t.
register("umi", {
        type: "UMI",
        pointLine: "",
        extendProperties: function() {
            return {
                hashPath: n.observable("/home"),
                modulePath: n.observable("home/index.html"),
                parentModule: n.observable(""),
                moduleJS: n.observable(""),
                moduleHTML: n.observable("")
            };
        },
        extendUIConfig: function() {
            return {
                hashPath: {
                    label: "HASH\u8def\u5f84",
                    ui: "textfield",
                    text: this.properties.hashPath
                },
                modulePath: {
                    label: "\u6a21\u677f\u8def\u5f84",
                    ui: "textfield",
                    text: this.properties.modulePath
                },
                parentModule: {
                    label: "\u7236\u6a21\u5757ID",
                    ui: "textfield",
                    text: this.properties.parentModule
                
}
            };
        },
        onCreate: function(e) {
            var t = $("<span style='line-height:normal;display:inline-block;width:100%;color:#fff;font-size:12px;'></span>"), a = this;
            e.find("a").length ? $(e.find("a")[0]).append(t) : e.append(t), a.properties.boxFontSize(0), e.css("background-color") || e.css("background-color", o[parseInt(o.length * Math.random())]), a.properties.left(400 + parseInt(100 * Math.random())), a.properties.top(80 + parseInt(400 * Math.random())), n.computed(function() {
                var e = a.properties.hashPath(), n = a.properties.modulePath();
                t.html("<br/>" + e + "<br/><br/>" + (a.properties.titleStr() || "\u6a21\u5757\u8def\u5f84") + "\uff1a<br/>" + n);
            }), n.computed(function() {
                u.attr("width") != parseInt(s.select("#drawArrow").attr("width")) && u.attr("width", parseInt(s.select("#drawArrow").attr("width"))), u.attr("height") != parseInt(s.select("#drawArrow").attr("height")) && 
u.attr("height", parseInt(s.select("#drawArrow").attr("height")));
                var e = a.properties.parentModule();
                if (e) {
                    var t = r.find(i.elements(), function(t) {
                        return t.properties.id() == e;
                    });
                    if (t) {
                        var n = +t.properties.left() + parseInt(t.properties.width()), o = +t.properties.top() + parseInt(t.properties.height() / 2), f = +a.properties.left() - 5, l = +a.properties.top() + parseInt(a.properties.height() / 2);
                        a.pointLine && a.pointLine.remove(), $("line[x1=" + n + "][y1=" + o + "][x2=" + f + "][y2=" + l + "]").remove(), a.pointLine = u.append("line").attr("x1", n).attr("y1", o).attr("x2", f).attr("y2", l).attr("stroke", "red").attr("stroke-width", 2).attr("marker-end", "url(#arrow)");
                    } else a.pointLine && a.pointLine.remove();
                } else a.pointLine && a.pointLine.remove();
            }
);
        },
        beforeRemove: function() {
            this.pointLine.remove();
        }
    });
}), define("text!modules/component/component.xml", [], function() {
    return '<container id="Component">\r\n    <list id="ElementsList" dataSource="@binding[componentsList]" itemView="@binding[ElementView]" onselect="@binding[_selectComponents]"></list>\r\n</container>';
}), define("text!modules/template/template.xml", [], function() {
    return '<container id="Template">\r\n    <list id="TemplateList" dataSource="@binding[templatesList]" itemView="@binding[ElementView]" onselect="@binding[_selectPages]"></list>\r\n</container>\r\n';
}), define("modules/common/codeArea", [ "require", "qpf", "knockout", "_" ], function(e) {
    var t = e("qpf"), n = t.use("meta/meta"), r = e("knockout"), i = e("_"), s = n.derive(function() {
        return {
            tag: "div",
            text: r.observable(""),
            mod: r.observable(""),
            placeholder: r.observable("")
        
};
    }, {
        type: "CODEAREA",
        css: "codearea",
        template: '<textarea rows="5" cols="24" data-bind="value:text"/>',
        onResize: function() {
            this.$el.find("textarea").width(this.width()), n.prototype.onResize.call(this);
            var e = this;
            this.$el.parent().parent().css("margin-left", "0"), this.$el.parent().parent().css("margin-right", "0"), this.$el.parent().parent().css("margin-top", "20px"), this.$el.css("width", "100%");
            var t = this._cm = CodeMirror.fromTextArea(this.$el.find("textarea")[0], {
                lineNumbers: !1,
                styleActiveLine: !0,
                lineWrapping: !0,
                mode: e.mod() || "css",
                autofocus: !0,
                indentUnit: 4,
                tabSize: 4
            });
            t.setOption("theme", "monokai"), t.doc.setCursor(t.doc.lastLine() + 1), e.text(e.text() + ""), t.on("keyup", function(t, n) {
                e.text(t.doc.getValue(
));
            });
        }
    });
    return n.provideBinding("codearea", s), s;
}), define("text!modules/template/element.html", [], function() {
    return '<div data-bind="text:id"></div>\r\n<div class="qpf-page-desc" data-bind="text:desc"></div>\r\n';
}), define("modules/template/element", [ "require", "qpf", "knockout", "text!./element.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.meta.Meta.derive(function() {
        return {
            id: n.observable(""),
            desc: n.observable(""),
            target: n.observable()
        };
    }, {
        type: "ELEMENT",
        css: "element",
        template: e("text!./element.html")
    });
    return r;
}), define("modules/template/index", [ "require", "qpf", "knockout", "core/factory", "core/command", "../module", "text!./template.xml", "_", "modules/common/contextmenu", "modules/common/modal", "modules/common/codeArea", "./element" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e
("core/factory"), i = e("core/command"), s = e("../module"), o = e("text!./template.xml"), u = e("_"), a = e("modules/common/contextmenu"), f = e("modules/common/modal"), l = e("modules/common/codeArea"), c = t.use("meta/textfield"), h = t.use("container/vbox"), p = t.use("container/container"), d = t.use("container/inline"), v = t.use("meta/label"), m = e("./element"), g = "", y = "", b = new s({
        name: "template",
        xml: o,
        templatesList: n.observableArray([]),
        selectedPages: n.observableArray([]),
        ElementView: m,
        _selectPages: function(e) {
            b.selectedPages(u.map(e, function(e) {
                return e.target;
            }));
        },
        load: function(e) {
            var t = b.templatesList();
            u.map(e, function(e) {
                var n = u.find(g.split("_"), function(t) {
                    return t == e.name;
                });
                n ? u.each(t, function(t) {
                    if (t.id == 
e.name) return t.target = e, !1;
                }) : (t.push({
                    id: e.name,
                    desc: "-" + e.desc,
                    target: e
                }), g += e.name + "_");
            }), this.templatesList(t);
        },
        getTarget: function(e) {
            var t = b.templatesList(), n = {};
            return u.each(t, function(t, r) {
                if (t.id == e) {
                    n = t.target;
                    return;
                }
            }), n;
        }
    });
    return b.templates = function() {
        return u.map(b.templatesList(), function(e) {
            return e.target;
        });
    }, b.savePool = function() {
        if (y) {
            var e = y.substring(y.lastIndexOf("/") + 1, y.indexOf("cmpp") - 1);
            $.post("/api/" + e, {
                ext: '{"name":"' + e + '", "url":"' + y + '"}',
                cmpData: JSON.stringify(b.templates())
            }, function(e) {
                f.confirm
("\u63d0\u793a", e.message || "\u64cd\u4f5c\u6210\u529f", null, null, 1e3);
            });
        } else {
            var t = new c({
                attributes: {
                    text: "/.cmp/index.cmpt"
                }
            });
            f.popup("\u8bf7\u8f93\u5165\u6a21\u677f\u5730\u5740\uff1a", t, function() {
                if (t.text()) {
                    y = t.text();
                    var e = y.substring(y.lastIndexOf("/"), y.indexOf("cmpp") - 1);
                    $.post("/api/" + e, {
                        ext: '{"name":"' + e + '", "url":"' + y + '"}',
                        cmpData: JSON.stringify(b.templates(), null, 2)
                    }, function(e) {
                        f.confirm("\u63d0\u793a", e.message || "\u64cd\u4f5c\u6210\u529f", null, null, 1e3);
                    });
                }
            });
        }
    }, b.on("start", function() {
        $.ajax({
            url: "/.cmp/index.cmpt",
            success: function(
e) {
                b.load(JSON.parse(e));
            },
            error: function(e) {
                $.get("/cmpApp/.cmp/index.cmpt", function(e) {
                    b.load(JSON.parse(e));
                });
            }
        }), a.bindTo(b.mainComponent.$el, function(e) {
            var t = $(e).parents(".qpf-ui-element");
            return t.length ? [ {
                label: "\u7f16\u8f91",
                exec: function() {
                    var e = t.qpf("get")[0].attributes.target, n = e.name, r = new d, i = new l({
                        attributes: {
                            mod: "javascript"
                        }
                    });
                    f.popup("\u8bf7\u8f93\u5165\u76f8\u5173\u5185\u5bb9", r, function() {
                        var e = JSON.parse(i.text());
                        b.load([ e ]);
                    }), r.$el.append(i.$el), i.$el.html('<textarea rows="5" cols="24">' + JSON.stringify(e).replace(/\,/g, ",\n") + "</textarea>"
), i.onResize(), i.$el.width("500px"), i.$el.parent().parent().css("margin-top", 0);
                }
            }, {
                label: "\u5220\u9664",
                exec: function() {}
            } ] : [ {
                label: "\u65b0\u5efa",
                exec: function() {
                    var e = new d, t = new l({
                        attributes: {
                            mod: "javascript"
                        }
                    });
                    f.popup("\u8bf7\u8f93\u5165\u76f8\u5173\u5185\u5bb9", e, function() {
                        var e = JSON.parse(t.text());
                        b.load([ e ]);
                    }), e.$el.append(t.$el), t.$el.html('<textarea rows="5" cols="24">{\n"name": "ftl-mooc",\n"desc": "\u4e2dM - FTL\u6a21\u677f",\n"misc": "templates\u4e2d\u5305\u542bname\u5b57\u6bb5\u7684\u5185\u5bb9\u4f1a\u4fdd\u7559\u5728\u6570\u636e\u6a21\u578b\u7684meta\u5b57\u6bb5\u4e2d\uff0c\u53ef\u4ee5\u4ece\u6587\u4ef6\u540c\u6b65\u5230\u6a21\u578b\u4e2d",\n"templates": [],\n"cache": {\n"cacheItem": "/.cmp/tpl/cache-mooc/ui.js"\n}}</textarea>'
), t.onResize(), t.$el.width("500px"), t.$el.parent().parent().css("margin-top", 0);
                }
            }, {
                label: "\u52a0\u8f7d\u6a21\u677f",
                exec: function() {
                    var e = new c({
                        attributes: {
                            text: y || "/.cmp/index.cmpt"
                        }
                    }), t = f.popup("\u8bf7\u8f93\u5165\u6a21\u677f\u5730\u5740\uff1a", e, function() {
                        if (e.text()) {
                            var t = e.text();
                            $.get(t, function(e) {
                                b.load(JSON.parse(e));
                            });
                        }
                    });
                    e.onEnterKey = function() {
                        e.$el.blur(), t.wind.applyButton.trigger("click");
                    };
                }
            }, {
                label: "\u5bfc\u51fa\u6a21\u677f\u96c6",
                exec: 
function() {
                    var e = new c({
                        attributes: {
                            placeholder: "\u6a21\u677f\u96c6\u540d\u79f0"
                        }
                    });
                    f.popup("\u8bf7\u8f93\u5165\u6a21\u677f\u96c6\u540d\u79f0\uff1a", e, function() {
                        if (e.text()) {
                            var t = new Blob([ JSON.stringify(b.templates(), null, 2) ], {
                                type: "text/plain;charset=utf-8"
                            });
                            saveAs(t, e.text() + ".cmpt");
                        }
                    });
                }
            }, {
                label: "\u4fdd\u5b58\u6a21\u677f\u96c6",
                exec: function() {
                    b.savePool();
                }
            } ];
        });
    }), b;
}), define("text!modules/pool/page.xml", [], function() {
    return '<container id="Pool">\r\n    <list id="PoolList" dataSource="@binding[pagesList]" itemView="@binding[ElementView]" onselect="@binding[_selectPages]"></list>\r\n</container>\r\n'
;
}), define("text!modules/pool/element.html", [], function() {
    return '<div data-bind="text:id"></div>\r\n<div class="qpf-page-desc" data-bind="text:desc"></div>\r\n<img class="qpf-page-img" data-bind="attr: { src: img}; if: img">\r\n';
}), define("modules/pool/element", [ "require", "qpf", "knockout", "text!./element.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.meta.Meta.derive(function() {
        return {
            id: n.observable(""),
            desc: n.observable(""),
            img: n.observable(""),
            target: n.observable()
        };
    }, {
        type: "ELEMENT",
        css: "element",
        template: e("text!./element.html")
    });
    return r;
}), define("modules/pool/index", [ "require", "qpf", "knockout", "core/factory", "core/command", "../module", "text!./page.xml", "_", "modules/common/contextmenu", "modules/common/modal", "./element" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("core/factory"), i = 
e("core/command"), s = e("../module"), o = e("text!./page.xml"), u = e("_"), a = e("modules/common/contextmenu"), f = e("modules/common/modal"), l = t.use("meta/textfield"), c = t.use("container/vbox"), h = t.use("container/container"), p = t.use("container/inline"), d = t.use("meta/label"), v = e("./element"), m = "", g = "", y = new s({
        name: "page",
        xml: o,
        pagesList: n.observableArray([]),
        selectedPages: n.observableArray([]),
        ElementView: v,
        _selectPages: function(e) {
            y.selectedPages(u.map(e, function(e) {
                return e.target;
            }));
        },
        load: function(e) {
            var t = y.pagesList();
            u.map(e, function(e) {
                var n = u.find(m.split("_"), function(t) {
                    return t == e.name;
                });
                n ? f.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u6c60\u5df2\u5b58\u5728\u7ec4\u4ef6" + e.name + ", \u70b9\u51fb\u786e\u5b9a\u66ff\u6362\u4e3a\u65b0\u7684\u7ec4\u4ef6"
, function() {
                    u.each(t, function(t) {
                        if (t.id == e.name) return t.img = e.img, t.desc = "-" + e.desc, t.target = e, !1;
                    });
                }, null) : (t.push({
                    id: e.name,
                    img: e.img,
                    desc: "-" + e.desc,
                    target: e
                }), m += e.name + "_");
            }), this.pagesList(t);
        },
        getTarget: function(e) {
            var t = y.pagesList(), n = {};
            return u.each(t, function(t, r) {
                if (t.id == e) {
                    n = t.target;
                    return;
                }
            }), n;
        }
    });
    return y.pages = function() {
        return u.map(y.pagesList(), function(e) {
            return e.target;
        });
    }, y.savePool = function() {
        if (g) {
            var e = g.substring(g.lastIndexOf("/") + 1, g.indexOf("cmpp") - 1);
            $.post("/api/" + 
e, {
                ext: '{"name":"' + e + '", "url":"' + g + '"}',
                cmpData: JSON.stringify(y.pages())
            }, function(e) {
                f.confirm("\u63d0\u793a", e.message || "\u64cd\u4f5c\u6210\u529f", null, null, 1e3);
            });
        } else {
            var t = new l({
                attributes: {
                    text: "/.cmp/index.cmpl"
                }
            });
            f.popup("\u8bf7\u8f93\u5165\u7ec4\u4ef6\u6c60\u5730\u5740\uff1a", t, function() {
                if (t.text()) {
                    g = t.text();
                    var e = g.substring(g.lastIndexOf("/"), g.indexOf("cmpp") - 1);
                    $.post("/api/" + e, {
                        ext: '{"name":"' + e + '", "url":"' + g + '"}',
                        cmpData: JSON.stringify(y.pages(), null, 2)
                    }, function(e) {
                        f.confirm("\u63d0\u793a", e.message || "\u64cd\u4f5c\u6210\u529f", null, null, 1e3);
                    
});
                }
            });
        }
    }, y.on("start", function() {
        a.bindTo(y.mainComponent.$el, function(e) {
            var t = $(e).parents(".qpf-ui-element");
            return t.length ? [ {
                label: "\u52a0\u8f7d\u9009\u4e2d\u7ec4\u4ef6",
                exec: function() {
                    var e = y.selectedPages(), t = e[e.length - 1];
                    t && y.trigger("loadPoolItem", t.url);
                }
            }, {
                label: "\u5206\u4eab\u7ec4\u4ef6",
                exec: function() {
                    var e = y.selectedPages(), t = e[e.length - 1], n = new l({
                        attributes: {
                            text: t.url
                        }
                    });
                    f.popup("\u590d\u5236\u5206\u4eab\u7ec4\u4ef6\u5730\u5740\uff1a", n, function() {});
                }
            }, {
                label: "\u7f16\u8f91",
                exec: function() {
                    
var e = t.qpf("get")[0].attributes.target, n = e.name, r = new h, i = new p, s = new p, o = new p, u = new p;
                    u.add(new d({
                        attributes: {
                            text: "\u7ec4\u4ef6\u540d\u79f0\uff1a"
                        }
                    }));
                    var a = new l({
                        attributes: {
                            text: e.name,
                            placeholder: "\u7ec4\u4ef6\u540d\u79f0"
                        }
                    });
                    u.add(a), i.add(new d({
                        attributes: {
                            text: "\u7ec4\u4ef6\u63cf\u8ff0\uff1a"
                        }
                    }));
                    var c = new l({
                        attributes: {
                            text: e.desc,
                            placeholder: "\u7ec4\u4ef6\u63cf\u8ff0"
                        }
                    });
                    i.add(c), s.add
(new d({
                        attributes: {
                            text: "\u7f29\u7565\u56fe\u7247\uff1a"
                        }
                    }));
                    var v = new l({
                        attributes: {
                            text: e.img,
                            placeholder: "\u7f29\u7565\u56fe\u7247"
                        }
                    });
                    s.add(v), o.add(new d({
                        attributes: {
                            text: "\u7ec4\u4ef6\u5730\u5740\uff1a"
                        }
                    }));
                    var m = new l({
                        attributes: {
                            text: e.url,
                            placeholder: "\u7ec4\u4ef6\u5730\u5740"
                        }
                    });
                    o.add(m), r.add(u), r.add(i), r.add(s), r.add(o), f.popup("\u8bf7\u8f93\u5165\u76f8\u5173\u5185\u5bb9", r, function() {
                        var e = 
{
                            name: a.text(),
                            desc: c.text(),
                            img: v.text() || "/cmpApp/static/style/images/logo.jpg",
                            url: m.text(),
                            postUrl: "/api/" + n
                        };
                        y.load([ e ]);
                    });
                }
            }, {
                label: "\u5220\u9664",
                exec: function() {
                    var e = y.selectedPages(), t = e[e.length - 1];
                    y.pagesList.remove(function(e) {
                        return e.id == t.name;
                    });
                }
            } ] : [ {
                label: "\u6dfb\u52a0\u7f51\u7edc\u7ec4\u4ef6",
                exec: function() {
                    var e = new h, t = new p, n = new p, r = new p, i = new p;
                    i.add(new d({
                        attributes: {
                            text: "\u7ec4\u4ef6\u540d\u79f0\uff1a"
                        
}
                    }));
                    var s = new l({
                        attributes: {
                            placeholder: "\u7ec4\u4ef6\u540d\u79f0"
                        }
                    });
                    i.add(s), t.add(new d({
                        attributes: {
                            text: "\u7ec4\u4ef6\u63cf\u8ff0\uff1a"
                        }
                    }));
                    var o = new l({
                        attributes: {
                            placeholder: "\u7ec4\u4ef6\u63cf\u8ff0"
                        }
                    });
                    t.add(o), n.add(new d({
                        attributes: {
                            text: "\u7f29\u7565\u56fe\u7247\uff1a"
                        }
                    }));
                    var u = new l({
                        attributes: {
                            placeholder: "\u7f29\u7565\u56fe\u7247"
                        }
                    })
;
                    n.add(u), r.add(new d({
                        attributes: {
                            text: "\u7ec4\u4ef6\u5730\u5740\uff1a"
                        }
                    }));
                    var a = new l({
                        attributes: {
                            placeholder: "\u7ec4\u4ef6\u5730\u5740"
                        }
                    });
                    r.add(a), e.add(i), e.add(t), e.add(n), e.add(r), f.popup("\u8bf7\u8f93\u5165\u76f8\u5173\u5185\u5bb9", e, function() {
                        var e = {
                            name: s.text(),
                            desc: o.text(),
                            img: u.text() || "/cmpApp/static/style/images/logo.jpg",
                            url: a.text(),
                            postUrl: "/api/" + s.text()
                        };
                        y.load([ e ]);
                    });
                }
            }, {
                label: "\u52a0\u8f7d\u672c\u5730\u7ec4\u4ef6\u6c60"
,
                exec: function() {
                    y.trigger("importPool");
                }
            }, {
                label: "\u52a0\u8f7d\u8fdc\u7a0b\u7ec4\u4ef6\u6c60",
                exec: function() {
                    var e = new l({
                        attributes: {
                            text: g || "/.cmp/index.cmpl"
                        }
                    }), t = f.popup("\u8bf7\u8f93\u5165\u8fdc\u7a0b\u7ec4\u4ef6\u6c60\u5730\u5740\uff1a", e, function() {
                        e.text() && (g = e.text(), y.trigger("importPoolFromUrl", e.text()));
                    });
                    e.onEnterKey = function() {
                        e.$el.blur(), t.wind.applyButton.trigger("click");
                    };
                }
            }, {
                label: "\u5bfc\u51fa\u7ec4\u4ef6\u6c60",
                exec: function() {
                    var e = new l({
                        attributes: {
                            placeholder
: "\u7ec4\u4ef6\u6c60\u540d\u79f0"
                        }
                    });
                    f.popup("\u8bf7\u8f93\u5165\u7ec4\u4ef6\u6c60\u540d\u79f0\uff1a", e, function() {
                        if (e.text()) {
                            var t = new Blob([ JSON.stringify(y.pages(), null, 2) ], {
                                type: "text/plain;charset=utf-8"
                            });
                            saveAs(t, e.text() + ".cmpl");
                        }
                    });
                }
            }, {
                label: "\u5206\u4eab\u7ec4\u4ef6\u6c60",
                exec: function() {
                    var e = new l({
                        attributes: {
                            text: location.origin + g
                        }
                    });
                    f.popup("\u590d\u5236\u5206\u4eab\u7ec4\u4ef6\u6c60\u5730\u5740\uff1a", e, function() {});
                }
            }, {
                label: "\u4fdd\u5b58\u7ec4\u4ef6\u6c60"
,
                exec: function() {
                    y.savePool();
                }
            } ];
        });
    }), y;
}), define("text!modules/component/component.html", [], function() {
    return '<div data-bind="text:id"></div>';
}), define("modules/component/component", [ "require", "qpf", "knockout", "text!./component.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.meta.Meta.derive(function() {
        return {
            id: n.observable(""),
            target: n.observable()
        };
    }, {
        type: "ELEMENT",
        css: "element",
        template: e("text!./component.html")
    });
    return r;
}), define("modules/component/index", [ "require", "qpf", "knockout", "core/factory", "core/command", "../module", "text!./component.xml", "_", "../property/index", "modules/common/contextmenu", "../hierarchy/index", "../template/index", "../pool/index", "modules/common/modal", "./component" ], function(e) {
    var t = e("qpf"), n = e("knockout"
), r = e("core/factory"), i = e("core/command"), s = e("../module"), o = e("text!./component.xml"), u = e("_"), a = e("../property/index"), f = e("modules/common/contextmenu"), l = e("../hierarchy/index"), c = e("../template/index"), h = e("../pool/index"), p = e("modules/common/modal"), d = t.use("meta/textfield"), v = e("./component"), m = "", g = new s({
        name: "component",
        xml: o,
        componentsList: n.observableArray([]),
        selectedComponents: n.observableArray([]),
        ElementView: v,
        _selectComponents: function(e) {
            g.handleSelect(e);
        },
        handleSelect: function(e) {
            g.selectedComponents(u.map(e, function(e) {
                return e.target;
            }));
            var t = g.selectedComponents(), n = t[t.length - 1];
            n && (l.removeAll(), g.trigger("selectComponent", n), n.viewport.backColor && g.trigger("changeBackColor", n.viewport.backColor));
        },
        load: function(e) {
            
var t = g.componentsList(), n = g.selectedComponents(), r = n[n.length - 1];
            u.map(e, function(e) {
                var n = u.find(m.split("_"), function(t) {
                    return t == e.meta.name;
                });
                n ? (u.each(t, function(t) {
                    t.id == e.meta.name && (t.target = e);
                }), r && e.meta && r.meta.name == e.meta.name && g.selectedComponents([ e ])) : (t.push({
                    id: e.meta.name,
                    target: e
                }), m += e.meta.name + "_");
            }), this.componentsList(t);
        },
        getTarget: function(e) {
            var t = g.componentsList(), n = {};
            return u.each(t, function(t, r) {
                if (t.id == e) {
                    n = t.target;
                    return;
                }
            }), n;
        },
        clearComponents: function() {
            m = "", g.componentsList([]);
        }
    });
    g.components = function(
) {
        return u.map(g.componentsList(), function(e) {
            return e.target;
        });
    }, g.on("start", function() {
        g.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function(e) {}), f.bindTo(g.mainComponent.$el, function(e) {
            var t = $(e).parents(".qpf-ui-element"), n = [];
            if (!t.length) return [ {
                label: "\u7c98\u8d34",
                exec: function() {
                    i.execute("pasteComponent");
                }
            }, {
                label: "\u65b0\u5efamodule",
                exec: function() {
                    g.trigger("newModule");
                }
            }, {
                label: "\u65b0\u5efaunit",
                exec: function() {
                    g.trigger("newUnit");
                }
            }, {
                label: "\u5bfc\u5165\u7ec4\u4ef6",
                exec: function() {
                    g.trigger("importProject");
                }
            }, 
{
                label: "\u5bfc\u5165\u7f51\u7edc\u7ec4\u4ef6",
                exec: function() {
                    var e = new d({
                        attributes: {
                            text: "",
                            placeholder: "\u8fdc\u7a0b\u7ec4\u4ef6\u5730\u5740"
                        }
                    }), t = p.popup("\u8bf7\u8f93\u5165\u8fdc\u7a0b\u7ec4\u4ef6\u5730\u5740\uff1a", e, function() {
                        if (e.text()) {
                            g.trigger("importProjectFromUrl", e.text());
                            var t = e.text();
                            if (t.indexOf("//") >= 0) {
                                var n = t.substring(t.lastIndexOf("/") + 1, t.lastIndexOf("."));
                                h.load([ {
                                    name: n,
                                    desc: n,
                                    img: "/cmpApp/static/style/images/logo.jpg",
                                    url: 
t,
                                    postUrl: "/api/" + n
                                } ]);
                            }
                        }
                    });
                    e.onEnterKey = function() {
                        e.$el.blur(), t.wind.applyButton.trigger("click");
                    };
                }
            }, {
                label: "\u6e05\u7a7a\u5217\u8868",
                exec: function() {
                    g.clearComponents(), l.removeAll();
                }
            } ];
            if (t[0].id == g.selectedComponents()[0].meta.name) {
                var r = c.templates();
                return n = [ {
                    label: "\u590d\u5236",
                    exec: function() {
                        i.execute("copyComponent", t.qpf("get")[0].target());
                    }
                }, {
                    label: "\u4fdd\u5b58\u5230\u7ec4\u4ef6\u6c60",
                    exec: function() {
                        
g.trigger("save2pool", t.qpf("get")[0].target());
                        var e = $(t[0]);
                        e.css("color", "#ffeb3b"), $(".mainContent").click(function() {
                            e.css("color", "");
                        }), $(".tabContent").click(function() {
                            e.css("color", "");
                        }), $(".propContent").click(function() {
                            e.css("color", "");
                        });
                    }
                }, {
                    label: "\u751f\u6210HTML",
                    exec: function() {
                        g.trigger("saveHTML");
                    }
                } ], $.each(r, function(e, t) {
                    var r = u.find(t.templates, function(e) {
                        return !!e.name;
                    });
                    n.push({
                        label: t.name + " \u5bfc\u51fa",
                        exec: function() {
                            
r ? p.confirm("\u63d0\u793a", "\u662f\u5426\u66ff\u6362\u6a21\u578b\u6570\u636e?", function() {
                                g.trigger("saveCommon", t, !0);
                            }, function() {
                                g.trigger("saveCommon", t, !1);
                            }) : g.trigger("saveCommon", t, !0);
                        }
                    }), r && (n.push({
                        label: t.name + " \u540c\u6b65\u4ee3\u7801\u5230\u6a21\u578b",
                        exec: function() {
                            g.trigger("syncCode", t);
                        }
                    }), n.push({
                        label: t.name + " \u7f16\u8f91\u4ee3\u7801",
                        exec: function() {
                            g.trigger("editorJS", t);
                        }
                    }));
                }), n.concat([ {
                    label: "\u8fdb\u5165BASH\u63a7\u5236\u53f0",
                    exec: function() {
                        
g.trigger("enterShell", t.qpf("get")[0].target());
                    }
                } ]);
            }
        });
    });
    var y = [];
    return i.register("copyComponent", {
        execute: function(e) {
            y = [ e ];
        }
    }), i.register("pasteComponent", {
        execute: function() {
            var e = [];
            u.each(y, function(t) {
                var n = t.meta.name, r = JSON.parse(JSON.stringify(t).replace(n + "-container", n + "_copied" + "-container"));
                r.meta.name += "_copied", e.push(r);
            }), g.load(e);
        },
        unexecute: function() {}
    }), g;
}), define("text!modules/codeEditor/property.html", [], function() {
    return '<panel data-bind="attr: { title: titleStr}">\r\n    <textarea data-bind="attr: { class: classStr},text:codeStr"></textarea>\r\n</panel>\r\n<div class="editor-toolbar">\r\n    <button class="editor-close">\u786e\u8ba4\u4fee\u6539</button>\r\n    <button class="editor-cancel"> \u53d6\u6d88(alt+c) </button>\r\n</div>\r\n'
;
}), define("modules/codeEditor/property", [ "require", "qpf", "knockout", "text!./property.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.use("container/container"), i = t.widget.Widget, s = i.derive(function() {
        return {
            codeStr: n.observable(""),
            classStr: n.observable(""),
            titleStr: n.observable("")
        };
    }, {
        type: "CODEVIEW",
        css: "codeview",
        template: e("text!./property.html")
    });
    return r.provideBinding("codeview", s), s;
}), define("text!modules/codeEditor/property.xml", [], function() {
    return '<listtab itemView="@binding[CodeItemView]" dataSource="@binding[codeArray]"></listtab> \r\n\r\n';
}), define("modules/codeEditor/index", [ "require", "qpf", "knockout", "../module", "_", "modules/component/index", "./property", "text!./property.xml", "modules/common/modal" ], function(e) {
    function p(e, t) {
        var n = e.getCursor();
        return (!t || t()) && setTimeout
(function() {
            e.state.completionActive || e.showHint({
                completeSingle: !1
            });
        }, 100), CodeMirror.Pass;
    }
    function d(e) {
        return p(e, function() {
            var t = e.getCursor();
            return e.getRange(CodeMirror.Pos(t.line, t.ch - 1), t) == "<";
        });
    }
    function v(e) {
        return p(e, function() {
            var t = e.getTokenAt(e.getCursor());
            if (t.type != "string" || !!/['"]/.test(t.string.charAt(t.string.length - 1)) && t.string.length != 1) {
                var n = CodeMirror.innerMode(e.getMode(), t.state).state;
                return n.tagName;
            }
            return !1;
        });
    }
    var t = e("qpf"), n = e("knockout"), r = e("../module"), i = e("_"), s = t.use("container/panel"), o = e("modules/component/index"), u = e("./property"), a = [], f = e("text!./property.xml"), l = e("modules/common/modal"), c = {
        attrs: {
            color: [ "red", "green"
, "blue", "purple", "white", "black", "yellow" ],
            size: [ "large", "medium", "small" ],
            description: null
        },
        children: []
    }, h = {
        "!top": [ "top" ],
        "!attrs": {
            id: null,
            "class": [ "A", "B", "C" ]
        },
        top: {
            attrs: {
                lang: [ "en", "de", "fr", "nl" ],
                freeform: null
            },
            children: [ "animal", "plant" ]
        },
        animal: {
            attrs: {
                name: null,
                isduck: [ "yes", "no" ]
            },
            children: [ "wings", "feet", "body", "head", "tail" ]
        },
        plant: {
            attrs: {
                name: null
            },
            children: [ "leaves", "stem", "flowers" ]
        },
        wings: c,
        feet: c,
        body: c,
        head: c,
        tail: c,
        leaves: c,
        stem: c,
        flowers: c
    }, m = new r({
        name: "property"
,
        xml: f,
        CodeItemView: u,
        codeArray: n.observableArray([]),
        showCode: function(e, t) {
            if (e.length < 1) {
                l.confirm("\u63d0\u793a", "\u6ca1\u6709\u4ee3\u7801\u54e6\uff01", null, null, 1e3);
                return;
            }
            var n = this;
            a = [], n.codeArray([]), i.each(e, function(e) {
                n.codeArray.push({
                    titleStr: e.titleStr,
                    classStr: e.classStr,
                    codeStr: e.codeStr
                });
                var t = CodeMirror.fromTextArea($("#editor ." + e.classStr)[0], {
                    lineNumbers: !0,
                    styleActiveLine: !0,
                    autoCloseBrackets: !0,
                    autoCloseTags: !0,
                    highlightSelectionMatches: {
                        showToken: /\w/,
                        annotateScrollbar: !0
                    },
                    matchTags: {
                        
bothTags: !0
                    },
                    mode: /^.*(FTL)|(HTML).*$/.test(e.classStr) ? "htmlmixed" : "javascript",
                    tabSize: 4,
                    indentUnit: 4,
                    keyMap: "sublime",
                    gutters: [ "CodeMirror-lint-markers" ],
                    lint: !0,
                    autofocus: !0
                });
                t.setOption("theme", "monokai"), setTimeout(function() {
                    t.refresh();
                }, 100), a.push(t);
            });
            var r = $("#editor .qpf-tab-header>.qpf-tab-tabs>li");
            setTimeout(function() {
                $(r[r.length - 1]).trigger("click"), $(r[0]).trigger("click");
            }, 300), $("#editor").slideDown(), $(".switchDesign").hide();
            var n = this;
            $("#editor .editor-close").click(function() {
                if ($("#editor").is(":visible")) {
                    $("#editor").hide();
                    var e = n.codeArray
();
                    i.each(a, function(t, n) {
                        e[n].codeStr = t.doc.getValue();
                    }), t(e);
                }
            }), $("#editor .editor-cancel").click(function() {
                $("#editor").is(":visible") && $("#editor").slideUp();
            });
        }
    });
    return m;
}), define("modules/common/buttongroup", [ "require", "qpf", "knockout", "_" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("_"), i = t.container.Inline.derive(function() {
        return {
            action: n.observable("button")
        };
    }, {
        type: "BUTTONGROUP",
        css: "button-group"
    });
    return t.Base.provideBinding("buttongroup", i), i;
}), define("modules/common/palette", [ "require", "qpf", "knockout" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = new t.widget.Palette;
    r.width(370);
    var i = new t.container.Window({
        left: n.observable(300),
        top: n.observable(100)
    
});
    return i.$el.hide(), i.title("\u8c03\u8272\u5668"), i.id("Palette"), i.add(r), document.body.appendChild(i.$el[0]), i.render(), r.show = function() {
        i.$el.show();
    }, r.hide = function() {
        i.$el.hide();
    }, r;
}), define("modules/common/color", [ "require", "qpf", "knockout", "onecolor", "./palette" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.meta.Meta, i = e("onecolor"), s = e("./palette"), o = r.derive(function() {
        var e = {
            color: n.observable(16777215),
            alpha: n.observable(1)
        };
        return e._colorStr = n.computed(function() {
            return i(e.color()).hex();
        }), e;
    }, {
        type: "COLOR",
        css: "color",
        template: '<div data-bind="text:_colorStr" class="qpf-color-hex"></div>                    <div class="qpf-color-preview" data-bind="style:{backgroundColor:_colorStr()}"></div>                    <div data-bind="text:alpha" class="qpf-color-hex"></div>'
,
        initialize: function() {
            var e = this;
            this.$el.click(function() {
                e.showPalette();
            });
        },
        showPalette: function() {
            s.show(), s.on("change", this._paletteChange, this), s.on("cancel", this._paletteCancel, this), s.on("apply", this._paletteApply, this), s.set(this.color()), s.alpha(this.alpha());
        },
        _paletteChange: function(e) {
            this.color(e);
        },
        _paletteCancel: function() {
            s.hide(), s.off("change"), s.off("apply"), s.off("cancel");
        },
        _paletteApply: function(e, t) {
            this.color(e), this.alpha(t), this._paletteCancel();
        }
    });
    return r.provideBinding("color", o), o;
}), define("modules/common/gradient", [ "require", "qpf", "knockout", "$", "_", "onecolor", "./palette" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("$"), i = e("_"), s = e("onecolor"), o = e("./palette"), u = t.widget.Widget
.derive(function() {
        return {
            stops: n.observableArray([]),
            angle: n.observable(180),
            _percentString: function(e) {
                return Math.floor(n.utils.unwrapObservable(e) * 100) + "%";
            }
        };
    }, {
        type: "GRADIENT",
        css: "gradient",
        template: '<div class="qpf-gradient-preview"></div>                    <div class="qpf-gradient-stops" data-bind="foreach:{data : stops, afterRender : _onAddStop.bind($data)}">                        <div class="qpf-gradient-stop" data-bind="style:{left:$parent._percentString(percent)}">                            <div class="qpf-gradient-stop-inner"></div>                        </div>                    </div>                    <div class="qpf-gradient-angle></div>',
        initialize: function() {
            var e = this;
            this.stops.subscribe(function(t) {
                e._updateGradientPreview();
            });
        },
        afterRender: 
function() {
            this._$gradientPreview = this.$el.find(".qpf-gradient-preview"), this._$stopsContainer = this.$el.find(".qpf-gradient-stops"), this._updateGradientPreview();
            var e = this, t = this.stops();
            this.$el.find(".qpf-gradient-stop").each(function(n) {
                e._onAddStop(this, t[n]);
            });
        },
        _updateGradientPreview: function() {
            var e = "linear-gradient(90deg, " + i.map(this.stops(), function(e) {
                return s(n.utils.unwrapObservable(e.color)).cssa() + " " + Math.floor(n.utils.unwrapObservable(e.percent) * 100) + "%";
            }).join(", ") + ")";
            this._$gradientPreview.css({
                "background-image": "-webkit-" + e,
                "background-image": "-moz-" + e,
                "background-image": e
            });
        },
        _onAddStop: function(e, n) {
            var i = this, s = new t.helper.Draggable({
                axis: "x",
                
container: this.$el.find(".qpf-gradient-stops")
            });
            s.add(e), s.on("drag", function(t) {
                this._dragHandler(e, n);
            }, this), r(e).on("dblclick", function() {
                i._editColor(n);
            });
        },
        _dragHandler: function(e, t) {
            var i = r(e), s = parseInt(i.css("left")) / this._$stopsContainer.width();
            n.isObservable(t.percent) ? t.percent(s) : t.percent = s, this._updateGradientPreview();
        },
        _editColor: function(e) {
            o.show(), o.on("change", this._paletteChange, {
                stop: e,
                _updateGradientPreview: this._updateGradientPreview.bind(this)
            }), o.on("cancel", this._paletteCancel, this), o.on("apply", this._paletteApply, this);
            var t = n.utils.unwrapObservable(e.color);
            o.set(parseInt(s(t).hex().substr(1), 16));
        },
        _paletteChange: function(e) {
            var t = s(e).cssa();
            
n.isObservable(this.stop.color) ? this.stop.color(t) : this.stop.color = t, this._updateGradientPreview();
        },
        _paletteCancel: function() {
            o.hide(), o.off("change"), o.off("apply"), o.off("cancel");
        },
        _paletteApply: function() {
            this._paletteCancel();
        }
    });
    return t.Base.provideBinding("gradient", u), u;
}), define("modules/common/histogram", [ "require", "qpf", "emage", "knockout" ], function(e) {
    var t = e("qpf"), n = e("emage"), r = e("knockout"), i = n.qtek["2d"], s = t.use("meta/meta"), o = s.derive(function() {
        return {
            image: null,
            _stage: new i.Renderer,
            _scene: new i.Scene,
            _paths: {
                red: new i.renderable.Path({
                    stroke: !1,
                    style: new i.Style({
                        fill: "red",
                        globalAlpha: .4,
                        shadow: "0 -2 2 #333"
                    })
                
}),
                green: new i.renderable.Path({
                    stroke: !1,
                    style: new i.Style({
                        fill: "green",
                        globalAlpha: .4,
                        shadow: "0 -2 2 #333"
                    })
                }),
                blue: new i.renderable.Path({
                    stroke: !1,
                    style: new i.Style({
                        fill: "blue",
                        globalAlpha: .4,
                        shadow: "0 -2 2 #333"
                    })
                }),
                redStroke: new i.renderable.Path({
                    fill: !1,
                    style: new i.Style({
                        stroke: "#950000",
                        globalAlpha: .7
                    })
                }),
                greenStroke: new i.renderable.Path({
                    fill: !1,
                    style: new i.Style({
                        stroke: "#009500",
                        
globalAlpha: .7
                    })
                }),
                blueStroke: new i.renderable.Path({
                    fill: !1,
                    style: new i.Style({
                        stroke: "#000095",
                        globalAlpha: .7
                    })
                })
            },
            size: 128,
            sample: r.observable(2),
            _histogram: new n.Histogram
        };
    }, {
        type: "HISTOGRAM",
        css: "histogram",
        initialize: function() {
            this._scene.add(this._paths.red), this._scene.add(this._paths.green), this._scene.add(this._paths.blue), this._scene.add(this._paths.redStroke), this._scene.add(this._paths.greenStroke), this._scene.add(this._paths.blueStroke), this._histogram.downSample = 1 / 8;
        },
        template: "",
        update: function() {
            if (!this.image) return;
            this._histogram.image = this.image, this._histogram.update();
        },
        refresh
: function() {
            if (!this.image) return;
            histogramArray = this.getNormalizedHistogram(), this.updatePath("red", histogramArray.red), this.updatePath("green", histogramArray.green), this.updatePath("blue", histogramArray.blue), this._stage.render(this._scene);
        },
        initPath: function(e) {
            var t = this._paths[e], n = this.height(), r = this.sample(), i = this.$el.width() / 256 * r;
            t.segments = [ {
                point: [ 0, n ]
            } ];
            var s = 0;
            for (var o = 0; o < 256; o += r) t.segments.push({
                point: [ s, 0 ]
            }), s += i;
            t.pushPoints([ [ this.$el.width(), n ], [ 0, n ] ]), this._paths[e + "Stroke"].segments = t.segments;
        },
        updatePath: function(e, t) {
            var n = this._paths[e], r = this.height(), i = this.sample();
            for (var s = i; s < 257; s += i) n.segments[s / i].point[1] = (1 - t[s - 1]) * r;
            n.smooth
(1);
        },
        getNormalizedHistogram: function() {
            function e(e) {
                var t = [];
                for (var n = 0; n < e.length; n++) t.push(e[n] / 256);
                return t;
            }
            var t = this._histogram.channels;
            return {
                red: e(t.red),
                green: e(t.green),
                blue: e(t.blue)
            };
        },
        afterRender: function() {
            this.$el[0].appendChild(this._stage.canvas);
        },
        onResize: function() {
            this._stage && this._stage.resize(this.$el.width(), this.$el.height()), this.initPath("red"), this.initPath("green"), this.initPath("blue"), this.refresh();
        }
    });
    return s.provideBinding("histogram", o), o;
}), define("modules/common/iconbutton", [ "require", "qpf", "knockout" ], function(e) {
    var t = e("qpf"), n = t.use("meta/button"), r = t.use("meta/meta"), i = e("knockout"), s = n.derive(function() {
        return {
            
$el: $("<div></div>"),
            icon: i.observable(""),
            title: i.observable("")
        };
    }, {
        type: "ICONBUTTON",
        css: _.union("icon-button", n.prototype.css),
        template: '<div class="qpf-icon" data-bind="css:icon,attr:{title:title}"></div>'
    });
    return r.provideBinding("iconbutton", s), s;
}), define("modules/common/listTab", [ "require", "qpf", "./listitem", "knockout" ], function(e) {
    var t = e("qpf"), n = e("./listitem"), r = t.use("container/container"), i = e("knockout"), s = r.derive(function() {
        var e = {
            dataSource: i.observableArray([]),
            itemView: i.observable(n),
            selected: i.observableArray([]),
            multipleSelect: !1,
            dragSort: !1,
            actived: i.observable(0),
            maxTabWidth: 150,
            minTabWidth: 50
        };
        return e.actived.subscribe(function(e) {
            this._active(e);
        }, this), e;
    }, {
        type: "LISTTAB"
,
        css: "list-tab qpf-ui-tab",
        template: '<div class="qpf-tab-header">                        <ul class="qpf-tab-tabs" data-bind="foreach:children">                            <li data-bind="click:$parent.actived.bind($data, $index())">                                <a data-bind="html:$data.titleStr">adasd</a>                            </li>                        </ul>                        <div class="qpf-tab-tools"></div>                    </div>                    <div class="qpf-tab-body">                        <div data-bind="foreach:children" >                            <div class="qpf-container-item">                                <div data-bind="qpf_view:$data"></div>                            </div>                        </div>                    </div>',
        eventsProvided: _.union(r.prototype.eventsProvided, "select"),
        initialize: function() {
            var e = _.clone(this.dataSource()), t = this;
            this.dataSource.subscribe(function(
t) {
                this._update(e, t), e = _.clone(t), _.each(e, function(e, t) {
                    i.utils.unwrapObservable(e.selected) && this.selected(t);
                }, this);
            }, this), this._update([], e);
        },
        _updateTabSize: function() {
            var e = this.children().length, t = Math.floor((this.$el.width() - 20) / e);
            t = Math.min(this.maxTabWidth, Math.max(this.minTabWidth, t)), this.$el.find(".qpf-tab-header>.qpf-tab-tabs>li").width(t);
        },
        _getSelectedData: function() {
            var e = this.dataSource(), t = _.map(this.selected(), function(t) {
                return e[t];
            }, this);
            return t;
        },
        _update: function(e, t) {
            var n = this.children(), r = this.itemView(), s = [], o = i.utils.compareArrays(e, t), u = [];
            _.each(o, function(t) {
                if (t.status === "retained") {
                    var i = e.indexOf(t.value);
                    
s[i] = n[i];
                } else if (t.status === "added") {
                    var o = new r({
                        attributes: t.value
                    });
                    s[t.index] = o, n.splice(t.index, 0, o), u.push(o);
                }
            }, this), this.children(s), _.each(u, function(e) {
                e.render();
            }), this._updateTabSize();
        },
        _unSelectAll: function() {
            _.each(this.children(), function(e, t) {
                e && e.$el.removeClass("selected");
            }, this);
        },
        _unActiveAll: function() {
            _.each(this.children(), function(e) {
                e.$el.css("display", "none");
            });
        },
        _active: function(e) {
            this._unActiveAll();
            var t = this.children()[e];
            t && t.$el.css("display", "block"), this.$el.find(".qpf-tab-header>.qpf-tab-tabs>li").removeClass("actived").eq(e).addClass("actived");
        }
    });
    
return r.provideBinding("listtab", s), s;
}), define("modules/common/nativehtml", [ "require", "qpf", "knockout", "_" ], function(e) {
    var t = e("qpf"), n = t.use("meta/meta"), r = e("knockout"), i = t.use("core/xmlparser"), s = e("_"), o = n.derive(function() {
        return {
            $el: $('<div data-bind="html:html"></div>'),
            html: r.observable("ko")
        };
    }, {
        type: "NATIVEHTML",
        css: "native-html"
    });
    return n.provideBinding("nativehtml", o), i.provideParser("nativehtml", function(e) {
        var t = i.util.getChildren(e), n = "";
        s.each(t, function(e) {
            e.nodeType === 4 && (n += e.textContent);
        });
        if (n) return {
            html: n
        };
    }), o;
}), define("modules/common/region", [ "require", "qpf", "knockout", "_", "../router" ], function(e) {
    var t = e("qpf"), n = t.use("meta/meta"), r = t.use("base"), i = e("knockout"), s = e("_"), o = e("../router"), u = r.derive(function(
) {
        return {
            controller: {},
            _moduleCache: {},
            _currentModule: null
        };
    }, {
        type: "REGION",
        css: "region",
        initialize: function() {
            var e = this;
            s.each(this.controller, function(t, n) {
                var r = t.url, i = t.context;
                r === "*" ? e.enterModule(n, {}, function() {}) : (o.on("after", r, e.leaveModule.bind(e, n)), o.on(r, e.enterModule.bind(e, n, i)));
            });
        },
        _updateStatus: function() {
            var e = this, t = Array.prototype.pop.call(arguments), n = 0;
            s.each(e._moduleCache, function(e) {
                n++, e.__enable__ ? e.enable(t) : e.disable(t);
            }), n || t();
        },
        leaveModule: function(e) {
            var t = this._moduleCache[e], n = Array.prototype.pop.call(arguments);
            t && t.disable(n);
        },
        enterModule: function(t, n) {
            var r = {}, i = this
, o = Array.prototype.pop.call(arguments), u = Array.prototype.slice.call(arguments, 2);
            n && s.each(u, function(e, t) {
                var i = n[t];
                i && (r[i] = e);
            });
            var a = this._moduleCache[t];
            a ? (a.enable(o), a.setContext(r), this._currentModule = a, this.onResize()) : e([ t ], function(e) {
                if (e && e.start) {
                    var n = e.start();
                    n && i.$el.append(n), e.mainComponent && (e.mainComponent.parent = i), e.enable(o), e.setContext(r), i._moduleCache[t] = e, i._currentModule = e, i.onResize();
                }
            }), o();
        },
        onResize: function() {
            this._currentModule && this._currentModule.mainComponent && (this._currentModule.mainComponent.width(this.$el.width()), this._currentModule.mainComponent.height(this.$el.height())), r.prototype.onResize.call(this);
        }
    });
    return n.provideBinding("region", u), u;
}), define
("modules/common/textArea", [ "require", "qpf", "knockout", "_" ], function(e) {
    var t = e("qpf"), n = t.use("meta/meta"), r = e("knockout"), i = e("_"), s = n.derive(function() {
        return {
            tag: "div",
            text: r.observable(""),
            placeholder: r.observable("")
        };
    }, {
        type: "TEXTAREA",
        css: "textarea",
        template: '<textarea rows="5" cols="24" data-bind="value:text"/>',
        onResize: function() {
            this.$el.find("textarea").width(this.width()), n.prototype.onResize.call(this);
        }
    });
    return n.provideBinding("textarea", s), s;
}), define("modules/common/togglebutton", [ "require", "qpf", "knockout" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.meta.Button.derive(function() {
        return {
            actived: n.observable(!1)
        };
    }, {
        type: "TOGGLEBUTTON",
        css: [ "button", "toggle-button" ],
        initialize: function() {
            var e = 
this;
            n.computed(function() {
                this.actived() ? e.$el.addClass("active") : e.$el.removeClass("active");
            });
        }
    });
    return t.Base.provideBinding("togglebutton", r), r;
}), define("modules/common/toggleiconbutton", [ "require", "qpf", "./iconbutton", "knockout" ], function(e) {
    var t = e("qpf"), n = e("./iconbutton"), r = e("knockout"), i = n.derive(function() {
        return {
            actived: r.observable(!1)
        };
    }, {
        type: "TOGGLEICONBUTTON",
        css: [ "button", "icon-button", "toggle-icon-button" ],
        initialize: function() {
            var e = this;
            r.computed(function() {
                this.actived() ? e.$el.addClass("active") : e.$el.removeClass("active");
            });
        }
    });
    return t.Base.provideBinding("toggleiconbutton", i), i;
}), define("text!modules/page/element.html", [], function() {
    return '<div data-bind="text:id"></div>\r\n<div class="qpf-page-desc" data-bind="text:desc"></div>\r\n<img class="qpf-page-img" data-bind="attr: { src: img}">\r\n'
;
}), define("modules/page/element", [ "require", "qpf", "knockout", "text!./element.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.meta.Meta.derive(function() {
        return {
            id: n.observable(""),
            desc: n.observable(""),
            img: n.observable(""),
            target: n.observable()
        };
    }, {
        type: "ELEMENT",
        css: "element",
        template: e("text!./element.html")
    });
    return r;
}), define("text!modules/page/page.xml", [], function() {
    return '<container id="Page">\r\n    <list id="PagesList" dataSource="@binding[pagesList]" itemView="@binding[ElementView]" onselect="@binding[_selectPages]"></list>\r\n</container>';
}), define("modules/page/index", [ "require", "qpf", "knockout", "core/factory", "core/command", "../module", "text!./page.xml", "_", "../property/index", "../component/index", "../hierarchy/index", "../pool/index", "modules/common/contextmenu", "modules/common/modal", "./element" 
], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("core/factory"), i = e("core/command"), s = e("../module"), o = e("text!./page.xml"), u = e("_"), a = e("../property/index"), f = e("../component/index"), l = e("../hierarchy/index"), c = e("../pool/index"), h = e("modules/common/contextmenu"), p = e("modules/common/modal"), d = t.use("meta/textfield"), v = t.use("container/vbox"), m = t.use("container/container"), g = t.use("container/inline"), y = t.use("meta/label"), b = e("./element"), w = "", E = "", S = new s({
        name: "page",
        xml: o,
        pagesList: n.observableArray([]),
        selectedPages: n.observableArray([]),
        ElementView: b,
        _selectPages: function(e) {
            S.selectedPages(u.map(e, function(e) {
                return e.target;
            }));
        },
        load: function(e) {
            var t = S.pagesList();
            u.map(e, function(e) {
                var n = u.find(w.split("_"), function(t) {
                    
return t == e.name;
                });
                n ? p.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u6c60\u5df2\u5b58\u5728\u7ec4\u4ef6" + e.name + ", \u70b9\u51fb\u786e\u5b9a\u66ff\u6362\u4e3a\u65b0\u7684\u7ec4\u4ef6", function() {
                    u.each(t, function(t) {
                        if (t.id == e.name) return t.target = e, t.img = e.img, t.desc = "-" + e.desc, !1;
                    });
                }, null) : (t.push({
                    id: e.name,
                    img: e.img,
                    desc: "-" + e.desc,
                    target: e
                }), w += e.name + "_");
            }), this.pagesList(t);
        },
        getTarget: function(e) {
            var t = S.pagesList(), n = {};
            return u.each(t, function(t, r) {
                if (t.id == e) {
                    n = t.target;
                    return;
                }
            }), n;
        }
    });
    return S.pages = function() {
        return u.map(S.pagesList
(), function(e) {
            return e.target;
        });
    }, S.savePool = function() {
        if (E) {
            var e = E.substring(E.lastIndexOf("/") + 1, E.indexOf("cmpp") - 1);
            $.post("/api/" + e, {
                ext: '{"name":"' + e + '", "url":"' + E + '"}',
                cmpData: JSON.stringify(S.pages())
            }, function(e) {
                p.confirm("\u63d0\u793a", e.message || "\u64cd\u4f5c\u6210\u529f", null, null, 1e3);
            });
        } else {
            var t = new d({
                attributes: {
                    text: "/.cmp/index.cmpp"
                }
            });
            p.popup("\u8bf7\u8f93\u5165\u7ec4\u4ef6\u6c60\u5730\u5740\uff1a", t, function() {
                if (t.text()) {
                    E = t.text();
                    var e = E.substring(E.lastIndexOf("/"), E.indexOf("cmpp") - 1);
                    $.post("/api/" + e, {
                        ext: '{"name":"' + e + '", "url":"' + E + '"}',
                        
cmpData: JSON.stringify(S.pages(), null, 2)
                    }, function(e) {
                        p.confirm("\u63d0\u793a", e.message || "\u64cd\u4f5c\u6210\u529f", null, null, 1e3);
                    });
                }
            });
        }
    }, S.on("start", function() {
        function e() {
            var e = S.selectedPages(), t = e[e.length - 1];
            t && (f.components().length ? p.confirm("\u63d0\u793a", "\u5de5\u4f5c\u533a\u4e2d\u5b58\u5728\u7ec4\u4ef6\uff0c\u8bf7\u5148\u4fdd\u5b58\uff01\u70b9\u51fb\u786e\u5b9a\u76f4\u63a5\u6e05\u7a7a\u5de5\u4f5c\u533a\u7ec4\u4ef6", function() {
                f.clearComponents(), l.removeAll(), S.trigger("selectPage", t);
            }, function() {}) : S.trigger("selectPage", t));
        }
        S.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function(t) {
            e();
        }), h.bindTo(S.mainComponent.$el, function(t) {
            var n = $(t).parents(".qpf-ui-element");
            return n
.length ? [ {
                label: "\u52a0\u8f7d\u9009\u4e2d\u7ec4\u4ef6",
                exec: function() {
                    e();
                }
            }, {
                label: "\u63d2\u5165\u9009\u4e2d\u7ec4\u4ef6",
                exec: function() {
                    var e = S.selectedPages(), t = e[e.length - 1];
                    t && S.trigger("selectPage", t);
                }
            }, {
                label: "\u5206\u4eab\u7ec4\u4ef6",
                exec: function() {
                    var e = S.selectedPages(), t = e[e.length - 1], n = new d({
                        attributes: {
                            text: location.origin + t.url
                        }
                    });
                    p.popup("\u590d\u5236\u5206\u4eab\u7ec4\u4ef6\u5730\u5740\uff1a", n, function() {});
                }
            }, {
                label: "\u7f16\u8f91",
                exec: function() {
                    var e = n.qpf("get")[0].attributes
.target, t = e.name, r = new m, i = new g, s = new g, o = new g, u = new g, a = new g, f = new g, l = new g;
                    i.add(new y({
                        attributes: {
                            text: "\u7ec4\u4ef6\u63cf\u8ff0\uff1a"
                        }
                    }));
                    var c = new d({
                        attributes: {
                            text: e.desc,
                            placeholder: "\u7ec4\u4ef6\u63cf\u8ff0"
                        }
                    });
                    i.add(c), s.add(new y({
                        attributes: {
                            text: "\u7f29\u7565\u56fe\u7247\uff1a"
                        }
                    }));
                    var h = new d({
                        attributes: {
                            text: e.img,
                            placeholder: "\u7f29\u7565\u56fe\u7247"
                        }
                    });
                    s.add(h), o.add
(new y({
                        attributes: {
                            text: "\u7ec4\u4ef6\u5730\u5740\uff1a"
                        }
                    }));
                    var v = new d({
                        attributes: {
                            text: e.url,
                            placeholder: "\u7ec4\u4ef6\u5730\u5740"
                        }
                    });
                    o.add(v), u.add(new y({
                        attributes: {
                            text: "FTL\u5730\u5740\uff1a"
                        }
                    }));
                    var b = new d({
                        attributes: {
                            text: e.ftlPath,
                            placeholder: "FTL\u6587\u4ef6\u5939\u7edd\u5bf9\u8def\u5f84\u5730\u5740/"
                        }
                    });
                    u.add(b), a.add(new y({
                        attributes: {
                            text: "CSS\u5730\u5740\uff1a"
                        
}
                    }));
                    var w = new d({
                        attributes: {
                            text: e.cssPath,
                            placeholder: "CSS\u6587\u4ef6\u5939\u7edd\u5bf9\u8def\u5f84\u5730\u5740/"
                        }
                    });
                    a.add(w), f.add(new y({
                        attributes: {
                            text: "RUI\u5730\u5740\uff1a"
                        }
                    }));
                    var E = new d({
                        attributes: {
                            text: e.ruiPath,
                            placeholder: "Regular\u7ec4\u4ef6\u5bfc\u51fa\u6587\u4ef6\u5939\u7edd\u5bf9\u8def\u5f84\u5730\u5740/"
                        }
                    });
                    f.add(E), l.add(new y({
                        attributes: {
                            text: "LIB\u5730\u5740\uff1a"
                        }
                    }));
                    var x = new 
d({
                        attributes: {
                            text: e.libPath,
                            placeholder: "\u6240\u4f9d\u8d56\u7684\u7ec4\u4ef6\u6c60lib\u5730\u5740('/src/javascript/lib/')"
                        }
                    });
                    l.add(x), r.add(i), r.add(s), r.add(o), p.popup("\u8bf7\u8f93\u5165\u76f8\u5173\u5185\u5bb9", r, function() {
                        var e = {
                            name: t,
                            desc: c.text(),
                            img: h.text(),
                            url: v.text(),
                            ftlPath: b.text(),
                            cssPath: w.text(),
                            ruiPath: E.text(),
                            libPath: x.text(),
                            postUrl: "/api/" + t
                        };
                        S.load([ e ]);
                    });
                }
            }, {
                label: "\u5220\u9664",
                
exec: function() {
                    var e = S.selectedPages(), t = e[e.length - 1];
                    S.pagesList.remove(function(e) {
                        return e.id == t.name;
                    });
                }
            }, {
                label: "\u52a0\u8f7d\u9009\u4e2d\u7ec4\u4ef6\u5907\u4efd",
                exec: function() {
                    var e = S.selectedPages(), t = e[e.length - 1];
                    t && (t.urlBackup = t.url + "_backup", f.components().length ? p.confirm("\u63d0\u793a", "\u5de5\u4f5c\u533a\u4e2d\u5b58\u5728\u7ec4\u4ef6\uff0c\u8bf7\u5148\u4fdd\u5b58\uff01\u70b9\u51fb\u786e\u5b9a\u76f4\u63a5\u6e05\u7a7a\u5de5\u4f5c\u533a\u7ec4\u4ef6", function() {
                        f.clearComponents(), l.removeAll(), S.trigger("selectPage", t);
                    }, function() {
                        S.selectedPages([]);
                        var e = S.pagesList();
                        S.pagesList([]), S.pagesList(e);
                    
}) : S.trigger("selectPage", t));
                }
            } ] : [ {
                label: "\u52a0\u8f7d\u672c\u5730\u7ec4\u4ef6\u96c6",
                exec: function() {
                    S.trigger("importProject");
                }
            }, {
                label: "\u52a0\u8f7d\u8fdc\u7a0b\u7ec4\u4ef6\u96c6",
                exec: function() {
                    var e = new d({
                        attributes: {
                            text: E || "/.cmp/index.cmpp"
                        }
                    }), t = p.popup("\u8bf7\u8f93\u5165\u8fdc\u7a0b\u7ec4\u4ef6\u96c6\u5730\u5740\uff1a", e, function() {
                        if (e.text()) {
                            E = e.text(), S.trigger("importProjectFromUrl", e.text());
                            if (E.indexOf("//") >= 0) {
                                var t = E.substring(E.lastIndexOf("/") + 1, E.lastIndexOf("."));
                                c.load([ {
                                    
name: t,
                                    desc: t,
                                    img: "/cmpApp/static/style/images/logo.jpg",
                                    url: E,
                                    postUrl: "/api/" + t
                                } ]);
                            }
                        }
                    });
                    e.onEnterKey = function() {
                        e.$el.blur(), t.wind.applyButton.trigger("click");
                    };
                }
            }, {
                label: "\u5bfc\u51fa\u7ec4\u4ef6\u96c6",
                exec: function() {
                    var e = new d({
                        attributes: {
                            placeholder: "\u7ec4\u4ef6\u96c6\u540d\u79f0"
                        }
                    });
                    p.popup("\u8bf7\u8f93\u5165\u7ec4\u4ef6\u96c6\u540d\u79f0\uff1a", e, function() {
                        if (e.text()) {
                            var t = new 
Blob([ JSON.stringify(S.pages(), null, 2) ], {
                                type: "text/plain;charset=utf-8"
                            });
                            saveAs(t, e.text() + ".cmpp");
                        }
                    });
                }
            }, {
                label: "\u5206\u4eab\u7ec4\u4ef6\u96c6",
                exec: function() {
                    var e = new d({
                        attributes: {
                            text: location.origin + E
                        }
                    });
                    p.popup("\u590d\u5236\u5206\u4eab\u7ec4\u4ef6\u96c6\u5730\u5740\uff1a", e, function() {});
                }
            }, {
                label: "\u4fdd\u5b58\u7ec4\u4ef6\u96c6",
                exec: function() {
                    S.savePool();
                }
            } ];
        });
    }), S;
}), define("text!modules/shellCmd/property.html", [], function() {
    return '<panel data-bind="attr: { title: titleStr}">\r\n    <textarea data-bind="attr: { class: classStr},text:codeStr"></textarea>\r\n</panel>\r\n<div class="editor-toolbar">\r\n    <button class="editor-new"> \u65b0\u589e </button>\r\n    <button class="editor-cancel"> \u6536\u8d77(alt+s) </button>\r\n    <button class="editor-close" data-bind="attr: { index: index}"> \u5173\u95ed </button>\r\n</div>\r\n'
;
}), define("modules/shellCmd/property", [ "require", "qpf", "knockout", "text!./property.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.use("container/container"), i = t.widget.Widget, s = i.derive(function() {
        return {
            codeStr: n.observable(""),
            classStr: n.observable(""),
            titleStr: n.observable("")
        };
    }, {
        type: "SHELLCMD",
        css: "shellcmd",
        template: e("text!./property.html")
    });
    return r.provideBinding("shellcmd", s), s;
}), define("text!modules/shellCmd/property.xml", [], function() {
    return '<listtab itemView="@binding[CodeItemView]" dataSource="@binding[codeArray]"></listtab> \r\n\r\n';
}), define("modules/shellCmd/index", [ "require", "qpf", "knockout", "../module", "_", "./property", "text!./property.xml", "modules/common/modal" ], function(e) {
    function h(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;
    }
    function p(e) {
        
e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0;
    }
    function d(e) {
        return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == 0;
    }
    function v(e) {
        h(e), p(e);
    }
    var t = e("qpf"), n = e("knockout"), r = e("../module"), i = e("_"), s = t.use("container/panel"), o = e("./property"), u = [], a = [], f = 0, l = e("text!./property.xml"), c = e("modules/common/modal"), m = new r({
        name: "property",
        xml: l,
        CodeItemView: o,
        codeArray: n.observableArray([]),
        getCmd: function(e, t, n, r) {
            var i = encodeURI("func=" + e + "&cwd=" + t);
            $.get("http://localhost:" + (+location.port + 1) + "/run?" + i, {}, function(e) {
                n(e);
            }), r();
        },
        root: "./",
        addCode: function(e, t) {
            function c(e) {
                e.doc.setCursor(e.doc.lastLine() + 1);
            }
            if (u.length > 0 && !e) {
                
$("#cmd").slideDown();
                return;
            }
            var n = this;
            t && (n.root = t);
            var r = n.codeArray(), i = "CMPS-" + r.length, s = "CMPS-" + r.length, o = n.root + " $ ";
            r.push({
                titleStr: i,
                classStr: s,
                codeStr: o,
                index: n.codeArray().length
            }), n.codeArray(r);
            var l = CodeMirror.fromTextArea($("#cmd ." + s)[0], {
                lineNumbers: !0,
                mode: "javascript",
                lineWrapping: !0,
                autofocus: !0,
                tabSize: 4
            });
            l.doc.setCursor(l.doc.lastLine() + 1), l.on("keydown", function(e, t) {
                if (!t.ctrlKey && e.doc.getCursor().line != e.doc.lastLine()) return v(t), !1;
                if (t.keyCode == 38) {
                    v(t);
                    if (f > 0) {
                        f--;
                        var n = a[f];
                        
e.doc.setValue(e.doc.getValue() + "\n" + n), c(e);
                    }
                    return !1;
                }
                if (t.keyCode == 40) {
                    v(t);
                    if (f < a.length - 1) {
                        f++;
                        var n = a[f];
                        e.doc.setValue(e.doc.getValue() + "\n" + n), c(e);
                    }
                    return !1;
                }
                if (t.keyCode == 8 || t.keyCode == 37) {
                    var r = e.doc.getValue();
                    if (r[r.length - 2] == "$" || r[r.length - 1] == "$") return v(t), !1;
                }
            }), l.on("keyup", function(e, t) {
                if (t.keyCode == 13) {
                    var r = e.doc.getLine(e.lastLine() - 1), i = $.trim(r.substr(r.indexOf("$") + 1)), s = r.substring(0, r.indexOf("$") - 1);
                    if (i.split(" ")[0] == "cd") {
                        var o = i.split(" ")[1];
                        
o.indexOf(":") > 0 ? s = o : o == ".." ? s += "/../" : o != "." && (s[s.length - 1] != "/" ? s += "/" + o : s += o), e.doc.setValue(e.doc.getValue() + "\n" + s + " $ "), c(e);
                    } else i.indexOf("clear") >= 0 ? (e.doc.setValue(s + " $ "), c(e)) : i && s ? (a.push(r), f = a.length, n.getCmd(i, s, function(t) {
                        window.loadingCmd && (window.loadingCmd = clearInterval(window.loadingCmd)), i == "ls" && (t = t.replace(/\n/g, "     ")), e.doc.setValue(e.doc.getValue() + "\n" + t + "\n" + s + " $ "), c(e);
                    }, function() {
                        window.loadingCmd = setInterval(function() {
                            e.doc.setValue(e.doc.getValue() + "."), c(e);
                        }, 200), setTimeout(function() {
                            window.loadingCmd && (window.loadingCmd = clearInterval(window.loadingCmd), e.doc.setValue(e.doc.getValue() + " timeout 120s" + "\n" + s + " $ "), c(e));
                        }, 12e4);
                    
})) : (e.doc.setValue(e.doc.getValue() + "\n" + s + " $ "), c(e));
                }
            }), l.setOption("theme", "monokai"), setTimeout(function() {
                l.refresh();
            }, 100), u.push(l);
            var h = $("#cmd .qpf-tab-header>.qpf-tab-tabs>li");
            setTimeout(function() {
                $(h[h.length - 1]).trigger("click");
            }, 300), $("#cmd").slideDown(), $(".switchDesign").hide(), $("#cmd .editor-new").click(function() {
                n.addCode(!0);
            }), $("#cmd .editor-close").click(function() {
                var e = $(this).attr("index");
                if (n.codeArray().length >= 0) {
                    var t = n.codeArray();
                    t.splice(+e, 1), n.codeArray(t), u.splice(+e, 1);
                    var r = $("#cmd .qpf-tab-header>.qpf-tab-tabs>li");
                    setTimeout(function() {
                        $(r[r.length - 1]).trigger("click");
                    }, 300);
                
}
                n.codeArray().length == 0 && ($("#cmd").slideUp(), $(".switchDesign").show());
            }), $("#cmd .editor-cancel").click(function() {
                $("#cmd").slideUp(), $(".switchDesign").show();
            });
        }
    });
    return m;
}), define("text!modules/toolbar/toolbar.xml", [], function() {
    return '<inline id="Toolbar">\r\n    <toolbargroup>\r\n        <!--<button text="eHtml" onclick="@binding[exportHTML]"></button>-->\r\n        <!--<button text="eRUI" onclick="@binding[exportRUI]"></button>\r\n        <button text="eFTL" onclick="@binding[exportFTL]"></button>-->\r\n        <!--<button text="eMac" onclick="@binding[exportMac]"></button>-->\r\n        <button text="align" title="\u6574\u4f53\u5bf9\u5176\u5230\u5de6\u4e0a\u89d2" onclick="@binding[alignProcess]"></button>\r\n        <button text="newP" title="\u521b\u5efa\u9875\u9762(\u9ed8\u8ba4\u5305\u542bUMI)" onclick="@binding[newPage]"></button>\r\n        <button text="newM" title="\u521b\u5efa\u6a21\u5757" onclick="@binding[newModule]"></button>\r\n        <button text="newU" title="\u521b\u5efa\u7ec4\u4ef6" onclick="@binding[newUnit]"></button>\r\n        <!--<button text="newC" title="\u521b\u5efacache" onclick="@binding[newCache]"></button>-->\r\n        <button text="export" title="\u5bfc\u51fa\u5f53\u524d\u5c55\u793a\u7ec4\u4ef6\u6a21\u578b" onclick="@binding[exportProject]"></button>\r\n        <iconbutton icon="save" title="\u4fdd\u5b58\u6a21\u578b" onclick="@binding[saveProject]"></iconbutton>\r\n        <iconbutton icon="load" title="\u5bfc\u5165\u6a21\u578b" onclick="@binding[importProject]"></iconbutton>\r\n    </toolbargroup>\r\n    <meta class="divider"></meta>\r\n    <toolbargroup>\r\n        <iconbutton icon="element" title="\u521b\u5efa\u5143\u7d20" onclick="@binding[createElement]"></iconbutton>\r\n        <iconbutton icon="image" title="\u521b\u5efa\u56fe\u7247" onclick="@binding[createImage]"></iconbutton>\r\n        <iconbutton icon="text" title="\u521b\u5efa\u6587\u672c" onclick="@binding[createText]"></iconbutton>\r\n        <iconbutton icon="function" title="\u521b\u5efa\u51fd\u6570" onclick="@binding[createFunction]"></iconbutton>\r\n        <iconbutton icon="module" title="\u521b\u5efa\u6a21\u5757" onclick="@binding[createModule]"></iconbutton>\r\n    </toolbargroup>\r\n    <meta class="divider"></meta>\r\n    <toolbargroup>  \r\n        <iconbutton icon="timeline" title="\u521b\u5efa\u65f6\u5e8f\u56fe" onclick="@binding[createTimeline]"></iconbutton>\r\n        <!--<iconbutton icon="embed" title="\u7f16\u8f91\u4ee3\u7801" onclick="@binding[showCode]"></iconbutton>-->\r\n        <iconbutton icon="shell" title="\u8fdc\u7a0b\u63a7\u5236\u53f0" onclick="@binding[showCmd]"></iconbutton>\r\n    </toolbargroup>\r\n    \r\n    <meta class="divider" ></meta>\r\n    <toolbargroup  style="float:right">\r\n        <iconbutton icon="shuffle" title="\u5207\u6362\u5c5e\u6027\u5c55\u793a" onclick="@binding[expandProp]"></iconbutton>\r\n        <iconbutton icon="changeBack" title="\u5207\u6362\u80cc\u666f" onclick="@binding[changeBack]"></iconbutton>\r\n    </toolbargroup>\r\n    <toolbargroup class="viewport-size" style="float:right">\r\n        <spinner value="@binding[viewportWidth]" min="0" width="100"></spinner>\r\n        <spinner value="@binding[viewportHeight]" min="0" width="100"></spinner>\r\n    </toolbargroup>\r\n    <toolbargroup style="float:right">\r\n        <!--title \u8981\u653e\u5728 icon\u540e\u9762\uff0c\u5426\u5219\u4f1a\u62a5\u9519-->\r\n        <iconbutton  icon="zoom-in" title="\u653e\u5927" onclick="@binding[zoomIn]"></iconbutton>\r\n        <iconbutton  icon="zoom-out" title="\u7f29\u5c0f" onclick="@binding[zoomOut]"></iconbutton>\r\n        <label text="@binding[viewportScale]" class="viewport-scale"></label>\r\n    </toolbargroup>\r\n    \r\n    \r\n</inline>\r\n'
;
}), define("text!template/module/m-example.cmp", [], function() {
    return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "m-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 800\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "m-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      },\n      {\n        "eid": 1,\n        "type": "UMI",\n        "properties": {\n          "id": "umi-root",\n          "rid": "",\n          "width": "200",\n          "height": 100,\n          "left": 94,\n          "top": 294,\n          "zIndex": 0,\n          "boxColor": "#000000",\n          "borderStyle": "",\n          "borderTop": 0,\n          "borderRight": 0,\n          "borderBottom": 0,\n          "borderLeft": 0,\n          "borderColor": 5617961,\n          "borderAlpha": 1,\n          "background": true,\n          "backgroundColor": 3914264,\n          "backgroundAlpha": 1,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "backgroundImageStr": "",\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "marginTop": 0,\n          "marginRight": 0,\n          "marginBottom": 0,\n          "marginLeft": 0,\n          "paddingTop": 0,\n          "paddingRight": 0,\n          "paddingBottom": 0,\n          "paddingLeft": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "shadowColorAlpha": 1,\n          "boxFontSize": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "boxClassStr": "cmp-element cmp-umi",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": "",\n          "hoverStr": "",\n          "animateStr": "none",\n          "dataCate": "",\n          "dataAction": "",\n          "dataLabel": "",\n          "positionStr": "absolute",\n          "floatStr": "",\n          "hashPath": "/",\n          "modulePath": "common/commonutil.html",\n          "parentModule": "",\n          "color": "#ffffff",\n          "border": true,\n          "classStr": "cmp-element cmp-element",\n          "include": ""\n        }\n      },\n      {\n        "eid": 2,\n        "type": "UMI",\n        "properties": {\n          "id": "rewrite-404",\n          "rid": "",\n          "width": 100,\n          "height": 100,\n          "left": 143,\n          "top": 151,\n          "zIndex": 0,\n          "boxColor": "#000000",\n          "borderStyle": "",\n          "borderTop": 0,\n          "borderRight": 0,\n          "borderBottom": 0,\n          "borderLeft": 0,\n          "borderColor": 5617961,\n          "borderAlpha": 1,\n          "background": true,\n          "backgroundColor": 13455472,\n          "backgroundAlpha": 1,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "backgroundImageStr": "",\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "marginTop": 0,\n          "marginRight": 0,\n          "marginBottom": 0,\n          "marginLeft": 0,\n          "paddingTop": 0,\n          "paddingRight": 0,\n          "paddingBottom": 0,\n          "paddingLeft": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "shadowColorAlpha": 1,\n          "boxFontSize": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "boxClassStr": "cmp-element cmp-umi",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": "",\n          "hoverStr": "",\n          "animateStr": "none",\n          "dataCate": "",\n          "dataAction": "",\n          "dataLabel": "",\n          "positionStr": "absolute",\n          "floatStr": "",\n          "hashPath": "404",\n          "modulePath": "/home/course",\n          "parentModule": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n'
;
}), define("text!template/unit/u-example.cmp", [], function() {
    return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "u-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 800\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "u-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n'
;
}), define("text!template/cache/c-example.cmp", [], function() {
    return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "c-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 600\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "c-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n'
;
}), define("text!template/page/p-example.cmp", [], function() {
    return '[\n  {\n    "meta": {\n      "date": "2017-3-8",\n      "name": "p-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 800\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "p-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n'
;
}), define("text!template/html/html.html", [], function() {
    return '<html>\r\n\r\n<head>\r\n    <title>CMPS Tool!</title>\r\n    <link type="text/css" rel="stylesheet" href="__name__.css" />\r\n    <style>\r\n        html,body,p{margin: 0;padding: 0;}\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <p style="text-align:center;font-size:20px;padding:10px;background:#333;color:#eee">\u672c\u9875\u9762\u91c7\u7528CMP\u5de5\u5177\u751f\u6210\uff0c\u6b22\u8fce\u8bd5\u7528\uff08<a style="color:#fff;" href="http://cmp.fed123.com" target="_blank">http://cmp.fed123.com</a>\uff09</p>    \r\n    __html__\r\n    <p style="text-align:center;font-size:20px;padding:10px;background:#333;color:#eee">\u672c\u9875\u9762\u91c7\u7528CMP\u5de5\u5177\u751f\u6210\uff0c\u6b22\u8fce\u8bd5\u7528\uff08<a style="color:#fff;" href="http://cmp.fed123.com" target="_blank">http://cmp.fed123.com</a>\uff09</p>\r\n</body>\r\n\r\n</html>\r\n';
}), define("text!template/page/page.html", [], function() {
    return '<#include "../common/head.ftl">\r\n<@head title="\u4e2d\u56fd\u5927\u5b66MOOC(\u6155\u8bfe)_\u6700\u597d\u7684\u5728\u7ebf\u8bfe\u7a0b\u5b66\u4e60\u5e73\u53f0"\r\n       keywords="\u4e2d\u56fd\u5927\u5b66MOOC,MOOC,\u6155\u8bfe,\u5728\u7ebf\u5b66\u4e60,\u5728\u7ebf\u6559\u80b2,\u5927\u89c4\u6a21\u5f00\u653e\u5f0f\u5728\u7ebf\u8bfe\u7a0b,\u7f51\u7edc\u516c\u5f00\u8bfe,\u89c6\u9891\u516c\u5f00\u8bfe,\u5927\u5b66\u516c\u5f00\u8bfe,\u5927\u5b66mooc, icourse163,\u6155\u8bfe\u7f51, MOOC\u5b66\u9662"\r\n       description="\u4e2d\u56fd\u5927\u5b66MOOC(\u6155\u8bfe) \u662f\u7231\u8bfe\u7a0b\u7f51\u643a\u624b\u4e91\u8bfe\u5802\u6253\u9020\u7684\u5728\u7ebf\u5b66\u4e60\u5e73\u53f0\uff0c\u6bcf\u4e00\u4e2a\u6709\u63d0\u5347\u613f\u671b\u7684\u4eba\uff0c\u90fd\u53ef\u4ee5\u5728\u8fd9\u91cc\u5b66\u4e60\u4e2d\u56fd\u6700\u597d\u7684\u5927\u5b66\u8bfe\u7a0b\uff0c\u5b66\u5b8c\u8fd8\u80fd\u83b7\u5f97\u8ba4\u8bc1\u8bc1\u4e66\u3002\u4e2d\u56fd\u5927\u5b66MOOC\u662f\u56fd\u5185\u6700\u597d\u7684\u4e2d\u6587MOOC\u5b66\u4e60\u5e73\u53f0\uff0c\u62e5\u6709\u6765\u81ea\u4e8e39\u6240985\u9ad8\u6821\u7684\u9876\u7ea7\u8bfe\u7a0b\uff0c\u6700\u597d\u6700\u5168\u7684\u5927\u5b66\u8bfe\u7a0b\uff0c\u4e0e\u540d\u5e08\u96f6\u8ddd\u79bb\u3002">\r\n</@head>\r\n<!-- @STYLE -->\r\n<link type="text/css" rel="stylesheet" href="/src/css/web/regularUI.css"/>\r\n<link type="text/css" rel="stylesheet" href="/src/css/web/style.css"/>\r\n<link type="text/css" rel="stylesheet" href="/src/css/__pageCSSPath__.css"/>\r\n<body>\r\n    <!-- \u9876\u90e8\u5bfc\u822a\u680f -->\r\n    <#include "../nav/nav.ftl">\r\n    __html__\r\n    <!-- \u5e95\u90e8\u5de5\u5177\u680f  -->\r\n    <#include \'../common/footer.ftl\' >\r\n    <!-- @NOPARSE -->\r\n    <script>\r\n    </script>\r\n    <!-- /@NOPARSE -->\r\n   \r\n    <!-- @DEFINE -->\r\n    <script src="${nejRoot}"></script>\r\n    <script>\r\n        NEJ.define([\r\n            \'pro/__pageFilePath__\',\r\n            \'util/dispatcher/dispatcher\'\r\n        ],function(_page,_p){\r\n           \r\n            _page._$allocate();\r\n            window.dispatcher = _p._$startup({\r\n                // \u89c4\u5219\u914d\u7f6e\r\n                rules:{\r\n                    rewrite:{\r\n                        // \u91cd\u5199\u89c4\u5219\u914d\u7f6e\r\n                        \'404\': \'__404Path__\'\r\n                    }\r\n                },\r\n                // \u6a21\u5757\u914d\u7f6e\r\n                modules: __module__\r\n            });\r\n            \r\n        });\r\n    </script>\r\n    <@seoScript></@seoScript>\r\n</body>\r\n</html>\r\n'
;
}), define("text!template/page/module.html", [], function() {
    return '<meta charset="utf-8"/>\r\n\r\n<textarea name="txt" id="j-__pName__-body">\r\n    <div id="j-__pName__-content"></div>\r\n</textarea>\r\n\r\n<!-- @TEMPLATE -->\r\n<textarea name="js" data-src="/src/javascript/__jsName__.js"></textarea>\r\n<!-- /@TEMPLATE -->\r\n';
}), define("text!template/page/page.js", [], function() {
    return "/*\r\n * __pDesc__\u9875\u9762\r\n *  @path pro/__path0__/pages/__path1__/__pName__\r\n */\r\nNEJ.define([\r\n    'base/klass',\r\n    'pro/common/page'\r\n], function (k,\r\n    _$$Page,\r\n    p, pro) {\r\n    /**\r\n     * \u9875\u9762\u6a21\u5757\u5b9e\u73b0\u7c7b\r\n     *\r\n     * @class   _$$page\r\n     * @extends pro/common/module._$$page\r\n     * @param  {Object} options - \u6a21\u5757\u8f93\u5165\u53c2\u6570\r\n     */\r\n    p._$$page = k._$klass();\r\n    pro = p._$$page._$extend(_$$Page);\r\n\r\n    /**\r\n     * \u6a21\u5757\u521d\u59cb\u5316\r\n     * @private\r\n     * @param  {Object} options - \u8f93\u5165\u53c2\u6570\u4fe1\u606f\r\n     * @return {Void}\r\n     */\r\n    pro.__init = function (options) {\r\n        this.__super(options);\r\n\r\n    };\r\n\r\n    /**\r\n     * \u6a21\u5757\u91cd\u7f6e\u903b\u8f91\r\n     * @private\r\n     * @param  {Object} options - \u8f93\u5165\u53c2\u6570\u4fe1\u606f\r\n     * @return {Void}\r\n     */\r\n    pro.__reset = function (options) {\r\n        this.__super(options);\r\n    };\r\n    /**\r\n     * \u6a21\u5757\u9500\u6bc1\u903b\u8f91\r\n     * @private\r\n     * @return {Void}\r\n     */\r\n    pro.__destroy = function () {\r\n        this.__super();\r\n    };\r\n\r\n    return p._$$page;\r\n});\r\n"
;
}), define("text!template/page/module.js", [], function() {
    return "/*\r\n * __pDesc__\u6a21\u5757\r\n * @path   __path0__/module/__path1__/__pName__\r\n * ------------------------------------------\r\n */\r\nNEJ.define([\r\n    'base/klass',\r\n    'pool/module-base/src/base',\r\n    'base/element',\r\n    'base/util',\r\n    'util/template/tpl',\r\n    'util/template/jst'\r\n], function (\r\n    _klass,\r\n    _module,\r\n    _element,\r\n    _util, _tpl, _jst,\r\n    exports, _pro) {\r\n\r\n    var g = window;\r\n\r\n    /**\r\n     * \u9875\u9762\u6a21\u5757\u5b9e\u73b0\u7c7b\r\n     *\r\n     * @class   _$$Module\r\n     * @extends pro/common/module._$$Module\r\n     * @param  {Object} options - \u6a21\u5757\u8f93\u5165\u53c2\u6570\r\n     */\r\n    var ModuleIns = _klass._$klass();\r\n    _pro = ModuleIns._$extend(m.Module);\r\n\r\n    /**\r\n     * \u6784\u5efa\u6a21\u5757\uff0c\u8fd9\u90e8\u5206\u4e3b\u8981\u5b8c\u6210\u4ee5\u4e0b\u903b\u8f91\uff1a\r\n     * \r\n     * * \u6784\u5efa\u6a21\u5757\u4e3b\u4f53DOM\u6811\u7ed3\u6784\r\n     * * \u521d\u59cb\u5316\u4f7f\u7528\u7684\u4f9d\u8d56\u7ec4\u4ef6\u7684\u914d\u7f6e\u4fe1\u606f\uff08\u5982\u8f93\u5165\u53c2\u6570\u3001\u56de\u8c03\u4e8b\u4ef6\u7b49\uff09\r\n     * * \u4e00\u6b21\u6027\u6dfb\u52a0\u7684\u4e8b\u4ef6\uff08\u5373\u6a21\u5757\u9690\u85cf\u65f6\u4e0d\u56de\u6536\u7684\u4e8b\u4ef6\uff09\r\n     * * \u540e\u7eed\u7528\u5230\u7684\u8282\u70b9\u7f13\u5b58\uff08\u6ce8\u610f\u5982\u679c\u7b2c\u4e09\u65b9\u7ec4\u4ef6\u914d\u7f6e\u4fe1\u606f\u91cc\u5df2\u7ecf\u7f13\u5b58\u7684\u8282\u70b9\u4e0d\u9700\u8981\u518d\u989d\u5916\u7528\u53d8\u91cf\u7f13\u5b58\u8282\u70b9\uff09\r\n     *\r\n     * \u5728UMI\u914d\u7f6e\u65f6\u7684 config \u914d\u7f6e\u76f4\u63a5\u505a\u4e3a _doBuild \u7684\u8f93\u5165\u53c2\u6570\r\n     * @return {String}\r\n     */\r\n    _pro._doBuild = function () {\r\n        var _body = 'j-__pName__-body';\r\n        this.__super(_tpl._$getTextTemplate(_body) || _jst._$get(_body), {\r\n            parent: 'j-__parentM__-content'\r\n        });\r\n    };\r\n\r\n\r\n    /**\r\n     * 1.\u7ec4\u88c5\u5206\u914d\u7b2c\u4e09\u65b9\u7ec4\u4ef6\uff0c\u5f62\u6210\u5b8c\u6574\u7684\u6a21\u5757\u7ed3\u6784\r\n     * 2.\u6dfb\u52a0\u6a21\u5757\u751f\u547d\u5468\u671f\u5185DOM\u4e8b\u4ef6\uff0c\u6a21\u5757\u9690\u85cf\u65f6\u56de\u6536\r\n     * @param {Object} _options \u6a21\u5757\u914d\u7f6e\u53c2\u6570\r\n     * @return {Void}\r\n     */\r\n    _pro._onShow = function (_options) {\r\n        this.__super(_options);\r\n    };\r\n\r\n    /**\r\n     * \u63a5\u53d7\u5230\u6d88\u606f\u89e6\u53d1\u4e8b\u4ef6\uff0c\u5b50\u7c7b\u5b9e\u73b0\u5177\u4f53\u903b\u8f91\r\n     * @param  {Object} arg0 - \u4e8b\u4ef6\u5bf9\u8c61\r\n     * @return {Void}\r\n     */\r\n    _pro._onMessage = function (_action) {\r\n\r\n    };\r\n\r\n    /**\r\n     * 1.\u6839\u636e\u8f93\u5165\u4fe1\u606f\u52a0\u8f7d\u6570\u636e\r\n     * 2.\u9700\u8981\u6570\u636e\u624d\u80fd\u6784\u9020\u7684\u7b2c\u4e09\u65b9\u7ec4\u4ef6\u7684\u5206\u914d\u548c\u7ec4\u88c5\r\n     * @param {Object} _options \u6a21\u5757\u914d\u7f6e\u53c2\u6570\r\n     * @return {Void}\r\n     */\r\n    _pro._onRefresh = function (_options) {\r\n        this.__super(_options);\r\n    };\r\n\r\n    /**\r\n     * 1.\u56de\u6536\u5206\u914d\u7684NEJ\u7ec4\u4ef6\uff0c\u57fa\u7c7b\u5df2\u5904\u7406\r\n     * 2.\u56de\u6536\u6240\u6709\u5206\u914d\u7684Regular\u7ec4\u4ef6\uff0c\u57fa\u7c7b\u5df2\u5904\u7406\r\n     * 3.\u56de\u6536\u6240\u6709\u6dfb\u52a0\u7684\u751f\u547d\u5468\u671f\u4e8b\u4ef6\uff0c\u57fa\u7c7b\u5df2\u5904\u7406\r\n     * 4.\u786e\u4fddonhide\u4e4b\u540e\uff0c\u7ec4\u4ef6\u72b6\u6001\u540conshow\u4e00\u81f4\r\n     * @return {Void}\r\n     */\r\n    _pro._onHide = function () {\r\n        this.__super();\r\n    };\r\n\r\n    //\u52a0\u8f7d\u6b64\u6a21\u5757\r\n    g.dispatcher._$loaded(\"__modulePath__\", ModuleIns);\r\n\r\n    exports.ModuleIns = ModuleIns;\r\n});\r\n"
;
}), define("util/regKey", [], function() {
    var e = {
        registerKey: function(e, t, n, r, i) {
            $(document.body).keydown(function(s) {
                s.ctrlKey == e && s.altKey == t && s.shiftKey == n && s.key == r && i();
            });
        }
    };
    return e;
}), define("text!template/test/caseApi.js", [], function() {
    return '/**\r\n * Test the component API. expReturn is the function return\r\n * *example:\r\n * {\r\n *     "data": {\r\n *         "index": 14,\r\n *         "total": 15\r\n *     },\r\n *     "api": "api name",\r\n *     "params": [1],\r\n *     "expReturn": "wqeqw",\r\n *     "expPro": {\r\n *         "index": 13,\r\n *         "total": 15,\r\n *         "from": 10,\r\n *         "to": 14\r\n *     },\r\n *     "expCpt": {\r\n *         "hasPrev": true,\r\n *         "hasNext": true,\r\n *         "hasLeftSep": true\r\n *     }\r\n * }\r\n */\r\nNEJ.define([], function () {\r\n    return [];\r\n});\r\n';
}), define("text!template/test/caseEvt.js"
, [], function() {
    return '/**\r\n * Test component event, \r\n * trigger: trigger param, trigger[0] is the event name, trigger[1] is the param;\r\n * * example:\r\n * {\r\n *     "targetEvt": "destroy",\r\n *     "data": {\r\n *         "index": 14,\r\n *         "total": 15\r\n *     },\r\n *     "trigger": ["go", 1],\r\n *     "expEvt": {\r\n *         "last": 14,\r\n *         "index": 1,\r\n *         "total": 15\r\n *     }\r\n * }\r\n */\r\nNEJ.define([], function () {\r\n    return [{\r\n        "targetEvt": "destroy",\r\n        "data": {},\r\n        "trigger": ["destroy"],\r\n        "expEvt": undefined\r\n    }];\r\n});\r\n';
}), define("text!template/test/caseIns.js", [], function() {
    return '/**\r\n * Test component instance case and UI case.UIAct & UITrigger & UIResult used in UI Test\u3002\r\n * staticInsApi: if the component has static api to generate it\'s instance, this is the static api name.\r\n * UIAct: UI test description. \r\n * UITrigger: UITrigger for animate UI operation, UITrigger[0] for element selector, UITrigger[1] for event name. \r\n * UIResult: UIResult to checkout the result after act. UIResult[\'hasClass\'] is to check has specific className or not, UIResult[\'hasClass\'] is two level array, the item is a small array which has 3 elements, item[0] is the element selector, item[1] means has or hasn\'t, 1 for has, 0 for hasn\'t. item[2] is the className. UIResult[\'hasStyle\'] is the same, but the item[2] has the style name and the corresponding style value. \r\n ** example:\r\n * {\r\n *     "staticInsApi": "static api name, if not ,leave it blank",\r\n *     "data": {\r\n *     },\r\n *     "UIAct":"has pager or click close icon",\r\n *     "UITrigger": [".u-st-cert", "click"],\r\n *     "UIResult": { \r\n *          "hasClass": [[".u-st-cert", 1, "f-dn"],[".u-st-cert", 1, "f-dn"]],\r\n *          "hasStyle": [[".u-st-cert", 0, "color:red"],[".u-st-cert", 1, "color:red"]],\r\n *      },\r\n *     "expPro": {\r\n *         "title": "",\r\n *         "content": ""\r\n *     },\r\n *     "expCpt": {\r\n *         "title": ""\r\n *     }\r\n * }\r\n *\r\n */\r\nNEJ.define([], function () {\r\n    return [];\r\n});\r\n'
;
}), define("text!template/test/test.html", [], function() {
    return '<html>\r\n\r\n<head>\r\n    <meta charset="utf-8">\r\n    <title>Unit Test - Selector</title>\r\n    <link href="__libDir__mocha/mocha.css" rel="stylesheet" />\r\n</head>\r\n<body>\r\n    <div id="mocha"></div>\r\n    <script src="__libDir__chai/chai.js"></script>\r\n    <script src="__libDir__mocha/mocha.js"></script>\r\n    <script>\r\n        mocha.setup(\'bdd\');\r\n    </script>\r\n    <script src="__libDir__regularjs/dist/regular.js"></script>\r\n    <script src="__libDir__nej/src/define.js?pool=__libDir__"></script>\r\n    <script src="test.js"></script>\r\n</body>\r\n\r\n</html>\r\n';
}), define("text!template/test/test.js", [], function() {
    return "/**\r\n * Entry for Unit Test\r\n *\r\n * @author edu <edu@corp.netease.com>\r\n */\r\nNEJ.define([\r\n    './testInsCase.spec.js',\r\n    './testInsUICase.spec.js'\r\n], function () {\r\n    mocha.run();\r\n});\r\n";
}), define("text!template/test/testInsCase.spec.js"
, [], function() {
    return "/**\r\n * Unit Test for __componentName__\r\n *\r\n * @author edu <edu@corp.netease.com>\r\n */\r\nNEJ.define([\r\n    'base/util',\r\n    '../component.js',\r\n    './caseIns.js',\r\n    './caseApi.js',\r\n    './caseEvt.js'\r\n], function (\r\n    u,\r\n    Component,\r\n    insCases,\r\n    apiCases,\r\n    evtCases\r\n) {\r\n        // use expect style BDD\r\n        var expect = chai.expect;\r\n        var ut = {};\r\n        /**\r\n         * Regular \u7ec4\u4ef6\u5e38\u89c4\u5c5e\u6027\u9a8c\u8bc1\u5668\u521d\u59cb\u5316\r\n         *\r\n         * @param   {Object} def - \u9ed8\u8ba4\u5c5e\u6027\u4fe1\u606f\r\n         * @param   {Object} ret - \u5f85\u9a8c\u8bc1\u7ed3\u679c\r\n         * @returns {Function}     \u9a8c\u8bc1\u6267\u884c\u51fd\u6570\r\n         */\r\n        ut.setupProChecker = function (def, ret) {\r\n            ret = u._$merge({}, def, ret);\r\n            return function (expect, inst) {\r\n                u._$forIn(ret, function (value, key) {\r\n                    expect(inst.data[key]).to.eql(value, key);\r\n                });\r\n            };\r\n        };\r\n        /**\r\n         * Regular \u7ec4\u4ef6\u8ba1\u7b97\u5c5e\u6027\u9a8c\u8bc1\u5668\u521d\u59cb\u5316\r\n         *\r\n         * @param   {Object} def - \u9ed8\u8ba4\u5c5e\u6027\u4fe1\u606f\r\n         * @param   {Object} ret - \u5f85\u9a8c\u8bc1\u7ed3\u679c\r\n         * @returns {Function}     \u9a8c\u8bc1\u6267\u884c\u51fd\u6570\r\n         */\r\n        ut.setupComputedChecker = function (def, ret) {\r\n            ret = u._$merge({}, def, ret);\r\n            return function (expect, inst) {\r\n                u._$forIn(ret, function (value, key) {\r\n                    expect(inst.$get(key)).to.eql(value, key);\r\n                });\r\n            };\r\n        }\r\n        // define ALL test\r\n        describe('Unit Test for component __componentName__', function () {\r\n            // define instance test\r\n            describe('Unit Test for New Instance', function () {\r\n                // FIXME set default value config\r\n                var defPro = {},\r\n                    defCpt = {};\r\n                // instance Base\r\n                var caseName = \"shoule be ok for new instance with data\";\r\n                u._$forEach(insCases, function (item) {\r\n                    if (item.staticInsApi && item.staticInsApi.length) {\r\n                        caseName = \"shoule be ok for static new instance api\" + item.staticInsApi;\r\n                    }\r\n                    it(caseName, function () {\r\n                        var inst = \"\";\r\n                        // static instance or not\r\n                        if (item.staticInsApi && item.staticInsApi.length) {\r\n                            Component[staticInsApi]({\r\n                                data: item.data\r\n                            });\r\n                        } else {\r\n                            inst = new Component({\r\n                                data: item.data\r\n                            });\r\n                        }\r\n                        expect(inst).to.be.an.instanceof(Component);\r\n                        // check property\r\n                        ut.setupProChecker(defPro, item.expPro)(expect, inst);\r\n                        // check computed property\r\n                        ut.setupComputedChecker(defCpt, item.expCpt)(expect, inst);\r\n                    });\r\n                });\r\n            });\r\n\r\n            // define API test\r\n            describe('Unit Test for Used API', function () {\r\n                var defPro = {},\r\n                    defCpt = {};\r\n                var caseName = \"shoule be ok for instance API \";\r\n                u._$forEach(apiCases, function (item) {\r\n                    if (item.api && item.api.length) {\r\n                        it(caseName + item.api, function () {\r\n                            var inst = new Component({\r\n                                data: item.data\r\n                            });\r\n                            if (item.expReturn) {\r\n                                expect(inst[item.api].apply(inst, item.params || [])).to.eql(item.expReturn);\r\n                            } else {\r\n                                inst[item.api].apply(inst, item.params || []);\r\n                            }\r\n                            ut.setupProChecker(defPro, item.expPro)(expect, inst);\r\n                            ut.setupComputedChecker(defCpt, item.expCpt)(expect, inst);\r\n                        });\r\n                    }\r\n                });\r\n            });\r\n\r\n            // define Event test\r\n            describe('Unit Test for Event', function () {\r\n                var caseName = \"shoule be ok for instance event on \";\r\n                u._$forEach(evtCases, function (item) {\r\n                    if (item.targetEvt) {\r\n                        it(caseName + item.targetEvt, function (done) {\r\n                            var inst = new Component({\r\n                                data: item.data\r\n                            });\r\n                            inst.$on(item.targetEvt, function (event) {\r\n                                expect(event).to.eql(item.expEvt);\r\n                                done();\r\n                            });\r\n                            var method = item.trigger.shift();\r\n                            inst[method].apply(inst, item.trigger);\r\n                        });\r\n                    }\r\n                });\r\n            });\r\n        });\r\n    });\r\n"
;
}), define("text!template/test/testInsUICase.spec.js", [], function() {
    return '/**\r\n * Unit UI Test for __componentName__\r\n *\r\n * @author edu <edu@corp.netease.com>\r\n */\r\nNEJ.define([\r\n    \'base/element\',\r\n    \'base/event\',\r\n    \'base/util\',\r\n    \'../component.js\',\r\n    \'./caseIns.js\'\r\n], function (\r\n    e,\r\n    v,\r\n    u,\r\n    Component,\r\n    insCases\r\n) {\r\n    // use expect style BDD\r\n    var expect = chai.expect;\r\n    var ut = {};\r\n    /**\r\n     * Regular \u7ec4\u4ef6\u5e38\u89c4\u5c5e\u6027\u9a8c\u8bc1\u5668\u521d\u59cb\u5316\r\n     *\r\n     * @param   {Object} parent - \u7236\u5143\u7d20\r\n     * @param   {Object} sel - \u9009\u62e9\u5668\uff0c\u652f\u6301class\u548cid\uff0c\u683c\u5f0f\u5206\u522b\u4e3a.class \u6216 #id\r\n     * @returns {Function}     \u9a8c\u8bc1\u6267\u884c\u51fd\u6570\r\n     */\r\n    ut.getElement = function (parent, sel) {\r\n        sel = sel.trim();\r\n        if ("." === sel[0]) {\r\n            return e._$getByClassName(parent, sel.substr(1)) && e._$getByClassName(parent, sel.substr(1))[0];\r\n        }\r\n        if ("#" === sel[0]) {\r\n            return e._$get(sel.substr(1));\r\n        }\r\n        return null;\r\n    };\r\n    // define component test\r\n    describe(\'Unit UI Test - __componentName__\', function () {\r\n        // define API test\r\n        describe(\'Unit UI Test for user Operation\', function () {\r\n            var caseName = "shoule act right when ";\r\n            u._$forEach(insCases, function (item) {\r\n                if (item.UIAct && item.UIAct.length) {\r\n                    var inst = new Component({\r\n                        data: item.data\r\n                    }).$inject(document.body);\r\n                    it(caseName + item.UIAct, function (done) {\r\n                        //animate action\r\n                        if (item.UITrigger && item.UITrigger.length) {\r\n                            var selector = item.UITrigger.shift();\r\n                            var element = ut.getElement(inst.parentNode, selector);\r\n                            if (element) {\r\n                                v._$dispatchEvent(element, item.UITrigger[0]);\r\n                            }\r\n                        }\r\n                        //checkout result, may be has animate action, so delay a while.\r\n                        // setTimeout(function () {\r\n                        // check class\r\n                        if (item.UIResult && item.UIResult["hasClass"] && item.UIResult["hasClass"].length) {\r\n                            var classCheckor = item.UIResult["hasClass"];\r\n                            u._$forEach(classCheckor, function (item) {\r\n                                var selector = item.shift();\r\n                                var hasOrNot = item.shift();\r\n                                var element = ut.getElement(inst.parentNode, selector);\r\n                                if (element) {\r\n                                    setTimeout(function () {\r\n                                        if (hasOrNot > 0) {\r\n                                            expect(e._$hasClassName(element, item)).to.be.true;\r\n                                        } else {\r\n                                            expect(e._$hasClassName(element, item)).to.be.false;\r\n                                        }\r\n                                        done();\r\n                                    }, 200);\r\n                                }\r\n\r\n                            });\r\n                        }\r\n                        // check style\uff0cuse math.ceil to handle the animation case\r\n                        if (item.UIResult && item.UIResult["hasStyle"] && item.UIResult["hasStyle"].length) {\r\n                            var styleCheckor = item.UIResult["hasStyle"];\r\n                            u._$forEach(styleCheckor, function (item) {\r\n                                var selector = item.shift();\r\n                                var hasOrNot = item.shift();\r\n                                var element = ut.getElement(inst.parentNode, selector);\r\n                                if (element) {\r\n                                    setTimeout(function () {\r\n                                        if (hasOrNot > 0) {\r\n                                            expect("" + Math.ceil(e._$getStyle(element, item[0].split(":")[0]))).to.eq(item[0].split(":")[1]);\r\n                                        } else {\r\n                                            expect("" + Math.ceil(e._$getStyle(element, item[0].split(":")[0]))).to.not.eq(item[0].split(":")[1]);\r\n                                        }\r\n                                        done();\r\n                                    }, 200);\r\n\r\n                                }\r\n\r\n                            });\r\n                        }\r\n\r\n                        // }, 100);\r\n\r\n                    });\r\n                }\r\n            });\r\n        });\r\n    });\r\n});\r\n'
;
}), define("util/exportFile", [ "core/service", "text!template/test/caseApi.js", "text!template/test/caseEvt.js", "text!template/test/caseIns.js", "text!template/test/test.html", "text!template/test/test.js", "text!template/test/testInsCase.spec.js", "text!template/test/testInsUICase.spec.js" ], function() {
    var e = require("core/service"), t = require("text!template/test/caseApi.js"), n = require("text!template/test/caseEvt.js"), r = require("text!template/test/caseIns.js"), i = require("text!template/test/test.html"), s = require("text!template/test/test.js"), o = require("text!template/test/testInsCase.spec.js"), u = require("text!template/test/testInsUICase.spec.js"), a = {
        exportTests: function(a, f, l) {
            var c = {
                caseApi_js: t,
                caseEvt_js: n,
                caseIns_js: r,
                test_html: i.replace(/\_\_libDir\_\_/g, f.libPath),
                test_js: s,
                testInsCase_spec_js: o.replace(/\_\_componentName\_\_/g
, a),
                testInsUICase_spec_js: u.replace(/\_\_componentName\_\_/g, a)
            };
            l(t, n, r);
            for (var h in c) e.saveApi("/api/" + a, {
                ext: '{"name":"' + a + '", "url":"' + (f.ruiPath + "test/" + h.replace(/\_/g, ".")) + '"}',
                cmpData: c[h]
            }, h + "\u4fdd\u5b58\u6210\u529f");
        }
    };
    return a;
}), define("modules/viewport/viewport", [ "require", "qpf", "knockout", "core/command", "modules/common/contextmenu", "modules/hierarchy/index" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.use("meta/meta"), i = e("core/command"), s = e("modules/common/contextmenu"), o = e("modules/hierarchy/index"), u = r.derive(function() {
        return {
            scale: n.observable(1),
            backColor: n.observable("#fff")
        };
    }, {
        type: "VIEWPORT",
        css: "viewport",
        template: '<div class="qpf-viewport-elements-container" ><div id="drawArrow" data-bind="attr: { width: width,height:height}" style="position: absolute;left: 0px;"></div><div id="drawDiagram" data-bind="attr: { width: width,height:height}" style="position: absolute;left: 0px;"></div><div id="drawMockView" data-bind="attr: { width: width,height:height}" style="left: 0px;"></div></div>                    <div class="qpf-viewport-ruler-h"></div>                    <div class="qpf-viewport-ruler-v"></div>'
,
        initialize: function() {
            this.scale.subscribe(this._scale, this), this._scale(this.scale());
            var e = this;
            n.computed({
                read: function() {
                    e.$el.css({
                        "background-color": e.backColor()
                    });
                }
            }), s.bindTo(this.$el, function(e) {
                var t = $(e).parents(".cmp-element");
                if (t.length) {
                    var n = [ {
                        label: "\u5220\u9664",
                        exec: function() {
                            i.execute("remove", t.attr("data-cmp-eid"));
                        }
                    }, {
                        label: "\u590d\u5236",
                        exec: function() {
                            i.execute("copy", t.attr("data-cmp-eid"));
                        }
                    } ], r = o.selectElementsByEID([ t.attr("data-cmp-eid") ]);
                    
r[0] && r[0].type == "UMI" && n.push({
                        label: "\u7f16\u8f91\u6a21\u5757\u4ee3\u7801",
                        exec: function() {
                            o.editModule(r[0]);
                        }
                    }), r[0] && r[0].type == "FUNC" && r[0].properties.funcType() == "IF" && n.push({
                        label: "\u589e\u52a0IF\u5206\u652f",
                        exec: function() {
                            r[0].properties.elseIfSwitch() ? r[0].properties.elseIfSwitch2(!0) : r[0].properties.elseIfSwitch(!0);
                        }
                    }), r[0] && r[0].type == "FUNC" && r[0].properties.funcType() == "IF" && r[0].properties.elseIfSwitch() && n.push({
                        label: "\u5220\u9664IF\u5206\u652f",
                        exec: function() {
                            r[0].properties.elseIfSwitch2() ? r[0].properties.elseIfSwitch2(!1) : r[0].properties.elseIfSwitch(!1);
                        }
                    
});
                } else var n = [];
                return n.push({
                    label: "\u7c98\u8d34",
                    exec: function() {
                        var e = i.execute("paste");
                    }
                }), n;
            });
        },
        afterRender: function() {
            this._$elementsContainer = this.$el.find(".qpf-viewport-elements-container");
        },
        addElement: function(e, t) {
            t ? t.append(e.$wrapper) : this._$elementsContainer && this._$elementsContainer.append(e.$wrapper);
        },
        clearAll: function() {
            this.$el.find(".qpf-viewport-elements-container").empty();
        },
        removeElement: function(e) {
            e.$wrapper.remove();
        },
        _scale: function(e) {
            this.$el.css({
                "-webkit-transform": "scale(" + e + "," + e + ")",
                "-moz-transform": "scale(" + e + "," + e + ")",
                "-o-transform": "scale(" + e + "," + 
e + ")",
                transform: "scale(" + e + "," + e + ")"
            });
        }
    });
    return r.provideBinding("viewport", u), u;
}), define("text!modules/viewport/viewport.xml", [], function() {
    return '<container id="Viewport">\r\n    <viewport id="ViewportMain" width="@binding[viewportWidth]" height="@binding[viewportHeight]" scale="@binding[viewportScale]" backColor="@binding[backColor]"></viewport>\r\n</container>\r\n';
}), define("modules/viewport/index", [ "require", "qpf", "knockout", "../module", "./viewport", "text!./viewport.xml", "_", "core/command", "core/factory", "modules/hierarchy/index", "modules/component/index" ], function(e) {
    function v(e) {
        var t = $(this).attr("data-cmp-eid");
        t && f.selectElementsByEID([ t ]);
    }
    function b() {
        c.mainComponent.$el[0].addEventListener("dragover", function(e) {
            e.stopPropagation(), e.preventDefault();
        }), c.mainComponent.$el[0].addEventListener("drop", function(
e) {
            e.stopPropagation(), e.preventDefault();
            var t = e.dataTransfer.files[0];
            t && t.type.match(/image/) && (y.onload = function(e) {
                y.onload = null, u.execute("create", "image", {
                    src: e.target.result
                });
            }, y.readAsDataURL(t));
        });
    }
    var t = e("qpf"), n = e("knockout"), r = e("../module"), i = e("./viewport"), s = e("text!./viewport.xml"), o = e("_"), u = e("core/command"), a = e("core/factory"), f = e("modules/hierarchy/index"), l = e("modules/component/index"), c = new r({
        name: "viewport",
        xml: s,
        viewportWidth: n.observable(1440),
        viewportHeight: n.observable(900),
        viewportScale: n.observable(1),
        backColor: n.observable("#fff")
    }), h = {
        $tl: $('<div class="resize-control tl"></div>'),
        $tc: $('<div class="resize-control tc"></div>'),
        $tr: $('<div class="resize-control tr"></div>'),
        
$lc: $('<div class="resize-control lc"></div>'),
        $rc: $('<div class="resize-control rc"></div>'),
        $bl: $('<div class="resize-control bl"></div>'),
        $bc: $('<div class="resize-control bc"></div>'),
        $br: $('<div class="resize-control br"></div>')
    }, p = $('<div class="element-select-outline"></div>');
    p.append(h.$tl), p.append(h.$tc), p.append(h.$tr), p.append(h.$lc), p.append(h.$rc), p.append(h.$bl), p.append(h.$bc), p.append(h.$br);
    var d;
    c.on("start", function() {
        d = c.mainComponent.$el.find("#ViewportMain").qpf("get")[0], c.$el.delegate(".cmp-element", "click", v), b();
    }), c.getViewPort = function() {
        return d;
    }, l.on("changeBackColor", function(e) {
        d.backColor(e);
    }), f.on("create", function(e, t) {
        d.addElement(e, t);
    }), f.on("remove", function(e) {
        d.removeElement(e);
    }), f.on("select", function(e) {
        var t = e[e.length - 1];
        if (!t) return;
        t.$wrapper
.append(p), g.clear(), o.each(e, function(e) {
            g.add(e.$wrapper);
        }), m = e;
    }), f.on("focus", function(e) {
        $("#Viewport").animate({
            scrollTop: e.$wrapper.position().top - 50 + "px",
            scrollLeft: e.$wrapper.position().left - 50 + "px"
        }, "fast");
    });
    var m = [], g = new t.helper.Draggable;
    g.on("drag", function() {
        o.each(m, function(e) {
            e.syncPositionManually();
        });
    });
    var y = new FileReader;
    return c;
}), define("project/project", [ "require", "_", "$", "core/factory", "modules/viewport/index", "modules/hierarchy/index", "modules/component/index", "modules/page/index", "modules/dataMock/index" ], function(e) {
    function f(e, n) {
        var r = n.split("/"), i = t.reduce(r, function(e, t) {
            if (e) return e[t];
        }, e);
        return i && i.data;
    }
    var t = e("_"), n = e("$"), r = e("core/factory"), i = e("modules/viewport/index"), s = e("modules/hierarchy/index"
), o = e("modules/component/index"), u = e("modules/page/index"), a = e("modules/dataMock/index"), l = {
        "import": function(e) {
            var t = this;
            e instanceof Array ? o.load(e) : o.load([ e ]), o.on("selectComponent", function(e) {
                t.loadComponent(e), console.log("selectComponent handle");
            });
        },
        importPage: function(e) {
            e instanceof Array ? u.load(e) : u.load([ e ]);
            var t = this;
            u.on("selectPage", function(e) {
                (e.url || e.urlBackup) && n.get(e.url || e.urlBackup, function(e) {
                    t.import(JSON.parse(e)), setTimeout(function() {
                        n("#Component").find(".qpf-container-item")[0].click();
                    }, 300);
                });
            });
        },
        loadComponent: t.throttle(function(e) {
            function u(n) {
                t.each(n, function(t, r) {
                    if (typeof t == "string") 
{
                        var i = /url\((\S*?)\)/.exec(t);
                        if (i) {
                            var s = i[1], o = f(e.assets, s);
                            o && (n[r] = o);
                        }
                    } else (t instanceof Array || t instanceof Object) && u(t);
                });
            }
            console.log("selectComponent handle with loadComponent after throttle");
            if (!e) return;
            e && (n(".mainContent").find(".switchDesign").length || (n(".mainContent").append("<div class='switchDesign'><span class='page'>\u9875\u9762\u8bbe\u8ba1</span><span class='mock'>Mock</span><span class='umi'>UMI\u7ed3\u6784</span><span class='timeline'>\u65f6\u5e8f\u56fe</span></div>"), n(".switchDesign span").click(function(e) {
                n(".switchDesign span").removeClass("cur"), n(this).addClass("cur"), n("#tempStyle").remove(), n(this).hasClass("umi") && (n(".cmp-element").addClass("cmp-dn"), n("#drawMockView").hide(), n(".cmp-umi"
).show(), n(".cmp-umi").removeClass("cmp-dn"), n("#drawArrow").show(), n("#drawDiagram").css("opacity", 0)), n(this).hasClass("page") && (n(".cmp-element").removeClass("cmp-dn"), n("#drawMockView").hide(), n(".cmp-umi").hide(), n("#drawArrow").hide(), n("#drawDiagram").css("opacity", 0)), n(this).hasClass("mock") && (n(".cmp-element").removeClass("cmp-dn"), n(".cmp-umi").hide(), n("#drawArrow").hide(), n("#drawDiagram").css("opacity", 0), n(".cmp-element").addClass("cmp-dn"), n("#drawMockView").show()), n(this).hasClass("timeline") && (n(".cmp-element").addClass("cmp-dn"), n("#drawMockView").hide(), n("#drawArrow").hide(), n(".cmp-umi").hide(), n("#drawDiagram").css("opacity", 1));
            }))), console.log("\u5f00\u59cb\u52a0\u8f7d\u5143\u4ef6-----");
            var a = [];
            t.each(e.elements, function(e) {
                function s(e, t, n) {
                    console.log(e + "- hover \u5904\u7406-----"), hoverHandlerWithThrottle(e, t, n);
                }
                
function f(e, n) {
                    console.log(e + "- FUNC \u5904\u7406-----");
                    var u = [], e = e, n = n, a = t.find(o.components(), function(t) {
                        return t["meta"]["name"] == e;
                    });
                    if (a) {
                        u = a.elements;
                        var l = [];
                        t.each(u, function(e) {
                            var t = r.create(e.type.toLowerCase(), {
                                id: e.properties.id
                            });
                            e.properties.boxClassStr.indexOf(e.properties.id) < 0 && (e.properties.boxClassStr += " " + e.properties.id), e.properties.funcType == "IF" && e.properties.ifFuncItem && (t.off("addFuncComponent"), t.on("addFuncComponent", f)), e.properties.funcType == "FOR" && e.properties.forFuncItem && (t.off("addFuncComponent"), t.on("addFuncComponent", f)), e.properties.funcType == "INCLUDE" && (t.off("addFuncComponent"), t.on
("addFuncComponent", f)), e.properties.hoverComponent && (t.off("addHoverComponent"), t.on("addHoverComponent", s)), t.import(e), l.push(t);
                        });
                    }
                    var c, h = t.find(l, function(e) {
                        return e.isContainer();
                    });
                    h && (h.$wrapper.css({
                        position: "relative"
                    }), h.$wrapper.find("a").attr("href") ? c = h.$wrapper.find("a") : (h.$wrapper.find("a").children().length < 1 ? h.$wrapper.find("a").remove() : h.$wrapper.html(h.$wrapper.find("a").html()), c = h.$wrapper), i.getViewPort().addElement(h, n), t.each(l, function(e, t) {
                        e.isContainer() || (e.$wrapper.find("a").attr("href") || (e.$wrapper.find("a").children().length < 1 ? e.$wrapper.find("a").remove() : e.properties.hoverComponent() || e.$wrapper.html(e.$wrapper.find("a").html())), i.getViewPort().addElement(e, c));
                    }));
                
}
                u(e.properties);
                var n = r.create(e.type.toLowerCase(), {
                    id: e.properties.id
                });
                window.hoverHandlerWithThrottle = t.throttle(function(e, n, s) {
                    console.log(e + "- hover with throttle-----");
                    var u = [], a = t.find(o.components(), function(t) {
                        return t["meta"]["name"] == e;
                    });
                    if (!a) return;
                    u = a.elements;
                    var l = [];
                    t.each(u, function(e) {
                        var t = r.create(e.type.toLowerCase(), {
                            id: e.properties.id
                        });
                        e.properties.boxClassStr.indexOf(e.properties.id) < 0 && (e.properties.boxClassStr += " " + e.properties.id), e.properties.funcType == "IF" && e.properties.ifFuncItem && (t.off("addFuncComponent"), t.on("addFuncComponent", f)), e.properties
.funcType == "FOR" && e.properties.forFuncItem && (t.off("addFuncComponent"), t.on("addFuncComponent", f)), e.properties.funcType == "INCLUDE" && (t.off("addFuncComponent"), t.on("addFuncComponent", f)), t.import(e), l.push(t);
                    });
                    var c, h = t.find(l, function(e) {
                        return e.isContainer();
                    });
                    h.$wrapper.css({
                        position: "relative"
                    }), h.$wrapper.find("a").remove(), c = h.$wrapper, i.getViewPort().addElement(h, n), s == "bottom" ? (n.parent().css({
                        "margin-left": -Math.floor(+h.properties.width() / 2 + 15)
                    }), n.parent().find(".e-hover-arrow").css({
                        left: Math.floor(+h.properties.width() / 2 + 15) - 10
                    }), n.parent().find(".e-hover-arrow-border").css({
                        left: Math.floor(+h.properties.width() / 2 + 15) - 10
                    })) : s == "bottom-right" ? 
(n.parent().css({
                        cssText: "left:auto !important;right:0;"
                    }), n.parent().find(".e-hover-arrow").css({
                        right: Math.floor(+n.parent().parent().width() / 2) - 10
                    }), n.parent().find(".e-hover-arrow-border").css({
                        right: Math.floor(+n.parent().parent().width() / 2) - 10
                    })) : s == "left" ? (n.parent().find(".e-hover-arrow").addClass("left"), n.parent().find(".e-hover-arrow").css({
                        cssText: "top:" + (Math.floor(+h.properties.height() / 2 + 15) - 10) + "px !important"
                    }), n.parent().find(".e-hover-arrow-border").addClass("left"), n.parent().find(".e-hover-arrow-border").css({
                        cssText: "top:" + (Math.floor(+h.properties.height() / 2 + 15) - 10) + "px !important"
                    })) : s == "right" && (n.parent().find(".e-hover-arrow").addClass("right"), n.parent().find(".e-hover-arrow").css({
                        
cssText: "top:" + (Math.floor(+h.properties.height() / 2 + 15) - 10) + "px !important"
                    }), n.parent().find(".e-hover-arrow-border").addClass("right"), n.parent().find(".e-hover-arrow-border").css({
                        cssText: "top:" + (Math.floor(+h.properties.height() / 2 + 15) - 10) + "px !important"
                    })), t.each(l, function(e, t) {
                        e.isContainer() || (!e.$wrapper.hasClass("e-hover-source") && !e.$wrapper.hasClass("cmp-func") && !e.$wrapper.find("a").attr("href") && e.$wrapper.html(e.$wrapper.find("a").html()), i.getViewPort().addElement(e, c));
                    });
                }, 300), e.properties.hoverComponent && (n.off("addFuncComponent"), n.on("addHoverComponent", s)), n.off("addFuncComponent"), n.on("addFuncComponent", f), n.import(e), a.push(n);
            }), s.load(a), i.viewportWidth(e.viewport.width), i.viewportHeight(e.viewport.height), i.backColor(e.viewport.backColor);
        }, 300),
        "export"
: function(e, n) {
            function h(e, n) {
                return t.find(e, function(e) {
                    return n == e.meta.name;
                });
            }
            function v(n) {
                n.properties.trueFuncBody && !e && (_json = o.getTarget(n.properties.trueFuncBody), Object.keys(_json).length && (h(p, _json.meta.name) || p.push(_json), t.each(_json.elements, function(e) {
                    v(e);
                }))), n.properties.falseFuncBody && !e && (_json = o.getTarget(n.properties.falseFuncBody), Object.keys(_json).length && (h(p, _json.meta.name) || p.push(_json), t.each(_json.elements, function(e) {
                    v(e);
                }))), n.properties.elseIfFuncBody && !e && (_json = o.getTarget(n.properties.elseIfFuncBody), Object.keys(_json).length && (h(p, _json.meta.name) || p.push(_json), t.each(_json.elements, function(e) {
                    v(e);
                }))), n.properties.elseIfFuncBody2 && !e && (_json = o.getTarget
(n.properties.elseIfFuncBody2), Object.keys(_json).length && (h(p, _json.meta.name) || p.push(_json), t.each(_json.elements, function(e) {
                    v(e);
                }))), n.properties.forFuncBody && !e && (_json = o.getTarget(n.properties.forFuncBody), Object.keys(_json).length && (h(p, _json.meta.name) || p.push(_json), t.each(_json.elements, function(e) {
                    v(e);
                }))), n.properties.includeBody && !e && (_json = o.getTarget(n.properties.includeBody), Object.keys(_json).length && (h(p, _json.meta.name) || p.push(_json), t.each(_json.elements, function(e) {
                    v(e);
                }))), n.properties.hoverComponent && !e && (_json = o.getTarget(n.properties.hoverComponent), Object.keys(_json).length && (h(p, _json.meta.name) || p.push(_json), t.each(_json.elements, function(e) {
                    v(e);
                })));
            }
            var r = new Date, u = "example", a = "", f = "", l = t.find(s.elements(
), function(e) {
                return e.isContainer();
            });
            l && l.getName().length ? u = l.getName() : u = s.elements()[0].getName();
            var c = {
                meta: {
                    date: r.getFullYear() + "-" + (r.getMonth() + 1) + "-" + r.getDate(),
                    name: u
                },
                viewport: {
                    width: i.viewportWidth(),
                    height: i.viewportHeight(),
                    backColor: i.backColor()
                },
                elements: [],
                assets: {}
            };
            n && (c.meta.componentJS = n.meta.componentJS, c.meta.cacheJS = n.meta.cacheJS, c.meta.pageFTL = n.meta.pageFTL, c.meta.pageJS = n.meta.pageJS, c.meta.uiJS = n.meta.uiJS, c.meta.pageCacheJS = n.meta.pageCacheJS, c.meta.testCaseApi = n.meta.testCaseApi, c.meta.testCaseEvt = n.meta.testCaseEvt, c.meta.testCaseIns = n.meta.testCaseIns);
            var p = [], d = this;
            return t
.each(s.elements(), function(e) {
                var n = e.export(), r = "";
                v(n), c.elements.push(t.omit(n, "assets")), t.each(n.assets, function(e, n) {
                    t.each(e, function(e, t) {
                        c.assets[n] || (c.assets[n] = {}), c.assets[n][t] = e;
                    });
                });
            }), p.push(c), {
                result: p,
                name: u
            };
        },
        exportElement: function(e) {
            function c(e) {
                e.properties.trueFuncBody && !isSave && (f = o.getTarget(e.properties.trueFuncBody), Object.keys(f).length && (isContain(u, f.meta.name) || u.push(f), t.each(f.elements, function(e) {
                    c(e);
                }))), e.properties.falseFuncBody && !isSave && (f = o.getTarget(e.properties.falseFuncBody), Object.keys(f).length && (isContain(u, f.meta.name) || u.push(f), t.each(f.elements, function(e) {
                    c(e);
                }))), e.properties
.elseIfFuncBody && !isSave && (f = o.getTarget(e.properties.elseIfFuncBody), Object.keys(f).length && (isContain(u, f.meta.name) || u.push(f), t.each(f.elements, function(e) {
                    c(e);
                }))), e.properties.elseIfFuncBody2 && !isSave && (f = o.getTarget(e.properties.elseIfFuncBody2), Object.keys(f).length && (isContain(u, f.meta.name) || u.push(f), t.each(f.elements, function(e) {
                    c(e);
                }))), e.properties.forFuncBody && !isSave && (f = o.getTarget(e.properties.forFuncBody), Object.keys(f).length && (isContain(u, f.meta.name) || u.push(f), t.each(f.elements, function(e) {
                    c(e);
                }))), e.properties.includeBody && !isSave && (f = o.getTarget(e.properties.includeBody), Object.keys(f).length && (isContain(u, f.meta.name) || u.push(f), t.each(f.elements, function(e) {
                    c(e);
                }))), e.properties.hoverComponent && !isSave && (f = o.getTarget(e.properties.hoverComponent
), Object.keys(f).length && (isContain(u, f.meta.name) || u.push(f), t.each(f.elements, function(e) {
                    c(e);
                })));
            }
            var n = "example", r = new Date;
            e.getName().length && (n = e.getName());
            var s = {
                meta: {
                    date: r.getFullYear() + "-" + (r.getMonth() + 1) + "-" + r.getDate(),
                    name: n
                },
                viewport: {
                    width: i.viewportWidth(),
                    height: i.viewportHeight(),
                    backColor: i.backColor()
                },
                elements: [],
                assets: {}
            }, u = [], a = e.export(), f = "", l = this;
            return a.properties.id.indexOf("container") < 0 && (a.properties.id += "-container"), c(a), s.elements.push(t.omit(a, "assets")), t.each(a.assets, function(e, n) {
                t.each(e, function(e, t) {
                    s.assets[n] || (s
.assets[n] = {}), s.assets[n][t] = e;
                });
            }), u.push(s), {
                result: u,
                name: n
            };
        },
        exportHTMLCSS: function() {
            var e = "<div class='m-body-container'></div>", r = [], i = "example", o = {}, u = "", a = "", f = t.find(s.elements(), function(e) {
                return e.isContainer();
            });
            f && (o = f.exportHTMLCSS(), e = o.html, r.push(o.css), i = f.getName()), e = n(e);
            var l;
            e.find("a").length && (l = e.find("a"));
            var c;
            return t.each(s.elements(), function(t) {
                t.isCache() ? (o = t.exportCache(), u += o.cacheItem, a += o.cacheItemCall) : t.type != "TIMELINE" && (t.type == "UMI" ? (c = c || {
                    modules: {},
                    parentM: {},
                    "404": "/"
                }, t.properties.id() == "rewrite-404" ? c[404] = t.properties.modulePath() : (c.modules[t.properties
.hashPath()] = t.properties.modulePath(), c.parentM[t.properties.hashPath()] = t.properties.parentModule())) : t.isContainer() || (o = t.exportHTMLCSS(), l ? l.append(o.html) : e.append(o.html), r.push(o.css)));
            }), {
                html: n("<div></div>").append(e).html().replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">").replace(/\&amp\;/g, "&").replace(/\&quot\;/g, "'"),
                css: r.join(" "),
                name: i,
                cache: u,
                cacheCall: a,
                umi: c
            };
        },
        exportMacro: function() {
            var e = "<div class='m-body-container'></div>", r = [], i = "example";
            t.each(s.elements(), function(t) {
                if (t.isContainer()) {
                    e = t.exportHTMLCSS().html, r.push(t.exportHTMLCSS().css), i = t.getName();
                    return;
                }
            }), e = n(e), t.each(s.elements(), function(t) {
                t.isContainer() || (e.append(
t.exportHTMLCSS().html), r.push(t.exportHTMLCSS().css));
            });
            var o = n("<div></div>").append(e).html().replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">").replace(/\$\{/g, "${" + i.replace(/\-/g, "_") + ".");
            return {
                html: "<#macro " + i.replace(/\-/g, "_") + " " + i.replace(/\-/g, "_") + ">" + o + "</#macro>",
                css: r.join(" "),
                name: i
            };
        },
        alignProcess: function() {
            var e = 0, n = 0, r = 0;
            t.each(s.elements(), function(t) {
                if (t.isContainer()) {
                    e = t.getTop(), n = t.getLeft(), r = t.getZ(), t.setTop(0), t.setLeft(0);
                    return;
                }
            }), t.each(s.elements(), function(t) {
                t.isContainer() || (t.setTop(t.getTop() - e), t.setLeft(t.getLeft() - n), t.setZ(t.getZ() + r + 1));
            });
        }
    };
    return l;
}), define("modules/toolbar/toolbargroup", 
[ "require", "qpf", "knockout", "_" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("_"), i = t.container.Inline.derive(function() {
        return {};
    }, {
        type: "TOOLBARGROUP",
        css: "toolbar-group"
    });
    return t.container.Container.provideBinding("toolbargroup", i), i;
}), define("text!template/rui/component.js", [], function() {
    return "/**\r\n * __componentNameCap__ \u7ec4\u4ef6\u5b9e\u73b0\u6587\u4ef6\r\n *\r\n * @module   __componentNameCap__\r\n */\r\nNEJ.define([\r\n    'text!./component.html',\r\n    'css!./component.css',\r\n    'pool/component-base/src/base',\r\n    'pool/component-base/src/util',\r\n    'base/element',\r\n    'base/event'\r\n    __cacheJS__\r\n], function(\r\n    html,\r\n    css,\r\n    Component,\r\n    util,\r\n    e,\r\n    v\r\n    __cacheName__\r\n) {\r\n\r\n    /**\r\n     * __componentNameCap__ \u7ec4\u4ef6\r\n     *\r\n     * @class   module:__componentNameCap__\r\n     * @extends module:pool/component-base/src/base.Component\r\n     *\r\n     * @param {Object} options      - \u7ec4\u4ef6\u6784\u9020\u53c2\u6570\r\n     * @param {Object} options.data - \u4e0e\u89c6\u56fe\u5173\u8054\u7684\u6570\u636e\u6a21\u578b\r\n     */\r\n    var __componentNameCap__ = Component.$extends({\r\n        name: '__componentName__',\r\n        css: css,\r\n        template: html,\r\n        /**\r\n         * \u6a21\u677f\u7f16\u8bd1\u524d\u7528\u6765\u521d\u59cb\u5316\u53c2\u6570\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#config\r\n         * @returns {void}\r\n         */\r\n        config: function() {\r\n            // FIXME \u8bbe\u7f6e\u7ec4\u4ef6\u914d\u7f6e\u4fe1\u606f\u7684\u9ed8\u8ba4\u503c\r\n            util.extend(this, {\r\n\r\n            });\r\n            // FIXME \u8bbe\u7f6e\u7ec4\u4ef6\u89c6\u56fe\u6a21\u578b\u7684\u9ed8\u8ba4\u503c\r\n            util.extend(this.data, {\r\n\r\n            });\r\n\r\n            this.supr();\r\n            // TODO\r\n        },\r\n\r\n        /**\r\n         * \u6a21\u677f\u7f16\u8bd1\u4e4b\u540e(\u5373\u6d3b\u52a8dom\u5df2\u7ecf\u4ea7\u751f)\u5904\u7406\u903b\u8f91\uff0c\u53ef\u4ee5\u5728\u8fd9\u91cc\u5904\u7406\u4e00\u4e9b\u4e0edom\u76f8\u5173\u7684\u903b\u8f91\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#init\r\n         * @returns {void}\r\n         */\r\n        init: function() {\r\n            // TODO\r\n            this.supr();\r\n\r\n            __cacheCall__\r\n\r\n        },\r\n\r\n        /**\r\n         * \u7ec4\u4ef6\u9500\u6bc1\u7b56\u7565\uff0c\u5982\u679c\u6709\u4f7f\u7528\u7b2c\u4e09\u65b9\u7ec4\u4ef6\u52a1\u5fc5\u5728\u6b64\u5148\u9500\u6bc1\u7b2c\u4e09\u65b9\u7ec4\u4ef6\u518d\u9500\u6bc1\u81ea\u5df1\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#destroy\r\n         * @returns {void}\r\n         */\r\n        destroy: function() {\r\n            // TODO\r\n            this.supr();\r\n        }\r\n    });\r\n\r\n    return __componentNameCap__;\r\n});\r\n"
;
}), define("text!template/cache/cache.js", [], function() {
    return "/**\r\n * ----------------------------------------------------------\r\n * __cache__\u63a5\u53e3\r\n * \r\n * @module   __cachePath__\r\n * ----------------------------------------------------------\r\n */\r\ndefine([\r\n    'pro/common/cache',\r\n    'pro/common/cache/cache',\r\n    'base/util'\r\n], function(_cache, _dwr, _util, _p) {\r\n    __content__\r\n});\r\n";
}), define("text!template/rui/ui.js", [], function() {
    return "/**\r\n * __componentNameCap__ \u7ec4\u4ef6\u5e26\u9ed8\u8ba4UI\u5b9e\u73b0\u6587\u4ef6\r\n *\r\n * @module   __componentNameCap__\r\n */\r\nNEJ.define([\r\n    './component.js',\r\n    'text!./component.html',\r\n    'css!./component.css'\r\n    __cacheJS__\r\n], function (\r\n    Component,\r\n    html,\r\n    css\r\n    __cacheName__\r\n) {\r\n    /**\r\n     * __componentNameCap__ UI\u7ec4\u4ef6\r\n     *\r\n     *\r\n     * @param {Object} options\r\n     * @param {Object} options.data \u4e0e\u89c6\u56fe\u5173\u8054\u7684\u6570\u636e\u6a21\u578b\r\n     */\r\n    var UxComponent = Component.$extends({\r\n        name: '__componentName__',\r\n        css: css,\r\n        template: html\r\n    });\r\n    /**\r\n     * \u9700\u8981\u5904\u7406\u7684\u5f02\u6b65\u8bf7\u6c42\r\n     */\r\n    __cacheCall__\r\n\r\n    return UxComponent;\r\n});\r\n"
;
}), define("text!template/test/show.html", [], function() {
    return '<html>\r\n\r\n<head>\r\n    <meta charset="utf-8">\r\n    <title>show Component</title>\r\n    <link href="__libDir__res-base/css/style.css" rel="stylesheet" />\r\n    <style>body{background: #eee;}</style>\r\n</head>\r\n\r\n<body>\r\n    <script src="__libDir__regularjs/dist/regular.js"></script>\r\n    <script src="__libDir__nej/src/define.js?pool=__libDir__"></script>\r\n    <script>\r\n        NEJ.define([\r\n            \'../component.js\'\r\n        ], function (\r\n            Component\r\n        ) {\r\n            new Component({\r\n                data: __data__\r\n            }).$inject(document.body);\r\n        });\r\n\r\n    </script>\r\n</body>\r\n\r\n</html>\r\n';
}), define("elements/text", [ "require", "core/factory", "knockout", "onecolor" ], function(e) {
    var t = e("core/factory"), n = e("knockout"), r = e("onecolor");
    t.register("text", {
        type: "TEXT",
        extendProperties: 
function() {
            return {
                text: n.observable("\u8bf7\u8f93\u5165\u6587\u5b57"),
                html: n.observable(""),
                fontFamily: n.observable("\u5fae\u8f6f\u96c5\u9ed1,Microsoft YaHei"),
                fontSize: n.observable(16),
                color: n.observable("#111111"),
                horzontalAlign: n.observable("center"),
                verticleAlign: n.observable("middle"),
                lineHeight: n.observable(0),
                lineClamp: n.observable(0),
                classStr: n.observable("")
            };
        },
        extendUIConfig: function() {
            return {
                text: {
                    label: "\u6587\u672c",
                    ui: "textarea",
                    text: this.properties.text
                },
                html: {
                    label: "r-html",
                    ui: "textarea",
                    text: this.properties.html
                },
                fontFamily
: {
                    label: "\u5b57\u4f53",
                    ui: "combobox",
                    "class": "small",
                    items: [ {
                        text: "\u5b8b\u4f53",
                        value: "\u5b8b\u4f53,SimSun"
                    }, {
                        text: "\u5fae\u8f6f\u96c5\u9ed1",
                        value: "\u5fae\u8f6f\u96c5\u9ed1,Microsoft YaHei"
                    }, {
                        text: "\u6977\u4f53",
                        value: "\u6977\u4f53,\u6977\u4f53_GB2312, SimKai"
                    }, {
                        text: "\u9ed1\u4f53",
                        value: "\u9ed1\u4f53,SimHei"
                    }, {
                        text: "\u96b6\u4e66",
                        value: "\u96b6\u4e66,SimLi"
                    }, {
                        text: "Andale Mono",
                        value: "andale mono"
                    }, {
                        text: "Arial",
                        
value: "arial,helvetica,sans-serif"
                    }, {
                        text: "Arial Black",
                        value: "arial black,avant garde"
                    }, {
                        text: "Comic Sans Ms",
                        value: "comic sans ms"
                    }, {
                        text: "Impact",
                        value: "impact,chicago"
                    }, {
                        text: "Times New Roman",
                        value: "times new roman"
                    }, {
                        text: "\u65e0",
                        value: ""
                    } ],
                    value: this.properties.fontFamily
                },
                fontSize: {
                    label: "\u5927\u5c0f",
                    ui: "spinner",
                    value: this.properties.fontSize
                },
                classStr: {
                    label: "class",
                    ui: "textfield",
                    
text: this.properties.classStr
                },
                color: {
                    label: "\u989c\u8272",
                    ui: "textfield",
                    text: this.properties.color
                },
                horzontalAlign: {
                    label: "\u6c34\u5e73\u5bf9\u9f50",
                    ui: "combobox",
                    "class": "small",
                    items: [ {
                        value: "left",
                        text: "\u5de6\u5bf9\u9f50"
                    }, {
                        value: "center",
                        text: "\u5c45\u4e2d"
                    }, {
                        value: "right",
                        text: "\u53f3\u5bf9\u9f50"
                    }, {
                        value: "justify",
                        text: "\u4e24\u7aef\u5bf9\u9f50"
                    } ],
                    value: this.properties.horzontalAlign
                },
                verticleAlign: {
                    
label: "\u5782\u76f4\u5bf9\u9f50",
                    ui: "combobox",
                    "class": "small",
                    items: [ {
                        value: "top",
                        text: "\u9876\u90e8\u5bf9\u9f50"
                    }, {
                        value: "middle",
                        text: "\u5c45\u4e2d"
                    }, {
                        value: "bottom",
                        text: "\u5e95\u90e8\u5bf9\u9f50"
                    } ],
                    value: this.properties.verticleAlign
                },
                lineHeight: {
                    label: "\u884c\u9ad8",
                    ui: "spinner",
                    min: 0,
                    value: this.properties.lineHeight
                },
                lineClamp: {
                    label: "\u5c3e\u8ffd...",
                    ui: "spinner",
                    min: 0,
                    value: this.properties.lineClamp
                }
            }
;
        },
        onCreate: function(e) {
            var t = $("<span style='line-height:normal;display:inline-block;width:100%;'></span>"), r = this;
            e.find("a").length ? $(e.find("a")[0]).append(t) : e.append(t), r.properties.boxFontSize(0), n.computed(function() {
                var e = r.properties.fontFamily(), n = r.properties.classStr();
                t.css({
                    "font-family": e
                }), n && t.addClass(n);
            }), n.computed(function() {
                var e = r.properties.text(), n = r.properties.html(), i = r.properties.fontSize() + "px", s = r.properties.color();
                t.html(e).css({
                    "font-size": i,
                    color: s
                }), n.length ? t.attr("r-html", n) : t.removeAttr("r-html");
            }), n.computed(function() {
                var e = r.properties.verticleAlign(), n = r.properties.horzontalAlign();
                t.css({
                    "text-align": n,
                    "vertical-align"
: e
                });
            }), n.computed(function() {
                var n = r.properties.lineHeight();
                n && (t.css({
                    "line-height": n + "px"
                }), e.css({
                    "line-height": n + "px"
                }));
            }), n.computed(function() {
                var e = r.properties.lineClamp();
                e > 1 ? t.addClass("f-" + e + "lines") : e > 0 ? t.addClass("f-line") : (t.removeClass("f-line"), t.removeClass("f-2lines"), t.removeClass("f-3lines"), t.removeClass("f-4lines"));
            });
        }
    });
}), define("modules/toolbar/index", [ "require", "qpf", "knockout", "../module", "text!./toolbar.xml", "text!template/module/m-example.cmp", "text!template/unit/u-example.cmp", "text!template/cache/c-example.cmp", "text!template/page/p-example.cmp", "text!template/html/html.html", "text!template/page/page.html", "text!template/page/module.html", "text!template/page/page.js", "text!template/page/module.js"
, "core/command", "core/service", "util/regKey", "util/exportFile", "$", "project/project", "../hierarchy/index", "modules/component/index", "modules/page/index", "../viewport/index", "../codeEditor/index", "../shellCmd/index", "../dataMock/index", "../template/index", "../pool/index", "modules/common/modal", "./toolbargroup", "_", "text!template/rui/component.js", "text!template/cache/cache.js", "text!template/cache/cache.js", "text!template/rui/component.js", "text!template/cache/cache.js", "text!template/rui/component.js", "text!template/rui/ui.js", "text!template/cache/cache.js", "text!template/test/show.html", "elements/image", "elements/text", "elements/func", "elements/umi", "elements/timeline" ], function(e) {
    function j(e, t, n) {
        return e ? e.replace(/\_\_name\_\_/g, t).replace(/\_\_nameCamel\_\_/g, n) : e;
    }
    function I(e) {
        var t = e.target.files[0];
        t && t.type.match(/image/) && (F.onload = function(e) {
            F.onload = null, d.execute
("create", "image", {
                src: e.target.result
            });
        }, F.readAsDataURL(t));
    }
    function q(e) {
        var t = e.target.files[0];
        !t || t.name.substr(-3) !== "cmp" && t.name.substr(-10) !== "cmp_backup" ? t && t.name.substr(-4) === "cmpp" && (F.onload = function(e) {
            F.onload = null;
            var t = b.importPage(JSON.parse(e.target.result));
        }, F.readAsText(t)) : (F.onload = function(e) {
            F.onload = null;
            var t = b.import(JSON.parse(e.target.result));
        }, F.readAsText(t));
    }
    var t = e("qpf"), n = e("knockout"), r = e("../module"), i = e("text!./toolbar.xml"), s = e("text!template/module/m-example.cmp"), o = e("text!template/unit/u-example.cmp"), u = e("text!template/cache/c-example.cmp"), a = e("text!template/page/p-example.cmp"), f = e("text!template/html/html.html"), l = e("text!template/page/page.html"), c = e("text!template/page/module.html"), h = e("text!template/page/page.js"
), p = e("text!template/page/module.js"), d = e("core/command"), v = e("core/service"), m = e("util/regKey"), g = e("util/exportFile"), y = e("$"), b = e("project/project"), w = e("../hierarchy/index"), E = e("modules/component/index"), S = e("modules/page/index"), x = e("../viewport/index"), T = e("../codeEditor/index"), N = e("../shellCmd/index"), C = e("../dataMock/index"), k = e("../template/index"), L = e("../pool/index"), A = e("modules/common/modal"), O = t.use("meta/textfield"), M = t.use("container/vbox"), _ = t.use("container/container"), D = t.use("container/inline"), P = t.use("meta/label");
    e("./toolbargroup");
    var H = e("_"), B = new r({
        name: "toolbar",
        xml: i,
        createElement: function() {
            d.execute("create");
        },
        createImage: function() {
            d.execute("create", "image", {
                src: "style/images/read.png"
            });
        },
        createText: function() {
            d.execute("create"
, "text");
        },
        createFunction: function() {
            d.execute("create", "func");
        },
        createTimeline: function() {
            d.execute("create", "timeline");
        },
        showCmd: function() {
            N.addCode(!1, "/");
        },
        createModule: function() {
            var e = w.selectedElements(), t = e[e.length - 1], n = "umi-root";
            t && (n = t.properties.id()), d.execute("create", "umi", {
                parentModule: n
            });
        },
        showUMICodeEditor: function(e, t, n) {
            var r = [], i = this;
            e && r.push({
                titleStr: "module.js",
                classStr: "moduleJS",
                codeStr: e
            }), t && r.push({
                titleStr: "module.html",
                classStr: "moduleHTML",
                codeStr: t
            }), T.showCode(r, function(e) {
                n && n(e);
            });
        },
        showCodeEditor: function(
e, t) {
            var n = [], r = this;
            y.each(e, function(e, r) {
                r.name && t[r.name].length && n.push({
                    titleStr: r.name,
                    classStr: r.name,
                    codeStr: t[r.name]
                });
            }), T.showCode(n, function(e) {
                _smeta = E.selectedComponents()[0].meta, H.each(e, function(e) {
                    e.codeStr.length && (_smeta[e.classStr] = e.codeStr);
                }), r.saveProject();
            });
        },
        zoomIn: function() {
            var e = x.viewportScale();
            x.viewportScale(Math.min(Math.max(e + .1, .2), 1.5));
        },
        zoomOut: function() {
            var e = x.viewportScale();
            x.viewportScale(Math.min(Math.max(e - .1, .2), 1.5));
        },
        viewportScale: n.computed(function() {
            return Math.floor(x.viewportScale() * 100) + "%";
        }),
        viewportWidth: x.viewportWidth,
        viewportHeight
: x.viewportHeight,
        exportProject: function() {
            var e = E.selectedComponents()[0], t = b.export(!1, e), n = new Blob([ JSON.stringify(t.result, null, 2) ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(n, t.name + ".cmp");
        },
        saveProject: H.throttle(function(e) {
            console.log("saveProject after throttle");
            var t = E.selectedComponents()[0], n = b.export(!0, t);
            n.result[0].elements.length > 0 && b.import(n.result), e && e(), A.confirm("\u63d0\u793a", "\u4fdd\u5b58\u6210\u529f\uff01", null, null, 1e3);
        }, 500),
        saveElement: function(e) {
            var t = w.selectedElements(), n = t[t.length - 1];
            if (n) {
                var r = b.exportElement(n);
                r.result[0].elements.length > 0 && (b.import(r.result), e());
            }
        },
        importProject: function() {
            var e = y("<input type='file' />");
            e[0]
.addEventListener("change", q), e.click();
        },
        expandProp: function() {
            +y(".propContent").css("width").replace("px", "") ? y(".propContent").css("width", 0) : y(".propContent").css("width", 280);
        },
        newPage: function() {
            w.removeAll(), b.loadComponent(JSON.parse(a)[0]);
        },
        newModule: function() {
            w.removeAll(), b.loadComponent(JSON.parse(s)[0]);
        },
        newUnit: function() {
            w.removeAll(), b.loadComponent(JSON.parse(o)[0]);
        },
        newCache: function() {
            w.removeAll(), b.loadComponent(JSON.parse(u)[0]);
        },
        changeBack: function() {
            var e = x.backColor();
            e == "#eee" ? x.backColor("#9a9a9a") : x.backColor("#eee");
        },
        generatePageHtml: function(e, t, n) {
            var r = e.umi, i = t || "", s = e.name.replace(/p\-/g, "P");
            return l.replace("__404Path__", r[404]).replace("__module__", JSON.stringify
(r.modules)).replace("__html__", e.html).replace(/\_\_pageFilePath\_\_/g, i.split("/")[0] + "/pages/" + i.split("/")[1] + "/" + s).replace(/\_\_pageCSSPath\_\_/g, (n || "") + e.name);
        },
        exportFTL: function() {
            var e = b.exportHTMLCSS();
            if (e.umi) {
                var t = new Blob([ this.generatePageHtml(e) ], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(t, e.name + ".ftl");
            } else {
                var t = new Blob([ e.html ], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(t, e.name + ".ftl");
            }
            var t = new Blob([ e.css ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, "_" + e.name + ".scss");
        },
        exportRUI: function() {
            var t = e("text!template/rui/component.js"), n = e("text!template/cache/cache.js"), r = b.exportHTMLCSS(), i = r.html;
            
i = i.replace(/\$\{/g, "{");
            var s = new Blob([ i ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(s, "component.html");
            var s = new Blob([ r.css ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(s, "component.css");
            var o = E.selectedComponents()[0];
            if (o && o.meta.componentJS) {
                var u = r.cache;
                if (u && o.cacheJS) {
                    var s = new Blob([ o.meta.cacheJS ], {
                        type: "text/plain;charset=utf-8"
                    });
                    saveAs(s, "cache.js");
                }
                var s = new Blob([ o.meta.componentJS ], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(s, "component.js");
            } else {
                var a = r.name;
                t = t.replace(/\_\_componentName\_\_/g, a.toLowerCase()), a = a.replace(/m\-/g
, "M").replace(/u\-/g, "U").replace(/c\-/g, "C"), t = t.replace(/\_\_componentNameCap\_\_/g, a);
                var u = r.cache, f = r.cacheCall;
                if (u) {
                    n = n.replace(/\_\_cache\_\_/g, a).replace("__cachePath__", a).replace(/\_\_content\_\_/g, u);
                    var s = new Blob([ n ], {
                        type: "text/plain;charset=utf-8"
                    });
                    saveAs(s, "cache.js");
                }
                f ? (f = f.replace(/\_\_cacheName\_\_/g, a), t = t.replace(/\_\_cacheJS\_\_/g, ",'./cache.js'").replace(/\_\_cacheName\_\_/g, "," + a + "Cache").replace(/\_\_cacheCall\_\_/g, f)) : t = t.replace(/\_\_cacheJS\_\_/g, "").replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, "");
                var s = new Blob([ t ], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(s, "component.js");
            }
        },
        exportHTML: function() {
            
var e = b.exportHTMLCSS(), t = f.replace("__html__", e.html).replace("__name__", e.name), n = new Blob([ t ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(n, e.name + ".html");
            var n = new Blob([ e.css ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(n, e.name + ".css");
        },
        exportMac: function() {
            var e = b.exportMacro(), t = new Blob([ e.html ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, e.name + ".ftl");
            var t = new Blob([ e.css ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, "_" + e.name + ".scss");
        },
        alignProcess: function() {
            b.alignProcess();
        }
    });
    E.on("importProject", function() {
        B.importProject();
    }), E.on("importProjectFromUrl", function(e) {
        y.get(e, function(e) {
            b.import(JSON.parse
(e));
        });
    }), E.on("newModule", function() {
        B.newModule();
    }), E.on("newUnit", function() {
        B.newUnit();
    }), E.on("syncCode", function(e) {
        var t = E.selectedComponents()[0], n = t.meta.name;
        _nameCamel = n.replace(/\-(\s|\S)?/g, function(e) {
            return e[1] ? e[1].toUpperCase() : "";
        }), y.each(e.templates, function(e, r) {
            if (!!r.name && t.meta[r.name]) {
                var i = j(r.dest, n, _nameCamel);
                y.get(i, function(e) {
                    var t = E.selectedComponents()[0];
                    t.meta[r.name] != e && (t.meta[r.name] = e, B.saveProject());
                });
            }
        });
    }), E.on("saveHTML", function() {
        B.exportHTML();
    }), E.on("saveCommon", function(e, t) {
        var n = E.selectedComponents()[0], r = n.meta.name, i = H.find(S.pages(), function(e) {
            return e.name == r;
        });
        if (!i) {
            A.confirm("\u63d0\u793a"
, "\u7ec4\u4ef6\u6c60\u6ca1\u6709\u6570\u636e\u8bf7\u5148\u521b\u5efa\u7ec4\u4ef6\u6c60\uff01", null, null, 1e3);
            return;
        }
        var s = b.exportHTMLCSS(), o = s.name.replace(/p\-/g, "").replace(/m\-/g, "").replace(/u\-/g, "").replace(/c\-/g, "");
        _nameCamel = o.replace(/\-(\s|\S)?/g, function(e) {
            return e[1] ? e[1].toUpperCase() : "";
        }), y.each(e.templates, function(e, u) {
            var a = u.name, f = j(u.dest, o, _nameCamel);
            if (n.meta[a] && !t) v.saveApi("/api/" + r, {
                ext: '{"name":"' + r + '", "url":"' + f + '"}',
                cmpData: n.meta[a]
            }, f + "\u4fdd\u5b58\u6210\u529f"); else {
                u.default = u.default || {}, u.default.__cachePath__ = u.default.__cachePath__;
                var l = {
                    __404Path__: s.umi ? s.umi[404] : "",
                    __module__: s.umi ? JSON.stringify(s.umi.modules) : "",
                    __html__: s.html || "",
                    
__css__: s.css || "",
                    __name__: o || "",
                    __namePrefix__: o.split("-")[0] || "",
                    __nameSufix__: o.split("-")[1] || o || "",
                    __nameCamel__: _nameCamel || "",
                    __desc__: i.desc || "",
                    __cache__: s.cache || "",
                    __cachePath__: s.cache ? j(u.default.__cachePath__, o, _nameCamel) || ",'./cache.js'" : "",
                    __cacheName__: s.cache ? "," + _nameCamel + "Cache" : "",
                    __cacheCall__: j(s.cacheCall, o, _nameCamel) || ""
                };
                (!!u.if && !!l[u.if] || !u.if) && y.get(u.content, function(e) {
                    for (var t in u.vars) {
                        var i = new RegExp(t, "g");
                        u.vars[t] == "default" ? e = e.replace(i, l[t] || "") : e = e.replace(i, j(u.vars[t], o, _nameCamel));
                    }
                    n.meta[a] && (n.meta[a] = e), v.saveApi("/api/" + 
r, {
                        ext: '{"name":"' + r + '", "url":"' + f + '"}',
                        cmpData: e
                    }, f + "\u4fdd\u5b58\u6210\u529f");
                });
            }
        });
    }), E.on("saveFTL", function(t, n) {
        if (S.pages().length < 1) A.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u6c60\u6ca1\u6709\u6570\u636e\u8bf7\u5148\u521b\u5efa\u7ec4\u4ef6\u6c60\uff01", null, null, 1e3); else {
            var r = t.meta.name, i = H.find(S.pages(), function(e) {
                return e.name == r;
            });
            t = E.selectedComponents()[0];
            if (i && i.ftlPath.indexOf("/") >= 0) {
                var s = b.exportHTMLCSS(), o = s.html;
                if (s.umi) {
                    var u = i.ftlPath.substr(i.ftlPath.indexOf("views") + 6), a = i.cssPath.substr(i.cssPath.indexOf("scss") + 5), f = s.name.replace(/p\-/g, ""), l = u.split("/")[0], d = u.split("/")[1], m = i.ftlPath.substring(0, i.ftlPath.indexOf("views")) + "javascript/"
, g = i.ftlPath.substring(0, i.ftlPath.indexOf("views")) + "html/", y = s.cache, x = s.cacheCall, T = e("text!template/cache/cache.js");
                    y ? (t.meta.pageCacheJS ? T = t.meta.pageCacheJS : T = T.replace(/\_\_cache\_\_/g, f).replace("__cachePath__", "pro/" + l + "/cache/" + d + "/" + f + "Cache").replace(/\_\_content\_\_/g, y), v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (m + l + "/cache/" + d + "/" + f + "Cache.js") + '"}',
                        cmpData: T
                    }, f + "Cache.js\u4fdd\u5b58\u6210\u529f")) : T = "", t.meta.pageJS ? h = t.meta.pageJS : h = h.replace("__path0__", l).replace("__path1__", d).replace("__pName__", f).replace("__pDesc__", i.desc), v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (m + l + "/pages/" + d + "/" + f + ".js") + '"}',
                        cmpData: h
                    }, "pageJS\u4fdd\u5b58\u6210\u529f");
                    var N = 
s.umi.modules, C = s.umi.parentM;
                    if (Object.keys(N).length) for (var k in N) if (N[k] != "common/commonutil.html") {
                        var L = H.find(t.elements, function(e) {
                            return N[k] == e.properties.modulePath;
                        }), O = k.substr(k.lastIndexOf("/") + 1), M = "";
                        L && L.properties.moduleJS ? M = L.properties.moduleJS : M = p.replace("__path0__", l).replace("__path1__", d).replace("__parentM__", C[k]).replace(/\_\_pName\_\_/g, O).replace("__pDesc__", i.desc).replace("__modulePath__", k), v.saveApi("/api/" + r, {
                            ext: '{"name":"' + r + '", "url":"' + (m + l + "/module/" + d + "/" + O + ".js") + '"}',
                            cmpData: M
                        }, "moduleJS\u4fdd\u5b58\u6210\u529f");
                        var _ = "";
                        L && L.properties.moduleHTML ? _ = L.properties.moduleHTML : _ = c.replace(/\_\_pName\_\_/g, O).replace
("__jsName__", l + "/module/" + d + "/" + O), v.saveApi("/api/" + r, {
                            ext: '{"name":"' + r + '", "url":"' + (g + l + "/" + N[k]) + '"}',
                            cmpData: _
                        }, "moduleHTML\u4fdd\u5b58\u6210\u529f"), L && (M != L.properties.moduleJS || _ != L.properties.moduleHTML) && (L.properties.moduleJS = M, L.properties.moduleHTML = _, w.loadElement(L));
                    }
                    var o = "";
                    t.meta.pageFTL && !n ? (o = t.meta.pageFTL, v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ftlPath + s.name + ".ftl") + '"}',
                        cmpData: o
                    }, "FTL\u4fdd\u5b58\u6210\u529f")) : (o = B.generatePageHtml(s, u, a), v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.cssPath + s.name + ".scss") + '"}',
                        cmpData: s.css
                    }, "CSS\u4fdd\u5b58\u6210\u529f"
), v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ftlPath + s.name + ".ftl") + '"}',
                        cmpData: o
                    }, "FTL\u4fdd\u5b58\u6210\u529f"));
                    if (o != t.meta.pageFTL || h != t.meta.pageJS || T != t.meta.pageCacheJS) t.meta.pageFTL = o, t.meta.pageJS = h, t.meta.pageCacheJS = T, B.saveProject();
                } else v.saveApi("/api/" + r, {
                    ext: '{"name":"' + r + '", "url":"' + (i.cssPath + "_" + s.name + ".scss") + '"}',
                    cmpData: s.css
                }, "CSS\u4fdd\u5b58\u6210\u529f"), v.saveApi("/api/" + r, {
                    ext: '{"name":"' + r + '", "url":"' + (i.ftlPath + s.name + ".ftl") + '"}',
                    cmpData: s.html
                }, "FTL\u4fdd\u5b58\u6210\u529f");
            } else A.confirm("\u8bf7\u5148\u4fdd\u5b58\u5230\u7ec4\u4ef6\u6c60\u5e76\u586b\u5199FTL/CSS\u8def\u5f84", "\u63d0\u793a", null, null, 1e3);
        }
    
}), w.on("saveProject", function(e) {
        B.saveProject();
    }), w.on("saveElement", function(e) {
        B.saveProject(function() {
            B.saveElement(e);
        });
    }), w.on("editModule", function(e) {
        e && e.properties.moduleJS().length ? B.showUMICodeEditor(e.properties.moduleJS(), e.properties.moduleHTML(), function(t) {
            H.each(t, function(t) {
                t.codeStr.length && (t.classStr == "moduleJS" ? e.properties.moduleJS(t.codeStr) : t.classStr == "moduleHTML" && e.properties.moduleHTML(t.codeStr)), B.saveProject();
            });
        }) : A.confirm("\u63d0\u793a", "\u8bf7\u5148\u4fdd\u5b58\u9875\u9762\u4ee5\u751f\u6210\u6a21\u5757\u521d\u59cb\u4ee3\u7801", null, null, 1e3);
    }), B.editorCode = function(e) {
        var t = E.selectedComponents()[0];
        B.showCodeEditor(e.templates, t.meta);
    }, E.on("editorJS", function(e) {
        B.editorCode(e);
    }), E.on("enterShell", function() {
        B.showCmd();
    }), E
.on("saveProject", function(e) {
        B.saveProject(e);
    }), E.on("saveRUI", function(t, n) {
        if (S.pages().length < 1) A.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u6c60\u6ca1\u6709\u6570\u636e\u8bf7\u5148\u521b\u5efa\u7ec4\u4ef6\u6c60\uff01", null, null, 1e3); else {
            A.confirm("\u63d0\u793a", "\u6b63\u5728\u4fdd\u5b58\u7ec4\u4ef6\u6587\u4ef6...", null, null, 1500);
            var r = t.meta.name, i = H.find(S.pages(), function(e) {
                return e.name == r;
            });
            if (i && i.ruiPath.indexOf("/") >= 0) {
                var s = b.exportHTMLCSS(), o = s.html;
                o = o.replace(/\$\{/g, "{"), v.saveApi("/api/" + r, {
                    ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "component.html") + '"}',
                    cmpData: o
                }, "component.html\u4fdd\u5b58\u6210\u529f"), v.saveApi("/api/" + r, {
                    ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "component.css") + '"}',
                    
cmpData: s.css
                }, "component.css\u4fdd\u5b58\u6210\u529f");
                var u = E.selectedComponents()[0];
                if (u.meta.componentJS && !n) {
                    var a = s.cache;
                    a && u.meta.cacheJS && v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "cache.js") + '"}',
                        cmpData: u.meta.cacheJS
                    }, "cache.js\u4fdd\u5b58\u6210\u529f"), v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "component.js") + '"}',
                        cmpData: u.meta.componentJS
                    }, "component.js\u4fdd\u5b58\u6210\u529f"), u.meta.testCaseApi && v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "/test/caseApi.js") + '"}',
                        cmpData: u.meta.testCaseApi
                    }, "testCaseApi\u4fdd\u5b58\u6210\u529f"), u.meta.testCaseEvt && 
v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "/test/caseEvt.js") + '"}',
                        cmpData: u.meta.testCaseEvt
                    }, "testCaseEvt\u4fdd\u5b58\u6210\u529f"), u.meta.testCaseIns && v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "/test/caseIns.js") + '"}',
                        cmpData: u.meta.testCaseIns
                    }, "testCaseIns"), !u.meta.testCaseApi && !u.meta.testCaseEvt && !u.meta.testCaseIns && g.exportTests(r, i, function(e, t, n) {
                        u.meta.testCaseApi = e, u.meta.testCaseEvt = t, u.meta.testCaseIns = n, B.saveProject();
                    });
                } else {
                    var f = s.name, l = e("text!template/rui/component.js"), c = e("text!template/cache/cache.js");
                    l = l.replace(/\_\_componentName\_\_/g, f.toLowerCase()), f = f.replace(/m\-/g, "").replace(/u\-/g, "").replace
(/c\-/g, ""), _nameCamel = f.replace(/\-(\s|\S)?/g, function(e) {
                        return e[1] ? e[1].toUpperCase() : "";
                    }), l = l.replace(/\_\_componentNameCap\_\_/g, _nameCamel);
                    var a = s.cache, h = s.cacheCall;
                    a && (c = c.replace(/\_\_cache\_\_/g, f).replace("__cachePath__", f).replace(/\_\_content\_\_/g, a), u.meta.cacheJS = c, v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "cache.js") + '"}',
                        cmpData: u.meta.cacheJS
                    }, "cache.js\u4fdd\u5b58\u6210\u529f")), h ? (h = h.replace(/\_\_cacheName\_\_/g, _nameCamel), l = l.replace(/\_\_cacheJS\_\_/g, ",'./cache.js'").replace(/\_\_cacheName\_\_/g, "," + _nameCamel + "Cache").replace(/\_\_cacheCall\_\_/g, h)) : l = l.replace(/\_\_cacheJS\_\_/g, "").replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, ""), u.meta.componentJS = l, v.saveApi("/api/" + r, {
                        
ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "component.js") + '"}',
                        cmpData: u.meta.componentJS
                    }, "component.js\u4fdd\u5b58\u6210\u529f"), u.meta.pageFTL = "", u.meta.pageJS = "", u.meta.pageCacheJS = "", g.exportTests(r, i, function(e, t, n) {
                        u.meta.testCaseApi = e, u.meta.testCaseEvt = t, u.meta.testCaseIns = n, B.saveProject();
                    });
                }
            } else A.confirm("\u63d0\u793a", "\u8bf7\u5148\u4fdd\u5b58\u5230\u7ec4\u4ef6\u6c60\u5e76\u586b\u5199RUI\u8def\u5f84", null, null, 1e3);
        }
    }), E.on("saveRUINew", function(t, n) {
        if (S.pages().length < 1) A.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u6c60\u6ca1\u6709\u6570\u636e\u8bf7\u5148\u521b\u5efa\u7ec4\u4ef6\u6c60\uff01", null, null, 1e3); else {
            A.confirm("\u63d0\u793a", "\u6b63\u5728\u4fdd\u5b58\u7ec4\u4ef6\u6587\u4ef6...", null, null, 1500);
            var r = t.meta.name, i = H.find(S.pages(), function(
e) {
                return e.name == r;
            });
            if (i && i.ruiPath.indexOf("/") >= 0) {
                var s = b.exportHTMLCSS(), o = s.html;
                o = o.replace(/\$\{/g, "{"), v.saveApi("/api/" + r, {
                    ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "component.html") + '"}',
                    cmpData: o
                }, "component.html\u4fdd\u5b58\u6210\u529f"), v.saveApi("/api/" + r, {
                    ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "component.css") + '"}',
                    cmpData: s.css
                }, "component.css\u4fdd\u5b58\u6210\u529f");
                var u = E.selectedComponents()[0];
                if (u.meta.componentJS && !n) {
                    var a = s.cache;
                    a && u.meta.cacheJS && v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "cache.js") + '"}',
                        cmpData: u.meta.cacheJS
                    
}, "cache.js\u4fdd\u5b58\u6210\u529f"), v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "component.js") + '"}',
                        cmpData: u.meta.componentJS
                    }, "component.js\u4fdd\u5b58\u6210\u529f"), v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "ui.js") + '"}',
                        cmpData: u.meta.uiJS
                    }, "ui.js\u4fdd\u5b58\u6210\u529f"), u.meta.testCaseApi && v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "/test/caseApi.js") + '"}',
                        cmpData: u.meta.testCaseApi
                    }, "testCaseApi\u4fdd\u5b58\u6210\u529f"), u.meta.testCaseEvt && v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "/test/caseEvt.js") + '"}',
                        cmpData: u.meta.testCaseEvt
                    }, "testCaseEvt\u4fdd\u5b58\u6210\u529f"
), u.meta.testCaseIns && v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "/test/caseIns.js") + '"}',
                        cmpData: u.meta.testCaseIns
                    }, "testCaseIns"), !u.meta.testCaseApi && !u.meta.testCaseEvt && !u.meta.testCaseIns && g.exportTests(r, i, function(e, t, n) {
                        u.meta.testCaseApi = e, u.meta.testCaseEvt = t, u.meta.testCaseIns = n, B.saveProject();
                    });
                } else {
                    var f = s.name, l = e("text!template/rui/component.js"), c = e("text!template/rui/ui.js"), h = e("text!template/cache/cache.js");
                    f = f.replace(/m\-/g, "").replace(/u\-/g, "").replace(/c\-/g, ""), _nameCamel = f.replace(/\-(\s|\S)?/g, function(e) {
                        return e[1] ? e[1].toUpperCase() : "";
                    }), l = l.replace(/\_\_componentNameCap\_\_/g, _nameCamel).replace(/\_\_componentName\_\_/g, f.toLowerCase()), c = 
c.replace(/\_\_componentNameCap\_\_/g, _nameCamel).replace(/\_\_componentName\_\_/g, f.toLowerCase());
                    var a = s.cache, p = s.cacheCall;
                    a && (h = h.replace(/\_\_cache\_\_/g, f).replace("__cachePath__", f).replace(/\_\_content\_\_/g, a), u.meta.cacheJS = h, v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "cache.js") + '"}',
                        cmpData: u.meta.cacheJS
                    }, "cache.js\u4fdd\u5b58\u6210\u529f")), l = l.replace(/\_\_cacheJS\_\_/g, "").replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, ""), u.meta.componentJS = l, v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "component.js") + '"}',
                        cmpData: u.meta.componentJS
                    }, "component.js\u4fdd\u5b58\u6210\u529f"), p ? (p = p.replace(/\_\_cacheName\_\_/g, _nameCamel), c = c.replace(/\_\_cacheJS\_\_/g, ",'./cache.js'"
).replace(/\_\_cacheName\_\_/g, "," + _nameCamel + "Cache").replace(/\_\_cacheCall\_\_/g, p)) : c = c.replace(/\_\_cacheJS\_\_/g, "").replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, ""), u.meta.uiJS = c, v.saveApi("/api/" + r, {
                        ext: '{"name":"' + r + '", "url":"' + (i.ruiPath + "ui.js") + '"}',
                        cmpData: u.meta.uiJS
                    }, "ui.js\u4fdd\u5b58\u6210\u529f"), u.meta.pageFTL = "", u.meta.pageJS = "", u.meta.pageCacheJS = "", g.exportTests(r, i, function(e, t, n) {
                        u.meta.testCaseApi = e, u.meta.testCaseEvt = t, u.meta.testCaseIns = n, B.saveProject();
                    });
                }
            } else A.confirm("\u63d0\u793a", "\u8bf7\u5148\u4fdd\u5b58\u5230\u7ec4\u4ef6\u6c60\u5e76\u586b\u5199RUI\u8def\u5f84", null, null, 1e3);
        }
    }), L.on("loadPoolItem", function(e) {
        y.get(e, function(t) {
            e.substr(-3) === "cmp" || e.substr(-10) === "cmp_backup" ? 
b.import(JSON.parse(t)) : e.substr(-4) === "cmpp" && b.importPage(JSON.parse(t));
        });
    }), C.on("refreshExample", function(t) {
        var n = E.selectedComponents()[0], r = n.meta.name, i = k.templates(), s = H.find(i, function(e) {
            return e.name == "regular-show-mooc";
        });
        if (s) {
            var o = s.templates[0], u = o.content.replace(/\_\_name\_\_/g, r), a = o.dest.replace(/\_\_name\_\_/g, r);
            y.get(u, function(e) {
                for (var n in o.vars) {
                    var r = {
                        __data__: JSON.stringify(t)
                    }, i = new RegExp(n, "g");
                    o.vars[n] == "default" ? e = e.replace(i, r[n]) : e = e.replace(i, o.vars[n]);
                }
                v.saveApi("/api/refreshExample", {
                    ext: '{"name":"refreshExample", "url":"' + a + '"}',
                    cmpData: e
                }, function() {
                    y("#drawMockView").html('<iframe frameborder="no" width="100%" height="100%" src="' + 
a + '" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" style="position: absolute;left: 0px;"></iframe>');
                });
            });
        } else {
            var f = H.find(S.pages(), function(e) {
                return e.name == r;
            }), l = f.ruiPath, c = f.libPath, h = e("text!template/test/show.html");
            h = h.replace(/\_\_libDir\_\_/g, c).replace(/\_\_data\_\_/g, JSON.stringify(t)), v.saveApi("/api/refreshExample", {
                ext: '{"name":"refreshExample", "url":"' + l + 'test/show.html"}',
                cmpData: h
            }, function() {
                y("#drawMockView").html('<iframe frameborder="no" width="100%" height="100%" src="/' + l.substr(l.indexOf("src")) + 'test/show.html" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" style="position: absolute;left: 0px;"></iframe>');
            });
        }
    }), C.on("showTestResult", function() {
        var e = 
E.selectedComponents()[0], t = e.meta.name, n = H.find(S.pages(), function(e) {
            return e.name == t;
        }), r = n.ruiPath;
        y("#drawMockView").html('<iframe frameborder="no" width="100%" height="100%" src="/' + r.substr(r.indexOf("src")) + 'test/test.html" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" style="position: absolute;left: 0px;background:#fff;"></iframe>');
    }), C.on("save2test", function() {
        var e = E.selectedComponents()[0];
        if (e && e.meta.testCaseIns) {
            var t = /return ([\s\S]*?\])\;/g, n = t.exec(e.meta.testCaseIns), r = [];
            n && (r = JSON.parse(n[1])), r.push({
                data: C.getDataValue()
            }), e.meta.testCaseIns = e.meta.testCaseIns.replace(/(return )[\s\S]*?\](\;)/g, "$1" + JSON.stringify(r).replace(/\,/g, ",\n") + "$2"), A.confirm("\u63d0\u793a", "\u6210\u529f\u4fdd\u5b58\u5230caseIns\u4e2d,\u53ef\u4ee5\u7f16\u8f91JS\u67e5\u770b", null, null, 1e3
);
        }
    }), C.on("getTestData", function() {
        var e = E.selectedComponents()[0];
        if (e && e.meta.testCaseIns) {
            var t = /return ([\s\S]*?\])\;/g, n = t.exec(e.meta.testCaseIns), r = [];
            n && (r = JSON.parse(n[1]), r.length && C.setDataValue(r[Math.floor(Math.random() * r.length)].data));
        }
    }), E.on("save2pool", function(e) {
        var t = e.meta.name, n = H.find(S.pages(), function(e) {
            return e.name == t;
        }), r = b.export(!1, E.selectedComponents()[0]);
        if (n) v.saveApi(n.postUrl, {
            ext: JSON.stringify(n),
            cmpData: JSON.stringify(r.result)
        }, "\u64cd\u4f5c\u6210\u529f"); else {
            var i = new _, s = new D, o = new D, u = new D, a = new D, f = new D, l = new D, c = new D;
            s.add(new P({
                attributes: {
                    text: "\u7ec4\u4ef6\u63cf\u8ff0\uff1a"
                }
            }));
            var h = new O({
                
attributes: {
                    placeholder: "\u7ec4\u4ef6\u63cf\u8ff0"
                }
            });
            s.add(h), o.add(new P({
                attributes: {
                    text: "\u7f29\u7565\u56fe\u7247\uff1a"
                }
            }));
            var p = new O({
                attributes: {
                    text: "/.cmp/" + t + "/example.png"
                }
            });
            o.add(p), u.add(new P({
                attributes: {
                    text: "\u7ec4\u4ef6\u5730\u5740\uff1a"
                }
            }));
            var d = new O({
                attributes: {
                    text: "/.cmp/" + t + "/" + t + ".cmp"
                }
            });
            u.add(d), a.add(new P({
                attributes: {
                    text: "FTL\u5730\u5740\uff1a"
                }
            }));
            var m = new O({
                attributes: {
                    placeholder: "FTL\u6587\u4ef6\u5939\u7edd\u5bf9\u8def\u5f84\u5730\u5740/"
                
}
            });
            a.add(m), f.add(new P({
                attributes: {
                    text: "CSS\u5730\u5740\uff1a"
                }
            }));
            var g = new O({
                attributes: {
                    placeholder: "CSS\u6587\u4ef6\u5939\u7edd\u5bf9\u8def\u5f84\u5730\u5740/"
                }
            });
            f.add(g), l.add(new P({
                attributes: {
                    text: "RUI\u5730\u5740\uff1a"
                }
            }));
            var y = new O({
                attributes: {
                    placeholder: "Regular\u7ec4\u4ef6\u5bfc\u51fa\u6587\u4ef6\u5939\u7edd\u5bf9\u8def\u5f84\u5730\u5740/"
                }
            });
            l.add(y), c.add(new P({
                attributes: {
                    text: "LIB\u5730\u5740\uff1a"
                }
            }));
            var w = new O({
                attributes: {
                    placeholder: "\u6240\u4f9d\u8d56\u7684\u7ec4\u4ef6\u6c60lib\u5730\u5740('/src/javascript/lib/')"
                
}
            });
            c.add(w), i.add(s), i.add(o), i.add(u), A.popup("\u8bf7\u8f93\u5165\u76f8\u5173\u5185\u5bb9", i, function() {
                var e = {
                    name: t,
                    desc: h.text(),
                    img: p.text(),
                    url: d.text(),
                    postUrl: "/api/" + t
                };
                S.load([ e ]), v.saveApi(e.postUrl, {
                    ext: JSON.stringify(e),
                    cmpData: JSON.stringify(r.result)
                }, "\u64cd\u4f5c\u6210\u529f"), S.savePool();
            });
        }
    }), S.on("importProject", function() {
        B.importProject();
    }), S.on("importProjectFromUrl", function(e) {
        y.get(e, function(e) {
            b.importPage(JSON.parse(e));
        });
    });
    var F = new FileReader;
    return m.registerKey(!1, !0, !1, "s", function() {
        y("#cmd").css("display") == "none" ? B.showCmd() : y("#cmd").slideUp();
    }), m.registerKey(!1
, !0, !1, "c", function() {
        y("#editor").css("display") == "none" ? B.editorCode() : y("#editor").slideUp();
    }), e("elements/image"), e("elements/text"), e("elements/func"), e("elements/umi"), e("elements/timeline"), B;
});;