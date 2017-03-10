/**
 * a barebones HTTP server in JS
 * to serve three.js easily
 *
 * @author zz85 https://github.com/zz85
 *
 * Usage: node simplehttpserver.js <port number>
 *
 * do not use in production servers
 * and try
 *     npm install http-server -g
 * instead.
 */

var port = 80,
    http = require('http'),
    urlParser = require('url'),
    fs = require('fs'),
    path = require('path'),
    // __dirname 获取的是当前软件的路径，是内置变量；process.cwd()获取的是当前命令行目录
    currentDir = process.cwd();
var journey = require('journey');

//
// Create a Router
//
var router = new(journey.Router);

//写文件
function writeFile(path, content) {
    var _file = currentDir + path;
    fs.exists(_file, function (exists) {
        if (exists) {
            // serve file
            console.log(_file + "文件已存在，重命名为" + _file + "_backup");
            exec("mv " + _file + " " + _file + "_backup", function () {
                fs.writeFile(currentDir + path, content, function (err) {
                    if (err) throw err;
                    console.log('保存成功');
                });
            });
        } else {
            fs.writeFile(currentDir + path, content, function (err) {
                if (err) throw err;
                console.log('保存成功');
            });
        }

    });

}
//写生成的ftl和组件
function writeCPFile(path, content) {
    fs.writeFile(path, content, function (err) {
        if (err) throw err;
        console.log('保存成功');
    });

}
// Create the routing table
router.map(function () {
    this.post(/^api\/(.*)$/).bind(function (req, res, id, data) {
        // console.log(id);
        var _ext = JSON.parse(data.ext);
        // console.log(_ext.name);
        //简单的校验
        if (id == _ext.name) {
            //去除路径 ../前面的..
            if (_ext.url.substr(0, 2) == "..") {
                // 写组件模型
                if (/^\.\.\/([\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                    writeFile(_ext.url.substr(2), data.cmpData);
                } else {
                    res.send(200, {}, {
                        code: "-1",
                        message: "组件路径不合法"
                    });
                }

            } else {
                // 写组件文件，绝对路径地址
                
                if (/^([A-Za-z]{1}:[\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                    writeCPFile(_ext.url, data.cmpData);
                } else {
                    res.send(200, {}, {
                        code: "-1",
                        message: "组件路径不合法"
                    });
                }

            }
            res.send(200, {}, {
                code: "0",
                message: "写入成功"
            });
        } else {
            res.send(200, {}, {
                code: "-1",
                message: "校验失败"
            });
        }
    });
});

function exec(cmdStr, _cb) {
    var exec = require('child_process').exec;
    exec(cmdStr, function (err, stdout, stderr) {
        _cb && _cb();
    });
}

function handleRequest(request, response) {

    var urlObject = urlParser.parse(request.url, true);
    var pathname = decodeURIComponent(urlObject.pathname);
    console.log('[' + (new Date()).toUTCString() + '] ' + '"' + request.method + ' ' + pathname + '"');
    if (pathname.indexOf("api") >= 0) {
        var body = "";
        request.addListener('data', function (chunk) {
            body += chunk
        });
        request.addListener('end', function () {
            //
            // Dispatch the request to the router
            //
            router.handle(request, body, function (result) {
                response.writeHead(result.status, result.headers);
                response.end(result.body);
            });
        });

    } else {
        var filePath = "";
        if (pathname.indexOf("cmpApp") >= 0) {
            // currentDir = __dirname;
            console.log(__dirname);
            console.log(pathname);
            var _subPath = pathname.substr(pathname.indexOf("cmpApp") + 6);
            //静态文件处理
            filePath = path.join(__dirname, "../static" + (_subPath == "/" ? "/index.html" : _subPath));

        } else {
            //静态文件处理
            filePath = path.join(currentDir, pathname);
        }

        fs.stat(filePath, function (err, stats) {
            if (err) {
                response.writeHead(404, {});
                response.end('File not found!');
                return;
            }
            if (stats.isFile()) {
                fs.readFile(filePath, function (err, data) {
                    if (err) {
                        response.writeHead(404, {});
                        response.end('Opps. Resource not found');
                        return;
                    }

                    if (filePath.indexOf("svg") > 0) {
                        response.writeHead(200, {
                            'Content-Type': 'image/svg+xml; charset=utf-8'
                        });
                    } else {
                        response.writeHead(200, {});
                    }
                    response.write(data);
                    response.end();
                });

            } else if (stats.isDirectory()) {
                fs.readdir(filePath, function (error, files) {
                    if (error) {
                        response.writeHead(500, {});
                        response.end();
                        return;
                    }
                    var l = pathname.length;
                    if (pathname.substring(l - 1) != '/') pathname += '/';

                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    response.write('<!DOCTYPE html>\n<html><head><meta charset="UTF-8"><title>' + filePath + '</title></head><body>');
                    response.write('<a href="/cmpApp/" target="_blank"><h1>&nbsp;&nbsp; Start CmpApp </h1></a>');
                    response.write('<h1>' + filePath + '</h1>');
                    response.write('<ul style="list-style:none;font-family:courier new;">');
                    files.unshift('.', '..');
                    files.forEach(function (item) {

                        var urlpath = pathname + item,
                            itemStats = fs.statSync(currentDir + urlpath);

                        if (itemStats.isDirectory()) {
                            urlpath += '/';
                            item += '/';
                        }

                        response.write('<li><a href="' + urlpath + '">' + item + '</a></li>');
                    });

                    response.end('</ul></body></html>');
                });
            }
        });
    }
}
exports.createServer = function (config) {

    currentDir = config.path || currentDir;
    port = +(config.port || port);
    http.createServer(handleRequest).listen(port);
    // console.log(port);

    require('dns').lookup(require('os').hostname(), function (err, addr, fam) {
        console.log('CMP server Running at http://' + addr + ((port == 80) ? '' : (':' + port)) + '/');
    })
    // console.log(config.start);
    if (config.start == "true") {
        //打开浏览器
        exec("start http://127.0.0.1" + ((port == 80) ? '' : (':' + port)) + '/cmpApp/');
    }
    console.log('Base directory at ' + currentDir);
}
