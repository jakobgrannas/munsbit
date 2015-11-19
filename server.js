var express = require('./config/express'),
    http = require('http');

var app = express();

// Start server
var server = http.createServer(app).listen(1337, function() {
    console.log('Server running at http://localhost:1337/');
});

module.exports = app;
