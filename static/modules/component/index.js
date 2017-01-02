define(function(require) {

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

        _selectComponents: function(data) {
            //选中时修改selectedComponents值
            component.selectedComponents(_.map(data, function(item) {
                return item.target;
            }));
            var selectedComponents = component.selectedComponents();
            var subComponent = selectedComponents[selectedComponents.length - 1];
            //加载子组件
            if (subComponent) {
                component.trigger("selectComponent", subComponent);
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
                    label: "插入",
                    exec: function() {
                        command.execute("incertComponent", $uiEl.qpf("get")[0].target());
                    }
                }, {
                    label: "编辑",
                    exec: function() {
                        command.execute("editComponent", $uiEl.qpf("get")[0].target());
                    }
                }]
            } else {
                return [{
                    label: "新建组件",
                    exec: function() {
                        component.trigger("newProject");
                    }
                }, {
                    label: "导入组件",
                    exec: function() {
                        component.trigger("importProject");
                    }
                }]
            }
        });
    });


    return component;
})