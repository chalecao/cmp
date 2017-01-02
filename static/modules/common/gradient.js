define(function(require){
    
    var qpf = require("qpf");
    var ko = require("knockout");
    var $ = require("$");
    var _ = require("_");
    var onecolor = require("onecolor");
    var palette = require("./palette")

    var Gradient = qpf.widget.Widget.derive(function(){
        // {
        //     percent : ko.observable(0.1),
        //     color : ko.observable(rgba(0, 0, 0, 1))
        // }
        return {
            stops : ko.observableArray([]),
            angle : ko.observable(180),

            _percentString : function(percent){
                return Math.floor(ko.utils.unwrapObservable(percent) * 100) + "%";
            }
        }
    }, {
        type : 'GRADIENT',
        
        css : 'gradient',

        template : '<div class="qpf-gradient-preview"></div>\
                    <div class="qpf-gradient-stops" data-bind="foreach:{data : stops, afterRender : _onAddStop.bind($data)}">\
                        <div class="qpf-gradient-stop" data-bind="style:{left:$parent._percentString(percent)}">\
                            <div class="qpf-gradient-stop-inner"></div>\
                        </div>\
                    </div>\
                    <div class="qpf-gradient-angle></div>',

        initialize : function(){
            var self = this;

            this.stops.subscribe(function(newValue){
                self._updateGradientPreview();
            });
        },

        afterRender : function(){
            this._$gradientPreview = this.$el.find(".qpf-gradient-preview");
            this._$stopsContainer = this.$el.find(".qpf-gradient-stops");
            this._updateGradientPreview();

            var self = this;
            var stops = this.stops();
            this.$el.find(".qpf-gradient-stop").each(function(idx){
                self._onAddStop(this, stops[idx]);
            });

            // this._$stopsContainer.on("click", function(){
            //     self.stops.push({
            //         percent : ko.observable(0.5),
            //         color : ko.observable('rgba(0, 0, 0, 1)')
            //     });
            // })
        },

        _updateGradientPreview : function(){
            var cssStr = 'linear-gradient(90deg, '+ 
                        _.map(this.stops(), function(stop){
                            return onecolor(ko.utils.unwrapObservable(stop.color)).cssa() 
                                    + ' ' 
                                    + Math.floor(ko.utils.unwrapObservable(stop.percent) * 100) + '%';
                        }).join(", ") + ')';

            this._$gradientPreview.css({
                'background-image' : '-webkit-' + cssStr,
                'background-image' : '-moz-' + cssStr,
                'background-image' : cssStr
            });
        },

        _onAddStop : function(element, stop){
            var self = this;
            
            var draggable = new qpf.helper.Draggable({
                axis : 'x',
                container : this.$el.find(".qpf-gradient-stops")
            });
            draggable.add(element);

            draggable.on("drag", function(e){
                this._dragHandler(element, stop);
            }, this);
            // Edit color
            $(element).on("dblclick", function(){
                self._editColor(stop);
            });
        },

        _dragHandler : function(element, stop){
            var $el = $(element);
            var percent = parseInt($el.css("left")) / this._$stopsContainer.width();
            
            if(ko.isObservable(stop.percent)){
                stop.percent(percent);
            }else{
                stop.percent = percent
            }
            this._updateGradientPreview();
        },
        _editColor : function(stop){
            palette.show();
            palette.on("change", this._paletteChange, {
                stop : stop,
                _updateGradientPreview : this._updateGradientPreview.bind(this)
            });
            palette.on("cancel", this._paletteCancel, this);
            palette.on("apply", this._paletteApply, this);

            var color = ko.utils.unwrapObservable(stop.color);
            palette.set(parseInt(onecolor(color).hex().substr(1), 16));
        },
        _paletteChange : function(hex){
            var color = onecolor(hex).cssa();
            if(ko.isObservable(this.stop.color)){
                this.stop.color(color);
            }else{
                this.stop.color = color;
            }
            this._updateGradientPreview();
        },
        _paletteCancel : function(){
            palette.hide();
            palette.off("change");
            palette.off("apply");
            palette.off("cancel");
        },
        _paletteApply : function(){
            this._paletteCancel();
        }
    });

    qpf.Base.provideBinding("gradient", Gradient);

    return Gradient;
})
