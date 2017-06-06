define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Meta = qpf.use("meta/meta");

    var command = require("core/command");
    var contextMenu = require("modules/common/contextmenu");
    var hierarchy = require("modules/hierarchy/index");

    var Viewport = Meta.derive(function () {
        return {
            scale: ko.observable(1.0),
            backColor: ko.observable("#fff")
        }
    }, {
        type: 'VIEWPORT',
        css: "viewport",

        template: '<div class="qpf-viewport-elements-container" ><div id="drawArrow" data-bind="attr: { width: width,height:height}" style="position: absolute;left: 0px;"></div><div id="drawDiagram" data-bind="attr: { width: width,height:height}" style="position: absolute;left: 0px;"></div><div id="drawMockView" data-bind="attr: { width: width,height:height}" style="left: 0px;"></div></div>\
                    <div class="qpf-viewport-ruler-h"></div>\
                    <div class="qpf-viewport-ruler-v"></div>',

        initialize: function () {
            this.scale.subscribe(this._scale, this);
            this._scale(this.scale());
            var _that = this;
            ko.computed({
                read: function () {
                    _that.$el.css({
                        "background-color": _that.backColor()
                    });
                }
            });
            contextMenu.bindTo(this.$el, function (target) {
                var $cmpEl = $(target).parents('.cmp-element');
                if ($cmpEl.length) {

                    var items = [{
                        label: "删除",
                        exec: function () {
                            command.execute("remove", $cmpEl.attr("data-cmp-eid"));
                        }
                    }, {
                        label: "复制",
                        exec: function () {
                            command.execute("copy", $cmpEl.attr("data-cmp-eid"));
                        }
                    }];
                    var eles = hierarchy.selectElementsByEID([$cmpEl.attr("data-cmp-eid")]);
                    if (eles[0] && eles[0].type == "UMI") {
                        items.push({
                            label: "编辑模块代码",
                            exec: function () {
                                hierarchy.editModule(eles[0]);
                            }
                        });
                    }
                    if (eles[0] && eles[0].type == "FUNC" && eles[0].properties.funcType() == "IF") {
                        items.push({
                            label: "增加IF分支",
                            exec: function () {
                                if (eles[0].properties.elseIfSwitch()) {
                                    eles[0].properties.elseIfSwitch2(true);
                                } else {
                                    eles[0].properties.elseIfSwitch(true);
                                }
                            }
                        });
                    }
                    if (eles[0] && eles[0].type == "FUNC" && eles[0].properties.funcType() == "IF" && eles[0].properties.elseIfSwitch()) {
                        items.push({
                            label: "删除IF分支",
                            exec: function () {
                                if (eles[0].properties.elseIfSwitch2()) {
                                    eles[0].properties.elseIfSwitch2(false);
                                } else {
                                    eles[0].properties.elseIfSwitch(false);
                                }
                            }
                        });
                    }
                } else {
                    var items = [];
                }
                items.push({
                    label: "粘贴",
                    exec: function () {
                        var els = command.execute("paste");
                    }
                });
                return items;
            });
        },

        afterRender: function () {
            this._$elementsContainer = this.$el.find(".qpf-viewport-elements-container");
        },

        addElement: function (el, parent) {
            if (parent) {
                parent.append(el.$wrapper);
            } else {
                if (this._$elementsContainer) {
                    this._$elementsContainer.append(el.$wrapper);
                }
            }
        },
        clearAll: function () {
            this.$el.find(".qpf-viewport-elements-container").empty();
        },

        removeElement: function (el) {
            el.$wrapper.remove();
        },

        _scale: function (val) {
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
