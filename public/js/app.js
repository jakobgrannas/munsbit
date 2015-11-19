/** @jsx React.DOM */

var React = require('react');
var ProductData = require('./ProductData');
var ProductAPI = require('./utils/ProductAPI');
var MultiOptionFilter = require('./components/MultiOptionFilter.react');

// Load Mock Product Data into localStorage
ProductData.init();

// Load Mock API Call
ProductAPI.getProductData();

// Render FluxCartApp Controller View
React.render(
  <MultiOptionFilter />,
  document.getElementById('mof-body')
);
