function getInstructions (instructions) {
	var result = [];

	instructions.map(function () {
		result.push($(this).text().trim());
	});

	return result;
}

// TODO: Move to receptnu class or w/e
function getIngredients (ingredients) {
	var result = [], ingredient;

	for (var i=0; i < ingredients.length; i++) {
		ingredient = $(ingredients[i]);
		result.push({
			amount: ingredient.text().trim(),
			name: ingredient.next().text().trim()
		});
	}
	return result;
}

exports.getRecipeData = function (cheerioDOMObject) {
	var $ = cheerioDOMObject,
		ingredients = $('#ingredients .ingredient'),
		instructions = $('.step-by-step li > span');

	return {
		title: $('.basic-info h1:first-child').text().trim(),
		cookingTime: $('.basic-info .time').text().trim(),
		amountOfPersons: $('.basic-info .amount').text().trim(),
		instructions: getInstructions(instructions),
		ingredients: getIngredients(ingredients)
	};
};