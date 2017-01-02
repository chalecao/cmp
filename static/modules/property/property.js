define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var Widget = qpf.widget.Widget;

    var PropertyView = Widget.derive(function(){
        return {
            label : ko.observable(""),
            config : ko.observable()
        }
    }, {
        type : 'PROPERTY',

        css : 'property',

        template : require("text!./property.html")
    })

    return PropertyView;
})