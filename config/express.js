var express = require('express');

module.exports = function () {
	var app = express();

	[
		'indexRoute',
		'recipeRoute'
	].map(function(controllerName){
			var controller = require('../api/routes/' + controllerName);
			controller(app);
		});

	return app;
};