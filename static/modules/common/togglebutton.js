define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");

    var ToggleButton = qpf.meta.Button.derive(function(){
        return {
            actived : ko.observable(false)
        }
    }, {

        type : "TOGGLEBUTTON",

        css : ["button", "toggle-button"],

        initialize : function(){
            var self = this;
            ko.computed(function(){
                if(this.actived()){
                    self.$el.addClass("active");
                }else{
                    self.$el.removeClass("active");
                }
            });
        }
    });

    qpf.Base.provideBinding("togglebutton", ToggleButton);

    return ToggleButton;
})