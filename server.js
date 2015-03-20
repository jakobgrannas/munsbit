var express = require('./config/express');
var app = express();

app.listen(1337);
console.log('Server running at http://localhost:1337/');

module.exports = app;