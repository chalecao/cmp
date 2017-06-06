define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./toolbar.xml");
    var moduleExample = require("text!template/module/m-example.cmp");
    var unitExample = require("text!template/unit/u-example.cmp");
    var cacheExample = require("text!template/cache/c-example.cmp");
    var pageExample = require("text!template/page/p-example.cmp");
    var htmlExample = require("text!template/html/html.html");
    var pageHtml = require("text!template/page/page.html");
    var moduleHtml = require("text!template/page/module.html");
    var pageJS = require("text!template/page/page.js");
    var moduleJS = require("text!template/page/module.js");
    var command = require("core/command");
    var service = require("core/service");
    var regKey = require("util/regKey");
    var exportFile = require("util/exportFile");
    var $ = require("$");

    var project = require("project/project");

    var hierarchyModule = require("../hierarchy/index");
    var componentModule = require("modules/component/index");
    var pageModule = require("modules/page/index");
    var viewportModule = require("../viewport/index");
    var codeModule = require("../codeEditor/index");
    var cmdModule = require("../shellCmd/index");
    var dataModule = require("../dataMock/index");
    var templateModule = require("../template/index");
    var poolModule = require("../pool/index");

    var Modal = require("modules/common/modal");
    var TextField = qpf.use("meta/textfield");
    var Vbox = qpf.use("container/vbox");
    var Container = qpf.use("container/container");
    var Inline = qpf.use("container/inline");
    var Label = qpf.use("meta/label");
    require("./toolbargroup");
    var _ = require("_");

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
                src: "style/images/read.png"
            })
        },
        createText: function () {
            command.execute("create", "text");
        },
        createSelect: function () {
            command.execute("create", "select");
        },
        createFunction: function () {
            command.execute("create", "func");
        },
        createTimeline: function () {
            command.execute("create", "timeline");
        },
        showCmd: function () {
            cmdModule.addCode(false, "/");
        },
        createModule: function () {
            var selectedElements = hierarchyModule.selectedElements();
            var element = selectedElements[selectedElements.length - 1];
            var _pid = "umi-root";
            if (element) {
                _pid = element.properties.id();
            }
            command.execute("create", "umi", {
                parentModule: _pid
            });
        },

        showUMICodeEditor: function (moduleJS, moduleHTML, _cb) {
            var _arr = [];
            var _that = this;
            if (moduleJS) {
                _arr.push({
                    titleStr: "module.js",
                    classStr: "moduleJS",
                    codeStr: moduleJS
                });
            }
            if (moduleHTML) {
                _arr.push({
                    titleStr: "module.html",
                    classStr: "moduleHTML",
                    codeStr: moduleHTML
                });
            }
            codeModule.showCode(_arr, function (_codeArr) {
                //更新代码
                if (_cb) {
                    _cb(_codeArr);
                }
            });
        },
        showCodeEditor: function (_tpls, _meta) {
            var _arr = [];
            var _that = this;
            $.each(_tpls, function (k, v) {
                if (v.name && _meta[v.name].length) {
                    _arr.push({
                        titleStr: v.name,
                        classStr: v.name,
                        codeStr: _meta[v.name]
                    });
                }
            });

            codeModule.showCode(_arr, function (_codeArr) {
                //更新代码
                _smeta = componentModule.selectedComponents()[0].meta;
                _.each(_codeArr, function (it) {
                    if (it.codeStr.length) {
                        _smeta[it.classStr] = it.codeStr;
                    }
                });
                _that.saveProject();
            });
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
            var _selectC = componentModule.selectedComponents()[0];
            var result = project.export(false, _selectC);
            var blob = new Blob([JSON.stringify(result["result"], null, 2)], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, result["name"] + ".cmp");
        },
        saveProject: _.throttle(function (_cb) {
            console.log("saveProject after throttle");
            var _selectC = componentModule.selectedComponents()[0];
            var result = project.export(true, _selectC);
            if (result["result"][0].elements.length > 0) {
                project.import(result["result"]);
            }
            _cb && _cb();
            Modal.confirm("提示", "保存成功！", null, null, 1000);
        }, 500),
        saveElement: function (_cb) {
            var selectedElements = hierarchyModule.selectedElements();
            var element = selectedElements[selectedElements.length - 1];
            if (element) {
                var result = project.exportElement(element);
                if (result["result"][0].elements.length > 0) {
                    project.import(result["result"]);
                    _cb();
                }
            }
        },
        importProject: function () {
            var $projectInput = $("<input type='file' />");
            $projectInput[0].addEventListener("change", uploadProjectFile);
            $projectInput.click();
        },
        expandProp: function () {
            if (+$(".propContent").css("width").replace("px", "")) {
                $(".propContent").css("width", 0);
            } else {
                $(".propContent").css("width", 280);
            }
        },
        newPage: function () {
            hierarchyModule.removeAll();
            project.loadComponent(JSON.parse(pageExample)[0]);
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
        changeBack: function () {
            var back = viewportModule.backColor();
            if (back == "#eee") {
                viewportModule.backColor("#9a9a9a");
            } else {
                viewportModule.backColor("#eee");
            }
        },
        /**
         * 用于生成ftl页面内容（如果页面包含UMI，则生成FTL页面，否则只需要生成ftl片段让其他ftl页面include即可）
         * result: 页面导出的元素
         *  _pageFilePath： 页面js路径，比如 'pro/web/pages/home/index', pro 后面的部分
         * _pageCSSPath： 页面css路径，比如“/src/css/web/page/home.css”, css 后面部分
         */
        generatePageHtml: function (result, _pageFilePath, _pageCSSPath) {
            var _umi = result["umi"];
            var _pPath = _pageFilePath || "";
            var _name = result["name"].replace(/p\-/g, "P");
            return pageHtml.replace("__404Path__", _umi["404"]).replace("__module__", JSON.stringify(_umi["modules"])).replace("__html__", result["html"]).replace(/\_\_pageFilePath\_\_/g, _pPath.split("/")[0] + "/pages/" + _pPath.split("/")[1] + "/" + _name).replace(/\_\_pageCSSPath\_\_/g, (_pageCSSPath || "") + result["name"]);
        },
        exportFTL: function () {
            //只适合制作绝对定位的FTL组件
            var result = project.exportHTMLCSS();
            if (result["umi"]) {
                var blob = new Blob([this.generatePageHtml(result)], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, result["name"] + ".ftl");
            } else {
                var blob = new Blob([result["html"]], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, result["name"] + ".ftl");
            }
            var blob = new Blob([result["css"]], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "_" + result["name"] + ".scss");
        },
        exportRUI: function () {
            //废弃
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

            var _selectC = componentModule.selectedComponents()[0];
            if (_selectC && _selectC.meta.componentJS) {
                var _cache = result["cache"];
                if (_cache && _selectC.cacheJS) {
                    var blob = new Blob([_selectC.meta.cacheJS], {
                        type: "text/plain;charset=utf-8"
                    });
                    saveAs(blob, "cache.js");

                }
                var blob = new Blob([_selectC.meta.componentJS], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, "component.js");
            } else {
                var _name = result["name"];
                //componentName需要用小写，因为如果使用<componentName></componentName>这种方式，在设计中填入组件会自动插入到节点，只能用小写
                ruiExample = ruiExample.replace(/\_\_componentName\_\_/g, _name.toLowerCase());
                // 处理类名不能包含-, 规范是M代表module，U代表unit，C代表cache
                _name = _name.replace(/m\-/g, "M").replace(/u\-/g, "U").replace(/c\-/g, "C");
                ruiExample = ruiExample.replace(/\_\_componentNameCap\_\_/g, _name)

                var _cache = result["cache"];
                var _cacheCall = result["cacheCall"];
                if (_cache) {
                    cacheExample = cacheExample.replace(/\_\_cache\_\_/g, _name).replace("__cachePath__", _name).replace(/\_\_content\_\_/g, _cache);
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
            }
        },
        exportHTML: function () {
            //只适合制作绝对定位, 仅导出html
            var result = project.exportHTMLCSS();
            var _html = htmlExample.replace("__html__", result["html"]).replace("__name__", result["name"]);
            var blob = new Blob([_html], {
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

    function handleReplace(_str, _name, _nameCamel) {
        if (!!_str) {
            return _str.replace(/\_\_name\_\_/g, _name).replace(/\_\_nameCamel\_\_/g, _nameCamel);
        } else {
            return _str;
        }
    }

    componentModule.on("importProject", function () {
        toolbar.importProject();
    });
    componentModule.on("importProjectFromUrl", function (_url) {
        $.get(_url, function (_data) {
            project.import(JSON.parse(_data));
        });
    });
    componentModule.on("newModule", function () {
        toolbar.newModule();
    });
    componentModule.on("newUnit", function () {
        toolbar.newUnit();
    });
    componentModule.on("syncCode", function (_tpl) {
        var _com = componentModule.selectedComponents()[0];
        var _comName = _com.meta.name;
        _nameCamel = _comName.replace(/\-(\s|\S)?/g, function (m) {
            return m[1] ? m[1].toUpperCase() : ""
        });
        var _poolC = _.find(pageModule.pages(), function (i) {
            return i.name == _comName;
        });

        $.each(_tpl.templates, function (k, v) {
            if (!!v.name && _com.meta[v.name]) {
                var _dest = handleReplace(v.dest, _comName, _nameCamel),
                    _udest = "";
                if (v.udest) {
                    _udest = handleReplace(v.udest, _comName, _nameCamel)
                        .replace("__ftlPath__", _poolC.ftlPath || "undefined")
                        .replace("__cssPath__", _poolC.cssPath || "undefined")
                        .replace("__compPath__", _poolC.ruiPath || "undefined");
                }
                if (!_udest.match("undefined") && _udest.length) {
                    _dest = _udest;
                }

                $.get(_dest, function (_data) {
                    var _com = componentModule.selectedComponents()[0];
                    if (_com.meta[v.name] != _data) {
                        _com.meta[v.name] = _data;
                        toolbar.saveProject();
                    }
                });
            }
        })
    });
    componentModule.on("saveHTML", function () {
        toolbar.exportHTML();
    });

    componentModule.on("saveCommon", function (_tpl, _overWrite) {
        var _comp = componentModule.selectedComponents()[0];
        var _compName = _comp.meta.name;
        var _poolC = _.find(pageModule.pages(), function (i) {
            return i.name == _compName;
        });
        if (!_poolC) {
            Modal.confirm("提示", "组件池没有数据请先创建组件池！", null, null, 1000);
            return;
        }
        var result = project.exportHTMLCSS();
        var _name = result["name"].replace(/p\-/g, "").replace(/m\-/g, "").replace(/u\-/g, "").replace(/c\-/g, "");
        _nameCamel = _name.replace(/\-(\s|\S)?/g, function (m) {
            return m[1] ? m[1].toUpperCase() : ""
        });

        $.each(_tpl.templates, function (k, t) {
            var _tName = t.name;
            var _udest = "";
            if (t.udest) {
                _udest = handleReplace(t.udest, _name, _nameCamel)
                    .replace("__ftlPath__", _poolC.ftlPath || "undefined")
                    .replace("__cssPath__", _poolC.cssPath || "undefined")
                    .replace("__compPath__", _poolC.ruiPath || "undefined");
            }
            var _dest = handleReplace(t.dest, _name, _nameCamel);
            if (!_udest.match("undefined") && _udest.length) {
                _dest = _udest;
            }

            if (_comp.meta[_tName] && !_overWrite) {
                service.saveApi("/api/" + _compName, {
                    ext: '{"name":"' + _compName + '", "url":"' + _dest + '"}',
                    cmpData: _comp.meta[_tName]
                }, _dest + "保存成功");
            } else {
                t.default = t.default || {};
                for (var kk in t.default) {
                    t.default[kk] = handleReplace(t.default[kk], _name, _nameCamel);
                }
                var _default = {
                    __404Path__: result["umi"] ? result["umi"]["404"] : "",
                    __module__: result["umi"] ? JSON.stringify(result["umi"]["modules"]) : "",
                    __html__: result["html"] || "",
                    __css__: result["css"] || "",
                    __name__: _name || "",
                    __namePrefix__: _name.split("-")[0] || "",
                    __nameSufix__: _name.split("-")[1] || _name || "",
                    __nameCamel__: _nameCamel || "",
                    __desc__: _poolC.desc || "",
                    __cache__: result["cache"] || "",
                    __cachePath__: "",
                    __cacheName__: result["cache"].length ? ("," + _nameCamel + "Cache") : "",
                    __cacheCall__: handleReplace(result["cacheCall"], _name, _nameCamel) || ""
                };

                for (var kk in t.default) {
                    if (t.default[kk]) {
                        _default[kk] = t.default[kk];
                    }
                }

                if (result["cache"].length) {
                    _default.__cachePath__ = ",'./cache.js'";
                    if (t.default["__cachePath__"]) {
                        _default.__cachePath__ = t.default["__cachePath__"];
                    }
                } else {
                    _default.__cachePath__ = "";
                }

                if (!!t.if && !!_default[t.if] || !t.if) {
                    $.get(t.content, function (_contBuild) {
                        for (var exp in t.vars) {
                            var reg = new RegExp(exp, "g");
                            if (t.vars[exp] == "default") {
                                //注意这里$如果在后面会和正则表达式的冲突，所以需要修改
                                _contBuild = _contBuild.replace(reg, _default[exp].replace(/\$/g, "\\$") || "").replace(/\\\$/g, "\$");
                            } else {
                                _contBuild = _contBuild.replace(reg, handleReplace(t.vars[exp], _name, _nameCamel));
                            }
                        }
                        if (_tName) {
                            _comp.meta[_tName] = _contBuild;
                        }
                        service.saveApi("/api/" + _compName, {
                            ext: '{"name":"' + _compName + '", "url":"' + _dest + '"}',
                            cmpData: _contBuild
                        }, _dest + "保存成功");
                    });
                }
            }
        });
    });
    componentModule.on("saveFTL", function (_com, isOverWriteFTL) {
        if (pageModule.pages().length < 1) {
            Modal.confirm("提示", "组件池没有数据请先创建组件池！", null, null, 1000);
        } else {
            var _comName = _com.meta.name;
            var _poolE = _.find(pageModule.pages(), function (i) {
                return i.name == _comName;
            });
            // var _selectC = componentModule.components()[0];
            //重新获取需要处理的module，否则之前的数据有缓存
            _com = componentModule.selectedComponents()[0];

            if (_poolE && _poolE.ftlPath.indexOf("/") >= 0) {
                //只适合制作绝对定位的FTL组件
                var result = project.exportHTMLCSS();
                var pageHtml = result["html"];
                if (result["umi"]) {
                    //_poolE.ftlPath 示例 C:/work/edu-mooc-2.0/src/views/web/index/
                    var _filePath = _poolE.ftlPath.substr(_poolE.ftlPath.indexOf("views") + 6);
                    //_poolE.cssPath 示例 C:/work/edu-mooc-2.0/src/scss/web/module/index/
                    var _cssPath = _poolE.cssPath.substr(_poolE.cssPath.indexOf("scss") + 5);

                    //创建umi模块对应的页面
                    var _name = result["name"].replace(/p\-/g, "");

                    var path0 = _filePath.split("/")[0];
                    var path1 = _filePath.split("/")[1];
                    var jsPath = _poolE.ftlPath.substring(0, _poolE.ftlPath.indexOf("views")) + "javascript/";
                    var htmlPath = _poolE.ftlPath.substring(0, _poolE.ftlPath.indexOf("views")) + "html/";
                    //判断是否有cache
                    var _cache = result["cache"];
                    var _cacheCall = result["cacheCall"];
                    // cache模板
                    var cacheExample = require("text!template/cache/cache.js");
                    if (_cache) {
                        if (_com.meta.pageCacheJS) {
                            cacheExample = _com.meta.pageCacheJS;
                        } else {
                            cacheExample = cacheExample.replace(/\_\_cache\_\_/g, _name).replace("__cachePath__", "pro/" + path0 + "/cache/" + path1 + "/" + _name + "Cache").replace(/\_\_content\_\_/g, _cache);;
                        }
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (jsPath + path0 + "/cache/" + path1 + "/" + _name + "Cache.js") + '"}',
                            cmpData: cacheExample
                        }, _name + "Cache.js保存成功");
                    } else {
                        cacheExample = "";
                    }

                    //保存page.js
                    if (_com.meta.pageJS) {
                        pageJS = _com.meta.pageJS;
                    } else {
                        pageJS = pageJS.replace("__path0__", path0).replace("__path1__", path1).replace("__pName__", _name).replace("__pDesc__", _poolE.desc);
                    }
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (jsPath + path0 + "/pages/" + path1 + "/" + _name + ".js") + '"}',
                        cmpData: pageJS
                    }, "pageJS保存成功");

                    //保存module.js，module.html
                    var _modules = result["umi"]["modules"];
                    var _modulesP = result["umi"]["parentM"];
                    //如果是单页面多模块则生成模块，如果是单页面多组件，则直接生成页面
                    if (Object.keys(_modules).length) {
                        for (var key in _modules) {
                            //对于默认路由到commonUtil.html的组件不处理
                            if (_modules[key] != "common/commonutil.html") {
                                var _module = _.find(_com.elements, function (item) {
                                    return _modules[key] == item.properties.modulePath;
                                });

                                var _mName = key.substr(key.lastIndexOf("/") + 1);
                                var _moduleJS = "";
                                if (_module && _module.properties.moduleJS) {
                                    _moduleJS = _module.properties.moduleJS;
                                } else {
                                    _moduleJS = moduleJS.replace("__path0__", path0).replace("__path1__", path1).replace("__parentM__", _modulesP[key]).replace(/\_\_pName\_\_/g, _mName).replace("__pDesc__", _poolE.desc).replace("__modulePath__", key);
                                }
                                service.saveApi("/api/" + _comName, {
                                    ext: '{"name":"' + _comName + '", "url":"' + (jsPath + path0 + "/module/" + path1 + "/" + _mName + ".js") + '"}',
                                    cmpData: _moduleJS
                                }, "moduleJS保存成功");

                                var _moduleHtml = "";
                                if (_module && _module.properties.moduleHTML) {
                                    _moduleHtml = _module.properties.moduleHTML;
                                } else {
                                    _moduleHtml = moduleHtml.replace(/\_\_pName\_\_/g, _mName).replace("__jsName__", path0 + "/module/" + path1 + "/" + _mName);
                                }
                                service.saveApi("/api/" + _comName, {
                                    ext: '{"name":"' + _comName + '", "url":"' + (htmlPath + path0 + "/" + _modules[key]) + '"}',
                                    cmpData: _moduleHtml
                                }, "moduleHTML保存成功");


                                if (_module && (_moduleJS != _module.properties.moduleJS || _moduleHtml != _module.properties.moduleHTML)) {
                                    _module.properties.moduleJS = _moduleJS;
                                    _module.properties.moduleHTML = _moduleHtml;
                                    hierarchyModule.loadElement(_module);
                                }
                            }
                        }
                    }

                    var pageHtml = "";
                    if (_com.meta.pageFTL && !isOverWriteFTL) {
                        pageHtml = _com.meta.pageFTL;
                        //只保存ftl，不修改css，否则元素css不一致
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ftlPath + result["name"] + ".ftl") + '"}',
                            cmpData: pageHtml
                        }, "FTL保存成功");
                    } else {
                        pageHtml = toolbar.generatePageHtml(result, _filePath, _cssPath);
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.cssPath + result["name"] + ".scss") + '"}',
                            cmpData: result["css"]
                        }, "CSS保存成功");
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ftlPath + result["name"] + ".ftl") + '"}',
                            cmpData: pageHtml
                        }, "FTL保存成功");
                    }
                    if (pageHtml != _com.meta.pageFTL || pageJS != _com.meta.pageJS || cacheExample != _com.meta.pageCacheJS) {
                        _com.meta.pageFTL = pageHtml;
                        _com.meta.pageJS = pageJS;
                        _com.meta.pageCacheJS = cacheExample;
                        toolbar.saveProject();
                    }
                } else {
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (_poolE.cssPath + "_" + result["name"] + ".scss") + '"}',
                        cmpData: result["css"]
                    }, "CSS保存成功");
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ftlPath + result["name"] + ".ftl") + '"}',
                        cmpData: result["html"]
                    }, "FTL保存成功");
                }
            } else {
                Modal.confirm("请先保存到组件池并填写FTL/CSS路径", "提示", null, null, 1000);
            }

        }
    });
    hierarchyModule.on("saveProject", function (_com) {
        toolbar.saveProject();
    });
    hierarchyModule.on("saveElement", function (_cb) {
        toolbar.saveProject(function () {
            toolbar.saveElement(_cb);
        });

    });
    hierarchyModule.on("editModule", function (_com) {
        if (_com && _com.properties.moduleJS().length) {
            toolbar.showUMICodeEditor(_com.properties.moduleJS(), _com.properties.moduleHTML(), function (_data) {
                _.each(_data, function (it) {
                    if (it.codeStr.length) {
                        if (it.classStr == "moduleJS") {
                            _com.properties.moduleJS(it.codeStr);
                        } else if (it.classStr == "moduleHTML") {
                            _com.properties.moduleHTML(it.codeStr);
                        }
                    }
                    toolbar.saveProject();
                });

            });
        } else {
            Modal.confirm("提示", "请先保存页面以生成模块初始代码", null, null, 1000);
        }

    });
    toolbar.editorCode = function (_tpl) {
        var _selectC = componentModule.selectedComponents()[0];
        toolbar.showCodeEditor(_tpl.templates, _selectC.meta);
    };
    componentModule.on("editorJS", function (_tpl) {
        toolbar.editorCode(_tpl);
    });
    componentModule.on("enterShell", function () {
        toolbar.showCmd();
    });
    componentModule.on("saveProject", function (_cb) {
        toolbar.saveProject(_cb);
    });


    componentModule.on("saveRUI", function (_com, _forceUpdate) {
        if (pageModule.pages().length < 1) {
            Modal.confirm("提示", "组件池没有数据请先创建组件池！", null, null, 1000);
        } else {
            Modal.confirm("提示", "正在保存组件文件...", null, null, 1500);
            var _comName = _com.meta.name;
            var _poolE = _.find(pageModule.pages(), function (i) {
                return i.name == _comName;
            });
            if (_poolE && _poolE.ruiPath.indexOf("/") >= 0) {
                //只适合制作绝对定位的FTL组件
                var result = project.exportHTMLCSS();
                var _html = result["html"];
                _html = _html.replace(/\$\{/g, "{")
                service.saveApi("/api/" + _comName, {
                    ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "component.html") + '"}',
                    cmpData: _html
                }, "component.html保存成功");
                service.saveApi("/api/" + _comName, {
                    ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "component.css") + '"}',
                    cmpData: result["css"]
                }, "component.css保存成功");
                var _selectC = componentModule.selectedComponents()[0];
                if (_selectC.meta.componentJS && !_forceUpdate) {
                    var _cache = result["cache"];
                    if (_cache && _selectC.meta.cacheJS) {
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "cache.js") + '"}',
                            cmpData: _selectC.meta.cacheJS
                        }, "cache.js保存成功");
                    }
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "component.js") + '"}',
                        cmpData: _selectC.meta.componentJS
                    }, "component.js保存成功");
                    //保存测试用例
                    if (_selectC.meta.testCaseApi) {
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "/test/caseApi.js") + '"}',
                            cmpData: _selectC.meta.testCaseApi
                        }, "testCaseApi保存成功");
                    }
                    if (_selectC.meta.testCaseEvt) {
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "/test/caseEvt.js") + '"}',
                            cmpData: _selectC.meta.testCaseEvt
                        }, "testCaseEvt保存成功");
                    }
                    if (_selectC.meta.testCaseIns) {
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "/test/caseIns.js") + '"}',
                            cmpData: _selectC.meta.testCaseIns
                        }, "testCaseIns");
                    }
                    if (!_selectC.meta.testCaseApi && !_selectC.meta.testCaseEvt && !_selectC.meta.testCaseIns) {
                        //初始化test测试用例
                        exportFile.exportTests(_comName, _poolE, function (_api, _evt, _ins) {
                            _selectC.meta.testCaseApi = _api;
                            _selectC.meta.testCaseEvt = _evt;
                            _selectC.meta.testCaseIns = _ins;
                            toolbar.saveProject();
                        });

                    }
                } else {
                    var _name = result["name"];
                    //componentName需要用小写，因为如果使用<componentName></componentName>这种方式，在设计中填入组件会自动插入到节点，只能用小写
                    var ruiExample = require("text!template/rui/component.js");
                    // cache模板
                    var cacheExample = require("text!template/cache/cache.js");
                    ruiExample = ruiExample.replace(/\_\_componentName\_\_/g, _name.toLowerCase());
                    // 处理类名不能包含-, 规范是M代表module，U代表unit，C代表cache
                    _name = _name.replace(/m\-/g, "").replace(/u\-/g, "").replace(/c\-/g, "");
                    _nameCamel = _name.replace(/\-(\s|\S)?/g, function (m) {
                        return m[1] ? m[1].toUpperCase() : ""
                    });
                    ruiExample = ruiExample.replace(/\_\_componentNameCap\_\_/g, _nameCamel)

                    var _cache = result["cache"];
                    var _cacheCall = result["cacheCall"];
                    if (_cache) {
                        cacheExample = cacheExample.replace(/\_\_cache\_\_/g, _name).replace("__cachePath__", _name).replace(/\_\_content\_\_/g, _cache);
                        _selectC.meta.cacheJS = cacheExample;
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "cache.js") + '"}',
                            cmpData: _selectC.meta.cacheJS
                        }, "cache.js保存成功");
                    }
                    if (_cacheCall) {
                        _cacheCall = _cacheCall.replace(/\_\_cacheName\_\_/g, _nameCamel);
                        ruiExample = ruiExample.replace(/\_\_cacheJS\_\_/g, ",'./cache.js'").replace(/\_\_cacheName\_\_/g, "," + _nameCamel + "Cache").replace(/\_\_cacheCall\_\_/g, _cacheCall);
                    } else {
                        ruiExample = ruiExample.replace(/\_\_cacheJS\_\_/g, '').replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, "");
                    }
                    _selectC.meta.componentJS = ruiExample;
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "component.js") + '"}',
                        cmpData: _selectC.meta.componentJS
                    }, "component.js保存成功");
                    _selectC.meta.pageFTL = "";
                    _selectC.meta.pageJS = "";
                    _selectC.meta.pageCacheJS = "";
                    //保存test测试用例
                    exportFile.exportTests(_comName, _poolE, function (_api, _evt, _ins) {
                        _selectC.meta.testCaseApi = _api;
                        _selectC.meta.testCaseEvt = _evt;
                        _selectC.meta.testCaseIns = _ins;
                        toolbar.saveProject();
                    });

                }
            } else {
                Modal.confirm("提示", "请先保存到组件池并填写RUI路径", null, null, 1000);
            }

        }
    });
    componentModule.on("saveRUINew", function (_com, _forceUpdate) {
        if (pageModule.pages().length < 1) {
            Modal.confirm("提示", "组件池没有数据请先创建组件池！", null, null, 1000);
        } else {
            Modal.confirm("提示", "正在保存组件文件...", null, null, 1500);
            var _comName = _com.meta.name;
            var _poolE = _.find(pageModule.pages(), function (i) {
                return i.name == _comName;
            });
            if (_poolE && _poolE.ruiPath.indexOf("/") >= 0) {
                //只适合制作绝对定位的FTL组件
                var result = project.exportHTMLCSS();
                var _html = result["html"];
                _html = _html.replace(/\$\{/g, "{")
                service.saveApi("/api/" + _comName, {
                    ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "component.html") + '"}',
                    cmpData: _html
                }, "component.html保存成功");
                service.saveApi("/api/" + _comName, {
                    ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "component.css") + '"}',
                    cmpData: result["css"]
                }, "component.css保存成功");
                var _selectC = componentModule.selectedComponents()[0];
                if (_selectC.meta.componentJS && !_forceUpdate) {
                    var _cache = result["cache"];
                    if (_cache && _selectC.meta.cacheJS) {
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "cache.js") + '"}',
                            cmpData: _selectC.meta.cacheJS
                        }, "cache.js保存成功");
                    }
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "component.js") + '"}',
                        cmpData: _selectC.meta.componentJS
                    }, "component.js保存成功");
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "ui.js") + '"}',
                        cmpData: _selectC.meta.uiJS
                    }, "ui.js保存成功");
                    //保存测试用例
                    if (_selectC.meta.testCaseApi) {
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "/test/caseApi.js") + '"}',
                            cmpData: _selectC.meta.testCaseApi
                        }, "testCaseApi保存成功");
                    }
                    if (_selectC.meta.testCaseEvt) {
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "/test/caseEvt.js") + '"}',
                            cmpData: _selectC.meta.testCaseEvt
                        }, "testCaseEvt保存成功");
                    }
                    if (_selectC.meta.testCaseIns) {
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "/test/caseIns.js") + '"}',
                            cmpData: _selectC.meta.testCaseIns
                        }, "testCaseIns");
                    }
                    if (!_selectC.meta.testCaseApi && !_selectC.meta.testCaseEvt && !_selectC.meta.testCaseIns) {
                        //初始化test测试用例
                        exportFile.exportTests(_comName, _poolE, function (_api, _evt, _ins) {
                            _selectC.meta.testCaseApi = _api;
                            _selectC.meta.testCaseEvt = _evt;
                            _selectC.meta.testCaseIns = _ins;
                            toolbar.saveProject();
                        });

                    }
                } else {
                    var _name = result["name"];
                    //componentName需要用小写，因为如果使用<componentName></componentName>这种方式，在设计中填入组件会自动插入到节点，只能用小写
                    var ruiExample = require("text!template/rui/component.js");
                    var ruiUIExample = require("text!template/rui/ui.js");
                    // cache模板
                    var cacheExample = require("text!template/cache/cache.js");
                    // 处理类名不能包含-, 规范是M代表module，U代表unit，C代表cache
                    _name = _name.replace(/m\-/g, "").replace(/u\-/g, "").replace(/c\-/g, "");
                    _nameCamel = _name.replace(/\-(\s|\S)?/g, function (m) {
                        return m[1] ? m[1].toUpperCase() : ""
                    });
                    ruiExample = ruiExample.replace(/\_\_componentNameCap\_\_/g, _nameCamel).replace(/\_\_componentName\_\_/g, _name.toLowerCase());
                    ruiUIExample = ruiUIExample.replace(/\_\_componentNameCap\_\_/g, _nameCamel).replace(/\_\_componentName\_\_/g, _name.toLowerCase());

                    var _cache = result["cache"];
                    var _cacheCall = result["cacheCall"];
                    if (_cache) {
                        cacheExample = cacheExample.replace(/\_\_cache\_\_/g, _name).replace("__cachePath__", _name).replace(/\_\_content\_\_/g, _cache);
                        _selectC.meta.cacheJS = cacheExample;
                        service.saveApi("/api/" + _comName, {
                            ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "cache.js") + '"}',
                            cmpData: _selectC.meta.cacheJS
                        }, "cache.js保存成功");
                    }
                    //将所有异步请求放到暴露的ui中
                    ruiExample = ruiExample.replace(/\_\_cacheJS\_\_/g, '').replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, "");
                    _selectC.meta.componentJS = ruiExample;
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "component.js") + '"}',
                        cmpData: _selectC.meta.componentJS
                    }, "component.js保存成功");

                    if (_cacheCall) {
                        _cacheCall = _cacheCall.replace(/\_\_cacheName\_\_/g, _nameCamel);
                        ruiUIExample = ruiUIExample.replace(/\_\_cacheJS\_\_/g, ",'./cache.js'").replace(/\_\_cacheName\_\_/g, "," + _nameCamel + "Cache").replace(/\_\_cacheCall\_\_/g, _cacheCall);
                    } else {
                        ruiUIExample = ruiUIExample.replace(/\_\_cacheJS\_\_/g, '').replace(/\_\_cacheName\_\_/g, "").replace(/\_\_cacheCall\_\_/g, "");
                    }
                    _selectC.meta.uiJS = ruiUIExample;
                    service.saveApi("/api/" + _comName, {
                        ext: '{"name":"' + _comName + '", "url":"' + (_poolE.ruiPath + "ui.js") + '"}',
                        cmpData: _selectC.meta.uiJS
                    }, "ui.js保存成功");
                    _selectC.meta.pageFTL = "";
                    _selectC.meta.pageJS = "";
                    _selectC.meta.pageCacheJS = "";
                    //保存test测试用例
                    exportFile.exportTests(_comName, _poolE, function (_api, _evt, _ins) {
                        _selectC.meta.testCaseApi = _api;
                        _selectC.meta.testCaseEvt = _evt;
                        _selectC.meta.testCaseIns = _ins;
                        toolbar.saveProject();
                    });

                }
            } else {
                Modal.confirm("提示", "请先保存到组件池并填写RUI路径", null, null, 1000);
            }

        }
    });
    poolModule.on("loadPoolItem", function (_url) {

        $.get(_url, function (_data) {
            if (_url.substr(-3) === 'cmp' || _url.substr(-10) === 'cmp_backup') {
                //如果是组件文件
                project.import(JSON.parse(_data));
                Modal.confirm("提示", "组件加载成功", null, null, 1000);

            } else if (_url.substr(-4) === 'cmpp') {
                //如果是组件池文件
                pageModule.clearPages();
                project.importPage(JSON.parse(_data));
                pageModule.setPoolUrl(_url);
                Modal.confirm("提示", "组件集合加载成功", null, null, 1000);

            }
        })
    });
    dataModule.on("refreshExample", function (data) {
        var _selectC = componentModule.selectedComponents()[0];
        var _comName = _selectC.meta.name;

        var _tpls = templateModule.templates();
        var _showTpl = _.find(_tpls, function (i) {
            return i.name == "regular-show-mooc";
        });
        if (_showTpl) {
            var _tplTemp = _showTpl.templates[0];
            var _cont = _tplTemp["content"].replace(/\_\_name\_\_/g, _comName);
            var _dest = _tplTemp["dest"].replace(/\_\_name\_\_/g, _comName);
            $.get(_cont, function (_contBuild) {
                for (var exp in _tplTemp.vars) {
                    var _default = {
                        __data__: JSON.stringify(data)
                    };
                    var reg = new RegExp(exp, "g");
                    if (_tplTemp.vars[exp] == "default") {
                        _contBuild = _contBuild.replace(reg, _default[exp]);
                    } else {
                        _contBuild = _contBuild.replace(reg, _tplTemp.vars[exp]);
                    }
                }
                service.saveApi("/api/refreshExample", {
                    ext: '{"name":"refreshExample", "url":"' + _dest + '"}',
                    cmpData: _contBuild
                }, function () {
                    $("#drawMockView").html('<iframe frameborder="no" width="100%" height="100%" src="' + _dest + '" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" style="position: absolute;left: 0px;"></iframe>');
                });
            })
        } else {

            var _poolE = _.find(pageModule.pages(), function (i) {
                return i.name == _comName;
            });
            var ruiPath = _poolE.ruiPath;
            var libPath = _poolE.libPath;

            var showHtml = require("text!template/test/show.html");
            showHtml = showHtml.replace(/\_\_libDir\_\_/g, libPath).replace(/\_\_data\_\_/g, JSON.stringify(data));
            service.saveApi("/api/refreshExample", {
                ext: '{"name":"refreshExample", "url":"' + ruiPath + 'test/show.html"}',
                cmpData: showHtml
            }, function () {
                $("#drawMockView").html('<iframe frameborder="no" width="100%" height="100%" src="/' + ruiPath.substr(ruiPath.indexOf("src")) + 'test/show.html" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" style="position: absolute;left: 0px;"></iframe>');
            });
        }
    });
    dataModule.on("showTestResult", function () {

        var _selectC = componentModule.selectedComponents()[0];
        var _comName = _selectC.meta.name;
        var _poolE = _.find(pageModule.pages(), function (i) {
            return i.name == _comName;
        });
        var ruiPath = _poolE.ruiPath;
        $("#drawMockView").html('<iframe frameborder="no" width="100%" height="100%" src="/' + ruiPath.substr(ruiPath.indexOf("src")) + 'test/test.html" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" style="position: absolute;left: 0px;background:#fff;"></iframe>');
        // var _coverage = "";
        // var __coverageTimer = setInterval(function () {
        //     if (window.frames[0].__coverage__) {
        //         _coverage = JSON.stringify(window.frames[0].__coverage__);
        //         clearInterval(__coverageTimer);
        //         service.saveApi("/api/coverage", {
        //             ext: '{"name":"coverage", "url":"/' + (ruiPath.substr(ruiPath.indexOf("src")) + "test/coverage.json") + '"}',
        //             cmpData: _coverage
        //         }, "生成覆盖率报告...");
        //     }
        // }, 500)
    });
    dataModule.on("save2test", function () {
        var _selectC = componentModule.selectedComponents()[0];
        if (_selectC && _selectC.meta.testCaseIns) {
            var caseReg = /return ([\s\S]*?\])\;/g
            var result = caseReg.exec(_selectC.meta.testCaseIns);
            var allCase = [];
            if (result) {
                allCase = JSON.parse(result[1]);
            }
            allCase.push({
                data: dataModule.getDataValue()
            });
            _selectC.meta.testCaseIns = _selectC.meta.testCaseIns.replace(/(return )[\s\S]*?\](\;)/g, "$1" + JSON.stringify(allCase).replace(/\,/g, "\,\n") + "$2");
            Modal.confirm("提示", "成功保存到caseIns中,可以编辑JS查看", null, null, 1000);
        }
    });
    dataModule.on("getTestData", function () {
        var _selectC = componentModule.selectedComponents()[0];
        if (_selectC && _selectC.meta.testCaseIns) {
            var caseReg = /return ([\s\S]*?\])\;/g
            var result = caseReg.exec(_selectC.meta.testCaseIns);
            var allCase = [];
            if (result) {
                allCase = JSON.parse(result[1]);
                if (allCase.length) {
                    dataModule.setDataValue(allCase[Math.floor(Math.random() * allCase.length)].data);
                }
            }

        }
    });

    componentModule.on("save2pool", function (_com) {
        var _comName = _com.meta.name;
        var _poolE = _.find(pageModule.pages(), function (i) {
            return i.name == _comName;
        });
        var result = project.export(false, componentModule.selectedComponents()[0]);
        if (_poolE) {
            service.saveApi(_poolE.postUrl, {
                ext: JSON.stringify(_poolE),
                cmpData: JSON.stringify(result["result"])
            }, "操作成功");
        } else {
            var _body = new Container();
            var _inLine1 = new Inline();
            var _inLine2 = new Inline();
            var _inLine3 = new Inline();
            var _inLine4 = new Inline();
            var _inLine5 = new Inline();
            var _inLine6 = new Inline();
            var _inLine7 = new Inline();
            _inLine1.add(
                new Label({
                    attributes: {
                        text: "组件描述："
                    }
                })
            );
            var _desc = new TextField({
                attributes: {
                    placeholder: "组件描述"
                }
            });
            _inLine1.add(_desc);

            _inLine2.add(
                new Label({
                    attributes: {
                        text: "缩略图片："
                    }
                })
            );
            var _img = new TextField({
                attributes: {
                    text: "/.cmp/" + _comName + "/example.png"
                }
            });
            _inLine2.add(_img);
            _inLine3.add(
                new Label({
                    attributes: {
                        text: "组件地址："
                    }
                })
            );
            var _url = new TextField({
                attributes: {
                    text: "/.cmp/" + _comName + "/" + _comName + ".cmp"
                }
            });
            _inLine3.add(_url);
            _inLine4.add(
                new Label({
                    attributes: {
                        text: "FTL地址："
                    }
                })
            );
            var _ftl = new TextField({
                attributes: {
                    placeholder: "FTL保存路径地址/"
                }
            });
            _inLine4.add(_ftl);
            _inLine5.add(
                new Label({
                    attributes: {
                        text: "CSS地址："
                    }
                })
            );
            var _css = new TextField({
                attributes: {
                    placeholder: "CSS保存路径地址/"
                }
            });
            _inLine5.add(_css);
            _inLine6.add(
                new Label({
                    attributes: {
                        text: "Comp地址："
                    }
                })
            );
            var _rui = new TextField({
                attributes: {
                    placeholder: "组件(路径自治)保存路径地址/"
                }
            });
            _inLine6.add(_rui);
            _inLine7.add(
                new Label({
                    attributes: {
                        text: "LIB地址："
                    }
                })
            );
            var _lib = new TextField({
                attributes: {
                    placeholder: "依赖lib地址('/src/javascript/lib/')"
                }
            });
            _inLine7.add(_lib);
            _body.add(_inLine1);
            _body.add(_inLine2);
            _body.add(_inLine3);
            _body.add(_inLine4);
            _body.add(_inLine5);
            _body.add(_inLine6);
            _body.add(_inLine7);
            Modal.popup("请输入相关内容", _body, function () {
                var _tmp = {
                    "name": _comName,
                    "desc": _desc.text(),
                    "img": _img.text(),
                    "url": _url.text(),
                    "ftlPath": _ftl.text(),
                    "cssPath": _css.text(),
                    "ruiPath": _rui.text(),
                    "libPath": _lib.text(),
                    "postUrl": "/api/" + _comName
                };
                pageModule.load([_tmp]);

                service.saveApi(_tmp.postUrl, {
                    ext: JSON.stringify(_tmp),
                    cmpData: JSON.stringify(result["result"])
                }, "操作成功");
                pageModule.savePool();
            });

        }

    });
    pageModule.on("importProject", function () {
        toolbar.importProject();
    });
    pageModule.on("importProjectFromUrl", function (_url) {
        $.get(_url, function (_data) {
            project.importPage(JSON.parse(_data));
        });
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

        if (file && (file.name.substr(-3) === 'cmp' || file.name.substr(-10) === 'cmp_backup')) {
            //如果是组件文件
            fileReader.onload = function (e) {
                fileReader.onload = null;

                var elements = project.import(JSON.parse(e.target.result));

            }
            fileReader.readAsText(file);
        } else if (file && file.name.substr(-4) === 'cmpp') {
            //如果是组件池文件
            fileReader.onload = function (e) {
                fileReader.onload = null;

                var elements = project.importPage(JSON.parse(e.target.result));

            }
            fileReader.readAsText(file);
        }
    }
    //register key map 
    regKey.registerKey(false, true, false, "s", function () {
        if ($("#cmd").css("display") == "none") {
            toolbar.showCmd();
        } else {
            $('#cmd').slideUp();
        }

    });
    regKey.registerKey(false, true, false, "c", function () {
        if ($("#editor").css("display") == "none") {
            toolbar.editorCode();
        } else {
            $('#editor').slideUp();
        }

    });
    require("elements/image");
    require("elements/text");
    require("elements/select");
    require("elements/func");
    require("elements/umi");
    require("elements/timeline");

    return toolbar;
})
