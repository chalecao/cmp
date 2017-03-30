var spawn = require('child_process').execFile;
var querystring = require('querystring');


var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');


var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "gif": "image/gif",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};


function return_code(res) {
    return function (code) {
        if (code != 0) {
            res.write("\nexit code: " + code);
        }
        res.end();
    }
}
exports.createServer = function (port) {

    http.createServer(function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/html;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
        });
        var parsedUrl = url.parse(req.url);
        var uri = parsedUrl.pathname;
        var args = querystring.parse(parsedUrl.query);
        console.log('request: ' + req.url);
        if (uri == '/run') {
            console.log('wants to run: ' + args.func + ", cwd: " + args.cwd);
            var cwd = args.cwd;
            var func = args.func.split(" ");
            var aa = [];
            for (var i = 1; i < func.length; ++i) {
                console.log("arg item: " + func[i]);
                aa.push(func[i]);
            }
            console.log("arg0 is '" + func[0] + "'" + " args1 length is " + aa.length);
            if (process.platform == "win32") {
                (func[0] == "npm") && (func[0] = "npm.cmd");
                (func[0] == "gulp") && (func[0] = "gulp.cmd");
                (func[0] == "hexo") && (func[0] = "hexo.cmd");
            }
            var ls = spawn(func[0], aa, {
                cwd: cwd
            }, function (error, stdout, stderr) {
                if (error) {
                    res.write("Wrong Command: " + func[0]+", Please Check!");
                    res.end();
                }
            });
            ls.stdout.pipe(res);

            ls.on('exit', return_code(res));
            return;
        } else if (uri == '/view') {
            var filename = path.resolve(args.cwd, args.filename);
            console.log("Viewing " + filename);
            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
            return;
        }

        var filename;
        if (args.cwd) {
            console.log("resolving with cwd " + args.cwd);
            filename = path.resolve(args.cwd, uri.substr(1));
        } else {
            filename = path.join(process.cwd(), uri);
        }
        fs.exists(filename, function (exists) {
            if (!exists) {
                console.log("not exists: " + filename);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.write('404 Not Found\n');
                res.end();
                return;
            }
            var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
            res.writeHead(200, {
                'Content-Type': mimeType
            });

            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);

        }); //end path.exists
    }).listen(port);
}
