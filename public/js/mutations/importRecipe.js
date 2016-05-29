import React from 'react';
import Relay from 'react-relay';
import Recipe from '../components/Recipe';

export default class ImportRecipeMutation extends Relay.Mutation {
	static initialVariables = {
		url: ''
	};

	static fragments = {
		User: () => Relay.QL`
			fragment on User {
				recipe
			}
		`,
        /*viewer: () => Relay.QL`
            fragment on Viewer {
				recipe(url: $url) {
					${Recipe.getFragment('recipe')}
				}
            }
        `*/
	};

	getMutation() {
	    return Relay.QL`mutation{importRecipe}`;
	}

	// ALL fields that COULD change as a result of this mutation
	getFatQuery() {
		return Relay.QL`
			fragment on ImportRecipePayload {
				recipe {
					title,
			    	state,
			    	instructions
			    }
			}
		`;
	}

	// Tell Relay what to do with which fields (which fields to change, which to add etc)
	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'user',
			parentID: '', // TODO: WHat should this be?
			connectionName: 'recipes',
			edgeName: 'newRecipeEdge', // Not sure what this should be either...
			rangeBehaviors: {
				'': 'added',
			}
		}];
	}

	getVariables() {
		return {
			url: this.props.url
		}
	}

	getOptimisticResponse() {
		return {
			// TODO: Return some default data that looks good enough
		}
	}
}
