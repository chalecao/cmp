define(function(require){
    
    var qpf = require("qpf");
    var ko = require("knockout");

    var palette = new qpf.widget.Palette();
    palette.width(370);
    var popup = new qpf.container.Window({
        left : ko.observable(300),
        top : ko.observable(100)
    });
    popup.$el.hide();
    popup.title("调色器");
    popup.id("Palette");
    popup.add(palette);

    document.body.appendChild(popup.$el[0]);
    popup.render();

    palette.show = function(){
        popup.$el.show();
    }

    palette.hide = function(){
        popup.$el.hide();
    }

    return palette;
})