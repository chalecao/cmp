
/**
 * @license RequireJS text 2.0.5 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false, location: false */

define('text',['module'], function (module) {
    
    
    var text, fs,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [],
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.5',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node)) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback) {
            var file = fs.readFileSync(url, 'utf8');
            //Remove BOM (Byte Mark Order) from utf8 files if it is there.
            if (file.indexOf('\uFEFF') === 0) {
                file = file.substring(1);
            }
            callback(file);
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    }

    return text;
});

define('text!modules/app.xml',[],function () { return '<application>\r\n    <vbox height="100%">\r\n        <container prefer="40" style="margin-bottom:3px;">\r\n            <region name="toolbar" controller="@binding[toolbar]" height="100%"></region>\r\n        </container>\r\n        <hbox>\r\n            <tab prefer="200" maxTabWidth="67" minTabWidth="100">\r\n                <panel title="组件池">\r\n                    <region name="page" controller="@binding[page]" style="height:100%"></region>\r\n                </panel>\r\n                <panel title="组件">\r\n                    <region name="component" controller="@binding[component]" style="height:100%"></region>\r\n                </panel>\r\n                <panel title="层级">\r\n                    <region name="hierarchy" controller="@binding[hierarchy]" style="height:100%"></region>\r\n                </panel>\r\n            </tab>\r\n            <region flex="1" name="viewport" style="margin:10px;" controller="@binding[viewport]"></region>\r\n            <region prefer="280" name="property" controller="@binding[property]"></region>\r\n        </hbox>\r\n    </vbox>\r\n</application>\r\n';});

define('modules/router',['require'],function(require){

    var router = Router();

    router.configure({
        recurse : "forward"
    })
    
    return router;  
});
// controller defines how and when the modules are loaded
// todo : add priority??
define('controllerConfig',{
    //---------region: main navigator-------------
    "navigator" : {
        "modules/navigator/index" : {
            "url" : "*"
        }
    },
    "viewport" : {
        "modules/viewport/index" : {
            "url" : "*"
        }
    },
    "property" : {
        "modules/property/index" : {
            "url" : "*"
        }
    },
    "toolbar" : {
        "modules/toolbar/index" : {
            "url" : "*"
        }
    },
    "hierarchy" : {
        "modules/hierarchy/index" : {
            "url" : "*"
        }
    },
    "component" : {
        "modules/component/index" : {
            "url" : "*"
        }
    },
    "page" : {
        "modules/page/index" : {
            "url" : "*"
        }
    }
})
;
define('app',['require','qpf','_','text!modules/app.xml','modules/router','./controllerConfig','knockout'],function(require) {

    var qpf = require("qpf");
    var _ = require("_");
 

    var appXML = require("text!modules/app.xml");
    var router = require("modules/router");
    var controllerConfig = require("./controllerConfig");
    var Event = qpf.use("core/mixin/event");

    function start() {
        var ko = require("knockout");
        var XMLParser = qpf.use("core/xmlparser");

        var dom = XMLParser.parse(appXML);

        document.body.appendChild(dom);

        ko.applyBindings(controllerConfig, dom);

        router.init("/");
    }

    var app = {
        start: start
    }
    _.extend(app, Event);

    return app;
})
;
define('core/command',[],function(){

    var repository = {};

    var redoQueue = [];
    var undoQueue = [];

    var commandManager = {

        execute : function(command){
            var args = Array.prototype.slice.call(arguments, 1);
            if(repository[command]){
                var res = repository[command].execute.apply(window, args);

                if(command.unexecute){
                    undoQueue.push({
                        command : command,
                        args : args
                    });
                }

                return res;
            };
        },

        undo : function(){
            var op = undoQueue.pop();
            var command = op.command,
                args = op.args;

            if(repository[command]){
                repository[command].unexecute.apply(window, args);
                redoQueue.push(op);
            };
        },

        redo : function(){
            var op = redoQueue.pop();
            var command = op.command,
                args = op.args;

            if(repository[command]){
                repository[command].execute.apply(window, args);
                undoQueue.push(op);
            }
        },
        /**
         * @param command
         * @param operation
         *
         * @example
         * {
                execute : function(){
    
                },
                unexecute : function(){
    
                }
            }
         */
        register : function(command, operation){
            repository[command] = operation;
        }
    };

    return commandManager;
});
define('text!template/hover/hover.html',[],function () { return '<div class="e-hover-target">\r\n    <div class="e-hover-arrow"></div>\r\n    <div class="e-hover-content"></div>\r\n</div>';});

define('text!template/hover/hover.css',[],function () { return '.e-hover-source:hover .e-hover-target {\r\n    display: block;\r\n}\r\n\r\n.e-hover-target {\r\n    display: none;\r\n    position: absolute;\r\n    left: 50%;\r\n    margin-top: -1px;\r\n    padding-top: 14px;\r\n    top: 100%;\r\n    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.10);\r\n}\r\n\r\n.e-hover-arrow {\r\n    position: absolute;\r\n    top: 7px;\r\n    /*left: 47%;*/\r\n    width: 20px;\r\n    height: 10px;\r\n    background: url(http://edu-image.nosdn.127.net/B59A8F7FC52C3FBC3D2C59023185CB8B.png?imageView&thumbnail=400y500&quality=100) no-repeat 9999px 9999px;\r\n    background-position: -136px -104px;\r\n    z-index: 1;\r\n}\r\n\r\n.e-hover-content {\r\n    padding: 10px 15px 15px;\r\n    background: #fff;\r\n    border: 1px solid #ddd;\r\n}';});

define('text!template/cache/cacheItem.js',[],function () { return '/**\r\n     * __name__\r\n     * @param  {Object} _data\r\n     */\r\n    _p._$__name__ = function (_data, _onLoad) {\r\n        _cache._$request({\r\n            url: \'__url__\',\r\n            method: \'__method__\',\r\n            data: _data,\r\n            onload: _onLoad\r\n        });\r\n    };\r\n';});

define('text!template/cache/dwrItem.js',[],function () { return '/**\r\n     * __name__\r\n     */\r\n    _p._$__name__ = function (_data, _onLoad) {\r\n        _dwr._$postDWR({\r\n            key: "__name__",\r\n            url: \'__url__\',\r\n            param: [_data],\r\n            onload: _onLoad\r\n        });\r\n    };\r\n';});

define('text!template/cache/callCache.js',[],function () { return '__cacheName__Cache._$__funcName__(__reqData__, function (_data) {\r\n                __cb__\r\n            }._$bind(this));\r\n';});

define('text!template/animate/animate.json',[],function () { return '{\r\n    "common": ".animated{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both}.animated.infinite{-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.animated.hinge{-webkit-animation-duration:2s;animation-duration:2s}.animated.bounceIn,.animated.bounceOut{-webkit-animation-duration:.75s;animation-duration:.75s}.animated.flipOutX,.animated.flipOutY{-webkit-animation-duration:.75s;animation-duration:.75s}",\r\n    "list": {\r\n        "none": "",\r\n        "bounce": "@-webkit-keyframes bounce{0%,20%,53%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}40%,43%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0)}70%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0)}90%{-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0)}}@keyframes bounce{0%,20%,53%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}40%,43%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0)}70%{-webkit-animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);animation-timing-function:cubic-bezier(0.755,0.050,0.855,0.060);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0)}90%{-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0)}}.bounce{-webkit-animation-name:bounce;animation-name:bounce;-webkit-transform-origin:center bottom;transform-origin:center bottom}",\r\n        "flash": "@-webkit-keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}@keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}.flash{-webkit-animation-name:flash;animation-name:flash}",\r\n        "pulse": "@-webkit-keyframes pulse{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}50%{-webkit-transform:scale3d(1.05,1.05,1.05);transform:scale3d(1.05,1.05,1.05)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes pulse{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}50%{-webkit-transform:scale3d(1.05,1.05,1.05);transform:scale3d(1.05,1.05,1.05)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.pulse{-webkit-animation-name:pulse;animation-name:pulse}",\r\n        "rubberBand": "@-webkit-keyframes rubberBand{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}30%{-webkit-transform:scale3d(1.25,0.75,1);transform:scale3d(1.25,0.75,1)}40%{-webkit-transform:scale3d(0.75,1.25,1);transform:scale3d(0.75,1.25,1)}50%{-webkit-transform:scale3d(1.15,0.85,1);transform:scale3d(1.15,0.85,1)}65%{-webkit-transform:scale3d(.95,1.05,1);transform:scale3d(.95,1.05,1)}75%{-webkit-transform:scale3d(1.05,.95,1);transform:scale3d(1.05,.95,1)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes rubberBand{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}30%{-webkit-transform:scale3d(1.25,0.75,1);transform:scale3d(1.25,0.75,1)}40%{-webkit-transform:scale3d(0.75,1.25,1);transform:scale3d(0.75,1.25,1)}50%{-webkit-transform:scale3d(1.15,0.85,1);transform:scale3d(1.15,0.85,1)}65%{-webkit-transform:scale3d(.95,1.05,1);transform:scale3d(.95,1.05,1)}75%{-webkit-transform:scale3d(1.05,.95,1);transform:scale3d(1.05,.95,1)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.rubberBand{-webkit-animation-name:rubberBand;animation-name:rubberBand}",\r\n        "shake": "@-webkit-keyframes shake{0%,100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}}@keyframes shake{0%,100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}}.shake{-webkit-animation-name:shake;animation-name:shake}",\r\n        "swing": "@-webkit-keyframes swing{20%{-webkit-transform:rotate3d(0,0,1,15deg);transform:rotate3d(0,0,1,15deg)}40%{-webkit-transform:rotate3d(0,0,1,-10deg);transform:rotate3d(0,0,1,-10deg)}60%{-webkit-transform:rotate3d(0,0,1,5deg);transform:rotate3d(0,0,1,5deg)}80%{-webkit-transform:rotate3d(0,0,1,-5deg);transform:rotate3d(0,0,1,-5deg)}100%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}}@keyframes swing{20%{-webkit-transform:rotate3d(0,0,1,15deg);transform:rotate3d(0,0,1,15deg)}40%{-webkit-transform:rotate3d(0,0,1,-10deg);transform:rotate3d(0,0,1,-10deg)}60%{-webkit-transform:rotate3d(0,0,1,5deg);transform:rotate3d(0,0,1,5deg)}80%{-webkit-transform:rotate3d(0,0,1,-5deg);transform:rotate3d(0,0,1,-5deg)}100%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}}.swing{-webkit-transform-origin:top center;transform-origin:top center;-webkit-animation-name:swing;animation-name:swing}",\r\n        "tada": "@-webkit-keyframes tada{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}10%,20%{-webkit-transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes tada{0%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}10%,20%{-webkit-transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{-webkit-transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}100%{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.tada{-webkit-animation-name:tada;animation-name:tada}",\r\n        "wobble": "@-webkit-keyframes wobble{0%{-webkit-transform:none;transform:none}15%{-webkit-transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg);transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{-webkit-transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg);transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{-webkit-transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg);transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{-webkit-transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg);transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{-webkit-transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg);transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}100%{-webkit-transform:none;transform:none}}@keyframes wobble{0%{-webkit-transform:none;transform:none}15%{-webkit-transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg);transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{-webkit-transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg);transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{-webkit-transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg);transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{-webkit-transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg);transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{-webkit-transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg);transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}100%{-webkit-transform:none;transform:none}}.wobble{-webkit-animation-name:wobble;animation-name:wobble}",\r\n        "jello": "@-webkit-keyframes jello{11.1%{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-0.78125deg) skewY(-0.78125deg);transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-0.1953125deg) skewY(-0.1953125deg);transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}100%{-webkit-transform:none;transform:none}}@keyframes jello{11.1%{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-0.78125deg) skewY(-0.78125deg);transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-0.1953125deg) skewY(-0.1953125deg);transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}100%{-webkit-transform:none;transform:none}}.jello{-webkit-animation-name:jello;animation-name:jello;-webkit-transform-origin:center;transform-origin:center}",\r\n        "bounceIn": "@-webkit-keyframes bounceIn{0%,20%,40%,60%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@keyframes bounceIn{0%,20%,40%,60%,80%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}.bounceIn{-webkit-animation-name:bounceIn;animation-name:bounceIn}",\r\n        "bounceInDown": "@-webkit-keyframes bounceInDown{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,-3000px,0);transform:translate3d(0,-3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,25px,0);transform:translate3d(0,25px,0)}75%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}90%{-webkit-transform:translate3d(0,5px,0);transform:translate3d(0,5px,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInDown{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,-3000px,0);transform:translate3d(0,-3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,25px,0);transform:translate3d(0,25px,0)}75%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}90%{-webkit-transform:translate3d(0,5px,0);transform:translate3d(0,5px,0)}100%{-webkit-transform:none;transform:none}}.bounceInDown{-webkit-animation-name:bounceInDown;animation-name:bounceInDown}",\r\n        "bounceInLeft": "@-webkit-keyframes bounceInLeft{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(-3000px,0,0);transform:translate3d(-3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(25px,0,0);transform:translate3d(25px,0,0)}75%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}90%{-webkit-transform:translate3d(5px,0,0);transform:translate3d(5px,0,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInLeft{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(-3000px,0,0);transform:translate3d(-3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(25px,0,0);transform:translate3d(25px,0,0)}75%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}90%{-webkit-transform:translate3d(5px,0,0);transform:translate3d(5px,0,0)}100%{-webkit-transform:none;transform:none}}.bounceInLeft{-webkit-animation-name:bounceInLeft;animation-name:bounceInLeft}",\r\n        "bounceInRight": "@-webkit-keyframes bounceInRight{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(3000px,0,0);transform:translate3d(3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(-25px,0,0);transform:translate3d(-25px,0,0)}75%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}90%{-webkit-transform:translate3d(-5px,0,0);transform:translate3d(-5px,0,0)}100%{-webkit-transform:none;transform:none}}@keyframes bounceInRight{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(3000px,0,0);transform:translate3d(3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(-25px,0,0);transform:translate3d(-25px,0,0)}75%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}90%{-webkit-transform:translate3d(-5px,0,0);transform:translate3d(-5px,0,0)}100%{-webkit-transform:none;transform:none}}.bounceInRight{-webkit-animation-name:bounceInRight;animation-name:bounceInRight}",\r\n        "bounceInUp": "@-webkit-keyframes bounceInUp{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,3000px,0);transform:translate3d(0,3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{0%,60%,75%,90%,100%{-webkit-animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000);animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}0%{opacity:0;-webkit-transform:translate3d(0,3000px,0);transform:translate3d(0,3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;animation-name:bounceInUp}",\r\n        "bounceOut": "@-webkit-keyframes bounceOut{20%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}}@keyframes bounceOut{20%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}}.bounceOut{-webkit-animation-name:bounceOut;animation-name:bounceOut}",\r\n        "bounceOutDown": "@-webkit-keyframes bounceOutDown{20%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}@keyframes bounceOutDown{20%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}.bounceOutDown{-webkit-animation-name:bounceOutDown;animation-name:bounceOutDown}",\r\n        "bounceOutLeft": "@-webkit-keyframes bounceOutLeft{20%{opacity:1;-webkit-transform:translate3d(20px,0,0);transform:translate3d(20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}@keyframes bounceOutLeft{20%{opacity:1;-webkit-transform:translate3d(20px,0,0);transform:translate3d(20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}.bounceOutLeft{-webkit-animation-name:bounceOutLeft;animation-name:bounceOutLeft}",\r\n        "bounceOutRight": "@-webkit-keyframes bounceOutRight{20%{opacity:1;-webkit-transform:translate3d(-20px,0,0);transform:translate3d(-20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}@keyframes bounceOutRight{20%{opacity:1;-webkit-transform:translate3d(-20px,0,0);transform:translate3d(-20px,0,0)}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}.bounceOutRight{-webkit-animation-name:bounceOutRight;animation-name:bounceOutRight}",\r\n        "bounceOutUp": "@-webkit-keyframes bounceOutUp{20%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,20px,0);transform:translate3d(0,20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}@keyframes bounceOutUp{20%{-webkit-transform:translate3d(0,-10px,0);transform:translate3d(0,-10px,0)}40%,45%{opacity:1;-webkit-transform:translate3d(0,20px,0);transform:translate3d(0,20px,0)}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}.bounceOutUp{-webkit-animation-name:bounceOutUp;animation-name:bounceOutUp}",\r\n        "fadeIn": "@-webkit-keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}.fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}",\r\n        "fadeInDown": "@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInDown{-webkit-animation-name:fadeInDown;animation-name:fadeInDown}",\r\n        "fadeInDownBig": "@-webkit-keyframes fadeInDownBig{0%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInDownBig{0%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInDownBig{-webkit-animation-name:fadeInDownBig;animation-name:fadeInDownBig}",\r\n        "fadeInLeft": "@-webkit-keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInLeft{-webkit-animation-name:fadeInLeft;animation-name:fadeInLeft}",\r\n        "fadeInLeftBig": "@-webkit-keyframes fadeInLeftBig{0%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInLeftBig{0%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInLeftBig{-webkit-animation-name:fadeInLeftBig;animation-name:fadeInLeftBig}",\r\n        "fadeInRight": "@-webkit-keyframes fadeInRight{0%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInRight{0%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInRight{-webkit-animation-name:fadeInRight;animation-name:fadeInRight}",\r\n        "fadeInRightBig": "@-webkit-keyframes fadeInRightBig{0%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInRightBig{0%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInRightBig{-webkit-animation-name:fadeInRightBig;animation-name:fadeInRightBig}",\r\n        "fadeInUp": "@-webkit-keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp}",\r\n        "fadeInUpBig": "@-webkit-keyframes fadeInUpBig{0%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInUpBig{0%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}100%{opacity:1;-webkit-transform:none;transform:none}}.fadeInUpBig{-webkit-animation-name:fadeInUpBig;animation-name:fadeInUpBig}",\r\n        "fadeOut": "@-webkit-keyframes fadeOut{0%{opacity:1}100%{opacity:0}}@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}.fadeOut{-webkit-animation-name:fadeOut;animation-name:fadeOut}",\r\n        "fadeOutDown": "@-webkit-keyframes fadeOutDown{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}@keyframes fadeOutDown{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}.fadeOutDown{-webkit-animation-name:fadeOutDown;animation-name:fadeOutDown}",\r\n        "fadeOutDownBig": "@-webkit-keyframes fadeOutDownBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}@keyframes fadeOutDownBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,2000px,0);transform:translate3d(0,2000px,0)}}.fadeOutDownBig{-webkit-animation-name:fadeOutDownBig;animation-name:fadeOutDownBig}",\r\n        "fadeOutLeft": "@-webkit-keyframes fadeOutLeft{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}@keyframes fadeOutLeft{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}.fadeOutLeft{-webkit-animation-name:fadeOutLeft;animation-name:fadeOutLeft}",\r\n        "fadeOutLeftBig": "@-webkit-keyframes fadeOutLeftBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}@keyframes fadeOutLeftBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(-2000px,0,0);transform:translate3d(-2000px,0,0)}}.fadeOutLeftBig{-webkit-animation-name:fadeOutLeftBig;animation-name:fadeOutLeftBig}",\r\n        "fadeOutRight": "@-webkit-keyframes fadeOutRight{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}@keyframes fadeOutRight{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}.fadeOutRight{-webkit-animation-name:fadeOutRight;animation-name:fadeOutRight}",\r\n        "fadeOutRightBig": "@-webkit-keyframes fadeOutRightBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}@keyframes fadeOutRightBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(2000px,0,0);transform:translate3d(2000px,0,0)}}.fadeOutRightBig{-webkit-animation-name:fadeOutRightBig;animation-name:fadeOutRightBig}",\r\n        "fadeOutUp": "@-webkit-keyframes fadeOutUp{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}@keyframes fadeOutUp{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}.fadeOutUp{-webkit-animation-name:fadeOutUp;animation-name:fadeOutUp}",\r\n        "fadeOutUpBig": "@-webkit-keyframes fadeOutUpBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}@keyframes fadeOutUpBig{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}.fadeOutUpBig{-webkit-animation-name:fadeOutUpBig;animation-name:fadeOutUpBig}",\r\n        "flip": "@-webkit-keyframes flip{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-360deg);transform:perspective(400px) rotate3d(0,1,0,-360deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}40%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}50%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}80%{-webkit-transform:perspective(400px) scale3d(.95,.95,.95);transform:perspective(400px) scale3d(.95,.95,.95);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}100%{-webkit-transform:perspective(400px);transform:perspective(400px);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}}@keyframes flip{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-360deg);transform:perspective(400px) rotate3d(0,1,0,-360deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}40%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}50%{-webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}80%{-webkit-transform:perspective(400px) scale3d(.95,.95,.95);transform:perspective(400px) scale3d(.95,.95,.95);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}100%{-webkit-transform:perspective(400px);transform:perspective(400px);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}}.animated.flip{-webkit-backface-visibility:visible;backface-visibility:visible;-webkit-animation-name:flip;animation-name:flip}",\r\n        "flipInX": "@-webkit-keyframes flipInX{0%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(1,0,0,10deg);transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-5deg);transform:perspective(400px) rotate3d(1,0,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInX{0%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(1,0,0,10deg);transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-5deg);transform:perspective(400px) rotate3d(1,0,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}.flipInX{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInX;animation-name:flipInX}",\r\n        "flipInY": "@-webkit-keyframes flipInY{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-20deg);transform:perspective(400px) rotate3d(0,1,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(0,1,0,10deg);transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-5deg);transform:perspective(400px) rotate3d(0,1,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInY{0%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-20deg);transform:perspective(400px) rotate3d(0,1,0,-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotate3d(0,1,0,10deg);transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-5deg);transform:perspective(400px) rotate3d(0,1,0,-5deg)}100%{-webkit-transform:perspective(400px);transform:perspective(400px)}}.flipInY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInY;animation-name:flipInY}",\r\n        "flipOutX": "@-webkit-keyframes flipOutX{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}@keyframes flipOutX{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(1,0,0,-20deg);transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(1,0,0,90deg);transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}.flipOutX{-webkit-animation-name:flipOutX;animation-name:flipOutX;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}",\r\n        "flipOutY": "@-webkit-keyframes flipOutY{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-15deg);transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}@keyframes flipOutY{0%{-webkit-transform:perspective(400px);transform:perspective(400px)}30%{-webkit-transform:perspective(400px) rotate3d(0,1,0,-15deg);transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}100%{-webkit-transform:perspective(400px) rotate3d(0,1,0,90deg);transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}.flipOutY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipOutY;animation-name:flipOutY}",\r\n        "lightSpeedIn": "@-webkit-keyframes lightSpeedIn{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg);opacity:1}100%{-webkit-transform:none;transform:none;opacity:1}}@keyframes lightSpeedIn{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg);opacity:1}100%{-webkit-transform:none;transform:none;opacity:1}}.lightSpeedIn{-webkit-animation-name:lightSpeedIn;animation-name:lightSpeedIn;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}",\r\n        "lightSpeedOut": "@-webkit-keyframes lightSpeedOut{0%{opacity:1}100%{-webkit-transform:translate3d(100%,0,0) skewX(30deg);transform:translate3d(100%,0,0) skewX(30deg);opacity:0}}@keyframes lightSpeedOut{0%{opacity:1}100%{-webkit-transform:translate3d(100%,0,0) skewX(30deg);transform:translate3d(100%,0,0) skewX(30deg);opacity:0}}.lightSpeedOut{-webkit-animation-name:lightSpeedOut;animation-name:lightSpeedOut;-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}",\r\n        "rotateIn": "@-webkit-keyframes rotateIn{0%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,-200deg);transform:rotate3d(0,0,1,-200deg);opacity:0}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateIn{0%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,-200deg);transform:rotate3d(0,0,1,-200deg);opacity:0}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:none;transform:none;opacity:1}}.rotateIn{-webkit-animation-name:rotateIn;animation-name:rotateIn}",\r\n        "rotateInDownLeft": "@-webkit-keyframes rotateInDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInDownLeft{-webkit-animation-name:rotateInDownLeft;animation-name:rotateInDownLeft}",\r\n        "rotateInDownRight": "@-webkit-keyframes rotateInDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInDownRight{-webkit-animation-name:rotateInDownRight;animation-name:rotateInDownRight}",\r\n        "rotateInUpLeft": "@-webkit-keyframes rotateInUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInUpLeft{-webkit-animation-name:rotateInUpLeft;animation-name:rotateInUpLeft}",\r\n        "rotateInUpRight": "@-webkit-keyframes rotateInUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-90deg);transform:rotate3d(0,0,1,-90deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}@keyframes rotateInUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-90deg);transform:rotate3d(0,0,1,-90deg);opacity:0}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:none;transform:none;opacity:1}}.rotateInUpRight{-webkit-animation-name:rotateInUpRight;animation-name:rotateInUpRight}",\r\n        "rotateOut": "@-webkit-keyframes rotateOut{0%{-webkit-transform-origin:center;transform-origin:center;opacity:1}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,200deg);transform:rotate3d(0,0,1,200deg);opacity:0}}@keyframes rotateOut{0%{-webkit-transform-origin:center;transform-origin:center;opacity:1}100%{-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate3d(0,0,1,200deg);transform:rotate3d(0,0,1,200deg);opacity:0}}.rotateOut{-webkit-animation-name:rotateOut;animation-name:rotateOut}",\r\n        "rotateOutDownLeft": "@-webkit-keyframes rotateOutDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}}@keyframes rotateOutDownLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,45deg);transform:rotate3d(0,0,1,45deg);opacity:0}}.rotateOutDownLeft{-webkit-animation-name:rotateOutDownLeft;animation-name:rotateOutDownLeft}",\r\n        "rotateOutDownRight": "@-webkit-keyframes rotateOutDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}@keyframes rotateOutDownRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}.rotateOutDownRight{-webkit-animation-name:rotateOutDownRight;animation-name:rotateOutDownRight}",\r\n        "rotateOutUpLeft": "@-webkit-keyframes rotateOutUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}@keyframes rotateOutUpLeft{0%{-webkit-transform-origin:left bottom;transform-origin:left bottom;opacity:1}100%{-webkit-transform-origin:left bottom;transform-origin:left bottom;-webkit-transform:rotate3d(0,0,1,-45deg);transform:rotate3d(0,0,1,-45deg);opacity:0}}.rotateOutUpLeft{-webkit-animation-name:rotateOutUpLeft;animation-name:rotateOutUpLeft}",\r\n        "rotateOutUpRight": "@-webkit-keyframes rotateOutUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,90deg);transform:rotate3d(0,0,1,90deg);opacity:0}}@keyframes rotateOutUpRight{0%{-webkit-transform-origin:right bottom;transform-origin:right bottom;opacity:1}100%{-webkit-transform-origin:right bottom;transform-origin:right bottom;-webkit-transform:rotate3d(0,0,1,90deg);transform:rotate3d(0,0,1,90deg);opacity:0}}.rotateOutUpRight{-webkit-animation-name:rotateOutUpRight;animation-name:rotateOutUpRight}",\r\n        "hinge": "@-webkit-keyframes hinge{0%{-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}20%,60%{-webkit-transform:rotate3d(0,0,1,80deg);transform:rotate3d(0,0,1,80deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}40%,80%{-webkit-transform:rotate3d(0,0,1,60deg);transform:rotate3d(0,0,1,60deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;opacity:1}100%{-webkit-transform:translate3d(0,700px,0);transform:translate3d(0,700px,0);opacity:0}}@keyframes hinge{0%{-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}20%,60%{-webkit-transform:rotate3d(0,0,1,80deg);transform:rotate3d(0,0,1,80deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}40%,80%{-webkit-transform:rotate3d(0,0,1,60deg);transform:rotate3d(0,0,1,60deg);-webkit-transform-origin:top left;transform-origin:top left;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;opacity:1}100%{-webkit-transform:translate3d(0,700px,0);transform:translate3d(0,700px,0);opacity:0}}.hinge{-webkit-animation-name:hinge;animation-name:hinge}",\r\n        "rollIn": "@-webkit-keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg);transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}100%{opacity:1;-webkit-transform:none;transform:none}}@keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg);transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}100%{opacity:1;-webkit-transform:none;transform:none}}.rollIn{-webkit-animation-name:rollIn;animation-name:rollIn}",\r\n        "rollOut": "@-webkit-keyframes rollOut{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg);transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}@keyframes rollOut{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg);transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}.rollOut{-webkit-animation-name:rollOut;animation-name:rollOut}",\r\n        "zoomIn": "@-webkit-keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}.zoomIn{-webkit-animation-name:zoomIn;animation-name:zoomIn}",\r\n        "zoomInDown": "@-webkit-keyframes zoomInDown{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInDown{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInDown{-webkit-animation-name:zoomInDown;animation-name:zoomInDown}",\r\n        "zoomInLeft": "@-webkit-keyframes zoomInLeft{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(10px,0,0);transform:scale3d(.475,.475,.475) translate3d(10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInLeft{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(10px,0,0);transform:scale3d(.475,.475,.475) translate3d(10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInLeft{-webkit-animation-name:zoomInLeft;animation-name:zoomInLeft}",\r\n        "zoomInRight": "@-webkit-keyframes zoomInRight{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInRight{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInRight{-webkit-animation-name:zoomInRight;animation-name:zoomInRight}",\r\n        "zoomInUp": "@-webkit-keyframes zoomInUp{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomInUp{0%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}60%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomInUp{-webkit-animation-name:zoomInUp;animation-name:zoomInUp}",\r\n        "zoomOut": "@-webkit-keyframes zoomOut{0%{opacity:1}50%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}100%{opacity:0}}@keyframes zoomOut{0%{opacity:1}50%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}100%{opacity:0}}.zoomOut{-webkit-animation-name:zoomOut;animation-name:zoomOut}",\r\n        "zoomOutDown": "@-webkit-keyframes zoomOutDown{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomOutDown{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomOutDown{-webkit-animation-name:zoomOutDown;animation-name:zoomOutDown}",\r\n        "zoomOutLeft": "@-webkit-keyframes zoomOutLeft{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(42px,0,0);transform:scale3d(.475,.475,.475) translate3d(42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(-2000px,0,0);transform:scale(.1) translate3d(-2000px,0,0);-webkit-transform-origin:left center;transform-origin:left center}}@keyframes zoomOutLeft{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(42px,0,0);transform:scale3d(.475,.475,.475) translate3d(42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(-2000px,0,0);transform:scale(.1) translate3d(-2000px,0,0);-webkit-transform-origin:left center;transform-origin:left center}}.zoomOutLeft{-webkit-animation-name:zoomOutLeft;animation-name:zoomOutLeft}",\r\n        "zoomOutRight": "@-webkit-keyframes zoomOutRight{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-42px,0,0);transform:scale3d(.475,.475,.475) translate3d(-42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(2000px,0,0);transform:scale(.1) translate3d(2000px,0,0);-webkit-transform-origin:right center;transform-origin:right center}}@keyframes zoomOutRight{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(-42px,0,0);transform:scale3d(.475,.475,.475) translate3d(-42px,0,0)}100%{opacity:0;-webkit-transform:scale(.1) translate3d(2000px,0,0);transform:scale(.1) translate3d(2000px,0,0);-webkit-transform-origin:right center;transform-origin:right center}}.zoomOutRight{-webkit-animation-name:zoomOutRight;animation-name:zoomOutRight}",\r\n        "zoomOutUp": "@-webkit-keyframes zoomOutUp{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}@keyframes zoomOutUp{40%{opacity:1;-webkit-transform:scale3d(.475,.475,.475) translate3d(0,60px,0);transform:scale3d(.475,.475,.475) translate3d(0,60px,0);-webkit-animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190);animation-timing-function:cubic-bezier(0.550,0.055,0.675,0.190)}100%{opacity:0;-webkit-transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);-webkit-transform-origin:center bottom;transform-origin:center bottom;-webkit-animation-timing-function:cubic-bezier(0.175,0.885,0.320,1);animation-timing-function:cubic-bezier(0.175,0.885,0.320,1)}}.zoomOutUp{-webkit-animation-name:zoomOutUp;animation-name:zoomOutUp}",\r\n        "slideInDown": "@-webkit-keyframes slideInDown{0%{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInDown{0%{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInDown{-webkit-animation-name:slideInDown;animation-name:slideInDown}",\r\n        "slideInLeft": "@-webkit-keyframes slideInLeft{0%{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInLeft{0%{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInLeft{-webkit-animation-name:slideInLeft;animation-name:slideInLeft}",\r\n        "slideInRight": "@-webkit-keyframes slideInRight{0%{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInRight{0%{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInRight{-webkit-animation-name:slideInRight;animation-name:slideInRight}",\r\n        "slideInUp": "@-webkit-keyframes slideInUp{0%{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes slideInUp{0%{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);visibility:visible}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.slideInUp{-webkit-animation-name:slideInUp;animation-name:slideInUp}",\r\n        "slideOutDown": "@-webkit-keyframes slideOutDown{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}@keyframes slideOutDown{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}.slideOutDown{-webkit-animation-name:slideOutDown;animation-name:slideOutDown}",\r\n        "slideOutLeft": "@-webkit-keyframes slideOutLeft{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}@keyframes slideOutLeft{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}.slideOutLeft{-webkit-animation-name:slideOutLeft;animation-name:slideOutLeft}",\r\n        "slideOutRight": "@-webkit-keyframes slideOutRight{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}@keyframes slideOutRight{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}.slideOutRight{-webkit-animation-name:slideOutRight;animation-name:slideOutRight}",\r\n        "slideOutUp": "@-webkit-keyframes slideOutUp{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}@keyframes slideOutUp{0%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}100%{visibility:hidden;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}.slideOutUp{-webkit-animation-name:slideOutUp;animation-name:slideOutUp}"\r\n    }\r\n}\r\n';});

define('text!template/animate/animate.js',[],function () { return '//滚动到显示的时候 触发动画\r\nfunction scrollShow() {\r\n    var x = document.getElementsByClassName("animated");\r\n    for (i = 0; i < x.length; i++) {\r\n        var item = x[i];\r\n        var _cls = item.className;\r\n        if (_cls.indexOf("aniover") >= 0) {\r\n            return;\r\n        }\r\n        var top = item.getBoundingClientRect().top;\r\n        var se = document.documentElement.clientHeight;\r\n\r\n        if (top <= se) {\r\n            var _ani = _cls.substring(_cls.indexOf("animated"));\r\n            item.className = _cls.substring(0, _cls.indexOf("animated"));\r\n            setTimeout(function () {\r\n                item.className = item.className + " " + _ani + " aniover";\r\n            }, 100);\r\n\r\n        }\r\n    }\r\n}\r\n\r\nwindow.onscroll = function () {\r\n    scrollShow();\r\n}\r\nscrollShow();\r\n';});

define('core/element',['require','qpf','knockout','$','_','onecolor','ko.mapping','./command','text!template/hover/hover.html','text!template/hover/hover.css','text!template/cache/cacheItem.js','text!template/cache/dwrItem.js','text!template/cache/callCache.js','text!template/animate/animate.json','text!template/animate/animate.js'],function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var $ = require("$");
    var _ = require("_");
    var onecolor = require("onecolor");
    var koMapping = require("ko.mapping");

    var command = require("./command");

    var hoverHtml = require("text!template/hover/hover.html");
    var hoverCss = require("text!template/hover/hover.css");

    var cacheItem = require("text!template/cache/cacheItem.js");
    var dwrItem = require("text!template/cache/dwrItem.js");
    var callCache = require("text!template/cache/callCache.js");

    var Draggable = qpf.helper.Draggable;

    var animationJson = JSON.parse(require("text!template/animate/animate.json"));
    var animationJs = require("text!template/animate/animate.js");
    var animaList = [];
    for (var i in animationJson.list) {
        animaList.push({
            "text": i,
            "value": i
        });
    }

    var Element = qpf.core.Clazz.derive(function () {

        var hasBackground = ko.observable(false);
        var hasBorder = ko.observable(false);
        var isBackgroundImageGradient = ko.computed({
            read: function () {
                return hasBackground() &&
                    ret.properties.backgroundImageType() === 'gradient'
            },
            deferEvaluation: true
        });
        var isBackgroundImageFile = ko.computed({
            read: function () {
                return hasBackground() &&
                    ret.properties.backgroundImageType() === 'file'
            }
        });

        var ret = {

            name: "",
            icon: "",

            eid: genEID(),

            $wrapper: $("<div><a style='display:inline-block;width:100%;'></a></div>"),

            type: "ELEMENT",

            // Properties view model
            properties: {
                id: ko.observable(""),
                rid: ko.observable(""),

                width: ko.observable(100),
                height: ko.observable(100),
                left: ko.observable(0),
                top: ko.observable(0),

                zIndex: ko.observable(0),

                boxColor: ko.observable("#000000"),
                //-------------------
                // border
                border: hasBorder,
                borderColor: ko.observable(0x55b929),

                //-------------------
                // Background
                background: hasBackground,
                backgroundColor: ko.observable(0xffffff),
                backgroundAlpha: ko.observable(1),
                backgroundImageType: ko.observable("none"),
                backgroundGradientStops: ko.observableArray([{
                    percent: ko.observable(0),
                    color: ko.observable('rgba(255, 255, 255, 1)')
                }, {
                    percent: ko.observable(1),
                    color: ko.observable('rgba(0, 0, 0, 1)')
                }]),
                backgroundGradientAngle: ko.observable(180),
                backgroundImageStr: ko.observable(""),

                //-------------------
                // Border radius
                borderTopLeftRadius: ko.observable(0),
                borderTopRightRadius: ko.observable(0),
                borderBottomRightRadius: ko.observable(0),
                borderBottomLeftRadius: ko.observable(0),
                //-------------------
                // margin
                marginTop: ko.observable(0),
                marginRight: ko.observable(0),
                marginBottom: ko.observable(0),
                marginLeft: ko.observable(0),
                //-------------------
                // padding
                paddingTop: ko.observable(0),
                paddingRight: ko.observable(0),
                paddingBottom: ko.observable(0),
                paddingLeft: ko.observable(0),


                //-------------------
                // Shadow
                hasShadow: ko.observable(false),
                shadowOffsetX: ko.observable(0),
                shadowOffsetY: ko.observable(0),
                shadowBlur: ko.observable(10),
                shadowColor: ko.observable(0),
                shadowColorAlpha: ko.observable(1),
                boxFontSize: ko.observable(16),

                //-------------------
                // link related
                newBlank: ko.observable(false),
                targetUrl: ko.observable(""),

                //-------------------
                // class related
                boxClassStr: ko.observable(""),

                //-------------------
                //overflow related
                overflowX: ko.observable(false),
                overflowY: ko.observable(false),

                //-------------------
                //hover related
                hover: ko.observable(false),
                hoverComponent: ko.observable(""),

                //hover 样式字符串，目前只能手写比较简单
                hoverStr: ko.observable(""),

                //animate动画样式
                animateStr: ko.observable("none"),


            },

            onResize: function () {},
            onMove: function () {},

            onCreate: function () {},
            onRemove: function () {},

            onExport: function () {},
            onImport: function () {},

            onOutput: function () {}

        }

        // UI Config for property Panel
        var props = ret.properties;
        ret.uiConfig = {
            id: {
                label: "标志id",
                field: "style",
                ui: "textfield",
                text: props.id
            },
            rid: {
                label: "元素id",

                ui: "textfield",
                text: props.rid
            },
            position: {
                label: "位置",
                ui: "vector",
                field: "layout",
                items: [{
                    name: "left",
                    type: "spinner",
                    value: props.left,
                    precision: 0,
                    step: 1
                }, {
                    name: "top",
                    type: "spinner",
                    value: props.top,
                    precision: 0,
                    step: 1
                }]
            },


            size: {
                label: "宽高",
                ui: "vector",
                field: "layout",
                items: [{
                    name: "width",
                    type: "textfield",
                    text: props.width,
                    value: props.width
                }, {
                    name: "height",
                    type: "textfield",
                    text: props.height,
                    value: props.height
                }],
                // constrainProportion : ko.observable(true),
                constrainType: "no"
            },

            zIndex: {
                label: "Z",
                ui: "spinner",
                field: 'layout',
                value: props.zIndex,
                step: 1,
                precision: 0
            },


            border: {
                label: "边框",
                ui: "checkbox",
                field: "style",
                checked: hasBorder
            },

            borderColor: {
                label: "边框色",
                ui: "color",
                field: "style",
                color: props.borderColor,
                visible: hasBorder
            },
            background: {
                label: "背景",
                ui: "checkbox",
                field: "style",
                checked: hasBackground
            },

            backgroundColor: {
                label: "背景色",
                ui: "color",
                field: "style",
                color: props.backgroundColor,
                alpha: props.backgroundAlpha,
                visible: hasBackground
            },

            backgroundImageType: {
                label: "背景图片",
                ui: "combobox",
                class: "small",
                field: "style",
                items: [{
                    text: "无",
                    value: "none"
                }, {
                    text: "渐变",
                    value: "gradient"
                }, {
                    text: "图片文件",
                    value: "file"
                }],
                value: props.backgroundImageType,
                visible: hasBackground
            },
            backgroundImageStr: {
                label: "background",
                field: "style",
                ui: "textfield",
                text: props.backgroundImageStr,
                visible: isBackgroundImageFile
            },

            backgroundGradient: {
                ui: "gradient",
                field: "style",
                stops: props.backgroundGradientStops,
                angle: props.backgroundGradientAngle,
                visible: isBackgroundImageGradient
            },

            borderRadius: {
                label: "圆角",
                ui: "vector",
                field: "style",
                items: [{
                    name: "top-left",
                    type: "slider",
                    value: props.borderTopLeftRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "top-right",
                    type: "slider",
                    value: props.borderTopRightRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "bottom-right",
                    type: "slider",
                    value: props.borderBottomRightRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "bottom-left",
                    type: "slider",
                    value: props.borderBottomLeftRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }],
                constrainProportion: ko.observable(true)
            },
            margin: {
                label: "margin",
                ui: "vector",
                field: "layout",
                items: [{
                    name: "top",
                    type: "slider",
                    value: props.marginTop,
                    precision: 0,
                    step: 1,
                    min: -20,
                    max: 50,
                }, {
                    name: "right",
                    type: "textfield",
                    text: props.marginRight,
                    value: props.marginRight,

                }, {
                    name: "bottom",
                    type: "slider",
                    value: props.marginBottom,
                    precision: 0,
                    step: 1,
                    min: -20,
                    max: 50,
                }, {
                    name: "left",
                    type: "textfield",
                    text: props.marginLeft,
                    value: props.marginLeft,

                }],
                constrainProportion: ko.observable(true)
            },
            padding: {
                label: "padding",
                ui: "vector",
                field: "layout",
                items: [{
                    name: "top",
                    type: "slider",
                    value: props.paddingTop,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50,
                }, {
                    name: "right",
                    type: "slider",
                    value: props.paddingRight,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50,
                }, {
                    name: "bottom",
                    type: "slider",
                    value: props.paddingBottom,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50,
                }, {
                    name: "left",
                    type: "slider",
                    value: props.paddingLeft,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50,
                }],
                constrainProportion: ko.observable(true)
            },

            shadow: {
                label: "阴影",
                ui: "checkbox",
                field: "style",
                checked: props.hasShadow
            },

            shadowSize: {
                field: "style",
                ui: "slider",
                min: 1,
                max: 50,
                precision: 0,
                value: props.shadowBlur,
                visible: props.hasShadow
            },

            shadowOffset: {
                ui: "vector",
                field: "style",
                items: [{
                    name: "shadowOffsetX",
                    type: "slider",
                    min: -50,
                    max: 50,
                    precision: 0,
                    value: props.shadowOffsetX
                }, {
                    name: "shadowOffsetY",
                    type: "slider",
                    min: -50,
                    max: 50,
                    precision: 0,
                    value: props.shadowOffsetY
                }],
                visible: props.hasShadow
            },

            shadowColor: {
                ui: "color",
                field: "style",
                color: props.shadowColor,
                alpha: props.shadowColorAlpha,
                visible: props.hasShadow
            },
            boxFontSize: {
                label: "Box大小",
                ui: "spinner",
                field: "style",
                value: props.boxFontSize
            },
            boxColor: {
                label: "Box颜色",
                ui: "textfield",
                field: "style",
                text: props.boxColor
            },
            href: {
                label: "超链接",
                ui: "vector",
                items: [{
                    label: "新开页面",
                    type: "checkbox",
                    checked: props.newBlank,
                    value: props.newBlank
                }, {
                    name: "URL",
                    type: "textfield",
                    text: props.targetUrl,
                    value: props.targetUrl
                }]
            },
            boxClassStr: {
                label: "Box类名",
                ui: "textfield",
                field: "style",
                text: props.boxClassStr
            },

            overflowX: {
                label: "overflowX",
                ui: "checkbox",
                field: 'layout',
                checked: props.overflowX
            },
            overflowY: {
                label: "overflowY",
                ui: "checkbox",
                field: 'layout',
                checked: props.overflowY
            },
            hover: {
                label: "Hover",
                ui: "checkbox",
                field: 'layout',
                checked: props.hover
            },
            hoverComponent: {
                label: "HoverC",
                ui: "textfield",
                field: 'layout',
                text: props.hoverComponent
            },
            hoverStr: {
                label: "HoverStr",
                ui: "textarea",
                text: props.hoverStr
            },
            animateStr: {
                label: "动画",
                ui: "combobox",
                class: "small",
                items: animaList,
                value: props.animateStr
            }
        };

        return ret;
    }, {

        initialize: function (config) {

            this.$wrapper.attr("data-cmp-eid", this.eid);

            var self = this,
                properties = self.properties;


            if (config) {
                if (config.extendProperties) {
                    var extendedProps = config.extendProperties.call(this);
                    if (extendedProps) {
                        _.extend(properties, extendedProps);
                    }
                }
                // Extend UI Config in the properties panel
                if (config.extendUIConfig) {
                    var extendedUIConfig = config.extendUIConfig.call(this);
                    if (extendedUIConfig) {
                        _.extend(this.uiConfig, extendedUIConfig);
                    }
                }
            }

            if (config) {
                _.extend(self, _.omit(config, "properties"));
            }

            var inCreate = true;
            // Left and top
            ko.computed({
                read: function () {
                    var left = properties.left(),
                        top = properties.top();
                    self.$wrapper.css({
                        left: left + "px",
                        top: top + "px"
                    })
                    // Dont trigger the event when the element is initializing
                    if (!inCreate) {
                        self.onMove(left, top);
                    };
                }
            });
            // Width and height
            ko.computed({
                read: function () {
                    var width = properties.width(),
                        height = properties.height();
                    self.resize(width, height);
                    if (!inCreate) {
                        self.onResize(width, height);
                    }

                    inCreate = false;
                }
            });
            // Z Index
            ko.computed({
                read: function () {
                    self.$wrapper.css({
                        'z-index': self.properties.zIndex()
                    })
                }
            });
            // rid
            ko.computed({
                read: function () {
                    var _rid = self.properties.rid();

                    if (_rid) {
                        self.$wrapper.attr({
                            'id': self.properties.rid()
                        });
                    } else {
                        self.$wrapper.removeAttr('id');
                    }
                }
            });


            // targetUrl
            ko.computed({
                read: function () {
                    var _url = self.properties.targetUrl();
                    if (_url) {
                        $(self.$wrapper.find("a")[0]).attr({
                            'href': _url
                        });
                    } else {
                        $(self.$wrapper.find("a")[0]).removeAttr('href');
                    }


                }
            });
            // classStr
            ko.computed({
                read: function () {
                    var _cls = self.properties.boxClassStr();
                    self.$wrapper.attr({
                        'class': _cls
                    });
                }
            });
            // hoverStr
            ko.computed({
                read: function () {
                    var _hoverStr = self.properties.hoverStr();
                    if (_hoverStr) {
                        self.$wrapper.attr({
                            'hoverStyle': _hoverStr
                        });
                    } else {
                        self.$wrapper.removeAttr('hoverStyle');
                    }
                }
            });
            // newBlank
            ko.computed({
                read: function () {
                    var _newBlank = self.properties.newBlank();
                    var _url = self.properties.targetUrl();
                    if (_url.length) {
                        if (_newBlank) {
                            $(self.$wrapper.find("a")[0]).attr({
                                'target': "_blank"
                            })
                        } else {
                            $(self.$wrapper.find("a")[0]).attr({
                                'target': "_top"
                            })
                        }

                    }

                }
            });
            //overflow
            ko.computed({
                read: function () {
                    var _overflowX = self.properties.overflowX();
                    var _overflowY = self.properties.overflowY();
                    if (_overflowX && _overflowY) {
                        self.$wrapper.css({
                            "overflow": "hidden"
                        });
                    }
                    if (_overflowX) {
                        self.$wrapper.css({
                            "overflow-x": "hidden"
                        });
                    } else {
                        self.$wrapper.css({
                            "overflow-x": ""
                        });
                    }
                    if (_overflowY) {
                        self.$wrapper.css({
                            "overflow-y": "hidden"
                        });
                    } else {
                        self.$wrapper.css({
                            "overflow-y": ""
                        });
                    }

                }
            });

            // Border radius
            ko.computed({
                read: function () {
                    var br = self.uiConfig.borderRadius.items;
                    var ma = self.uiConfig.margin.items;
                    var pa = self.uiConfig.padding.items;

                    self.$wrapper.css({
                        'border-radius': _.map(br, function (item) {
                            return Math.round(item.value()) + "px"
                        }).join(" "),
                        'margin': _.map(ma, function (item) {
                            return (!isNaN(+item.value()) ? (Math.round(item.value()) + "px") : (item.value()));
                        }).join(" "),
                        'padding': _.map(pa, function (item) {
                            return Math.round(item.value()) + "px"
                        }).join(" ")
                    })
                }
            });
            //Font size and text color
            ko.computed(function () {
                self.$wrapper.css({
                    "color": self.properties.boxColor(),
                    "font-size": self.properties.boxFontSize()
                });
            });
            //animation
            ko.computed(function () {
                var _animateStr = self.properties.animateStr();
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

                if (_animateStr) {
                    self.$wrapper.addClass('animated ' + _animateStr).one(animationEnd, function () {
                        $(this).removeClass('animated ' + _animateStr);
                    });
                }
            });

            // Border
            ko.computed({
                read: function () {
                    // If use Border
                    var hasBorder = self.properties.border();
                    var borderColor = self.properties.borderColor();
                    if (hasBorder) {
                        // Border color
                        self.$wrapper.css({
                            'border': "1px solid " + onecolor(borderColor).css()
                        });
                    } else {
                        self.$wrapper.css({
                            'border': ""
                        });
                    }
                }
            });
            // Background
            ko.computed({
                read: function () {
                    // If use background
                    var useBackground = self.properties.background();
                    var backgroundColor = self.properties.backgroundColor();
                    var backgroundAlpha = self.properties.backgroundAlpha();
                    var _bcolor = onecolor(backgroundColor);
                    _bcolor._alpha = backgroundAlpha;
                    var backgroundImageStr = self.properties.backgroundImageStr();
                    if (useBackground) {
                        // Background color
                        self.$wrapper.css({
                            'background-color': _bcolor.cssa(),
                        });
                        // No background image
                        switch (self.properties.backgroundImageType()) {
                            case "none":
                                self.$wrapper.css({
                                    'background-image': ''
                                });
                                break;
                            case 'gradient':
                                // Gradient background image
                                var stops = self.properties.backgroundGradientStops();
                                var angle = self.properties.backgroundGradientAngle();
                                var cssStr = 'linear-gradient(' + angle + 'deg, ' +
                                    _.map(stops, function (stop) {
                                        return onecolor(stop.color()).cssa() +
                                            ' ' +
                                            Math.round(stop.percent() * 100) + '%';
                                    }).join(", ") + ')';

                                self.$wrapper.css({
                                    'background-image': '-webkit-' + cssStr,
                                    'background-image': '-moz-' + cssStr,
                                    'background-image': cssStr
                                });
                                break;
                            case 'file':
                                self.$wrapper.css({
                                    'background': backgroundImageStr
                                });
                                break;
                        }
                    } else {
                        self.$wrapper.css({
                            'background': ''
                        })
                    }
                }
            });

            // Hover效果
            ko.computed({
                read: function () {
                    var _hover = self.properties.hover();
                    var _hoverComponent = self.properties.hoverComponent();

                    if (_hover) {
                        self.$wrapper.find(".e-hover-target").remove();
                        if (self.properties.boxClassStr().indexOf("e-hover-source") < 0) {
                            self.properties.boxClassStr(self.properties.boxClassStr() + " e-hover-source");
                        }
                        self.$wrapper.css({
                            'cursor': 'pointer'
                        });
                        self.$wrapper.append(hoverHtml);
                        $(document.body).append("<style>" + hoverCss + "</style>");
                        if (_hoverComponent) {
                            self.trigger("addHoverComponent", _hoverComponent, self.$wrapper.find(".e-hover-content"));
                        }
                    } else {
                        self.$wrapper.removeClass("e-hover-source");
                        self.$wrapper.find(".e-hover-target").remove();
                    }

                }
            });

            // Shadow
            ko.computed({
                read: function () {
                    var props = self.properties;
                    var shadowOffsetX = Math.round(props.shadowOffsetX()) + "px",
                        shadowOffsetY = Math.round(props.shadowOffsetY()) + "px",
                        shadowBlur = Math.round(props.shadowBlur()) + "px",
                        shadowColor = Math.round(props.shadowColor()),
                        shadowColorAlpha = props.shadowColorAlpha();
                    var _scolor = onecolor(shadowColor);
                    _scolor._alpha = shadowColorAlpha;

                    if (shadowBlur && props.hasShadow()) {
                        self.$wrapper.css({
                            'box-shadow': [shadowOffsetX, shadowOffsetY, shadowBlur, _scolor.cssa()].join(' ')
                        })
                    } else {
                        self.$wrapper.css({
                            'box-shadow': ''
                        })
                    }
                }
            });



            self.$wrapper.css({
                'position': "absolute"
            })

            this.properties.boxClassStr("cmp-element cmp-" + this.type.toLowerCase());

            this.onCreate(this.$wrapper);

            if (!this.properties.id()) {
                this.properties.id(genID(this.type))
            }


        },

        syncPositionManually: function () {
            var left = parseInt(this.$wrapper.css("left"));
            var top = parseInt(this.$wrapper.css("top"));
            this.properties.left(left);
            this.properties.top(top);
        },

        resize: function (width, height) {
            this.$wrapper.width(width);
            this.$wrapper.height(height);
            this.$wrapper.find("a").height(height);
        },

        rasterize: function () {},

        export: function () {
            var json = {
                eid: this.eid,
                type: this.type,
                properties: koMapping.toJS(this.properties),
                assets: {
                    // key is the image name
                    // value is the image base64 Url
                    images: {}
                }
            };

            this.onExport(json);

            return json;
        },
        isContainer: function () {
            return this.properties.id().indexOf("container") < 0 ? false : true;
        },
        isCache: function () {
            return this.type == "FUNC" && this.properties.funcType() == "CACHE";
        },
        exportCache: function () {
            var _cacheItem = "";
            var _cacheItemCall = "";
            if (this.properties.requestType() != "dwr") {
                _cacheItem = cacheItem.replace(/\_\_name\_\_/g, this.properties.requestName()).replace(/\_\_url\_\_/g, this.properties.requestUrl()).replace(/\_\_method\_\_/g, this.properties.requestType());
            } else {
                _cacheItem = dwrItem.replace(/\_\_name\_\_/g, this.properties.requestName()).replace(/\_\_url\_\_/g, this.properties.requestUrl());
            }

            _cacheItemCall = callCache.replace(/\_\_funcName\_\_/g, this.properties.requestName()).replace(/\_\_reqData\_\_/g, this.properties.requestParam()).replace(/\_\_cb\_\_/g, this.properties.onLoadFunc());
            return {
                'cacheItem': _cacheItem,
                'cacheItemCall': _cacheItemCall
            };
        },
        getLeft: function () {
            return this.properties.left();
        },
        getTop: function () {
            return this.properties.top();
        },
        getZ: function () {
            return this.properties.zIndex();
        },
        setLeft: function (left) {
            this.properties.left(left);
        },
        setTop: function (top) {
            this.properties.top(top);
        },
        setZ: function (z) {
            this.properties.zIndex(z);
        },
        setPosition: function (pos) {
            this.$wrapper.css({
                "position": pos
            })
        },
        getName: function () {
            var _id = this.properties.id();
            if (this.isContainer()) {
                return _id.substring(0, _id.indexOf("container") - 1);
            } else {
                return "example";
            }

        },
        getCss: function (_element, pclass, _css) {
            if (_element.children().length < 1) {
                return;
            }
            var that = this,
                _style = "",
                _className = pclass,
                _classStr = "";

            $.each(_element.children(), function (key, value) {
                _classStr = $(value).attr("class");
                if (_classStr) {
                    $(value).attr({
                        "class": that.removeCMPClass(_classStr)
                    });
                }
                _style = $(value).attr("style");
                if (_style) {
                    _className = pclass + "_" + $(value).prop("tagName").toLowerCase() + genExID();
                    _css.push("." + _className + "{" + _style + "}");
                    $(value).removeAttr("style");
                    $(value).addClass(_className);
                } else {
                    _className = $(value).attr("class");
                }

                that.getCss($(value), _className, _css);

            });

        },
        getHTMLCSS: function (_html, pclass) {
            var _ele = $("<div></div>").append(_html);
            var _css = [];
            this.getCss(_ele, pclass, _css);

            return {
                "html": _ele.html(),
                "css": _css.join("")
            }

        },
        removeCMPClass: function (_classStr) {
            _classStr = $.trim(_classStr);
            //去除cmp qpf
            _.each(_classStr.split(" "), function (item, key) {
                if (item.indexOf("cmp") >= 0 || item.indexOf("qpf") >= 0) {
                    _classStr = _classStr.replace(item, "");
                }
            });
            _classStr = _classStr.replace(/\s+/g, " ");
            return _classStr;
        },
        /**
         * _str:  "box-shadow: @args;"
         * 
         * @return 
         * -webkit-box-shadow: @args;
         * -moz-box-shadow: @args;
         * box-shadow: @args;
         */
        getCSS3String: function (_str) {
            if (!_str) return;
            var _key = _str.split(":")[0];
            if ("box-shadow_".indexOf(_key) >= 0) {
                _str = _str.split(":")[1];
                if (_str.indexOf(";") < 0) {
                    _str += ";";
                }
                return "-webkit-" + _key + ":" + _str + "-moz-" + _key + ":" + _str + "" + _key + ":" + _str + ""
            } else {
                return _str + ";";
            }

        },
        exportHTMLCSS: function () {
            //每个元素添加className
            this.$wrapper.find(".element-select-outline").remove();
            var _html = "",
                _type = this.type,
                _classStr = this.properties.boxClassStr(),
                _hoverStr = this.properties.hoverStr(),
                _animateStr = this.properties.animateStr(),
                _rid = this.properties.rid(),
                _idStr = "",
                _css = "";

            //动画样式
            if (_animateStr != "none") {
                _css += animationJson.common;
                _css += animationJson.list[_animateStr];
                _classStr = this.removeCMPClass(_classStr) + " animated " + _animateStr;
                
            } else {
                _classStr = this.removeCMPClass(_classStr);
            }

            if (_rid) {
                _idStr = " id='" + _rid + "'";
            }

            var _tempHtmlCss = {};

            if (!this.$wrapper.hasClass("e-hover-source") && !this.$wrapper.hasClass("cmp-func") && !this.$wrapper.find("a").attr("href")) {
                // 如果超链接没有内容而且不是hover，那么去掉超链接
                _tempHtmlCss = this.getHTMLCSS(this.$wrapper.find("a").html(), this.properties.id());
            } else {
                _tempHtmlCss = this.getHTMLCSS(this.$wrapper.html(), this.properties.id());

            }
            _html = "<div" + _idStr + " class='" + this.properties.id() + " " + _classStr + "'>" + _tempHtmlCss["html"] + "</div>";
            
            _css += _tempHtmlCss["css"];
            //自身的wraper样式
            if (this.isContainer()) {
                this.$wrapper.css({
                    position: "relative"
                });
            }
            _css += "." + this.properties.id() + " {" + this.$wrapper.attr("style") + "}";
            // hover样式
            if (_hoverStr) {
                _css += "." + this.properties.id() + ":hover {" + this.getCSS3String(_hoverStr) + "}"
            }

            if (this.$wrapper.hasClass("e-hover-source")) {
                _css += hoverCss;
            }

            _html = _html.replace(/data-cmp-eid\=\"(\d*)\"/g, "").replace(/\s+\'/g, "\'");
            return {
                "html": _html,
                "css": _css
            }
        },

        import: function (json) {
            koMapping.fromJS(json.properties, {}, this.properties);
            delete this.properties['__ko_mapping__'];
            // if (this.isContainer()) {
            //     this.$wrapper.css({
            //         position: "relative"
            //     });
            // } else {
            //     this.$wrapper.css({
            //         position: "absolute"
            //     });
            // }
            this.onImport(json);
        },

        makeAsset: function (type, name, data, root) {
            var globalName = this.eid + "#" + name;
            if (!root[type]) {
                root[type] = {};
            }
            root[type][globalName] = {
                data: data,
                type: type
            };
            return "url(" + type + "/" + globalName + ")";
        },

        build: function () {}
    });

    var id = {};

    function genID(type) {
        if (!id[type]) {
            id[type] = 0;
        }
        return type + "_" + id[type]++;
    }

    var eid = 1;

    function genEID() {
        return eid++;
    }

    var exportId = 1;

    function genExID() {
        return exportId++;
    }

    return Element;
})
;
define('core/factory',['require','./element','ko.mapping','_','$'],function(require) {

    var Element = require("./element");
    var koMapping = require("ko.mapping");
    var _ = require("_");
    var $ = require("$");

    var factory = {};

    var repository = {};

    var componentFactory = {

        register: function(name, config) {
            factory[name] = config;
        },

        create: function(name, properties) {

            var el = new Element();
            repository[el.eid] = el;

            var config = factory[name];

            el.initialize(config);

            if (properties) {
                koMapping.fromJS(properties, {}, el.properties);
                delete el.properties['__ko_mapping__'];
            }
            return el;
        },

        clone: function(element) {
            var type = element.type.toLowerCase();

            var properties = koMapping.toJS(element.properties);

            var origID = element.__original__ ? element.__original__.properties.id() : element.properties.id();
            properties.id = getClonedID(origID);

            properties.left += 10;
            properties.top += 10;

            var res = componentFactory.create(type, properties);
            // Save the original element of clone;
            res.__original__ = element.__original__ || element;
            return res;
        },

        getByEID: function(eid) {
            return repository[eid];
        },

        removeByEID: function(eid) {
            delete repository[eid];
        },

        remove: function(element) {
            delete repository[element.eid];
        }
    }

    var getClonedID = (function() {
        var clonedCount = {};

        return function(id) {
            if (!clonedCount[id]) {
                clonedCount[id] = 0;
            }
            var name = id + "_复制";
            if (clonedCount[id]) {
                name += clonedCount[id];
            }
            clonedCount[id]++;
            return name;
        }
    })()

    return componentFactory;
})
;
define('elements/func',['require','core/factory','knockout'],function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    factory.register("func", {
        type: "FUNC",
        extendProperties: function () {
            return {
                text: ko.observable("函数"),
                funcType: ko.observable("IF"),
                funcLanguage: ko.observable("FTL"),
                ifFuncItem: ko.observable(""),
                trueFuncBody: ko.observable(''),
                falseFuncBody: ko.observable(''),
                forFuncItem: ko.observable(''),
                forFuncBody: ko.observable(""),
                requestName: ko.observable(""),
                requestUrl: ko.observable(""),
                requestType: ko.observable("post"),
                requestParam: ko.observable("{}"),
                onLoadFunc: ko.observable(""),
                includeBody: ko.observable(""),
                // 用于position属性，慎重
                positionStr: ko.observable("absolute"),


            }
        },


        extendUIConfig: function () {
            var _that = this;
            return {
                positionStr: {
                    label: "position",
                    ui: "combobox",
                    class: "small",
                    field: 'layout',
                    items: [{
                        text: 'absolute',
                        value: "absolute"
                    }, {
                        text: 'fixed',
                        value: "fixed"
                    }, {
                        text: 'relative',
                        value: "relative"
                    }, {
                        text: 'static',
                        value: "static"
                    }],
                    value: this.properties.positionStr
                },
                funcType: {
                    label: "函数类型",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [{
                        text: 'IF函数',
                        value: "IF"
                    }, {
                        text: 'FOR函数',
                        value: "FOR"
                    }, {
                        text: 'Include函数',
                        value: "INCLUDE"
                    }, {
                        text: 'Cache函数',
                        value: "CACHE"
                    }, ],
                    value: this.properties.funcType
                },
                funcLanguage: {
                    label: "函数语言",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [{
                        text: 'FTL模板',
                        value: "FTL"
                    }, {
                        text: 'Regular模板',
                        value: "Regular"
                    }, {
                        text: 'JS函数',
                        value: "JS"
                    }],
                    value: this.properties.funcLanguage
                },
                includeBody: {
                    label: "包含组件",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.includeBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "INCLUDE";
                        }
                    })
                },
                ifFuncItem: {
                    label: "IfItem",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.ifFuncItem,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "IF";
                        }
                    })
                },
                trueFuncBody: {
                    label: "IfTrue",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.trueFuncBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "IF";
                        }
                    })
                },
                falseFuncBody: {
                    label: "IfFalse",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.falseFuncBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "IF";
                        }
                    })
                },
                forFuncItem: {
                    label: "ForItem",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.forFuncItem,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "FOR";
                        }
                    })
                },
                forFuncBody: {
                    label: "ForBody",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.forFuncBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "FOR";
                        }
                    })
                },
                requestName: {
                    label: "方法名称",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.requestName,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },
                requestUrl: {
                    label: "请求地址",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.requestUrl,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },

                requestType: {
                    label: "请求类型",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [{
                            text: 'POST',
                            value: "post"
                        }, {
                            text: 'GET',
                            value: "get"
                        }, {
                            text: 'DWR',
                            value: "dwr"
                        }

                    ],
                    value: this.properties.requestType,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },
                requestParam: {
                    label: "请求参数",
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.requestParam,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },
                onLoadFunc: {
                    label: "成功回掉",
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.onLoadFunc,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },

            }
        },


        onCreate: function ($wrapper) {
            var $text = $("<span></span>");
            var self = this;

            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append($text);
            } else {
                $wrapper.append($text);
            }

            function isCode(str) {
                return str.indexOf("<") >= 0 || str.indexOf(".") >= 0;
            }

            //function 函数
            ko.computed(function () {
                var funcType = self.properties.funcType();
                var funcLanguage = self.properties.funcLanguage();
                if (funcType == "CACHE") {
                    self.properties.funcLanguage("JS");
                }
                $text.html(funcType + "函数<br/>" + self.properties.funcLanguage() + "模板/语言");


                var _tempFTL = "",
                    _id = self.properties.id().substr(2);

                if (funcType == "IF") {
                    if (!self.properties.ifFuncItem()) {
                        return;
                    }
                    self.$wrapper.empty();
                    //插入id防止class重复
                    var _ifTrue = _id + "-t";
                    var _ifFalse = _id + "-f";

                    if (funcLanguage == "FTL") {
                        // 如果是if函数
                        _tempFTL = "<#if " + self.properties.ifFuncItem() + "??><div class='" + _ifTrue + "'></div><#else><div class='" + _ifFalse + "'></div>&lt;/#if>";
                    } else if (funcLanguage == "Regular") {
                        _tempFTL = "{#if " + self.properties.ifFuncItem() + "}<div class='" + _ifTrue + "'></div>{#else}<div class='" + _ifFalse + "'></div>{/if}";
                    }
                    self.$wrapper.append(_tempFTL);
                    var _true = self.properties.trueFuncBody();
                    var _false = self.properties.falseFuncBody();
                    if (_true) {
                        if (isCode(_true)) {
                            self.$wrapper.find("." + _ifTrue).append(_true);
                        } else {
                            self.trigger("addFuncComponent", _true, self.$wrapper.find("." + _ifTrue));
                        }
                    }
                    if (_false) {
                        if (isCode(_false)) {
                            self.$wrapper.find("." + _ifFalse).append(_false);
                        } else {
                            self.trigger("addFuncComponent", _false, self.$wrapper.find("." + _ifFalse));
                        }
                    }

                } else if (funcType == "FOR") {
                    if (!self.properties.forFuncItem()) {
                        return;
                    }
                    if (!self.properties.forFuncBody()) {
                        return;
                    }
                    self.$wrapper.empty();
                    //插入id防止class重复
                    var _forB = _id + "-f";
                    // 如果是for函数
                    if (funcLanguage == "FTL") {
                        _tempFTL = "<#list " + self.properties.forFuncItem() + " as item><div class='" + _forB + "'></div>&lt;/#list>";
                    } else if (funcLanguage == "Regular") {
                        _tempFTL = "{#list " + self.properties.forFuncItem() + " as item}<div class='" + _forB + "'></div>{/list}";
                    }
                    self.$wrapper.append(_tempFTL);

                    var _for = self.properties.forFuncBody();
                    if (_for) {
                        if (isCode(_for)) {
                            self.$wrapper.find("." + _forB).append(_for);
                        } else {
                            self.trigger("addFuncComponent", self.properties.forFuncBody(), self.$wrapper.find("." + _forB));
                        }
                    }

                } else if (funcType == "CACHE") {
                    self.$wrapper.empty();
                    $wrapper.append($text);
                } else if (funcType == "INCLUDE") {
                    self.$wrapper.empty();
                    var _include = self.properties.includeBody();
                    if (_include) {
                        //插入id防止class重复
                        var _forI = _id + "-i";
                        _tempFTL = "<div class='" + _forI + "'></div>";

                        self.$wrapper.append(_tempFTL);
                        if (isCode(_include)) {
                            if (_include.indexOf(".") >= 0 && funcLanguage == "FTL") {
                                self.$wrapper.find("." + _forI).append('<#include "' + _include + '"/>');
                            } else {
                                self.$wrapper.find("." + _forI).append(_include);
                            }

                        } else {
                            self.trigger("addFuncComponent", _include, self.$wrapper.find("." + _forI));
                        }

                    }
                } else {
                    self.$wrapper.empty();
                }


            });
            ko.computed({
                read: function () {
                    self.$wrapper.css({
                        'position': self.properties.positionStr()
                    })
                }
            });


        }

    });

});

define('elements/image',['require','core/factory','knockout','_'],function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    var _ = require("_");

    factory.register("image", {
        type: "IMAGE",
        extendProperties: function () {
            return {
                src: ko.observable(""),
                alt: ko.observable(""),
            }
        },
        extendUIConfig: function () {
            return {
                text: {
                    label: "图片地址",
                    ui: "textfield",
                    text: this.properties.src
                },
                alt: {
                    label: "alt内容",
                    ui: "textfield",
                    text: this.properties.alt
                }
            }
        },
        onCreate: function ($wrapper) {
            var img = document.createElement("img");
            var self = this;

            var updateImageSize = function (width, height) {
                img.width = width;
                img.height = height;
            };
            // Size of image;

            var width = self.properties.width(),
                height = self.properties.height();

            updateImageSize(width, height);
            img.alt = self.properties.alt();

            ko.computed(function () {
                img.onload = function () {
                    var width = img.width,
                        height = img.height;

                    if (!self.properties.width()) {
                        self.properties.width(width)
                    };
                    if (!self.properties.height()) {
                        self.properties.height(height)
                    };
                    updateImageSize(self.properties.width(), self.properties.height());
                    img.onload = null;
                }
                img.src = self.properties.src();
                var _size = self.uiConfig.size.items;

                updateImageSize(_size[0].value(), _size[1].value());

            });
            // Border radius
            ko.computed({
                read: function () {
                    var br = self.uiConfig.borderRadius.items;
                    var _alt = self.properties.alt();
                    $(img).css({
                        'border-radius': _.map(br, function (item) {
                            return item.value() + "px"
                        }).join(" ")
                    })
                    $(img).attr({
                        "alt": _alt
                    });
                }
            });
            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append(img);
            } else {
                $wrapper.append(img);
            }

        },

        onExport: function (json) {
            // json.properties.src = this.makeAsset("image", "src", json.properties.src, json.assets);

        }
    })
})
;
define('modules/common/buttongroup',['require','qpf','knockout','_'],function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var _ = require("_");


    var ButtonGroup = qpf.container.Inline.derive(function(){
        return {
            action : ko.observable("button"), // button | checkbox | radio
        }
    }, {
        type : "BUTTONGROUP",
        css : "button-group"
    });

    qpf.Base.provideBinding("buttongroup", ButtonGroup);

    return ButtonGroup;
});
define('modules/common/palette',['require','qpf','knockout'],function(require){
    
    var qpf = require("qpf");
    var ko = require("knockout");

    var palette = new qpf.widget.Palette();
    palette.width(370);
    var popup = new qpf.container.Window({
        left : ko.observable(300),
        top : ko.observable(100)
    });
    popup.$el.hide();
    popup.title("调色器");
    popup.id("Palette");
    popup.add(palette);

    document.body.appendChild(popup.$el[0]);
    popup.render();

    palette.show = function(){
        popup.$el.show();
    }

    palette.hide = function(){
        popup.$el.hide();
    }

    return palette;
});
define('modules/common/color',['require','qpf','knockout','onecolor','./palette'],function(require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Meta = qpf.meta.Meta;
    var onecolor = require("onecolor");

    var palette = require("./palette");

    var Color = Meta.derive(function() {
        var ret = {
            color: ko.observable(0xffffff),
            alpha: ko.observable(1)
        }
        ret._colorStr = ko.computed(function() {
            return onecolor(ret.color()).hex();
        })
        return ret;
    }, {

        type: 'COLOR',

        css: 'color',

        template: '<div data-bind="text:_colorStr" class="qpf-color-hex"></div>\
                    <div class="qpf-color-preview" data-bind="style:{backgroundColor:_colorStr()}"></div>\
                    <div data-bind="text:alpha" class="qpf-color-hex"></div>',

        initialize: function() {
            var self = this;

            this.$el.click(function() {
                self.showPalette();
            });
        },

        showPalette: function() {

            palette.show();

            palette.on("change", this._paletteChange, this);
            palette.on("cancel", this._paletteCancel, this);
            palette.on("apply", this._paletteApply, this);

            palette.set(this.color());
            palette.alpha(this.alpha());
        },

        _paletteChange: function(hex) {
            this.color(hex);
        },
        _paletteCancel: function() {
            palette.hide();
            palette.off("change");
            palette.off("apply");
            palette.off("cancel");
        },
        _paletteApply: function(hex, alpha) {
            this.color(hex);
            this.alpha(alpha);
            this._paletteCancel();
        }
    });

    Meta.provideBinding("color", Color);

    return Color;
});
// default list item component
define('modules/common/listitem',['require','qpf','knockout'],function(require){

    var qpf = require("qpf");
    var Meta = qpf.use("meta/meta");
    var ko = require("knockout");

    var ListItem = Meta.derive(function(){

        return {
            title : ko.observable(""),
            icon : ko.observable(""),
            href : ko.observable(""),
        }
    }, {
        type : "LISTITEM",
        
        css : "list-item",

        initialize : function(){
            this.$el.mousedown(function(e){
                e.preventDefault();
            })

            var self = this;
            this.$el.click(function(){
                var href = self.href();
                if(href && href.indexOf("#") == 0){
                    window.location.hash = href;
                }
            })
        },

        template : '<div class="icon" data-bind="css:icon"></div>\
                    <div class="title" data-bind="html:title"></div>'
    })

    return ListItem;
});
define('modules/common/list',['require','qpf','./listitem','knockout'],function(require){

    var qpf = require("qpf");
    var listItem = require("./listitem");
    var Container = qpf.use("container/container");
    var ko = require("knockout");

    var List = Container.derive(function(){

        return {
            
            dataSource : ko.observableArray([]),

            itemView : ko.observable(listItem), // item component constructor
            
            selected : ko.observableArray([]),

            multipleSelect : false,
            dragSort : false
        }
    }, {
        type : "LIST",
        
        css : "list",

        template : '<div data-bind="foreach:children" >\
                        <div class="qpf-container-item">\
                            <div data-bind="qpf_view:$data"></div>\
                        </div>\
                    </div>',

        eventsProvided : _.union(Container.prototype.eventsProvided, "select"),

        initialize : function(){

            var oldArray = _.clone( this.dataSource() ),
                self = this;
            
            this.dataSource.subscribe(function(newArray){
                this._update(oldArray, newArray);
                oldArray = _.clone( newArray );
                _.each(oldArray, function(item, idx){
                    if( ko.utils.unwrapObservable(item.selected) ){
                        this.selected(idx)
                    }
                }, this);
            }, this);

            this.selected.subscribe(function(idxList){
                this._unSelectAll();

                _.each(idxList, function(idx){
                    var child = this.children()[idx];
                    child &&
                        child.$el.addClass("selected");
                }, this)

                self.trigger("select", this._getSelectedData());
            }, this);

            this.$el.delegate(".qpf-container-item", "click", function(){
                var context = ko.contextFor(this);
                self.selected( [context.$index()] );
            })

            this._update([], oldArray);
        },

        _getSelectedData : function(){
            var dataSource = this.dataSource();
            var result = _.map(this.selected(), function(idx){
                return dataSource[idx];
            }, this);
            return result;
        },

        _update : function(oldArray, newArray){

            var children = this.children();
            var ItemView = this.itemView();
            var result = [];

            var differences = ko.utils.compareArrays(oldArray, newArray);
            var newChildren = [];
            _.each(differences, function(item){
                if( item.status === "retained"){
                    var index = oldArray.indexOf(item.value);
                    result[ index ] = children[ index ];
                }else if( item.status === "added"){
                    var newChild = new ItemView({
                        attributes : item.value
                    });
                    result[item.index] = newChild;
                    children.splice(item.index, 0, newChild);
                    newChildren.push(newChild);
                }
            }, this)
            this.children( result );
            // render after it is appended in the dom
            // so the component like range will be resized proply
            _.each(newChildren, function(c){
                c.render();
            })
        },

        _unSelectAll : function(){
            _.each(this.children(), function(child, idx){
                if(child){
                    child.$el.removeClass("selected")
                }
            }, this)
        }

    })

    Container.provideBinding("list", List);

    return List;
});
define('modules/common/contextmenu',['require','qpf','knockout','./list'],function(require){

    var qpf = require("qpf");
    var ko = require("knockout");

    var List = require('./list');

    var Item = qpf.meta.Meta.derive(function(){
        return {
            label : ko.observable(),
            exec : ko.observable(function(){})
        }
    }, {

        type : 'CONTEXTMENUITEM',

        css : 'context-menu-item',

        template : "<div data-bind='html:label'></div>",

        initialize : function(){
            var self = this;
            this.$el.click(function(){
                var exec = self.exec();
                exec && exec();
                contextMenu.hide();
            });
        }
    })

    var contextMenu = new List({
        attributes : {
            class : "qpf-context-menu",
            itemView : Item
        }
    });

    contextMenu.$el.attr("tabindex", 0);

    contextMenu.show = function(items, x, y){
        contextMenu.$el.show().offset({
            left : x + 5,
            top : y + 5
        });
        contextMenu.dataSource(items);

        contextMenu.$el.focus();
    }

    contextMenu.hide = function(){
        contextMenu.$el.hide();
    }

    contextMenu.bindTo = function(target, items){
        var showContextMenu = function(e){
            e.preventDefault();
            contextMenu.show(typeof(items) === "function" ? items(e.target) : items, e.pageX, e.pageY);
        }
        $(target).bind("contextmenu", showContextMenu);
    }


    contextMenu.$el.blur(function(){
        contextMenu.hide();
    });

    contextMenu.hide();

    document.body.appendChild(contextMenu.$el[0]);
    contextMenu.render();

    return contextMenu;
});
define('modules/common/gradient',['require','qpf','knockout','$','_','onecolor','./palette'],function(require){
    
    var qpf = require("qpf");
    var ko = require("knockout");
    var $ = require("$");
    var _ = require("_");
    var onecolor = require("onecolor");
    var palette = require("./palette")

    var Gradient = qpf.widget.Widget.derive(function(){
        // {
        //     percent : ko.observable(0.1),
        //     color : ko.observable(rgba(0, 0, 0, 1))
        // }
        return {
            stops : ko.observableArray([]),
            angle : ko.observable(180),

            _percentString : function(percent){
                return Math.floor(ko.utils.unwrapObservable(percent) * 100) + "%";
            }
        }
    }, {
        type : 'GRADIENT',
        
        css : 'gradient',

        template : '<div class="qpf-gradient-preview"></div>\
                    <div class="qpf-gradient-stops" data-bind="foreach:{data : stops, afterRender : _onAddStop.bind($data)}">\
                        <div class="qpf-gradient-stop" data-bind="style:{left:$parent._percentString(percent)}">\
                            <div class="qpf-gradient-stop-inner"></div>\
                        </div>\
                    </div>\
                    <div class="qpf-gradient-angle></div>',

        initialize : function(){
            var self = this;

            this.stops.subscribe(function(newValue){
                self._updateGradientPreview();
            });
        },

        afterRender : function(){
            this._$gradientPreview = this.$el.find(".qpf-gradient-preview");
            this._$stopsContainer = this.$el.find(".qpf-gradient-stops");
            this._updateGradientPreview();

            var self = this;
            var stops = this.stops();
            this.$el.find(".qpf-gradient-stop").each(function(idx){
                self._onAddStop(this, stops[idx]);
            });

            // this._$stopsContainer.on("click", function(){
            //     self.stops.push({
            //         percent : ko.observable(0.5),
            //         color : ko.observable('rgba(0, 0, 0, 1)')
            //     });
            // })
        },

        _updateGradientPreview : function(){
            var cssStr = 'linear-gradient(90deg, '+ 
                        _.map(this.stops(), function(stop){
                            return onecolor(ko.utils.unwrapObservable(stop.color)).cssa() 
                                    + ' ' 
                                    + Math.floor(ko.utils.unwrapObservable(stop.percent) * 100) + '%';
                        }).join(", ") + ')';

            this._$gradientPreview.css({
                'background-image' : '-webkit-' + cssStr,
                'background-image' : '-moz-' + cssStr,
                'background-image' : cssStr
            });
        },

        _onAddStop : function(element, stop){
            var self = this;
            
            var draggable = new qpf.helper.Draggable({
                axis : 'x',
                container : this.$el.find(".qpf-gradient-stops")
            });
            draggable.add(element);

            draggable.on("drag", function(e){
                this._dragHandler(element, stop);
            }, this);
            // Edit color
            $(element).on("dblclick", function(){
                self._editColor(stop);
            });
        },

        _dragHandler : function(element, stop){
            var $el = $(element);
            var percent = parseInt($el.css("left")) / this._$stopsContainer.width();
            
            if(ko.isObservable(stop.percent)){
                stop.percent(percent);
            }else{
                stop.percent = percent
            }
            this._updateGradientPreview();
        },
        _editColor : function(stop){
            palette.show();
            palette.on("change", this._paletteChange, {
                stop : stop,
                _updateGradientPreview : this._updateGradientPreview.bind(this)
            });
            palette.on("cancel", this._paletteCancel, this);
            palette.on("apply", this._paletteApply, this);

            var color = ko.utils.unwrapObservable(stop.color);
            palette.set(parseInt(onecolor(color).hex().substr(1), 16));
        },
        _paletteChange : function(hex){
            var color = onecolor(hex).cssa();
            if(ko.isObservable(this.stop.color)){
                this.stop.color(color);
            }else{
                this.stop.color = color;
            }
            this._updateGradientPreview();
        },
        _paletteCancel : function(){
            palette.hide();
            palette.off("change");
            palette.off("apply");
            palette.off("cancel");
        },
        _paletteApply : function(){
            this._paletteCancel();
        }
    });

    qpf.Base.provideBinding("gradient", Gradient);

    return Gradient;
})
;
// default list item component
define('modules/common/histogram',['require','qpf','emage','knockout'],function(require) {

    var qpf = require("qpf");
    var emage = require("emage");
    var ko = require("knockout");
    var qtek2d = emage.qtek["2d"];
    var Meta = qpf.use("meta/meta");

    var Histogram = Meta.derive(function() {

        return {

            image: null,

            _stage: new qtek2d.Renderer(),
            _scene: new qtek2d.Scene(),
            _paths: {
                red: new qtek2d.renderable.Path({
                    stroke: false,
                    style: new qtek2d.Style({
                        fill: "red",
                        globalAlpha: 0.4,
                        shadow: '0 -2 2 #333'
                    })
                }),
                green: new qtek2d.renderable.Path({
                    stroke: false,
                    style: new qtek2d.Style({
                        fill: "green",
                        globalAlpha: 0.4,
                        shadow: '0 -2 2 #333'
                    })
                }),
                blue: new qtek2d.renderable.Path({
                    stroke: false,
                    style: new qtek2d.Style({
                        fill: "blue",
                        globalAlpha: 0.4,
                        shadow: '0 -2 2 #333'
                    })
                }),

                redStroke: new qtek2d.renderable.Path({
                    fill: false,
                    style: new qtek2d.Style({
                        stroke: "#950000",
                        globalAlpha: 0.7
                    })
                }),
                greenStroke: new qtek2d.renderable.Path({
                    fill: false,
                    style: new qtek2d.Style({
                        stroke: "#009500",
                        globalAlpha: 0.7
                    })
                }),
                blueStroke: new qtek2d.renderable.Path({
                    fill: false,
                    style: new qtek2d.Style({
                        stroke: "#000095",
                        globalAlpha: 0.7
                    })
                })
            },

            size: 128,
            sample: ko.observable(2),

            _histogram: new emage.Histogram()
        }
    }, {
        type: "HISTOGRAM",

        css: "histogram",

        initialize: function() {

            this._scene.add(this._paths.red);
            this._scene.add(this._paths.green);
            this._scene.add(this._paths.blue);

            this._scene.add(this._paths.redStroke);
            this._scene.add(this._paths.greenStroke);
            this._scene.add(this._paths.blueStroke);

            this._histogram.downSample = 1 / 8;
        },

        template: '',

        update: function() {
            if (!this.image) {
                return;
            }
            this._histogram.image = this.image;
            this._histogram.update();
        },

        refresh: function() {
            if (!this.image) {
                return;
            }
            histogramArray = this.getNormalizedHistogram();

            this.updatePath('red', histogramArray.red);
            this.updatePath('green', histogramArray.green);
            this.updatePath('blue', histogramArray.blue);

            this._stage.render(this._scene);
        },

        initPath: function(field) {
            var path = this._paths[field],
                height = this.height(),
                sample = this.sample(),
                unit = this.$el.width() / 256 * sample;
            path.segments = [{
                point: [0, height]
            }];
            var offset = 0;
            for (var i = 0; i < 256; i += sample) {
                path.segments.push({
                    point: [offset, 0]
                })
                offset += unit;
            }
            path.pushPoints([
                [this.$el.width(), height],
                [0, height],
            ])

            this._paths[field + "Stroke"].segments = path.segments;
        },

        updatePath: function(field, array) {
            var path = this._paths[field],
                height = this.height(),
                sample = this.sample();
            for (var i = sample; i < 257; i += sample) {
                path.segments[i / sample].point[1] = (1 - array[i - 1]) * height
            }
            path.smooth(1);
        },

        getNormalizedHistogram: function() {

            function normalize(arr) {
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    result.push(arr[i] / 256);
                }
                return result;
            }

            var channels = this._histogram.channels;
            return {
                red: normalize(channels.red),
                green: normalize(channels.green),
                blue: normalize(channels.blue)
            }
        },

        afterRender: function() {
            this.$el[0].appendChild(this._stage.canvas);
        },

        onResize: function() {
            if (this._stage) {
                this._stage.resize(this.$el.width(), this.$el.height());
            }
            this.initPath('red');
            this.initPath('green');
            this.initPath('blue');
            this.refresh();
        }
    })

    Meta.provideBinding("histogram", Histogram);
    return Histogram;
});
define('modules/common/iconbutton',['require','qpf','knockout'],function(require){

    var qpf = require("qpf");
    var Button = qpf.use("meta/button");
    var Meta = qpf.use("meta/meta");
    var ko = require("knockout");

    var IconButton = Button.derive(function(){
        return {
            $el : $("<div></div>"),
            icon : ko.observable("")
        }
    }, {
        type : "ICONBUTTON",
        css : _.union("icon-button", Button.prototype.css),

        template : '<div class="qpf-icon" data-bind="css:icon"></div>',
    })

    Meta.provideBinding("iconbutton", IconButton);

    return IconButton;

});
define('modules/common/modal',['require','qpf','knockout'],function(require){

    var qpf = require("qpf");
    var Clazz = qpf.use("core/clazz");
    var Window = qpf.use("container/window");
    var Container = qpf.use("container/container");
    var Inline = qpf.use("container/inline");
    var Button = qpf.use("meta/button");
    var ko = require("knockout");

    var wind = new Window({
            attributes : {
                class : "qpf-modal"
            }
        }),
        body = new Container(),
        buttons = new Inline(),
        applyButton = new Button({
            attributes : {
                text : "确 定"
            }
        }),
        cancelButton = new Button({
            attributes : {
                text : "取 消"
            }
        });
    wind.add(body);
    wind.add(buttons);
    buttons.add(applyButton);
    buttons.add(cancelButton);

    wind.render();
    document.body.appendChild(wind.$el[0]);
    var $mask = $('<div class="qpf-mask"></div>');
    document.body.appendChild($mask[0]);

    wind.$el.hide();
    $mask.hide();
    var Modal = Clazz.derive(function(){
        return {
            title : "",

            body : null,
            onApply : function(next){next()},
            onCancel : function(next){next()}
        }
    }, {
        show : function(){
            var self = this;
            wind.title( this.title);
            
            body.removeAll();
            this.body &&
                body.add(this.body);

            applyButton.off("click");
            cancelButton.off("click");
            applyButton.on("click", function(){
                self.onApply( self.hide )
            });
            cancelButton.on("click", function(){
                self.onCancel( self.hide );
            });

            wind.$el.show();
            $mask.show();

            wind.left( ( $(window).width() - wind.$el.width() )/2 )
            wind.top( ( $(window).height() - wind.$el.height() )/2-100 )
        },
        hide : function(){
            wind.$el.hide();
            $mask.hide();
        }
    })

    Modal.popup = function(title, body, onApply, onCancel){
        var modal = new Modal({
            title : title,
            body : body,
            onApply : onApply || function(next){next()},
            onCancel : onCancel || function(next){next()}
        });
        modal.body.render();
        modal.show();
    }

    Modal.confirm = function(title, text, onApply, onCancel){
        var modal = new Modal({
            title : title,
            //TODO: Implement a componennt like <p> ?
            body : new Label({
                attributes : {
                    text : text
                },
                temporary : true
            }),
            onApply : onApply || function(next){next()},
            onCancel : onCancel || function(next){next()}
        });
        modal.body.render();
        modal.show();
    }

    return Modal;
});
// default list item component
define('modules/common/nativehtml',['require','qpf','knockout','_'],function(require){

    var qpf = require("qpf");
    var Meta = qpf.use("meta/meta");
    var ko = require("knockout");
    var XMLParser = qpf.use("core/xmlparser");
    var _ = require("_");

    var NativeHtml = Meta.derive(function(){

        return {
            $el : $('<div data-bind="html:html"></div>'),
            html : ko.observable("ko")
        }
    }, {
        type : "NATIVEHTML",
        
        css : "native-html"
    })

    Meta.provideBinding("nativehtml", NativeHtml);

    XMLParser.provideParser("nativehtml", function(xmlNode){
        var children = XMLParser.util.getChildren(xmlNode);
        var html = "";
        _.each(children, function(child){
            // CDATA
            if(child.nodeType === 4){
                html += child.textContent;
            }
        });
        if( html ){
            return {
                html : html
            }
        }
    })

    return NativeHtml;
});
// Application will have specificated layout
// And each part in the layout is called Region
// Region will manage how the modules under it is load and unload

define('modules/common/region',['require','qpf','knockout','_','../router'],function(require){
    
    var qpf = require("qpf");
    var Meta = qpf.use("meta/meta");
    var Base = qpf.use("base");
    var ko = require("knockout");
    var _ = require("_")

    var router = require("../router");

    var Region = Base.derive(function(){
        // Example of controller config
        //{
        //  "modules/moduleConfig/index" : {
        //      "url" : ""/methods/:page/:module:/config",
        //      "context" : ["page", "module"]
        //  }
        return {
            controller : {},

            _moduleCache : {},

            _currentModule : null
        }
    }, {

        type : "REGION",
        
        css : "region",

        initialize : function(){
            var self = this;
            _.each(this.controller, function(config, modulePath){
                var url = config.url,
                    context = config.context;
                if( url ==="*"){
                    self.enterModule(modulePath, {}, function(){});
                }else{
                    router.on("after", url, self.leaveModule.bind(self, modulePath) );
                    router.on( url, self.enterModule.bind(self, modulePath, context) ); 
                }
            })
            // router.on( "/", self._updateStatus.bind(self) );
        },

        _updateStatus : function(){
            var self = this;
            var next = Array.prototype.pop.call(arguments);
            // put it in next tick after the enter module event is executed;
            var cacheSize = 0;
            _.each(self._moduleCache, function(module){
                cacheSize++;
                if( module.__enable__ ){
                    module.enable( next );
                }else{
                    module.disable( next );
                }
            })
            if( ! cacheSize){
                next()
            }
        },

        leaveModule : function(modulePath){
            var module = this._moduleCache[modulePath];
            var next = Array.prototype.pop.call(arguments);
            
            if( module ){
                // mark as disable
                // real enable and disable will be executed
                // batchly in the _updateStatus
                // module.__enable__ = false;
                module.disable( next );
            }
        },

        enterModule : function(modulePath, contextFields){
            var context = {};
            var self = this;
            var next = Array.prototype.pop.call(arguments);

            var params = Array.prototype.slice.call(arguments, 2);

            if( contextFields ){
                _.each(params, function(param, idx){
                    var field = contextFields[idx];
                    if( field ){
                        context[field] = param;
                    }
                })  
            }
            var module = this._moduleCache[modulePath];

            if( ! module){
                require([modulePath], function(module){
                    if( module && module.start){
                        
                        var $el = module.start( );
                        if( $el ){
                            // Append after application resize finished
                            // In case the module is in cache and loaded immediately
                            // _.defer(function(){
                                self.$el.append( $el );
                            // })
                        }
                        if(module.mainComponent)
                        module.mainComponent.parent = self;
                        // module.__enable__ = true;
                        module.enable( next )
                        module.setContext(context);

                        self._moduleCache[modulePath] = module;
                        self._currentModule = module;
                        self.onResize();
                    }
                })
            }else{
                // module.__enable__ = true;
                module.enable( next )
                module.setContext(context);

                this._currentModule = module;
                this.onResize();
            }

            next();
        },

        onResize : function(){
            if( this._currentModule && this._currentModule.mainComponent){
                this._currentModule.mainComponent.width( this.$el.width() );
                this._currentModule.mainComponent.height( this.$el.height() );
            }
            Base.prototype.onResize.call(this);

        }
    })

    Meta.provideBinding("region", Region);

    return Region;
})
;
/**
 * Textfiled component
 *
 * @VMProp text
 * @VMProp placeholder
 *
 */
define('modules/common/textArea',['require','qpf','knockout','_'],function(require) {

    var qpf = require("qpf");
    var Meta = qpf.use("meta/meta");
    var ko = require("knockout");
    var _ = require("_");

    var TextField = Meta.derive(function() {
        return {
            tag: "div",

            text: ko.observable(""),

            placeholder: ko.observable("")
        };
    }, {

        type: "TEXTAREA",

        css: 'textarea',

        template: '<textarea rows="5" cols="20" data-bind="value:text"/>',

        onResize: function() {
            this.$el.find("textarea").width(this.width());
            Meta.prototype.onResize.call(this);
        }
    })

    Meta.provideBinding("textarea", TextField);

    return TextField;
});
define('modules/common/togglebutton',['require','qpf','knockout'],function(require){

    var qpf = require("qpf");
    var ko = require("knockout");

    var ToggleButton = qpf.meta.Button.derive(function(){
        return {
            actived : ko.observable(false)
        }
    }, {

        type : "TOGGLEBUTTON",

        css : ["button", "toggle-button"],

        initialize : function(){
            var self = this;
            ko.computed(function(){
                if(this.actived()){
                    self.$el.addClass("active");
                }else{
                    self.$el.removeClass("active");
                }
            });
        }
    });

    qpf.Base.provideBinding("togglebutton", ToggleButton);

    return ToggleButton;
});
define('modules/common/toggleiconbutton',['require','qpf','./iconbutton','knockout'],function(require){

    var qpf = require("qpf");
    var IconButton = require("./iconbutton");
    var ko = require("knockout");

    var ToggleIconButton = IconButton.derive(function(){
        return {
            actived : ko.observable(false)
        }
    }, {

        type : "TOGGLEICONBUTTON",

        css : ["button", "icon-button", "toggle-icon-button"],

        initialize : function(){
            var self = this;
            ko.computed(function(){
                if(this.actived()){
                    self.$el.addClass("active");
                }else{
                    self.$el.removeClass("active");
                }
            });
        }
    });

    qpf.Base.provideBinding("toggleiconbutton", ToggleIconButton);

    return ToggleIconButton;
});
define('text!modules/component/component.html',[],function () { return '<div data-bind="text:id"></div>';});

define('modules/component/component',['require','qpf','knockout','text!./component.html'],function(require) {

    var qpf = require("qpf");
    var ko = require("knockout");

    var Element = qpf.meta.Meta.derive(function() {
        return {
            id: ko.observable(""),
            target: ko.observable()
        }
    }, {

        type: 'ELEMENT',

        css: 'element',

        template: require("text!./component.html"),

    });

    return Element;
});
//=============================================
// Constructor of module
// module can be inited from xml,
// and it will only get the first component as a 
// container, 
//=============================================
define('modules/module',['require','qpf','knockout'],function(require) {

    var qpf = require("qpf");
    var Base = qpf.use("base");
    var ko = require("knockout");
    var XMLParser = qpf.use("core/xmlparser");
    var Derive = qpf.use("core/mixin/derive");
    var Event = qpf.use("core/mixin/event");

    var clazz = new Function();
    _.extend(clazz, Derive);
    _.extend(clazz.prototype, Event);

    var Module = clazz.derive(function() {
        return {
            name: "",
            $el: $("<div style='position:relative'></div>"),
            xml: "",
            context: {},

            mainComponent: null
        }
    }, {
        start: function() {
            if (this.xml) {
                this.applyXML(this.xml);
            };

            this.trigger("start");
            return this.$el;
        },

        enable: function(next) {
            this.$el.show();

            this.trigger("enable");

            next && next();
        },

        disable: function(next) {
            this.$el.hide();

            this.trigger("disable")
            next && next();
        },

        setContext: function(context) {
            // save default context
            if (!this._defaultContext) {
                this._defaultContext = {};
                _.each(this.context, function(value, name) {
                    this._defaultContext[name] = value();
                }, this)
            }
            for (var name in this.context) {
                if (typeof(context[name]) !== "undefined") {
                    this.context[name](context[name]);
                } else {
                    this.context[name](this._defaultContext[name]);
                }
            }
            Base.prototype._mappingAttributes.call(this.context, context, true);
        },

        dispose: function() {
            Base.disposeByDom(this.$el[0]);
            this.$el.remove();
        },

        loadingStart: function() {
            if (this._$mask) {
                this._$mask.addClass("loading").show();
            }
        },

        loadingEnd: function() {
            if (this._$mask) {
                this._$mask.removeClass("loading").hide();
            }
        },

        applyXML: function(xml) {
            XMLParser.parse(xml, this.$el[0]);
            ko.applyBindings(this, this.$el[0]);

            var firstChild = this.$el[0].firstChild;
            if (firstChild) {
                this.mainComponent = Base.getByDom(firstChild);
            }
        }
    })
    return Module;
});
define('text!modules/component/component.xml',[],function () { return '<container id="Component">\r\n    <list id="ElementsList" dataSource="@binding[componentsList]" itemView="@binding[ElementView]" onselect="@binding[_selectComponents]"></list>\r\n</container>';});

define('text!modules/property/property.xml',[],function () { return '<tab id="Property">\r\n    <panel title="布局">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[layoutProperties]"></list>\r\n    </panel>\r\n    <panel title="样式">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[styleProperties]"></list>\r\n    </panel>\r\n    <panel title="自定义">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[customProperties]"></list>\r\n    </panel>\r\n    <panel title="函数">\r\n        <list itemView="@binding[PropertyItemView]" dataSource="@binding[funcProperties]"></list>\r\n    </panel>\r\n</tab>';});

define('text!modules/property/property.html',[],function () { return '<div class="qpf-property-left" data-bind="if:label">\r\n    <div data-bind=\'qpf:{type:"label", text:label}\'></div>\r\n</div>\r\n<div class="qpf-property-right">\r\n    <div data-bind=\'qpf:config\'></div>\r\n</div>';});

define('modules/property/property',['require','qpf','knockout','text!./property.html'],function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var Widget = qpf.widget.Widget;

    var PropertyView = Widget.derive(function(){
        return {
            label : ko.observable(""),
            config : ko.observable()
        }
    }, {
        type : 'PROPERTY',

        css : 'property',

        template : require("text!./property.html")
    })

    return PropertyView;
});
define('modules/property/index',['require','qpf','knockout','../module','text!./property.xml','_','./property'],function(require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./property.xml");
    var _ = require("_");

    var PropertyItemView = require("./property");

    var property = new Module({
        name: "property",
        xml: xml,

        layoutProperties: ko.observableArray([]),

        styleProperties: ko.observableArray([]),

        customProperties: ko.observableArray([]),

        funcProperties: ko.observableArray([]),

        showProperties: function(properties) {
            var layoutProperties = [];
            var styleProperties = [];
            var customProperties = [];
            var funcProperties = [];

            _.each(properties, function(property) {
                if (property.ui) {
                    property.type = property.ui;
                    var config = _.omit(property, 'label', 'ui', 'field', 'visible');
                    var item = {
                        label: property.label,
                        config: ko.observable(config)
                    }
                    if (property.visible) {
                        item.visible = property.visible;
                    }
                    switch (property.field) {
                        case "layout":
                            layoutProperties.push(item);
                            break;
                        case "style":
                            styleProperties.push(item);
                            break;
                        case "func":
                            funcProperties.push(item);
                            break;
                        default:
                            customProperties.push(item);

                    }
                }
            })

            this.layoutProperties(layoutProperties);
            this.styleProperties(styleProperties);
            this.customProperties(customProperties);
            this.funcProperties(funcProperties);
        },

        PropertyItemView: PropertyItemView
    });

    return property;
});
define('modules/component/index',['require','qpf','knockout','core/factory','core/command','../module','text!./component.xml','_','../property/index','modules/common/contextmenu','./component'],function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./component.xml");
    var _ = require("_");

    var propertyModule = require("../property/index");
    var contextMenu = require("modules/common/contextmenu");

    var ElementView = require("./component");

    var idStr = "";
    var component = new Module({
        name: "component",
        xml: xml,
        // Elements data source 
        // {
        //     id : ko.observable(),
        //     target : Element
        // }
        componentsList: ko.observableArray([]),

        // List of selected elements, support multiple select
        selectedComponents: ko.observableArray([]),

        ElementView: ElementView,

        _selectComponents: function (data) {
            //选中时修改selectedComponents值
            component.selectedComponents(_.map(data, function (item) {
                return item.target;
            }));
            var selectedComponents = component.selectedComponents();
            var subComponent = selectedComponents[selectedComponents.length - 1];
            //加载子组件
            if (subComponent) {
                component.trigger("selectComponent", subComponent);
            }
        },



        load: function (compList) {
            var _componentList = component.componentsList();
            //将compList添加到现有的组件列表上
            _.map(compList, function (element) {
                // 判断是否已经加载该组件，没加载则push，否则更新
                var _i = _.find(idStr.split("_"), function (item) {
                    return item == element.meta.name;
                });
                if (!_i) {
                    _componentList.push({
                        id: element.meta.name,
                        target: element
                    });
                    idStr += element.meta.name + "_";
                } else {
                    _.map(_componentList, function (item) {
                        if (item.id == element.meta.name) {
                            item.target = element;
                        }
                    })
                }

            });
            this.componentsList(_componentList)
        },
        getTarget: function (_componentId) {
            var _componentList = component.componentsList(),
                _comp = {};
            _.each(_componentList, function (element, key) {
                if (element.id == _componentId) {
                    _comp = element.target;
                    return;
                }
            });
            return _comp;
        }
    });


    component.components = ko.computed({
        read: function () {
            return _.map(component.componentsList(), function (item) {
                return item.target;
            });
        },
        deferEvaluation: true
    });


    component.on("start", function () {
        component.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function (e) {
            component.trigger("focus", $(this).qpf("get")[0].target());
        });

        contextMenu.bindTo(component.mainComponent.$el, function (target) {
            var $uiEl = $(target).parents(".qpf-ui-element");
            if ($uiEl.length) {
                return [{
                    label: "插入",
                    exec: function () {

                    }
                }, {
                    label: "编辑",
                    exec: function () {

                    }
                }]
            } else {
                return [{
                    label: "新建组件",
                    exec: function () {

                    }
                }, {
                    label: "导入组件",
                    exec: function () {

                    }
                }]
            }
        });
    });


    return component;
})
;
define('text!modules/hierarchy/element.html',[],function () { return '<div data-bind="text:id"></div>';});

define('modules/hierarchy/element',['require','qpf','knockout','text!./element.html'],function(require){

    var qpf = require("qpf");
    var ko = require("knockout");

    var Element = qpf.meta.Meta.derive(function(){
        return {
            id : ko.observable(""),
            target : ko.observable()
        }
    }, {

        type : 'ELEMENT',

        css : 'element',

        template : require("text!./element.html"),
        
    });

    return Element;
});
define('text!modules/hierarchy/hierarchy.xml',[],function () { return '<container id="Hierarchy">\r\n    <list id="ElementsList" dataSource="@binding[elementsList]" itemView="@binding[ElementView]" onselect="@binding[_selectElements]"></list>\r\n</container>';});

define('modules/hierarchy/index',['require','qpf','knockout','core/factory','core/command','../module','text!./hierarchy.xml','_','../property/index','modules/common/contextmenu','./element'],function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./hierarchy.xml");
    var _ = require("_");

    var propertyModule = require("../property/index");
    var contextMenu = require("modules/common/contextmenu");

    var ElementView = require("./element");

    var hierarchy = new Module({
        name: "hierarchy",
        xml: xml,

        // Elements data source 
        // {
        //     id : ko.observable(),
        //     target : Element
        // }
        elementsList: ko.observableArray([]),

        // List of selected elements, support multiple select
        selectedElements: ko.observableArray([]),

        ElementView: ElementView,

        _selectElements: function (data) {
            // selectedElements赋值
            hierarchy.selectedElements(_.map(data, function (item) {
                return item.target;
            }));
        },

        selectElementsByEID: function (eidList) {
            var elements = [];
            _.each(eidList, function (eid) {
                var el = componentFactory.getByEID(eid);
                if (el) {
                    elements.push(el);
                }
            });
            hierarchy.selectedElements(elements);
        },

        load: function (elementsList) {
            this.removeAll();
            this.elementsList(_.map(elementsList, function (element) {
                return {
                    id: element.properties.id,
                    target: element
                }
            }));
            _.each(elementsList, function (element) {
                hierarchy.trigger("create", element);
            })
        },
        removeAll: function () {

            _.each(this.elementsList(), function (element) {
                command.execute("remove", element.target);
            })
        }
    });



    hierarchy.elements = ko.computed({
        read: function () {
            return _.map(hierarchy.elementsList(), function (item) {
                return item.target;
            });
        },
        deferEvaluation: true
    });

    hierarchy.on("start", function () {
        hierarchy.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function (e) {
            hierarchy.trigger("focus", $(this).qpf("get")[0].target());
        });

        contextMenu.bindTo(hierarchy.mainComponent.$el, function (target) {
            var $uiEl = $(target).parents(".qpf-ui-element");
            if ($uiEl.length) {
                return [{
                    label: "删除",
                    exec: function () {
                        command.execute("remove", $uiEl.qpf("get")[0].target());
                    }
                }, {
                    label: "复制",
                    exec: function () {
                        command.execute("copy", $uiEl.qpf("get")[0].target());
                    }
                }]
            } else {
                return [{
                    label: "粘贴",
                    exec: function () {
                        var els = command.execute("paste");
                    }
                }]
            }
        });
    });

    ko.computed(function () {
        var selectedElements = hierarchy.selectedElements();
        var element = selectedElements[selectedElements.length - 1];
        if (element) {
            propertyModule.showProperties(element.uiConfig);
        }
        hierarchy.trigger("select", selectedElements);
    });

    // Register commands
    command.register("create", {
        execute: function (name, properties) {
            var element = componentFactory.create(name, properties);

            hierarchy.elementsList.push({
                id: element.properties.id,
                target: element
            });

            // Dispatch create event, in viewport/index.js
            hierarchy.trigger("create", element);

            hierarchy.selectedElements([element]);
        },
        unexecute: function (name, properties) {

        }
    });

    command.register("remove", {
        execute: function (element) {
            if (typeof (element) === "string") {
                element = componentFactory.getByEID(element);
            }
            componentFactory.remove(element);

            hierarchy.elementsList(_.filter(hierarchy.elementsList(), function (data) {
                return data.target !== element;
            }));
            hierarchy.selectedElements.remove(element);
            propertyModule.showProperties([]);

            hierarchy.trigger("remove", element);
        },
        unexecute: function () {

        }
    });

    command.register("removeselected", {
        execute: function () {

        },
        unexecute: function () {

        }
    })


    var clipboard = [];
    command.register("copy", {
        execute: function (element) {
            if (typeof (element) === "string") {
                element = componentFactory.getByEID(element);
            }
            clipboard = [element];
        }
    });

    command.register("copyselected", {
        execute: function () {

        }
    })

    command.register("paste", {
        execute: function () {
            var res = [];
            _.each(clipboard, function (item) {
                var el = componentFactory.clone(item);
                hierarchy.elementsList.push({
                    target: el,
                    id: el.properties.id
                });
                hierarchy.trigger("create", el);

                res.push(el);
            });
            hierarchy.selectedElements(res);

            return res;
        },
        unexecute: function () {

        }
    });


    return hierarchy;
})
;
define('text!modules/page/element.html',[],function () { return '<div data-bind="text:id"></div>';});

define('modules/page/element',['require','qpf','knockout','text!./element.html'],function(require) {

    var qpf = require("qpf");
    var ko = require("knockout");

    var Element = qpf.meta.Meta.derive(function() {
        return {
            id: ko.observable(""),
            target: ko.observable()
        }
    }, {

        type: 'ELEMENT',

        css: 'element',

        template: require("text!./element.html"),

    });

    return Element;
});
define('text!modules/page/page.xml',[],function () { return '<container id="Page">\r\n    <list id="PagesList" dataSource="@binding[pagesList]" itemView="@binding[ElementView]" onselect="@binding[_selectPages]"></list>\r\n</container>';});

define('modules/page/index',['require','qpf','knockout','core/factory','core/command','../module','text!./page.xml','_','../property/index','modules/common/contextmenu','./element'],function(require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./page.xml");
    var _ = require("_");

    var propertyModule = require("../property/index");
    var contextMenu = require("modules/common/contextmenu");

    var ElementView = require("./element");

    var idStr = "";
    var component = new Module({
        name: "component",
        xml: xml,
        // Elements data source 
        // {
        //     id : ko.observable(),
        //     target : Element
        // }
        pagesList: ko.observableArray([]),

        // List of selected elements, support multiple select
        selectedPages: ko.observableArray([]),

        ElementView: ElementView,

        _selectPages: function(data) {
            //选中时修改selectedPages值
            component.selectedPages(_.map(data, function(item) {
                return item.target;
            }));
            var _selectedPages = component.selectedPages();
            var subComponent = _selectedPages[_selectedPages.length - 1];
            //加载子组件
            if (subComponent) {
                component.trigger("selectPage", subComponent);
            }
        },

        load: function(compList) {
            var _componentList = component.componentsList();
            //将compList添加到现有的组件列表上
            _.map(compList, function(element) {
                if (idStr.indexOf(element.meta.name) < 0) {
                    _componentList.push({
                        id: element.meta.name,
                        target: element
                    });
                    idStr += element.meta.name + "_";
                } else {
                    _.map(_componentList, function(item) {
                        if (item.id == element.meta.name) {
                            item.target = element;
                        }
                    })
                }

            });
            this.componentsList(_componentList)
        },
        getTarget: function(_componentId) {
            var _componentList = component.componentsList(),
                _comp = {};
            _.each(_componentList, function(element, key) {
                if (element.id == _componentId) {
                    _comp = element.target;
                    return;
                }
            });
            return _comp;
        }
    });


    component.components = ko.computed({
        read: function() {
            return _.map(component.componentsList(), function(item) {
                return item.target;
            });
        },
        deferEvaluation: true
    });


    component.on("start", function() {
        component.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function(e) {
            component.trigger("focus", $(this).qpf("get")[0].target());
        });

        contextMenu.bindTo(component.mainComponent.$el, function(target) {
            var $uiEl = $(target).parents(".qpf-ui-element");
            if ($uiEl.length) {
                return [{
                    label: "编辑",
                    exec: function() {
                    }
                }, {
                    label: "删除",
                    exec: function() {
                    }
                }]
            } else {
                return [{
                    label: "加载远程组件",
                    exec: function() {
                    }
                }, {
                    label: "刷新",
                    exec: function() {
                    }
                }]
            }
        });
    });


    return component;
})
;
define('text!modules/toolbar/toolbar.xml',[],function () { return '<inline id="Toolbar">\r\n    <toolbargroup>\r\n        <button text="eHtml" onclick="@binding[exportHTML]"></button>\r\n        <button text="eRUI" onclick="@binding[exportRUI]"></button>\r\n        <button text="eFTL" onclick="@binding[exportFTL]"></button>\r\n        <!--<button text="eMac" onclick="@binding[exportMac]"></button>-->\r\n        <button text="align" onclick="@binding[alignProcess]"></button>\r\n        <button text="newM" onclick="@binding[newModule]"></button>\r\n        <button text="newU" onclick="@binding[newUnit]"></button>\r\n        <button text="newC" onclick="@binding[newCache]"></button>\r\n        <button text="export" onclick="@binding[exportProject]"></button>\r\n        <iconbutton icon="save" title="saveProject" onclick="@binding[saveProject]"></iconbutton>\r\n        <iconbutton icon="load" title="importProject" onclick="@binding[importProject]"></iconbutton>\r\n    </toolbargroup>\r\n    <meta class="divider"></meta>\r\n    <toolbargroup>\r\n        <iconbutton icon="element" onclick="@binding[createElement]"></iconbutton>\r\n        <iconbutton icon="image" onclick="@binding[createImage]"></iconbutton>\r\n        <iconbutton icon="text" onclick="@binding[createText]"></iconbutton>\r\n        <iconbutton icon="function" onclick="@binding[createFunction]"></iconbutton>\r\n    </toolbargroup>\r\n    <meta class="divider"></meta>\r\n    <toolbargroup>\r\n        <iconbutton icon="zoom-in" onclick="@binding[zoomIn]"></iconbutton>\r\n        <iconbutton icon="zoom-out" onclick="@binding[zoomOut]"></iconbutton>\r\n        <label text="@binding[viewportScale]" class="viewport-scale"></label>\r\n    </toolbargroup>\r\n    <meta class="divider"></meta>\r\n    <toolbargroup class="viewport-size">\r\n        <spinner value="@binding[viewportWidth]" min="0" width="100"></spinner>\r\n        <spinner value="@binding[viewportHeight]" min="0" width="100"></spinner>\r\n    </toolbargroup>\r\n</inline>\r\n';});

define('text!template/module/m-example.cmp',[],function () { return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "m-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 600\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "m-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n';});

define('text!template/unit/u-example.cmp',[],function () { return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "u-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 600\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "u-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n';});

define('text!template/cache/c-example.cmp',[],function () { return '[\n  {\n    "meta": {\n      "date": "2016-12-24",\n      "name": "c-example"\n    },\n    "viewport": {\n      "width": 1440,\n      "height": 600\n    },\n    "elements": [\n      {\n        "eid": 1,\n        "type": "ELEMENT",\n        "properties": {\n          "id": "c-example-container",\n          "width": 400,\n          "height": 100,\n          "left": 0,\n          "top": 0,\n          "zIndex": 0,\n          "color": "#ffffff",\n          "border": true,\n          "borderColor": 5617961,\n          "background": false,\n          "backgroundColor": 16777215,\n          "backgroundImageType": "none",\n          "backgroundGradientStops": [\n            {\n              "percent": 0,\n              "color": "rgba(255, 255, 255, 1)"\n            },\n            {\n              "percent": 1,\n              "color": "rgba(0, 0, 0, 1)"\n            }\n          ],\n          "backgroundGradientAngle": 180,\n          "borderTopLeftRadius": 0,\n          "borderTopRightRadius": 0,\n          "borderBottomRightRadius": 0,\n          "borderBottomLeftRadius": 0,\n          "hasShadow": false,\n          "shadowOffsetX": 0,\n          "shadowOffsetY": 0,\n          "shadowBlur": 10,\n          "shadowColor": 0,\n          "newBlank": false,\n          "targetUrl": "",\n          "classStr": "cmp-element cmp-element",\n          "include": "",\n          "overflowX": false,\n          "overflowY": false,\n          "hover": false,\n          "hoverComponent": ""\n        }\n      }\n    ],\n    "assets": {}\n  }\n]\n';});

define('modules/viewport/viewport',['require','qpf','knockout','core/command','modules/common/contextmenu'],function(require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Meta = qpf.use("meta/meta");

    var command = require("core/command");
    var contextMenu = require("modules/common/contextmenu");

    var Viewport = Meta.derive(function() {
        return {
            scale: ko.observable(1.0)
        }
    }, {
        type: 'VIEWPORT',
        css: "viewport",

        template: '<div class="qpf-viewport-elements-container"></div>\
                    <div class="qpf-viewport-ruler-h"></div>\
                    <div class="qpf-viewport-ruler-v"></div>',

        initialize: function() {
            this.scale.subscribe(this._scale, this);
            this._scale(this.scale());

            contextMenu.bindTo(this.$el, function(target) {
                var $cmpEl = $(target).parents('.cmp-element');
                if ($cmpEl.length) {
                    var items = [{
                        label: "删除",
                        exec: function() {
                            command.execute("remove", $cmpEl.attr("data-cmp-eid"));
                        }
                    }, {
                        label: "复制",
                        exec: function() {
                            command.execute("copy", $cmpEl.attr("data-cmp-eid"));
                        }
                    }];
                } else {
                    var items = [];
                }
                items.push({
                    label: "粘贴",
                    exec: function() {
                        var els = command.execute("paste");
                    }
                });
                return items;
            });
        },

        afterRender: function() {
            this._$elementsContainer = this.$el.find(".qpf-viewport-elements-container");
        },

        addElement: function(el, parent) {
            if (parent) {
                parent.append(el.$wrapper);
            } else {
                if (this._$elementsContainer) {
                    this._$elementsContainer.append(el.$wrapper);
                }
            }
        },
        clearAll: function() {
            this.$el.find(".qpf-viewport-elements-container").empty();
        },

        removeElement: function(el) {
            el.$wrapper.remove();
        },

        _scale: function(val) {
            this.$el.css({
                "-webkit-transform": "scale(" + val + "," + val + ")",
                "-moz-transform": "scale(" + val + "," + val + ")",
                "-o-transform": "scale(" + val + "," + val + ")",
                "transform": "scale(" + val + "," + val + ")"
            });
        }
    })

    Meta.provideBinding("viewport", Viewport);

    return Viewport;
})
;
define('text!modules/viewport/viewport.xml',[],function () { return '<container id="Viewport">\r\n    <viewport id="ViewportMain" width="@binding[viewportWidth]" height="@binding[viewportHeight]" scale="@binding[viewportScale]"></viewport>\r\n</container>';});

define('modules/viewport/index',['require','qpf','knockout','../module','./viewport','text!./viewport.xml','_','core/command','core/factory','modules/hierarchy/index','modules/component/index'],function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var Viewport = require("./viewport");
    var xml = require("text!./viewport.xml");
    var _ = require("_");
    var command = require("core/command");
    var factory = require("core/factory");
    var hierarchy = require("modules/hierarchy/index");
    var component = require("modules/component/index");

    var viewport = new Module({
        name: "viewport",
        xml: xml,

        viewportWidth: ko.observable(1440),
        viewportHeight: ko.observable(600),

        viewportScale: ko.observable(1.0)
    });

    // Control points of each direction
    var resizeControls = {
        // Top left
        $tl: $('<div class="resize-control tl"></div>'),
        // Top center
        $tc: $('<div class="resize-control tc"></div>'),
        // Top right
        $tr: $('<div class="resize-control tr"></div>'),
        // Left center
        $lc: $('<div class="resize-control lc"></div>'),
        // Right center
        $rc: $('<div class="resize-control rc"></div>'),
        // Bottom left
        $bl: $('<div class="resize-control bl"></div>'),
        // Bottom center
        $bc: $('<div class="resize-control bc"></div>'),
        // Bottom right
        $br: $('<div class="resize-control br"></div>')
    };

    var $outline = $('<div class="element-select-outline"></div>');
    $outline.append(resizeControls.$tl);
    $outline.append(resizeControls.$tc);
    $outline.append(resizeControls.$tr);
    $outline.append(resizeControls.$lc);
    $outline.append(resizeControls.$rc);
    $outline.append(resizeControls.$bl);
    $outline.append(resizeControls.$bc);
    $outline.append(resizeControls.$br);

    var _viewport;

    viewport.on("start", function () {
        _viewport = viewport.mainComponent.$el.find("#ViewportMain").qpf("get")[0];
        //控制选中某个元素
        viewport.$el.delegate('.cmp-element', "click", selectElement);

        initDragUpload();
    });

    function selectElement(e) {
        var eid = $(this).attr("data-cmp-eid");
        if (eid) {
            hierarchy.selectElementsByEID([eid]);
        }
    }
    viewport.getViewPort = function () {
        return _viewport;
    }

    hierarchy.on("create", function (element) {
        _viewport.addElement(element);
    });

    hierarchy.on("remove", function (element) {
        _viewport.removeElement(element)
    });

    hierarchy.on("select", function (elements) {
        var lastElement = elements[elements.length - 1];
        if (!lastElement) {
            return;
        }
        lastElement.$wrapper.append($outline);

        draggable.clear();
        _.each(elements, function (element) {
            draggable.add(element.$wrapper);
        });

        selectedElements = elements;
    });

    hierarchy.on("focus", function (element) {

        $('#Viewport').animate({
            scrollTop: element.$wrapper.position().top - 50 + 'px',
            scrollLeft: element.$wrapper.position().left - 50 + 'px'
        }, 'fast')
    });


    var selectedElements = [];

    var draggable = new qpf.helper.Draggable();
    // Update the position property manually
    draggable.on("drag", function () {
        _.each(selectedElements, function (element) {
            element.syncPositionManually();
        })
    })

    // Drag upload
    var imageReader = new FileReader();

    function initDragUpload() {
        viewport.mainComponent.$el[0].addEventListener("dragover", function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        viewport.mainComponent.$el[0].addEventListener("drop", function (e) {
            e.stopPropagation();
            e.preventDefault();

            var file = e.dataTransfer.files[0];
            if (file && file.type.match(/image/)) {

                imageReader.onload = function (e) {
                    imageReader.onload = null;
                    command.execute("create", "image", {
                        src: e.target.result
                    })
                }
                imageReader.readAsDataURL(file);
            }
        });
    }

    return viewport;
})
;
define('project/project',['require','_','core/factory','modules/viewport/index','modules/hierarchy/index','modules/component/index'],function (require) {

    var _ = require("_");
    var factory = require("core/factory");

    var viewportModule = require("modules/viewport/index");
    var hierarchyModule = require("modules/hierarchy/index");
    var componentModule = require("modules/component/index");


    function find(assets, path) {
        var pathArr = path.split("/");
        var result = _.reduce(pathArr, function (memo, key) {
            if (memo) {
                return memo[key];
            }
        }, assets);

        return result && result.data;
    }

    return {
        import: function (json) {
            //添加组件
            if (json instanceof Array) {
                componentModule.load(json);
            } else {
                componentModule.load([json]);
            }

            var _that = this;
            componentModule.on("selectComponent", function (subComponent) {
                _that.loadComponent(subComponent);
            });
        },
        loadComponent: function (json) {
            function importAsset(parent) {
                _.each(parent, function (item, key) {
                    if (typeof (item) === "string") {
                        var result = /url\((\S*?)\)/.exec(item);
                        if (result) {
                            var path = result[1];
                            var data = find(json.assets, path);
                            if (data) {
                                parent[key] = data;
                            }
                        }
                    } else if (item instanceof Array || item instanceof Object) {
                        importAsset(item);
                    }
                })
            }

            var elements = [];
            _.each(json.elements, function (item) {
                importAsset(item.properties);
                var element = factory.create(item.type.toLowerCase(), {
                    "id": item.properties.id
                });

                function hoverHandler(_componentName, _parentElement) {
                    var _elments = [];
                    _.each(componentModule.components(), function (item, key) {
                        if (item["meta"]["name"] == _componentName) {
                            _elments = item["elements"];
                            var elements = [];
                            _.each(_elments, function (item) {
                                var element = factory.create(item.type.toLowerCase(), {
                                    "id": item.properties.id
                                });
                                if (item.properties.funcType == "IF" || item.properties.funcType == "FOR" || item.properties.funcType == "INCLUDE") {
                                    element.on("addFuncComponent", addFuncComponentHandler);

                                }
                                element.import(item);
                                elements.push(element);
                            });

                            var _container;
                            _.each(elements, function (item1, key1) {
                                //判断是不是container
                                if (item1.isContainer()) {
                                    item1.$wrapper.css({
                                        position: "relative"
                                    });
                                    item1.$wrapper.find("a").remove();
                                    _container = item1.$wrapper;
                                    viewportModule.getViewPort().addElement(item1, _parentElement);
                                    _parentElement.parent().css({
                                        //加上左右padding值15
                                        "margin-left": -Math.floor(+item1.properties.width() / 2 + 15)
                                    });
                                    _parentElement.parent().find(".e-hover-arrow").css({
                                        "left": Math.floor(+item1.properties.width() / 2 + 15) - 10
                                    });
                                }

                            });
                            _.each(elements, function (item1, key1) {
                                //判断是不是container
                                if (!item1.isContainer()) {
                                    viewportModule.getViewPort().addElement(item1, _container);
                                }

                            });
                            return false;
                        }
                    });
                }

                if (item.properties.hoverComponent) {
                    element.on("addHoverComponent", hoverHandler);
                }

                function addFuncComponentHandler(_componentName, _parentElement) {
                    var _elments = [],
                        _componentName = _componentName,
                        _parentElement = _parentElement;
                    _.each(componentModule.components(), function (item, key) {
                        if (item["meta"]["name"] == _componentName) {
                            _elments = item["elements"];
                            var elements = [];
                            _.each(_elments, function (item) {
                                var element = factory.create(item.type.toLowerCase(), {
                                    "id": item.properties.id
                                });
                                if (item.properties.funcType == "IF" || item.properties.funcType == "FOR" || item.properties.funcType == "INCLUDE") {
                                    element.on("addFuncComponent", addFuncComponentHandler);

                                }
                                if (item.properties.hoverComponent) {
                                    element.on("addHoverComponent", hoverHandler);
                                }

                                element.import(item);
                                elements.push(element);
                            });

                            var _container;
                            _.each(elements, function (item1, key1) {
                                //判断是不是container
                                if (item1.isContainer()) {
                                    item1.$wrapper.css({
                                        position: "relative"
                                    });

                                    if (!item1.$wrapper.find("a").attr("href")) {
                                        if (item1.$wrapper.find("a").children().length < 1) {
                                            item1.$wrapper.find("a").remove();
                                        } else {
                                            item1.$wrapper.html(item1.$wrapper.find("a").html());
                                        }
                                        _container = item1.$wrapper;
                                    } else {
                                        _container = item1.$wrapper.find("a");
                                    }

                                    viewportModule.getViewPort().addElement(item1, _parentElement);
                                    return false;
                                }

                            });
                            _.each(elements, function (item1, key1) {
                                //判断是不是container
                                if (!item1.isContainer()) {
                                    if (item1.$wrapper.find("a").children().length < 1) {
                                        item1.$wrapper.find("a").remove();
                                    }
                                    //不能直接去掉，因为hover也用的a，所以要判断
                                    if (!item1.$wrapper.find("a").attr("href") && !item1.properties.hoverComponent()) {
                                        item1.$wrapper.html(item1.$wrapper.find("a").html());
                                    }

                                    viewportModule.getViewPort().addElement(item1, _container);

                                }

                            });
                            return false;
                        }
                    })
                };
                element.on("addFuncComponent", addFuncComponentHandler);

                element.import(item);
                elements.push(element);
            });

            hierarchyModule.load(elements);
            viewportModule.viewportWidth(json.viewport.width);
            viewportModule.viewportHeight(json.viewport.height);
        },
        export: function (isSave) {
            var d = new Date();
            //以id包含container字符串的元素id前缀命名
            var _name = "example";
            _.each(hierarchyModule.elements(), function (element) {
                if (element.isContainer()) {
                    _name = element.getName();
                    return;
                }
            });
            var result = {
                meta: {
                    date: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
                    name: _name
                },
                viewport: {
                    width: viewportModule.viewportWidth(),
                    height: viewportModule.viewportHeight()
                },
                elements: [],
                assets: {}
            };

            function searchAndAddsubModule(json) {
                if (json.properties.trueFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.trueFuncBody);
                    if (Object.keys(_json).length) {
                        _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });

                    }
                }
                if (json.properties.falseFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.falseFuncBody);
                    if (Object.keys(_json).length) {
                        _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.forFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.forFuncBody);
                    if (Object.keys(_json).length) {
                        _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.includeBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.includeBody);
                    if (Object.keys(_json).length) {
                        _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.hoverComponent && !isSave) {
                    _json = componentModule.getTarget(json.properties.hoverComponent);
                    if (Object.keys(_json).length) {
                        _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }

            }
            //存储所有的组件，包含子组件
            var _resultList = [];
            _.each(hierarchyModule.elements(), function (element) {
                var json = element.export(),
                    _json = "";


                searchAndAddsubModule(json);
                result.elements.push(_.omit(json, 'assets'));

                _.each(json.assets, function (field, type) {
                    _.each(field, function (item, name) {
                        if (!result.assets[type]) {
                            result.assets[type] = {};
                        }
                        result.assets[type][name] = item;
                    });
                });
            });

            _resultList.push(result);
            return {
                "result": _resultList,
                "name": _name
            }
        },

        exportHTMLCSS: function () {
            var _container = "<div class='m-body-container'></div>";
            var _css = [],
                _name = "example",
                _temp = {},
                _cache = "",
                _cacheCall = "";
            _.each(hierarchyModule.elements(), function (element) {
                if (element.isContainer()) {
                    _temp = element.exportHTMLCSS();
                    _container = _temp["html"];
                    _css.push(_temp["css"]);
                    _name = element.getName();
                    return false;
                }
            });
            _container = $(_container);
            var _containerA;
            if (_container.find("a").length) {
                _containerA = _container.find("a");
            }
            _.each(hierarchyModule.elements(), function (element) {
                if (element.isCache()) {
                    _temp = element.exportCache();
                    _cache += _temp['cacheItem'];
                    _cacheCall += _temp['cacheItemCall'];
                } else if (!element.isContainer()) {
                    _temp = element.exportHTMLCSS();
                    if (_containerA) {
                        _containerA.append(_temp["html"]);
                    } else {
                        _container.append(_temp["html"]);
                    }

                    _css.push(_temp["css"]);
                }
            });
            return {
                "html": $("<div></div>").append(_container).html().replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">"),
                "css": _css.join(" "),
                "name": _name,
                "cache": _cache,
                "cacheCall": _cacheCall
            }
        },
        exportMacro: function () {
            var _container = "<div class='m-body-container'></div>";
            var _css = [],
                _name = "example";
            _.each(hierarchyModule.elements(), function (element) {
                if (element.isContainer()) {
                    _container = element.exportHTMLCSS()["html"];
                    _css.push(element.exportHTMLCSS()["css"]);
                    _name = element.getName();
                    return;
                }
            });
            _container = $(_container);
            _.each(hierarchyModule.elements(), function (element) {
                if (!element.isContainer()) {
                    _container.append(element.exportHTMLCSS()["html"]);
                    _css.push(element.exportHTMLCSS()["css"]);
                }
            });
            //ftl的macro中变量不能用- 改用_
            var _html = $("<div></div>").append(_container).html().replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">").replace(/\$\{/g, "${" + _name.replace(/\-/g, "_") + ".");
            return {
                "html": "<#macro " + _name.replace(/\-/g, "_") + " " + _name.replace(/\-/g, "_") + ">" + _html + "</#macro>",
                "css": _css.join(" "),
                "name": _name
            }
        },
        alignProcess: function () {
            var _top = 0,
                _left = 0,
                _z = 0;
            _.each(hierarchyModule.elements(), function (element) {
                if (element.isContainer()) {
                    // element.setPosition("relative");
                    _top = element.getTop();
                    _left = element.getLeft();
                    _z = element.getZ();
                    element.setTop(0);
                    element.setLeft(0);
                    return;
                }
            });
            _.each(hierarchyModule.elements(), function (element) {
                if (!element.isContainer()) {
                    element.setTop(element.getTop() - _top);
                    element.setLeft(element.getLeft() - _left);
                    element.setZ(element.getZ() + _z + 1);
                }
            });
        }
    }
})
;
define('modules/toolbar/toolbargroup',['require','qpf','knockout','_'],function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var _ = require("_");


    var ToolbarGroup = qpf.container.Inline.derive(function(){
        return {}
    }, {
        type : "TOOLBARGROUP",
        css : "toolbar-group"
    });

    qpf.container.Container.provideBinding("toolbargroup", ToolbarGroup);

    return ToolbarGroup;
});
define('text!template/rui/component.js',[],function () { return '/**\r\n * __componentNameCap__ 组件实现文件\r\n *\r\n * @module   __componentNameCap__\r\n */\r\nNEJ.define([\r\n    \'text!./component.html\',\r\n    \'text!./component.css\',\r\n    \'pool/component-base/src/base\',\r\n    \'pool/component-base/src/util\',\r\n    \'base/element\',\r\n    \'base/event\'\r\n    __cacheJS__\r\n], function(\r\n    html,\r\n    css,\r\n    Component,\r\n    util,\r\n    e,\r\n    v\r\n    __cacheName__\r\n) {\r\n\r\n    /**\r\n     * __componentNameCap__ 组件\r\n     *\r\n     * @class   module:__componentNameCap__\r\n     * @extends module:pool/component-base/src/base.Component\r\n     *\r\n     * @param {Object} options      - 组件构造参数\r\n     * @param {Object} options.data - 与视图关联的数据模型\r\n     */\r\n    var __componentNameCap__ = Component.$extends({\r\n        name: \'__componentName__\',\r\n        css: css,\r\n        template: html,\r\n        /**\r\n         * 模板编译前用来初始化参数\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#config\r\n         * @returns {void}\r\n         */\r\n        config: function() {\r\n            // FIXME 设置组件配置信息的默认值\r\n            util.extend(this, {\r\n\r\n            });\r\n            // FIXME 设置组件视图模型的默认值\r\n            util.extend(this.data, {\r\n\r\n            });\r\n\r\n            this.supr();\r\n            // TODO\r\n        },\r\n\r\n        /**\r\n         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#init\r\n         * @returns {void}\r\n         */\r\n        init: function() {\r\n            // TODO\r\n            this.supr();\r\n\r\n            __cacheCall__\r\n\r\n        },\r\n\r\n        /**\r\n         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己\r\n         *\r\n         * @protected\r\n         * @method  module:__componentNameCap__#destroy\r\n         * @returns {void}\r\n         */\r\n        destroy: function() {\r\n            // TODO\r\n            this.supr();\r\n        }\r\n    });\r\n\r\n    return __componentNameCap__;\r\n});\r\n';});

define('text!template/cache/cache.js',[],function () { return '/**\r\n * ----------------------------------------------------------\r\n * __cache__接口\r\n * \r\n * @module   __cache__\r\n * ----------------------------------------------------------\r\n */\r\ndefine([\r\n    \'pro/common/cache\',\r\n    \'pro/common/cache/cache\',\r\n    \'base/util\'\r\n], function(_cache, _dwr, _util, _p) {\r\n    __content__\r\n});\r\n';});

define('elements/text',['require','core/factory','knockout','onecolor'],function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    var onecolor = require("onecolor");

    factory.register("text", {
        type: "TEXT",
        extendProperties: function () {
            return {
                text: ko.observable("请输入文字"),
                fontFamily: ko.observable("微软雅黑,Microsoft YaHei"),
                fontSize: ko.observable(16),
                color: ko.observable("#111111"),
                horzontalAlign: ko.observable('center'),
                verticleAlign: ko.observable('middle'),
                lineHeight: ko.observable(0),
                classStr: ko.observable(""),
            }
        },
        extendUIConfig: function () {
            return {
                text: {
                    label: "文本",
                    ui: "textfield",
                    text: this.properties.text
                },

                fontFamily: {
                    label: "字体",
                    ui: "combobox",
                    class: "small",
                    items: [{
                        text: '宋体',
                        value: "宋体,SimSun"
                    }, {
                        text: '微软雅黑',
                        value: "微软雅黑,Microsoft YaHei"
                    }, {
                        text: '楷体',
                        value: "楷体,楷体_GB2312, SimKai"
                    }, {
                        text: '黑体',
                        value: "黑体,SimHei"
                    }, {
                        text: '隶书',
                        value: "隶书,SimLi"
                    }, {
                        text: 'Andale Mono',
                        value: 'andale mono'
                    }, {
                        text: 'Arial',
                        value: 'arial,helvetica,sans-serif'
                    }, {
                        text: 'Arial Black',
                        value: 'arial black,avant garde'
                    }, {
                        text: 'Comic Sans Ms',
                        value: 'comic sans ms'
                    }, {
                        text: 'Impact',
                        value: 'impact,chicago'
                    }, {
                        text: 'Times New Roman',
                        value: 'times new roman'
                    }, {
                        text: '无',
                        value: ''
                    }],
                    value: this.properties.fontFamily
                },

                fontSize: {
                    label: "大小",
                    ui: "spinner",
                    value: this.properties.fontSize
                },

                classStr: {
                    label: "class",
                    ui: "textfield",
                    text: this.properties.classStr
                },
                color: {
                    label: "颜色",
                    ui: "textfield",
                    text: this.properties.color
                },

                horzontalAlign: {
                    label: "水平对齐",
                    ui: "combobox",
                    class: "small",
                    items: [{
                        value: 'left',
                        text: "左对齐"
                    }, {
                        value: 'center',
                        text: "居中"
                    }, {
                        value: 'right',
                        text: "右对齐"
                    }],
                    value: this.properties.horzontalAlign
                },

                verticleAlign: {
                    label: "垂直对齐",
                    ui: "combobox",
                    class: "small",
                    items: [{
                        value: 'top',
                        text: "顶部对齐"
                    }, {
                        value: 'middle',
                        text: "居中"
                    }, {
                        value: 'bottom',
                        text: "底部对齐"
                    }],
                    value: this.properties.verticleAlign
                },

                lineHeight: {
                    label: "行高",
                    ui: "spinner",
                    min: 0,
                    value: this.properties.lineHeight
                }
            }
        },

        onCreate: function ($wrapper) {
            var $text = $("<span style='line-height:normal;display:inline-block;width:100%;'></span>");
            var self = this;

            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append($text);
            } else {
                $wrapper.append($text);
            }

            //将父元素font-size重置为0，这样就不会有空格影响展示
            self.properties.boxFontSize(0);

            //Font family
            ko.computed(function () {
                var fontFamily = self.properties.fontFamily();
                var classStr = self.properties.classStr();
                $text.css({
                    'font-family': fontFamily
                })

                $text.attr({
                    'class': classStr
                });
            });

            //Font size and text color
            ko.computed(function () {
                var text = self.properties.text();
                var fontSize = self.properties.fontSize() + "px";

                // var color = onecolor(self.properties.color()).css();
                var color = self.properties.color();
                $text.html(text)
                    .css({
                        "font-size": fontSize,
                        "color": color
                    })
            });

            //Text align
            ko.computed(function () {
                var verticleAlign = self.properties.verticleAlign();
                var horzontalAlign = self.properties.horzontalAlign();

                $text.css({
                    'text-align': horzontalAlign,
                    'vertical-align': verticleAlign
                })
            });

            //Line height
            ko.computed(function () {
                var lineHeight = self.properties.lineHeight();
                if (lineHeight) {
                    $text.css({
                        'line-height': lineHeight + 'px'
                    })
                    $wrapper.css({
                        'line-height': lineHeight + 'px'
                    })
                }
            });


        }
    });
});

define('modules/toolbar/index',['require','qpf','knockout','../module','text!./toolbar.xml','text!template/module/m-example.cmp','text!template/unit/u-example.cmp','text!template/cache/c-example.cmp','core/command','$','project/project','../hierarchy/index','modules/component/index','../viewport/index','./toolbargroup','text!template/rui/component.js','text!template/cache/cache.js','elements/image','elements/text','elements/func'],function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./toolbar.xml");
    var moduleExample = require("text!template/module/m-example.cmp");
    var unitExample = require("text!template/unit/u-example.cmp");
    var cacheExample = require("text!template/cache/c-example.cmp");
    var command = require("core/command");
    var $ = require("$");

    var project = require("project/project");

    var hierarchyModule = require("../hierarchy/index");
    var componentModule = require("modules/component/index");
    var viewportModule = require("../viewport/index");

    require("./toolbargroup");

    var toolbar = new Module({
        name: "toolbar",
        xml: xml,

        createElement: function () {
            command.execute("create");
        },
        createImage: function () {
            // var $imageInput = $("<input type='file' />");
            // $imageInput[0].addEventListener("change", uploadImageFile);
            // $imageInput.click();
            command.execute("create", "image", {
                src: "http://www.haomou.net/images/read.png"
            })
        },
        createText: function () {
            command.execute("create", "text");
        },
        createFunction: function () {
            command.execute("create", "func");
        },

        zoomIn: function () {
            var scale = viewportModule.viewportScale();
            viewportModule.viewportScale(Math.min(Math.max(scale + 0.1, 0.2), 1.5));
        },

        zoomOut: function () {
            var scale = viewportModule.viewportScale();
            viewportModule.viewportScale(Math.min(Math.max(scale - 0.1, 0.2), 1.5));
        },

        viewportScale: ko.computed(function () {
            return Math.floor(viewportModule.viewportScale() * 100) + "%";
        }),

        viewportWidth: viewportModule.viewportWidth,
        viewportHeight: viewportModule.viewportHeight,

        exportProject: function () {
            var result = project.export(false);
            var blob = new Blob([JSON.stringify(result["result"], null, 2)], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, result["name"] + ".cmp");
        },
        saveProject: function () {
            var result = project.export(true);
            hierarchyModule.removeAll();
            if (result["result"][0].elements.length > 0) {
                project.import(result["result"]);
            }

        },
        importProject: function () {
            var $projectInput = $("<input type='file' />");
            $projectInput[0].addEventListener("change", uploadProjectFile);
            $projectInput.click();
        },
        newModule: function () {
            hierarchyModule.removeAll();
            project.loadComponent(JSON.parse(moduleExample)[0]);
        },
        newUnit: function () {
            hierarchyModule.removeAll();
            project.loadComponent(JSON.parse(unitExample)[0]);
        },
        newCache: function () {
            hierarchyModule.removeAll();
            project.loadComponent(JSON.parse(cacheExample)[0]);
        },
        exportFTL: function () {
            //只适合制作绝对定位的FTL组件
            var result = project.exportHTMLCSS();
            var blob = new Blob([result["html"]], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, result["name"] + ".ftl");
            var blob = new Blob([result["css"]], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "_" + result["name"] + ".scss");
        },
        exportRUI: function () {

            var ruiExample = require("text!template/rui/component.js");
            // cache模板
            var cacheExample = require("text!template/cache/cache.js");
            //只适合制作绝对定位的FTL组件
            var result = project.exportHTMLCSS();
            var _html = result["html"];
            _html = _html.replace(/\$\{/g, "{")
            var blob = new Blob([_html], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "component.html");
            var blob = new Blob([result["css"]], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "component.css");
            var _name = result["name"];
            ruiExample = ruiExample.replace(/\_\_componentName\_\_/g, _name);
            // 处理类名不能包含-, 规范是M代表module，U代表unit，C代表cache
            _name = _name.replace(/m\-/g, "M").replace(/u\-/g, "U").replace(/c\-/g, "C");
            ruiExample = ruiExample.replace(/\_\_componentNameCap\_\_/g, _name)


            var _cache = result["cache"];
            var _cacheCall = result["cacheCall"];
            if (_cache) {
                cacheExample = cacheExample.replace(/\_\_cache\_\_/g, _name).replace(/\_\_content\_\_/g, _cache);
                var blob = new Blob([cacheExample], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, "cache.js");

            }
            if (_cacheCall) {
                _cacheCall = _cacheCall.replace(/\_\_cacheName\_\_/g, _name);
                ruiExample = ruiExample.replace(/\_\_cacheJS\_\_/g, ",'./cache.js'").replace(/\_\_cacheName\_\_/g, "," + _name + "Cache").replace(/\_\_cacheCall\_\_/g, _cacheCall);
            } else {
                ruiExample = ruiExample.replace(/\_\_cacheJS\_\_/g, '').replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, "");
            }

            var blob = new Blob([ruiExample], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "component.js");

        },
        exportHTML: function () {
            //只适合制作绝对定位的FTL组件
            var result = project.exportHTMLCSS();
            var blob = new Blob([result["html"]], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, result["name"] + ".html");
            var blob = new Blob([result["css"]], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, result["name"] + ".css");
        },
        exportMac: function () {
            //只适合制作绝对定位的FTL组件
            var result = project.exportMacro();
            var blob = new Blob([result["html"]], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, result["name"] + ".ftl");
            var blob = new Blob([result["css"]], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "_" + result["name"] + ".scss");
        },

        alignProcess: function () {
            //将页面元素对其到左上角，同时将container样式修改成相对定位
            project.alignProcess();
        }
    });

    componentModule.on("importProject", function () {
        toolbar.importProject();
    });
    componentModule.on("newProject", function () {
        toolbar.newProject();
    });

    var fileReader = new FileReader();

    function uploadImageFile(e) {
        var file = e.target.files[0];
        if (file && file.type.match(/image/)) {
            fileReader.onload = function (e) {
                fileReader.onload = null;
                command.execute("create", "image", {
                    src: e.target.result
                })

            }
            fileReader.readAsDataURL(file);
        }
    }

    function uploadProjectFile(e) {
        var file = e.target.files[0];

        if (file && file.name.substr(-3) === 'cmp') {
            fileReader.onload = function (e) {
                fileReader.onload = null;

                var elements = project.import(JSON.parse(e.target.result));

            }
            fileReader.readAsText(file);
        }
    }

    require("elements/image");
    require("elements/text");
    require("elements/func");

    return toolbar;
})
;
;