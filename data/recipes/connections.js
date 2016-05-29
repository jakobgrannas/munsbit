import {
	connectionDefinitions
} from 'graphql-relay';

import { ingredientType } from './types/ingredient';
import { recipeType } from './types/recipe';

const {
  connectionType: ingredientConnection,
  edgeType: ingredientEdge,
} = connectionDefinitions({name: 'Ingredient', nodeType: ingredientType});

const {
	connectionType: recipeConnection,
	edgeType: recipeEdge
} = connectionDefinitions({name: 'Recipe', nodeType: recipeType});

export {
	ingredientConnection,
	ingredientEdge,
	recipeConnection,
	recipeType
};
