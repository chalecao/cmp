define(function (require) {
    var factory = require("core/factory");
    var ko = require("knockout");

    factory.register("select", {
        type: "SELECT",
        extendProperties: function () {
            return {
                options: ko.observable("")
            }
        },
        extendUIConfig: function () {
            return {
                options: {
                    label: "options",
                    ui: "textarea",
                    text: this.properties.options
                }
            }
        },
        onCreate: function ($wrapper) {
            var $text = $("<select style='line-height:normal;display:inline-block;width:100%;'></select>");
            var self = this;

            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append($text);
            } else {
                $wrapper.append($text);
            }

            //Text align
            ko.computed(function () {
                var options = self.properties.options();
                $text.html(options);
            });
        }
    });
});
