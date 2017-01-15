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
    return '<application>\r\n    <vbox height="100%">\r\n        <container prefer="40" style="margin-bottom:3px;">\r\n            <region name="toolbar" controller="@binding[toolbar]" height="100%"></region>\r\n        </container>\r\n        <hbox>\r\n            <tab prefer="200" maxTabWidth="67" minTabWidth="100">\r\n                <panel title="\u7ec4\u4ef6\u6c60">\r\n                    <region name="page" controller="@binding[page]" style="height:100%"></region>\r\n                </panel>\r\n                <panel title="\u7ec4\u4ef6">\r\n                    <region name="component" controller="@binding[component]" style="height:100%"></region>\r\n                </panel>\r\n                <panel title="\u5c42\u7ea7">\r\n                    <region name="hierarchy" controller="@binding[hierarchy]" style="height:100%"></region>\r\n                </panel>\r\n            </tab>\r\n            <region flex="1" name="viewport" style="margin:10px;" controller="@binding[viewport]"></region>\r\n            <region prefer="280" name="property" controller="@binding[property]"></region>\r\n        </hbox>\r\n    </vbox>\r\n</application>\r\n'
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
    }
}), define("app", [ "require", "qpf", "_", "text!modules/app.xml", "modules/router", "./controllerConfig", "knockout" ], function(e) {
    function u() {
        var n = e("knockout"), o = t.use("core/xmlparser"
), u = o.parse(r);
        document.body.appendChild(u), n.applyBindings(s, u), i.init("/");
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
                var i = e[t].execute.apply(window, r);
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
            e[i] && (e[i].execute.apply(
window, s), n.push(r));
        },
        register: function(t, n) {
            e[t] = n;
        }
    };
    return r;
}), define("modules/common/modal", [ "require", "qpf", "knockout" ], function(e) {
    var t = e("qpf"), n = t.use("core/clazz"), r = t.use("container/window"), i = t.use("container/container"), s = t.use("container/inline"), o = t.use("meta/button"), u = t.use("meta/label"), a = e("knockout"), f = new r({
        attributes: {
            "class": "qpf-modal"
        }
    }), l = new i, c = new s, h = new o({
        attributes: {
            text: "\u786e \u5b9a"
        }
    }), p = new o({
        attributes: {
            text: "\u53d6 \u6d88"
        }
    });
    f.add(l), f.add(c), c.add(h), c.add(p), f.render(), document.body.appendChild(f.$el[0]);
    var d = $('<div class="qpf-mask"></div>');
    document.body.appendChild(d[0]), f.$el.hide(), d.hide();
    var v = n.derive(function() {
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
        show: function() {
            var e = this;
            f.title(this.title), l.removeAll(), this.body && l.add(this.body), h.off("click"), p.off("click"), h.on("click", function() {
                e.onApply(e.hide);
            }), p.on("click", function() {
                e.onCancel(e.hide);
            }), f.$el.show(), d.show(), f.left(($(window).width() - f.$el.width()) / 2), f.top(($(window).height() - f.$el.height()) / 2 - 100);
        },
        hide: function() {
            f.$el.hide(), d.hide();
        }
    });
    return v.popup = function(e, t, n, r) {
        var i = new v({
            title: e,
            body: t,
            onApply: n || function(e) {
                e();
            },
            onCancel: r || function(e) {
                e();
            }
        });
        i.body.render(), i.show();
    
}, v.confirm = function(e, t, n, r) {
        var i = new v({
            title: e,
            body: new u({
                attributes: {
                    text: t
                },
                temporary: !0
            }),
            onApply: n || function(e) {
                e();
            },
            onCancel: r || function(e) {
                e();
            }
        });
        i.body.render(), i.show();
    }, v;
}), define("text!template/hover/hover.html", [], function() {
    return '<div class="e-hover-target">\r\n    <div class="e-hover-arrow"></div>\r\n    <div class="e-hover-content"></div>\r\n</div>';
}), define("text!template/hover/hover.css", [], function() {
    return ".e-hover-source:hover .e-hover-target {\r\n    display: block;\r\n}\r\n\r\n.e-hover-target {\r\n    display: none;\r\n    position: absolute;\r\n    left: 50%;\r\n    margin-top: -1px;\r\n    padding-top: 14px;\r\n    top: 100%;\r\n    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.10);\r\n}\r\n\r\n.e-hover-arrow {\r\n    position: absolute;\r\n    top: 7px;\r\n    /*left: 47%;*/\r\n    width: 20px;\r\n    height: 10px;\r\n    background: url(http://edu-image.nosdn.127.net/B59A8F7FC52C3FBC3D2C59023185CB8B.png?imageView&thumbnail=400y500&quality=100) no-repeat 9999px 9999px;\r\n    background-position: -136px -104px;\r\n    z-index: 1;\r\n}\r\n\r\n.e-hover-content {\r\n    padding: 10px 15px 15px;\r\n    background: #fff;\r\n    border: 1px solid #ddd;\r\n}"
;
}), define("text!template/cache/cacheItem.js", [], function() {
    return "/**\r\n     * __name__\r\n     * @param  {Object} _data\r\n     */\r\n    _p._$__name__ = function (_data, _onLoad) {\r\n        _cache._$request({\r\n            url: '__url__',\r\n            method: '__method__',\r\n            data: _data,\r\n            onload: _onLoad\r\n        });\r\n    };\r\n";
}), define("text!template/cache/dwrItem.js", [], function() {
    return "/**\r\n     * __name__\r\n     */\r\n    _p._$__name__ = function (_data, _onLoad) {\r\n        _dwr._$postDWR({\r\n            key: \"__name__\",\r\n            url: '__url__',\r\n            param: [_data],\r\n            onload: _onLoad\r\n        });\r\n    };\r\n";
}), define("text!template/cache/callCache.js", [], function() {
    return "__cacheName__Cache._$__funcName__(__reqData__, function (_data) {\r\n                __cb__\r\n            }._$bind(this));\r\n";
}), define("text!template/animate/animate.json", [], function() {
    
return '{\r\n    "common": ".animated{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both}.animated.infinite{-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.animated.hinge{-webkit-animation-duration:2s;animation-duration:2s}.animated.bounceIn,.animated.bounceOut{-webkit-animation-duration:.75s;animation-duration:.75s}.animated.flipOutX,.animated.flipOutY{-webkit-animation-duration:.75s;animation-duration:.75s}",\r\n    "list": {\r\n        "none": "",\r\n        "bounce": "@-webkit-keyframes bounce{0%,20%,53%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}40%,43%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0)}70%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0)}90%{-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0)}}@keyframes bounce{0%,20%,53%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}40%,43%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0)}70%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0)}90%{-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0)}}.bounce{-webkit-animation-name:bounce;animation-name:bounce;-webkit-transform-origin:center bottom;transform-origin:center bottom}",\r\n        "flash": "@-webkit-keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}@keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}.flash{-webkit-animation-name:flash;animation-name:flash}",\r\n        "pulse": "@-webkit-keyframes pulse{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}50%{-webkit-transform:scale3d(1.05,1.05,1.05);transform:scale3d(1.05,1.05,1.05)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes pulse{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}50%{-webkit-transform:scale3d(1.05,1.05,1.05);transform:scale3d(1.05,1.05,1.05)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.pulse{-webkit-animation-name:pulse;animation-name:pulse}",\r\n        "rubberBand": "@-webkit-keyframes rubberBand{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}30%{-webkit-transform:scale3d(1.25,0.75,1);transform:scale3d(1.25,0.75,1)}40%{-webkit-transform:scale3d(0.75,1.25,1);transform:scale3d(0.75,1.25,1)}50%{-webkit-transform:scale3d(1.15,0.85,1);transform:scale3d(1.15,0.85,1)}65%{-webkit-transform:scale3d(.95,1.05,1);transform:scale3d(.95,1.05,1)}75%{-webkit-transform:scale3d(1.05,.95,1);transform:scale3d(1.05,.95,1)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes rubberBand{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}30%{-webkit-transform:scale3d(1.25,0.75,1);transform:scale3d(1.25,0.75,1)}40%{-webkit-transform:scale3d(0.75,1.25,1);transform:scale3d(0.75,1.25,1)}50%{-webkit-transform:scale3d(1.15,0.85,1);transform:scale3d(1.15,0.85,1)}65%{-webkit-transform:scale3d(.95,1.05,1);transform:scale3d(.95,1.05,1)}75%{-webkit-transform:scale3d(1.05,.95,1);transform:scale3d(1.05,.95,1)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.rubberBand{-webkit-animation-name:rubberBand;animation-name:rubberBand}",\r\n        "shake": "@-webkit-keyframes shake{0%,100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}}@keyframes shake{0%,100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}}.shake{-webkit-animation-name:shake;animation-name:shake}",\r\n        "swing": "@-webkit-keyframes swing{20%{-webkit-transform:rotate3d(0,0,1,15deg);transform:rotate3d(0,0,1,15deg)}40%{-webkit-transform:rotate3d(0,0,1,-10deg);transform:rotate3d(0,0,1,-10deg)}60%{-webkit-transform:rotate3d(0,0,1,5deg);transform:rotate3d(0,0,1,5deg)}80%{-webkit-transform:rotate3d(0,0,1,-5deg);transform:rotate3d(0,0,1,-5deg)}100%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}}@keyframes swing{20%{-webkit-transform:rotate3d(0,0,1,15deg);transform:rotate3d(0,0,1,15deg)}40%{-webkit-transform:rotate3d(0,0,1,-10deg);transform:rotate3d(0,0,1,-10deg)}60%{-webkit-transform:rotate3d(0,0,1,5deg);transform:rotate3d(0,0,1,5deg)}80%{-webkit-transform:rotate3d(0,0,1,-5deg);transform:rotate3d(0,0,1,-5deg)}100%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}}.swing{-webkit-transform-origin:top center;transform-origin:top center;-webkit-animation-name:swing;animation-name:swing}",\r\n        "tada": "@-webkit-keyframes tada{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}10%,20%{-webkit-transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes tada{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}10%,20%{-webkit-transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.tada{-webkit-animation-name:tada;animation-name:tada}",\r\n        "wobble": "@-webkit-keyframes wobble{0%{-webkit-transform:none;transform:none}15%{-webkit-transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg);transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{-webkit-transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg);transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{-webkit-transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg);transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{-webkit-transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg);transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{-webkit-transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg);transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}100%{-webkit-transform:none;transform:none}}@keyframes wobble{0%{-webkit-transform:none;transform:none}15%{-webkit-transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg);transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{-webkit-transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg);transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{-webkit-transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg);transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{-webkit-transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg);transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{-webkit-transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg);transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}100%{-webkit-transform:none;transform:none}}.wobble{-webkit-animation-name:wobble;animation-name:wobble}",\r\n        "jello": "@-webkit-keyframes jello{11.1%{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-0.78125deg) skewY(-0.78125deg);transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-0.1953125deg) skewY(-0.1953125deg);transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}100%{-webkit-transform:none;transform:none}}@keyframes jello{11.1%{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-0.78125deg) skewY(-0.78125deg);transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-0.1953125deg) skewY(-0.1953125deg);transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}100%{-webkit-transform:none;transform:none}}.jello{-webkit-animation-name:jello;animation-name:jello;-webkit-transform-origin:center;transform-origin:center}",\r\n        "bounceIn": "@-webkit-keyframes bounceIn{0%,20%,40%,60%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes bounceIn{0%,20%,40%,60%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.bounceIn{-webkit-animation-name:bounceIn;animation-name:bounceIn}",\r\n        "bounceInDown": "@-webkit-keyframes bounceInDown{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,-3000px,0);transform:translate3d(0,-3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,25px,0);transform:translate3d(0,25px,0)}75%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}90%{-webkit-transform:translate3d(0,5px,0);transform:translate3d(0,5px,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInDown{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,-3000px,0);transform:translate3d(0,-3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,25px,0);transform:translate3d(0,25px,0)}75%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}90%{-webkit-transform:translate3d(0,5px,0);transform:translate3d(0,5px,0)}100%{-webkit-transform:none;transform:none}}.bounceInDown{-webkit-animation-name:bounceInDown;animation-name:bounceInDown}",\r\n        "bounceInLeft": "@-webkit-keyframes bounceInLeft{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(-3000px,0,0);transform:translate3d(-3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(25px,0,0);transform:translate3d(25px,0,0)}75%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}90%{-webkit-transform:translate3d(5px,0,0);transform:translate3d(5px,0,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInLeft{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(-3000px,0,0);transform:translate3d(-3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(25px,0,0);transform:translate3d(25px,0,0)}75%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}90%{-webkit-transform:translate3d(5px,0,0);transform:translate3d(5px,0,0)}100%{-webkit-transform:none;transform:none}}.bounceInLeft{-webkit-animation-name:bounceInLeft;animation-name:bounceInLeft}",\r\n        "bounceInRight": "@-webkit-keyframes bounceInRight{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(3000px,0,0);transform:translate3d(3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(-25px,0,0);transform:translate3d(-25px,0,0)}75%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}90%{-webkit-transform:translate3d(-5px,0,0);transform:translate3d(-5px,0,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInRight{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(3000px,0,0);transform:translate3d(3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(-25px,0,0);transform:translate3d(-25px,0,0)}75%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}90%{-webkit-transform:translate3d(-5px,0,0);transform:translate3d(-5px,0,0)}100%{-webkit-transform:none;transform:none}}.bounceInRight{-webkit-animation-name:bounceInRight;animation-name:bounceInRight}",\r\n        "bounceInUp": "@-webkit-keyframes bounceInUp{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,3000px,0);transform:translate3d(0,3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,3000px,0);transform:translate3d(0,3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;animation-name:bounceInUp}",\r\n        "bounceOut": "@-webkit-keyframes bounceOut{20%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}}@keyframes bounceOut{20%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}}.bounceOut{-webkit-animation-name:bounceOut;animation-name:bounceOut}",\r\n        "bounceOutDown": "@-webkit-keyframes bounceOutDown{20%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}@keyframes bounceOutDown{20%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}.bounceOutDown{-webkit-animation-name:bounceOutDown;animation-name:bounceOutDown}",\r\n        "bounceOutLeft": "@-webkit-keyframes bounceOutLeft{20%{opacity:1;-webkit-transform:translate3d(20px,0,0);transform:translate3d(20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}@keyframes bounceOutLeft{20%{opacity:1;-webkit-transform:translate3d(20px,0,0);transform:translate3d(20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}.bounceOutLeft{-webkit-animation-name:bounceOutLeft;animation-name:bounceOutLeft}",\r\n        "bounceOutRight": "@-webkit-keyframes bounceOutRight{20%{opacity:1;-webkit-transform:translate3d(-20px,0,0);transform:translate3d(-20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}@keyframes bounceOutRight{20%{opacity:1;-webkit-transform:translate3d(-20px,0,0);transform:translate3d(-20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}.bounceOutRight{-webkit-animation-name:bounceOutRight;animation-name:bounceOutRight}",\r\n        "bounceOutUp": "@-webkit-keyframes bounceOutUp{20%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,20px,0);transform:translate3d(0,20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}@keyframes bounceOutUp{20%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,20px,0);transform:translate3d(0,20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}.bounceOutUp{-webkit-animation-name:bounceOutUp;animation-name:bounceOutUp}",\r\n        "fadeIn": "@-webkit-keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}.fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}",\r\n        "fadeInDown": "@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInDown{-webkit-animation-name:fadeInDown;animation-name:fadeInDown}",\r\n        "fadeInDownBig": "@-webkit-keyframes fadeInDownBig{0%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInDownBig{0%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInDownBig{-webkit-animation-name:fadeInDownBig;animation-name:fadeInDownBig}",\r\n        "fadeInLeft": "@-webkit-keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInLeft{-webkit-animation-name:fadeInLeft;animation-name:fadeInLeft}",\r\n        "fadeInLeftBig": "@-webkit-keyframes fadeInLeftBig{0%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInLeftBig{0%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInLeftBig{-webkit-animation-name:fadeInLeftBig;animation-name:fadeInLeftBig}",\r\n        "fadeInRight": "@-webkit-keyframes fadeInRight{0%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInRight{0%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInRight{-webkit-animation-name:fadeInRight;animation-name:fadeInRight}",\r\n        "fadeInRightBig": "@-webkit-keyframes fadeInRightBig{0%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInRightBig{0%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInRightBig{-webkit-animation-name:fadeInRightBig;animation-name:fadeInRightBig}",\r\n        "fadeInUp": "@-webkit-keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp}",\r\n        "fadeInUpBig": "@-webkit-keyframes fadeInUpBig{0%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInUpBig{0%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInUpBig{-webkit-animation-name:fadeInUpBig;animation-name:fadeInUpBig}",\r\n        "fadeOut": "@-webkit-keyframes fadeOut{0%{opacity:1}100%{opacity:0}}@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}.fadeOut{-webkit-animation-name:fadeOut;animation-name:fadeOut}",\r\n        "fadeOutDown": "@-webkit-keyframes fadeOutDown{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}@keyframes fadeOutDown{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}.fadeOutDown{-webkit-animation-name:fadeOutDown;animation-name:fadeOutDown}",\r\n        "fadeOutDownBig": "@-webkit-keyframes fadeOutDownBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}@keyframes fadeOutDownBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}.fadeOutDownBig{-webkit-animation-name:fadeOutDownBig;animation-name:fadeOutDownBig}",\r\n        "fadeOutLeft": "@-webkit-keyframes fadeOutLeft{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}@keyframes fadeOutLeft{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}.fadeOutLeft{-webkit-animation-name:fadeOutLeft;animation-name:fadeOutLeft}",\r\n        "fadeOutLeftBig": "@-webkit-keyframes fadeOutLeftBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}@keyframes fadeOutLeftBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}.fadeOutLeftBig{-webkit-animation-name:fadeOutLeftBig;animation-name:fadeOutLeftBig}",\r\n        "fadeOutRight": "@-webkit-keyframes fadeOutRight{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}@keyframes fadeOutRight{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}.fadeOutRight{-webkit-animation-name:fadeOutRight;animation-name:fadeOutRight}",\r\n        "fadeOutRightBig": "@-webkit-keyframes fadeOutRightBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}@keyframes fadeOutRightBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}.fadeOutRightBig{-webkit-animation-name:fadeOutRightBig;animation-name:fadeOutRightBig}",\r\n        "fadeOutUp": "@-webkit-keyframes fadeOutUp{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}@keyframes fadeOutUp{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}.fadeOutUp{-webkit-animation-name:fadeOutUp;animation-name:fadeOutUp}",\r\n        "fadeOutUpBig": "@-webkit-keyframes fadeOutUpBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}@keyframes fadeOutUpBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}.fadeOutUpBig{-webkit-animation-name:fadeOutUpBig;animation-name:fadeOutUpBig}",\r\n        "flip": "@-webkit-keyframes flip{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-360deg);transform:perspective(400px) rotate3d(0,1,0,-360deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}40%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}50%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}80%{-webkit-transform:perspective(400px) scale3d(.95,.95,.95);transform:perspective(400px) scale3d(.95,.95,.95);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}100%{-webkit-transform:perspective(400px);transform:perspective(400px);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}}@keyframes flip{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-360deg);transform:perspective(400px) rotate3d(0,1,0,-360deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}40%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}50%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}80%{-webkit-transform:perspective(400px) scale3d(.95,.95,.95);transform:perspective(400px) scale3d(.95,.95,.95);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}100%{-webkit-transform:perspective(400px);transform:perspective(400px);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}}.animated.flip{-webkit-backface-visibility:visible;backface-visibility:visible;-webkit-animation-name:flip;animation-name:flip}",\r\n        "flipInX": "@-webkit-keyframes flipInX{0%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(1,0,0,10deg);transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-5deg);transform:perspective(400px) rotate3d(1,0,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInX{0%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(1,0,0,10deg);transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-5deg);transform:perspective(400px) rotate3d(1,0,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}.flipInX{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInX;animation-name:flipInX}",\r\n        "flipInY": "@-webkit-keyframes flipInY{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-20deg);transform:perspective(400px) rotate3d(0,1,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(0,1,0,10deg);transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-5deg);transform:perspective(400px) rotate3d(0,1,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInY{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-20deg);transform:perspective(400px) rotate3d(0,1,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(0,1,0,10deg);transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-5deg);transform:perspective(400px) rotate3d(0,1,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}.flipInY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInY;animation-name:flipInY}",\r\n        "flipOutX": "@-webkit-keyframes flipOutX{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}@keyframes flipOutX{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}.flipOutX{-webkit-animation-name:flipOutX;animation-name:flipOutX;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}",\r\n        "flipOutY": "@-webkit-keyframes flipOutY{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-15deg);transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}@keyframes flipOutY{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-15deg);transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}.flipOutY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipOutY;animation-name:flipOutY}",\r\n        "lightSpeedIn": "@-webkit-keyframes lightSpeedIn{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg);opacity:1}100%{-webkit-transform:none;transform:none;opacity:1}}@keyframes lightSpeedIn{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg);opacity:1}100%{-webkit-transform:none;transform:none;opacity:1}}.lightSpeedIn{-webkit-animation-name:lightSpeedIn;animation-name:lightSpeedIn;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}",\r\n        "lightSpeedOut": "@-webkit-keyframes lightSpeedOut{0%{opacity:1}100%{-webkit-transform:translate3d(100%,0,0) skewX(30deg);transform:translate3d(100%,0,0) skewX(30deg);opacity:0}}@keyframes lightSpeedOut{0%{opacity:1}100%{-webkit-transform:translate3d(100%,0,0) skewX(30deg);transform:translate3d(100%,0,0) skewX(30deg);opacity:0}}.lightSpeedOut{-webkit-animation-name:lightSpeedOut;animation-name:lightSpeedOut;-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}",\r\n        "rotateIn": "@-webkit-keyframes rotateIn{0%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,-200deg);transform:rotate3d(0,0,1,-200deg);opacity:0}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateIn{0%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,-200deg);transform:rotate3d(0,0,1,-200deg);opacity:0}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:none;transform:none;opacity:1}}.rotateIn{-webkit-animation-name:rotateIn;animation-name:rotateIn}",\r\n        "rotateInDownLeft": "@-webkit-keyframes rotateInDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInDownLeft{-webkit-animation-name:rotateInDownLeft;animation-name:rotateInDownLeft}",\r\n        "rotateInDownRight": "@-webkit-keyframes rotateInDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInDownRight{-webkit-animation-name:rotateInDownRight;animation-name:rotateInDownRight}",\r\n        "rotateInUpLeft": "@-webkit-keyframes rotateInUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInUpLeft{-webkit-animation-name:rotateInUpLeft;animation-name:rotateInUpLeft}",\r\n        "rotateInUpRight": "@-webkit-keyframes rotateInUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-90deg);transform:rotate3d(0,0,1,-90deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-90deg);transform:rotate3d(0,0,1,-90deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInUpRight{-webkit-animation-name:rotateInUpRight;animation-name:rotateInUpRight}",\r\n        "rotateOut": "@-webkit-keyframes rotateOut{0%{-webkit-transform-origin:center;transform-origin:center;opacity:1}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,200deg);transform:rotate3d(0,0,1,200deg);opacity:0}}@keyframes rotateOut{0%{-webkit-transform-origin:center;transform-origin:center;opacity:1}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,200deg);transform:rotate3d(0,0,1,200deg);opacity:0}}.rotateOut{-webkit-animation-name:rotateOut;animation-name:rotateOut}",\r\n        "rotateOutDownLeft": "@-webkit-keyframes rotateOutDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}}@keyframes rotateOutDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}}.rotateOutDownLeft{-webkit-animation-name:rotateOutDownLeft;animation-name:rotateOutDownLeft}",\r\n        "rotateOutDownRight": "@-webkit-keyframes rotateOutDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}@keyframes rotateOutDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}.rotateOutDownRight{-webkit-animation-name:rotateOutDownRight;animation-name:rotateOutDownRight}",\r\n        "rotateOutUpLeft": "@-webkit-keyframes rotateOutUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}@keyframes rotateOutUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}.rotateOutUpLeft{-webkit-animation-name:rotateOutUpLeft;animation-name:rotateOutUpLeft}",\r\n        "rotateOutUpRight": "@-webkit-keyframes rotateOutUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,90deg);transform:rotate3d(0,0,1,90deg);opacity:0}}@keyframes rotateOutUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,90deg);transform:rotate3d(0,0,1,90deg);opacity:0}}.rotateOutUpRight{-webkit-animation-name:rotateOutUpRight;animation-name:rotateOutUpRight}",\r\n        "hinge": "@-webkit-keyframes hinge{0%{-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}20%,60%{-webkit-transform:rotate3d(0,0,1,80deg);transform:rotate3d(0,0,1,80deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}40%,80%{-webkit-transform:rotate3d(0,0,1,60deg);transform:rotate3d(0,0,1,60deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;opacity:1}100%{-webkit-transform:translate3d(0,700px,0);transform:translate3d(0,700px,0);opacity:0}}@keyframes hinge{0%{-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}20%,60%{-webkit-transform:rotate3d(0,0,1,80deg);transform:rotate3d(0,0,1,80deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}40%,80%{-webkit-transform:rotate3d(0,0,1,60deg);transform:rotate3d(0,0,1,60deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;opacity:1}100%{-webkit-transform:translate3d(0,700px,0);transform:translate3d(0,700px,0);opacity:0}}.hinge{-webkit-animation-name:hinge;animation-name:hinge}",\r\n        "rollIn": "@-webkit-keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg);transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg);transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}100%{opacity:1;-webkit-transform:none;transform:none}}.rollIn{-webkit-animation-name:rollIn;animation-name:rollIn}",\r\n        "rollOut": "@-webkit-keyframes rollOut{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg);transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}@keyframes rollOut{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg);transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}.rollOut{-webkit-animation-name:rollOut;animation-name:rollOut}",\r\n        "zoomIn": "@-webkit-keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}.zoomIn{-webkit-animation-name:zoomIn;animation-name:zoomIn}",\r\n        "zoomInDown": "@-webkit-keyframes zoomInDown{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInDown{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInDown{-webkit-animation-name:zoomInDown;animation-name:zoomInDown}",\r\n        "zoomInLeft": "@-webkit-keyframes zoomInLeft{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(10px,0,0);transform:scale3d(.475,.475,.475) translate3d(10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInLeft{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(10px,0,0);transform:scale3d(.475,.475,.475) translate3d(10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInLeft{-webkit-animation-name:zoomInLeft;animation-name:zoomInLeft}",\r\n        "zoomInRight": "@-webkit-keyframes zoomInRight{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInRight{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInRight{-webkit-animation-name:zoomInRight;animation-name:zoomInRight}",\r\n        "zoomInUp": "@-webkit-keyframes zoomInUp{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInUp{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInUp{-webkit-animation-name:zoomInUp;animation-name:zoomInUp}",\r\n        "zoomOut": "@-webkit-keyframes zoomOut{0%{opacity:1}50%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}100%{opacity:0}}@keyframes zoomOut{0%{opacity:1}50%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}100%{opacity:0}}.zoomOut{-webkit-animation-name:zoomOut;animation-name:zoomOut}",\r\n        "zoomOutDown": "@-webkit-keyframes zoomOutDown{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomOutDown{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomOutDown{-webkit-animation-name:zoomOutDown;animation-name:zoomOutDown}",\r\n        "zoomOutLeft": "@-webkit-keyframes zoomOutLeft{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(42px,0,0);transform:scale3d(.475,.475,.475) translate3d(42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(-2000px,0,0);transform:scale(.1) translate3d(-2000px,0,0);-webkit-transform-origin:left center;transform-origin:left center}}@keyframes zoomOutLeft{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(42px,0,0);transform:scale3d(.475,.475,.475) translate3d(42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(-2000px,0,0);transform:scale(.1) translate3d(-2000px,0,0);-webkit-transform-origin:left center;transform-origin:left center}}.zoomOutLeft{-webkit-animation-name:zoomOutLeft;animation-name:zoomOutLeft}",\r\n        "zoomOutRight": "@-webkit-keyframes zoomOutRight{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-42px,0,0);transform:scale3d(.475,.475,.475) translate3d(-42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(2000px,0,0);transform:scale(.1) translate3d(2000px,0,0);-webkit-transform-origin:right center;transform-origin:right center}}@keyframes zoomOutRight{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-42px,0,0);transform:scale3d(.475,.475,.475) translate3d(-42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(2000px,0,0);transform:scale(.1) translate3d(2000px,0,0);-webkit-transform-origin:right center;transform-origin:right center}}.zoomOutRight{-webkit-animation-name:zoomOutRight;animation-name:zoomOutRight}",\r\n        "zoomOutUp": "@-webkit-keyframes zoomOutUp{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomOutUp{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomOutUp{-webkit-animation-name:zoomOutUp;animation-name:zoomOutUp}",\r\n        "slideInDown": "@-webkit-keyframes slideInDown{0%{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInDown{0%{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInDown{-webkit-animation-name:slideInDown;animation-name:slideInDown}",\r\n        "slideInLeft": "@-webkit-keyframes slideInLeft{0%{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInLeft{0%{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInLeft{-webkit-animation-name:slideInLeft;animation-name:slideInLeft}",\r\n        "slideInRight": "@-webkit-keyframes slideInRight{0%{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInRight{0%{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInRight{-webkit-animation-name:slideInRight;animation-name:slideInRight}",\r\n        "slideInUp": "@-webkit-keyframes slideInUp{0%{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInUp{0%{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInUp{-webkit-animation-name:slideInUp;animation-name:slideInUp}",\r\n        "slideOutDown": "@-webkit-keyframes slideOutDown{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}@keyframes slideOutDown{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}.slideOutDown{-webkit-animation-name:slideOutDown;animation-name:slideOutDown}",\r\n        "slideOutLeft": "@-webkit-keyframes slideOutLeft{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}@keyframes slideOutLeft{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}.slideOutLeft{-webkit-animation-name:slideOutLeft;animation-name:slideOutLeft}",\r\n        "slideOutRight": "@-webkit-keyframes slideOutRight{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}@keyframes slideOutRight{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}.slideOutRight{-webkit-animation-name:slideOutRight;animation-name:slideOutRight}",\r\n        "slideOutUp": "@-webkit-keyframes slideOutUp{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}@keyframes slideOutUp{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}.slideOutUp{-webkit-animation-name:slideOutUp;animation-name:slideOutUp}"\r\n    }\r\n}\r\n'
;
}), define("text!template/animate/animate.js", [], function() {
    return '//\u6eda\u52a8\u5230\u663e\u793a\u7684\u65f6\u5019 \u89e6\u53d1\u52a8\u753b\r\nfunction scrollShow() {\r\n    var x = document.getElementsByClassName("animated");\r\n    for (i = 0; i < x.length; i++) {\r\n        var item = x[i];\r\n        var _cls = item.className;\r\n        if (_cls.indexOf("aniover") >= 0) {\r\n            return;\r\n        }\r\n        var top = item.getBoundingClientRect().top;\r\n        var se = document.documentElement.clientHeight;\r\n\r\n        if (top <= se) {\r\n            var _ani = _cls.substring(_cls.indexOf("animated"));\r\n            item.className = _cls.substring(0, _cls.indexOf("animated"));\r\n            setTimeout(function () {\r\n                item.className = item.className + " " + _ani + " aniover";\r\n            }, 100);\r\n\r\n        }\r\n    }\r\n}\r\n\r\nwindow.onscroll = function () {\r\n    scrollShow();\r\n}\r\nscrollShow();\r\n';
}), define("core/element"
, [ "require", "qpf", "knockout", "$", "_", "onecolor", "ko.mapping", "modules/common/modal", "./command", "text!template/hover/hover.html", "text!template/hover/hover.css", "text!template/cache/cacheItem.js", "text!template/cache/dwrItem.js", "text!template/cache/callCache.js", "text!template/animate/animate.json", "text!template/animate/animate.js" ], function(e) {
    function E(e) {
        return w[e] || (w[e] = 0), e + "_" + w[e]++;
    }
    function x() {
        return S++;
    }
    function N() {
        return T++;
    }
    var t = e("qpf"), n = e("knockout"), r = e("$"), i = e("_"), s = e("onecolor"), o = e("ko.mapping"), u = e("modules/common/modal"), a = e("./command"), f = e("text!template/hover/hover.html"), l = e("text!template/hover/hover.css"), c = e("text!template/cache/cacheItem.js"), h = e("text!template/cache/dwrItem.js"), p = e("text!template/cache/callCache.js"), d = t.helper.Draggable, v = JSON.parse(e("text!template/animate/animate.json")), m = e("text!template/animate/animate.js"
), g = [];
    for (var y in v.list) g.push({
        text: y,
        value: y
    });
    var b = t.core.Clazz.derive(function() {
        var e = n.observable(!1), t = n.observable(!1), i = n.computed({
            read: function() {
                return e() && o.properties.backgroundImageType() === "gradient";
            },
            deferEvaluation: !0
        }), s = n.computed({
            read: function() {
                return e() && o.properties.backgroundImageType() === "file";
            }
        }), o = {
            name: "",
            icon: "",
            eid: x(),
            $wrapper: r("<div><a style='display:inline-block;width:100%;'></a></div>"),
            type: "ELEMENT",
            properties: {
                id: n.observable(""),
                rid: n.observable(""),
                width: n.observable(100),
                height: n.observable(100),
                left: n.observable(0),
                top: n.observable(0),
                zIndex
: n.observable(0),
                boxColor: n.observable("#000000"),
                border: t,
                borderColor: n.observable(5617961),
                background: e,
                backgroundColor: n.observable(16777215),
                backgroundAlpha: n.observable(1),
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
                borderBottomLeftRadius: n.observable
(0),
                marginTop: n.observable(0),
                marginRight: n.observable(0),
                marginBottom: n.observable(0),
                marginLeft: n.observable(0),
                paddingTop: n.observable(0),
                paddingRight: n.observable(0),
                paddingBottom: n.observable(0),
                paddingLeft: n.observable(0),
                hasShadow: n.observable(!1),
                shadowOffsetX: n.observable(0),
                shadowOffsetY: n.observable(0),
                shadowBlur: n.observable(10),
                shadowColor: n.observable(0),
                shadowColorAlpha: n.observable(1),
                boxFontSize: n.observable(16),
                newBlank: n.observable(!1),
                targetUrl: n.observable(""),
                boxClassStr: n.observable(""),
                overflowX: n.observable(!1),
                overflowY: n.observable(!1),
                hover: n.observable(!1),
                hoverComponent
: n.observable(""),
                hoverStr: n.observable(""),
                animateStr: n.observable("none")
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
                    type: "spinner",
                    value: u.left
,
                    precision: 0,
                    step: 1
                }, {
                    name: "top",
                    type: "spinner",
                    value: u.top,
                    precision: 0,
                    step: 1
                } ]
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
            border: {
                label: "\u8fb9\u6846",
                ui: "checkbox",
                field: "style",
                checked: t
            },
            borderColor: {
                label: "\u8fb9\u6846\u8272",
                ui: "color",
                field: "style",
                color: u.borderColor,
                visible: t
            },
            background: {
                label: "\u80cc\u666f",
                ui: "checkbox",
                field: "style",
                checked: e
            },
            backgroundColor: {
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
                label: "background",
                field: "style",
                ui: "textfield",
                text: u.backgroundImageStr,
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
                    type: "slider",
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
                    type: "slider",
                    value: u.marginTop,
                    precision: 0,
                    step: 1,
                    min: -20,
                    max: 50
                }, {
                    name: "right",
                    type: "textfield",
                    text: u.marginRight,
                    value: u.marginRight
                }, {
                    name: "bottom",
                    type: "slider",
                    value: u.marginBottom,
                    precision: 0,
                    step: 1,
                    min: -20,
                    max: 50
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
                    type: "slider",
                    value: u.paddingTop,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50
                }, {
                    name: "right",
                    type: "slider",
                    value: u.paddingRight,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50
                }, {
                    name: "bottom",
                    type: "slider",
                    value: u.paddingBottom,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50
                
}, {
                    name: "left",
                    type: "slider",
                    value: u.paddingLeft,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50
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
                
label: "\u8d85\u94fe\u63a5",
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
                ui: "textfield",
                field: "style",
                text: u.boxClassStr
            },
            overflowX: {
                label: "overflowX",
                ui: "checkbox",
                field: "layout",
                checked: u.overflowX
            },
            overflowY: {
                label: "overflowY",
                ui: "checkbox",
                field: "layout",
                checked: u.overflowY
            
},
            hover: {
                label: "Hover",
                ui: "checkbox",
                field: "layout",
                checked: u.hover
            },
            hoverComponent: {
                label: "HoverC",
                ui: "textfield",
                field: "layout",
                text: u.hoverComponent
            },
            hoverStr: {
                label: "HoverStr",
                ui: "textarea",
                text: u.hoverStr
            },
            animateStr: {
                label: "\u52a8\u753b",
                ui: "combobox",
                "class": "small",
                items: g,
                value: u.animateStr
            }
        }, o;
    }, {
        initialize: function(e) {
            this.$wrapper.attr("data-cmp-eid", this.eid);
            var t = this, o = t.properties;
            if (e) {
                if (e.extendProperties) {
                    var u = e.extendProperties.call(this);
                    u && 
i.extend(o, u);
                }
                if (e.extendUIConfig) {
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
                    t.$wrapper.css({
                        "z-index": t.properties.zIndex()
                    });
                }
            }
), n.computed({
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
                    var e = t.properties.boxClassStr();
                    t.$wrapper.attr({
                        "class": e
                    });
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.hoverStr();
                    e ? t.$wrapper.attr({
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
                    var e = t.properties.overflowX(), n = t.properties.overflowY();
                    e && n && t.$wrapper.css({
                        overflow: "hidden"
                    }), e ? t.$wrapper.css({
                        "overflow-x": "hidden"
                    }) : t.$wrapper.css({
                        "overflow-x": ""
                    }), n ? t.$wrapper.css({
                        "overflow-y": "hidden"
                    }) : t.$wrapper.
css({
                        "overflow-y": ""
                    });
                }
            }), n.computed({
                read: function() {
                    var e = t.uiConfig.borderRadius.items, n = t.uiConfig.margin.items, r = t.uiConfig.padding.items;
                    t.$wrapper.css({
                        "border-radius": i.map(e, function(e) {
                            return Math.round(e.value()) + "px";
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
                    "font-size"
: t.properties.boxFontSize()
                });
            }), n.computed(function() {
                var e = t.properties.animateStr(), n = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
                e && (t.$wrapper.hasClass("animated") || t.$wrapper.addClass("animated"), t.$wrapper.addClass(e).one(n, function() {
                    r(this).removeClass(e);
                }));
            }), n.computed({
                read: function() {
                    var e = t.properties.border(), n = t.properties.borderColor();
                    e ? t.$wrapper.css({
                        border: "1px solid " + s(n).css()
                    }) : t.$wrapper.css({
                        border: ""
                    });
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.background(), n = t.properties.backgroundColor(), r = t.properties.backgroundAlpha(), o = s(n);
                    
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
                                "background-image": "-webkit-" + l,
                                "background-image"
: "-moz-" + l,
                                "background-image": l
                            });
                            break;
                          case "file":
                            t.$wrapper.css({
                                background: u
                            });
                        }
                    } else t.$wrapper.css({
                        background: ""
                    });
                }
            }), n.computed({
                read: function() {
                    var e = t.properties.hover(), n = t.properties.hoverComponent();
                    e ? (t.$wrapper.find(".e-hover-target").remove(), t.properties.boxClassStr().indexOf("e-hover-source") < 0 && t.properties.boxClassStr(t.properties.boxClassStr() + " e-hover-source"), t.$wrapper.css({
                        cursor: "pointer"
                    }), t.$wrapper.append(f), n && t.trigger("addHoverComponent", n, t.$wrapper.find(".e-hover-content"))) : (t.$wrapper.removeClass
("e-hover-source"), t.$wrapper.find(".e-hover-target").remove());
                }
            }), n.computed({
                read: function() {
                    var e = t.properties, n = Math.round(e.shadowOffsetX()) + "px", r = Math.round(e.shadowOffsetY()) + "px", i = Math.round(e.shadowBlur()) + "px", o = Math.round(e.shadowColor()), u = e.shadowColorAlpha(), a = s(o);
                    a._alpha = u, i && e.hasShadow() ? t.$wrapper.css({
                        "box-shadow": [ n, r, i, a.cssa() ].join(" ")
                    }) : t.$wrapper.css({
                        "box-shadow": ""
                    });
                }
            }), t.$wrapper.css({
                position: "absolute"
            }), this.properties.boxClassStr("cmp-element cmp-" + this.type.toLowerCase()), this.onCreate(this.$wrapper), this.properties.id() || this.properties.id(E(this.type));
        },
        syncPositionManually: function() {
            var e = parseInt(this.$wrapper.css("left"
)), t = parseInt(this.$wrapper.css("top"));
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
            return this.properties.requestType() != "dwr" ? e = c.replace(/\_\_name\_\_/g, 
this.properties.requestName()).replace(/\_\_url\_\_/g, this.properties.requestUrl()).replace(/\_\_method\_\_/g, this.properties.requestType()) : e = h.replace(/\_\_name\_\_/g, this.properties.requestName()).replace(/\_\_url\_\_/g, this.properties.requestUrl()), t = p.replace(/\_\_funcName\_\_/g, this.properties.requestName()).replace(/\_\_reqData\_\_/g, this.properties.requestParam()).replace(/\_\_cb\_\_/g, this.properties.onLoadFunc()), {
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
            this.properties.zIndex(
e);
        },
        setPosition: function(e) {
            this.$wrapper.css({
                position: e
            });
        },
        getName: function() {
            var e = this.properties.id();
            return this.isContainer() ? e.substring(0, e.indexOf("container") - 1) : "example";
        },
        getCss: function(e, t, n) {
            if (e.children().length < 1) return;
            var i = this, s = "", o = t, u = "";
            r.each(e.children(), function(e, a) {
                u = r(a).attr("class"), u && r(a).attr({
                    "class": i.removeCMPClass(u)
                }), s = r(a).attr("style"), s ? (o = t + "_" + r(a).prop("tagName").toLowerCase() + N(), n.push("." + o + "{" + s + "}"), r(a).removeAttr("style"), r(a).addClass(o)) : o = r(a).attr("class"), i.getCss(r(a), o, n);
            });
        },
        getHTMLCSS: function(e, t) {
            var n = r("<div></div>").append(e), i = [];
            return this.getCss(n, t, i), {
                
html: n.html(),
                css: i.join("")
            };
        },
        removeCMPClass: function(e) {
            return e = r.trim(e), i.each(e.split(" "), function(t, n) {
                if (t.indexOf("cmp") >= 0 || t.indexOf("qpf") >= 0) e = e.replace(t, "");
            }), e = e.replace(/\s+/g, " "), e;
        },
        getCSS3String: function(e) {
            if (!e) return;
            var t = e.split(":")[0];
            return "box-shadow_".indexOf(t) >= 0 ? (e = e.split(":")[1], e.indexOf(";") < 0 && (e += ";"), "-webkit-" + t + ":" + e + "-moz-" + t + ":" + e + "" + t + ":" + e + "") : e + ";";
        },
        exportHTMLCSS: function() {
            this.$wrapper.find(".element-select-outline").remove();
            var e = "", t = this.type, n = this.properties.boxClassStr(), r = this.properties.hoverStr(), i = this.properties.animateStr(), s = this.properties.rid(), o = "", a = "";
            i != "none" ? (a += v.common, a += v.list[i], n = this.removeCMPClass
(n) + " animated " + i) : n = this.removeCMPClass(n), this.$wrapper.html().indexOf("animated") >= 0 && u.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u4e2d\u542b\u6709\u52a8\u753b\uff0c\u8bf7\u4e0b\u8f7danimate.min.css", function(e) {
                e();
            }, function(e) {
                e();
            }), s && (o = " id='" + s + "'");
            var f = {};
            return !this.$wrapper.hasClass("e-hover-source") && !this.$wrapper.hasClass("cmp-func") && !this.$wrapper.find("a").attr("href") ? f = this.getHTMLCSS(this.$wrapper.find("a").html(), this.properties.id()) : f = this.getHTMLCSS(this.$wrapper.html(), this.properties.id()), e = "<div" + o + " class='" + this.properties.id() + " " + n + "'>" + f.html + "</div>", a += f.css, this.isContainer() && this.$wrapper.css({
                position: "relative"
            }), a += "." + this.properties.id() + " {" + this.$wrapper.attr("style") + "}", r && (a += "." + this.properties.id() + ":hover {" + this.getCSS3String(r) + "}"
), this.$wrapper.html().indexOf("e-hover-source") >= 0 && (a += l), e = e.replace(/data-cmp-eid\=\"(\d*)\"/g, "").replace(/\s+\'/g, "'"), {
                html: e,
                css: a
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
    }), w = {}, S = 1, T = 1;
    return b;
}), define("core/factory", [ "require", "./element", "ko.mapping", "_", "$" ], function(e) {
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
            r.id = a(i), r.left += 10, r.top += 10;
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
    }, a = function() {
        var e = {};
        return function(t) {
            e[t] || (e[t] = 0);
            var n = t + "_\u590d\u5236";
            return e[t] && (n += e[t]), e[t]++, n;
        };
    }();
    return u;
}), define("elements/func", [ "require", "core/factory", "knockout" ]
, function(e) {
    var t = e("core/factory"), n = e("knockout");
    t.register("func", {
        type: "FUNC",
        extendProperties: function() {
            return {
                text: n.observable("\u51fd\u6570"),
                funcType: n.observable("IF"),
                funcLanguage: n.observable("FTL"),
                ifFuncItem: n.observable(""),
                trueFuncBody: n.observable(""),
                falseFuncBody: n.observable(""),
                forFuncItem: n.observable(""),
                forFuncBody: n.observable(""),
                requestName: n.observable(""),
                requestUrl: n.observable(""),
                requestType: n.observable("post"),
                requestParam: n.observable("{}"),
                onLoadFunc: n.observable(""),
                includeBody: n.observable(""),
                positionStr: n.observable("absolute")
            };
        },
        extendUIConfig: function() {
            var e = this;
            
return {
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
                    value: this.properties.positionStr
                },
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
                    ui: "textfield",
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
                    
ui: "textfield",
                    field: "func",
                    text: this.properties.trueFuncBody,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "IF";
                        }
                    })
                },
                falseFuncBody: {
                    label: "IfFalse",
                    ui: "textfield",
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
                    ui: "textfield",
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
                    value: this.properties
.requestType,
                    visible: n.computed({
                        read: function() {
                            return e.properties.funcType() == "CACHE";
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
                            return e
.properties.funcType() == "CACHE";
                        }
                    })
                }
            };
        },
        onCreate: function(e) {
            function i(e) {
                return e.indexOf("<") >= 0 || e.indexOf(".") >= 0;
            }
            var t = $("<span></span>"), r = this;
            e.find("a").length ? $(e.find("a")[0]).append(t) : e.append(t), n.computed(function() {
                var n = r.properties.funcType(), s = r.properties.funcLanguage();
                n == "CACHE" && r.properties.funcLanguage("JS"), t.html(n + "\u51fd\u6570<br/>" + r.properties.funcLanguage() + "\u6a21\u677f/\u8bed\u8a00");
                var o = "", u = r.properties.id().substr(2);
                if (n == "IF") {
                    if (!r.properties.ifFuncItem()) return;
                    r.$wrapper.empty();
                    var a = u + "-t", f = u + "-f";
                    s == "FTL" ? o = "<#if " + r.properties.ifFuncItem() + "??><div class='" + a + "'></div><#else><div class='" + 
f + "'></div>&lt;/#if>" : s == "Regular" && (o = "{#if " + r.properties.ifFuncItem() + "}<div class='" + a + "'></div>{#else}<div class='" + f + "'></div>{/if}"), r.$wrapper.append(o);
                    var l = r.properties.trueFuncBody(), c = r.properties.falseFuncBody();
                    l && (i(l) ? r.$wrapper.find("." + a).append(l) : r.trigger("addFuncComponent", l, r.$wrapper.find("." + a))), c && (i(c) ? r.$wrapper.find("." + f).append(c) : r.trigger("addFuncComponent", c, r.$wrapper.find("." + f)));
                } else if (n == "FOR") {
                    if (!r.properties.forFuncItem()) return;
                    if (!r.properties.forFuncBody()) return;
                    r.$wrapper.empty();
                    var h = u + "-f";
                    s == "FTL" ? o = "<#list " + r.properties.forFuncItem() + " as item><div class='" + h + "'></div>&lt;/#list>" : s == "Regular" && (o = "{#list " + r.properties.forFuncItem() + " as item}<div class='" + h + "'></div>{/list}"
), r.$wrapper.append(o);
                    var p = r.properties.forFuncBody();
                    p && (i(p) ? r.$wrapper.find("." + h).append(p) : r.trigger("addFuncComponent", r.properties.forFuncBody(), r.$wrapper.find("." + h)));
                } else if (n == "CACHE") r.$wrapper.empty(), e.append(t); else if (n == "INCLUDE") {
                    r.$wrapper.empty();
                    var d = r.properties.includeBody();
                    if (d) {
                        var v = u + "-i";
                        o = "<div class='" + v + "'></div>", r.$wrapper.append(o), i(d) ? d.indexOf(".") >= 0 && s == "FTL" ? r.$wrapper.find("." + v).append('<#include "' + d + '"/>') : r.$wrapper.find("." + v).append(d) : r.trigger("addFuncComponent", d, r.$wrapper.find("." + v));
                    }
                } else r.$wrapper.empty();
            }), n.computed({
                read: function() {
                    r.$wrapper.css({
                        position: r.properties
.positionStr()
                    });
                }
            });
        }
    });
}), define("elements/image", [ "require", "core/factory", "knockout", "_" ], function(e) {
    var t = e("core/factory"), n = e("knockout"), r = e("_");
    t.register("image", {
        type: "IMAGE",
        extendProperties: function() {
            return {
                src: n.observable(""),
                alt: n.observable("")
            };
        },
        extendUIConfig: function() {
            return {
                text: {
                    label: "\u56fe\u7247\u5730\u5740",
                    ui: "textfield",
                    text: this.properties.src
                },
                alt: {
                    label: "alt\u5185\u5bb9",
                    ui: "textfield",
                    text: this.properties.alt
                }
            };
        },
        onCreate: function(e) {
            var t = document.createElement("img"), i = this, s = function(e, n
) {
                t.width = e, t.height = n;
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
                        }).join(" ")
                    }), $(t).attr({
                        alt: n
                    
});
                }
            }), e.find("a").length ? $(e.find("a")[0]).append(t) : e.append(t);
        },
        onExport: function(e) {}
    });
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
        template: '<div data-bind="text:_colorStr" class="qpf-color-hex"></div>                    <div class="qpf-color-preview" data-bind="style:{backgroundColor:_colorStr()}"></div>                    <div data-bind="text:alpha" class="qpf-color-hex"></div>',
        initialize: function() {
            var e = this;
            this.$el.click(function() {
                e.showPalette();
            });
        },
        showPalette: function(
) {
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
            this.$el.mousedown
(function(e) {
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
}), define("modules/common/gradient", [ "require", "qpf", "knockout", "$", "_", "onecolor", "./palette" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("$"), i = e("_"), s = e("onecolor"), o = e("./palette"), u = t.widget.Widget.derive(function() {
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
        template: '<div class="qpf-gradient-preview"></div>                    <div class="qpf-gradient-stops" data-bind="foreach:{data : stops, afterRender : _onAddStop.bind($data)}">                        <div class="qpf-gradient-stop" data-bind="style:{left:$parent._percentString(percent)}">                            <div class="qpf-gradient-stop-inner"></div>                        </div>                    </div>                    <div class="qpf-gradient-angle></div>'
,
        initialize: function() {
            var e = this;
            this.stops.subscribe(function(t) {
                e._updateGradientPreview();
            });
        },
        afterRender: function() {
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
                "background-image"
: e
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
            var t = n.utils.unwrapObservable
(e.color);
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
                    style: new 
i.Style({
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
        template
: "",
        update: function() {
            if (!this.image) return;
            this._histogram.image = this.image, this._histogram.update();
        },
        refresh: function() {
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
            var n = 
this._paths[e], r = this.height(), i = this.sample();
            for (var s = i; s < 257; s += i) n.segments[s / i].point[1] = (1 - t[s - 1]) * r;
            n.smooth(1);
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
}), define("modules/common/iconbutton", [ "require"
, "qpf", "knockout" ], function(e) {
    var t = e("qpf"), n = t.use("meta/button"), r = t.use("meta/meta"), i = e("knockout"), s = n.derive(function() {
        return {
            $el: $("<div></div>"),
            icon: i.observable("")
        };
    }, {
        type: "ICONBUTTON",
        css: _.union("icon-button", n.prototype.css),
        template: '<div class="qpf-icon" data-bind="css:icon"></div>'
    });
    return r.provideBinding("iconbutton", s), s;
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
        var t = i.util
.getChildren(e), n = "";
        s.each(t, function(e) {
            e.nodeType === 4 && (n += e.textContent);
        });
        if (n) return {
            html: n
        };
    }), o;
}), define("modules/common/region", [ "require", "qpf", "knockout", "_", "../router" ], function(e) {
    var t = e("qpf"), n = t.use("meta/meta"), r = t.use("base"), i = e("knockout"), s = e("_"), o = e("../router"), u = r.derive(function() {
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
            var e = this
, t = Array.prototype.pop.call(arguments), n = 0;
            s.each(e._moduleCache, function(e) {
                n++, e.__enable__ ? e.enable(t) : e.disable(t);
            }), n || t();
        },
        leaveModule: function(e) {
            var t = this._moduleCache[e], n = Array.prototype.pop.call(arguments);
            t && t.disable(n);
        },
        enterModule: function(t, n) {
            var r = {}, i = this, o = Array.prototype.pop.call(arguments), u = Array.prototype.slice.call(arguments, 2);
            n && s.each(u, function(e, t) {
                var i = n[t];
                i && (r[i] = e);
            });
            var a = this._moduleCache[t];
            a ? (a.enable(o), a.setContext(r), this._currentModule = a, this.onResize()) : e([ t ], function(e) {
                if (e && e.start) {
                    var n = e.start();
                    n && i.$el.append(n), e.mainComponent && (e.mainComponent.parent = i), e.enable(o), e.setContext(r), i._moduleCache
[t] = e, i._currentModule = e, i.onResize();
                }
            }), o();
        },
        onResize: function() {
            this._currentModule && this._currentModule.mainComponent && (this._currentModule.mainComponent.width(this.$el.width()), this._currentModule.mainComponent.height(this.$el.height())), r.prototype.onResize.call(this);
        }
    });
    return n.provideBinding("region", u), u;
}), define("modules/common/textArea", [ "require", "qpf", "knockout", "_" ], function(e) {
    var t = e("qpf"), n = t.use("meta/meta"), r = e("knockout"), i = e("_"), s = n.derive(function() {
        return {
            tag: "div",
            text: r.observable(""),
            placeholder: r.observable("")
        };
    }, {
        type: "TEXTAREA",
        css: "textarea",
        template: '<textarea rows="5" cols="20" data-bind="value:text"/>',
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
            var e = this;
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
        css: [ "button", "icon-button", "toggle-icon-button" 
],
        initialize: function() {
            var e = this;
            r.computed(function() {
                this.actived() ? e.$el.addClass("active") : e.$el.removeClass("active");
            });
        }
    });
    return t.Base.provideBinding("toggleiconbutton", i), i;
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
}), define("modules/module", [ "require", "qpf", "knockout" ], function(e) {
    var t = e("qpf"), n = t.use("base"), r = e("knockout"), i = t.use("core/xmlparser"), s = t.use("core/mixin/derive"
), o = t.use("core/mixin/event"), u = new Function;
    _.extend(u, s), _.extend(u.prototype, o);
    var a = u.derive(function() {
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
            for (var t in this.context) typeof e[t] != "undefined" ? this.context[t](e[t]) : this.context[t](this._defaultContext
[t]);
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
}), define("text!modules/component/component.xml", [], function() {
    return '<container id="Component">\r\n    <list id="ElementsList" dataSource="@binding[componentsList]" itemView="@binding[ElementView]" onselect="@binding[_selectComponents]"></list>\r\n</container>';
}), define("text!modules/property/property.xml", [], function() {
    return '<tab id="Property">\r\n    <panel title="\u5e03\u5c40">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[layoutProperties]"></list>\r\n    </panel>\r\n    <panel title="\u6837\u5f0f">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[styleProperties]"></list>\r\n    </panel>\r\n    <panel title="\u81ea\u5b9a\u4e49">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[customProperties]"></list>\r\n    </panel>\r\n    <panel title="\u51fd\u6570">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[funcProperties]"></list>\r\n    </panel>\r\n</tab>'
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
        showProperties: function(e) {
            var t = [], r = [], i = [], o = [];
            s.each(e, function(e) {
                if (e.ui) {
                    e.type = e.ui;
                    var u = s.omit(e, "label", "ui", "field", "visible"), a = {
                        label: e.label,
                        config: n.observable(u)
                    };
                    e.visible && (a.visible = e.visible);
                    switch (e.field) {
                      case "layout":
                        t.push(a);
                        break;
                      case "style":
                        r.push(a);
                        break;
                      case "func":
                        o.push(a);
                        break;
                      
default:
                        i.push(a);
                    }
                }
            }), this.layoutProperties(t), this.styleProperties(r), this.customProperties(i), this.funcProperties(o);
        },
        PropertyItemView: o
    });
    return u;
}), define("text!modules/hierarchy/hierarchy.xml", [], function() {
    return '<container id="Hierarchy">\r\n    <list id="ElementsList" dataSource="@binding[elementsList]" itemView="@binding[ElementView]" onselect="@binding[_selectElements]"></list>\r\n</container>';
}), define("text!modules/hierarchy/element.html", [], function() {
    return '<div data-bind="text:id"></div>';
}), define("modules/hierarchy/element", [ "require", "qpf", "knockout", "text!./element.html" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.meta.Meta.derive(function() {
        return {
            id: n.observable(""),
            target: n.observable()
        };
    }, {
        type: "ELEMENT",
        css: "element",
        template
: e("text!./element.html")
    });
    return r;
}), define("modules/hierarchy/index", [ "require", "qpf", "knockout", "core/factory", "core/command", "../module", "text!./hierarchy.xml", "_", "../property/index", "modules/common/contextmenu", "./element" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("core/factory"), i = e("core/command"), s = e("../module"), o = e("text!./hierarchy.xml"), u = e("_"), a = e("../property/index"), f = e("modules/common/contextmenu"), l = e("./element"), c = new s({
        name: "hierarchy",
        xml: o,
        elementsList: n.observableArray([]),
        selectedElements: n.observableArray([]),
        ElementView: l,
        _selectElements: function(e) {
            c.selectedElements(u.map(e, function(e) {
                return e.target;
            }));
        },
        selectElementsByEID: function(e) {
            var t = [];
            u.each(e, function(e) {
                var n = r.getByEID(e);
                n && t.push
(n);
            }), c.selectedElements(t);
        },
        load: function(e) {
            this.removeAll(), this.elementsList(u.map(e, function(e) {
                return {
                    id: e.properties.id,
                    target: e
                };
            })), u.each(e, function(e) {
                c.trigger("create", e);
            });
        },
        removeAll: function() {
            u.each(this.elementsList(), function(e) {
                i.execute("remove", e.target);
            });
        }
    });
    c.elements = n.computed({
        read: function() {
            return u.map(c.elementsList(), function(e) {
                return e.target;
            });
        },
        deferEvaluation: !0
    }), c.on("start", function() {
        c.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function(e) {
            c.trigger("focus", $(this).qpf("get")[0].target());
        }), f.bindTo(c.mainComponent.$el, function(e) {
            var t = 
$(e).parents(".qpf-ui-element");
            return t.length ? [ {
                label: "\u5220\u9664",
                exec: function() {
                    i.execute("remove", t.qpf("get")[0].target());
                }
            }, {
                label: "\u590d\u5236",
                exec: function() {
                    i.execute("copy", t.qpf("get")[0].target());
                }
            } ] : [ {
                label: "\u7c98\u8d34",
                exec: function() {
                    var e = i.execute("paste");
                }
            } ];
        });
    }), n.computed(function() {
        var e = c.selectedElements(), t = e[e.length - 1];
        t && a.showProperties(t.uiConfig), c.trigger("select", e);
    }), i.register("create", {
        execute: function(e, t) {
            var n = r.create(e, t);
            c.elementsList.push({
                id: n.properties.id,
                target: n
            }), c.trigger("create", n), c.selectedElements
([ n ]);
        },
        unexecute: function(e, t) {}
    }), i.register("remove", {
        execute: function(e) {
            typeof e == "string" && (e = r.getByEID(e)), r.remove(e), c.elementsList(u.filter(c.elementsList(), function(t) {
                return t.target !== e;
            })), c.selectedElements.remove(e), a.showProperties([]), c.trigger("remove", e);
        },
        unexecute: function() {}
    }), i.register("removeselected", {
        execute: function() {},
        unexecute: function() {}
    });
    var h = [];
    return i.register("copy", {
        execute: function(e) {
            typeof e == "string" && (e = r.getByEID(e)), h = [ e ];
        }
    }), i.register("copyselected", {
        execute: function() {}
    }), i.register("paste", {
        execute: function() {
            var e = [];
            return u.each(h, function(t) {
                var n = r.clone(t);
                c.elementsList.push({
                    target: n,
                    
id: n.properties.id
                }), c.trigger("create", n), e.push(n);
            }), c.selectedElements(e), e;
        },
        unexecute: function() {}
    }), c;
}), define("modules/component/index", [ "require", "qpf", "knockout", "core/factory", "core/command", "../module", "text!./component.xml", "_", "../property/index", "modules/common/contextmenu", "../hierarchy/index", "modules/common/modal", "./component" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("core/factory"), i = e("core/command"), s = e("../module"), o = e("text!./component.xml"), u = e("_"), a = e("../property/index"), f = e("modules/common/contextmenu"), l = e("../hierarchy/index"), c = e("modules/common/modal"), h = e("./component"), p = "", d = new s({
        name: "component",
        xml: o,
        componentsList: n.observableArray([]),
        selectedComponents: n.observableArray([]),
        ElementView: h,
        _selectComponents: function(e) {
            d.selectedComponents(u
.map(e, function(e) {
                return e.target;
            }));
            var t = d.selectedComponents(), n = t[t.length - 1];
            n && (l.elements().length ? c.confirm("\u63d0\u793a", "\u5de5\u4f5c\u533a\u5df2\u5b58\u5728\u6b63\u5728\u7f16\u8f91\u7ec4\u4ef6, \u70b9\u51fb\u786e\u5b9a\u76f4\u63a5\u6e05\u7a7a\uff01", function(e) {
                l.removeAll(), d.trigger("selectComponent", n), e();
            }, function(e) {
                d.selectedComponents([]);
                var t = d.componentsList();
                d.componentsList([]), d.componentsList(t), e();
            }) : d.trigger("selectComponent", n));
        },
        load: function(e) {
            var t = d.componentsList();
            u.map(e, function(e) {
                var n = u.find(p.split("_"), function(t) {
                    return t == e.meta.name;
                });
                n ? c.confirm("\u63d0\u793a", "\u5de5\u4f5c\u533a\u5df2\u5b58\u5728\u7ec4\u4ef6" + e.meta.name + ", \u70b9\u51fb\u786e\u5b9a\u66ff\u6362\u4e3a\u65b0\u7684\u7ec4\u4ef6"
, function(n) {
                    u.each(t, function(t) {
                        t.id == e.meta.name && (t.target = e);
                    }), n();
                }, function(e) {
                    e();
                }) : (t.push({
                    id: e.meta.name,
                    target: e
                }), p += e.meta.name + "_");
            }), this.componentsList(t);
        },
        getTarget: function(e) {
            var t = d.componentsList(), n = {};
            return u.each(t, function(t, r) {
                if (t.id == e) {
                    n = t.target;
                    return;
                }
            }), n;
        },
        clearComponents: function() {
            p = "", d.componentsList([]);
        }
    });
    return d.components = function() {
        return u.map(d.componentsList(), function(e) {
            return e.target;
        });
    }, d.on("start", function() {
        d.mainComponent.$el.delegate(".qpf-ui-element", "dblclick"
, function(e) {
            d.trigger("focus", $(this).qpf("get")[0].target());
        }), f.bindTo(d.mainComponent.$el, function(e) {
            var t = $(e).parents(".qpf-ui-element");
            return t.length ? [ {
                label: "\u4fdd\u5b58\u5230\u7ec4\u4ef6\u6c60",
                exec: function() {
                    d.trigger("save2pool", t.qpf("get")[0].target());
                }
            } ] : [ {
                label: "\u65b0\u5efamodule",
                exec: function() {
                    d.trigger("newModule");
                }
            }, {
                label: "\u65b0\u5efaunit",
                exec: function() {
                    d.trigger("newUnit");
                }
            }, {
                label: "\u5bfc\u5165\u7ec4\u4ef6",
                exec: function() {
                    d.trigger("importProject");
                }
            } ];
        });
    }), d;
}), define("text!modules/page/element.html", [], function() {
    
return '<div data-bind="text:id"></div>\r\n<div class="qpf-page-desc" data-bind="text:desc"></div>\r\n<img class="qpf-page-img" data-bind="attr: { src: img}">\r\n';
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
}), define("modules/page/index", [ "require", "qpf", "knockout", "core/factory", "core/command", "../module", "text!./page.xml"
, "_", "../property/index", "../component/index", "../hierarchy/index", "modules/common/contextmenu", "modules/common/modal", "./element" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("core/factory"), i = e("core/command"), s = e("../module"), o = e("text!./page.xml"), u = e("_"), a = e("../property/index"), f = e("../component/index"), l = e("../hierarchy/index"), c = e("modules/common/contextmenu"), h = e("modules/common/modal"), p = t.use("meta/textfield"), d = t.use("container/vbox"), v = e("./element"), m = "", g = "", y = new s({
        name: "page",
        xml: o,
        pagesList: n.observableArray([]),
        selectedPages: n.observableArray([]),
        ElementView: v,
        _selectPages: function(e) {
            y.selectedPages(u.map(e, function(e) {
                return e.target;
            }));
            var t = y.selectedPages(), n = t[t.length - 1];
            n && (f.components().length ? h.confirm("\u63d0\u793a", "\u5de5\u4f5c\u533a\u4e2d\u5b58\u5728\u7ec4\u4ef6\uff0c\u8bf7\u5148\u4fdd\u5b58\uff01\u70b9\u51fb\u786e\u5b9a\u76f4\u63a5\u6e05\u7a7a\u5de5\u4f5c\u533a\u7ec4\u4ef6"
, function(e) {
                f.clearComponents(), l.removeAll(), y.trigger("selectPage", n), e();
            }, function(e) {
                y.selectedPages([]);
                var t = y.pagesList();
                y.pagesList([]), y.pagesList(t), e();
            }) : y.trigger("selectPage", n));
        },
        load: function(e) {
            var t = y.pagesList();
            u.map(e, function(e) {
                var n = u.find(m.split("_"), function(t) {
                    return t == e.name;
                });
                n ? h.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u6c60\u5df2\u5b58\u5728\u7ec4\u4ef6" + e.name + ", \u70b9\u51fb\u786e\u5b9a\u66ff\u6362\u4e3a\u65b0\u7684\u7ec4\u4ef6", function(n) {
                    u.each(t, function(t) {
                        if (t.id == e.name) return t.target = e, !1;
                    }), n();
                }, function(e) {
                    e();
                }) : (t.push({
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
    }, y.on("start", function() {
        y.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function(e) {
            y.trigger("focus", $(this).qpf("get")[0].target());
        }), c.bindTo(y.mainComponent.$el, function(e) {
            var t = $(e).parents(".qpf-ui-element");
            return t.length ? [ {
                label: "\u7f16\u8f91",
                exec: function() {
                    var e = t.qpf("get"
)[0].target(), n = new d, r = new p({
                        attributes: {
                            text: e.desc
                        }
                    }), i = new p({
                        attributes: {
                            text: e.img
                        }
                    }), s = new p({
                        attributes: {
                            text: e.url
                        }
                    });
                    n.add(r), n.add(i), n.add(s), h.popup("\u8bf7\u8f93\u5165", n, function(t) {
                        var n = {
                            name: _comName,
                            desc: r.text(),
                            img: i.text(),
                            url: s.text(),
                            postUrl: e.postUrl
                        };
                        pageModule.load(n), t();
                    });
                }
            }, {
                label: "\u5220\u9664",
                exec: function(
) {}
            } ] : [ {
                label: "\u52a0\u8f7d\u672c\u5730\u7ec4\u4ef6",
                exec: function() {
                    y.trigger("importProject");
                }
            }, {
                label: "\u52a0\u8f7d\u8fdc\u7a0b\u7ec4\u4ef6",
                exec: function() {
                    var e = new p({
                        attributes: {
                            text: "../example/index.cmpp"
                        }
                    });
                    h.popup("\u8bf7\u8f93\u5165\u8fdc\u7a0b\u7ec4\u4ef6\u5730\u5740\uff1a", e, function(t) {
                        e.text() && (g = e.text(), y.trigger("importProjectFromUrl", e.text())), t();
                    });
                }
            }, {
                label: "\u5bfc\u51fa\u7ec4\u4ef6\u6c60",
                exec: function() {
                    var e = new p({
                        attributes: {
                            text: "\u7ec4\u4ef6\u6c60\u540d\u79f0"
                        
}
                    });
                    h.popup("\u8bf7\u8f93\u5165\u7ec4\u4ef6\u6c60\u540d\u79f0\uff1a", e, function(t) {
                        if (e.text()) {
                            var n = new Blob([ JSON.stringify(y.pages(), null, 2) ], {
                                type: "text/plain;charset=utf-8"
                            });
                            saveAs(n, e.text() + ".cmpp");
                        }
                        t();
                    });
                }
            }, {
                label: "\u4fdd\u5b58\u7ec4\u4ef6\u6c60",
                exec: function() {
                    if (g) {
                        var e = g.substring(g.lastIndexOf("/"), g.indexOf("cmpp") - 1);
                        $.post("/api/" + e, {
                            ext: "{name:" + e + ", url:" + g + "}",
                            cmpData: JSON.stringify(y.pages(), null, 2)
                        }, function() {});
                    } else {
                        
var t = new p({
                            attributes: {
                                text: "../example/index.cmpp"
                            }
                        });
                        h.popup("\u8bf7\u8f93\u5165\u7ec4\u4ef6\u6c60\u5730\u5740\uff1a", t, function(e) {
                            if (t.text()) {
                                g = t.text();
                                var n = g.substring(g.lastIndexOf("/"), g.indexOf("cmpp") - 1);
                                $.post("/api/" + n, {
                                    ext: "{name:" + n + ", url:" + g + "}",
                                    cmpData: JSON.stringify(y.pages(), null, 2)
                                }, function() {});
                            }
                            e();
                        });
                    }
                }
            } ];
        });
    }), y;
}), define("text!modules/toolbar/toolbar.xml", [], function() {
    return '<inline id="Toolbar">\r\n    <toolbargroup>\r\n        <button text="eHtml" onclick="@binding[exportHTML]"></button>\r\n        <button text="eRUI" onclick="@binding[exportRUI]"></button>\r\n        <button text="eFTL" onclick="@binding[exportFTL]"></button>\r\n        <!--<button text="eMac" onclick="@binding[exportMac]"></button>-->\r\n        <button text="align" onclick="@binding[alignProcess]"></button>\r\n        <button text="newM" onclick="@binding[newModule]"></button>\r\n        <button text="newU" onclick="@binding[newUnit]"></button>\r\n        <button text="newC" onclick="@binding[newCache]"></button>\r\n        <button text="export" onclick="@binding[exportProject]"></button>\r\n        <iconbutton icon="save" title="saveProject" onclick="@binding[saveProject]"></iconbutton>\r\n        <iconbutton icon="load" title="importProject" onclick="@binding[importProject]"></iconbutton>\r\n    </toolbargroup>\r\n    <meta class="divider"></meta>\r\n    <toolbargroup>\r\n        <iconbutton icon="element" onclick="@binding[createElement]"></iconbutton>\r\n        <iconbutton icon="image" onclick="@binding[createImage]"></iconbutton>\r\n        <iconbutton icon="text" onclick="@binding[createText]"></iconbutton>\r\n        <iconbutton icon="function" onclick="@binding[createFunction]"></iconbutton>\r\n    </toolbargroup>\r\n    <meta class="divider"></meta>\r\n    <toolbargroup>\r\n        <iconbutton icon="zoom-in" onclick="@binding[zoomIn]"></iconbutton>\r\n        <iconbutton icon="zoom-out" onclick="@binding[zoomOut]"></iconbutton>\r\n        <label text="@binding[viewportScale]" class="viewport-scale"></label>\r\n    </toolbargroup>\r\n    <meta class="divider"></meta>\r\n    <toolbargroup class="viewport-size">\r\n        <spinner value="@binding[viewportWidth]" min="0" width="100"></spinner>\r\n        <spinner value="@binding[viewportHeight]" min="0" width="100"></spinner>\r\n    </toolbargroup>\r\n</inline>\r\n'
;
}), define("text!template/module/m-example.cmp", [], function() {
    return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "m-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 600\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "m-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n'
;
}), define("text!template/unit/u-example.cmp", [], function() {
    return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "u-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 600\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "u-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n'
;
}), define("text!template/cache/c-example.cmp", [], function() {
    return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "c-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 600\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "c-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n'
;
}), define("modules/viewport/viewport", [ "require", "qpf", "knockout", "core/command", "modules/common/contextmenu" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = t.use("meta/meta"), i = e("core/command"), s = e("modules/common/contextmenu"), o = r.derive(function() {
        return {
            scale: n.observable(1)
        };
    }, {
        type: "VIEWPORT",
        css: "viewport",
        template: '<div class="qpf-viewport-elements-container"></div>                    <div class="qpf-viewport-ruler-h"></div>                    <div class="qpf-viewport-ruler-v"></div>',
        initialize: function() {
            this.scale.subscribe(this._scale, this), this._scale(this.scale()), s.bindTo(this.$el, function(e) {
                var t = $(e).parents(".cmp-element");
                if (t.length) var n = [ {
                    label: "\u5220\u9664",
                    exec: function() {
                        i.execute("remove", t.attr("data-cmp-eid"));
                    
}
                }, {
                    label: "\u590d\u5236",
                    exec: function() {
                        i.execute("copy", t.attr("data-cmp-eid"));
                    }
                } ]; else var n = [];
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
                "-o-transform": "scale(" + e + "," + e + ")",
                transform: "scale(" + e + "," + e + ")"
            });
        }
    });
    return r.provideBinding("viewport", o), o;
}), define("text!modules/viewport/viewport.xml", [], function() {
    return '<container id="Viewport">\r\n    <viewport id="ViewportMain" width="@binding[viewportWidth]" height="@binding[viewportHeight]" scale="@binding[viewportScale]"></viewport>\r\n</container>';
}), define("modules/viewport/index", [ "require", "qpf", "knockout", "../module", "./viewport", "text!./viewport.xml", "_", "core/command", "core/factory", "modules/hierarchy/index", "modules/component/index" ], function(e) {
    function v(e) {
        var t = $(this).attr("data-cmp-eid");
        t && f.selectElementsByEID([ t ]);
    }
    function b() {
        c.mainComponent.$el[0
].addEventListener("dragover", function(e) {
            e.stopPropagation(), e.preventDefault();
        }), c.mainComponent.$el[0].addEventListener("drop", function(e) {
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
        viewportHeight: n.observable(600),
        viewportScale: n.observable(1)
    }), h = {
        $tl: $('<div class="resize-control tl"></div>'
),
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
    }, f.on("create", function(e) {
        d.addElement(e);
    }), f.on("remove", function(e) {
        d.removeElement(e);
    }), f.on("select", function(e) {
        var t = e[e.length - 1
];
        if (!t) return;
        t.$wrapper.append(p), g.clear(), o.each(e, function(e) {
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
}), define("project/project", [ "require", "_", "$", "core/factory", "modules/viewport/index", "modules/hierarchy/index", "modules/component/index", "modules/page/index" ], function(e) {
    function a(e, n) {
        var r = n.split("/"), i = t.reduce(r, function(e, t) {
            if (e) return e[t];
        }, e);
        return i && i.data;
    }
    var t = e("_"), n = e("$"), r = e("core/factory"), i = e("modules/viewport/index"
), s = e("modules/hierarchy/index"), o = e("modules/component/index"), u = e("modules/page/index");
    return {
        "import": function(e) {
            e instanceof Array ? o.load(e) : o.load([ e ]);
            var t = this;
            o.on("selectComponent", function(e) {
                t.loadComponent(e);
            });
        },
        importPage: function(e) {
            e instanceof Array ? u.load(e) : u.load([ e ]);
            var t = this;
            u.on("selectPage", function(e) {
                e.url && n.get(e.url, function(e) {
                    t.import(JSON.parse(e));
                });
            });
        },
        loadComponent: function(e) {
            function n(r) {
                t.each(r, function(t, i) {
                    if (typeof t == "string") {
                        var s = /url\((\S*?)\)/.exec(t);
                        if (s) {
                            var o = s[1], u = a(e.assets, o);
                            u && (r[i] = 
u);
                        }
                    } else (t instanceof Array || t instanceof Object) && n(t);
                });
            }
            var u = [];
            t.each(e.elements, function(e) {
                function a(e, n) {
                    var s = [];
                    t.each(o.components(), function(o, u) {
                        if (o["meta"]["name"] == e) {
                            s = o.elements;
                            var a = [];
                            t.each(s, function(e) {
                                var t = r.create(e.type.toLowerCase(), {
                                    id: e.properties.id
                                });
                                (e.properties.funcType == "IF" || e.properties.funcType == "FOR" || e.properties.funcType == "INCLUDE") && t.on("addFuncComponent", f), t.import(e), a.push(t);
                            });
                            var l;
                            return t.each(a, function(
e, t) {
                                e.isContainer() && (e.$wrapper.css({
                                    position: "relative"
                                }), e.$wrapper.find("a").remove(), l = e.$wrapper, i.getViewPort().addElement(e, n), n.parent().css({
                                    "margin-left": -Math.floor(+e.properties.width() / 2 + 15)
                                }), n.parent().find(".e-hover-arrow").css({
                                    left: Math.floor(+e.properties.width() / 2 + 15) - 10
                                }));
                            }), t.each(a, function(e, t) {
                                e.isContainer() || i.getViewPort().addElement(e, l);
                            }), !1;
                        }
                    });
                }
                function f(e, n) {
                    var s = [], e = e, n = n;
                    t.each(o.components(), function(o, u) {
                        if (o["meta"]["name"] == 
e) {
                            s = o.elements;
                            var l = [];
                            t.each(s, function(e) {
                                var t = r.create(e.type.toLowerCase(), {
                                    id: e.properties.id
                                });
                                (e.properties.funcType == "IF" || e.properties.funcType == "FOR" || e.properties.funcType == "INCLUDE") && t.on("addFuncComponent", f), e.properties.hoverComponent && t.on("addHoverComponent", a), t.import(e), l.push(t);
                            });
                            var c;
                            return t.each(l, function(e, t) {
                                if (e.isContainer()) return e.$wrapper.css({
                                    position: "relative"
                                }), e.$wrapper.find("a").attr("href") ? c = e.$wrapper.find("a") : (e.$wrapper.find("a").children().length < 1 ? e.$wrapper.find("a").remove() : e.
$wrapper.html(e.$wrapper.find("a").html()), c = e.$wrapper), i.getViewPort().addElement(e, n), !1;
                            }), t.each(l, function(e, t) {
                                e.isContainer() || (e.$wrapper.find("a").children().length < 1 && e.$wrapper.find("a").remove(), !e.$wrapper.find("a").attr("href") && !e.properties.hoverComponent() && e.$wrapper.html(e.$wrapper.find("a").html()), i.getViewPort().addElement(e, c));
                            }), !1;
                        }
                    });
                }
                n(e.properties);
                var s = r.create(e.type.toLowerCase(), {
                    id: e.properties.id
                });
                e.properties.hoverComponent && s.on("addHoverComponent", a), s.on("addFuncComponent", f), s.import(e), u.push(s);
            }), s.load(u), i.viewportWidth(e.viewport.width), i.viewportHeight(e.viewport.height);
        },
        "export": function(e) {
            function a(n) {
                
n.properties.trueFuncBody && !e && (_json = o.getTarget(n.properties.trueFuncBody), Object.keys(_json).length && (f.push(_json), t.each(_json.elements, function(e) {
                    a(e);
                }))), n.properties.falseFuncBody && !e && (_json = o.getTarget(n.properties.falseFuncBody), Object.keys(_json).length && (f.push(_json), t.each(_json.elements, function(e) {
                    a(e);
                }))), n.properties.forFuncBody && !e && (_json = o.getTarget(n.properties.forFuncBody), Object.keys(_json).length && (f.push(_json), t.each(_json.elements, function(e) {
                    a(e);
                }))), n.properties.includeBody && !e && (_json = o.getTarget(n.properties.includeBody), Object.keys(_json).length && (f.push(_json), t.each(_json.elements, function(e) {
                    a(e);
                }))), n.properties.hoverComponent && !e && (_json = o.getTarget(n.properties.hoverComponent), Object.keys(_json).length && (f.push(_json), t.each(_json.elements
, function(e) {
                    a(e);
                })));
            }
            var n = new Date, r = "example";
            t.each(s.elements(), function(e) {
                if (e.isContainer()) {
                    r = e.getName();
                    return;
                }
            });
            var u = {
                meta: {
                    date: n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate(),
                    name: r
                },
                viewport: {
                    width: i.viewportWidth(),
                    height: i.viewportHeight()
                },
                elements: [],
                assets: {}
            }, f = [];
            return t.each(s.elements(), function(e) {
                var n = e.export(), r = "";
                a(n), u.elements.push(t.omit(n, "assets")), t.each(n.assets, function(e, n) {
                    t.each(e, function(e, t) {
                        u.assets[n] || (u.assets[n] = 
{}), u.assets[n][t] = e;
                    });
                });
            }), f.push(u), {
                result: f,
                name: r
            };
        },
        exportHTMLCSS: function() {
            var e = "<div class='m-body-container'></div>", r = [], i = "example", o = {}, u = "", a = "";
            t.each(s.elements(), function(t) {
                if (t.isContainer()) return o = t.exportHTMLCSS(), e = o.html, r.push(o.css), i = t.getName(), !1;
            }), e = n(e);
            var f;
            return e.find("a").length && (f = e.find("a")), t.each(s.elements(), function(t) {
                t.isCache() ? (o = t.exportCache(), u += o.cacheItem, a += o.cacheItemCall) : t.isContainer() || (o = t.exportHTMLCSS(), f ? f.append(o.html) : e.append(o.html), r.push(o.css));
            }), {
                html: n("<div></div>").append(e).html().replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">"),
                css: r.join(" "),
                name: i,
                
cache: u,
                cacheCall: a
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
                t.isContainer() || (e.append(t.exportHTMLCSS().html), r.push(t.exportHTMLCSS().css));
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
}), define("modules/toolbar/toolbargroup", [ "require", "qpf", "knockout", "_" ], function(e) {
    var t = e("qpf"), n = e("knockout"), r = e("_"), i = t.container.Inline.derive(function() {
        return {};
    }, {
        type: "TOOLBARGROUP",
        css: "toolbar-group"
    });
    return t.container.Container.provideBinding("toolbargroup", i), i;
}), define("text!template/rui/component.js", [], function() {
    return "/**\r\n * __componentNameCap__ \u7ec4\u4ef6\u5b9e\u73b0\u6587\u4ef6\r\n *\r\n * @module   __componentNameCap__\r\n */\r\nNEJ.define([\r\n    'text!./component.html',\r\n    'text!./component.css',\r\n    'pool/component-base/src/base',\r\n    'pool/component-base/src/util',\r\n    'base/element',\r\n    'base/event'\r\n    __cacheJS__\r\n], function(\r\n    html,\r\n    css,\r\n    Component,\r\n    util,\r\n    e,\r\n    v\r\n    __cacheName__\r\n) {\r\n\r\n    /**\r\n     * __componentNameCap__ \u7ec4\u4ef6\r\n     *\r\n     * @class   module:__componentNameCap__\r\n     * @extends module:pool/component-base/src/base.Component\r\n     *\r\n     * @param {Object} options      - \u7ec4\u4ef6\u6784\u9020\u53c2\u6570\r\n     * @param {Object} options.data - \u4e0e\u89c6\u56fe\u5173\u8054\u7684\u6570\u636e\u6a21\u578b\r\n     */\r\n    var __componentNameCap__ = Component.$extends({\r\n        name: '__componentName__',\r\n        css: css,\r\n        template: html,\r\n        /**\r\n         * \u6a21\u677f\u7f16\u8bd1\u524d\u7528\u6765\u521d\u59cb\u5316\u53c2\u6570\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#config\r\n         * @returns {void}\r\n         */\r\n        config: function() {\r\n            // FIXME \u8bbe\u7f6e\u7ec4\u4ef6\u914d\u7f6e\u4fe1\u606f\u7684\u9ed8\u8ba4\u503c\r\n            util.extend(this, {\r\n\r\n            });\r\n            // FIXME \u8bbe\u7f6e\u7ec4\u4ef6\u89c6\u56fe\u6a21\u578b\u7684\u9ed8\u8ba4\u503c\r\n            util.extend(this.data, {\r\n\r\n            });\r\n\r\n            this.supr();\r\n            // TODO\r\n        },\r\n\r\n        /**\r\n         * \u6a21\u677f\u7f16\u8bd1\u4e4b\u540e(\u5373\u6d3b\u52a8dom\u5df2\u7ecf\u4ea7\u751f)\u5904\u7406\u903b\u8f91\uff0c\u53ef\u4ee5\u5728\u8fd9\u91cc\u5904\u7406\u4e00\u4e9b\u4e0edom\u76f8\u5173\u7684\u903b\u8f91\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#init\r\n         * @returns {void}\r\n         */\r\n        init: function() {\r\n            // TODO\r\n            this.supr();\r\n\r\n            __cacheCall__\r\n\r\n        },\r\n\r\n        /**\r\n         * \u7ec4\u4ef6\u9500\u6bc1\u7b56\u7565\uff0c\u5982\u679c\u6709\u4f7f\u7528\u7b2c\u4e09\u65b9\u7ec4\u4ef6\u52a1\u5fc5\u5728\u6b64\u5148\u9500\u6bc1\u7b2c\u4e09\u65b9\u7ec4\u4ef6\u518d\u9500\u6bc1\u81ea\u5df1\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#destroy\r\n         * @returns {void}\r\n         */\r\n        destroy: function() {\r\n            // TODO\r\n            this.supr();\r\n        }\r\n    });\r\n\r\n    return __componentNameCap__;\r\n});\r\n"
;
}), define("text!template/cache/cache.js", [], function() {
    return "/**\r\n * ----------------------------------------------------------\r\n * __cache__\u63a5\u53e3\r\n * \r\n * @module   __cache__\r\n * ----------------------------------------------------------\r\n */\r\ndefine([\r\n    'pro/common/cache',\r\n    'pro/common/cache/cache',\r\n    'base/util'\r\n], function(_cache, _dwr, _util, _p) {\r\n    __content__\r\n});\r\n";
}), define("elements/text", [ "require", "core/factory", "knockout", "onecolor" ], function(e) {
    var t = e("core/factory"), n = e("knockout"), r = e("onecolor");
    t.register("text", {
        type: "TEXT",
        extendProperties: function() {
            return {
                text: n.observable("\u8bf7\u8f93\u5165\u6587\u5b57"),
                fontFamily: n.observable("\u5fae\u8f6f\u96c5\u9ed1,Microsoft YaHei"),
                fontSize: n.observable(16),
                color: n.observable("#111111"),
                horzontalAlign: n.observable
("center"),
                verticleAlign: n.observable("middle"),
                lineHeight: n.observable(0),
                classStr: n.observable("")
            };
        },
        extendUIConfig: function() {
            return {
                text: {
                    label: "\u6587\u672c",
                    ui: "textfield",
                    text: this.properties.text
                },
                fontFamily: {
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
                        text
: "\u65e0",
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
                        value
: "center",
                        text: "\u5c45\u4e2d"
                    }, {
                        value: "right",
                        text: "\u53f3\u5bf9\u9f50"
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
                    ui: "spinner"
,
                    min: 0,
                    value: this.properties.lineHeight
                }
            };
        },
        onCreate: function(e) {
            var t = $("<span style='line-height:normal;display:inline-block;width:100%;'></span>"), r = this;
            e.find("a").length ? $(e.find("a")[0]).append(t) : e.append(t), r.properties.boxFontSize(0), n.computed(function() {
                var e = r.properties.fontFamily(), n = r.properties.classStr();
                t.css({
                    "font-family": e
                }), t.attr({
                    "class": n
                });
            }), n.computed(function() {
                var e = r.properties.text(), n = r.properties.fontSize() + "px", i = r.properties.color();
                t.html(e).css({
                    "font-size": n,
                    color: i
                });
            }), n.computed(function() {
                var e = r.properties.verticleAlign(), n = r.properties.horzontalAlign
();
                t.css({
                    "text-align": n,
                    "vertical-align": e
                });
            }), n.computed(function() {
                var n = r.properties.lineHeight();
                n && (t.css({
                    "line-height": n + "px"
                }), e.css({
                    "line-height": n + "px"
                }));
            });
        }
    });
}), define("modules/toolbar/index", [ "require", "qpf", "knockout", "../module", "text!./toolbar.xml", "text!template/module/m-example.cmp", "text!template/unit/u-example.cmp", "text!template/cache/c-example.cmp", "core/command", "$", "project/project", "../hierarchy/index", "modules/component/index", "modules/page/index", "../viewport/index", "modules/common/modal", "./toolbargroup", "text!template/rui/component.js", "text!template/cache/cache.js", "elements/image", "elements/text", "elements/func" ], function(e) {
    function x(e) {
        var t = e.target.files[0];
        
t && t.type.match(/image/) && (S.onload = function(e) {
            S.onload = null, a.execute("create", "image", {
                src: e.target.result
            });
        }, S.readAsDataURL(t));
    }
    function T(e) {
        var t = e.target.files[0];
        t && t.name.substr(-3) === "cmp" ? (S.onload = function(e) {
            S.onload = null;
            var t = l.import(JSON.parse(e.target.result));
        }, S.readAsText(t)) : t && t.name.substr(-4) === "cmpp" && (S.onload = function(e) {
            S.onload = null;
            var t = l.importPage(JSON.parse(e.target.result));
        }, S.readAsText(t));
    }
    var t = e("qpf"), n = e("knockout"), r = e("../module"), i = e("text!./toolbar.xml"), s = e("text!template/module/m-example.cmp"), o = e("text!template/unit/u-example.cmp"), u = e("text!template/cache/c-example.cmp"), a = e("core/command"), f = e("$"), l = e("project/project"), c = e("../hierarchy/index"), h = e("modules/component/index"), p = e("modules/page/index"
), d = e("../viewport/index"), v = e("modules/common/modal"), m = t.use("meta/textfield"), g = t.use("container/vbox"), y = t.use("container/container"), b = t.use("container/inline"), w = t.use("meta/label");
    e("./toolbargroup");
    var E = new r({
        name: "toolbar",
        xml: i,
        createElement: function() {
            a.execute("create");
        },
        createImage: function() {
            a.execute("create", "image", {
                src: "http://www.haomou.net/images/read.png"
            });
        },
        createText: function() {
            a.execute("create", "text");
        },
        createFunction: function() {
            a.execute("create", "func");
        },
        zoomIn: function() {
            var e = d.viewportScale();
            d.viewportScale(Math.min(Math.max(e + .1, .2), 1.5));
        },
        zoomOut: function() {
            var e = d.viewportScale();
            d.viewportScale(Math.min(Math.max(e - .1, .2), 1.5));
        
},
        viewportScale: n.computed(function() {
            return Math.floor(d.viewportScale() * 100) + "%";
        }),
        viewportWidth: d.viewportWidth,
        viewportHeight: d.viewportHeight,
        exportProject: function() {
            var e = l.export(!1), t = new Blob([ JSON.stringify(e.result, null, 2) ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, e.name + ".cmp");
        },
        saveProject: function() {
            var e = l.export(!0);
            e.result[0].elements.length > 0 && l.import(e.result);
        },
        importProject: function() {
            var e = f("<input type='file' />");
            e[0].addEventListener("change", T), e.click();
        },
        newModule: function() {
            c.removeAll(), l.loadComponent(JSON.parse(s)[0]);
        },
        newUnit: function() {
            c.removeAll(), l.loadComponent(JSON.parse(o)[0]);
        },
        newCache: function() {
            c.removeAll
(), l.loadComponent(JSON.parse(u)[0]);
        },
        exportFTL: function() {
            var e = l.exportHTMLCSS(), t = new Blob([ e.html ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, e.name + ".ftl");
            var t = new Blob([ e.css ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, "_" + e.name + ".scss");
        },
        exportRUI: function() {
            var t = e("text!template/rui/component.js"), n = e("text!template/cache/cache.js"), r = l.exportHTMLCSS(), i = r.html;
            i = i.replace(/\$\{/g, "{");
            var s = new Blob([ i ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(s, "component.html");
            var s = new Blob([ r.css ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(s, "component.css");
            var o = r.name;
            t = t.replace(/\_\_componentName\_\_/g, o), o = 
o.replace(/m\-/g, "M").replace(/u\-/g, "U").replace(/c\-/g, "C"), t = t.replace(/\_\_componentNameCap\_\_/g, o);
            var u = r.cache, a = r.cacheCall;
            if (u) {
                n = n.replace(/\_\_cache\_\_/g, o).replace(/\_\_content\_\_/g, u);
                var s = new Blob([ n ], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(s, "cache.js");
            }
            a ? (a = a.replace(/\_\_cacheName\_\_/g, o), t = t.replace(/\_\_cacheJS\_\_/g, ",'./cache.js'").replace(/\_\_cacheName\_\_/g, "," + o + "Cache").replace(/\_\_cacheCall\_\_/g, a)) : t = t.replace(/\_\_cacheJS\_\_/g, "").replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, "");
            var s = new Blob([ t ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(s, "component.js");
        },
        exportHTML: function() {
            var e = l.exportHTMLCSS(), t = new Blob([ e.html ], {
                type
: "text/plain;charset=utf-8"
            });
            saveAs(t, e.name + ".html");
            var t = new Blob([ e.css ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, e.name + ".css");
        },
        exportMac: function() {
            var e = l.exportMacro(), t = new Blob([ e.html ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, e.name + ".ftl");
            var t = new Blob([ e.css ], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(t, "_" + e.name + ".scss");
        },
        alignProcess: function() {
            l.alignProcess();
        }
    });
    h.on("importProject", function() {
        E.importProject();
    }), h.on("newModule", function() {
        E.newModule();
    }), h.on("newUnit", function() {
        E.newUnit();
    }), h.on("save2pool", function(e) {
        if (p.pages().length < 1) v.confirm("\u63d0\u793a", "\u7ec4\u4ef6\u6c60\u6ca1\u6709\u6570\u636e\u8bf7\u5148\u521b\u5efa\u7ec4\u4ef6\u6c60\uff01"
, function(e) {
            e();
        }, function(e) {
            e();
        }); else {
            var t = e.meta.name, n = _.find(p.pages(), function(e) {
                return e.name == t;
            }), r = l.export(!1);
            if (n) f.post(n.postUrl, {
                ext: JSON.stringify(n),
                cmpData: JSON.stringify(r.result)
            }, function() {}); else {
                var i = new y, s = new b, o = new b, u = new b;
                s.add(new w({
                    attributes: {
                        text: "\u7ec4\u4ef6\u63cf\u8ff0\uff1a"
                    }
                }));
                var a = new m({
                    attributes: {
                        text: "\u7ec4\u4ef6\u63cf\u8ff0"
                    }
                });
                s.add(a), o.add(new w({
                    attributes: {
                        text: "\u7f29\u7565\u56fe\u7247\uff1a"
                    }
                }));
                var c = new 
m({
                    attributes: {
                        text: "\u7f29\u7565\u56feurl"
                    }
                });
                o.add(c), u.add(new w({
                    attributes: {
                        text: "\u7ec4\u4ef6\u5730\u5740\uff1a"
                    }
                }));
                var h = new m({
                    attributes: {
                        text: "\u7ec4\u4ef6\u5730\u5740\u524d\u7f00/" + t + "/" + t + ".cmp"
                    }
                });
                u.add(h), i.add(s), i.add(o), i.add(u), v.popup("\u8bf7\u8f93\u5165\u76f8\u5173\u5185\u5bb9", i, function(e) {
                    var n = {
                        name: t,
                        desc: a.text(),
                        img: c.text(),
                        url: h.text(),
                        postUrl: "/api/" + t
                    };
                    p.load([ n ]), e();
                });
            }
        }
    }), p.on("importProject"
, function() {
        E.importProject();
    }), p.on("importProjectFromUrl", function(e) {
        f.get(e, function(e) {
            l.importPage(JSON.parse(e));
        });
    });
    var S = new FileReader;
    return e("elements/image"), e("elements/text"), e("elements/func"), E;
});;