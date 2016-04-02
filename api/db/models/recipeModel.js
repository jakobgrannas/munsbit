import mongoose from 'mongoose';

let RecipeSchema = new mongoose.Schema({
	state: {
		type: String,
		default: 'draft'
	},
	url: {
		type: String,
		required: true
	},
	title: String,
	cookingTime: String,
	servings: Number,
	author: String,
	datePublished: Date,
	imageUrl: String,
	instructions: [String],
	ingredients: [{
		name: String,
		amount: String
	}]
});

export let RecipeModel = mongoose.model('recipe', RecipeSchema);
