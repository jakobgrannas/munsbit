import cheerio from 'cheerio';
import request from 'request';
import Q from 'q';
import ReceptNuService from './koketService';

function getPageDOM (url) {
	return new Promise((resolve, reject) => {
		request(url, function (error, response, body) {
			if(!error && (response.statusCode >= 200 && response.statusCode <= 400)) {
				var DOM = cheerio.load(body);
				resolve(DOM);
			}
			else {
				reject('Non-success status code received from the requested URL');
			}
		});
	});
}

export let getRecipe = (url) => {
	var callback;

	if (url.indexOf('koket.se') > -1) {
		callback = ReceptNuService.getRecipe;
	}
	else if(url.indexOf('coop.se') > -1) {
		callback = CoopService.getRecipe;
	}
	else if(url.indexOf('alltommat.se') > -1) {
		callback = AlltOmMatService.getRecipe;
	}
	else if(url.indexOf('tasteline.com') > -1) {
		callback = TasteLineService.getRecipe;
	}
	else {
		return new Promise(
			(resolve, reject) => reject('Could not import recipe. Site not supported. Please try another site')
		);
	}

	return getPageDOM(url)
		.then(callback)
		.then((res) => (res.url = url) && res);
};
