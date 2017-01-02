define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var $ = require("$");
    var _ = require("_");
    var onecolor = require("onecolor");
    var koMapping = require("ko.mapping");

    var command = require("./command");

    var hoverHtml = require("text!template/hover/hover.html");
    var hoverCss = require("text!template/hover/hover.css");

    var cacheItem = require("text!template/cache/cacheItem.js");
    var dwrItem = require("text!template/cache/dwrItem.js");
    var callCache = require("text!template/cache/callCache.js");

    var Draggable = qpf.helper.Draggable;

    var Element = qpf.core.Clazz.derive(function () {

        var hasBackground = ko.observable(false);
        var hasBorder = ko.observable(false);
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

            name: "",
            icon: "",

            eid: genEID(),

            $wrapper: $("<div><a style='display:inline-block;width:100%;'></a></div>"),

            type: "ELEMENT",

            // Properties view model
            properties: {
                id: ko.observable(""),
                rid: ko.observable(""),

                width: ko.observable(100),
                height: ko.observable(100),
                left: ko.observable(0),
                top: ko.observable(0),

                zIndex: ko.observable(0),

                boxColor: ko.observable("#000000"),
                //-------------------
                // border
                border: hasBorder,
                borderColor: ko.observable(0x55b929),

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
                marginTop: ko.observable(0),
                marginRight: ko.observable(0),
                marginBottom: ko.observable(0),
                marginLeft: ko.observable(0),
                //-------------------
                // padding
                paddingTop: ko.observable(0),
                paddingRight: ko.observable(0),
                paddingBottom: ko.observable(0),
                paddingLeft: ko.observable(0),


                //-------------------
                // Shadow
                hasShadow: ko.observable(false),
                shadowOffsetX: ko.observable(0),
                shadowOffsetY: ko.observable(0),
                shadowBlur: ko.observable(10),
                shadowColor: ko.observable(0),
                shadowColorAlpha: ko.observable(1),
                boxFontSize: ko.observable(16),

                //-------------------
                // link related
                newBlank: ko.observable(false),
                targetUrl: ko.observable(""),

                //-------------------
                // class related
                boxClassStr: ko.observable(""),

                //-------------------
                // ftl include related
                include: ko.observable(""),

                //-------------------
                //overflow related
                overflowX: ko.observable(false),
                overflowY: ko.observable(false),

                //-------------------
                //hover related
                hover: ko.observable(false),
                hoverComponent: ko.observable(""),

            },

            onResize: function () {},
            onMove: function () {},

            onCreate: function () {},
            onRemove: function () {},

            onExport: function () {},
            onImport: function () {},

            onOutput: function () {}

        }

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
                    type: "spinner",
                    value: props.left,
                    precision: 0,
                    step: 1
                }, {
                    name: "top",
                    type: "spinner",
                    value: props.top,
                    precision: 0,
                    step: 1
                }]
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


            border: {
                label: "边框",
                ui: "checkbox",
                field: "style",
                checked: hasBorder
            },

            borderColor: {
                label: "边框色",
                ui: "color",
                field: "style",
                color: props.borderColor,
                visible: hasBorder
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
                label: "background",
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
                    type: "slider",
                    value: props.marginTop,
                    precision: 0,
                    step: 1,
                    min: -100
                }, {
                    name: "right",
                    type: "textfield",
                    text: props.marginRight,
                    value: props.marginRight,

                }, {
                    name: "bottom",
                    type: "slider",
                    value: props.marginBottom,
                    precision: 0,
                    step: 1,
                    min: -100
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
                    type: "slider",
                    value: props.paddingTop,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "right",
                    type: "slider",
                    value: props.paddingRight,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "bottom",
                    type: "slider",
                    value: props.paddingBottom,
                    precision: 0,
                    step: 1,
                    min: 0
                }, {
                    name: "left",
                    type: "slider",
                    value: props.paddingLeft,
                    precision: 0,
                    step: 1,
                    min: 0
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
                max: 100,
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
                    min: -100,
                    max: 100,
                    precision: 0,
                    value: props.shadowOffsetX
                }, {
                    name: "shadowOffsetY",
                    type: "slider",
                    min: -100,
                    max: 100,
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
                label: "Box大小",
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
                ui: "textfield",
                field: "style",
                text: props.boxClassStr
            },
            include: {
                label: "ftl引入",
                ui: "textfield",
                text: props.include
            },
            overflowX: {
                label: "overflowX",
                ui: "checkbox",
                field: 'layout',
                checked: props.overflowX
            },
            overflowY: {
                label: "overflowY",
                ui: "checkbox",
                field: 'layout',
                checked: props.overflowY
            },
            hover: {
                label: "Hover",
                ui: "checkbox",
                field: 'layout',
                checked: props.hover
            },
            hoverComponent: {
                label: "HoverC",
                ui: "textfield",
                field: 'layout',
                text: props.hoverComponent
            },
        };

        return ret;
    }, {

        initialize: function (config) {

            this.$wrapper.attr("data-epage-eid", this.eid);

            var self = this,
                properties = self.properties;


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
                    self.$wrapper.css({
                        'z-index': self.properties.zIndex()
                    })
                }
            });
            // rid
            ko.computed({
                read: function () {
                    self.$wrapper.attr({
                        'id': self.properties.rid()
                    })
                }
            });


            // targetUrl
            ko.computed({
                read: function () {
                    var _url = self.properties.targetUrl();
                    if (_url) {
                        $(self.$wrapper.find("a")[0]).attr({
                            'href': _url
                        })
                    } else {
                        $(self.$wrapper.find("a")[0]).removeAttr('href');
                    }


                }
            });
            // classStr
            ko.computed({
                read: function () {
                    var _cls = self.properties.boxClassStr();
                    self.$wrapper.attr({
                        'class': _cls
                    });
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
                    var _overflowX = self.properties.overflowX();
                    var _overflowY = self.properties.overflowY();
                    if (_overflowX && _overflowY) {
                        self.$wrapper.css({
                            "overflow": "hidden"
                        });
                    }
                    if (_overflowX) {
                        self.$wrapper.css({
                            "overflow-x": "hidden"
                        });
                    } else {
                        self.$wrapper.css({
                            "overflow-x": ""
                        });
                    }
                    if (_overflowY) {
                        self.$wrapper.css({
                            "overflow-y": "hidden"
                        });
                    } else {
                        self.$wrapper.css({
                            "overflow-y": ""
                        });
                    }

                }
            });

            // Border radius
            ko.computed({
                read: function () {
                    var br = self.uiConfig.borderRadius.items;
                    var ma = self.uiConfig.margin.items;
                    var pa = self.uiConfig.padding.items;

                    self.$wrapper.css({
                        'border-radius': _.map(br, function (item) {
                            return Math.round(item.value()) + "px"
                        }).join(" "),
                        'margin': _.map(ma, function (item) {
                            return (typeof item.value() == "number") ? (Math.round(item.value()) + "px") : (item.value()+ "px");
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

            // Border
            ko.computed({
                read: function () {
                    // If use Border
                    var hasBorder = self.properties.border();
                    var borderColor = self.properties.borderColor();
                    if (hasBorder) {
                        // Border color
                        self.$wrapper.css({
                            'border': "1px solid " + onecolor(borderColor).css()
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
                            'background-color': _bcolor.cssa(),
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
                                self.$wrapper.css({
                                    'background': backgroundImageStr
                                });
                                break;
                        }
                    } else {
                        self.$wrapper.css({
                            'background': ''
                        })
                    }
                }
            });

            // Hover效果
            ko.computed({
                read: function () {
                    var _hover = self.properties.hover();
                    var _hoverComponent = self.properties.hoverComponent();

                    if (_hover) {
                        self.$wrapper.find(".e-hover-target").remove();
                        if (self.properties.boxClassStr().indexOf("e-hover-source") < 0) {
                            self.properties.boxClassStr(self.properties.boxClassStr() + " e-hover-source");
                        }
                        self.$wrapper.css({
                            'cursor': 'pointer'
                        });
                        self.$wrapper.append(hoverHtml);
                        $(document.body).append("<style>" + hoverCss + "</style>");
                        if (_hoverComponent) {
                            self.trigger("addHoverComponent", _hoverComponent, self.$wrapper.find(".e-hover-content"));
                        }
                    } else {
                        self.$wrapper.removeClass("e-hover-source");
                        self.$wrapper.find(".e-hover-target").remove();
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
            })

            this.$wrapper.css({
                position: "absolute"
            });

            this.properties.boxClassStr("epage-element epage-" + this.type.toLowerCase());

            this.onCreate(this.$wrapper);

            if (!this.properties.id()) {
                this.properties.id(genID(this.type))
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
        setLeft: function (left) {
            this.properties.left(left);
        },
        setTop: function (top) {
            this.properties.top(top);
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
                return "example";
            }

        },
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
                    $(value).attr({
                        "class": that.removeEpageClass(_classStr)
                    });
                }
                _style = $(value).attr("style");
                if (_style) {
                    _className = pclass + "_" + $(value).prop("tagName").toLowerCase() + key;
                    _css.push("." + _className + "{" + _style + "}");
                    $(value).removeAttr("style");
                    $(value).addClass(_className);
                } else {
                    _className = $(value).attr("class");
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
        removeEpageClass: function (_classStr) {
            _classStr = $.trim(_classStr);
            //去除epage qpf
            _.each(_classStr.split(" "), function (item, key) {
                if (item.indexOf("epage") >= 0 || item.indexOf("qpf") >= 0) {
                    _classStr = _classStr.replace(item, "");
                }
            });
            _classStr = _classStr.replace(/\s+/g, " ");
            return _classStr;
        },
        exportHTMLCSS: function () {
            //每个元素添加className
            this.$wrapper.find(".element-select-outline").remove();
            var _html = "",
                _include = this.properties.include(),
                _type = this.type,
                _classStr = this.properties.boxClassStr(),
                _rid = this.properties.rid(),
                _idStr = "",
                _css = "";
            if (_rid) {
                _idStr = " id='" + _rid + "'";
            }
            _classStr = this.removeEpageClass(_classStr);
            var _tempHtmlCss = {},
                _tempFTL = "";

            if (_include) {
                // 如果填写了ftl include
                _html = "<div" + _idStr + " class='" + this.properties.id() + " " + _classStr + "'><#include '" + _include + "'/></div>";
            } else {
                if (!this.$wrapper.hasClass("e-hover-source") && !this.$wrapper.hasClass("epage-func") && !this.$wrapper.find("a").attr("href")) {
                    // 如果超链接没有内容而且不是hover，那么去掉超链接
                    _tempHtmlCss = this.getHTMLCSS(this.$wrapper.find("a").html(), this.properties.id());
                } else {
                    _tempHtmlCss = this.getHTMLCSS(this.$wrapper.html(), this.properties.id());

                }
                _html = "<div" + _idStr + " class='" + this.properties.id() + " " + _classStr + "'>" + _tempHtmlCss["html"] + "</div>";
                _css += _tempHtmlCss["css"];
            }
            //wraper的样式
            _css += "." + this.properties.id() + " {" + this.$wrapper.attr("style") + "}";

            if (this.$wrapper.hasClass("e-hover-source")) {
                _css += hoverCss;
            }
            _html = _html.replace(/data-epage-eid\=\"(\d*)\"/g, "").replace(/\s+\'/g, "\'");
            return {
                "html": _html,
                "css": _css
            }
        },

        import: function (json) {
            koMapping.fromJS(json.properties, {}, this.properties);
            delete this.properties['__ko_mapping__'];
            if (this.isContainer()) {
                this.$wrapper.css({
                    position: "relative"
                });
            } else {
                this.$wrapper.css({
                    position: "absolute"
                });
            }
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

    return Element;
})