import {
	nodeDefinitions,
	fromGlobalId,
} from 'graphql-relay'

import {
  Recipe,
  getRecipe,
  getInstructions,
  getIngredients
} from '../api/services/RecipeService';

// TODO: Un-duplicate these (also in schema.js)
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
		    	return getRecipe(id); // TODO: This can't possibly work
			case 'Viewer':
				return getViewer(id);
			case 'User':
				return getUser(id);
			default:
				return null;
		}
	}
);

export {
	nodeInterface,
	nodeField
};
