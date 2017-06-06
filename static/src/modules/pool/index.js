define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./page.xml");
    var _ = require("_");

    var contextMenu = require("modules/common/contextmenu");
    var Modal = require("modules/common/modal");
    var TextField = qpf.use("meta/textfield");
    var Vbox = qpf.use("container/vbox");
    var Container = qpf.use("container/container");
    var Inline = qpf.use("container/inline");
    var Label = qpf.use("meta/label");
    var ElementView = require("./element");

    var idPageStr = "";
    var poolUrl = "";
    var page = new Module({
        name: "page",
        xml: xml,
        // Elements data source 
        // {
        //     id : ko.observable(),
        //     target : Element
        // }
        pagesList: ko.observableArray([]),

        // List of selected elements, support multiple select
        selectedPages: ko.observableArray([]),

        ElementView: ElementView,

        _selectPages: function (data) {
            //选中时修改selectedPages值
            page.selectedPages(_.map(data, function (item) {
                return item.target;
            }));

        },

        load: function (compList) {
            var _pageList = page.pagesList();
            //将compList添加到现有的组件列表上
            _.map(compList, function (element) {
                // 判断是否已经加载该组件，没加载则push，否则更新
                var _i = _.find(idPageStr.split("_"), function (item) {
                    return item == element.name;
                });
                if (!_i) {
                    _pageList.push({
                        id: element.name,
                        img: element.img,
                        desc: "-" + element.desc,
                        target: element
                    });
                    idPageStr += element.name + "_";
                } else {
                    Modal.confirm("提示", "组件池已存在组件" + element.name + ", 点击确定替换为新的组件", function () {
                        _.each(_pageList, function (item) {
                            if (item.id == element.name) {
                                item.img = element.img;
                                item.desc = "-" + element.desc;
                                item.target = element;
                                return false;
                            }
                        })
                    }, null);

                }

            });
            this.pagesList(_pageList);
        },
        getTarget: function (_componentId) {
            var _pageList = page.pagesList(),
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


    page.pages = function () {
        return _.map(page.pagesList(), function (item) {
            return item.target;
        });
    };

    page.savePool = function () {
        if (poolUrl) {
            var _pagePoolName = poolUrl.substring(poolUrl.lastIndexOf("/") + 1, poolUrl.indexOf("cmpp") - 1);
            $.post("/api/" + _pagePoolName, {
                ext: '{"name":"' + _pagePoolName + '", "url":"' + poolUrl + '"}',
                cmpData: JSON.stringify(page.pages())
            }, function (_data) {
                Modal.confirm("提示", _data.message || "操作成功", null, null, 1000);

            });

        } else {
            var _body = new TextField({
                attributes: {
                    text: "/.cmp/index.cmpl"
                }
            });
            Modal.popup("请输入组件池地址：", _body, function () {
                if (_body.text()) {
                    poolUrl = _body.text();
                    var _pagePoolName = poolUrl.substring(poolUrl.lastIndexOf("/"), poolUrl.indexOf("cmpp") - 1);
                    $.post("/api/" + _pagePoolName, {
                        ext: '{"name":"' + _pagePoolName + '", "url":"' + poolUrl + '"}',
                        cmpData: JSON.stringify(page.pages(), null, 2)
                    }, function (_date) {
                        Modal.confirm("提示", _date.message || "操作成功", null, null, 1000);
                    });

                }
            });
        }
    };


    page.on("start", function () {
        //默认加载
        $.ajax({
            url: "/.cmp/index.cmpl",
            success: function (result) {
                page.load(JSON.parse(result));
            },
            error: function (result) {
            }
        });

        page.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function (e) {
            var _selectedPages = page.selectedPages();
            var subComponent = _selectedPages[_selectedPages.length - 1];
            if (subComponent) {
                page.trigger("loadPoolItem", subComponent.url);
            }
        });
        contextMenu.bindTo(page.mainComponent.$el, function (target) {
            var $uiEl = $(target).parents(".qpf-ui-element");
            if ($uiEl.length) {
                return [{
                    label: "加载选中组件",
                    exec: function () {
                        var _selectedPages = page.selectedPages();
                        var subComponent = _selectedPages[_selectedPages.length - 1];
                        if (subComponent) {
                            page.trigger("loadPoolItem", subComponent.url);
                        }
                    }
                }, {
                    label: "分享组件",
                    exec: function () {
                        var _selectedPages = page.selectedPages();
                        var subComponent = _selectedPages[_selectedPages.length - 1];
                        var _body = new TextField({
                            attributes: {
                                text: subComponent.url
                            }
                        });
                        Modal.popup("复制分享组件地址：", _body, function () { });
                    }
                }, {
                    label: "编辑",
                    exec: function () {
                        var _target = $uiEl.qpf("get")[0].attributes.target;
                        var _comName = _target.name;
                        var _body = new Container();
                        var _inLine1 = new Inline();
                        var _inLine2 = new Inline();
                        var _inLine3 = new Inline();
                        var _inLine4 = new Inline();
                        _inLine4.add(
                            new Label({
                                attributes: {
                                    text: "组件名称："
                                }
                            })
                        );
                        var _name = new TextField({
                            attributes: {
                                text: _target.name,
                                placeholder: "组件名称"
                            }
                        });
                        _inLine4.add(_name);
                        _inLine1.add(
                            new Label({
                                attributes: {
                                    text: "组件描述："
                                }
                            })
                        );
                        var _desc = new TextField({
                            attributes: {
                                text: _target.desc,
                                placeholder: "组件描述"
                            }
                        });
                        _inLine1.add(_desc);

                        _inLine2.add(
                            new Label({
                                attributes: {
                                    text: "缩略图片："
                                }
                            })
                        );
                        var _img = new TextField({
                            attributes: {
                                text: _target.img,
                                placeholder: "缩略图片"
                            }
                        });
                        _inLine2.add(_img);

                        _inLine3.add(
                            new Label({
                                attributes: {
                                    text: "组件地址："
                                }
                            })
                        );
                        var _url = new TextField({
                            attributes: {
                                text: _target.url,
                                placeholder: "组件地址"
                            }
                        });
                        _inLine3.add(_url);

                        _body.add(_inLine4);
                        _body.add(_inLine1);
                        _body.add(_inLine2);
                        _body.add(_inLine3);

                        Modal.popup("请输入相关内容", _body, function () {
                            var _tmp = {
                                "name": _name.text(),
                                "desc": _desc.text(),
                                "img": _img.text().length ? _img.text() : "/cmpApp/static/style/images/logo.jpg",
                                "url": _url.text(),
                                "postUrl": "/api/" + _comName
                            };
                            page.load([_tmp]);
                        });

                    }
                }, {
                    label: "删除",
                    exec: function () {
                        var _selectedPages = page.selectedPages();
                        var subComponent = _selectedPages[_selectedPages.length - 1];
                        page.pagesList.remove(function (item) {
                            return item.id == subComponent.name;
                        });
                    }

                }]
            } else {
                return [{
                    label: "添加网络组件",
                    exec: function () {
                        var _body = new Container();
                        var _inLine1 = new Inline();
                        var _inLine2 = new Inline();
                        var _inLine3 = new Inline();
                        var _inLine4 = new Inline();
                        _inLine4.add(
                            new Label({
                                attributes: {
                                    text: "组件名称："
                                }
                            })
                        );
                        var _name = new TextField({
                            attributes: {
                                placeholder: "组件名称"
                            }
                        });
                        _inLine4.add(_name);
                        _inLine1.add(
                            new Label({
                                attributes: {
                                    text: "组件描述："
                                }
                            })
                        );
                        var _desc = new TextField({
                            attributes: {
                                placeholder: "组件描述"
                            }
                        });
                        _inLine1.add(_desc);

                        _inLine2.add(
                            new Label({
                                attributes: {
                                    text: "缩略图片："
                                }
                            })
                        );
                        var _img = new TextField({
                            attributes: {
                                placeholder: "缩略图片"
                            }
                        });
                        _inLine2.add(_img);

                        _inLine3.add(
                            new Label({
                                attributes: {
                                    text: "组件地址："
                                }
                            })
                        );
                        var _url = new TextField({
                            attributes: {
                                placeholder: "组件地址"
                            }
                        });
                        _inLine3.add(_url);
                        _body.add(_inLine4);
                        _body.add(_inLine1);
                        _body.add(_inLine2);
                        _body.add(_inLine3);
                        Modal.popup("请输入相关内容", _body, function () {
                            var _tmp = {
                                "name": _name.text(),
                                "desc": _desc.text(),
                                "img": _img.text().length ? _img.text() : "/cmpApp/static/style/images/logo.jpg",
                                "url": _url.text(),
                                "postUrl": "/api/" + _name.text()
                            };
                            page.load([_tmp]);
                        });
                    }
                }, {
                    label: "加载本地组件池",
                    exec: function () {
                        var $projectInput = $("<input type='file' />");
                        $projectInput[0].addEventListener("change", uploadProjectFile);
                        $projectInput.click();
                    }
                }, {
                    label: "加载远程组件池",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                text: poolUrl || "/.cmp/index.cmpl"
                            }
                        });
                        var _modal = Modal.popup("请输入远程组件池地址：", _body, function () {
                            if (_body.text()) {
                                poolUrl = _body.text();
                                $.get(poolUrl, function (data) {
                                    page.load(JSON.parse(data));
                                });
                            }
                        });
                        _body.onEnterKey = function () {
                            _body.$el.blur();
                            _modal.wind.applyButton.trigger("click");
                        }
                    }
                }, {
                    label: "导出组件池",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                placeholder: "组件池名称"
                            }
                        });
                        Modal.popup("请输入组件池名称：", _body, function () {
                            if (_body.text()) {
                                var blob = new Blob([JSON.stringify(page.pages(), null, 2)], {
                                    type: "text/plain;charset=utf-8"
                                });
                                saveAs(blob, _body.text() + ".cmpl");
                            }
                        });
                    }
                }, {
                    label: "分享组件池",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                text: location.origin + poolUrl
                            }
                        });
                        Modal.popup("复制分享组件池地址：", _body, function () { });
                    }
                }, {
                    label: "保存组件池",
                    exec: function () {
                        page.savePool();
                    }
                }]
            }
        });

        function uploadProjectFile(e) {
            var file = e.target.files[0];

            if (file && (file.name.substr(-4) === 'cmpl')) {
                //如果是组件文件
                fileReader.onload = function (e) {
                    fileReader.onload = null;
                    page.load(JSON.parse(e.target.result));
                }
                fileReader.readAsText(file);
            }
        }
    });
    return page;
})
