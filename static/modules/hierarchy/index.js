define(function(require) {

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

        _selectElements: function(data) {
            // selectedElements赋值
            hierarchy.selectedElements(_.map(data, function(item) {
                return item.target;
            }));
        },

        selectElementsByEID: function(eidList) {
            var elements = [];
            _.each(eidList, function(eid) {
                var el = componentFactory.getByEID(eid);
                if (el) {
                    elements.push(el);
                }
            });
            hierarchy.selectedElements(elements);
        },

        load: function(elementsList) {
            this.removeAll();
            this.elementsList(_.map(elementsList, function(element) {
                return {
                    id: element.properties.id,
                    target: element
                }
            }));
            _.each(elementsList, function(element) {
                hierarchy.trigger("create", element);
            })
        },
        removeAll: function() {

            _.each(this.elementsList(), function(element) {
                command.execute("remove", element.target);
            })
        }
    });



    hierarchy.elements = ko.computed({
        read: function() {
            return _.map(hierarchy.elementsList(), function(item) {
                return item.target;
            });
        },
        deferEvaluation: true
    });

    hierarchy.on("start", function() {
        hierarchy.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function(e) {
            hierarchy.trigger("focus", $(this).qpf("get")[0].target());
        });

        contextMenu.bindTo(hierarchy.mainComponent.$el, function(target) {
            var $uiEl = $(target).parents(".qpf-ui-element");
            if ($uiEl.length) {
                return [{
                    label: "删除",
                    exec: function() {
                        command.execute("remove", $uiEl.qpf("get")[0].target());
                    }
                }, {
                    label: "复制",
                    exec: function() {
                        command.execute("copy", $uiEl.qpf("get")[0].target());
                    }
                }, {
                    label: "hover",
                    exec: function() {
                        command.execute("copy", $uiEl.qpf("get")[0].target());
                    }
                }]
            } else {
                return [{
                    label: "粘贴",
                    exec: function() {
                        var els = command.execute("paste");
                    }
                }]
            }
        });
    });

    ko.computed(function() {
        var selectedElements = hierarchy.selectedElements();
        var element = selectedElements[selectedElements.length - 1];
        if (element) {
            propertyModule.showProperties(element.uiConfig);
        }
        hierarchy.trigger("select", selectedElements);
    });

    // Register commands
    command.register("create", {
        execute: function(name, properties) {
            var element = componentFactory.create(name, properties);

            hierarchy.elementsList.push({
                id: element.properties.id,
                target: element
            });

            // Dispatch create event, in viewport/index.js
            hierarchy.trigger("create", element);

            hierarchy.selectedElements([element]);
        },
        unexecute: function(name, properties) {

        }
    });

    command.register("remove", {
        execute: function(element) {
            if (typeof(element) === "string") {
                element = componentFactory.getByEID(element);
            }
            componentFactory.remove(element);

            hierarchy.elementsList(_.filter(hierarchy.elementsList(), function(data) {
                return data.target !== element;
            }));
            hierarchy.selectedElements.remove(element);
            propertyModule.showProperties([]);

            hierarchy.trigger("remove", element);
        },
        unexecute: function() {

        }
    });

    command.register("removeselected", {
        execute: function() {

        },
        unexecute: function() {

        }
    })


    var clipboard = [];
    command.register("copy", {
        execute: function(element) {
            if (typeof(element) === "string") {
                element = componentFactory.getByEID(element);
            }
            clipboard = [element];
        }
    });

    command.register("copyselected", {
        execute: function() {

        }
    })

    command.register("paste", {
        execute: function() {
            var res = [];
            _.each(clipboard, function(item) {
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
        unexecute: function() {

        }
    });


    return hierarchy;
})
