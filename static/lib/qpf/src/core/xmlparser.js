//===================================================
// Xml Parser
// parse wml and convert it to dom with knockout data-binding
// TODO xml valid checking, 
//      provide xml childNodes Handler in the Components
//===================================================
define(function(require, exports, module){
    
    var _ = require("_");
    
    // return document fragment converted from the xml
    var parse = function( xmlString, dom ){
        
        if( typeof(xmlString) == "string"){
            var xml = parseXML( xmlString );
        }else{
            var xml = xmlString;
        }
        if( xml ){

            var rootDomNode = dom || document.createElement("div");

            convert( xml, rootDomNode);

            return rootDomNode;
        }
    }

    function parseXML( xmlString ){
        var xml, parser;
        try{
            if( window.DOMParser ){
                xml = (new DOMParser()).parseFromString( xmlString, "text/xml");
            }else{
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML( xmlString );
            }
            return xml;
        }catch(e){
            console.error("Invalid XML:" + xmlString);
        }
    }

    var customParsers = {};
    // provided custom parser from Compositor
    // parser need to return a plain object which key is attributeName
    // and value is attributeValue
    function provideParser(componentType /*tagName*/, parser){
        customParsers[componentType] = parser;
    }

    function parseXMLNode(xmlNode){
        if( xmlNode.nodeType === 1){
            
            var bindingResults = {
                type : xmlNode.tagName.toLowerCase()
            } 

            var convertedAttr = convertAttributes( xmlNode.attributes );
            var customParser = customParsers[bindingResults.type];
            if( customParser ){
                var result = customParser(xmlNode);
                if( result &&
                    typeof(result) !="object"){
                    console.error("Parser must return an object converted from attributes")
                }else{
                    // data in the attributes has higher priority than
                    // the data from the children
                    _.extend(convertedAttr, result);
                }
            }

            var bindingString = objectToDataBindingFormat( convertedAttr, bindingResults );

            var domNode = document.createElement('div');
            domNode.setAttribute('data-bind',  "qpf:"+bindingString);

            return domNode;
        }else if( xmlNode.nodeType === 8){// comment node, offer for virtual binding in knockout
            // return xmlNode;
            return;
        }else{
            return;
        }
    }

    function convertAttributes(attributes){
        var ret = {};
        for(var i = 0; i < attributes.length; i++){
            var attr = attributes[i];
            ret[attr.nodeName] = attr.nodeValue;
        }
        return ret;
    }

    function objectToDataBindingFormat(attributes, bindingResults){

        bindingResults = bindingResults || {};

        var preProcess = function(attributes, bindingResults){

            _.each(attributes, function(value, name){
                // recursive
                if( value.constructor == Array){
                    bindingResults[name] = [];
                    preProcess(value, bindingResults[name]);
                }else if( value.constructor == Object){
                    bindingResults[name] = {};
                    preProcess(value, bindingResults[name]);
                }else if( typeof(value) !== "undefined" ){
                    // this value is an expression or observable
                    // in the viewModel if it has @binding[] flag
                    var isBinding = /^\s*@binding\[(.*?)\]\s*$/.exec(value);
                    if( isBinding ){
                        // add a tag to remove quotation the afterwards
                        // conveniently, or knockout will treat it as a 
                        // normal string, not expression
                        value = "{{BINDINGSTART" + isBinding[1] + "BINDINGEND}}";

                    }
                    bindingResults[name] = value
                }
            });
        }
        preProcess( attributes, bindingResults );

        var bindingString = JSON.stringify(bindingResults);
        
        bindingString = bindingString.replace(/\"\{\{BINDINGSTART(.*?)BINDINGEND\}\}\"/g, "$1");

        return bindingString;
    }

    function convert(root, parent){

        var children = getChildren(root);

        for(var i = 0; i < children.length; i++){
            var node = parseXMLNode( children[i] );
            if( node ){
                parent.appendChild(node);
                convert( children[i], node);
            }
        }
    }

    function getChildren(parent){
        
        var children = [];
        var node = parent.firstChild;
        while(node){
            children.push(node);
            node = node.nextSibling;
        }
        return children;
    }

    function getChildrenByTagName(parent, tagName){
        var children = getChildren(parent);
        
        return _.filter(children, function(child){
            return child.tagName && child.tagName.toLowerCase() === tagName;
        })
    }


    exports.parse = parse;
    //---------------------------------
    // some util functions provided for the components
    exports.provideParser = provideParser;

    function getTextContent(xmlNode){
        var children = getChildren(xmlNode);
        var text = '';
        _.each(children, function(child){
            if(child.nodeType==3){
                text += child.textContent.replace(/(^\s*)|(\s*$)/g, "");
            }
        })
        return text;
    }

    exports.util = {
        convertAttributes : convertAttributes,
        objectToDataBindingFormat : objectToDataBindingFormat,
        getChildren : getChildren,
        getChildrenByTagName : getChildrenByTagName,
        getTextContent : getTextContent
    }
})