var MOFActions = require('../actions/MofActions');

module.exports = {

  // Load mock product data from localStorage into ProductStore via Action
  getProductData: function() {
    var data = JSON.parse(localStorage.getItem('product'));
    MOFActions.receiveProduct(data);
  }

};