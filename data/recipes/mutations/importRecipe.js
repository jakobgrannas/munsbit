import {GraphQLNonNull, GraphQLString} from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay'

import {recipeType} from '../types/recipe';
import {RecipeModel} from '../../../api/db/models/recipeModel';

import {
  Recipe,
  getRecipe,
} from '../../../api/services/RecipeService';

export let importRecipe = mutationWithClientMutationId({
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
        recipe: {
            type: recipeType,
            resolve: (recipe) => recipe
        }
    },
    mutateAndGetPayload: ({url, state}) => {
        let promise = new Promise((resolve, reject) => {
            getRecipe(url)
                .then(
                    (res) => {
                        res.state = state;

                        let recipe = new RecipeModel(res);

                        recipe.save((error) => {
                    		if(error) {
                    			error.status = 400;
                                console.log(error);
                    			reject(error);
                    		}
                    		else {
                                console.log(recipe);
                    			resolve(recipe);
                    		}
                    	});
                    })
                .catch(reject);
        });

        return promise;
    },
});
