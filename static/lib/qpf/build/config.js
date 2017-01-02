({
    baseUrl : "../src",
    paths : {
        // libraries
        "knockout" : "empty:",
        "$" : "empty:",
        "_" : "empty:"
    },
    shim : {
        '$' : {
            exports : "$"
        },
        '_' : {
            exports : "_"
        }
    },
    exclude : ['knockout', '$', "_"],
    // name : "build/almond",
    include : [ "qpf"],
                
    out : "../dist/qpf.js",
    wrap : {
        startFile : ['wrap/start.js', "almond.js", "wrap/config.js"],
        endFile : 'wrap/end.js'
    },
    optimize:"none"
})