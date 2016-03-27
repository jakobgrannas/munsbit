import mongoose from 'mongoose';

let RecipeSchema = new mongoose.Schema({
	title: {
		type: String,
		required: false
	},
	instructions: {
		type: Array,
		required: true
	},
	clientMutationId: {
		type: String,
		required: true
	}
});

export let RecipeModel = mongoose.model('recipe', RecipeSchema);
