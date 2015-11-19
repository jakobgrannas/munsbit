var recipePage = require('../controllers/recipeController');

module.exports = function (app) {
	app.get('/recipe/import', recipePage.import);
};