//===================================
// Slider component
// 
// @VMProp value
// @VMProp step
// @VMProp min
// @VMProp max
// @VMProp orientation
// @VMProp format
//
// @method computePercentage
// @method updatePosition   update the slider position manually
// @event change newValue prevValue self[Slider]
//===================================
define(function(require){

var Meta = require("./meta");
var Draggable = require("../helper/draggable");
var ko = require("knockout");
var $ = require("$");
var _ = require("_");

var Slider = Meta.derive(function(){

    var ret =  {

        $el : $('<div data-bind="css:orientation"></div>'),

        step : ko.observable(1),

        min : ko.observable(-100),

        max : ko.observable(100),

        orientation : ko.observable("horizontal"),// horizontal | vertical

        precision : ko.observable(2),

        format : "{{value}}",

        _format : function(number){
            return this.format.replace("{{value}}", number);
        },

        // compute size dynamically when dragging
        autoResize : true
    }

    ret.value = ko.observable(1).extend({
        clamp : { 
                    max : ret.max,
                    min : ret.min
                }
    });

    ret._valueNumeric = ko.computed(function(){
        return ret.value().toFixed(ret.precision());
    })

    ret._percentageStr = ko.computed({
        read : function(){
            var min = ret.min();
            var max = ret.max();
            var value = ret.value();
            var percentage = ( value - min ) / ( max - min );
            
            return percentage * 100 + "%";
        },
        deferEvaluation : true
    })
    return ret;

}, {

    type : "SLIDER",

    css : 'slider',

    template : '<div class="qpf-slider-groove-box">\
                    <div class="qpf-slider-groove">\
                        <div class="qpf-slider-percentage" data-bind="style:{width:_percentageStr}"></div>\
                    </div>\
                </div>\
                <div class="qpf-slider-min" data-bind="text:_format(min())"></div>\
                <div class="qpf-slider-max" data-bind="text:_format(max())"></div>\
                <div class="qpf-slider-control" data-bind="style:{left:_percentageStr}">\
                    <div class="qpf-slider-control-inner"></div>\
                    <div class="qpf-slider-value" data-bind="text:_format(_valueNumeric())"></div>\
                </div>',

    eventsProvided : _.union(Meta.prototype.eventsProvided, "change"),
    
    initialize : function(){
        // add draggable mixin
        Draggable.applyTo( this, {
            axis : ko.computed(function(){
                return this.orientation() == "horizontal" ? "x" : "y"
            }, this)
        });

        var prevValue = this._valueNumeric();
        this.value.subscribe(function(){
            this.trigger("change", this._valueNumeric(), prevValue, this);
            prevValue = this._valueNumeric();
        }, this);
    },

    afterRender : function(){

        // cache the element;
        this._$groove = this.$el.find(".qpf-slider-groove");
        this._$percentage = this.$el.find(".qpf-slider-percentage");
        this._$control = this.$el.find(".qpf-slider-control");

        this.draggable.container = this._$groove;
        var item = this.draggable.add( this._$control );
        
        item.on("drag", this._dragHandler, this);

        // disable text selection
        this.$el.mousedown(function(e){
            e.preventDefault();
        });
    },

    onResize : function(){
        Meta.prototype.onResize.call(this);
    },

    computePercentage : function(){

        if( this.autoResize ){
            this._cacheSize();
        }

        var offset = this._computeOffset();
        return offset / ( this._grooveSize - this._sliderSize );
    },

    _cacheSize : function(){

        // cache the size of the groove and slider
        var isHorizontal =this._isHorizontal();
        this._grooveSize =  isHorizontal ?
                            this._$groove.width() :
                            this._$groove.height();
        this._sliderSize = isHorizontal ?
                            this._$control.width() :
                            this._$control.height();
    },

    _computeOffset : function(){

        var isHorizontal = this._isHorizontal();
        var grooveOffset = isHorizontal ?
                            this._$groove.offset().left :
                            this._$groove.offset().top;
        var sliderOffset = isHorizontal ? 
                            this._$control.offset().left :
                            this._$control.offset().top;

        return sliderOffset - grooveOffset;
    },

    _dragHandler : function(){

        var percentage = this.computePercentage(),
            min = parseFloat( this.min() ),
            max = parseFloat( this.max() ),
            value = (max-min)*percentage+min;

        this.value( value );  
    },

    _isHorizontal : function(){
        return ko.utils.unwrapObservable( this.orientation ) == "horizontal";
    },
})

Meta.provideBinding("slider", Slider);

return Slider;

})
