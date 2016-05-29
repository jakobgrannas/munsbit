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
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  Recipe,
  getRecipe,
  getInstructions,
  getIngredients
} from '../api/services/RecipeService';

import {
    recipeMutations,
    recipeType,
} from './recipes';

import {RecipeModel} from '../api/db/models/recipeModel';

import {nodeInterface, nodeField} from './nodeDefinitions';

let getViewer = () => ({
	type: 'registered' // TODO: or 'anonymous'
});

let getUser = () => ({
	userId: "0",
	name: 'Anonymous',
	email: 'due'
});

// TODO: Move out
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
                let promise = new Promise((resolve, reject) => {
                    RecipeModel.find({}, (error, recipes) => {
                		if(error) {
                			error.status = 400;
                			return reject(error);
                		}
                		else {
                			resolve(recipes);
                		}
                	}).sort({order: 'asc'});
                })

				return promise;
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
            description: 'A recipe scraped from any of the available scraping sources',
			args: {
				url: {
					name: 'url',
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: (recipe, {url}) => {
                let promise = new Promise((resolve, reject) => {
                    if(!url) {
                        reject("Url parameter not provided");
                    }

                    RecipeModel.find(  // TODO: This won't work because multiple records can have the same url
                        {
                            url: url
                        },
                        (error, recipes) => {
                    		if(error) {
                    			error.status = 400;
                    			reject(error);
                    		}
                    		else {
                    			resolve(recipes);
                    		}
                    	})
                        .sort({order: 'asc'});
                });

				return promise;
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
        importRecipe: recipeMutations.importRecipe
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


/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
