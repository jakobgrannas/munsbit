var React = require('react'),
	FilterStore = require('../stores/FilterStore'),
	MOFActions = require('../actions/MofActions');

var FilterButton = React.createClass({
	handleClick: function () {
		var isActive = !this.state.isActive,
			data = {
				type: this.props.filterType,
				isActive: isActive
			};

		MOFActions.filterSelected(data);

		this.setState({
			isActive: isActive
		});
	},
	filtersChanged: function () {
		if (!FilterStore.isFiltered()) {
			this.setState({
				isActive: false
			});
		}
	},
	getInitialState: function () {
		return {
			isActive: false
		};
	},
	componentDidMount: function() {
		FilterStore.addChangeListener(this.filtersChanged);
	},
	componentWillUnmount: function () {
		FilterStore.removeChangeListener(this.filtersChanged);
	},
	render: function () {
		var type = this.props.filterType,
			classes = 'button button--' + type;

		classes += this.state.isActive && FilterStore.isFiltered() && type !== 'reset'  ? ' active' : '';

		return (
			<button className={classes} onClick={this.handleClick}>{this.props.children}</button>
		);
	}
});

module.exports =  FilterButton;