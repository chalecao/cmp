define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var _ = require("_");


    var ToolbarGroup = qpf.container.Inline.derive(function(){
        return {}
    }, {
        type : "TOOLBARGROUP",
        css : "toolbar-group"
    });

    qpf.container.Container.provideBinding("toolbargroup", ToolbarGroup);

    return ToolbarGroup;
})