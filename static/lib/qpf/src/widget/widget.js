//====================================
// Base class of all widget component
// Widget is component mixed with meta 
// ,containers and other HTMLDOMElenents
//====================================
define(function(require){

var Base = require("../base");
var Meta = require("../meta/meta");
var Container = require("../container/container");
var ko = require("knockout");
var _ = require("_");

var Widget = Base.derive(
{

}, {
    type : "WIDGET",

    css : 'widget'

})

//-------------------------------------------
// Handle bingings in the knockout template
Widget.provideBinding = Base.provideBinding;
Widget.provideBinding("widget", Widget);

return Widget;

})