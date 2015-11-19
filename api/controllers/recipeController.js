var RecipeService = require('../services/recipeService');

module.exports = {
	/**
	 * Imports a recipe from the given url. Currently supports Recept.nu, Coop.se and Alltommat
	 * @param req
	 * @param res
	 */
	import: function (req, res) {
		var requestedUrl = req.query.url;

		if(requestedUrl) {
			RecipeService.getRecipe(requestedUrl)
				.then(
				function (result) {
					console.log(result);
					res.send(result);
				},
				function (rejectReason) {
					console.log(rejectReason);
					res.send({
						errorMessage: rejectReason
					});
				}
			);
		}
	}
};