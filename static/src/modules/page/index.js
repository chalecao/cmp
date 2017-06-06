define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./page.xml");
    var _ = require("_");

    var propertyModule = require("../property/index");
    var componentModule = require("../component/index");
    var hierarchyModule = require("../hierarchy/index");
    var poolModule = require("../pool/index");

    var contextMenu = require("modules/common/contextmenu");
    var Modal = require("modules/common/modal");
    var TextField = qpf.use("meta/textfield");
    var Vbox = qpf.use("container/vbox");
    var Container = qpf.use("container/container");
    var Inline = qpf.use("container/inline");
    var Label = qpf.use("meta/label");
    var ElementView = require("./element");

    var idPageStr = "";
    var pagePoolUrl = "";
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
                                item.target = element;
                                item.img = element.img;
                                item.desc = "-" + element.desc;
                                return false;
                            }
                        })
                        page.pagesList(_pageList);
                    }, null);

                }

            });
            page.pagesList(_pageList);
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

    page.setPoolUrl = function (url) {
        pagePoolUrl = url;
    }
    page.clearPages = function () {
        idPageStr = "";
        page.pagesList([]);
    }
    page.savePool = function () {
        if (pagePoolUrl) {
            var _pagePoolName = pagePoolUrl.substring(pagePoolUrl.lastIndexOf("/") + 1, pagePoolUrl.indexOf("cmpp") - 1);
            $.post("/api/" + _pagePoolName, {
                ext: '{"name":"' + _pagePoolName + '", "url":"' + pagePoolUrl + '"}',
                cmpData: JSON.stringify(page.pages())
            }, function (_data) {
                Modal.confirm("提示", _data.message || "操作成功", null, null, 1000);

            });

        } else {
            var _body = new TextField({
                attributes: {
                    text: "/.cmp/index.cmpp"
                }
            });
            Modal.popup("请输入组件池地址：", _body, function () {
                if (_body.text()) {
                    pagePoolUrl = _body.text();
                    var _pagePoolName = pagePoolUrl.substring(pagePoolUrl.lastIndexOf("/"), pagePoolUrl.indexOf("cmpp") - 1);
                    $.post("/api/" + _pagePoolName, {
                        ext: '{"name":"' + _pagePoolName + '", "url":"' + pagePoolUrl + '"}',
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
        // page.trigger("importProjectFromUrl", "/.cmp/index.cmpp");

        function showSelect() {
            var _selectedPages = page.selectedPages();
            var subComponent = _selectedPages[_selectedPages.length - 1];
            //加载子页面中的组件，这个在project中importPage时注册监听
            if (subComponent) {
                if (componentModule.components().length) {
                    Modal.confirm("提示", "工作区中存在组件，请先保存！点击确定直接清空工作区组件", function () {
                        componentModule.clearComponents();
                        hierarchyModule.removeAll();

                        page.trigger("selectPage", subComponent);
                    }, function () {
                        // page.trigger("selectPage", subComponent);
                        // page.selectedPages([]);
                        // 用于清空选择
                        // var _pageList = page.pagesList();
                        // page.pagesList([]);
                        // page.pagesList(_pageList);
                    });
                } else {
                    page.trigger("selectPage", subComponent);
                }
            }
        }
        page.mainComponent.$el.delegate(".qpf-ui-element", "dblclick", function (e) {
            showSelect();
        });

        contextMenu.bindTo(page.mainComponent.$el, function (target) {
            var $uiEl = $(target).parents(".qpf-ui-element");
            if ($uiEl.length) {
                return [{
                    label: "加载选中组件",
                    exec: function () {
                        showSelect();
                    }
                }, {
                    label: "插入选中组件",
                    exec: function () {
                        var _selectedPages = page.selectedPages();
                        var subComponent = _selectedPages[_selectedPages.length - 1];
                        //加载子页面中的组件，这个在project中importPage时注册监听
                        if (subComponent) {
                            page.trigger("selectPage", subComponent);
                        }
                    }
                }, {
                    label: "分享组件",
                    exec: function () {
                        var _selectedPages = page.selectedPages();
                        var subComponent = _selectedPages[_selectedPages.length - 1];
                        var _body = new TextField({
                            attributes: {
                                text: location.origin + subComponent.url
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
                        var _inLine5 = new Inline();
                        var _inLine6 = new Inline();
                        var _inLine7 = new Inline();
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
                        _inLine4.add(
                            new Label({
                                attributes: {
                                    text: "FTL地址："
                                }
                            })
                        );
                        var _ftl = new TextField({
                            attributes: {
                                text: _target.ftlPath,
                                placeholder: "FTL路径地址/"
                            }
                        });
                        _inLine4.add(_ftl);
                        _inLine5.add(
                            new Label({
                                attributes: {
                                    text: "CSS地址："
                                }
                            })
                        );
                        var _css = new TextField({
                            attributes: {
                                text: _target.cssPath,
                                placeholder: "CSS路径地址/"
                            }
                        });
                        _inLine5.add(_css);
                        _inLine6.add(
                            new Label({
                                attributes: {
                                    text: "Comp地址："
                                }
                            })
                        );
                        var _rui = new TextField({
                            attributes: {
                                text: _target.ruiPath,
                                placeholder: "组件(保存自治)路径地址/"
                            }
                        });
                        _inLine6.add(_rui);
                        _inLine7.add(
                            new Label({
                                attributes: {
                                    text: "LIB地址："
                                }
                            })
                        );
                        var _lib = new TextField({
                            attributes: {
                                text: _target.libPath,
                                placeholder: "依赖lib地址('/src/javascript/lib/')"
                            }
                        });
                        _inLine7.add(_lib);
                        _body.add(_inLine1);
                        _body.add(_inLine2);
                        _body.add(_inLine3);
                        _body.add(_inLine4);
                        _body.add(_inLine5);
                        _body.add(_inLine6);
                        _body.add(_inLine7);

                        Modal.popup("请输入相关内容", _body, function () {
                            var _tmp = {
                                "name": _comName,
                                "desc": _desc.text(),
                                "img": _img.text(),
                                "url": _url.text(),
                                "ftlPath": _ftl.text(),
                                "cssPath": _css.text(),
                                "ruiPath": _rui.text(),
                                "libPath": _lib.text(),
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
                }, {
                    label: "加载选中组件备份",
                    exec: function () {
                        var _selectedPages = page.selectedPages();
                        var subComponent = _selectedPages[_selectedPages.length - 1];
                        //加载子页面中的组件，这个在project中importPage时注册监听
                        if (subComponent) {
                            subComponent.urlBackup = subComponent.url + "_backup";
                            if (componentModule.components().length) {
                                Modal.confirm("提示", "工作区中存在组件，请先保存！点击确定直接清空工作区组件", function () {
                                    componentModule.clearComponents();
                                    hierarchyModule.removeAll();

                                    page.trigger("selectPage", subComponent);
                                }, function () {
                                    // page.trigger("selectPage", subComponent);
                                    page.selectedPages([]);
                                    // 用于清空选择
                                    var _pageList = page.pagesList();
                                    page.pagesList([]);
                                    page.pagesList(_pageList);
                                });
                            } else {
                                page.trigger("selectPage", subComponent);
                            }
                        }
                    }
                }]
            } else {
                return [{
                    label: "加载本地组件集",
                    exec: function () {
                        page.trigger("importProject");
                    }
                }, {
                    label: "加载远程组件集",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                text: pagePoolUrl || "/.cmp/index.cmpp"
                            }
                        });

                        var _modal = Modal.popup("请输入远程组件集地址：", _body, function () {
                            if (_body.text()) {
                                pagePoolUrl = _body.text();
                                page.trigger("importProjectFromUrl", _body.text());
                                if (pagePoolUrl.indexOf("//") >= 0) {
                                    var _name = pagePoolUrl.substring(pagePoolUrl.lastIndexOf("/") + 1, pagePoolUrl.lastIndexOf("."))
                                    poolModule.load([{
                                        "name": _name,
                                        "desc": _name,
                                        "img": "/cmpApp/static/style/images/logo.jpg",
                                        "url": pagePoolUrl,
                                        "postUrl": "/api/" + _name
                                    }]);
                                }
                            }
                        });
                        _body.onEnterKey = function () {
                            _body.$el.blur();
                            _modal.wind.applyButton.trigger("click");
                        }

                    }
                }, {
                    label: "导出组件集",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                placeholder: "组件集名称"
                            }
                        });
                        Modal.popup("请输入组件集名称：", _body, function () {
                            if (_body.text()) {
                                var blob = new Blob([JSON.stringify(page.pages(), null, 2)], {
                                    type: "text/plain;charset=utf-8"
                                });
                                saveAs(blob, _body.text() + ".cmpp");

                            }
                        });


                    }
                }, {
                    label: "分享组件集",
                    exec: function () {
                        var _body = new TextField({
                            attributes: {
                                text: location.origin + pagePoolUrl
                            }
                        });
                        Modal.popup("复制分享组件集地址：", _body, function () { });
                    }
                }, {
                    label: "保存组件集",
                    exec: function () {
                        page.savePool();
                    }
                }]
            }
        });
    });

    return page;
})
