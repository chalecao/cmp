define(function(require) {

    var qpf = require("qpf");
    var _ = require("_");

    var appXML = require("text!modules/app.xml");
    var router = require("modules/router");
    var controllerConfig = require("./controllerConfig");
    var Event = qpf.use("core/mixin/event");

    function start() {
        var ko = require("knockout");
        var XMLParser = qpf.use("core/xmlparser");

        var dom = XMLParser.parse(appXML);

        document.body.appendChild(dom);

        ko.applyBindings(controllerConfig, dom);

        router.init("/");
    }

    var app = {
        start: start
    }
    _.extend(app, Event);

    return app;
})