define(function(require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Meta = qpf.meta.Meta;
    var onecolor = require("onecolor");

    var palette = require("./palette");

    var Color = Meta.derive(function() {
        var ret = {
            color: ko.observable(0xffffff),
            alpha: ko.observable(1)
        }
        ret._colorStr = ko.computed(function() {
            return onecolor(ret.color()).hex();
        })
        return ret;
    }, {

        type: 'COLOR',

        css: 'color',

        template: '<div data-bind="text:_colorStr" class="qpf-color-hex"></div>\
                    <div class="qpf-color-preview" data-bind="style:{backgroundColor:_colorStr()}"></div>\
                    <div data-bind="text:alpha" class="qpf-color-hex"></div>',

        initialize: function() {
            var self = this;

            this.$el.click(function() {
                self.showPalette();
            });
        },

        showPalette: function() {

            palette.show();

            palette.on("change", this._paletteChange, this);
            palette.on("cancel", this._paletteCancel, this);
            palette.on("apply", this._paletteApply, this);

            palette.set(this.color());
            palette.alpha(this.alpha());
        },

        _paletteChange: function(hex) {
            this.color(hex);
        },
        _paletteCancel: function() {
            palette.hide();
            palette.off("change");
            palette.off("apply");
            palette.off("cancel");
        },
        _paletteApply: function(hex, alpha) {
            this.color(hex);
            this.alpha(alpha);
            this._paletteCancel();
        }
    });

    Meta.provideBinding("color", Color);

    return Color;
})