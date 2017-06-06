define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var $ = require("$");
    var _ = require("_");
    var onecolor = require("onecolor");
    var koMapping = require("ko.mapping");
    var Modal = require("modules/common/modal");
    var command = require("./command");

    var hoverHtml = require("text!template/hover/hover.html");
    var hoverCss = require("text!template/hover/hover.css");
    var baseCss = require("text!template/css/base.css");

    var cacheItem = require("text!template/cache/cacheItem.js");
    var dwrItem = require("text!template/cache/dwrItem.js");
    var callCache = require("text!template/cache/callCache.js");

    var Draggable = qpf.helper.Draggable;

    var animationJson = JSON.parse(require("text!template/animate/animate.json"));
    var animationJs = require("text!template/animate/animate.js");
    var animaList = [];
    for (var i in animationJson.list) {
        animaList.push({
            "text": i,
            "value": i
        });
    }

    var _rgbaBacReg = /background\-color\:\s*rgba\((.*)\)/g;

    var Element = qpf.core.Clazz.derive(function () {

        var hasBackground = ko.observable(false);
        var canBeFloat = ko.computed({
            read: function () {
                return ret.properties.positionStr() == "relative"
            },
            deferEvaluation: true
        });
        var isBackgroundImageGradient = ko.computed({
            read: function () {
                return hasBackground() &&
                    ret.properties.backgroundImageType() === 'gradient'
            },
            deferEvaluation: true
        });
        var isBackgroundImageFile = ko.computed({
            read: function () {
                return hasBackground() &&
                    ret.properties.backgroundImageType() === 'file'
            }
        });

        var ret = {
            //临时保存上次动画数据
            tempAniStr: "",
            tempEventName: "",
            name: "",
            icon: "",

            eid: genEID(),

            $wrapper: $("<div><a style='display:inline-block;width:100%;'></a></div>"),

            type: "ELEMENT",

            // Properties view model
            properties: {
                id: ko.observable(""),
                rid: ko.observable(""),
                typeStr: ko.observable(""),
                displayStr: ko.observable(""),

                width: ko.observable(100),
                minWidth: ko.observable(),
                height: ko.observable(100),
                left: ko.observable(0),
                top: ko.observable(0),

                zIndex: ko.observable(),

                boxColor: ko.observable(),
                boxFontSize: ko.observable(),
                //-------------------

                // border
                borderStyle: ko.observable(""),
                borderTop: ko.observable(0),
                borderRight: ko.observable(0),
                borderBottom: ko.observable(0),
                borderLeft: ko.observable(0),
                borderColor: ko.observable(0x55b929),
                borderAlpha: ko.observable(1),

                //-------------------
                // Background
                background: hasBackground,
                backgroundColor: ko.observable(0xffffff),
                backgroundAlpha: ko.observable(1),
                backgroundImageType: ko.observable("none"),
                backgroundGradientStops: ko.observableArray([{
                    percent: ko.observable(0),
                    color: ko.observable('rgba(255, 255, 255, 1)')
                }, {
                    percent: ko.observable(1),
                    color: ko.observable('rgba(0, 0, 0, 1)')
                }]),
                backgroundGradientAngle: ko.observable(180),
                backgroundImageStr: ko.observable(""),

                //-------------------
                // Border radius
                borderTopLeftRadius: ko.observable(0),
                borderTopRightRadius: ko.observable(0),
                borderBottomRightRadius: ko.observable(0),
                borderBottomLeftRadius: ko.observable(0),
                //-------------------
                // margin
                marginTop: ko.observable(),
                marginRight: ko.observable(),
                marginBottom: ko.observable(),
                marginLeft: ko.observable(),
                //-------------------
                // padding
                paddingTop: ko.observable(),
                paddingRight: ko.observable(),
                paddingBottom: ko.observable(),
                paddingLeft: ko.observable(),

                //-------------------
                // Shadow
                hasShadow: ko.observable(false),
                shadowOffsetX: ko.observable(0),
                shadowOffsetY: ko.observable(0),
                shadowBlur: ko.observable(10),
                shadowColor: ko.observable(0),
                shadowColorAlpha: ko.observable(1),


                //-------------------
                // link related
                newBlank: ko.observable(false),
                targetUrl: ko.observable(""),
                //-------------------
                // class related
                boxClassStr: ko.observable(""),

                //-------------------
                //overflow related
                overflow: ko.observable(false),
                //-------------------
                //hover related
                hover: ko.observable(""),
                hoverComponent: ko.observable(""),
                //hover 样式字符串，目前只能手写比较简单
                hoverStr: ko.observable(""),
                //长时间hover 展示title
                titleStr: ko.observable(""),

                //animate动画样式
                animateStr: ko.observable("none"),
                //-------------------
                //ga related
                dataCate: ko.observable(""),
                dataAction: ko.observable(""),
                dataLabel: ko.observable(""),

                //用于position属性，慎重
                positionStr: ko.observable("absolute"),
                floatStr: ko.observable(""),
                //自定义事件
                eventName: ko.observable(""),
                eventHandler: ko.observable(""),
            },

            onResize: function () {},
            onMove: function () {},

            onCreate: function () {},
            onRemove: function () {},

            onExport: function () {},
            onImport: function () {},

            onOutput: function () {}

        };

        // UI Config for property Panel
        var props = ret.properties;
        ret.uiConfig = {
            id: {
                label: "标志id",
                field: "style",
                ui: "textfield",
                text: props.id
            },
            rid: {
                label: "元素id",

                ui: "textfield",
                text: props.rid
            },
            position: {
                label: "位置",
                ui: "vector",
                field: "layout",
                items: [{
                    name: "left",
                    type: "textfield",
                    value: props.left,
                    text: props.left
                }, {
                    name: "top",
                    type: "textfield",
                    value: props.top,
                    text: props.top
                }]
            },
            positionStr: {
                label: "position",
                ui: "combobox",
                class: "small",
                field: 'layout',
                items: [{
                    text: 'absolute',
                    value: "absolute"
                }, {
                    text: 'fixed',
                    value: "fixed"
                }, {
                    text: 'relative',
                    value: "relative"
                }, {
                    text: 'static',
                    value: "static"
                }],
                value: props.positionStr
            },
            typeStr: {
                label: "类型*",
                ui: "combobox",
                class: "small",
                field: 'style',
                items: [{
                    text: '普通元素',
                    value: "ELEMENT"
                }, {
                    text: '图片',
                    value: "IMAGE"
                }, {
                    text: '文本',
                    value: "TEXT"
                }, {
                    text: '函数',
                    value: "FUNC"
                }, {
                    text: '模块UMI',
                    value: "UMI"
                }],
                value: props.typeStr
            },
            displayStr: {
                label: "盒模型*",
                ui: "combobox",
                class: "small",
                field: 'style',
                items: [{
                    text: '无',
                    value: ""
                }, {
                    text: 'block',
                    value: "block"
                }, {
                    text: 'inline-block',
                    value: "inline-block"
                }, {
                    text: 'none',
                    value: "none"
                }],
                value: props.displayStr
            },
            floatStr: {
                label: "float",
                ui: "combobox",
                class: "small",
                field: 'layout',
                items: [{
                    text: '无',
                    value: ""
                }, {
                    text: 'left',
                    value: "left"
                }, {
                    text: 'right',
                    value: "right"
                }, {
                    text: 'clearBoth',
                    value: "both"
                }],
                value: props.floatStr,
                visible: canBeFloat
            },

            size: {
                label: "宽高",
                ui: "vector",
                field: "layout",
                items: [{
                    name: "width",
                    type: "textfield",
                    text: props.width,
                    value: props.width
                }, {
                    name: "height",
                    type: "textfield",
                    text: props.height,
                    value: props.height
                }],
                // constrainProportion : ko.observable(true),
                constrainType: "no"
            },
            zIndex: {
                label: "Z",
                ui: "spinner",
                field: 'layout',
                value: props.zIndex,
                step: 1,
                precision: 0
            },
            minWidth: {
                label: "minWidth",
                ui: "textfield",
                field: 'layout',
                text: props.minWidth
            },
            borderStyle: {
                label: "边框类型",
                ui: "combobox",
                class: "small",
                field: "style",
                items: [{
                    text: "无",
                    value: ""
                }, {
                    text: "实线",
                    value: "solid"
                }, {
                    text: "间隔横线",
                    value: "dashed"
                }, {
                    text: "点点点",
                    value: "dotted"
                }],
                value: props.borderStyle
            },
            borderWidth: {
                label: "border",
                ui: "vector",
                field: "style",
                items: [{
                    name: "top",
                    type: "slider",
                    value: props.borderTop,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20,
                }, {
                    name: "right",
                    type: "slider",
                    value: props.borderRight,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20,
                }, {
                    name: "bottom",
                    type: "slider",
                    value: props.borderBottom,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20,
                }, {
                    name: "left",
                    type: "slider",
                    value: props.borderLeft,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20,
                }],
                constrainProportion: ko.observable(true)
            },
            borderColor: {
                label: "边框色",
                ui: "color",
                field: "style",
                color: props.borderColor,
                alpha: props.borderAlpha
            },
            background: {
                label: "背景",
                ui: "checkbox",
                field: "style",
                checked: hasBackground
            },

            backgroundColor: {
                label: "背景色",
                ui: "color",
                field: "style",
                color: props.backgroundColor,
                alpha: props.backgroundAlpha,
                visible: hasBackground
            },

            backgroundImageType: {
                label: "背景图片",
                ui: "combobox",
                class: "small",
                field: "style",
                items: [{
                    text: "无",
                    value: "none"
                }, {
                    text: "渐变",
                    value: "gradient"
                }, {
                    text: "图片文件",
                    value: "file"
                }],
                value: props.backgroundImageType,
                visible: hasBackground
            },
            backgroundImageStr: {
                label: "背景URL",
                field: "style",
                ui: "textfield",
                text: props.backgroundImageStr,
                visible: isBackgroundImageFile
            },

            backgroundGradient: {
                ui: "gradient",
                field: "style",
                stops: props.backgroundGradientStops,
                angle: props.backgroundGradientAngle,
                visible: isBackgroundImageGradient
            },

            borderRadius: {
                label: "圆角",
                ui: "vector",
                field: "style",
                items: [{
                    name: "top-left",
                    type: "slider",
                    value: props.borderTopLeftRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "top-right",
                    type: "slider",
                    value: props.borderTopRightRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "bottom-right",
                    type: "slider",
                    value: props.borderBottomRightRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "bottom-left",
                    type: "slider",
                    value: props.borderBottomLeftRadius,
                    precision: 0,
                    step: 1,
                    min: 0
                }],
                constrainProportion: ko.observable(true)
            },
            margin: {
                label: "margin",
                ui: "vector",
                field: "layout",
                items: [{
                    name: "top",
                    type: "textfield",
                    text: props.marginTop,
                    value: props.marginTop
                }, {
                    name: "right",
                    type: "textfield",
                    text: props.marginRight,
                    value: props.marginRight

                }, {
                    name: "bottom",
                    type: "textfield",
                    text: props.marginBottom,
                    value: props.marginBottom
                }, {
                    name: "left",
                    type: "textfield",
                    text: props.marginLeft,
                    value: props.marginLeft,

                }],
                constrainProportion: ko.observable(true)
            },
            padding: {
                label: "padding",
                ui: "vector",
                field: "layout",
                items: [{
                    name: "top",
                    type: "textfield",
                    text: props.paddingTop,
                    value: props.paddingTop,

                }, {
                    name: "right",
                    type: "textfield",
                    text: props.paddingRight,
                    value: props.paddingRight
                }, {
                    name: "bottom",
                    type: "textfield",
                    text: props.paddingBottom,
                    value: props.paddingBottom
                }, {
                    name: "left",
                    type: "textfield",
                    text: props.paddingLeft,
                    value: props.paddingLeft,
                }],
                constrainProportion: ko.observable(true)
            },

            shadow: {
                label: "阴影",
                ui: "checkbox",
                field: "style",
                checked: props.hasShadow
            },

            shadowSize: {
                field: "style",
                ui: "slider",
                min: 1,
                max: 50,
                precision: 0,
                value: props.shadowBlur,
                visible: props.hasShadow
            },

            shadowOffset: {
                ui: "vector",
                field: "style",
                items: [{
                    name: "shadowOffsetX",
                    type: "slider",
                    min: -50,
                    max: 50,
                    precision: 0,
                    value: props.shadowOffsetX
                }, {
                    name: "shadowOffsetY",
                    type: "slider",
                    min: -50,
                    max: 50,
                    precision: 0,
                    value: props.shadowOffsetY
                }],
                visible: props.hasShadow
            },

            shadowColor: {
                ui: "color",
                field: "style",
                color: props.shadowColor,
                alpha: props.shadowColorAlpha,
                visible: props.hasShadow
            },
            boxFontSize: {
                label: "Box字号",
                ui: "spinner",
                field: "style",
                value: props.boxFontSize
            },
            boxColor: {
                label: "Box颜色",
                ui: "textfield",
                field: "style",
                text: props.boxColor
            },
            href: {
                label: "超链接",
                ui: "vector",
                items: [{
                    label: "新开页面",
                    type: "checkbox",
                    checked: props.newBlank,
                    value: props.newBlank
                }, {
                    name: "URL",
                    type: "textfield",
                    text: props.targetUrl,
                    value: props.targetUrl
                }]
            },
            boxClassStr: {
                label: "Box类名",
                ui: "textarea",
                field: "style",
                text: props.boxClassStr
            },
            overflow: {
                label: "overflow",
                ui: "combobox",
                class: "small",
                field: "layout",
                items: [{
                    text: "默认",
                    value: "visiable"
                }, {
                    text: "overflowX",
                    value: "overflowX"
                }, {
                    text: "overflowY",
                    value: "overflowY"
                }, {
                    text: "overflowXY",
                    value: "overflowXY"
                }],
                value: props.overflow
            },
            hover: {
                label: "Hover",
                ui: "combobox",
                class: "small",
                field: "layout",
                items: [{
                    text: "无",
                    value: ""
                }, {
                    text: "下方Hover",
                    value: "bottom"
                }, {
                    text: "下右方Hover",
                    value: "bottom-right"
                }, {
                    text: "左边Hover",
                    value: "left"
                }, {
                    text: "右边Hover",
                    value: "right"
                }],
                value: props.hover
            },
            hoverComponent: {
                label: "HoverC",
                ui: "textfield",
                field: 'layout',
                text: props.hoverComponent,
                visible: props.hover
            },
            hoverStr: {
                label: "CSS(&)",
                ui: "codearea",
                text: props.hoverStr
            },
            animateStr: {
                label: "动画",
                ui: "combobox",
                class: "small",
                items: animaList,
                value: props.animateStr
            },
            dataCate: {
                label: "dataCate",
                ui: "textfield",
                text: props.dataCate
            },
            dataAction: {
                label: "dataAction",
                ui: "textfield",
                text: props.dataAction
            },
            dataLabel: {
                label: "dataLabel",
                ui: "textfield",
                text: props.dataLabel
            },
            titleStr: {
                label: "描述提示",
                ui: "textfield",
                text: props.titleStr
            },
            eventName: {
                label: "on-",
                ui: "textfield",
                field: 'event',
                text: props.eventName
            },
            eventHandler: {
                label: "操作",
                ui: "textfield",
                field: 'event',
                text: props.eventHandler
            }
        };

        return ret;
    }, {

        initialize: function (config) {

            this.$wrapper.attr("data-cmp-eid", this.eid);

            var self = this,
                properties = self.properties;
            if (config) {
                properties.typeStr(config.type);
            }

            if (config) {
                if (config.extendProperties) {
                    var extendedProps = config.extendProperties.call(this);
                    if (extendedProps) {
                        _.extend(properties, extendedProps);
                    }
                }
                // Extend UI Config in the properties panel
                if (config.extendUIConfig) {
                    var extendedUIConfig = config.extendUIConfig.call(this);
                    if (extendedUIConfig) {
                        _.extend(this.uiConfig, extendedUIConfig);
                    }
                }
            }

            if (config) {
                _.extend(self, _.omit(config, "properties"));
            }

            var inCreate = true;
            // Left and top
            ko.computed({
                read: function () {
                    var left = properties.left(),
                        top = properties.top();
                    self.$wrapper.css({
                        left: left + "px",
                        top: top + "px"
                    })
                    // Dont trigger the event when the element is initializing
                    if (!inCreate) {
                        self.onMove(left, top);
                    };
                }
            });
            // Width and height
            ko.computed({
                read: function () {
                    var width = properties.width(),
                        height = properties.height();
                    self.resize(width, height);
                    if (!inCreate) {
                        self.onResize(width, height);
                    }

                    inCreate = false;
                }
            });
            // Z Index
            ko.computed({
                read: function () {
                    //避免生成z-index:0
                    var _z = self.properties.zIndex();
                    if (_z > 0) {
                        self.$wrapper.css({
                            'z-index': self.properties.zIndex()
                        })
                    }
                    self.$wrapper.css({
                        "min-width": self.properties.minWidth() + "px",
                        "display": self.properties.displayStr()
                    })
                }
            });
            // rid
            ko.computed({
                read: function () {
                    var _rid = self.properties.rid();

                    if (_rid) {
                        self.$wrapper.attr({
                            'id': self.properties.rid()
                        });
                    } else {
                        self.$wrapper.removeAttr('id');
                    }
                }
            });


            // targetUrl
            ko.computed({
                read: function () {
                    var _url = self.properties.targetUrl();
                    if (_url) {
                        $(self.$wrapper.find("a")[0]).attr({
                            'href': _url
                        });
                    } else {
                        $(self.$wrapper.find("a")[0]).removeAttr('href');
                    }


                }
            });
            // classStr
            ko.computed({
                read: function () {
                    var _cls = self.properties.boxClassStr();
                    if (_cls.indexOf(self.properties.id()) < 0) {
                        _cls += " " + self.properties.id();
                    }
                    self.$wrapper.attr({
                        'class': _cls
                    });

                    var _titleStr = self.properties.titleStr();
                    if (!_titleStr) {
                        self.$wrapper.removeAttr('title');
                    } else {
                        self.$wrapper.attr({
                            'title': _titleStr
                        });
                    }
                }
            });

            function dumpCls(_id, _css) {
                var _ele = document.getElementById(_id);
                if (_ele && _ele.tagName == "STYLE") {
                    $(_ele).html(_css);
                } else {
                    $("head").append("<style id='" + _id + "'>" + _css + "</style>");
                }

            }
            // hoverStr
            ko.computed({
                read: function () {
                    var _hoverStr = self.properties.hoverStr();
                    if ($.trim(_hoverStr).length) {
                        self.$wrapper.attr({
                            'hoverStyle': _hoverStr
                        });
                        var _cls = self.$wrapper.attr("class");
                        var _trimCls = $.trim(self.removeCMPClassForMockCss(_cls)).split(" ").join(".");
                        var _css = "";
                        if (_trimCls.length) {
                            if (_hoverStr.indexOf("{") >= 0) {
                                _css = _hoverStr.replace(/\&/g, "." + _trimCls);
                            } else {
                                _css = "." + _trimCls + ":hover{" + self.getCSS3String(_hoverStr) + "}";
                            }
                            dumpCls(_trimCls, _css.replace(/\>/g, " ").replace(/\;/g, " !important;").replace(/\!important \!important/g, "!important;"));
                        }
                    } else {
                        self.$wrapper.removeAttr('hoverStyle');
                    }
                }
            });
            // newBlank
            ko.computed({
                read: function () {
                    var _newBlank = self.properties.newBlank();
                    var _url = self.properties.targetUrl();
                    if (_url.length) {
                        if (_newBlank) {
                            $(self.$wrapper.find("a")[0]).attr({
                                'target': "_blank"
                            })
                        } else {
                            $(self.$wrapper.find("a")[0]).attr({
                                'target': "_top"
                            })
                        }
                    }
                }
            });
            //overflow
            ko.computed({
                read: function () {
                    var _overflow = self.properties.overflow();
                    switch (_overflow) {
                        case "visiable":
                            self.$wrapper.css({
                                "overflow": "visiable"
                            });
                            break;
                        case "overflowX":
                            self.$wrapper.css({
                                "overflow-x": "hidden"
                            });
                            break;
                        case "overflowY":
                            self.$wrapper.css({
                                "overflow-y": "hidden"
                            });
                            break;
                        case "overflowXY":
                            self.$wrapper.css({
                                "overflow": "hidden"
                            });
                            break;
                    }

                }
            });

            // Border radius
            ko.computed({
                read: function () {
                    var br = self.uiConfig.borderRadius.items;
                    var ma = self.uiConfig.margin.items;
                    var pa = self.uiConfig.padding.items;
                    // var _hasBorderRadius = _.find(br, function (i) {
                    //     return +Math.round(i.value()) > 0;
                    // });
                    // //分开处理border-radius，这样避免生成border-radius: 0px;
                    // if (_hasBorderRadius) {
                    // self.$wrapper.css({
                    //     'border-radius': _.map(br, function (item) {
                    //         return Math.round(item.value()) + "px"
                    //     }).join(" ")
                    // });
                    // }
                    self.$wrapper.css({
                        'border-radius': _.map(br, function (item) {
                            return Math.round(item.value()) + "px"
                        }).join(" "),
                        'margin': _.map(ma, function (item) {
                            return (!isNaN(+item.value()) ? (Math.round(item.value()) + "px") : (item.value()));
                        }).join(" "),
                        'padding': _.map(pa, function (item) {
                            return Math.round(item.value()) + "px"
                        }).join(" ")
                    })
                }
            });
            //Font size and text color
            ko.computed(function () {
                self.$wrapper.css({
                    "color": self.properties.boxColor(),
                    "font-size": self.properties.boxFontSize()
                });
            });
            //animation
            ko.computed(function () {
                var _animateStr = self.properties.animateStr();
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

                if (_animateStr) {
                    if (!self.$wrapper.hasClass("animated")) {
                        self.$wrapper.addClass('animated');
                    }

                    if (self.tempAniStr && self.tempAniStr != _animateStr) {
                        self.$wrapper.removeClass(self.tempAniStr);
                    }
                    self.tempAniStr = _animateStr;
                    self.$wrapper.addClass(_animateStr).one(animationEnd, function () {
                        // $(this).removeClass(_animateStr);
                    });
                }
            });

            // Border
            ko.computed({
                read: function () {
                    // If use Border
                    var borderStyle = self.properties.borderStyle();
                    var borderColor = self.properties.borderColor();
                    var borderAlpha = self.properties.borderAlpha();
                    var _bcolor = onecolor(borderColor);
                    _bcolor._alpha = borderAlpha;
                    var bw = self.uiConfig.borderWidth.items;

                    if (borderStyle) {

                        // Border color
                        self.$wrapper.css({
                            'border-style': borderStyle
                        });
                        self.$wrapper.css({
                            'border-color': _bcolor.cssa()
                        });
                        self.$wrapper.css({
                            'border-width': _.map(bw, function (item) {
                                return Math.round(item.value()) + "px"
                            }).join(" ")
                        });
                    } else {
                        self.$wrapper.css({
                            'border': ""
                        });
                    }
                }
            });
            // Background
            ko.computed({
                read: function () {
                    // If use background
                    var useBackground = self.properties.background();
                    var backgroundColor = self.properties.backgroundColor();
                    var backgroundAlpha = self.properties.backgroundAlpha();
                    var _bcolor = onecolor(backgroundColor);
                    _bcolor._alpha = backgroundAlpha;
                    var backgroundImageStr = self.properties.backgroundImageStr();
                    if (useBackground) {
                        // Background color

                        self.$wrapper.css({
                            "background-color": _bcolor.cssa(),

                        });
                        // No background image
                        switch (self.properties.backgroundImageType()) {
                            case "none":
                                self.$wrapper.css({
                                    'background-image': ''
                                });
                                break;
                            case 'gradient':
                                // Gradient background image
                                var stops = self.properties.backgroundGradientStops();
                                var angle = self.properties.backgroundGradientAngle();
                                var cssStr = 'linear-gradient(' + angle + 'deg, ' +
                                    _.map(stops, function (stop) {
                                        return onecolor(stop.color()).cssa() +
                                            ' ' +
                                            Math.round(stop.percent() * 100) + '%';
                                    }).join(", ") + ')';

                                self.$wrapper.css({
                                    'background-image': '-webkit-' + cssStr,
                                    'background-image': '-moz-' + cssStr,
                                    'background-image': cssStr
                                });
                                break;
                            case 'file':
                                if (backgroundImageStr.indexOf("url") >= 0) {
                                    self.$wrapper.css({
                                        'background': backgroundImageStr
                                    });
                                } else {
                                    self.$wrapper.css({
                                        'background': "url('" + backgroundImageStr + "')"
                                    });
                                }
                                break;
                        }
                    } else {
                        self.$wrapper.css({
                            'background': ''
                        })
                    }
                }
            });

            function isCode(str) {
                return str.indexOf("<") >= 0 || str.indexOf(".") >= 0;
            }

            // Hover效果
            ko.computed({
                read: function () {
                    var _hover = self.properties.hover();
                    var _hoverComponent = self.properties.hoverComponent();

                    if (_hover) {
                        if (isCode(_hoverComponent)) {
                            self.$wrapper.find(".e-hover-code").remove();
                            self.$wrapper.find(".e-hover-target").remove();
                            self.$wrapper.append($("<div></div>").append($("<div></div>").addClass("e-hover-code").append(_hoverComponent)).html());
                            self.$wrapper.css({
                                'cursor': 'auto'
                            });
                        } else {
                            self.$wrapper.find(".e-hover-code").remove();
                            self.$wrapper.find(".e-hover-target").remove();
                            if (self.properties.boxClassStr().indexOf("e-hover-source") < 0) {
                                self.properties.boxClassStr(self.properties.boxClassStr() + " e-hover-source");
                            }
                            self.$wrapper.css({
                                'cursor': 'pointer'
                            });
                            self.$wrapper.append(hoverHtml);
                            if (_hover == "left") {
                                self.$wrapper.find(".e-hover-target").addClass("left");
                            }
                            if (_hover == "right") {
                                self.$wrapper.find(".e-hover-target").addClass("right");
                            }
                            // $(document.body).append("<style>" + hoverCss + "</style>");
                            if (_hoverComponent) {
                                self.trigger("addHoverComponent", _hoverComponent, self.$wrapper.find(".e-hover-content"), _hover);
                            }
                        }
                    } else {
                        self.$wrapper.removeClass("e-hover-source");
                        self.$wrapper.find(".e-hover-target").remove();
                        self.$wrapper.find(".e-hover-code").remove();
                    }
                }
            });

            // Shadow
            ko.computed({
                read: function () {
                    var props = self.properties;
                    var shadowOffsetX = Math.round(props.shadowOffsetX()) + "px",
                        shadowOffsetY = Math.round(props.shadowOffsetY()) + "px",
                        shadowBlur = Math.round(props.shadowBlur()) + "px",
                        shadowColor = Math.round(props.shadowColor()),
                        shadowColorAlpha = props.shadowColorAlpha();
                    var _scolor = onecolor(shadowColor);
                    _scolor._alpha = shadowColorAlpha;

                    if (shadowBlur && props.hasShadow()) {
                        self.$wrapper.css({
                            'box-shadow': [shadowOffsetX, shadowOffsetY, shadowBlur, _scolor.cssa()].join(' ')
                        })
                    } else {
                        self.$wrapper.css({
                            'box-shadow': ''
                        })
                    }
                }
            });
            // 位置处理
            ko.computed({
                read: function () {
                    var _float = self.properties.floatStr();
                    if (self.properties.positionStr() != "relative") {
                        self.properties.floatStr("");
                    }
                    if (_float == "both") {
                        self.$wrapper.css({
                            'clear': "both"
                        });
                    } else {
                        self.$wrapper.css({
                            'position': self.properties.positionStr(),
                            'float': self.properties.floatStr(),
                            'clear': 'none'
                        })
                    }
                }
            });
            // 修改类型
            ko.computed({
                read: function () {
                    self.type = self.properties.typeStr();
                }
            });
            //事件处理
            ko.computed({
                read: function () {
                    var _eventName = self.properties.eventName();
                    var _eventHandler = self.properties.eventHandler();
                    if (_eventName) {
                        self.tempEventName = _eventName;
                        self.$wrapper.attr("on-" + _eventName, "{" + _eventHandler + "}");
                    } else {
                        self.$wrapper.removeAttr("on-" + self.tempEventName);
                        self.tempEventName = "";
                    }
                }
            });

            // ga 打点
            ko.computed({
                read: function () {
                    var _dataCate = self.properties.dataCate();
                    var _dataAction = self.properties.dataAction();
                    var _dataLabel = self.properties.dataLabel();
                    if (_dataCate) {
                        self.$wrapper.attr({
                            'data-cate': _dataCate
                        })
                    }
                    if (_dataAction) {
                        self.$wrapper.attr({
                            'data-action': _dataAction
                        })
                    }
                    if (_dataLabel) {
                        self.$wrapper.attr({
                            'data-label': _dataLabel
                        })
                    }
                    if (_dataCate || _dataAction || _dataLabel) {
                        if (self.properties.boxClassStr().indexOf("ga-click") < 0)
                            self.properties.boxClassStr(self.properties.boxClassStr() + " ga-click");
                    }
                }
            });

            self.$wrapper.css({
                'position': "absolute"
            })

            this.properties.boxClassStr("cmp-element cmp-" + (this.type || "element").toLowerCase() + " " + this.properties.boxClassStr());

            this.onCreate(this.$wrapper);

            if (!this.properties.id()) {
                this.properties.id(genID(this.type || "element"))
            }

        },

        syncPositionManually: function () {
            var left = parseInt(this.$wrapper.css("left"));
            var top = parseInt(this.$wrapper.css("top"));
            this.properties.left(left);
            this.properties.top(top);
        },

        resize: function (width, height) {
            this.$wrapper.width(width);
            this.$wrapper.height(height);
            this.$wrapper.find("a").height(height);
        },

        rasterize: function () {},

        export: function () {
            var json = {
                eid: this.eid,
                type: this.type,
                properties: koMapping.toJS(this.properties),
                assets: {
                    // key is the image name
                    // value is the image base64 Url
                    images: {}
                }
            };

            this.onExport(json);

            return json;
        },
        isContainer: function () {
            return this.properties.id().indexOf("container") < 0 ? false : true;
        },
        isCache: function () {
            return this.type == "FUNC" && this.properties.funcType() == "CACHE";
        },
        exportCache: function () {
            var _cacheItem = "";
            var _cacheItemCall = "";
            if (this.properties.requestType() != "dwr") {
                _cacheItem = cacheItem.replace(/\_\_name\_\_/g, this.properties.requestName()).replace(/\_\_url\_\_/g, this.properties.requestUrl()).replace(/\_\_method\_\_/g, this.properties.requestType());
            } else {
                _cacheItem = dwrItem.replace(/\_\_name\_\_/g, this.properties.requestName()).replace(/\_\_url\_\_/g, this.properties.requestUrl());
            }

            _cacheItemCall = callCache.replace(/\_\_funcName\_\_/g, this.properties.requestName()).replace(/\_\_reqData\_\_/g, this.properties.requestParam()).replace(/\_\_cb\_\_/g, this.properties.onLoadFunc());
            return {
                'cacheItem': _cacheItem,
                'cacheItemCall': _cacheItemCall
            };
        },
        getLeft: function () {
            return this.properties.left();
        },
        getTop: function () {
            return this.properties.top();
        },
        getZ: function () {
            return this.properties.zIndex();
        },
        setLeft: function (left) {
            this.properties.left(left);
        },
        setTop: function (top) {
            this.properties.top(top);
        },
        setZ: function (z) {
            this.properties.zIndex(z);
        },
        setPosition: function (pos) {
            this.$wrapper.css({
                "position": pos
            })
        },
        getName: function () {
            var _id = this.properties.id();
            if (this.isContainer()) {
                return _id.substring(0, _id.indexOf("container") - 1);
            } else {
                return _id;
            }

        },
        //剥离css样式
        getCss: function (_element, pclass, _css) {
            if (_element.children().length < 1) {
                return;
            }
            var that = this,
                _style = "",
                _className = pclass,
                _classStr = "";

            $.each(_element.children(), function (key, value) {
                _classStr = $(value).attr("class");
                if (_classStr) {
                    var _trimCls = $.trim(that.removeCMPClass(_classStr));
                    if (_trimCls.length) {
                        $(value).attr({
                            "class": _trimCls
                        });
                    } else {
                        $(value).removeAttr("class");
                    }
                }
                _style = $(value).attr("style");

                _classStr = $(value).attr("class");
                _className = pclass + " > " + ((_classStr && _classStr.length) ? ("." + $.trim(that.removeCMPClassForMockCss(_classStr)).split(" ").join(".")) : $(value).prop("tagName").toLowerCase());
                if (_style) {
                    // _className = pclass + "_" + $(value).prop("tagName").toLowerCase() + genExID();
                    //检查有没有使用rgba作为颜色值，在IE8需要转换（目前只处理background，其他颜色暂不处理）
                    var _result = _rgbaBacReg.exec(_style);
                    if (_result && (+_result[1].split(",")[3]) > 0) {
                        _style = "background-color:rgb(" + _result[1].split(",").slice(0, 3).join(",") + ");filter:alpha(opacity=" + (+_result[1].split(",")[3]) * 100 + ");" + _style;
                    }
                    _css.push(_className + "{" + _style + "}");
                    var _hoverstyle = $(value).attr("hoverstyle");
                    if (_hoverstyle) {
                        if (_hoverstyle.indexOf("{") >= 0) {
                            //parent中已经添加过.前缀了
                            _css.push(_hoverstyle.replace(/\&/g, _className));
                        } else {
                            //parent中已经添加过.前缀了
                            _css.push(_className + ":hover{" + that.getCSS3String(_hoverstyle) + "}");
                        }

                        $(value).removeAttr("hoverstyle");
                    }
                    $(value).removeAttr("style");
                    // $(value).addClass(_className);
                }

                that.getCss($(value), _className, _css);

            });

        },
        getHTMLCSS: function (_html, pclass) {
            var _ele = $("<div></div>").append(_html);
            var _css = [];

            this.getCss(_ele, pclass, _css);

            return {
                "html": _ele.html(),
                "css": _css.join("")
            }

        },
        removeCMPClassForMockCss: function (_classStr) {
            // 移除 aa${xx.xx}bb 这种拼接的类
            _classStr = $.trim(_classStr.replace("ga-click", "").replace("f-dn", "")
                .replace(/ [\s\S]*?\$?\{[\s\S]*?\}[\s\S]*?/g, " ")
                .replace(/animated[\s\S]* ?/g, " ")
                .replace(/\<[\s\S]*?\>[\s\S]*?\<\/[\s\S]*?\>/g, " ")
                .replace(/\{[\s\S]*?\}[\s\S]*?\{\/[\s\S]*?\}/g, " ")
                .replace(/\s+/g, " "));

            //去除cmp qpf
            _.each(_classStr.split(" "), function (item, key) {
                if (item.indexOf("cmp") >= 0 || item.indexOf("qpf") >= 0) {
                    _classStr = _classStr.replace(item, "");
                }
            });
            _classStr = _classStr.replace(/\s+/g, " ");
            return $.trim(_classStr);
        },
        removeCMPClass: function (_classStr) {
            // 这里不能移除 aa${xx.xx}bb 这种拼接的类，因为生成的时候需要这些类
            _classStr = $.trim(_classStr);
            //去除cmp qpf
            _.each(_classStr.split(" "), function (item, key) {
                if (item.indexOf("cmp") >= 0 || item.indexOf("qpf") >= 0) {
                    _classStr = _classStr.replace(item, "");
                }
            });
            _classStr = _classStr.replace(/\s+/g, " ");
            return $.trim(_classStr);
        },
        /**
         * _str:  "box-shadow: @args;"
         * 
         * @return 
         * -webkit-box-shadow: @args;
         * -moz-box-shadow: @args;
         * box-shadow: @args;
         */
        getCSS3String: function (_str) {
            //todo: 处理css3的属性，需要写个算法，把所有匹配css3的属性统一处理
            return _str.replace(/(box\-shadow|transition):[\s\S]*?\;/g, function (m) {
                var _m = m.split(":");
                return "-webkit-" + _m[0] + ":" + _m[1] + "-moz-" + _m[0] + ":" + _m[1] + "-o-" + _m[0] + ":" + _m[1] + _m[0] + ":" + _m[1];
            });
        },
        exportHTMLCSS: function (_pcls) {
            //每个元素添加className
            this.$wrapper.find(".element-select-outline").remove();
            var _html = "",
                _type = this.type,
                _classStr = this.properties.boxClassStr(),
                _hoverStr = this.properties.hoverStr(),
                _titleStr = this.properties.titleStr(),
                _animateStr = this.properties.animateStr(),
                _rid = this.properties.rid(),
                _idStr = "",
                _css = "",
                _wrapHtml = this.$wrapper.html();

            //动画样式
            if (_animateStr != "none") {
                _css += animationJson.common;
                _css += animationJson.list[_animateStr];
                _classStr = this.removeCMPClass(_classStr) + " animated " + _animateStr;

            } else {
                _classStr = this.removeCMPClass(_classStr);
            }
            if (_wrapHtml.indexOf("animated") >= 0) {
                Modal.confirm("提示", "组件嵌套中含有动画，请下载<a style='color:#fff;' href='style/lib/animate.min.css' target='_blank'>animate.min.css</a>样式和滚动加载动画处理函数<a style='color:#fff;' href='style/lib/animate.js' target='_blank'>animate.js</a>");
            }

            if (_rid) {
                _idStr = " id='" + _rid + "'";
            }

            var _tempHtmlCss = {};

            if (!this.$wrapper.hasClass("e-hover-source") && !this.$wrapper.hasClass("cmp-func") && !this.$wrapper.find("a").attr("href")) {
                // 如果超链接没有内容而且不是hover，那么去掉超链接
                _tempHtmlCss = this.getHTMLCSS(this.$wrapper.find("a").length ? this.$wrapper.find("a").html() : _wrapHtml, "." + this.properties.id());
            } else {
                _tempHtmlCss = this.getHTMLCSS(_wrapHtml, "." + this.properties.id());

            }
            // 已在处理
            // if (this.type == "FUNC" && this.properties.funcType() == "IF" && this.properties.falseFuncBody().length < 1) {
            //     //处理一种特殊情况，就是只有if true，没有false，控制某个元素展示或者不展示
            //     _html = _tempHtmlCss["html"].replace(/{#else}.*{\/if}/g, "{\/if}");

            //     _css = _tempHtmlCss["css"];


            // } else 
            if (this.type == "FUNC" && this.properties.funcType() == "CACHE") {
                _html = "";
                _css = "";
            } else {

                _html = "<div" + _idStr + " class='" + this.properties.id() + " " + _classStr + "'";
                var _eventName = this.properties.eventName();
                var _eventHandler = this.properties.eventHandler();
                if (_eventName) {
                    _html += " on-" + _eventName + "={" + _eventHandler + "}";
                }
                // 处理打点GA需求
                var _dataCate = this.properties.dataCate().replace(/\"/g, "\'");
                var _dataAction = this.properties.dataAction().replace(/\"/g, "\'");
                var _dataLabel = this.properties.dataLabel().replace(/\"/g, "\'");
                if (_dataCate) {
                    _html += ' data-cate="' + _dataCate + '" ';
                }
                if (_dataAction) {
                    _html += ' data-action="' + _dataAction + '" ';
                }
                if (_dataLabel) {
                    _html += ' data-label="' + _dataLabel + '" ';
                }
                // 处理title，增加提示信息
                if (_titleStr) {
                    _html += ' title="' + _titleStr + '" ';
                }
                _html += ">" + _tempHtmlCss["html"] + "</div>";

                _css += _tempHtmlCss["css"];

                var _cstyle = this.$wrapper.attr("style");
                //自身的wraper样式
                if (this.isContainer()) {
                    _cstyle = _cstyle.replace("absolute", "relative");
                }
                //检查有没有使用rgba作为颜色值，在IE8需要转换（目前只处理background，其他颜色暂不处理）
                var _result = _rgbaBacReg.exec(_cstyle);
                if (_result && (+_result[1].split(",")[3]) > 0) {
                    _cstyle = "background-color:rgb(" + _result[1].split(",").slice(0, 3).join(",") + ");filter:alpha(opacity=" + (+_result[1].split(",")[3]) * 100 + ");" + _cstyle;
                }
                if (_pcls) {
                    _pcls = $.trim(_pcls.replace(/\<[\s\S]*?\>/g, " ").replace(/\s+/g, " "));
                    _css += ("." + _pcls + ">." + this.properties.id() + " {" + _cstyle + "}");
                } else {
                    _css += ("." + this.properties.id() + " {" + _cstyle + "}");
                }

                // hover样式
                if (_hoverStr) {
                    if (_hoverStr.indexOf("{") >= 0) {
                        _css += _hoverStr.replace(/\&/g, "." + this.properties.id());
                        _css = this.getCSS3String(_css);
                    } else {
                        _css += "." + this.properties.id() + ":hover {" + this.getCSS3String(_hoverStr) + "}"
                    }
                }
            }

            if (_wrapHtml.indexOf("e-hover-target") >= 0 || _wrapHtml.indexOf("e-hover-code") >= 0) {
                _css += hoverCss;
            }
            // f-line f-2lines f-3lines f-4lines
            if (/.*f-.?line.*/g.test(_wrapHtml)) {
                _css += baseCss;
            }
            _html = _html.replace(/data-cmp-eid\=\"(\d*)\"/g, "").replace(/\s+\'/g, "\'");
            return {
                "html": _html,
                "css": _css
            }
        },

        import: function (json) {
            koMapping.fromJS(json.properties, {}, this.properties);
            delete this.properties['__ko_mapping__'];
            // if (this.isContainer()) {
            //     this.$wrapper.css({
            //         position: "relative"
            //     });
            // } else {
            //     this.$wrapper.css({
            //         position: "absolute"
            //     });
            // }
            this.onImport(json);
        },

        makeAsset: function (type, name, data, root) {
            var globalName = this.eid + "#" + name;
            if (!root[type]) {
                root[type] = {};
            }
            root[type][globalName] = {
                data: data,
                type: type
            };
            return "url(" + type + "/" + globalName + ")";
        },

        build: function () {}
    });

    var id = {};

    function genID(type) {
        if (!id[type]) {
            id[type] = 0;
        }
        return type + "_" + id[type]++;
    }

    var eid = 1;

    function genEID() {
        return eid++;
    }

    var exportId = 1;

    function genExID() {
        return exportId++;
    }

    return Element;
})
