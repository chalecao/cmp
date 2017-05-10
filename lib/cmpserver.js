/**
 * a barebones HTTP server in JS
 */

var port = 80,
    http = require('http'),
    urlParser = require('url'),
    fs = require('fs'),
    path = require('path'),
    // __dirname 获取的是当前软件的路径，是内置变量；process.cwd()获取的是当前命令行目录
    currentDir = process.cwd();
var journey = require('journey');
var istanbul = require('istanbul');

//
// Create a Router
//
var router = new (journey.Router);

// 创建所有目录
function mkdirs(dirpath, mode, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists) {
            console.log("exists " + dirpath);
            callback(dirpath);
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), mode, function () {
                console.log("making " + dirpath);
                var di = dirpath.split("/");
                if (di[di.length - 1].indexOf(".") <= 0) {
                    fs.mkdir(dirpath, mode, callback);
                } else {
                    console.log(dirpath + " is not path");
                    callback();
                }
            });
        }
    });
}

function createPath(_file, cb) {
    if (_file.lastIndexOf("/") != _file.length - 1) {
        var _dir = _file.substring(0, _file.lastIndexOf("/"));
        fs.exists(_dir, function (exists) {
            if (exists) {
                cb();
            } else {
                console.log("dir not exists, create path " + _dir);
                mkdirs(_dir, [0777], function (err) {
                    if (err) {
                        console.log("create path error, path: " + _dir);
                    } else {
                        cb();
                    }

                });
            }
        });
    }
}

function createAndWriteFile(_file, content, needBackup) {
    // cmp文件需要备份
    if (_file.indexOf("cmp") > 0) {
        needBackup = true;
    } else {
        needBackup = false;
    }
    createPath(_file, function () {
        fs.exists(_file, function (exists) {
            if (exists) {
                // serve file
                if (needBackup) {
                    console.log(_file + "文件已存在，重命名为" + _file + "_backup");
                    exec("mv " + _file + " " + _file + "_backup", function () {
                        fs.writeFile(_file, content, function (err) {
                            if (err) throw err;
                            console.log('保存成功');
                        });
                    });
                } else {
                    fs.writeFile(_file, content, function (err) {
                        if (err) throw err;
                        console.log('保存成功');
                    });
                }
            } else {
                fs.writeFile(_file, content, function (err) {
                    if (err) throw err;
                    console.log('保存成功');
                });
            }

        });
    });
}


function generateCover(_conent, _cb) {
    var collector = new istanbul.Collector();
    var reporters = istanbul.Report.create('text');
    var _cov = JSON.parse(_conent);
    console.log(_conent);
    // _cov.path = currentDir + "/" + _cov.path;
    collector.add(_cov);
    console.log(reporters);
    try {
        reporters.writeReport(collector, function (_txt) {
            console.log(_txt);
            _cb(_txt);
        });
        console.log("writeReport");
    }
    catch (Exception) {
        console.log("writeReport err");
    }
}

//写文件
function writeFile(path, content) {
    var _file = currentDir + path;
    createAndWriteFile(_file, content, {});

}

// Create the routing table
router.map(function () {
    this.post(/^api\/(.*)$/).bind(function (req, res, id, data) {
        console.log(id);
        var _ext = JSON.parse(data.ext);
        console.log(_ext.name);

        //简单的校验
        if (id == _ext.name) {
            if (_ext.url.indexOf("coverage.json") > 0) {
                generateCover(data.cmpData, function (_data) {
                    console.log("回调---");
                    res.send(200, {}, {
                        code: "0",
                        message: _data
                    });
                });

            } else {
                //去除路径 ../前面的..
                if (_ext.url.substr(0, 2) == ".." || _ext.url.substr(0, 1) == "." || _ext.url.substr(0, 1) == "/") {
                    // 写组件模型
                    if (/^\.\.\/([\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                        writeFile(_ext.url.substr(2), data.cmpData);
                    } else if (/^\.\/([\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                        writeFile(_ext.url.substr(1), data.cmpData);
                    } else if (/^\/([\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                        writeFile(_ext.url.substr(0), data.cmpData);

                    } else {
                        res.send(200, {}, {
                            code: -2,
                            message: "组件模型路径不合法"
                        });
                    }

                } else {
                    // 写绝对路径地址
                    if (/^([A-Za-z]{1}:[\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                        createAndWriteFile(_ext.url, data.cmpData);
                    } else {
                        res.send(200, {}, {
                            code: -2,
                            message: "组件路径不合法"
                        });
                    }

                }
                res.send(200, {}, {
                    code: "0",
                    message: _ext.url + "写入成功"
                });
            }
        } else {
            res.send(200, {}, {
                code: -1,
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
            // console.log(__dirname);
            // console.log(pathname);
            var _subPath = pathname.substr(pathname.indexOf("cmpApp") + 6);
            // console.log(_subPath);
            //静态文件处理
            // filePath = path.join(__dirname, "../static" + (_subPath == "/" ? "/index.html" : _subPath));
            filePath = path.join(__dirname, ".." + _subPath);
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
            console.log(stats.isDirectory());
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
                    response.write('<a href="/cmpApp/static/index.html" target="_blank"><h1>&nbsp;&nbsp; Start CmpApp </h1></a>');
                    response.write('<h1>' + filePath + '</h1>');
                    response.write('<ul style="list-style:none;font-family:courier new;">');
                    files.unshift('.', '..');
                    files.forEach(function (item) {

                        var urlpath, itemStats;
                        if (pathname.indexOf("cmpApp") >= 0) {
                            urlpath = pathname.substr(pathname.indexOf("cmpApp") + 6) + item;
                            itemStats = fs.statSync(__dirname + "\\.." + urlpath);
                        } else {
                            urlpath = pathname + item
                            itemStats = fs.statSync(currentDir + urlpath);

                        }

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
        exec("start http://127.0.0.1" + ((port == 80) ? '' : (':' + port)) + '/cmpApp/static/index.html');
    }
    console.log('Base directory at ' + currentDir);
}
