//=============================================
// Palette
//=============================================
define(function (require) {

    var Widget = require("./widget");
    var ko = require("knockout");
    var Color = require("./color_vm");
    var $ = require("$");
    var _ = require("_");

    // component will be used in the widget
    require("widget/vector");
    require("meta/textfield");
    require("meta/slider");

    var Palette = Widget.derive(function () {
        var ret = new Color;
        var self = this;

        _.extend(ret, {
            _recent: ko.observableArray(),
            _recentMax: 5
        })
        return ret;
    }, {

        type: 'PALETTE',

        css: 'palette',

        eventsProvided: _.union(Widget.prototype.eventsProvided, ['change', 'apply']),

        template: '<div class="qpf-palette-adjuster">\
                    <div class="qpf-left">\
                        <div class="qpf-palette-picksv" data-bind="style:{backgroundColor:hueRGB}">\
                            <div class="qpf-palette-saturation">\
                                <div class="qpf-palette-value"></div>\
                            </div>\
                            <div class="qpf-palette-picker"></div>\
                        </div>\
                        <div class="qpf-palette-pickh">\
                            <div class="qpf-palette-picker"></div>\
                        </div>\
                        <div style="clear:both"></div>\
                        <div class="qpf-palette-alpha">\
                            <div class="qpf-palette-alpha-slider" data-bind="qpf:{type:\'slider\', min:0, max:1, value:alpha, precision:2}"></div>\
                        </div>\
                    </div>\
                    <div class="qpf-right">\
                        <div class="qpf-palette-rgb">\
                            <div data-bind="qpf:{type:\'label\', text:\'RGB\'}"></div>\
                            <div data-bind="qpf:{type:\'vector\', items:rgbVector}"></div>\
                        </div>\
                        <div class="qpf-palette-hsv">\
                            <div data-bind="qpf:{type:\'label\', text:\'HSV\'}"></div>\
                            <div data-bind="qpf:{type:\'vector\', items:hsvVector}"></div>\
                        </div>\
                        <div class="qpf-palette-hex">\
                            <div data-bind="qpf:{type:\'label\', text:\'#\'}"></div>\
                            <div data-bind="qpf:{type:\'textfield\',text:hexString}"></div>\
                        </div>\
                    </div>\
                </div>\
                <div style="clear:both"></div>\
                <ul class="qpf-palette-recent" data-bind="foreach:_recent">\
                    <li data-bind="style:{backgroundColor:rgbString},\
                                    attr:{title:hexString},\
                                    click:$parent.hex.bind($parent, hex)"></li>\
                </ul>\
                <div class="qpf-palette-buttons">\
                    <div data-bind="qpf:{type:\'button\', text:\'Cancel\', class:\'small\', onclick:_cancel.bind($data)}"></div>\
                    <div data-bind="qpf:{type:\'button\', text:\'Apply\', class:\'small\', onclick:_apply.bind($data)}"></div>\
                </div>',

        initialize: function () {
            this.hsv.subscribe(function (hsv) {
                this._setPickerPosition();
                this.trigger("change", this.hex());
            }, this);
            // incase the saturation and value is both zero or one, and
            // the rgb value not change when hue is changed
            this._h.subscribe(this._setPickerPosition, this);
        },
        afterRender: function () {
            this._$svSpace = $('.qpf-palette-picksv');
            this._$hSpace = $('.qpf-palette-pickh');
            this._$svPicker = this._$svSpace.children('.qpf-palette-picker');
            this._$hPicker = this._$hSpace.children('.qpf-palette-picker');

            this._svSize = this._$svSpace.height();
            this._hSize = this._$hSpace.height();

            this._setPickerPosition();
            this._setupSvDragHandler();
            this._setupHDragHandler();
        },
        onResize: function () {
            var $slider = this.$el.find(".qpf-palette-alpha-slider");
            if ($slider.length) {
                $slider.qpf("get")[0].onResize();
            }

            Widget.prototype.onResize.call(this);
        },

        _setupSvDragHandler: function () {
            var self = this;

            var _getMousePos = function (e) {
                var offset = self._$svSpace.offset(),
                    left = e.pageX - offset.left,
                    top = e.pageY - offset.top;
                return {
                    left: left,
                    top: top
                }
            };
            var _mouseMoveHandler = function (e) {
                var pos = _getMousePos(e);
                self._computeSV(pos.left, pos.top);
            }
            var _mouseUpHandler = function (e) {
                $(document.body).unbind("mousemove", _mouseMoveHandler)
                    .unbind("mouseup", _mouseUpHandler)
                    .unbind('mousedown', _disableSelect);
            }
            var _disableSelect = function (e) {
                e.preventDefault();
            }
            this._$svSpace.mousedown(function (e) {
                var pos = _getMousePos(e);
                self._computeSV(pos.left, pos.top);

                $(document.body).bind("mousemove", _mouseMoveHandler)
                    .bind("mouseup", _mouseUpHandler)
                    .bind("mousedown", _disableSelect);
            })
        },

        _setupHDragHandler: function () {
            var self = this;

            var _getMousePos = function (e) {
                var offset = self._$hSpace.offset(),
                    top = e.pageY - offset.top;
                return top;
            };
            var _mouseMoveHandler = function (e) {
                self._computeH(_getMousePos(e));
            };
            var _disableSelect = function (e) {
                e.preventDefault();
            }
            var _mouseUpHandler = function (e) {
                $(document.body).unbind("mousemove", _mouseMoveHandler)
                    .unbind("mouseup", _mouseUpHandler)
                    .unbind('mousedown', _disableSelect);
            }

            this._$hSpace.mousedown(function (e) {
                self._computeH(_getMousePos(e));

                $(document.body).bind("mousemove", _mouseMoveHandler)
                    .bind("mouseup", _mouseUpHandler)
                    .bind("mousedown", _disableSelect);
            })

        },

        _computeSV: function (left, top) {
            var saturation = left / this._svSize,
                value = (this._svSize - top) / this._svSize;

            this._s(saturation * 100);
            this._v(value * 100);
        },

        _computeH: function (top) {

            this._h(top / this._hSize * 360);
        },

        _setPickerPosition: function () {
            if (this._$svPicker) {
                var hsv = this.hsv(),
                    hue = hsv[0],
                    saturation = hsv[1],
                    value = hsv[2];

                // set position relitave to space
                this._$svPicker.css({
                    left: Math.round(saturation / 100 * this._svSize) + "px",
                    top: Math.round((100 - value) / 100 * this._svSize) + "px"
                })
                this._$hPicker.css({
                    top: Math.round(hue / 360 * this._hSize) + "px"
                })
            }
        },

        _apply: function () {
            if (this._recent().length > this._recentMax) {
                this._recent.shift();
            }
            this._recent.push({
                rgbString: "rgb(" + this.rgb().join(",") + ")",
                hexString: this.hexString(),
                hex: this.hex()
            });

            this.trigger("apply", this.hex(), this.alpha());
        },

        _cancel: function () {
            this.trigger("cancel")
        }
    })

    Widget.provideBinding("palette", Palette);

    return Palette;
})
