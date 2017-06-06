define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./component.xml");
    var _ = require("_");

    var propertyModule = require("../property/index");
    var contextMenu = require("modules/common/contextmenu");
    var hierarchyModule = require("../hierarchy/index");
    var templateModule = require("../template/index");
    var poolModule = require("../pool/index");

    var Modal = require("modules/common/modal");
    var TextField = qpf.use("meta/textfield");
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
            //切换默认保存，会导致内存泄漏
            // if (hierarchyModule.elements().length) {
            //     component.trigger("saveProject", function () {
            //         component.handleSelect(data);
            //     });
            // } else {
            component.handleSelect(data);
            // }
        },
        handleSelect: function (data) {
            //选中时修改selectedComponents值
            component.selectedComponents(_.map(data, function (item) {
                return item.target;
            }));
            var selectedComponents = component.selectedComponents();
            var subComponent = selectedComponents[selectedComponents.length - 1];
            //加载子组件
            if (subComponent) {
                // if (hierarchyModule.elements().length) {
                // Modal.confirm("提示", "工作区已存在正在编辑组件, 点击确定直接清空！", function () {
                //保存模块

                hierarchyModule.removeAll();

                component.trigger("selectComponent", subComponent);
                if (subComponent.viewport.backColor) {
                    component.trigger("changeBackColor", subComponent.viewport.backColor);
                }
                // }, function () {
                //     component.selectedComponents([]);
                //     //用于清空选择
                //     var _componentList = component.componentsList();
                //     component.componentsList([]);
                //     component.componentsList(_componentList);
                // });
                // } else {
                //     component.trigger("selectComponent", subComponent);
                // }
            }
        },

        load: function (compList) {
            var _componentList = component.componentsList();
            var selectedComponents = component.selectedComponents();
            var subComponent = selectedComponents[selectedComponents.length - 1];
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
                    // Modal.confirm("提示", "工作区已存在组件" + element.meta.name + ", 点击确定替换为新的组件", function () {
                    _.each(_componentList, function (it) {
                        if (it.id == element.meta.name) {
                            it.target = element;
                        }
                    });
                    //选中时修改selectedComponents值
                    if (subComponent && element.meta && (subComponent.meta.name == element.meta.name)) {
                        component.selectedComponents([element]);
                    }

                    // });

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

        },
        clearComponents: function () {
            idStr = "";
            component.componentsList([]);
        }
    });


    component.components = function () {
        return _.map(component.componentsList(), function (item) {
            return item.target;
        });
    }


    component.on("start", function () {

        component.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function (e) {

        });

        contextMenu.bindTo(component.mainComponent.$el, function (target) {
            var $uiEl = $(target).parents(".qpf-ui-element");
            var menuList = [];
            if ($uiEl.length) {
                if ($uiEl[0].id == component.selectedComponents()[0].meta.name) {

                    menuList = [{
                        label: "复制",
                        exec: function () {
                            command.execute("copyComponent", $uiEl.qpf("get")[0].target());
                        }
                    }, {
                        label: "保存到组件池",
                        exec: function () {
                            component.trigger("save2pool", $uiEl.qpf("get")[0].target());
                            //保存过添加颜色标记
                            var _item = $($uiEl[0]);
                            _item.css("color", "#ffeb3b");
                            $(".mainContent").click(function () {
                                _item.css("color", "");
                            });
                            $(".tabContent").click(function () {
                                _item.css("color", "");
                            });
                            $(".propContent").click(function () {
                                _item.css("color", "");
                            });
                        }
                    }, {
                        label: "生成HTML",
                        exec: function () {
                            component.trigger("saveHTML");
                        }
                    }];
                    var _tpls = templateModule.templates();
                    $.each(_tpls, function (_k, _v) {
                        var _hasModel = _.find(_v.templates, function (i) {
                            return !!i.name;
                        });
                        menuList.push({
                            label: _v.name + " 导出",
                            exec: function () {
                                if (_hasModel) {
                                    Modal.confirm("提示", "是否替换模型数据?", function () {
                                        component.trigger("saveCommon", _v, true);
                                    }, function () {
                                        component.trigger("saveCommon", _v, false);
                                    });
                                } else {
                                    component.trigger("saveCommon", _v, true);
                                }
                            }
                        });
                        if (_hasModel) {
                            menuList.push({
                                label: _v.name + " 同步代码到模型",
                                exec: function () {
                                    component.trigger("syncCode", _v);
                                }
                            });
                            menuList.push({
                                label: _v.name + " 编辑代码",
                                exec: function () {
                                    component.trigger("editorJS", _v);
                                }
                            });
                        }
                    });
                    return menuList.concat([{
                        label: "进入BASH控制台",
                        exec: function () {
                            component.trigger("enterShell", $uiEl.qpf("get")[0].target());
                        }
                    }]);
                }
            } else {
                return [{
                    label: "粘贴",
                    exec: function () {
                        command.execute("pasteComponent");
                    }
                }, {
                    label: "新建module",
                    exec: function () {
                        component.trigger("newModule");
                    }
                }, {
                    label: "新建unit",
                    exec: function () {
                        component.trigger("newUnit");
                    }
                }, {
                    label: "导入组件",
                    exec: function () {
                        component.trigger("importProject");

                    }
                }, {
                    label: "导入网络组件",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                text: "",
                                placeholder: "远程组件地址"
                            }
                        });

                        var _modal = Modal.popup("请输入远程组件地址：", _body, function () {
                            if (_body.text()) {
                                component.trigger("importProjectFromUrl", _body.text());
                                var pagePoolUrl = _body.text();
                                if (pagePoolUrl.indexOf("//") >= 0) {
                                    var _name = pagePoolUrl.substring(pagePoolUrl.lastIndexOf("/") + 1, pagePoolUrl.lastIndexOf("."))
                                    poolModule.load([{
                                        "name": _name,
                                        "desc": _name,
                                        "img": "/cmpApp/static/style/images/logo.jpg",
                                        "url": pagePoolUrl,
                                        "postUrl": "/api/" + _name
                                    }]);
                                }
                            }
                        });
                        _body.onEnterKey = function () {
                            _body.$el.blur();
                            _modal.wind.applyButton.trigger("click");
                        }

                    }
                }, {
                    label: "清空列表",
                    exec: function () {
                        component.clearComponents();
                        hierarchyModule.removeAll();
                    }
                }]
            }
        });
    });

    var clipboard = [];
    command.register("copyComponent", {
        execute: function (element) {
            clipboard = [element];
        }
    });
    command.register("pasteComponent", {
        execute: function () {
            var _new = [];
            _.each(clipboard, function (item) {
                var _name = item.meta.name;
                var _item = JSON.parse(JSON.stringify(item).replace(_name + "-container", _name + "_copied" + "-container"))
                _item.meta.name += "_copied";
                _new.push(_item);
            });
            component.load(_new);
        },
        unexecute: function () {

        }
    });

    return component;
})
