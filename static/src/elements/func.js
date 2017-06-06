define(function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");

    factory.register("func", {
        type: "FUNC",
        extendProperties: function () {
            return {
                text: ko.observable("函数"),
                funcType: ko.observable(""),
                funcLanguage: ko.observable(""),
                ifFuncItem: ko.observable(""),
                trueFuncBody: ko.observable(''),
                elseIfSwitch: ko.observable(false),
                elseIfFuncItem: ko.observable(""),
                elseIfFuncBody: ko.observable(""),
                elseIfSwitch2: ko.observable(false),
                elseIfFuncItem2: ko.observable(""),
                elseIfFuncBody2: ko.observable(""),
                falseFuncBody: ko.observable(''),
                forFuncItem: ko.observable(''),
                forFuncVar: ko.observable(''),
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
                    ui: "textarea",
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
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.trueFuncBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "IF";
                        }
                    })
                },
                elseIfFuncItem: {
                    label: "elseIfItem",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.elseIfFuncItem,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.elseIfSwitch();
                        }
                    })
                },
                elseIfFuncBody: {
                    label: "elseIfBody",
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.elseIfFuncBody,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.elseIfSwitch();
                        }
                    })
                },
                elseIfFuncItem2: {
                    label: "elseIfItem",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.elseIfFuncItem2,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.elseIfSwitch2();
                        }
                    })
                },
                elseIfFuncBody2: {
                    label: "elseIfBody",
                    ui: "textarea",
                    field: 'func',
                    text: this.properties.elseIfFuncBody2,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.elseIfSwitch2();
                        }
                    })
                },
                falseFuncBody: {
                    label: "IfFalse",
                    ui: "textarea",
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
                forFuncVar: {
                    label: "ForVar",
                    ui: "textfield",
                    field: 'func',
                    text: this.properties.forFuncVar,
                    visible: ko.computed({
                        read: function () {
                            return _that.properties.funcType() == "FOR";
                        }
                    })
                },
                forFuncBody: {
                    label: "ForBody",
                    ui: "textarea",
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

            function isCode(str) {
                return str.indexOf("<") >= 0 || str.indexOf(".") >= 0;
            }

            //function 函数
            ko.computed(function () {
                var funcType = self.properties.funcType();
                var funcLanguage = self.properties.funcLanguage();
                if (funcType == "CACHE") {
                    self.properties.funcLanguage("JS");
                }
                $text.html(funcType + "函数<br/>" + self.properties.funcLanguage() + "模板/语言");


                var _tempFTL = "",
                    _id = self.properties.id();

                if (funcType == "IF") {
                    var _ifItem = self.properties.ifFuncItem();
                    var _elseifSw = self.properties.elseIfSwitch();
                    var _elseifSw2 = self.properties.elseIfSwitch2();
                    var _elseifIt = self.properties.elseIfFuncItem();
                    var _elseifIt2 = self.properties.elseIfFuncItem2();

                    if (!_ifItem) {
                        return;
                    }
                    self.$wrapper.empty();
                    //插入id防止class重复
                    var _ifTrue = _id + "-t";
                    var _ifFalse = _id + "-f";
                    var _elseIfB = _id + "-elf";
                    var _elseIfB2 = _id + "-elf2";
                    var _true = self.properties.trueFuncBody();
                    var _false = self.properties.falseFuncBody();
                    var _elseifBo = self.properties.elseIfFuncBody();
                    var _elseifBo2 = self.properties.elseIfFuncBody2();

                    if (funcLanguage == "FTL") {
                        _tempFTL = "<#if " + _ifItem + "><div class='" + _ifTrue + "'></div>";
                        if (_elseifSw && _elseifBo) {
                            _tempFTL += "<#elseif " + _elseifIt + "><div class='" + _elseIfB + "'></div>";
                        }
                        if (_elseifSw2 && _elseifBo2) {
                            _tempFTL += "<#elseif " + _elseifIt2 + "><div class='" + _elseIfB2 + "'></div>";
                        }
                        _tempFTL += "<#else><div class='" + _ifFalse + "'></div>&lt;/#if>"
                    } else if (funcLanguage == "Regular") {
                        _tempFTL = "{#if " + _ifItem + "}<div class='" + _ifTrue + "'></div>";
                        if (_elseifSw && _elseifBo) {
                            _tempFTL += "{#elseif " + _elseifIt + "}<div class='" + _elseIfB + "'></div>";
                        }
                        if (_elseifSw2 && _elseifBo2) {
                            _tempFTL += "{#elseif " + _elseifIt2 + "}<div class='" + _elseIfB2 + "'></div>";
                        }
                        _tempFTL += "{#else}<div class='" + _ifFalse + "'></div>{/if}"
                    }
                    self.$wrapper.append(_tempFTL);

                    if (_true) {
                        if (isCode(_true)) {
                            self.$wrapper.find("." + _ifTrue).append(_true);
                        } else {
                            self.trigger("addFuncComponent", _true, self.$wrapper.find("." + _ifTrue));
                        }
                    } else {
                        self.$wrapper.find("." + _ifTrue).remove();
                    }

                    if (_elseifBo) {
                        if (isCode(_elseifBo)) {
                            self.$wrapper.find("." + _elseIfB).append(_elseifBo);
                        } else {
                            self.trigger("addFuncComponent", _elseifBo, self.$wrapper.find("." + _elseIfB));
                        }
                    } else {
                        self.$wrapper.find("." + _elseIfB).remove();
                    }

                    if (_elseifBo2) {
                        if (isCode(_elseifBo2)) {
                            self.$wrapper.find("." + _elseIfB2).append(_elseifBo2);
                        } else {
                            self.trigger("addFuncComponent", _elseifBo2, self.$wrapper.find("." + _elseIfB2));
                        }
                    } else {
                        self.$wrapper.find("." + _elseIfB2).remove();
                    }
                    if (_false) {
                        if (isCode(_false)) {
                            self.$wrapper.find("." + _ifFalse).append(_false);
                        } else {
                            self.trigger("addFuncComponent", _false, self.$wrapper.find("." + _ifFalse));
                        }
                    } else {
                        self.$wrapper.find("." + _ifFalse).remove();
                    }


                } else if (funcType == "FOR") {
                    if (!self.properties.forFuncItem()) {
                        return;
                    }
                    if (!self.properties.forFuncVar()) {
                        return;
                    }
                    if (!self.properties.forFuncBody()) {
                        return;
                    }
                    self.$wrapper.empty();
                    //插入id防止class重复
                    var _forB = _id + "-f";
                    // 如果是for函数
                    if (funcLanguage == "FTL") {
                        _tempFTL = "<#if " + self.properties.forFuncItem() + "??><#list " + self.properties.forFuncItem() + " as " + self.properties.forFuncVar() + "><div class='" + _forB + "'></div>&lt;/#list>&lt;/#if>";
                    } else if (funcLanguage == "Regular") {
                        _tempFTL = "{#if " + self.properties.forFuncItem() + "}{#list " + self.properties.forFuncItem() + " as " + self.properties.forFuncVar() + "}<div class='" + _forB + "'></div>{/list}{/if}";
                    }
                    self.$wrapper.append(_tempFTL);

                    var _for = self.properties.forFuncBody();
                    if (_for) {
                        if (isCode(_for)) {
                            self.$wrapper.find("." + _forB).append(_for);
                        } else {
                            self.trigger("addFuncComponent", self.properties.forFuncBody(), self.$wrapper.find("." + _forB));
                        }
                    }
                } else if (funcType == "CACHE") {
                    self.$wrapper.empty();
                    self.$wrapper.css({
                        "color": "#fff",
                        "background": "#56278f"
                    });
                    self.$wrapper.append("CACHE");
                    self.$wrapper.addClass("cmp-umi");
                } else if (funcType == "INCLUDE") {
                    self.$wrapper.empty();
                    var _include = self.properties.includeBody();
                    if (_include) {
                        //插入id防止class重复
                        var _forI = _id + "-i";
                        _tempFTL = "<div class='" + _forI + "'></div>";

                        self.$wrapper.append(_tempFTL);
                        if (isCode(_include)) {
                            if (_include.indexOf("<#include") < 0 && funcLanguage == "FTL") {
                                self.$wrapper.find("." + _forI).append('<#include "' + _include + '"/>');
                            } else {
                                self.$wrapper.find("." + _forI).append(_include);
                            }
                        } else {
                            self.trigger("addFuncComponent", _include, self.$wrapper.find("." + _forI));
                        }
                    } else {
                        $wrapper.append($text);
                    }
                } else {
                    self.$wrapper.empty();
                }
            });
        }
    });
});
