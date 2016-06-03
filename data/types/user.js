import {
	GraphQLString,
	GraphQLObjectType,
} from 'graphql';

import {
	connectionArgs,
	connectionFromArray,
	globalIdField,
} from 'graphql-relay';

import {nodeInterface} from '../nodeDefinitions'
import {recipeConnection} from '../connections/recipeConnections';
import {recipeType} from './recipe';

export let userType = new GraphQLObjectType({
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
			type: recipeConnection,
            args: connectionArgs,
			description: "List of the user's recipes",
			resolve: (recipes, args) => {
                let promise = new Promise((resolve, reject) => {
                    RecipeModel.find({}, (error, recipes) => { // TODO: use connectionFromArray
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
