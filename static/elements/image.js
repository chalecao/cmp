define(function(require) {

    var factory = require("core/factory");
    var ko = require("knockout");
    var _ = require("_");

    factory.register("image", {
        type: "IMAGE",
        extendProperties: function() {
            return {
                src: ko.observable(""),
                alt: ko.observable(""),
            }
        },
        extendUIConfig: function() {
            return {
                text: {
                    label: "图片地址",
                    ui: "textfield",
                    text: this.properties.src
                },
                alt: {
                    label: "alt内容",
                    ui: "textfield",
                    text: this.properties.alt
                }
            }
        },
        onCreate: function($wrapper) {
            var img = document.createElement("img");
            var self = this;

            var updateImageSize = _.debounce(function(width, height) {
                img.width = width;
                img.height = height;
            }, 1);
            // Size of image;
            ko.computed(function() {
                var width = self.properties.width(),
                    height = self.properties.height();

                if (img.src && img.complete) {
                    updateImageSize(width, height);
                }
                img.alt = self.properties.alt();
            });
            ko.computed(function() {
                img.onload = function() {
                    var width = img.width,
                        height = img.height;

                    !self.properties.width() && self.properties.width(width);
                    !self.properties.height() && self.properties.height(height);
                    updateImageSize(self.properties.width(), self.properties.height());
                    img.onload = null;
                }
                img.src = self.properties.src();
                updateImageSize(self.properties.width(), self.properties.height());

            });
            // Border radius
            ko.computed({
                read: function() {
                    var br = self.uiConfig.borderRadius.items;

                    $(img).css({
                        'border-radius': _.map(br, function(item) {
                            return item.value() + "px"
                        }).join(" ")
                    })
                }
            });
            if ($wrapper.find("a").length) {
                $($wrapper.find("a")[0]).append(img);
            } else {
                $wrapper.append(img);
            }

        },

        onExport: function(json) {
            // json.properties.src = this.makeAsset("image", "src", json.properties.src, json.assets);

        }
    })
})