//===============================================
// vbox layout
// 
// Items of vbox can have flex and prefer two extra properties
// About this tow properties, can reference to flexbox in css3
// http://www.w3.org/TR/css3-flexbox/
// https://github.com/doctyper/flexie/blob/master/src/flexie.js
// TODO : add flexbox support
//       align 
//      padding ????
//===============================================

define(function(require){

var Container = require("./container");
var Box = require("./box");
var ko = require("knockout");
var $ = require("$");
var _ = require("_");

var vBox = Box.derive(function(){

    return {
    }
}, {

    type : 'VBOX',

    css : 'vbox',

    resizeChildren : function(){

        var flexSum = 0,
            remainderHeight = this.$el.height(),
            childrenWithFlex = [];

            marginCache = [],
            marginCacheWithFlex = [];

        _.each(this.children(), function(child){
            var margin = this._getMargin(child.$el);
            marginCache.push(margin);
            // stretch the width
            // (when align is stretch)
            child.width( this.$el.width()-margin.left-margin.right );

            var prefer = ko.utils.unwrapObservable( child.prefer );

            // item has a prefer size;
            if( prefer ){
                // TODO : if the prefer size is lager than vbox size??
                prefer = Math.min(prefer, remainderHeight);
                child.height( prefer );

                remainderHeight -= prefer+margin.top+margin.bottom;
            }else{
                var flex = parseInt(ko.utils.unwrapObservable( child.flex ) || 1);
                // put it in the next step to compute
                // the height based on the flex property
                childrenWithFlex.push(child);
                marginCacheWithFlex.push(margin);

                flexSum += flex;
            }
        }, this);

        _.each( childrenWithFlex, function(child, idx){
            var margin = marginCacheWithFlex[idx];
            var flex = parseInt(ko.utils.unwrapObservable( child.flex ) || 1),
                ratio = flex / flexSum;
            child.height( Math.floor(remainderHeight*ratio)-margin.top-margin.bottom ); 
        })

        var prevHeight = 0;
        _.each(this.children(), function(child, idx){
            var margin = marginCache[idx];
            child.$el.css({
                "position" : "absolute",
                "left" : '0px', // still set left to zero, use margin to fix the layout
                "top" : prevHeight + "px"
            })
            prevHeight += child.height()+margin.top+margin.bottom;
        })
    }

})


Container.provideBinding("vbox", vBox);

return vBox;

})