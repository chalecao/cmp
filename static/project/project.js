define(function (require) {

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

                element.on("addHoverComponent", function (_componentName, _parentElement) {
                    var _elments = [];
                    _.each(componentModule.components(), function (item, key) {
                        if (item["meta"]["name"] == _componentName) {
                            _elments = item["elements"];
                            var elements = [];
                            _.each(_elments, function (item) {
                                var element = factory.create(item.type.toLowerCase(), {
                                    "id": item.properties.id
                                });
                                element.import(item);
                                elements.push(element);
                            });

                            var _container;
                            _.each(elements, function (item1, key1) {
                                //判断是不是container
                                if (item1.$wrapper.css("position") == "relative") {
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
                                if (item1.$wrapper.css("position") != "relative") {
                                    viewportModule.getViewPort().addElement(item1, _container);
                                }

                            });
                        }
                    });
                });

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
                                element.import(item);
                                elements.push(element);
                            });

                            var _container;
                            _.each(elements, function (item1, key1) {
                                //判断是不是container
                                if (item1.$wrapper.css("position") == "relative") {
                                    if (item1.$wrapper.find("a").children().length < 1) {
                                        item1.$wrapper.find("a").remove();
                                    }
                                    if (!item1.$wrapper.find("a").attr("href")) {
                                        item1.$wrapper.html(item1.$wrapper.find("a").html());
                                    }

                                    _container = item1.$wrapper;
                                    viewportModule.getViewPort().addElement(item1, _parentElement);
                                }

                            });
                            _.each(elements, function (item1, key1) {
                                //判断是不是container
                                if (item1.$wrapper.css("position") != "relative") {
                                    if (item1.$wrapper.find("a").children().length < 1) {
                                        item1.$wrapper.find("a").remove();
                                    }
                                    if (!item1.$wrapper.find("a").attr("href")) {
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
            }
            //存储所有的组件，包含子组件
            var _resultList = [];
            _.each(hierarchyModule.elements(), function (element) {
                var json = element.export(),
                    _json = "",
                    _compo = json.properties.hoverComponent;
                //判断是导出项目还是保存项目
                if (_compo && !isSave) {
                    _resultList.push(componentModule.getTarget(_compo));
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
                    return;
                }
            });
            _container = $(_container);
            _.each(hierarchyModule.elements(), function (element) {
                if (element.isCache()) {
                    _temp = element.exportCache();
                    _cache += _temp['cacheItem'];
                    _cacheCall += _temp['cacheItemCall'];
                } else if (!element.isContainer()) {
                    _temp = element.exportHTMLCSS();
                    _container.append(_temp["html"]);
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
                _left = 0;
            _.each(hierarchyModule.elements(), function (element) {
                if (element.isContainer()) {
                    element.setPosition("relative");
                    _top = element.getTop();
                    _left = element.getLeft();
                    element.setTop(0);
                    element.setLeft(0);
                    return;
                }
            });
            _.each(hierarchyModule.elements(), function (element) {
                if (!element.isContainer()) {
                    element.setTop(element.getTop() - _top);
                    element.setLeft(element.getLeft() - _left);
                }
            });
        }
    }
})
