define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var _ = require("_");


    var ButtonGroup = qpf.container.Inline.derive(function(){
        return {
            action : ko.observable("button"), // button | checkbox | radio
        }
    }, {
        type : "BUTTONGROUP",
        css : "button-group"
    });

    qpf.Base.provideBinding("buttongroup", ButtonGroup);

    return ButtonGroup;
})