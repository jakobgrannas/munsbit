var React = require('react'),
	FilterButton = require('./FilterButton.react');

var FilterBar = React.createClass({
	render: function () {
		return (
			<div className="filters">
				<FilterButton filterType="pants">Pants</FilterButton>
				<FilterButton filterType="shirt">Shirts</FilterButton>
				<FilterButton filterType="underwear">Underwear</FilterButton>
				<FilterButton filterType="reset">Clear</FilterButton>
			</div>
		);
	}
});

module.exports = FilterBar;