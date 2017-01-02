//===================================
// Textfiled component
//
// @VMProp text
// @VMProp placeholder
//
//===================================
define(function(require){

var Meta = require('./meta');
var ko = require("knockout");
var _ = require("_");

var TextField = Meta.derive(function(){
return {
    
    tag : "div",

    text : ko.observable(""),
        
    placeholder : ko.observable("")

}}, {
    
    type : "TEXTFIELD",

    css : 'textfield',

    template : '<input type="text" data-bind="attr:{placeholder:placeholder}, value:text"/>',

    onResize : function(){
        this.$el.find("input").width( this.width() );
        Meta.prototype.onResize.call(this);
    }
})

Meta.provideBinding("textfield", TextField);

return TextField;
})