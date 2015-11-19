var AppDispatcher = require('../dispatcher/AppDispatcher'),
	EventEmitter = require('events').EventEmitter,
	MOFConstants = require('../constants/MofConstants'),
	FilterStore = require("./FilterStore"),
	_ = require('underscore');

// Define initial data points
var _products = {},
	_productsVisible = {};

// Method to load product data from mock API
function updateProducts(data) {
	_products = data;
	_productsVisible = data;
}

function setProductsVisible(data) {
	_productsVisible = data;
}

function filterProducts(type) {
	var filteredResult;

	if(_products.length > 0) {
		filteredResult = _products.filter(function (product) {
			return FilterStore.isFilterActive(product.type);
		});
		return filteredResult;
	}

	return _products;
}

// Extend ProductStore with EventEmitter to add eventing capabilities
var ProductStore = _.extend({}, EventEmitter.prototype, {

	// Return Product data
	getProducts: function () {
		return _products;
	},

	getProductsVisible: function () {
		return _productsVisible;
	},

	// Emit Change event
	emitChange: function () {
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function (callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function (callback) {
		this.removeListener('change', callback);
	}

});

// Register callback with AppDispatcher
AppDispatcher.register(function (payload) {
	var action = payload.action;

	switch (action.actionType) {

		// Respond to RECEIVE_DATA action
		case MOFConstants.RECEIVE_DATA:
			updateProducts(action.data);
			break;

		case MOFConstants.FILTER_SELECTED:
			var type = action.type;

			if(type !== 'reset') {
				var products = filterProducts();
				setProductsVisible(products);
			}
			break;

		default:
			return true;
	}

	// If action was responded to, emit change event
	ProductStore.emitChange();

	return true;

});

module.exports = ProductStore;
