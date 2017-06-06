define(function (require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    var _ = require("_");

    factory.register("image", {
        type: "IMAGE",
        extendProperties: function () {
            return {
                src: ko.observable(""),
                alt: ko.observable(""),
                classStr: ko.observable(""),
            }
        },
        extendUIConfig: function () {
            return {
                src: {
                    label: "图片地址",
                    ui: "textfield",
                    text: this.properties.src
                },
                alt: {
                    label: "alt内容",
                    ui: "textfield",
                    text: this.properties.alt
                },
                classStr: {
                    label: "class",
                    ui: "textfield",
                    text: this.properties.classStr
                },
            }
        },
        onCreate: function ($wrapper) {
            var img = document.createElement("img");
            var self = this;

            var updateImageSize = function (width, height) {
                img.width = width;
                img.height = height;
                //添加style width h和heigh，因为ie8不支持img的width和height缩放
                $(img).css({
                    'width': width,
                    'height': height
                })
            };
            // Size of image;

            var width = self.properties.width(),
                height = self.properties.height();

            updateImageSize(width, height);
            img.alt = self.properties.alt();

            ko.computed(function () {
                img.onload = function () {
                    var width = img.width,
                        height = img.height;

                    if (!self.properties.width()) {
                        self.properties.width(width)
                    };
                    if (!self.properties.height()) {
                        self.properties.height(height)
                    };
                    updateImageSize(self.properties.width(), self.properties.height());
                    img.onload = null;
                }
                img.src = self.properties.src();
                var _size = self.uiConfig.size.items;

                updateImageSize(_size[0].value(), _size[1].value());

            });
            // Border radius
            ko.computed({
                read: function () {
                    var br = self.uiConfig.borderRadius.items;
                    var _alt = self.properties.alt();
                    $(img).css({
                        'border-radius': _.map(br, function (item) {
                            return item.value() + "px"
                        }).join(" ")
                    })
                    if (_alt) {
                        $(img).attr({
                            "alt": _alt
                        });
                    } else {
                        $(img).removeAttr("alt");
                    }
                }
            });
            //classStr
            ko.computed(function () {
                var classStr = self.properties.classStr();
                if (classStr) {
                    $(img).addClass(classStr);
                }

            });
            ko.computed(function () {
                var width = self.properties.width();
                var height = self.properties.height();
                updateImageSize(width, height);

            });

            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append(img);
            } else {
                $wrapper.append(img);
            }

        },

        onExport: function (json) {
            // json.properties.src = this.makeAsset("image", "src", json.properties.src, json.assets);

        }
    })
})
