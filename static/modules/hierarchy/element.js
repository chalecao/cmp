define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");

    var Element = qpf.meta.Meta.derive(function(){
        return {
            id : ko.observable(""),
            target : ko.observable()
        }
    }, {

        type : 'ELEMENT',

        css : 'element',

        template : require("text!./element.html"),
        
    });

    return Element;
})