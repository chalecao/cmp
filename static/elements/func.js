define(function(require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    var isIf = ko.observable(false);
    var isFor = ko.observable(false);
    var isCache = ko.observable(false);
    factory.register("func", {
        type: "FUNC",
        extendProperties: function() {
            return {
                text: ko.observable("IF函数"),
                funcType: ko.observable("IF"),
                funcLanguage: ko.observable("FTL"),
                ifFuncItem: ko.observable("itemName"),
                trueFuncBody: ko.observable('M/U name'),
                falseFuncBody: ko.observable('M/U name'),
                forFuncItem: ko.observable('itemName'),
                forFuncBody: ko.observable("M/U name"),
                requestName: ko.observable(""),
                requestUrl: ko.observable(""),
                requestType: ko.observable("post"),
                requestParam: ko.observable("{}"),
                onLoadFunc:ko.observable(""),
            }
        },


        extendUIConfig: function() {
            return {
                funcType: {
                    label: "函数类型",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [
                        { text: 'IF函数', value: "IF" },
                        { text: 'FOR函数', value: "FOR" },
                        { text: 'Cache函数', value: "CACHE" },
                    ],
                    value: this.properties.funcType
                },
                funcLanguage: {
                    label: "函数语言",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [
                        { text: 'FTL模板', value: "FTL" },
                        { text: 'Regular模板', value: "Regular" },
                        { text: 'JS函数', value: "JS" }
                    ],
                    value: this.properties.funcLanguage
                },
                ifFuncItem: {
                    label: "IfItem",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.ifFuncItem,
                    visible: isIf
                },
                trueFuncBody: {
                    label: "IfTrue",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.trueFuncBody,
                    visible: isIf
                },
                falseFuncBody: {
                    label: "IfFalse",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.falseFuncBody,
                    visible: isIf
                },
                forFuncItem: {
                    label: "ForItem",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.forFuncItem,
                    visible: isFor
                },
                forFuncBody: {
                    label: "ForBody",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.forFuncBody,
                    visible: isFor
                },
                requestName: {
                    label: "方法名称",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.requestName,
                    visible: isCache
                },
                requestUrl: {
                    label: "请求地址",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.requestUrl,
                    visible: isCache
                },
               
                requestType: {
                    label: "请求类型",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [
                        { text: 'POST', value: "post" },
                        { text: 'GET', value: "get" },
                        { text: 'DWR', value: "dwr" }

                    ],
                    value: this.properties.requestType,
                    visible: isCache
                },
                requestParam: {
                    label: "请求参数",
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.requestParam,
                    visible: isCache
                },
                onLoadFunc: {
                    label: "成功回掉",
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.onLoadFunc,
                    visible: isCache
                },

            }
        },


        onCreate: function($wrapper) {
            var $text = $("<span></span>");
            var self = this;

            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append($text);
            } else {
                $wrapper.append($text);
            }

            //function 函数
            ko.computed(function() {
                var funcType = self.properties.funcType();
                var funcLanguage = self.properties.funcLanguage();
                if(funcType == "CACHE"){
                    self.properties.funcLanguage("JS");
                }
                $text.html(funcType + "函数<br/>" + self.properties.funcLanguage() + "模板/语言");
                isIf(funcType == "IF");
                isFor(funcType == "FOR");
                isCache(funcType == "CACHE");
                


                var _tempFTL = "";

                if (funcType == "IF") {
                    self.$wrapper.empty();
                    if (funcLanguage == "FTL") {
                        // 如果是if函数
                        _tempFTL = "<#if " + self.properties.ifFuncItem() + "??><div class='f-if-true'></div><#else><div class='f-if-false'></div>&lt;/#if>";
                    } else if (funcLanguage == "Regular") {
                        _tempFTL = "{#if " + self.properties.ifFuncItem() + "}<div class='f-if-true'></div>{#else}<div class='f-if-false'></div>{/if}";
                    }
                    self.$wrapper.append(_tempFTL);
                    if (self.properties.trueFuncBody()) {
                        self.trigger("addFuncComponent", self.properties.trueFuncBody(), self.$wrapper.find(".f-if-true"));
                    }
                    if (self.properties.falseFuncBody()) {
                        self.trigger("addFuncComponent", self.properties.falseFuncBody(), self.$wrapper.find(".f-if-false"));
                    }

                } else if (funcType == "FOR") {
                    self.$wrapper.empty();
                    // 如果是for函数
                    if (funcLanguage == "FTL") {
                        _tempFTL = "<#list " + self.properties.forFuncItem() + " as item><div class='f-for-body'></div>&lt;/#list>";
                    } else if (funcLanguage == "Regular") {
                        _tempFTL = "{#list " + self.properties.forFuncItem() + " as item}<div class='f-for-body'></div>{/list}";
                    }
                    self.$wrapper.append(_tempFTL);
                    if (self.properties.forFuncBody()) {
                        self.trigger("addFuncComponent", self.properties.forFuncBody(), self.$wrapper.find(".f-for-body"));
                    }

                } else if (funcType == "CACHE") {
                    self.$wrapper.empty();
                    $wrapper.append($text);
                }else {
                    self.$wrapper.empty();
                }


            });


        },
        // onExport: function() {
        //     var _tempFTL = "";
        //     if (this.properties.funcLanguage() == "FTL") {
        //         if (this.properties.funcType() == "IF") {
        //             // 如果是if函数
        //             _tempFTL = "<#if " + this.properties.ifFuncItem() + "??><#include '" + this.properties.trueFuncBody() + ".ftl'><#else><#include '" + this.properties.falseFuncBody() + ".ftl'>&lt;/#if>";
        //         } else if (this.properties.funcType() == "FOR") {
        //             // 如果是for函数
        //             _tempFTL = "<#include '" + this.properties.forFuncBody() + ".ftl'/><#list " + this.properties.forFuncItem() + " as item><@" + this.properties.forFuncBody().replace(/\-/g, "_") + " item />&lt;/#list>";
        //         }
        //         _tempFTL += "</div>";
        //     } else if (this.properties.funcLanguage() == "Regular") {
        //         //todo
        //         if (this.properties.funcType() == "IF") {
        //             // 如果是if函数
        //             _tempFTL = "{#if " + this.properties.ifFuncItem() + "}<div class='m-if-true'></div>{#else}<div class='m-if-false'></div>{/if}";
        //         } else if (this.properties.funcType() == "FOR") {
        //             // 如果是for函数
        //             _tempFTL = "{#list " + this.properties.forFuncItem() + " as item}" + this.properties.forFuncBody().replace(/\$\{/g, "{") + "{/list}";
        //         }
        //         _tempFTL += "</div>";
        //     }
        //     return _tempFTL;
        // }
    });

});
