define(function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    var onecolor = require("onecolor");

    factory.register("text", {
        type: "TEXT",
        extendProperties: function () {
            return {
                text: ko.observable("请输入文字"),
                html: ko.observable(""),
                fontFamily: ko.observable("微软雅黑,Microsoft YaHei"),
                fontSize: ko.observable(16),
                color: ko.observable("#111111"),
                horzontalAlign: ko.observable('center'),
                verticleAlign: ko.observable('middle'),
                lineHeight: ko.observable(0),
                lineClamp: ko.observable(0),
                classStr: ko.observable(""),
            }
        },
        extendUIConfig: function () {
            return {
                text: {
                    label: "文本",
                    ui: "textarea",
                    text: this.properties.text
                },
                html: {
                    label: "r-html",
                    ui: "textarea",
                    text: this.properties.html
                },

                fontFamily: {
                    label: "字体",
                    ui: "combobox",
                    class: "small",
                    items: [{
                        text: '宋体',
                        value: "宋体,SimSun"
                    }, {
                        text: '微软雅黑',
                        value: "微软雅黑,Microsoft YaHei"
                    }, {
                        text: '楷体',
                        value: "楷体,楷体_GB2312, SimKai"
                    }, {
                        text: '黑体',
                        value: "黑体,SimHei"
                    }, {
                        text: '隶书',
                        value: "隶书,SimLi"
                    }, {
                        text: 'Andale Mono',
                        value: 'andale mono'
                    }, {
                        text: 'Arial',
                        value: 'arial,helvetica,sans-serif'
                    }, {
                        text: 'Arial Black',
                        value: 'arial black,avant garde'
                    }, {
                        text: 'Comic Sans Ms',
                        value: 'comic sans ms'
                    }, {
                        text: 'Impact',
                        value: 'impact,chicago'
                    }, {
                        text: 'Times New Roman',
                        value: 'times new roman'
                    }, {
                        text: '无',
                        value: ''
                    }],
                    value: this.properties.fontFamily
                },

                fontSize: {
                    label: "大小",
                    ui: "spinner",
                    value: this.properties.fontSize
                },

                classStr: {
                    label: "class",
                    ui: "textfield",
                    text: this.properties.classStr
                },
                color: {
                    label: "颜色",
                    ui: "textfield",
                    text: this.properties.color
                },

                horzontalAlign: {
                    label: "水平对齐",
                    ui: "combobox",
                    class: "small",
                    items: [{
                        value: 'left',
                        text: "左对齐"
                    }, {
                        value: 'center',
                        text: "居中"
                    }, {
                        value: 'right',
                        text: "右对齐"
                    }, {
                        value: 'justify',
                        text: "两端对齐"
                    }],
                    value: this.properties.horzontalAlign
                },

                verticleAlign: {
                    label: "垂直对齐",
                    ui: "combobox",
                    class: "small",
                    items: [{
                        value: 'top',
                        text: "顶部对齐"
                    }, {
                        value: 'middle',
                        text: "居中"
                    }, {
                        value: 'bottom',
                        text: "底部对齐"
                    }],
                    value: this.properties.verticleAlign
                },

                lineHeight: {
                    label: "行高",
                    ui: "spinner",
                    min: 0,
                    value: this.properties.lineHeight
                },
                lineClamp: {
                    label: "尾追...",
                    ui: "spinner",
                    min: 0,
                    value: this.properties.lineClamp
                }
            }
        },

        onCreate: function ($wrapper) {
            var $text = $("<span style='line-height:normal;display:inline-block;width:100%;'></span>");
            var self = this;

            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append($text);
            } else {
                $wrapper.append($text);
            }

            //将父元素font-size重置为0，这样就不会有空格影响展示
            self.properties.boxFontSize(0);

            //Font family
            ko.computed(function () {
                var fontFamily = self.properties.fontFamily();
                var classStr = self.properties.classStr();
                $text.css({
                    'font-family': fontFamily
                })
                if (classStr) {
                    $text.addClass(classStr);
                }

            });

            //Font size and text color
            ko.computed(function () {
                var text = self.properties.text();
                var html = self.properties.html();
                var fontSize = self.properties.fontSize() + "px";

                // var color = onecolor(self.properties.color()).css();
                var color = self.properties.color();
                $text.html(text)
                    .css({
                        "font-size": fontSize,
                        "color": color
                    })
                if (html.length) {
                    $text.attr("r-html", html);
                } else {
                    $text.removeAttr("r-html");
                }

            });

            //Text align
            ko.computed(function () {
                var verticleAlign = self.properties.verticleAlign();
                var horzontalAlign = self.properties.horzontalAlign();

                $text.css({
                    'text-align': horzontalAlign,
                    'vertical-align': verticleAlign
                })
            });

            //Line height
            ko.computed(function () {
                var lineHeight = self.properties.lineHeight();
                if (lineHeight) {
                    $text.css({
                        'line-height': lineHeight + 'px'
                    })
                    $wrapper.css({
                        'line-height': lineHeight + 'px'
                    })
                }
            });
            //处理行尾增加
            ko.computed(function () {
                var lineClamp = self.properties.lineClamp();

                if (lineClamp > 1) {
                    $text.addClass("f-" + lineClamp + "lines");
                } else if (lineClamp > 0) {
                    $text.addClass("f-line");
                } else {
                    $text.removeClass("f-line");
                    $text.removeClass("f-2lines");
                    $text.removeClass("f-3lines");
                    $text.removeClass("f-4lines");
                }
            });


        }
    });
});
