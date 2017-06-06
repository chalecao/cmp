define(function (require) {

    var _ = require("_");

    var $ = require("$");
    var factory = require("core/factory");

    var viewportModule = require("modules/viewport/index");
    var hierarchyModule = require("modules/hierarchy/index");
    var componentModule = require("modules/component/index");
    var pageModule = require("modules/page/index");
    var dataModule = require("modules/dataMock/index");


    function find(assets, path) {
        var pathArr = path.split("/");
        var result = _.reduce(pathArr, function (memo, key) {
            if (memo) {
                return memo[key];
            }
        }, assets);

        return result && result.data;
    }

    var project = {
        import: function (json) {
            var _that = this;
            //添加组件
            if (json instanceof Array) {
                componentModule.load(json);
            } else {
                componentModule.load([json]);
            }

            componentModule.on("selectComponent", function (subComponent) {
                _that.loadComponent(subComponent);
                console.log("selectComponent handle");
                // console.log(JSON.stringify(subComponent));
            });
        },
        importPage: function (json) {
            //添加组件池列表
            if (json instanceof Array) {
                pageModule.load(json);
            } else {
                pageModule.load([json]);
            }

            var _that = this;
            pageModule.on("selectPage", function (_comp) {
                if (_comp.url || _comp.urlBackup) {
                    $.get(_comp.url || _comp.urlBackup, function (_data) {
                        _that.import(JSON.parse(_data));
                        //默认加载第一个元素
                        setTimeout(function () {
                            $("#Component").find(".qpf-container-item")[0].click();
                        }, 300);
                    });
                }

            });
        },
        loadComponent: _.throttle(function (json) {
            console.log("selectComponent handle with loadComponent after throttle");
            if (!json) return;

            if (json) {
                //全部开启，不区分
                if (!$(".mainContent").find(".switchDesign").length) {
                    $(".mainContent").append("<div class='switchDesign'><span class='page'>页面设计</span><span class='mock'>Mock</span><span class='umi'>UMI结构</span><span class='timeline'>时序图</span></div>");

                    //绑定事件
                    $(".switchDesign span").click(function (item) {
                        $(".switchDesign span").removeClass("cur");
                        $(this).addClass("cur");
                        //清楚无用样式
                        $("#tempStyle").remove();

                        if ($(this).hasClass("umi")) {
                            $(".cmp-element").addClass("cmp-dn");
                            $("#drawMockView").hide();
                            $(".cmp-umi").show();
                            $(".cmp-umi").removeClass("cmp-dn");
                            $("#drawArrow").show();
                            $("#drawDiagram").css("opacity", 0);
                        }
                        if ($(this).hasClass("page")) {
                            $(".cmp-element").removeClass("cmp-dn");
                            $("#drawMockView").hide();
                            $(".cmp-umi").hide();
                            $("#drawArrow").hide();
                            $("#drawDiagram").css("opacity", 0);
                        }
                        if ($(this).hasClass("mock")) {
                            $(".cmp-element").removeClass("cmp-dn");
                            $(".cmp-umi").hide();
                            $("#drawArrow").hide();
                            $("#drawDiagram").css("opacity", 0);
                            //获取mock数据
                            // var result = project.exportHTMLCSS();
                            // var _css = result["css"];
                            // var _html = result["html"];
                            // var _selectC = componentModule.selectedComponents()[0];
                            // var _comName = _selectC.meta.name;
                            // var _poolE = _.find(pageModule.pages(), function (i) {
                            //     return i.name == _comName;
                            // });
                            // // dataModule.showMockView(_selectC.meta.componentJS, _css, _html);
                            // dataModule.showMockViewIframe(_poolE.ruiPath, _poolE.libPath);

                            // dataModule.showMockView();
                            //先保证元素是展示的，然后才能mock，然后展示
                            $(".cmp-element").addClass("cmp-dn");
                            $("#drawMockView").show();
                        }
                        if ($(this).hasClass("timeline")) {
                            $(".cmp-element").addClass("cmp-dn");
                            $("#drawMockView").hide();
                            $("#drawArrow").hide();
                            $(".cmp-umi").hide();
                            $("#drawDiagram").css("opacity", 1);
                        }
                    });
                }

            }

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
            console.log("开始加载元件-----");
            var elements = [];
            _.each(json.elements, function (item) {
                importAsset(item.properties);
                var element = factory.create(item.type.toLowerCase(), {
                    "id": item.properties.id
                });

                window.hoverHandlerWithThrottle = _.throttle(function (_componentName, _parentElement, _hovPosition) {
                    console.log(_componentName + "- hover with throttle-----");
                    var _elments = [];
                    var _theOne = _.find(componentModule.components(), function (item) {
                        return (item["meta"]["name"] == _componentName);
                    });
                    if (!_theOne) {
                        return;
                    }
                    _elments = _theOne["elements"];
                    var elements = [];
                    //创建hover下的元素
                    _.each(_elments, function (item) {
                        var element = factory.create(item.type.toLowerCase(), {
                            "id": item.properties.id
                        });
                        if (item.properties.boxClassStr.indexOf(item.properties.id) < 0) {
                            item.properties.boxClassStr += " " + item.properties.id;
                        }
                        if (item.properties.funcType == "IF" && item.properties.ifFuncItem) {
                            element.off("addFuncComponent");
                            element.on("addFuncComponent", addFuncComponentHandler);

                        }
                        if (item.properties.funcType == "FOR" && item.properties.forFuncItem) {
                            element.off("addFuncComponent");
                            element.on("addFuncComponent", addFuncComponentHandler);

                        }
                        if (item.properties.funcType == "INCLUDE") {
                            element.off("addFuncComponent");
                            element.on("addFuncComponent", addFuncComponentHandler);

                        }
                        element.import(item);
                        elements.push(element);
                    });
                    // 寻找container
                    var _container;
                    var item1 = _.find(elements, function (item) {
                        //判断是不是container
                        return (item.isContainer());
                    });
                    item1.$wrapper.css({
                        position: "relative"
                    });
                    item1.$wrapper.find("a").remove();
                    _container = item1.$wrapper;
                    viewportModule.getViewPort().addElement(item1, _parentElement);
                    if (_hovPosition == "bottom") {
                        _parentElement.parent().css({
                            //加上左右padding值15
                            "margin-left": -Math.floor(+item1.properties.width() / 2 + 15)
                        });
                        _parentElement.parent().find(".e-hover-arrow").css({
                            "left": Math.floor(+item1.properties.width() / 2 + 15) - 10
                        });
                        _parentElement.parent().find(".e-hover-arrow-border").css({
                            "left": Math.floor(+item1.properties.width() / 2 + 15) - 10
                        });
                    } else if (_hovPosition == "bottom-right") {
                        _parentElement.parent().css({
                            //加上左右padding值15
                            "cssText": "left:" + "auto !important;right:0;"
                        });
                        _parentElement.parent().find(".e-hover-arrow").css({
                            "right": Math.floor(+_parentElement.parent().parent().width() / 2) - 10
                        });
                        _parentElement.parent().find(".e-hover-arrow-border").css({
                            "right": Math.floor(+_parentElement.parent().parent().width() / 2) - 10
                        });
                    } else if (_hovPosition == "left") {
                        _parentElement.parent().find(".e-hover-arrow").addClass("left");
                        _parentElement.parent().find(".e-hover-arrow").css({
                            "cssText": "top:" + (Math.floor(+item1.properties.height() / 2 + 15) - 10) + "px !important"
                        });
                        _parentElement.parent().find(".e-hover-arrow-border").addClass("left");
                        _parentElement.parent().find(".e-hover-arrow-border").css({
                            "cssText": "top:" + (Math.floor(+item1.properties.height() / 2 + 15) - 10) + "px !important"
                        });
                    } else if (_hovPosition == "right") {
                        _parentElement.parent().find(".e-hover-arrow").addClass("right");
                        _parentElement.parent().find(".e-hover-arrow").css({
                            "cssText": "top:" + (Math.floor(+item1.properties.height() / 2 + 15) - 10) + "px !important"
                        });
                        _parentElement.parent().find(".e-hover-arrow-border").addClass("right");
                        _parentElement.parent().find(".e-hover-arrow-border").css({
                            "cssText": "top:" + (Math.floor(+item1.properties.height() / 2 + 15) - 10) + "px !important"
                        });
                    }

                    //处理container的子元素
                    _.each(elements, function (item1, key1) {
                        //判断是不是container
                        if (!item1.isContainer()) {
                            //去掉hover组件中没有意义的a元素
                            if (!item1.$wrapper.hasClass("e-hover-source") && !item1.$wrapper.hasClass("cmp-func") && !item1.$wrapper.find("a").attr("href")) {
                                // 如果超链接没有内容而且不是hover，那么去掉超链接
                                item1.$wrapper.html(item1.$wrapper.find("a").html());
                            }
                            viewportModule.getViewPort().addElement(item1, _container);
                        }

                    });

                }, 300);

                function hoverHandler(_componentName, _parentElement, _hovPosition) {
                    console.log(_componentName + "- hover 处理-----");
                    hoverHandlerWithThrottle(_componentName, _parentElement, _hovPosition);
                }

                if (item.properties.hoverComponent) {
                    element.off("addFuncComponent");
                    element.on("addHoverComponent", hoverHandler);
                }

                function addFuncComponentHandler(_componentName, _parentElement) {
                    console.log(_componentName + "- FUNC 处理-----");
                    var _elments = [],
                        _componentName = _componentName,
                        _parentElement = _parentElement;
                    var _item = _.find(componentModule.components(), function (item) {
                        return (item["meta"]["name"] == _componentName);
                    });
                    if (_item) {
                        _elments = _item["elements"];
                        var elements = [];
                        _.each(_elments, function (item) {
                            var element = factory.create(item.type.toLowerCase(), {
                                "id": item.properties.id
                            });
                            if (item.properties.boxClassStr.indexOf(item.properties.id) < 0) {
                                item.properties.boxClassStr += " " + item.properties.id;
                            }
                            if (item.properties.funcType == "IF" && item.properties.ifFuncItem) {
                                element.off("addFuncComponent");
                                element.on("addFuncComponent", addFuncComponentHandler);

                            }
                            if (item.properties.funcType == "FOR" && item.properties.forFuncItem) {
                                element.off("addFuncComponent");
                                element.on("addFuncComponent", addFuncComponentHandler);

                            }
                            if (item.properties.funcType == "INCLUDE") {
                                element.off("addFuncComponent");
                                element.on("addFuncComponent", addFuncComponentHandler);

                            }
                            if (item.properties.hoverComponent) {
                                element.off("addHoverComponent");
                                element.on("addHoverComponent", hoverHandler);
                            }

                            element.import(item);
                            elements.push(element);
                        });
                    }
                    var _container;
                    var item1 = _.find(elements, function (item) {
                        return (item.isContainer());
                    });
                    if (item1) {
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

                        _.each(elements, function (item1, key1) {
                            //判断是不是container
                            if (!item1.isContainer()) {
                                if (!item1.$wrapper.find("a").attr("href")) {
                                    if (item1.$wrapper.find("a").children().length < 1) {
                                        item1.$wrapper.find("a").remove();
                                    } else if (!item1.properties.hoverComponent()) {
                                        item1.$wrapper.html(item1.$wrapper.find("a").html());
                                    }
                                }
                                viewportModule.getViewPort().addElement(item1, _container);
                            }
                        });
                    }
                };
                element.off("addFuncComponent");
                element.on("addFuncComponent", addFuncComponentHandler);

                element.import(item);
                elements.push(element);
            });

            hierarchyModule.load(elements);
            viewportModule.viewportWidth(json.viewport.width);
            viewportModule.viewportHeight(json.viewport.height);
            viewportModule.backColor(json.viewport.backColor);
        }, 300),
        /**
         * isSave:false表示导出组件，需要查找子组件，用于保存所有相关组件，true表示仅保存修改
         */
        export: function (isSave, _target) {
            //复用组件，保存的时候也会export
            var d = new Date();
            //以id包含container字符串的元素id前缀命名
            var _name = "example",
                _comStr = "",
                _caStr = "";
            var _itemC = _.find(hierarchyModule.elements(), function (element) {
                return (element.isContainer());
            });
            if (_itemC && _itemC.getName().length) {
                _name = _itemC.getName();
            } else {
                _name = hierarchyModule.elements()[0].getName();
            }
            var result = {
                meta: {
                    date: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
                    name: _name
                },
                viewport: {
                    width: viewportModule.viewportWidth(),
                    height: viewportModule.viewportHeight(),
                    backColor: viewportModule.backColor()
                },
                elements: [],
                assets: {}
            };
            if (_target) {
                result.meta.componentJS = _target.meta.componentJS;
                result.meta.cacheJS = _target.meta.cacheJS;
                result.meta.pageFTL = _target.meta.pageFTL;
                result.meta.pageJS = _target.meta.pageJS;
                result.meta.uiJS = _target.meta.uiJS;
                result.meta.pageCacheJS = _target.meta.pageCacheJS;
                result.meta.testCaseApi = _target.meta.testCaseApi;
                result.meta.testCaseEvt = _target.meta.testCaseEvt;
                result.meta.testCaseIns = _target.meta.testCaseIns;
            }

            function isContain(_list, _name) {
                return _.find(_list, function (item) {
                    return _name == item.meta.name;
                });

            }

            //存储所有的组件，包含子组件
            var _resultList = [];
            var that = this;

            function searchAndAddsubModule(json) {
                if (json.properties.trueFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.trueFuncBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.falseFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.falseFuncBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.elseIfFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.elseIfFuncBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.elseIfFuncBody2 && !isSave) {
                    _json = componentModule.getTarget(json.properties.elseIfFuncBody2);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.forFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.forFuncBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.includeBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.includeBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.hoverComponent && !isSave) {
                    _json = componentModule.getTarget(json.properties.hoverComponent);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }

            }
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
        exportElement: function (element) {
            var _name = "example";
            //复用组件，保存的时候也会export
            var d = new Date();
            if (element.getName().length) {
                _name = element.getName();
            }
            var result = {
                meta: {
                    date: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
                    name: _name
                },
                viewport: {
                    width: viewportModule.viewportWidth(),
                    height: viewportModule.viewportHeight(),
                    backColor: viewportModule.backColor()
                },
                elements: [],
                assets: {}
            };
            var _resultList = [];
            var json = element.export(),
                _json = "",
                that = this;
            //单个元素修改id
            if (json.properties.id.indexOf("container") < 0) {
                json.properties.id += "-container";
            }

            function searchAndAddsubModule(json) {
                if (json.properties.trueFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.trueFuncBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });

                    }
                }
                if (json.properties.falseFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.falseFuncBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.elseIfFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.elseIfFuncBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.elseIfFuncBody2 && !isSave) {
                    _json = componentModule.getTarget(json.properties.elseIfFuncBody2);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.forFuncBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.forFuncBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.includeBody && !isSave) {
                    _json = componentModule.getTarget(json.properties.includeBody);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }
                if (json.properties.hoverComponent && !isSave) {
                    _json = componentModule.getTarget(json.properties.hoverComponent);
                    if (Object.keys(_json).length) {
                        if (!isContain(_resultList, _json.meta.name))
                            _resultList.push(_json);
                        _.each(_json.elements, function (element) {
                            searchAndAddsubModule(element);
                        });
                    }
                }

            }
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

            _resultList.push(result);
            return {
                "result": _resultList,
                "name": _name
            }
        },

        exportHTMLCSS: function () {
            var _container = "<div class='m-body-container'></div>",
                _containerId = "";
            var _css = [],
                _name = "example",
                _temp = {},
                _cache = "",
                _cacheCall = "";
            var _cont = _.find(hierarchyModule.elements(), function (element) {
                return (element.isContainer());
            });
            if (_cont) {
                _containerId = _cont.properties.id();
                _temp = _cont.exportHTMLCSS();
                _container = _temp["html"];
                _css.push(_temp["css"]);
                _name = _cont.getName();
            }

            _container = $(_container);
            var _containerA;
            if (_container.find("a").length) {
                _containerA = _container.find("a");
            }
            // 保存umi配置
            var _umi;
            _.each(hierarchyModule.elements(), function (element) {
                if (element.isCache()) {
                    _temp = element.exportCache();
                    _cache += _temp['cacheItem'];
                    _cacheCall += _temp['cacheItemCall'];
                } else if (element.type == "TIMELINE") {
                    // TIMELINE do nothing
                } else if (element.type == "UMI") {
                    _umi = _umi || {
                        "modules": {},
                        "parentM": {},
                        "404": "/"
                    };
                    if (element.properties.id() == "rewrite-404") {
                        _umi["404"] = element.properties.modulePath();
                    } else {
                        _umi["modules"][element.properties.hashPath()] = element.properties.modulePath();
                        _umi["parentM"][element.properties.hashPath()] = element.properties.parentModule();
                    }

                } else if (!element.isContainer()) {

                    if (_containerA) {
                        _temp = element.exportHTMLCSS(_containerId +">a");
                        _containerA.append(_temp["html"]);
                    } else {
                        _temp = element.exportHTMLCSS(_containerId);
                        _container.append(_temp["html"]);
                    }
                    _css.push(_temp["css"]);
                }
            });
            return {
                "html": $("<div></div>").append(_container).html().replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">").replace(/\&amp\;/g, "&").replace(/\&quot\;/g, "\'"),
                "css": _css.join(" "),
                "name": _name,
                "cache": _cache,
                "cacheCall": _cacheCall,
                "umi": _umi
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
    };
    return project;
})
