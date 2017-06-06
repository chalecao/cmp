/**
 * Textfiled component
 *
 * @VMProp text
 * @VMProp placeholder
 *
 */
define(function (require) {

    var qpf = require("qpf");
    var Meta = qpf.use("meta/meta");
    var ko = require("knockout");
    var _ = require("_");

    var CodeArea = Meta.derive(function () {
        return {
            tag: "div",

            text: ko.observable(""),
            mod: ko.observable(""),

            placeholder: ko.observable("")
        };
    }, {

            type: "CODEAREA",

            css: 'codearea',

            template: '<textarea rows="5" cols="24" data-bind="value:text"/>',

            onResize: function () {
                this.$el.find("textarea").width(this.width());
                Meta.prototype.onResize.call(this);

                var self = this;
                this.$el.parent().parent().css("margin-left", "0");
                this.$el.parent().parent().css("margin-right", "0");
                this.$el.parent().parent().css("margin-top", "20px");
                this.$el.css("width", "100%");
                var _cm = this._cm = CodeMirror.fromTextArea(
                    this.$el.find("textarea")[0], {
                        lineNumbers: false,
                        styleActiveLine: true,
                        lineWrapping: true,
                        mode: self.mod() || 'css',
                        autofocus: true,
                        indentUnit: 4,
                        tabSize: 4
                    }
                );
                _cm.setOption('theme', 'monokai');
                _cm.doc.setCursor(_cm.doc.lastLine() + 1);
                // setTimeout(function () {
                //     _cm.refresh();
                // }, 300);

                self.text(self.text() + "");
                _cm.on("keyup", function (_cmm, _keyEvent) {
                    self.text(_cmm.doc.getValue());
                });
            }
        })

    Meta.provideBinding("codearea", CodeArea);

    return CodeArea;
})
