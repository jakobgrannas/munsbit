import mongoose from 'mongoose';

let RecipeSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	order: {
		type: Number,
		required: true
	},
	isChecked: {
		type: Boolean,
		default: false
	}
});

export let Recipe = mongoose.model('Recipe', RecipeSchema);
