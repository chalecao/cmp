var glob = require('glob');
var fs = require('fs');

var ROOT = "../static/src/";
var OUTPUT_PORTAL = "cmp.js";

var template = fs.readFileSync("qpf_template.js", "utf-8");

String.prototype.firstUpperCase = function () {
    return this.toString()[0].toUpperCase() + this.toString().slice(1);
}

glob("**/*.js", {
    cwd : ROOT
}, function(err, files){

    var namespace = {};

    files.forEach(function(file){
        if(file.match(/(lib|template)/) || file.match(/(boot|text|cmp)\.js/)){
            return;
        }
        var filePathWithOutExt = file.slice(0, -3);
        var pathArray = filePathWithOutExt.split("/");
        var baseName = pathArray.pop();

        baseName = baseName.firstUpperCase();
        console.log(baseName);
        var object = pathArray.reduce(function(memo, propName){
            if( ! memo[propName] ){
                memo[propName] = {};
            }
            return memo[propName];
        }, namespace);

        object[baseName] = "__require('"+filePathWithOutExt+"')__";
    })

    var jsString = JSON.stringify( namespace, null, '\t' );
    jsString = jsString.replace(/\"\__require\((\S*?)\)__\"/g, 'require($1)')

    var output = template.replace(/\{\{\$exportsObject\}\}/, jsString);

    fs.writeFileSync( ROOT+OUTPUT_PORTAL, output, "utf-8");
});
