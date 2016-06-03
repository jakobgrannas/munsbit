import {
	GraphQLInt,
	GraphQLList,
	GraphQLString,
	GraphQLObjectType,
} from 'graphql';

import {
	connectionArgs,
	connectionFromArray,
	globalIdField,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions';
import {ingredientConnection} from '../connections/recipeConnections';

export let recipeType = new GraphQLObjectType({
    name: 'Recipe',
    description: 'A recipe',
	isTypeOf: () => ({instructions}) => instructions && instructions.length > 0,
    fields: () => ({
        id: globalIdField('Recipe'),
        _id: {
            type: GraphQLString,
            description: 'Mongodb id'
        },
        state: {
            type: GraphQLString,
            description: 'State of the recipe. Can be either "draft", "imported" or "uploaded"'
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
			type: ingredientConnection,
			args: connectionArgs,
			description: 'List of ingredients',
			resolve: (recipe, args) => connectionFromArray(
				recipe.ingredients,
				args
			)
        }
    }),
    interfaces: [nodeInterface]
});
