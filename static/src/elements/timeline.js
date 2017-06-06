/**
 * 时序图结点，主要用于创建时序图
 * 
 */
define(function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    var _ = require("_");
    require("sequence");

    factory.register("timeline", {
        type: "TIMELINE",
        extendProperties: function () {
            return {
                timelineCode: ko.observable("")

            }
        },
        extendUIConfig: function () {
            return {
                timelineCode: {
                    label: "时序图",
                    ui: "codearea",
                    field: "timeline",
                    text: this.properties.timelineCode
                }

            }
        },
        refreshDiagram: function (_str) {
            $("#drawDiagram").text(_str);
            $("#drawDiagram").sequenceDiagram({
                theme: 'simple'
            });
        },
        onCreate: function ($wrapper) {
            var self = this;

            self.properties.width(800);
            self.properties.height(600);

            //Font size and text color
            ko.computed(function () {
                self.refreshDiagram("");
                var timelineCode = self.properties.timelineCode();
                self.refreshDiagram(timelineCode);
            });


        }
    });
});
