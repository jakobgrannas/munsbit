module.exports = function() {
    var express = require('express'),
    	path = require('path'),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
    	app = express();

	var defaults = {
		root: path.normalize(__dirname + '/..')
	};

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	app.use(methodOverride());

    // Set /public as our static content dir
  	app.use(express.static(defaults.root + "/public"));

    [
        'indexRoute',
        'recipeRoute'
    ].map(function(controllerName) {
        var controller = require('../api/routes/' + controllerName);
        controller(app);
    });

    return app;
};
