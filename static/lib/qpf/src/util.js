//==========================
// Util.js
// provide util function to operate
// the components
//===========================
define(function(require){

var ko = require("knockout");
var XMLParser = require("core/xmlparser");
var Base = require("./base");
var exports = {};

// Return an array of components created from XML
exports.createComponentsFromXML = function(XMLString, viewModel){

    var dom = XMLParser.parse(XMLString);
    ko.applyBindings(viewModel || {}, dom);
    var ret = [];
    var node = dom.firstChild;
    while(node){
        var component = Base.getByDom(node);
        if( component ){
            ret.push(component);
        }
        node = node.nextSibling;
    }
    return ret;
}

return exports;

})
