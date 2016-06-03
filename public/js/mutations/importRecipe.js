import React from 'react';
import Relay from 'react-relay';
import Recipe from '../components/Recipe';

export default class ImportRecipeMutation extends Relay.Mutation {
	static initialVariables = {
		url: ''
	};

	/*static fragments = {
		// Fields used in the optimistic response
		recipe: () => Relay.QL`
			fragment on Recipe {
				title,
				state,
				instructions
			}
		`,
	};*/

	getMutation() {
	    return Relay.QL`mutation{importRecipe}`;
	}

	// ALL fields that COULD change as a result of this mutation
	getFatQuery() {
		return Relay.QL`
			fragment on ImportRecipePayload {
				newRecipeEdge {
					node {
						title,
						state,
						instructions
					}
				}
			}
		`;
	}

	// Tell Relay what to do with which fields (which fields to change, which to add etc)
	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'user',
			parentID: this.props.user.id,
			connectionName: 'recipes',
			edgeName: 'newRecipeEdge',
			rangeBehaviors: {
				'': 'added',
			}
		}];
	}

	getVariables() {
		return {
			url: this.props.url,
			//userId: this.props.user.id
		}
	}

	getOptimisticResponse() {
		return {
			// TODO: Return some default data that looks good enough
		}
	}
}
