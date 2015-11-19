var AppDispatcher = require('../dispatcher/AppDispatcher');
var MOFConstants = require('../constants/MofConstants');

var MOFActions = {
	// Receive inital product data
	receiveProduct: function(data) {
		AppDispatcher.handleAction({
			actionType: MOFConstants.RECEIVE_DATA,
			data: data
		});
	},

	filterSelected: function (data) {
		AppDispatcher.handleAction({
			actionType: MOFConstants.FILTER_SELECTED,
			type: data.type,
			isActive: data.isActive
		});
	}
};

module.exports = MOFActions;

