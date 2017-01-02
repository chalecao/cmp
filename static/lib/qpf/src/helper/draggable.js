//=================================
// mixin to provide draggable interaction
// support multiple selection
//
// @property    helper
// @property    axis "x" | "y"
// @property    container
// @method      add( target[, handle] )
// @method      remove( target )
//=================================

define(function(require){

var Derive = require("core/mixin/derive");
var Event = require("core/mixin/event");
var ko = require("knockout");
var $ = require("$");
var _ = require("_");

var Clazz = new Function();
_.extend(Clazz, Derive);
_.extend(Clazz.prototype, Event);

//---------------------------------
var DraggableItem = Clazz.derive(function(){
return {

    id : 0,

    target : null,

    handle : null,

    margins : {},

    // original position of the target relative to 
    // its offsetParent, here we get it with jQuery.position method
    originPosition : {},

    // offset of the offsetParent, which is get with jQuery.offset
    // method
    offsetParentOffset : {},
    // cache the size of the draggable target
    width : 0,
    height : 0,
    // save the original css position of dragging target
    // to be restored when stop the drag
    positionType : "",
    //
    // data to be transferred
    data : {},

    // instance of [Draggable]
    host : null
}}, {
    
    setData : function( data ){

    },

    remove : function(){
        this.host.remove( this.target );
    }
});

//--------------------------------
var Draggable = Clazz.derive(function(){
    return {

        items : {}, 

        axis : null,

        // the container where draggable item is limited
        // can be an array of boundingbox or HTMLDomElement or jquery selector
        container : null,

        helper : null,

        //private properties
        // boundingbox of container compatible with getBoundingClientRect method
        _boundingBox : null,

        _mouseStart : {},
        _$helper : null

    }
}, {

add : function( elem, handle ){
    
    var id = genGUID(),
        $elem = $(elem);
    if( handle ){
        var $handle = $(handle);
    }

    $elem.attr( "data-qpf-draggable", id )
        .addClass("qpf-draggable");
    
    (handle ? $(handle) : $elem)
        .unbind("mousedown", this._mouseDown)
        .bind("mousedown", {context:this}, this._mouseDown);

    var newItem = new DraggableItem({
        id : id,
        target : elem,
        host : this,
        handle : handle
    })
    this.items[id] = newItem;

    return newItem;
},

remove : function( elem ){

    if( elem instanceof DraggableItem){
        var item = elem,
            $elem = $(item.elem),
            id = item.id;
    }else{
        var $elem = $(elem),
            id = $elem.attr("data-qpf-draggable");
        
        if( id  ){
            var item = this.items[id];
        }
    }   
    delete this.items[ id ];

    
    $elem.removeAttr("data-qpf-draggable")
        .removeClass("qpf-draggable");
    // remove the events binded to it
    (item.handle ? $(item.handle) : $elem)
        .unbind("mousedown", this._mouseDown);
},

clear : function(){

    _.each(this.items, function(item){
        this.remove( item.target );
    }, this);
},

_save : function(){

    _.each(this.items, function(item){

        var $elem = $(item.target);
        var $offsetParent = $elem.offsetParent();
        var position = $elem.position();
        var offsetParentOffset = $offsetParent.offset();
        var margin = {
                left : parseInt($elem.css("marginLeft")) || 0,
                top : parseInt($elem.css("marginTop")) || 0
            };

        item.margin = margin;
        // fix the position with margin
        item.originPosition = {
            left : position.left - margin.left,
            top : position.top - margin.top
        },
        item.offsetParentOffset = offsetParentOffset;
        // cache the size of the dom element
        item.width = $elem.width(),
        item.height = $elem.height(),
        // save the position info for restoring after drop
        item.positionType = $elem.css("position");

    }, this);

},

_restore : function( restorePosition ){

    _.each( this.items, function(item){

        var $elem = $(item.target);
        var position = $elem.offset();

        $elem.css("position", item.positionType);

        if( restorePosition ){
            $elem.offset({
                left : item.originPosition.left + item.margin.left,
                top : item.originPosition.top + item.margin.top
            })
        }else{
            $elem.offset(position);
        }
    }, this);
},

_mouseDown : function(e){
    
    if( e.which !== 1){
        return;
    }

    var self = e.data.context;
    //disable selection
    e.preventDefault();

    self._save();

    self._triggerProxy("dragstart", e);

    if( ! self.helper ){

        _.each( self.items, function(item){
            
            var $elem = $(item.target);

            $elem.addClass("qpf-draggable-dragging");

            $elem.css({
                "position" : "absolute",
                "left" : (item.originPosition.left)+"px",
                "top" : (item.originPosition.top)+"px"
            });

        }, self);

        if( self.container ){
            self._boundingBox = self._computeBoundingBox( self.container );
        }else{
            self._boundingBox = null;
        }

    }else{

        self._$helper = $(self.helper);
        document.body.appendChild(self._$helper[0]);
        self._$helper.css({
            left : e.pageX,
            top : e.pageY
        })
    }

    $(document.body)
        .unbind("mousemove", self._mouseMove)
        .bind("mousemove", {context:self}, self._mouseMove )
        .unbind("mouseout", self._mouseOut)
        .bind("mouseout", {context:self}, self._mouseOut )
        .unbind('mouseup', self._mouseUp)
        .bind("mouseup", {context:self}, self._mouseUp );

    self._mouseStart = {
        x : e.pageX,
        y : e.pageY
    };

},

_computeBoundingBox : function(container){

    if( _.isArray(container) ){

        return {
            left : container[0][0],
            top : container[0][1],
            right : container[1][0],
            bottom : container[1][1]
        }

    }else if( container.left && 
                container.right &&
                container.top &&
                container.bottom ) {

        return container;
    }else{
        // using getBoundingClientRect to get the bounding box
        // of HTMLDomElement
        try{
            var $container = $(container);
            var offset = $container.offset();
            var bb = {
                left : offset.left + parseInt($container.css("padding-left")) || 0,
                top : offset.top + parseInt($container.css("padding-top")) || 0,
                right : offset.left + $container.width() - parseInt($container.css("padding-right")) || 0,
                bottom : offset.top + $container.height() - parseInt($container.css("padding-bottom")) || 0
            };
            
            return bb;
        }catch(e){
            console.error("Invalid container type");
        }
    }

},

_mouseMove : function(e){

    var self = e.data.context;

    var offset = {
        x : e.pageX - self._mouseStart.x,
        y : e.pageY - self._mouseStart.y
    }

    if( ! self._$helper){

        _.each( self.items, function(item){
            // calculate the offset position to the document
            var left = item.originPosition.left + item.offsetParentOffset.left + offset.x,
                top = item.originPosition.top + item.offsetParentOffset.top + offset.y;
            // constrained in the area of container
            if( self._boundingBox ){
                var bb = self._boundingBox;
                left = left > bb.left ? 
                                (left+item.width < bb.right ? left : bb.right-item.width)
                                 : bb.left;
                top = top > bb.top ? 
                            (top+item.height < bb.bottom ? top : bb.bottom-item.height)
                            : bb.top;
            }

            var axis = ko.utils.unwrapObservable(self.axis);
            if( !axis || axis.toLowerCase() !== "y"){
                $(item.target).css("left", left - item.offsetParentOffset.left + "px");
            }
            if( !axis || axis.toLowerCase() !== "x"){
                $(item.target).css("top", top - item.offsetParentOffset.top + "px");
            }

        }, self );


    }else{

        self._$helper.css({
            "left" : e.pageX,
            "top" : e.pageY
        })
    };

    self._triggerProxy("drag", e);
},

_mouseUp : function(e){

    var self = e.data.context;

    $(document.body).unbind("mousemove", self._mouseMove)
        .unbind("mouseout", self._mouseOut)
        .unbind("mouseup", self._mouseUp)

    if( self._$helper ){

        self._$helper.remove();
    }else{

        _.each(self.items, function(item){

            var $elem = $(item.target);

            $elem.removeClass("qpf-draggable-dragging");

        }, self)
    }
    self._restore();

    self._triggerProxy("dragend", e);
},

_mouseOut : function(e){
    // PENDING
    // this._mouseUp.call(this, e);
},

_triggerProxy : function(){
    var args = arguments;
    _.each(this.items, function(item){
        item.trigger.apply(item, args);
    });

    this.trigger.apply(this, args);
}

});


var genGUID = (function(){
    var id = 1;
    return function(){
        return id++;
    }
}) ();

Draggable.applyTo = function(target, options){
    target.draggable = new Draggable(options);        
}
return Draggable;

})