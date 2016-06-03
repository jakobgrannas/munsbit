import {GraphQLNonNull, GraphQLString} from 'graphql';
import {
	mutationWithClientMutationId,
	cursorForObjectInConnection
} from 'graphql-relay';

import {recipeEdge} from '../connections';

import {RecipeModel} from '../../../api/db/models/recipeModel';
import {
	getRecipe,
} from '../../../api/services/RecipeService';


export const importRecipe = mutationWithClientMutationId({
	name: 'ImportRecipe',
	inputFields: {
		url: {
			type: new GraphQLNonNull(GraphQLString)
		},
		state: {
			type: GraphQLString,
			description: 'State of the recipe. Can be either "draft", "imported" or "uploaded"',
			defaultValue: 'draft'
		}
	},
	outputFields: {
		newRecipeEdge: {
			type: recipeEdge,
			resolve: (payload) => {
				const promise = new Promise((resolve, reject) => {
					RecipeModel.find({}, (error, recipes) => { // TODO: Only get recipes for userId
						if(error) {
							error.status = 400;
							reject(error);
						}
						else {
							let recipe = recipes.filter((r) => r._id.toString() === payload._id.toString())[0];
							console.log(payload._id);
							console.log(recipes);
							resolve({
								cursor: cursorForObjectInConnection(recipes, recipe),
								node: recipe
							});
						}
					});
				})

				return promise;
			}
		}
	},
	mutateAndGetPayload: ({url, state}) => {
		const promise = new Promise((resolve, reject) => {
			getRecipe(url)
			.then(
				(res) => {
					res.state = state;

					const recipe = new RecipeModel(res);

					recipe.save((error) => {
						if(error) {
							error.status = 400;
							console.log(error);
							reject(error);
						}
						else {
							//console.log(recipe);
							resolve(recipe); // TODO: Probably only needs to contain recipe._id
						}
					});
				}
			)
			.catch(reject);
		});

		return promise;
	},
});
