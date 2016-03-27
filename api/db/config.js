import mongoose from 'mongoose';

export default function () {
	let mongoUrl = 'mongodb://localhost/recipeApp',
		db = mongoose.connect(mongoUrl);

	return db;
};
