define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./property.xml");
    var _ = require("_");

    var PropertyItemView = require("./property");

    var Mock = new Module({
        name: "property",
        xml: xml,

        dataProperties: ko.observableArray([]),
        dataValue: {},

        showProperties: function (properties) {
            var dataProperties = [];

            _.each(properties, function (property) {
                if (property.ui) {
                    property.type = property.ui;
                    var config = _.omit(property, 'label', 'ui', 'field', 'visible');
                    var item = {
                        label: property.label,
                        config: ko.observable(config)
                    }
                    if (property.visible) {
                        item.visible = property.visible;
                    }

                    switch (property.field) {
                        case "data":
                            dataProperties.push(item);
                            break;
                        default:
                            dataProperties.push(item);

                    }
                }
            })

            this.dataProperties(dataProperties);
        },
        detect2Mock: function () {
            var _cnt = $("<div></div>").append($(".qpf-viewport-elements-container").html());
            _cnt.find("#drawArrow").remove();
            _cnt.find("#drawDiagram").remove();
            _cnt.find("#drawMockView").remove();
            _cnt = _cnt.html();
            if (_cnt.match("&lt;#") || _cnt.match("<#")) {
                //ftl页面
                Mock.mockFTL();
            } else if (_cnt.match("{#") || _cnt.match("{")) {
                //regular
                Mock.mockRegular();
            } else {
                //普通页面

            }
        },
        mockFTL: function () {


        },
        mockRegular: function () {
            var self = this;
            self.dataValue = {};
            var cnt = $(".qpf-viewport-elements-container").html();
            cnt = cnt.substr(cnt.indexOf("cmp-element")).replace(/\&amp\;/g, '&').replace(/\&gt\;/g, '>').replace(/\&lt\;/g, '<').replace(/\&quot\;/g, '\"').replace(/\n/g, '').replace(/hoverstyle\=\"[\s\S]*?\"/g, "");
            var dataReg = new RegExp("{([\\s\\S]+?)}", 'igm');

            var dataItems = cnt.match(dataReg);
            if (dataItems) {
                dataItems.forEach(function (item, index, input) {
                    item = item.replace(/\{/g, "").replace(/\}/g, "").replace(/\#/g, "").replace(/if/g, "").replace(/list/g, "").replace(/else/g, "").replace(/\//g, "");
                    input[index] = item;
                })
                var tempExpression = dataItems.filter(function (item) {
                    return item && item.indexOf(";") < 0
                });
                /**
                 * "isTeacher && courseRecommends && courseRecommends.length>0?"":"f-dn""
                    " courseRecommends"
                    " courseRecommends as item"
                    "item.schoolShortName"
                    "item.courseId"
                    "item.courseCoverUrl"
                    "item.courseName"
                    "item.schoolName"
                    "item.enrollCount"
                    "item.whatCertGot==1?"":"f-dn""
                    "query.pageIndex"
                    "query.totlePageCount"
                    "this.onSelectPage($event)"
                    "((courseRecommends&& courseRecommends.length) || !inTeacherPage)?"f-dn":"""
                    "noCourseTip"
                 */
                var _props = {};
                var _as = [];
                $.each(tempExpression, function (k, v) {
                    //非贪婪模式去除“”、'' 中的数据
                    var _filterOtherChar = v.replace(/\".*?\"/g, " ").replace(/\'.*?\'/g, " ").replace(/\&/g, " ").replace(/\>/g, " ").replace(/\?/g, " ").replace(/\"/g, " ").replace(/\'/g, " ").replace(/\:/g, " ").replace(/\!/g, " ").replace(/\(/g, " ").replace(/\)/g, " ").replace(/\[/g, " ").replace(/\]/g, " ").replace(/\|/g, " ").replace(/\=/g, " ").replace(/\,/g, " ").replace(/\.length/g, " ").replace(/\$event/g, " ").trim();


                    if (_filterOtherChar.indexOf(" as ") > 0) {
                        _as.push({
                            seq: _filterOtherChar.split(" as ")[0].trim(),
                            item: _filterOtherChar.split(" as ")[1].trim()
                        });
                    }
                    _filterOtherChar = _filterOtherChar.replace(/as.*/g, " ");
                    var _itemTemp = _filterOtherChar.split(" ").filter(function (item) {
                        return item.trim().length && item.trim() != "f-dn" && isNaN(+item);
                    });

                    var subP = "";
                    $.each(_itemTemp, function (i, m) {
                        if (m[0] == "." || m.indexOf("_index") > 0) {
                            return true;
                        }
                        subP = "";
                        if (m.indexOf(".") > 0) {
                            subP = m.split(".")[1];
                            m = m.split(".")[0];
                        }
                        //对于事件暂不处理
                        if (m == "this") {
                            return true;
                        }
                        if (!_props[m]) {
                            self.dataValue[m] = ko.observable("");
                            if (subP) {
                                var _temp = {};
                                _temp[subP] = "";
                                self.dataValue[m](JSON.stringify(_temp));
                            }
                            _props[m] = {
                                label: m,
                                field: "data",
                                ui: "textfield",
                                text: self.dataValue[m]
                            };
                        } else if (subP) {
                            _props[m]["ui"] = "textarea";
                            var temWithN = self.dataValue[m]();
                            var _tempV = {};
                            if (temWithN.length > 1) {
                                _tempV = JSON.parse(temWithN);
                            }
                            _tempV[subP] = "";
                            self.dataValue[m](JSON.stringify(_tempV).replace(/\,/g, "\,\n"));
                            // _props[m].text = JSON.stringify(_tempV);
                        }
                    });

                });
                $.each(_as, function (k, v) {
                    var _arr = [];
                    self.dataValue[v.seq] = ko.observable("");
                    if (self.dataValue[v.item]) {
                        _arr.push(JSON.parse(self.dataValue[v.item]()));
                        self.dataValue[v.seq](JSON.stringify(_arr).replace(/\,/g, "\,\n"));
                        _props[v.seq] = {
                            label: v.seq,
                            field: "data",
                            ui: "textarea",
                            text: self.dataValue[v.seq]
                        };
                        delete _props[v.item];
                        delete self.dataValue[v.item];
                    }
                });
                var _temp = [];
                for (var key in _props) {
                    _temp.push(_props[key]);
                }
                _temp.push({
                    label: "- Dispaly with mock data",
                    field: "data",
                    ui: "button",
                    text: "Click && MockPage"
                });
                _temp.push({
                    label: "- save in caseIns",
                    field: "data",
                    ui: "button",
                    text: "Save in Test Case"
                });
                _temp.push({
                    label: "- get case in caseIns",
                    field: "data",
                    ui: "button",
                    text: "Get Data"
                });
                _temp.push({
                    label: "- show the test result",
                    field: "data",
                    ui: "button",
                    text: "Show Test"
                });
                self.showProperties(_temp);

                $($(".dataModal button")[0]).click(function () {
                    $(".switchDesign .mock").trigger("click");
                    Mock.showMockViewIframe();
                });
                $($(".dataModal button")[1]).click(function () {
                    //save in test case
                    Mock.trigger("save2test");
                });
                $($(".dataModal button")[2]).click(function () {
                    //save in test case
                    Mock.trigger("getTestData");
                });
                $($(".dataModal button")[3]).click(function () {
                    $(".switchDesign .mock").trigger("click");
                    Mock.trigger("showTestResult");
                });
            }
        },
        setDataValue: function (dataValueNow) {
            for (var k in dataValueNow) {
                Mock.dataValue[k](JSON.stringify(dataValueNow[k]).replace(/\,/g, "\,\n"));
            }
        },
        getDataValue: function () {
            var self = this;
            var dataValueNow = {};
            for (var k in self.dataValue) {

                try {
                    dataValueNow[k] = JSON.parse(self.dataValue[k]());
                } catch (ex) {
                    dataValueNow[k] = self.dataValue[k]();
                }
            }
            return dataValueNow;
        },

        addCss: function (str) {
            var nod = document.createElement('style');
            nod.type = 'text/css';
            nod.id = "tempStyle";
            if (nod.styleSheet) { //ie下
                nod.styleSheet.cssText = str;
            } else {
                nod.innerHTML = str; //或者写成 nod.appendChild(document.createTextNode(str))
            }
            document.getElementsByTagName('head')[0].appendChild(nod);
        },

        showMockViewIframe: function () {
            var self = this;

            var dataValueNow = self.getDataValue();
            Mock.trigger("refreshExample", dataValueNow);

        },
        showMockView: function (_js, _css, _html) {
            var self = this;
            var dataValueNow = self.getDataValue();
            // var _template = $(".qpf-viewport-elements-container").html();
            // _template = _template.substr(_template.indexOf("<div data-cmp-eid"));
            // 需要去掉hoverstyle
            // var _tempHtml = _template.replace(/\n/g, '').replace(/\&amp\;/g, '&').replace(/\&gt\;/g, '>').replace(/\&lt\;/g, '<').replace(/\&quot\;/g, '\'').replace(/hoverstyle\=\"[\s\S]*?\"/g, "").replace(/cmp\-element/g, "").replace(/cmp\-func/g, "").replace(/data\-cmp\-eid\=\".*?\"/g, "");

            //这里必须要用元素，因为有些换行符不好处理
            _html = _html.replace(/\{\s?this\.[\s\S]*?\}/g, "");
            var _Component = Regular.extend({
                template: _html

            });
            $("#tempStyle").remove();
            Mock.addCss(_css);

            // var _Component = {};
            // var _jsStr = _js.match(/\.\$extends[\s\S]*\}\)/g)[0];
            // _jsStr = _jsStr.substring(0, _jsStr.lastIndexOf("return"))
            // _css = _css.replace(/\n/g, "");
            // if (_jsStr.indexOf("css") > 0) {
            //     var _jsStr2 = _jsStr.substr(_jsStr.indexOf("css") + 3).replace("css", _css);;
            //     var _js3 = _jsStr.substr(0, _jsStr.indexOf("css") + 3).replace("html", _html).replace(/\.\$extends\(\{/g, "Regular.extend({") + _jsStr2;
            //     _Component = eval(_js3);
            // } else {
            //     _jsStr = _jsStr.replace(/\.\$extends\(\{/g, "Regular.extend({css:'" + _css + "',template:'" + _html + "',");
            //     _Component = eval(_jsStr);
            // }

            $("#drawMockView").empty();
            new _Component({
                data: dataValueNow
            }).$inject("#drawMockView");
            //去除无用的元素
            $("#drawMockView .element-select-outline").remove();
            $("#drawMockView .cmp-umi").remove();

        },

        PropertyItemView: PropertyItemView
    });

    return Mock;
});
