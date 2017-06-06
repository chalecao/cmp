define(function(require){

    var qpf = require("qpf");
    var IconButton = require("./iconbutton");
    var ko = require("knockout");

    var ToggleIconButton = IconButton.derive(function(){
        return {
            actived : ko.observable(false)
        }
    }, {

        type : "TOGGLEICONBUTTON",

        css : ["button", "icon-button", "toggle-icon-button"],

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

    qpf.Base.provideBinding("toggleiconbutton", ToggleIconButton);

    return ToggleIconButton;
})