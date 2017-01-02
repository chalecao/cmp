//===================================
// Window componennt
// Window is a panel wich can be drag
// and close
//===================================
define(function(require){

var Container = require("./container");
var Panel = require("./panel");
var Draggable = require("../helper/draggable");
var ko = require("knockout");
var $ = require("$");
var _ = require("_");

var Window = Panel.derive(function(){
    return {

        $el : $('<div data-bind="style:{left:_leftPx, top:_topPx}"></div>'),

        children : ko.observableArray(),
        title : ko.observable("Window"),

        left : ko.observable(0),
        top : ko.observable(0),

        _leftPx : ko.computed(function(){
            return this.left()+"px";
        }, this, {
            deferEvaluation : true
        }),
        _topPx : ko.computed(function(){
            return this.top()+"px";
        }, this, {
            deferEvaluation : true
        })
        
    }
}, {

    type : 'WINDOW',

    css : _.union('window', Panel.prototype.css),

    initialize : function(){
        Draggable.applyTo( this );
        
        Panel.prototype.initialize.call( this );
    },

    afterRender : function(){
        
        Panel.prototype.afterRender.call( this );

        this.draggable.add( this.$el, this._$header);
        
    }
})

Container.provideBinding("window", Window);

return Window;

})
