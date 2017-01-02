//===================================
// Tree Component
// Example
// ----------------xml---------------
// <tree>
//   <item icon="assets/imgs/file.gif">foo</item>
//   <item css="folder">
//     <item title="bar" icon="assets/imgs/file.gif"></item>
//   </item>
// </tree>
// ----------------------------------
// 
//===================================
define(function(require){

var Meta = require('./meta');
var ko = require('knockout');
var $ = require('$');
var _ = require("_");

var Tree = Meta.derive(function(){
    return {
        // Example
        // [{
        //    title : "" | ko.observable(),
        //    icon  : "" | ko.observable(),      //icon img url
        //    css   : "" | ko.observable(),      //css class
        //    items : [] | ko.observableArray()  //sub items
        // }]
        items : ko.observableArray(),

        draggable : ko.observable(false),

        renamble : ko.observable(false),

        indent : ko.observable(20),

        // the depth of node, root is 0;
        __depth__ : 0,
        __nodeIndex__ : 0,

        __root__ : this
    }
}, {

    type : "TREE",
    
    css : 'tree',

    template : '<ul data-bind="foreach:items">\
                    <li data-bind="qpf_tree_itemview:$data"></li>\
                </ul>'
})

var itemTemplate = '<li class="qpf-tree-item">\
                        <div class="qpf-tree-item-title"\
                                data-bind="style:{paddingLeft:_paddingLeftPx}">\
                            <!--ko if:items-->\
                            <span class="qpf-tree-unfold"></span>\
                            <!--/ko-->\
                            <span class="qpf-tree-icon" data-bind="css:css"></span>\
                            <a class="qpf-tree-item-caption" data-bind="text:title"></a>\
                        </div>\
                        <!--ko if:items-->\
                        <ul class="qpf-tree-subitems" data-bind="foreach:items">\
                            <li data-bind="qpf_tree_itemview:$data"></li>\
                        </ul>\
                        <!--/ko-->\
                    </li>';

ko.bindingHandlers["qpf_tree_itemview"] = {
    init : function(element, valueAccessor, allBindingAccessor, viewModel, bindingContext){
        var data = bindingContext.$data;
        var parent = bindingContext.$parent;
        var root = parent.__root__;

        var $itemEl = $(itemTemplate);

        // Default properties
        // In case there is no items property in data
        if( ! data.items){  
            data.items = null;
        }
        if( ! data.css){
            data.css = data.items ? "qpf-tree-folder" : "qpf-tree-file";
        }
        // private data
        data.__root__ = root;
        data.__depth__ = parent.__depth__+1;

        data._paddingLeftPx = ko.computed(function(){
            return data.__depth__ * ko.utils.unwrapObservable( root.indent ) + "px";
        });
        data

        element.parentNode.replaceChild($itemEl[0], element);
        ko.applyBindings(data, $itemEl[0]);

        return { 'controlsDescendantBindings': true };

    }
}

Meta.provideBinding("tree", Tree);

return Tree;
})