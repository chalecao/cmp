//============================
// view model for color
// supply hsv and rgb color space
// http://en.wikipedia.org/wiki/HSV_color_space.
//============================
define(function(require){

var ko = require("knockout");
var Clazz = require("core/clazz");
var _ = require("_");


function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h*360, s*100, v*100];
}

function hsvToRgb(h, s, v){

    h = h/360;
    s = s/100;
    v = v/100;

    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


function intToRgb(value){
    var r = (value >> 16) & 0xff,
        g = (value >> 8) & 0xff,
        b = value & 0xff;
    return [r, g, b];
}

function rgbToInt(r, g, b){
    return r << 16 | g << 8 | b;
}

function intToHsv(value){
    var rgb = intToRgb(value);
    return rgbToHsv(rgb[0], rgb[1], rgb[2]);
}

function hsvToInt(h, s, v){
    return rgbToInt(hsvToRgb(h, s, v));
}

// hsv to rgb is multiple to one
// dependency relationship
// h,s,v(w)------->rgb(r)----->r,g,b(w)
// r,g,b(w)------->hex(r)
// hex(w)------->hsv(w)
// hex(rw)<------->hexString(rw)
//
// so writing hsv will not result circular update
//
var Color = Clazz.derive({
    //--------------------rgb color space
    _r : ko.observable().extend({numeric:0}),
    _g : ko.observable().extend({numeric:0}),
    _b : ko.observable().extend({numeric:0}),
    //--------------------hsv color space
    _h : ko.observable().extend({clamp:{min:0,max:360}}),
    _s : ko.observable().extend({clamp:{min:0,max:100}}),
    _v : ko.observable().extend({clamp:{min:0,max:100}}),
    alpha : ko.observable(1).extend({numeric:2, clamp:{min:0, max:1}})
}, function(){

    this.hex = ko.computed({
        read : function(){
            return rgbToInt( this._r(), this._g(), this._b() );
        },
        write : function(value){
            var hsv = intToHsv(value);
            this._h(hsv[0]);
            this._s(hsv[1]);
            this._v(hsv[2]);
        }
    }, this);

    // bridge of hsv to rgb
    this.rgb = ko.computed({
        read : function(){
            var rgb = hsvToRgb(this._h(), this._s(), this._v());
            this._r(rgb[0]);
            this._g(rgb[1]);
            this._b(rgb[2]);

            return rgb;
        }
    }, this);

    this.hsv = ko.computed(function(){
        return [this._h(), this._s(), this._v()];
    }, this);

    // set rgb and hsv from hex manually
    this.set = function(hex){
        var hsv = intToHsv(hex);
        var rgb = intToRgb(hex);
        this._h(hsv[0]);
        this._s(hsv[1]);
        this._v(hsv[2]);
        this._r(rgb[0]);
        this._g(rgb[1]);
        this._b(rgb[2]);
    }
    //---------------string of hex
    this.hexString = ko.computed({
        read : function(){
            var string = this.hex().toString(16),
                fill = [];
            for(var i = 0; i < 6-string.length; i++){
                fill.push('0');
            }
            return fill.join("")+string;
        },
        write : function(){}
    }, this);

    //-----------------rgb color of hue when value and saturation is 100%
    this.hueRGB = ko.computed(function(){
        return "rgb(" + hsvToRgb(this._h(), 100, 100).join(",") + ")";
    }, this);

    //---------------items data for vector(rgb and hsv)
    var vector = ['_r', '_g', '_b'];
    this.rgbVector = [];
    for(var i = 0; i < 3; i++){
        this.rgbVector.push({
            type : "spinner",
            min : 0,
            max : 255,
            step : 1,
            precision : 0,
            value : this[vector[i]]
        })
    }
    var vector = ['_h', '_s', '_v'];
    this.hsvVector = [];
    for(var i = 0; i < 3; i++){
        this.hsvVector.push({
            type : "spinner",
            min : 0,
            max : 100,
            step : 1,
            precision : 0,
            value : this[vector[i]]
        })
    }
    // modify the hue
    this.hsvVector[0].max = 360;

    // set default 0xffffff
    this.set(0xffffff);
});

Color.intToRgb = intToRgb;
Color.rgbToInt = rgbToInt;
Color.rgbToHsv = rgbToHsv;
Color.hsvToRgb = hsvToRgb;
Color.intToHsv = intToHsv;
Color.hsvToInt = hsvToInt;

return Color;
})