define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./property.xml");
    var _ = require("_");

    var PropertyItemView = require("./property");

    var property = new Module({
        name: "property",
        xml: xml,

        layoutProperties: ko.observableArray([]),
        styleProperties: ko.observableArray([]),
        customProperties: ko.observableArray([]),
        funcProperties: ko.observableArray([]),
        eventProperties: ko.observableArray([]),
        timeProperties: ko.observableArray([]),

        showProperties: function (properties) {
            var layoutProperties = [];
            var styleProperties = [];
            var customProperties = [];
            var funcProperties = [];
            var eventProperties = [];
            var timeProperties = [];

            _.each(properties, function (property) {
                if (property.ui) {
                    property.type = property.ui;
                    var config = _.omit(property, 'label', 'ui', 'field', 'visible');
                    var item = {
                        label: property.label,
                        config: ko.observable(config)
                    }
                    if (property.visible) {
                        item.visible = property.visible;
                    }
                   
                    switch (property.field) {
                        case "layout":
                            layoutProperties.push(item);
                            break;
                        case "style":
                            styleProperties.push(item);
                            break;
                        case "func":
                            funcProperties.push(item);
                            break;
                        case "event":
                            eventProperties.push(item);
                            break;
                        case "timeline":
                            timeProperties.push(item);
                            break;
                        default:
                            customProperties.push(item);

                    }
                }
            })

            this.layoutProperties(layoutProperties);
            this.styleProperties(styleProperties);
            this.customProperties(customProperties);
            this.funcProperties(funcProperties);
            this.eventProperties(eventProperties);
            this.timeProperties(timeProperties);
        },

        PropertyItemView: PropertyItemView
    });

    return property;
});
