//======================================
// Checkbox component
//======================================
define(function(require){

var Meta = require("./meta");
var ko = require('knockout');
var $ = require("$");
var _ = require("_");

var Checkbox = Meta.derive(function(){
return {
    
    // value of the button
    checked : ko.observable(false),
    label : ko.observable("")
    
}}, {

    template : '<input type="checkbox" data-bind="checked:checked" />\
                <span data-bind="css:{checked:checked}"></span>\
                <label data-bind="text:label"></label>',

    type : 'CHECKBOX',
    css : 'checkbox',

    // binding events
    afterRender : function(){
        var self = this;
        this.$el.click(function(){
            self.checked( ! self.checked() );
        })
    }
});

Meta.provideBinding("checkbox", Checkbox);

return Checkbox;

})  