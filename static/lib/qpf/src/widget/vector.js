//===================================
// Vector widget
// 
// @VMProp  items
// @VMProp  constrainProportion
// @VMProp  constrainType
// @VMProp  constrainRatio
//===================================
define(function(require){

var Widget = require("./widget");
var Base = require("../base");
var XMLParser = require("core/xmlparser");
var ko = require("knockout");
var $ = require("$");
var Spinner = require("../meta/spinner");
var Slider = require("../meta/slider");
var _ = require("_");

var Vector = Widget.derive(function(){
return {

    // data source of item can be spinner type
    // or slider type, distinguish with type field
    // @field type  spinner | slider
    items : ko.observableArray(),

    // set true if you want to constrain the proportions
    constrainProportion : ko.observable(false),

    constrainType : ko.observable("diff"),  //diff | ratio

    _toggleConstrain : function(){
        this.constrainProportion( ! this.constrainProportion() );
    },
    
    // Constrain ratio is only used when constrain type is ratio
    _constrainRatio : [],
    // Constrain diff is only uese when constrain type is diff
    _constrainDiff : [],
    // cache all sub spinner or slider components
    _sub : []
}}, {

    type : "VECTOR",

    css : 'vector',

    initialize : function(){
        this.$el.attr("data-bind", 'css:{"qpf-vector-constrain":constrainProportion}')
        // here has a problem that we cant be notified 
        // if the object in the array is updated
        this.items.subscribe(function(item){
            // make sure self has been rendered
            if( this._$list ){
                this._cacheSubComponents();
                this._updateConstraint();
            }
        }, this);

        this.constrainProportion.subscribe(function(constrain){
            if( constrain ){
                this._computeContraintInfo();
            }
        }, this);
    },

    eventsProvided : _.union(Widget.prototype.eventsProvided, "change"),

    template : '<div class="qpf-left">\
                    <div class="qpf-vector-link" data-bind="click:_toggleConstrain"></div>\
                </div>\
                <div class="qpf-right" >\
                    <ul class="qpf-list" data-bind="foreach:items">\
                        <li data-bind="qpf:$data"></li>\
                    </ul>\
                </div>',

    afterRender : function(){
        // cache the list element
        this._$list = this.$el.find(".qpf-list");

        this._cacheSubComponents();
        this._updateConstraint();
    },

    onResize : function(){
        _.each( this._sub, function(item){
            item.onResize();
        } )
        Widget.prototype.onResize.call(this);
    },

    dispose : function(){
        _.each(this._sub, function(item){
            item.dispose();
        });
        Base.prototype.dispose.call( this );
    },

    _cacheSubComponents : function(){

        var self = this;
        self._sub = [];

        this._$list.children().each(function(){
            
            var component = Base.getByDom(this);
            self._sub.push( component );
        });

        this._computeContraintInfo();
    },

    _computeContraintInfo : function(){
        this._constrainDiff = [];
        this._constrainRatio = [];
        _.each(this._sub, function(sub, idx){
            var next = this._sub[idx+1];
            if( ! next){
                return;
            }
            var value = sub.value(),
                nextValue = next.value();
            this._constrainDiff.push( nextValue-value);

            this._constrainRatio.push(value == 0 ? 1 : nextValue/value);

        }, this);
    },

    _updateConstraint : function(){

        _.each(this._sub, function(sub){

            sub.on("change", this._constrainHandler, this);
        }, this)
    },

    _constrainHandler : function(newValue, prevValue, sub){

        if(this.constrainProportion()){

            var selfIdx = this._sub.indexOf(sub),
                constrainType = this.constrainType();

            for(var i = selfIdx; i > 0; i--){
                var current = this._sub[i].value,
                    prev = this._sub[i-1].value;
                if( constrainType == "diff"){
                    var diff = this._constrainDiff[i-1];
                    prev( current() - diff );
                }else if( constrainType == "ratio"){
                    var ratio = this._constrainRatio[i-1];
                    prev( current() / ratio );
                }

            }
            for(var i = selfIdx; i < this._sub.length-1; i++){
                var current = this._sub[i].value,
                    next = this._sub[i+1].value;

                if( constrainType == "diff"){
                    var diff = this._constrainDiff[i];
                    next( current() + diff );
                }else if( constrainType == "ratio"){
                    var ratio = this._constrainRatio[i];
                    next( current() * ratio );
                }
            }
        }
    }
})

Widget.provideBinding("vector", Vector);

XMLParser.provideParser("vector", function(xmlNode){
    var items = [];
    var children = XMLParser.util.getChildren(xmlNode);
    
    _.chain(children).filter(function(child){
        var tagName = child.tagName && child.tagName.toLowerCase();
        return tagName && (tagName === "spinner" ||
                            tagName === "slider");
    }).each(function(child){
        var attributes = XMLParser.util.convertAttributes(child.attributes);
        attributes.type = child.tagName.toLowerCase();
        items.push(attributes);
    })
    if(items.length){
        return {
            items : items
        }
    }
})

return Vector;

})