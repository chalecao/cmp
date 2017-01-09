//===================================
// Textfiled component
//
// @VMProp text
// @VMProp placeholder
//
//===================================
define(function (require) {

    var Meta = require('./meta');
    var ko = require("knockout");
    var _ = require("_");

    var TextField = Meta.derive(function () {
        return {

            tag: "div",

            text: ko.observable(""),

            placeholder: ko.observable("")

        }
    }, {

        type: "TEXTFIELD",

        css: 'textfield',

        template: '<input type="text" data-bind="attr:{placeholder:placeholder}, value:text"/>',
        afterRender: function () {
            var self = this;
            this.$el.keydown(function (event) {
                if (isNaN(+self.text())) {
                    return;
                } else {
                    // up = +  down=-
                    if (event.keyCode == 38) {
                        self.value((+self.text()) + 1);
                    } else if (event.keyCode == 40) {
                        self.value((+self.text()) - 1);
                    }
                }
            });
        },
        onResize: function () {
            this.$el.find("input").width(this.width());
            Meta.prototype.onResize.call(this);
        }
    })

    Meta.provideBinding("textfield", TextField);

    return TextField;
})
