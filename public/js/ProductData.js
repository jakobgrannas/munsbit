module.exports = {
	// Load Mock Product Data Into localStorage
	init: function () {
		localStorage.clear();
		localStorage.setItem('product', JSON.stringify([
			{
				id: 1,
				type: "pants",
				sku: "pants1",
				name: "Great pair o' pants",
				price: 2500,
				imageUrl: "http://bjornborg.scene7.com/is/image/bjornborg/992703_902_1?$BB700$&fmt=jpeg"
			},
			{
				id: 2,
				type: "underwear",
				sku: "briefs1",
				name: "Underwear",
				price: 500,
				imageUrl: "http://bjornborg.scene7.com/is/image/bjornborg/151215-109031_90011_1?$BB700$&fmt=jpeg"
			},
			{
				id: 3,
				type: "shirt",
				sku: "shirt1",
				name: "Not just any shirt",
				price: 200,
				imageUrl: "http://bjornborg.scene7.com/is/image/bjornborg/146167-206001_70701_1?$BB700$&fmt=jpeg"
			}
		]));
	}

};