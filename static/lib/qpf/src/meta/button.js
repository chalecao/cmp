//======================================
// Button component
//======================================
define(function(require){

var Meta = require("./meta");
var XMLParser = require("core/xmlparser");
var ko = require("knockout");
var $ = require("$");
var _ = require("_");

var Button = Meta.derive(function(){
return {
    $el : $('<button data-bind="html:text"></button>'),
    
    // value of the button
    text : ko.observable('Button')
    
}}, {

    type : 'BUTTON',

    css : 'button',

    afterRender : function(){
        var me = this;
    }
});

Meta.provideBinding("button", Button);

// provide parser when do xmlparsing
XMLParser.provideParser("button", function(xmlNode){
    
    var text = XMLParser.util.getTextContent(xmlNode);
    if(text){
        return {
            text : text
        }
    }
})

return Button;

})