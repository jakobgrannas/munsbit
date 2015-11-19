var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MOFConstants = require('../constants/MofConstants');
var _ = require('underscore');

// Define initial data points
var _filters = [];

function addFilter(type) {
	_filters.push(type);
}

function removeFilter(type) {
	_filters = _.without(_filters, type);
}

function resetFilters () {
	_filters = [];
}

function isFiltered () {
	return _filters.length > 0;
}

function isFilterActive (type) {
	return _filters.indexOf(type) >= 0;
}

// Extend ProductStore with EventEmitter to add eventing capabilities
var FilterStore = _.extend({}, EventEmitter.prototype, {

	isFilterActive: isFilterActive,

	isFiltered: isFiltered,

	getSelectedFilters: function () {
		return _filters;
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

		case MOFConstants.FILTER_SELECTED:
			var type = action.type;

			if(type === 'reset') {
				resetFilters();
			}
			else if (action.isActive) {
				addFilter(type);
			}
			else {
				removeFilter(type);
			}

			break;

		default:
			return true;
	}

	// If action was responded to, emit change event
	FilterStore.emitChange();

	return true;

});

module.exports = FilterStore;
