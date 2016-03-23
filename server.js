import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {schema} from './data/schema';
import mongoose from './api/db/config.js';

const APP_PORT = 1337;
const GRAPHQL_PORT = 8787;

// Set up mongo(ose)
mongoose();

// Expose a GraphQL endpoint
let graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({
	schema: schema,
	pretty: true,
	graphiql: true
}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
	`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
let compiler = webpack({
	entry: path.resolve(__dirname, 'public', 'js', 'app.js'),
	module: {
		loaders: [
	    	{
	        	exclude: /node_modules/,
		        loader: 'babel',
		        query: {plugins: ['./build/babelRelayPlugin']},
	    		test: /\.js$/,
	    	},
	    ]
	},
	output: {
    	filename: 'bundle.js',
    	path: '/'
	}
});

let app = new WebpackDevServer(compiler, {
	contentBase: '/public/',
	proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
	publicPath: '/js/',
	stats: {colors: true}
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
	console.log(`App is now running on http://localhost:${APP_PORT}`);
});
