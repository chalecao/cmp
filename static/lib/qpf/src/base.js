//=====================================
// Base class of all components
// it also provides some util methods like
//=====================================
define(function(require){

var Clazz = require("core/clazz");
var Event = require("core/mixin/event");
var ko = require("knockout");
var $ = require("$");
var _ = require("_");

var repository = {};    //repository to store all the component instance

var Base = Clazz.derive(function(){
return {    // Public properties
    // Name of component, will be used in the query of the component
    name : "",
    // Tag of wrapper element
    tag : "div",
    // Attribute of the wrapper element
    attr : {},
    // Jquery element as a wrapper
    // It will be created in the constructor
    $el : null,
    // Attribute will be applied to self
    // WARNING: It will be only used in the constructor
    // So there is no need to re-assign a new viewModel when created an instance
    // if property in the attribute is a observable
    // it will be binded to the property in viewModel
    attributes : {},
    
    parent : null,
    // ui skin
    skin : "",
    // Class prefix
    classPrefix : "qpf-ui-",
    // Skin prefix
    skinPrefix : "qpf-skin-",

    id : ko.observable(""),
    width : ko.observable(),
    class : ko.observable(),
    height : ko.observable(),
    visible : ko.observable(true),
    disable : ko.observable(false),
    style : ko.observable(""),

    // If the temporary is set true,
    // It will not be stored in the repository and 
    // will be destroyed when there are no reference any more
    // Maybe a ugly solution to prevent memory leak 
    temporary : false,
    // events list inited at first time
    events : {}
}}, function(){ //constructor

    this.__GUID__ = genGUID();
    // add to repository
    if( ! this.temporary ){
        repository[this.__GUID__] = this;
    }

    if( ! this.$el){
        this.$el = $(document.createElement(this.tag));
    }
    this.$el[0].setAttribute("data-qpf-guid", this.__GUID__);

    this.$el.attr(this.attr);
    if( this.skin ){
        this.$el.addClass( this.withPrefix(this.skin, this.skinPrefix) );
    }

    if( this.css ){
        _.each( _.union(this.css), function(className){
            this.$el.addClass( this.withPrefix(className, this.classPrefix) );
        }, this)
    }
    // Class name of wrapper element is depend on the lowercase of component type
    // this.$el.addClass( this.withPrefix(this.type.toLowerCase(), this.classPrefix) );

    this.width.subscribe(function(newValue){
        this.$el.width(newValue);
        this.onResize();
    }, this);
    this.height.subscribe(function(newValue){
        this.$el.height(newValue);
        this.onResize();
    }, this);
    this.disable.subscribe(function(newValue){
        this.$el[newValue?"addClass":"removeClass"]("qpf-disable");
    }, this);
    this.id.subscribe(function(newValue){
        this.$el.attr("id", newValue);
    }, this);
    this.class.subscribe(function(newValue){
        this.$el.addClass( newValue );
    }, this);
    this.visible.subscribe(function(newValue){
        newValue ? this.$el.show() : this.$el.hide();
    }, this);
    this.style.subscribe(function(newValue){
        var valueSv = newValue;
        var styleRegex = /(\S*?)\s*:\s*(.*)/g;
        // preprocess the style string
        newValue = "{" + _.chain(newValue.split(";"))
                        .map(function(item){
                            return item.replace(/(^\s*)|(\s*$)/g, "") //trim
                                        .replace(styleRegex, '"$1":"$2"');
                        })
                        .filter(function(item){return item;})
                        .value().join(",") + "}";
        try{
            var obj = ko.utils.parseJson(newValue);
            this.$el.css(obj);
        }catch(e){
            console.error("Syntax Error of style: "+ valueSv);
        }
    }, this);

    // register the events before initialize
    for( var name in this.events ){
        var handler = this.events[name];
        if( typeof(handler) == "function"){
            this.on(name, handler);
        }
    }

    // apply attribute 
    this._mappingAttributes( this.attributes );

    this.initialize();
    this.trigger("initialize");
    // Here we removed auto rendering at constructor
    // to support deferred rendering after the $el is attached
    // to the document
    // this.render();

}, {// Prototype
    // Type of component. The className of the wrapper element is
    // depend on the type
    type : "BASE",
    // Template of the component, will be applyed binging with viewModel
    template : "",
    // Declare the events that will be provided 
    // Developers can use on method to subscribe these events
    // It is used in the binding handlers to judge which parameter
    // passed in is events
    eventsProvided : ["click", "mousedown", "mouseup", "mousemove", "resize",
                        "initialize", "beforerender", "render", "dispose"],

    // Will be called after the component first created
    initialize : function(){},
    // set the attribute in the modelView
    set : function(key, value){
        if( typeof(key) == "string" ){
            var source = {};
            source[key] = value;
        }else{
            source = key;
        };
        this._mappingAttributes( source, true );
    },
    // Call to refresh the component
    // Will trigger beforeRender and afterRender hooks
    // beforeRender and afterRender hooks is mainly provide for
    // the subclasses
    render : function(){
        this.beforeRender && this.beforeRender();
        this.trigger("beforerender");

        this.doRender();
        this.afterRender && this.afterRender();

        this.trigger("render");
        // trigger the resize events
        this.onResize();
    },
    // Default render method
    doRender : function(){
        this.$el.children().each(function(){
            Base.disposeDom( this );
        })

        this.$el.html(this.template);
        ko.applyBindings( this, this.$el[0] );
    },
    // Dispose the component instance
    dispose : function(){
        if( this.$el ){
            // remove the dom element
            this.$el.remove()
        }
        // remove from repository
        repository[this.__GUID__] = null;

        this.trigger("dispose");
    },
    resize : function(width, height){
        if( typeof(width) === "number"){
            this.width( width );
        }
        if( typeof(height) == "number"){
            this.height( height );
        }
    },
    onResize : function(){
        this.trigger('resize');
    },
    withPrefix : function(className, prefix){
        if( className.indexOf(prefix) != 0 ){
            return prefix + className;
        }
    },
    withoutPrefix : function(className, prefix){
        if( className.indexOf(prefix) == 0){
            return className.substr(prefix.length);
        }
    },
    _mappingAttributes : function(attributes, onlyUpdate){
        for(var name in attributes){
            var attr = attributes[name];
            var propInVM = this[name];
            // create new attribute when property is not existed, even if it will not be used
            if( typeof(propInVM) === "undefined" ){
                var value = ko.utils.unwrapObservable(attr);
                // is observableArray or plain array
                if( (ko.isObservable(attr) && attr.push) ||
                    attr.constructor == Array){
                    this[name] = ko.observableArray(value);
                }else{
                    this[name] = ko.observable(value);
                }
                propInVM = this[name];
            }
            else if( ko.isObservable(propInVM) ){
                propInVM(ko.utils.unwrapObservable(attr) );
            }else{
                this[name] = ko.utils.unwrapObservable(attr);
            }
            if( ! onlyUpdate){
                // Two-way data binding if the attribute is an observable
                if( ko.isObservable(attr) ){
                    bridge(propInVM, attr);
                }
            }
        }   
    }
})

// register proxy events of dom
var proxyEvents = ["click", "mousedown", "mouseup", "mousemove"];
Base.prototype.on = function(eventName){
    // lazy register events
    if( proxyEvents.indexOf(eventName) >= 0 ){
        this.$el.unbind(eventName, proxyHandler)
        .bind(eventName, {context : this}, proxyHandler);
    }
    Event.on.apply(this, arguments);
}
function proxyHandler(e){
    var context = e.data.context;
    var eventType = e.type;

    context.trigger(eventType);
}


// get a unique component by guid
Base.get = function(guid){
    return repository[guid];
}
Base.getByDom = function(domNode){
    var guid = domNode.getAttribute("data-qpf-guid");
    return Base.get(guid);
}

// dispose all the components attached in the domNode and
// its children(if recursive is set true)
Base.disposeDom = function(domNode, resursive){

    if(typeof(recursive) == "undefined"){
        recursive = true;
    }

    function dispose(node){
        var guid = node.getAttribute("data-qpf-guid");
        var component = Base.get(guid);
        if( component ){
            // do not recursive traverse the children of component
            // element
            // hand over dispose of sub element task to the components
            // it self
            component.dispose();
        }else{
            if( recursive ){
                for(var i = 0; i < node.childNodes.length; i++){
                    var child = node.childNodes[i];
                    if( child.nodeType == 1 ){
                        dispose( child );
                    }
                }
            }
        }
    }

    dispose(domNode);
}

// util function of generate a unique id
var genGUID = (function(){
    var id = 0;
    return function(){
        return id++;
    }
})();

//----------------------------
// knockout extenders
ko.extenders.numeric = function(target, precision) {

    var fixer = ko.computed({
        read : target,
        write : function(newValue){ 
            if( newValue === "" ){
                target("");
                return;
            }else{
                var val = parseFloat(newValue);
            }
            val = isNaN( val ) ? 0 : val;
            var precisionValue = parseFloat( ko.utils.unwrapObservable(precision) );
            if( ! isNaN( precisionValue ) ) {
                var multiplier = Math.pow(10, precisionValue);
                val = Math.round(val * multiplier) / multiplier;
            }
            target(val);
        }
    });

    fixer( target() );

    return fixer;
};

ko.extenders.clamp = function(target, options){
    var min = options.min;
    var max = options.max;

    var clamper = ko.computed({
        read : target,
        write : function(value){
            var minValue = parseFloat( ko.utils.unwrapObservable(min) ),
                maxValue = parseFloat( ko.utils.unwrapObservable(max) );

            if( ! isNaN(minValue) ){
                value = Math.max(minValue, value);
            }
            if( ! isNaN(maxValue) ){
                value = Math.min(maxValue, value);
            }
            target(value);
        }
    })

    clamper( target() );
    return clamper;
}

//-------------------------------------------
// Handle bingings in the knockout template

var bindings = {};
Base.provideBinding = function(name, Component ){
    bindings[name] = Component;
}

Base.create = function(name, config){
    var Constructor = bindings[name];
    if(Constructor){
        return new Constructor(config);
    }
}

// provide bindings to knockout
ko.bindingHandlers["qpf"] = {

    createComponent : function(element, valueAccessor){
        // dispose the previous component host on the element
        var prevComponent = Base.getByDom( element );
        if( prevComponent ){
            prevComponent.dispose();
        }
        var component = createComponentFromDataBinding( element, valueAccessor, bindings );
        return component;
    },

    init : function( element, valueAccessor ){

        var component = ko.bindingHandlers["qpf"].createComponent(element, valueAccessor);

        component.render();
        // not apply bindings to the descendant doms in the UI component
        return { 'controlsDescendantBindings': true };
    },

    update : function( element, valueAccessor ){}
}

// append the element of view in the binding
ko.bindingHandlers["qpf_view"] = {
    init : function(element, valueAccessor){
        var value = valueAccessor();

        var subView = ko.utils.unwrapObservable(value);
        if( subView && subView.$el ){
            Base.disposeDom(element);
            element.parentNode.replaceChild(subView.$el[0], element);
        }
        // PENDING
        // handle disposal (if KO removes by the template binding)
        // ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        //     subView.dispose();
        // });

        return { 'controlsDescendantBindings': true };
    },

    update : function(element, valueAccessor){
    }
}

//-----------------------------------
// Provide plugins to jquery
$.fn.qpf = function( op, viewModel ){
    op = op || "get";
    if( op === "get"){
        var result = [];
        this.each(function(){
            var item = Base.getByDom(this);
            if( item ){
                result.push(item);
            }
        })
        return result;
    }else if( op === "init"){
        this.each(function(){
            ko.applyBindings(viewModel, this);
        });
        return this.qpf("get");
    }else if(op === "dispose"){
        this.each(function(){
            Base.disposeDom(this);
        })
    }
}

//------------------------------------
// Util functions
var unwrap = ko.utils.unwrapObservable;

function createComponentFromDataBinding(element, valueAccessor){

    var value = valueAccessor();
    
    var options = unwrap(value) || {};
    var type = unwrap(options.type);

    if( type ){
        var Constructor = bindings[type];

        if( Constructor ){
            var component = createComponentFromJSON( options, Constructor)
            if( component ){
                element.innerHTML = "";
                element.appendChild( component.$el[0] );
                
                $(element).addClass("qpf-wrapper");
            }
            // save the guid in the element data attribute
            element.setAttribute("data-qpf-guid", component.__GUID__);
        }else{
            console.error("Unkown UI type, " + type);
        }
    }else{
        console.error("UI type is needed");
    }
    return component;
}

function createComponentFromJSON(options, Constructor){

    var type = unwrap(options.type),
        name = unwrap(options.name),
        attr = _.omit(options, "type", "name");

    var events = {};

    // Find which property is event
    _.each(attr, function(value, key){
        if( key.indexOf("on") == 0 &&
            Constructor.prototype.eventsProvided.indexOf(key.substr("on".length)) >= 0 &&
            typeof(value) == "function"){
            delete attr[key];
            events[key.substr("on".length)] = value;
        }
    })

    var component = new Constructor({
        name : name || "",
        attributes : attr,
        events : events
    });

    return component;
}

// build a bridge of twe observables
// and update the value from source to target
// at first time
function bridge(target, source){
    
    target( source() );

    // Save the previous value with clone method in underscore
    // In case the notification is triggered by push methods of
    // Observable Array and the commonValue instance is same with new value
    // instance
    // Reference : `set` method in backbone
    var commonValue = _.clone( target() );
    target.subscribe(function(newValue){
        // Knockout will always suppose the value is mutated each time it is writted
        // the value which is not primitive type(like array)
        // So here will cause a recurse trigger if the value is not a primitive type
        // We use underscore deep compare function to evaluate if the value is changed
        // PENDING : use shallow compare function?
        try{
            if( ! _.isEqual(commonValue, newValue) ){
                commonValue = _.clone( newValue );
                source(newValue);
            }
        }catch(e){
            // Normally when source is computed value
            // and it don't have a write function
            console.error(e.toString());
        }
    })
    source.subscribe(function(newValue){
        try{
            if( ! _.isEqual(commonValue, newValue) ){
                commonValue = _.clone( newValue );
                target(newValue);
            }
        }catch(e){
            console.error(e.toString());
        }
    })
}

// export the interface
return Base;

})