(function () {
    "use strict";
    var startedAt = new Date();

    var fs = require('fs');
    if (!fs.existsSync('teamwall.json')) {
        console.log('Before starting, add a teamwall.json to the installation. For an example, see the demo directory');
        return;
    }
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var http = require('http');
    var PORT = 8888;

    var app = connect()
        .use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            return next();
        })
        .use(serveStatic(__dirname, {'index': ['index.html']}));

    var server = http.createServer(app);
    server.listen(PORT, function () {
        console.log('server is listening on localhost:' + PORT + '. Startup time', new Date() - startedAt, 'ms.');
    });
})();

