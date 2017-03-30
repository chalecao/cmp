/**
 * boot the web app
 */
(function () {
    //=========================
    // CONFIG
    //=========================
    $LAB.setGlobalDefaults({
        BasePath: 'lib/'
    });
    //=========================
    // Load Library
    //=========================
    $LAB.script("require.js")
        .script("director.js")
        .script("FileSaver.js")
        .script("cmp.bundle.js")
        .wait(boot);
    //========================
    // Load Main Module
    //========================
    function boot() {
        config();
        
        require(["app", "modules/common/histogram",
            "modules/common/listTab",
            "modules/common/list",
            "modules/common/modal",
            "modules/common/region",
            "modules/common/iconbutton",
            "modules/common/togglebutton",
            "modules/common/toggleiconbutton",
            "modules/common/nativehtml",
            "modules/common/textArea",
            "modules/common/gradient",
            "modules/common/color"
        ], function (app) {
            app.start();
        })
    }
    function config() {
        requirejs.config({
            paths: {
                async: "lib/async",
                onecolor: "lib/onecolor",
                qpf: "lib/cmui/dist/qpf",
                // qpf: "lib/qpf",
                emage: "lib/emage",
                d3: "lib/d3",
                codemirror: "lib/codemirror/codemirror",
                javascript: "lib/codemirror/mode/javascript",
                htmlmixed: "lib/codemirror/mode/htmlmixed",
                searchcursor: "lib/codemirror/mode/searchcursor",
                matchbrackets: "lib/codemirror/mode/matchbrackets",
                css: "lib/codemirror/mode/css",
                xml: "lib/codemirror/mode/xml",
                closebrackets: "lib/codemirror/mode/closebrackets",
                sublime: "lib/codemirror/mode/sublime",
                knockout: "lib/knockout",
                'ko.mapping': 'lib/ko.mapping',
                // Use jquery temporary, zepto's bind does not support context
                "$": "lib/jquery",
                "_": "lib/underscore"
            },
            shim: {
                '$': {
                    exports: "$"
                },
                '_': {
                    exports: "_"
                }

            },
            waitSeconds: 30
        })
    }
}).call(this)
