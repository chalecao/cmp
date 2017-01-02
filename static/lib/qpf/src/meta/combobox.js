//===================================
// Combobox component
// 
// @VMProp  value
// @VMProp  items
//          @property   value
//          @property   text
//===================================
define(function(require){

var Meta = require("./meta");
var XMLParser = require("core/xmlparser");
var ko = require("knockout");
var $ = require("$");
var _ = require("_");

var Combobox = Meta.derive(function(){
return {

    $el : $('<div data-bind="css:{active:active}" tabindex="0"></div>'),

    value : ko.observable(),

    items : ko.observableArray(),   //{value, text}

    defaultText : ko.observable("select"),

    active : ko.observable(false),

}}, {
    
    type : 'COMBOBOX',

    css : 'combobox',

    eventsProvided : _.union(Meta.prototype.eventsProvided, "change"),

    initialize : function(){

        this.selectedText = ko.computed(function(){
            var val = this.value();
            var result =  _.filter(this.items(), function(item){
                return ko.utils.unwrapObservable(item.value) == val;
            })[0];
            if( typeof(result) == "undefined"){
                return this.defaultText();
            }
            return ko.utils.unwrapObservable(result.text);
        }, this);

    },

    template : '<div class="qpf-combobox-selected" data-bind="click:_toggle">\
                    <div class="qpf-left" data-bind="html:selectedText"></div>\
                    <div class="qpf-right qpf-common-button">\
                        <div class="qpf-icon"></div>\
                    </div>\
                </div>\
                <ul class="qpf-combobox-items" data-bind="foreach:items">\
                    <li data-bind="html:text,attr:{\'data-qpf-value\':value},click:$parent._select.bind($parent,value),css:{selected:$parent._isSelected(value)}"></li>\
                </ul>',

    afterRender : function(){

        var self = this;
        this._$selected = this.$el.find(".qpf-combobox-selected");
        this._$items = this.$el.find(".qpf-combobox-items");

        this.$el.blur(function(){
            self._blur();
        })

    },

    //events
    _focus : function(){
        this.active(true);
    },
    _blur : function(){
        this.active(false);
    },
    _toggle : function(){
        this.active( ! this.active() );
    },
    _select : function(value){
        value = ko.utils.unwrapObservable(value);
        this.value(value);
        this._blur();
    },
    _isSelected : function(value){
        return this.value() === ko.utils.unwrapObservable(value);
    }
})

Meta.provideBinding("combobox", Combobox);

XMLParser.provideParser('combobox', function(xmlNode){
    var items = [];
    var nodes = XMLParser.util.getChildrenByTagName(xmlNode, "item");
    _.each(nodes, function(child){
        // Data source can from item tags of the children
        var value = child.getAttribute("value");
        var text = child.getAttribute("text") ||
                    XMLParser.util.getTextContent(child);

        if( value !== null){
            items.push({
                value : value,
                text : text
            })
        }
    })
    if( items.length){
        return {
            items : items
        }
    }
})


return Combobox;

})