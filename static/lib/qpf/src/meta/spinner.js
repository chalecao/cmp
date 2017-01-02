//===================================
// Spinner component
//
// @VMProp step
// @VMProp value
// @VMProp precision
//
// @event change newValue prevValue self[Spinner]
//===================================
define(function(require){

var Meta = require('./meta');
var ko = require("knockout");
var $ = require('$');
var _ = require("_");

function increase(){
	this.value( parseFloat(this.value()) + parseFloat(this.step()) );
}

function decrease(){
	this.value( parseFloat(this.value()) - parseFloat(this.step()) );
}

var Spinner = Meta.derive(function(){
	var ret = {
		step : ko.observable(1),
		valueUpdate : "afterkeydown", //"keypress" "keyup" "afterkeydown"
		precision : ko.observable(2),
		min : ko.observable(null),
		max : ko.observable(null),
		increase : increase,
		decrease : decrease
	}
	ret.value = ko.observable(1).extend({
		numeric : ret.precision,
		clamp : { 
					max : ret.max,
					min : ret.min
				}
	})
	return ret;
}, {
	type : 'SPINNER',

	css : 'spinner',

	initialize : function(){
		var prevValue = this.value() || 0;
		this.value.subscribe(function(newValue){

			this.trigger("change", parseFloat(newValue), parseFloat(prevValue), this);
			prevValue = newValue;
		}, this)
	},

	eventsProvided : _.union(Meta.prototype.eventsProvided, "change"),

	template : '<div class="qpf-left">\
					<input type="text" class="qpf-spinner-value" data-bind="value:value,valueUpdate:valueUpdate" />\
				</div>\
				<div class="qpf-right">\
					<div class="qpf-common-button qpf-increase" data-bind="click:increase">\
					+</div>\
					<div class="qpf-common-button qpf-decrease" data-bind="click:decrease">\
					-</div>\
				</div>',

	afterRender : function(){
		var self = this;
		// disable selection
		this.$el.find('.qpf-increase,.qpf-decrease').mousedown(function(e){
			e.preventDefault();
		})
		this._$value = this.$el.find(".qpf-spinner-value")
		// numeric input only
		this._$value.keydown(function(event){
			// Allow: backspace, delete, tab, escape and dot
			if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 190 ||
				 // Allow: Ctrl+A
				(event.keyCode == 65 && event.ctrlKey === true) || 
				// Allow: home, end, left, right
				(event.keyCode >= 35 && event.keyCode <= 39)) {
				// let it happen, don't do anything
				return;
			}
			else {
				// Ensure that it is a number and stop the keypress
				if ( event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ) ) 
				{
					event.preventDefault(); 
				}
	        }
		})

		this._$value.change(function(){
			// sync the value in the input
			if( this.value !== self.value().toString() ){
				this.value = self.value();
			}
		})

	}
})

Meta.provideBinding('spinner', Spinner);

return Spinner;
})