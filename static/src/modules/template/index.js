define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./template.xml");
    var _ = require("_");

    var contextMenu = require("modules/common/contextmenu");
    var Modal = require("modules/common/modal");
    var CodeArea = require("modules/common/codeArea");
    var TextField = qpf.use("meta/textfield");
    var Vbox = qpf.use("container/vbox");
    var Container = qpf.use("container/container");
    var Inline = qpf.use("container/inline");
    var Label = qpf.use("meta/label");
    var ElementView = require("./element");

    var idPageStr = "";
    var pagePoolUrl = "";
    var template = new Module({
        name: "template",
        xml: xml,
        // Elements data source 
        // {
        //     id : ko.observable(),
        //     target : Element
        // }
        templatesList: ko.observableArray([]),
        // List of selected elements, support multiple select
        selectedPages: ko.observableArray([]),
        ElementView: ElementView,
        _selectPages: function (data) {
            //选中时修改selectedPages值
            template.selectedPages(_.map(data, function (item) {
                return item.target;
            }));
        },
        load: function (compList) {
            var _tmpList = template.templatesList();
            //将compList添加到现有的组件列表上
            _.map(compList, function (element) {
                // 判断是否已经加载该组件，没加载则push，否则更新
                var _i = _.find(idPageStr.split("_"), function (item) {
                    return item == element.name;
                });
                if (!_i) {
                    _tmpList.push({
                        id: element.name,
                        desc: "-" + element.desc,
                        target: element
                    });
                    idPageStr += element.name + "_";
                } else {
                    _.each(_tmpList, function (item) {
                        if (item.id == element.name) {
                            item.target = element;
                            return false;
                        }
                    })
                }
            });
            this.templatesList(_tmpList);
        },
        getTarget: function (_componentId) {
            var _pageList = template.templatesList(),
                _comp = {};
            _.each(_pageList, function (element, key) {
                if (element.id == _componentId) {
                    _comp = element.target;
                    return;
                }
            });
            return _comp;
        }
    });

    template.templates = function () {
        return _.map(template.templatesList(), function (item) {
            return item.target;
        });
    };

    template.savePool = function () {
        if (pagePoolUrl) {
            var _pagePoolName = pagePoolUrl.substring(pagePoolUrl.lastIndexOf("/") + 1, pagePoolUrl.indexOf("cmpp") - 1);
            $.post("/api/" + _pagePoolName, {
                ext: '{"name":"' + _pagePoolName + '", "url":"' + pagePoolUrl + '"}',
                cmpData: JSON.stringify(template.templates())
            }, function (_data) {
                Modal.confirm("提示", _data.message || "操作成功", null, null, 1000);
            });

        } else {
            var _body = new TextField({
                attributes: {
                    text: "/.cmp/index.cmpt"
                }
            });
            Modal.popup("请输入模板地址：", _body, function () {
                if (_body.text()) {
                    pagePoolUrl = _body.text();
                    var _pagePoolName = pagePoolUrl.substring(pagePoolUrl.lastIndexOf("/"), pagePoolUrl.indexOf("cmpp") - 1);
                    $.post("/api/" + _pagePoolName, {
                        ext: '{"name":"' + _pagePoolName + '", "url":"' + pagePoolUrl + '"}',
                        cmpData: JSON.stringify(template.templates(), null, 2)
                    }, function (_date) {
                        Modal.confirm("提示", _date.message || "操作成功", null, null, 1000);
                    });

                }
            });
        }
    };


    template.on("start", function () {
        //默认加载
        $.ajax({
            url: "/.cmp/index.cmpt",
            success: function (result) {
                template.load(JSON.parse(result));
            },
            error: function (result) {
                $.get("/cmpApp/.cmp/index.cmpt", function (_data) {
                    template.load(JSON.parse(_data));
                });
            }
        });

        contextMenu.bindTo(template.mainComponent.$el, function (target) {
            var $uiEl = $(target).parents(".qpf-ui-element");
            if ($uiEl.length) {
                return [{
                    label: "编辑",
                    exec: function () {
                        var _target = $uiEl.qpf("get")[0].attributes.target;
                        var _comName = _target.name;
                        var _body = new Inline();
                        var _desc = new CodeArea({
                            attributes: {
                                mod: "javascript"
                            }
                        });
                        Modal.popup("请输入相关内容", _body, function () {
                            var _cnt = JSON.parse(_desc.text());
                            template.load([_cnt]);
                        });
                        _body.$el.append(_desc.$el);
                        _desc.$el.html('<textarea rows="5" cols="24">' + JSON.stringify(_target).replace(/\,/g, ",\n") + '</textarea>');
                        _desc.onResize();
                        _desc.$el.width("500px");
                        _desc.$el.parent().parent().css("margin-top", 0);
                    }
                }, {
                    label: "删除",
                    exec: function () { }
                }]
            } else {
                return [{
                    label: "新建",
                    exec: function () {
                        var _body = new Inline();
                        var _desc = new CodeArea({
                            attributes: {
                                mod: "javascript"
                            }
                        });
                        Modal.popup("请输入相关内容", _body, function () {
                            var _cnt = JSON.parse(_desc.text());
                            template.load([_cnt]);
                        });
                        _body.$el.append(_desc.$el);
                        _desc.$el.html('<textarea rows="5" cols="24">{\n"name": "ftl-mooc",\n"desc": "中M - FTL模板",\n"misc": "templates中包含name字段的内容会保留在数据模型的meta字段中，可以从文件同步到模型中",\n"templates": [],\n"cache": {\n"cacheItem": "/.cmp/tpl/cache-mooc/ui.js"\n}}</textarea>');
                        _desc.onResize();
                        _desc.$el.width("500px");
                        _desc.$el.parent().parent().css("margin-top", 0);
                    }
                }, {
                    label: "加载模板",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                text: pagePoolUrl || "/.cmp/index.cmpt"
                            }
                        });

                        var _modal = Modal.popup("请输入模板地址：", _body, function () {
                            if (_body.text()) {
                                var _templateUrl = _body.text();
                                $.get(_templateUrl, function (_data) {
                                    template.load(JSON.parse(_data));
                                });
                            }
                        });
                        _body.onEnterKey = function () {
                            _body.$el.blur();
                            _modal.wind.applyButton.trigger("click");
                        }
                    }
                }, {
                    label: "导出模板集",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                placeholder: "模板集名称"
                            }
                        });
                        Modal.popup("请输入模板集名称：", _body, function () {
                            if (_body.text()) {
                                var blob = new Blob([JSON.stringify(template.templates(), null, 2)], {
                                    type: "text/plain;charset=utf-8"
                                });
                                saveAs(blob, _body.text() + ".cmpt");

                            }
                        });


                    }
                }, {
                    label: "保存模板集",
                    exec: function () {
                        template.savePool();
                    }
                }]
            }
        });
    });

    return template;
})
