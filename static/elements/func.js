define(function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    factory.register("func", {
        type: "FUNC",
        extendProperties: function () {
            return {
                text: ko.observable("函数"),
                funcType: ko.observable("IF"),
                funcLanguage: ko.observable("FTL"),
                ifFuncItem: ko.observable(""),
                trueFuncBody: ko.observable(''),
                falseFuncBody: ko.observable(''),
                forFuncItem: ko.observable(''),
                forFuncBody: ko.observable(""),
                requestName: ko.observable(""),
                requestUrl: ko.observable(""),
                requestType: ko.observable("post"),
                requestParam: ko.observable("{}"),
                onLoadFunc: ko.observable(""),
                includeBody: ko.observable(""),

            }
        },


        extendUIConfig: function () {
            var _that = this;
            return {
                funcType: {
                    label: "函数类型",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [{
                        text: 'IF函数',
                        value: "IF"
                    }, {
                        text: 'FOR函数',
                        value: "FOR"
                    }, {
                        text: 'Include函数',
                        value: "INCLUDE"
                    }, {
                        text: 'Cache函数',
                        value: "CACHE"
                    }, ],
                    value: this.properties.funcType
                },
                funcLanguage: {
                    label: "函数语言",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [{
                        text: 'FTL模板',
                        value: "FTL"
                    }, {
                        text: 'Regular模板',
                        value: "Regular"
                    }, {
                        text: 'JS函数',
                        value: "JS"
                    }],
                    value: this.properties.funcLanguage
                },
                includeBody: {
                    label: "包含组件",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.includeBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "INCLUDE";
                        }
                    })
                },
                ifFuncItem: {
                    label: "IfItem",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.ifFuncItem,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "IF";
                        }
                    })
                },
                trueFuncBody: {
                    label: "IfTrue",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.trueFuncBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "IF";
                        }
                    })
                },
                falseFuncBody: {
                    label: "IfFalse",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.falseFuncBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "IF";
                        }
                    })
                },
                forFuncItem: {
                    label: "ForItem",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.forFuncItem,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "FOR";
                        }
                    })
                },
                forFuncBody: {
                    label: "ForBody",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.forFuncBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "FOR";
                        }
                    })
                },
                requestName: {
                    label: "方法名称",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.requestName,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },
                requestUrl: {
                    label: "请求地址",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.requestUrl,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },

                requestType: {
                    label: "请求类型",
                    ui: "combobox",
                    class: "small",
                    field: 'func',
                    items: [{
                            text: 'POST',
                            value: "post"
                        }, {
                            text: 'GET',
                            value: "get"
                        }, {
                            text: 'DWR',
                            value: "dwr"
                        }

                    ],
                    value: this.properties.requestType,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },
                requestParam: {
                    label: "请求参数",
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.requestParam,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },
                onLoadFunc: {
                    label: "成功回掉",
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.onLoadFunc,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "CACHE";
                        }
                    })
                },

            }
        },


        onCreate: function ($wrapper) {
            var $text = $("<span></span>");
            var self = this;

            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append($text);
            } else {
                $wrapper.append($text);
            }

            //function 函数
            ko.computed(function () {
                var funcType = self.properties.funcType();
                var funcLanguage = self.properties.funcLanguage();
                if (funcType == "CACHE") {
                    self.properties.funcLanguage("JS");
                }
                $text.html(funcType + "函数<br/>" + self.properties.funcLanguage() + "模板/语言");


                var _tempFTL = "";

                if (funcType == "IF") {
                    if (self.properties.ifFuncItem() == "itemName") {
                        return;
                    }
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
                    if (self.properties.forFuncItem() == "itemName") {
                        return;
                    }
                    if (self.properties.forFuncBody() == "M/U name") {
                        return;
                    }
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
                } else if (funcType == "INCLUDE") {
                    self.$wrapper.empty();
                    var _include = self.properties.includeBody();
                    if (_include) {
                        if (funcLanguage == "FTL") {
                            if (_include.indexOf(".ftl") > 0) {
                                // 如果是带ftl后缀，则可能是引入外部的ftl，这里不作处理
                                _tempFTL = "<#include '" + _include + "'/>";
                            } else {
                                _tempFTL = "<div class='f-include-body'></div>";
                            }
                        } else if (funcLanguage == "Regular") {
                            _tempFTL = "<div class='f-include-body'></div>";
                        }
                        self.$wrapper.append(_tempFTL);
                        self.trigger("addFuncComponent", _include, self.$wrapper.find(".f-include-body"));

                    }
                } else {
                    self.$wrapper.empty();
                }


            });


        }

    });

});
