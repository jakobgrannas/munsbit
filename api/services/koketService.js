let getRecipe = (cheerioDOMObject) => {
	let $ = cheerioDOMObject,
		$ingredients = $('.ingredients li'),
		$instructions = $('.step-by-step span:first-of-type'),

		extractIngredients = ($ingredients) => {
			return [].map.call(
				$ingredients,
				(el) => {
					let amount = $(el).find('.ingredient').text().trim(),
						name = $(el).find('.ingredient + [itemprop=ingredients]').text().trim();

					return {
						amount: amount,
						name: name
					};
				}
			);
		},

		extractInstructions = ($instructions) => {
			return [].map.call(
				$instructions,
				(el) => $(el).text().trim()
			);
		};

	return {
		title: $('h1').text().trim(),
		cookingTime: $('.cooking-time .time').text().trim(),
		servings: $('.portions .amount').text().trim(),
		author: $('.author [itemprop=author] > a').text().trim(),
		datePublished: $('[itemprop=datePublished]').attr('content'),
		imageUrl: $('.image-container [itemprop=image]').attr('content'),
		instructions: extractInstructions($instructions),
		ingredients: extractIngredients($ingredients)
	};
};


export default {
	getRecipe: getRecipe
}
