/**
 * 这是一个模块，不同于其他元素，这个是货真价实的设计上的模块，新建一个页面的时候回默认初始化根模块，根模块就是当前页面
 * 用户可以建立自己的模块，这主要用于单页面多模块的设计工作。图形化的设计模块节点
 * _p._$startup({
        // 规则配置
        rules:{
            rewrite:{
                // 重写规则配置
                '404': '/home/course'
            }
        },
        // 模块配置
        modules: {
            '/home': 'home/index.html',
            '/selfIntro': 'home/selfIntro.html', 
            '/home/course': 'home/course.html',             
            '/home/discuss': 'home/discuss.html'           
        }
    });
 * 主要实现以上的模块设计，然后根据模板自动生成代码
 * 
 */
define(function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    var _ = require("_");
    var hierarchyModule = require("../modules/hierarchy/index")
    var d3 = require("d3");


    var bk = ["#61C5C9", "#CC9E82", "#4F8DB1", "#F9C63D", "#60ADD5", "#8EB93B", "#B31800", "#EB3F2F", "#abcc39"];
    //初始化D3箭头标识
    var svg = d3.select("#drawArrow").append("svg")
        .attr("width", parseInt(d3.select("#drawArrow").attr("width")))
        .attr("height", parseInt(d3.select("#drawArrow").attr("height")));
    var defs = svg.append("defs");
    var arrowMarker = defs.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "12")
        .attr("markerHeight", "12")
        .attr("viewBox", "0 0 12 12")
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto");
    var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
    arrowMarker.append("path")
        .attr("d", arrow_path)
        .attr("fill", "#000");

    factory.register("umi", {
        type: "UMI",
        pointLine: "",
        extendProperties: function () {
            return {
                hashPath: ko.observable("/home"),
                modulePath: ko.observable("home/index.html"),
                parentModule: ko.observable(""),
                //保存模块的代码
                moduleJS: ko.observable(""),
                moduleHTML: ko.observable("")

            }
        },
        extendUIConfig: function () {
            return {
                hashPath: {
                    label: "HASH路径",
                    ui: "textfield",
                    text: this.properties.hashPath
                },
                modulePath: {
                    label: "模板路径",
                    ui: "textfield",
                    text: this.properties.modulePath
                },
                parentModule: {
                    label: "父模块ID",
                    ui: "textfield",
                    text: this.properties.parentModule
                }
            }
        },

        onCreate: function ($wrapper) {
            var $text = $("<span style='line-height:normal;display:inline-block;width:100%;color:#fff;font-size:12px;'></span>");
            var self = this;

            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append($text);
            } else {
                $wrapper.append($text);
            }
            //将父元素font-size重置为0，这样就不会有空格影响展示
            self.properties.boxFontSize(0);

            if (!$wrapper.css("background-color")) {
                $wrapper.css("background-color", bk[parseInt(bk.length * Math.random())]);
            }
            self.properties.left(400 + parseInt(100 * Math.random()));
            self.properties.top(80 + parseInt(400 * Math.random()));

            //Font size and text color
            ko.computed(function () {
                var hashPath = self.properties.hashPath();
                var modulePath = self.properties.modulePath();

                $text.html("<br/>" + hashPath + "<br/><br/>" + (self.properties.titleStr() || "模块路径") + "：<br/>" + modulePath);
            });


            ko.computed(function () {
                if (svg.attr("width") != parseInt(d3.select("#drawArrow").attr("width"))) {
                    svg.attr("width", parseInt(d3.select("#drawArrow").attr("width")));
                }
                if (svg.attr("height") != parseInt(d3.select("#drawArrow").attr("height"))) {
                    svg.attr("height", parseInt(d3.select("#drawArrow").attr("height")));
                }
                var parentModule = self.properties.parentModule();
                if (parentModule) {
                    //获取父模块
                    var element = _.find(hierarchyModule.elements(), function (ele) {
                        return (ele.properties.id() == parentModule);
                    });
                    if (element) {
                        var x1 = +element.properties.left() + parseInt(element.properties.width()),
                            y1 = +element.properties.top() + parseInt(element.properties.height() / 2),
                            x2 = +self.properties.left() - 5,
                            y2 = +self.properties.top() + parseInt(self.properties.height() / 2);
                        if (self.pointLine) self.pointLine.remove();
                        $("line[x1=" + x1 + "][y1=" + y1 + "][x2=" + x2 + "][y2=" + y2 + "]").remove();
                        self.pointLine = svg.append("line")
                            .attr("x1", x1)
                            .attr("y1", y1)
                            .attr("x2", x2)
                            .attr("y2", y2)
                            .attr("stroke", "red")
                            .attr("stroke-width", 2)
                            .attr("marker-end", "url(#arrow)");
                    } else {
                        if (self.pointLine) self.pointLine.remove();
                    }
                } else {
                    if (self.pointLine) self.pointLine.remove();
                }
            });

        },
        beforeRemove: function () {
            this.pointLine.remove();
        }
    });
});
