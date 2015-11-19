var React = require('react'),
	ProductStore = require('../stores/ProductStore'),
	FilterStore = require('../stores/FilterStore'),
	Product = require('./Product.react'),
	FilterBar = require('./FilterBar.react');

// Define main Controller View
var MultiOptionFilter = React.createClass({
	productsChanged: function () {
		var products;

		if(!FilterStore.isFiltered()) {
			products = ProductStore.getProducts();
		}
		else {
			products = ProductStore.getProductsVisible();
		}

		this.setState({
			products: products
		});
	},
	componentDidMount: function() {
		ProductStore.addChangeListener(this.productsChanged);
	},
	componentWillUnmount: function () {
		ProductStore.removeChangeListener(this.productsChanged);
	},
	getInitialState: function() {
		return {
			products: ProductStore.getProductsVisible()
		};
	},
	render: function () {
		var productNodes = this.state.products.map(function (product) {
			return (
				<Product data={product} />
			);
		});
		return (
			<div className="mof">
				<FilterBar />
				<ul className="products">
					{productNodes}
				</ul>
			</div>
		);
	}
});

module.exports = MultiOptionFilter;