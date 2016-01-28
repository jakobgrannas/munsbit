import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
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
} from '../api/services/RecipeService'; // TODO: Move schema to /api

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
	    if (type === 'Recipe') {
	    	return getRecipe(id);
	    } else {
	    	return null;
	    }
	},
	(obj) => {
		switch(typeof obj) {
			case 'recipe':
				return recipeType
			default:
				return null
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
    fields: () => ({
        id: globalIdField('Recipe'),
        state: {
            type: GraphQLString,
            description: 'State of the recipe. Can be either "draft" or "imported"',
        },
        /*url: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The URL from which the recipe came'
        },*/
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
			type: GraphQLString, // TODO: Convert to date,
			description: 'Date when the recipe was published'
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
			//type: connectionDefinitions({name: 'Ingredient', nodeType: ingredientType }),
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
    description: 'A person who uses the app',
    fields: () => ({
        id: globalIdField('User'),
        name: {
            type: GraphQLString,
            description: 'User name'
        },
        recipes: {
            type: new GraphQLList(recipeType),
            description: "List of the user's recipes"
        },
        recipe: {
            type: recipeType,
            description: 'A single recipe resource'
        }
    })
});

/*var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    widgets: {
      type: widgetConnection,
      description: 'A person\'s collection of widgets',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getWidgets(), args),
    },
  }),
  interfaces: [nodeInterface],
});

var widgetType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: () => ({
    id: globalIdField('Widget'),
    name: {
      type: GraphQLString,
      description: 'The name of the widget',
    },
  }),
  interfaces: [nodeInterface],
});*/

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'RootQueryType', //'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
	//user: {
		recipe: {
	        type: recipeType,
	        args: {
	            url: {
	                name: 'url',
	                type: GraphQLString
	            }
	        },
	        resolve: (recipe, {url}) => {
	            let result = getRecipe(url);
	            return result;
	        }
	    }
	//}
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
