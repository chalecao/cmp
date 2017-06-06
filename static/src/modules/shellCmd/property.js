define(function (require) {

    var qpf = require("qpf");
    var ko = require("knockout");
    var Container = qpf.use("container/container");
    var Widget = qpf.widget.Widget;

    var ShellCmd = Widget.derive(function () {
        return {
            codeStr: ko.observable(""),
            classStr: ko.observable(""),
            titleStr: ko.observable("")
        }
    }, {
        type: 'SHELLCMD',

        css: 'shellcmd',

        template: require("text!./property.html"),

    })
    Container.provideBinding("shellcmd", ShellCmd);
    return ShellCmd;
})
