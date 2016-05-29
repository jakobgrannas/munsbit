let userType = new GraphQLObjectType({
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
			type: new GraphQLList(recipeType),
			description: "List of the user's recipes",
			resolve: (recipes, args) => {
                let promise = new Promise((resolve, reject) => {
                    RecipeModel.find({}, (error, recipes) => {
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
