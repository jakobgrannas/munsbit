var React = require('react');

// Flux product view
var Product = React.createClass({
	// Render product View
	render: function () {
		return (
      		<div className="product">
				<h4 className="product-name">{this.props.data.name}</h4>
				<img src={this.props.data.imageUrl} className="product-image" />
				<span className="price">{this.props.data.price}:-</span>
			</div>
		);
	}
});

module.exports = Product;