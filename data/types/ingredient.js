import {
	GraphQLObjectType,
	GraphQLString
} from 'graphql'

import {
	globalIdField
} from 'graphql-relay'

import {nodeInterface} from '../nodeDefinitions';

/**
 * Define your own types here
 */

export let ingredientType = new GraphQLObjectType({
	name: 'Ingredient',
	description: 'Ingredient',
	isTypeOf: ({amount}) => amount != undefined,
	fields: {
		id: globalIdField('Ingredient'),
		_id: {
			type: GraphQLString,
			description: 'Mongodb record id'
		},
		amount: {
			type: GraphQLString,
			description: 'Amount of the ingredient to be used'
		},
		name: {
			type: GraphQLString,
			description: 'Name of the ingredient'
		}
	},
	interfaces: [nodeInterface]
});
