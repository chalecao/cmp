define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");

    var List = require('./list');

    var Item = qpf.meta.Meta.derive(function(){
        return {
            label : ko.observable(),
            exec : ko.observable(function(){})
        }
    }, {

        type : 'CONTEXTMENUITEM',

        css : 'context-menu-item',

        template : "<div data-bind='html:label'></div>",

        initialize : function(){
            var self = this;
            this.$el.click(function(){
                var exec = self.exec();
                exec && exec();
                contextMenu.hide();
            });
        }
    })

    var contextMenu = new List({
        attributes : {
            class : "qpf-context-menu",
            itemView : Item
        }
    });

    contextMenu.$el.attr("tabindex", 0);

    contextMenu.show = function(items, x, y){
        contextMenu.$el.show().offset({
            left : x + 5,
            top : y + 5
        });
        contextMenu.dataSource(items);

        contextMenu.$el.focus();
    }

    contextMenu.hide = function(){
        contextMenu.$el.hide();
    }

    contextMenu.bindTo = function(target, items){
        var showContextMenu = function(e){
            e.preventDefault();
            contextMenu.show(typeof(items) === "function" ? items(e.target) : items, e.pageX, e.pageY);
        }
        $(target).bind("contextmenu", showContextMenu);
    }


    contextMenu.$el.blur(function(){
        contextMenu.hide();
    });

    contextMenu.hide();

    document.body.appendChild(contextMenu.$el[0]);
    contextMenu.render();

    return contextMenu;
})