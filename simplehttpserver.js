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

var port = 8000,
    http = require('http'),
    urlParser = require('url'),
    fs = require('fs'),
    path = require('path'),
    currentDir = process.cwd();
var journey = require('journey');

//
// Create a Router
//
var router = new(journey.Router);

port = process.argv[2] ? parseInt(process.argv[2], 0) : port;

// Create the routing table
router.map(function () {
    this.post(/^api\/(.*)$/).bind(function (req, res, id, data) {
        console.log(id);
        console.log(data);

    });

});

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
        //静态文件处理
        var filePath = path.join(currentDir, pathname);
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
http.createServer(handleRequest).listen(port);

require('dns').lookup(require('os').hostname(), function (err, addr, fam) {
    console.log('Running at http://' + addr + ((port === 80) ? '' : ':') + port + '/');
})

console.log('Base directory at ' + currentDir);

