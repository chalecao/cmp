({
    baseUrl: "../static/src",
    paths: {
        // libraries
        "knockout": "empty:",
        "$": "empty:",
        "qpf": "empty:",
        "async": "empty:",
        "onecolor": "empty:",
        "_": "empty:",
        'ko.mapping': 'empty:',
        "emage": "empty:",
        "cache": "empty:"
    },
    shim: {
        '$': {
            exports: "$"
        },
        '_': {
            exports: "_"
        }
    },
    exclude: ['knockout', '$', "_", "onecolor", "qpf", "ko.mapping", "emage", "async"],
    // name : "build/almond",
    include: ["cmp"],

    out: "../static/lib/cmp.bundle.js",
    // fileExclusionRegExp: /^cache\.js$/,	//过滤，匹配到的文件将不会被输出到输出目录去
    // wrap: {
    //     startFile: ['wrap/start.js', "almond.js", "wrap/config.js"],
    //     endFile: 'wrap/end.js'
    // },
    // JS 文件优化方式，目前支持以下几种：
    //   uglify: （默认） 使用 UglifyJS 来压缩代码
    //   closure: 使用 Google's Closure Compiler 的简单优化模式
    //   closure.keepLines: 使用 closure，但保持换行
    //   none: 不压缩代码
    optimize: "uglify",

    // 使用 UglifyJS 时的可配置参数
    // See https://github.com/mishoo/UglifyJS for the possible values.
    uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true,
        max_line_length: 1000
    },
    // 在每个文件模块被写入时的操作函数
    onBuildWrite: function (moduleName, path, contents) {
        if (moduleName == "cmp") {
            console.log("clear cmp");
            return "";
        } else {
            return contents;
        }
    }
})
