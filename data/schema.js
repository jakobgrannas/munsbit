import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Recipe,
  getRecipe,
  getInstructions,
  getIngredients
} from '../api/services/RecipeService';

import {RecipeModel} from '../api/db/models/recipeModel';

let getViewer = () => ({
	type: 'registered' // TODO: or 'anonymous'
});

let getUser = () => ({
	userId: "0",
	name: 'Anonymous',
	email: 'due'
});

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
let {nodeInterface, nodeField} = nodeDefinitions(
	// Context can be made available through the graphql middleware config in server.js
	(globalId, context) => {
		let {type, id} = fromGlobalId(globalId);
	    switch(type) {
			case 'Recipe':
		    	return getRecipe(id);
			case 'Viewer':
				return getViewer(id);
			case 'User':
				return getUser(id);
			default:
				return null;
		}
	}
);


/**
 * Define your own types here
 */

let ingredientType = new GraphQLObjectType({
    name: 'Ingredient',
    description: 'Ingredient',
    fields: {
        amount: {
            type: GraphQLString,
            description: 'Amount of the ingredient to be used'
        },
        name: {
            type: GraphQLString,
            description: 'Name of the ingredient'
        }
    }
});

let recipeType = new GraphQLObjectType({
    name: 'Recipe',
    description: 'A recipe',
	isTypeOf: ({instructions}) => instructions && instructions.length > 0,
    fields: () => ({
        id: globalIdField('Recipe'),
        _id: {
            type: GraphQLString,
            description: 'Mongoose id field'
        },
        __v: {
            type: GraphQLInt,
            description: 'Mongoose version field'
        },
        state: {
            type: GraphQLString,
            description: 'State of the recipe. Can be either "draft" or "imported"',
        },
        url: {
            type: GraphQLString,
            description: 'The URL from which the recipe came'
        },
        title: {
            type: GraphQLString,
            description: 'Recipe title'
        },
		cookingTime: {
            type: GraphQLString,
            description: 'Amount of time it takes to cook the meal'
        },
		servings: {
            type: GraphQLInt,
            description: 'Number of servings'
        },
		author: {
			type: GraphQLString,
			description: 'Author/chef of the recipe'
		},
		datePublished: {
			type: GraphQLString,
			description: 'Timestamp of when the recipe was published'
		},
		imageUrl: {
			type: GraphQLString,
			description: 'Main recipe image url'
		},
		instructions: {
            type: new GraphQLList(GraphQLString),
            description: 'List of instructions on how to cook this recipe',
        },
		ingredients: {
            type: new GraphQLList(ingredientType),
            description: 'List of ingredients',
            resolve: (recipe) => {
				return recipe.ingredients;
			}
        }
    }),
    interfaces: [nodeInterface]
});

let userType = new GraphQLObjectType({
	name: 'User',
	description: 'A user of the app',
	isTypeOf: (obj) => !!obj.userId,
	fields: () => ({
		id: globalIdField('User'),
		userId: {
			type: GraphQLString
		},
        name: {
            type: GraphQLString
        },
		email: {
			type: GraphQLString,
		},
		recipes: {
			type: new GraphQLList(recipeType),
			description: "List of the user's recipes",
			resolve: (recipes, args) => {
                /*let promise = new Promise((resolve, reject) => {
                    RecipeModel.find({}, function (error, recipes) {
                		if(error) {
                			error.status = 400;
                			return reject(error);
                		}
                		else {
                			resolve(recipes);
                		}
                	}).sort({order: 'asc'});
                })

				return promise;*/
			}
		},
		recipe: {
			type: recipeType
		}
	}),
	interfaces: [nodeInterface]
});

let viewerType = new GraphQLObjectType({
    name: 'Viewer',
    description: 'A person viewing the app',
	isTypeOf: (obj) => !!obj.type,
    fields: () => ({
        id: globalIdField('Viewer'),
		type: {
			type: GraphQLString,
			description: 'registered or anonymous'
		},
		user: {
			type: userType,
			args: {
				id: {
					name: 'userId',
					type: GraphQLInt
				}
			},
			resolve: (user) => {
				return getUser();
			}
		},
        recipe: {
            type: recipeType,
            description: 'A recipe scraped from any of the available scarping sources',
			args: {
				url: {
					name: 'url',
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: (recipe, {url}) => {
				if(url) {
					let promise = getRecipe(url);
					promise.then((res) => console.log(res));
					return promise;
				}
				return null;
			}
        }
    }),
	interfaces: [nodeInterface]
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    node: nodeField,
	viewer: {
		type: viewerType,
		fields: {
			user: {
				type: userType
			},
			recipe: {
	            type: recipeType
	        }
		},
		resolve: (viewer, {id}) => {
			return getViewer();
		}
	}
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createRecipe: createRecipeMutation
    })
});

let ingredientInputType = new GraphQLInputObjectType({
    name: 'IngredientInput',
    description: 'Ingredient',
    fields: {
        amount: {
            type: GraphQLString,
            description: 'Amount of the ingredient to be used'
        },
        name: {
            type: GraphQLString,
            description: 'Name of the ingredient'
        }
    }
});

let createRecipeMutation = mutationWithClientMutationId({
    name: 'CreateRecipe',
    inputFields: {
        state: {
            type: GraphQLString,
            description: 'State of the recipe. Can be either "draft" or "imported"',
        },
        url: {
            type: GraphQLString,
            description: 'The URL from which the recipe came'
        },
        title: {
            type: GraphQLString,
            description: 'Recipe title'
        },
        cookingTime: {
            type: GraphQLString,
            description: 'Amount of time it takes to cook the meal'
        },
        servings: {
            type: GraphQLInt,
            description: 'Number of servings'
        },
        author: {
            type: GraphQLString,
            description: 'Author/chef of the recipe'
        },
        datePublished: {
            type: GraphQLString,
            description: 'Timestamp of when the recipe was published'
        },
        imageUrl: {
            type: GraphQLString,
            description: 'Main recipe image url'
        },
        instructions: {
            type: new GraphQLList(GraphQLString),
            description: 'List of instructions on how to cook this recipe'
        },
        ingredients: {
            type: new GraphQLList(ingredientInputType),
            description: 'List of ingredients'
        }
    },
    outputFields: {
        recipe: {
            type: recipeType,
            resolve: (recipe) => {
                console.log('outputFields resolve');
                console.log(recipe);
                return recipe;
            }
        }
    },
    mutateAndGetPayload: (recipeObj) => {
        let recipe = new RecipeModel(recipeObj),
            promise;

        console.log(recipeObj);

    	promise = new Promise((resolve, reject) => {
            recipe.save((error) => {
        		if(error) {
        			error.status = 400;
        			reject(error);
        		}
        		else {
                    console.log(recipe);
        			resolve(recipe);
        		}
        	});
    	});

        return promise;
    },
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
