//=============================================================
// application.js
// 
// Container of the whole web app, mainly for monitor the resize
// event of Window and resize all the component in the app
//=============================================================

define(function(require){

var Container = require("./container");
var ko = require("knockout");
var $ = require("$");

var Application = Container.derive(function(){

}, {

    type : "APPLICATION",
    
    css : "application",

    initialize : function(){

        $(window).resize( this._resize.bind(this) );
        this._resize();
    },

    _resize : function(){
        this.width( $(window).width() );
        this.height( $(window).height() );
    }
})

Container.provideBinding("application", Application);

return Application;

})