//===================================
// Panel
// Container has title and content
//===================================
define(function(require){

var Container = require("./container");
var ko = require("knockout");
var $ = require("$");

var Panel = Container.derive(function(){
    return {
        title : ko.observable("")
    }
}, {

    type : 'PANEL',

    css : 'panel',

    template : '<div class="qpf-panel-header">\
                    <div class="qpf-panel-title" data-bind="html:title"></div>\
                    <div class="qpf-panel-tools"></div>\
                </div>\
                <div class="qpf-panel-body" data-bind="foreach:children" class="qpf-children">\
                    <div data-bind="qpf_view:$data"></div>\
                </div>\
                <div class="qpf-panel-footer"></div>',
    
    afterRender : function(){
        var $el = this.$el;
        this._$header = $el.children(".qpf-panel-header");
        this._$tools = this._$header.children(".qpf-panel-tools");
        this._$body = $el.children(".qpf-panel-body");
        this._$footer = $el.children(".qpf-panel-footer");
    },

    onResize : function(){
        // stretch the body when the panel's height is given
        if( this._$body && this.height() ){
            var headerHeight = this._$header.height();
            var footerHeight = this._$footer.height();

            // PENDING : here use jquery innerHeight method ?because we still 
            // need to consider the padding of body
            this._$body.height( this.$el.height() - headerHeight - footerHeight );
    
        }
        Container.prototype.onResize.call(this);
    }
})

Container.provideBinding("panel", Panel);

return Panel;

})

