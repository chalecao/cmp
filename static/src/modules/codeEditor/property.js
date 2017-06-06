define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Container = qpf.use("container/container");
    var Widget = qpf.widget.Widget;

    var Codeview = Widget.derive(function () {
        return {
            codeStr: ko.observable(""),
            classStr: ko.observable(""),
            titleStr: ko.observable("")
        }
    }, {
        type: 'CODEVIEW',

        css: 'codeview',

        template: require("text!./property.html"),

    })
    Container.provideBinding("codeview", Codeview);
    return Codeview;
})
