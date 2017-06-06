define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./hierarchy.xml");
    var _ = require("_");

    var propertyModule = require("../property/index");
    var dataModule = require("../dataMock/index");
    var contextMenu = require("modules/common/contextmenu");

    var Modal = require("modules/common/modal");
    var TextField = qpf.use("meta/textfield");
    var Container = qpf.use("container/container");
    var Inline = qpf.use("container/inline");
    var Label = qpf.use("meta/label");
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
            return elements;
        },

        load: function (elementsList) {
            console.log("开始绘制元素");
            this.removeAll();

            this.elementsList(_.map(elementsList, function (element) {
                return {
                    id: element.properties.id,
                    typeStr: element.type.toLowerCase(),
                    target: element
                }
            }));
            _.each(elementsList, function (element) {
                hierarchy.trigger("create", element);
            });

            dataModule.detect2Mock();

        },
        refreshList: function () {

            var elementsList = hierarchy.elements();
            this.removeAll();

            this.elementsList(_.map(elementsList, function (element) {
                return {
                    id: element.properties.id,
                    typeStr: element.type.toLowerCase(),
                    target: element
                }
            }));
            _.each(elementsList, function (element) {
                hierarchy.trigger("create", element);
            });


        },
        loadElement: function (element) {

            var _ele = _.find(this.elementsList(), function (item) {
                return item.id() == element.properties.id
            });
            if (_ele) {
                _ele.target.properties.moduleHTML(element.properties.moduleHTML);
                _ele.target.properties.moduleJS(element.properties.moduleJS);
            } else {
                hierarchy.trigger("create", element);
            }
        },
        removeAll: function () {

            $(".qpf-viewport-elements-container .cmp-element").remove();
            //清空UMI和时序图

            $("#drawArrow svg line").remove();
            $("#drawDiagram").empty();
            $("#drawArrow").hide();
            $("#drawDiagram").css("opacity", 0);
        }
    });

    hierarchy.editModule = function (_ele) {
        hierarchy.trigger("editModule", _ele);
    }

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
                var _contexMenu = [{
                    label: "删除",
                    exec: function () {
                        command.execute("remove", $uiEl.qpf("get")[0].target());
                    }
                }, {
                    label: "复制",
                    exec: function () {
                        command.execute("copy", $uiEl.qpf("get")[0].target());
                    }
                }, {
                    label: "保存为独立组件",
                    exec: function () {
                        hierarchy.trigger("saveElement", function () {
                            command.execute("remove", $uiEl.qpf("get")[0].target());
                        });

                    }
                }];
                //判断是第几个元素
                var _i = -1;
                _.find(hierarchy.elementsList(), function (item) {
                    _i++;
                    return item.id() == $uiEl.qpf("get")[0].target().properties.id();
                });
                if (_i > 0) {
                    _contexMenu.push({
                        label: "上移",
                        exec: function () {
                            command.execute("upElement", _i);
                        }
                    })
                }
                if (_i < hierarchy.elementsList().length - 1) {
                    _contexMenu.push({
                        label: "下移",
                        exec: function () {
                            command.execute("downElement", _i);
                        }
                    })
                };
                return _contexMenu;
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
            //判断是第几个元素
            var _i = 0;
            _.find(hierarchy.elementsList(), function (item) {
                _i++;
                return item.id() == element.properties.id();
            });
            //触发选中对应的tag
            if (element.type == "UMI" || (element.type == "FUNC" && element.properties.funcType() == "CACHE")) {
                $(".switchDesign .umi").trigger("click");
            } else if (element.type == "TIMELINE") {
                $(".switchDesign .timeline").trigger("click");
            } else {
                $(".switchDesign .page").trigger("click");
            }
            $($("#Hierarchy .qpf-ui-list .qpf-container-item")[--_i]).trigger("click");
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
    command.register("upElement", {
        execute: function (index) {
            hierarchy.elementsList().splice(index - 1, 0, hierarchy.elementsList()[index]);
            hierarchy.elementsList().splice(index + 1, 1);
            hierarchy.elementsList(hierarchy.elementsList());
            hierarchy.trigger("saveProject");
        },
        unexecute: function () {

        }
    });
    command.register("downElement", {
        execute: function (index) {
            hierarchy.elementsList().splice(index + 2, 0, hierarchy.elementsList()[index]);
            hierarchy.elementsList().splice(index, 1);
            hierarchy.elementsList(hierarchy.elementsList());
            hierarchy.trigger("saveProject");
        },
        unexecute: function () {

        }
    });
    command.register("remove", {
        execute: function (element) {
            //删除元素,如果是umi，删除umi箭头
            if (typeof (element) === "string") {
                element = componentFactory.getByEID(element);
            }
            componentFactory.remove(element);

            // hierarchy.elementsList(_.filter(hierarchy.elementsList(), function (data) {
            //     return data.target !== element;
            // }));
            hierarchy.selectedElements.remove(element);
            hierarchy.elementsList.remove(function (item) {
                return item.id() == element.properties.id()
            });
            hierarchy.refreshList();


            propertyModule.showProperties([]);

            hierarchy.trigger("remove", element);
            if (element.type == "UMI") {
                $(element.pointLine[0]).remove()
            }
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
    });


    command.register("paste", {
        execute: function () {

            function execPaste(index) {
                var res = [];
                _.each(clipboard, function (item) {
                    var el = componentFactory.clone(item);
                    if (index >= 0) {
                        hierarchy.elementsList.splice(index, 0, {
                            target: el,
                            id: el.properties.id
                        });
                    } else {
                        hierarchy.elementsList.push({
                            target: el,
                            id: el.properties.id
                        });
                    }
                    hierarchy.trigger("create", el);

                    res.push(el);
                });
                hierarchy.selectedElements(res);
                return res;
            }
            var _body = new Container();
            var _inLine1 = new Inline();
            _inLine1.add(
                new Label({
                    attributes: {
                        text: "插入位置："
                    }
                })
            );
            var _desc = new TextField({
                attributes: {
                    placeholder: "默认插入最后"
                }
            });
            _inLine1.add(_desc);
            _body.add(_inLine1);
            Modal.popup("请输入相关内容", _body, function () {
                var _pos = parseInt(_desc.text());
                execPaste(_pos);
            }, function () {
                execPaste(-1);
            });
        },
        unexecute: function () {

        }
    });


    return hierarchy;
})
