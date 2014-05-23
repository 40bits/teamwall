(function () {
    "use strict";
    var startedAt = new Date();

    var connect = require('connect');
    var http = require('http');
    var PORT = 8889;

    var app = connect()
        .use(connect.logger('dev'))
        .use(connect.query())
        .use(function (req, res) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            var result = {};

            if (req.query.instrument == "number") {
                result = {"value": Math.floor((Math.random() * 100) + 1)};
            }

            res.end(JSON.stringify(result))
        });

    var server = http.createServer(app);
    server.listen(PORT, function () {
        console.log('server is listening on localhost:' + PORT + '. Startup time', new Date() - startedAt, 'ms.');
    });
})();

