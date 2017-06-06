/**
 * Textfiled component
 *
 * @VMProp text
 * @VMProp placeholder
 *
 */
define(function (require) {

    var qpf = require("qpf");
    var Meta = qpf.use("meta/meta");
    var ko = require("knockout");
    var _ = require("_");

    var TextArea = Meta.derive(function () {
        return {
            tag: "div",

            text: ko.observable(""),

            placeholder: ko.observable("")
        };
    }, {

        type: "TEXTAREA",

        css: 'textarea',

        template: '<textarea rows="5" cols="24" data-bind="value:text"/>',

        onResize: function () {
            this.$el.find("textarea").width(this.width());
            Meta.prototype.onResize.call(this);
        }
    })

    Meta.provideBinding("textarea", TextArea);

    return TextArea;
})
