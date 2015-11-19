var cheerio = require('cheerio'),
	request = require('request'),
	Q = require('q'),
	ReceptNuService = require('./receptNuService');

function getPageDOM (url) {
	var deferred = Q.defer();
	request(url, function (error, response, body) {
		if(!error && (response.statusCode >= 200 && response.statusCode <= 400)) {
			var DOM = cheerio.load(body);
			deferred.resolve(DOM);
		}
		else {
			deferred.reject('Non-success status code received from the requested URL');
		}
	});

	return deferred.promise;
}

exports.getRecipe = function (url) {
	var callback;

	if (url.indexOf('recept.nu') > -1) {
		callback = ReceptNuService.getRecipeData;
	}
	else if(url.indexOf('coop.se') > -1) {
		callback = CoopService.getRecipeData;
	}
	else if(url.indexOf('alltommat.se') > -1) {
		callback = AlltOmMatService.getRecipeData;
	}
	else if(url.indexOf('tasteline.com') > -1) {
		callback = TasteLineService.getRecipeData;
	}
	else {
		var deferred = Q.defer().reject('Could not import recipe. Site not supported. Please try another site');
		return deferred.promise();
	}

	if(callback) {
		return getPageDOM(url)
			.then(function (DOM) {
				return callback(DOM);
			});
	}
};