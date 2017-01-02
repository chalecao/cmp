//============================================
// Base class of all container component
//============================================
define(function(require){

var Base = require("../base");
var ko = require("knockout");
var $ = require("$");
var _ = require("_");

var Container = Base.derive(function(){
    return {
        // all child components
        children : ko.observableArray()
    }
}, {

    type : "CONTAINER",

    css : 'container',
    
    template : '<div data-bind="foreach:children" class="qpf-children">\
                    <div data-bind="qpf_view:$data"></div>\
                </div>',
    initialize : function(){
        var self = this,
            oldArray = this.children().slice();
        this.children.subscribe(function(newArray){
            var differences = ko.utils.compareArrays( oldArray, newArray );
            _.each(differences, function(item){
                // In case the dispose operation is launched by the child component
                if( item.status == "added"){
                    item.value.on("dispose", _onItemDispose, item.value);
                }else if(item.status == "deleted"){
                    item.value.off("dispose", _onItemDispose);
                }
            }, this);
        });
        function _onItemDispose(){  
            self.remove( this );
        }
    },
    // add child component
    add : function( sub ){
        sub.parent = this;
        this.children.push( sub );
        // Resize the child to fit the parent
        sub.onResize();
    },
    // remove child component
    remove : function( sub ){
        sub.parent = null;
        this.children.remove( sub );
    },
    removeAll : function(){
        _.each(this.children(), function(child){
            child.parent = null;
        }, this);
        this.children([]);
    },
    children : function(){
        return this.children()
    },
    doRender : function(){
        // do render in the hierarchy from parent to child
        // traverse tree in pre-order
        
        Base.prototype.doRender.call(this);

        _.each(this.children(), function(child){
            child.render();
        })

    },
    // resize when width or height is changed
    onResize : function(){
        // stretch the children
        if( this.height() ){
            this.$el.children(".qpf-children").height( this.height() ); 
        }
        // trigger the after resize event in post-order
        _.each(this.children(), function(child){
            child.onResize();
        }, this);
        Base.prototype.onResize.call(this);
    },
    dispose : function(){
        
        _.each(this.children(), function(child){
            child.dispose();
        });

        Base.prototype.dispose.call( this );
    },
    // get child component by name
    get : function( name ){
        if( ! name ){
            return;
        }
        return _.filter( this.children(), function(item){ return item.name === name } )[0];
    }
})

Container.provideBinding = Base.provideBinding;

// modify the qpf bindler
var baseBindler = ko.bindingHandlers["qpf"];
ko.bindingHandlers["qpf"] = {

    init : function(element, valueAccessor, allBindingsAccessor, viewModel){
        
        //save the child nodes before the element's innerHTML is changed in the createComponentFromDataBinding method
        var childNodes = Array.prototype.slice.call(element.childNodes);

        var component = baseBindler.createComponent(element, valueAccessor);

        if( component && component.instanceof(Container) ){
            // hold the renderring of children until parent is renderred
            // If the child renders first, the element is still not attached
            // to the document. So any changes of observable will not work.
            // Even worse, the dependantObservable is disposed so the observable
            // is detached in to the dom
            // https://groups.google.com/forum/?fromgroups=#!topic/knockoutjs/aREJNrD-Miw
            var subViewModel = {
                '__deferredrender__' : true 
            }
            _.extend(subViewModel, viewModel);
            // initialize from the dom element
            for(var i = 0; i < childNodes.length; i++){
                var child = childNodes[i];
                if( ko.bindingProvider.prototype.nodeHasBindings(child) ){
                    // Binding with the container's viewModel
                    ko.applyBindings(subViewModel, child);
                    var sub = Base.getByDom( child );
                    if( sub ){
                        component.add( sub );
                    }
                }
            }
        }
        if( ! viewModel['__deferredrender__']){
            
            component.render();
        }

        return { 'controlsDescendantBindings': true };

    },
    update : function(element, valueAccessor){
        baseBindler.update(element, valueAccessor);
    }
}

Container.provideBinding("container", Container);

return Container;

})