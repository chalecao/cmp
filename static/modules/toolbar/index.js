define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./toolbar.xml");
    var moduleExample = require("text!template/module/m-example.cmp");
    var unitExample = require("text!template/unit/u-example.cmp");
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
