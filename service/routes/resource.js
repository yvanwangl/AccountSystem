let express = require('express');
let router = express.Router();
let Order = require('../models/orders');
let Storage = require('../models/storage');
let Product = require('../models/products');
let moment = require('moment');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

function compute(dataSource, computeKey) {
	return dataSource
		.map(data => data[computeKey])
		.reduce((total, item) => {
			if(item){
				return total += parseInt(item);
			}else {
				return total += 0;
			}
		}, 0);
}

/* GET orders listing. */
router.route('/')
	.get(function (req, res, next) {
		let {productId} = req.query;
		console.log(productId);
		Order.find({}, (err, orders) => {
			const productGroup = {};
			/*得到出库的所有商品的集合， 并对集合进行分组， 获得商品分组对象， 结构如下
			 * productGroup = {
			 * 	'id3242134324': [
			 *		{商品，商品}
			 *  	],
			 *  	'id3242476764': [
			 *		{商品，商品}
			 *  	]
			 * }
			 * */
			orders
				.map(order => order.products)
				.reduce((products, itemProducts) => products.concat(itemProducts), [])
				.map(product => {
					if (productGroup[product['productId']]) {
						productGroup[product['productId']].push(product);
					} else {
						productGroup[product['productId']] = [product];
					}
				});
			/*对商品分组对象进行合并操作， 将商品数量和金额进行汇总，得到如下对象数组，
			 *computeProducts = [
			 * 	{
			 * 		_id: 'id3242134324',
			 * 		outAmount: 300,
			 * 		salePrice: 10000
			 *	},
			 *	{
			 * 		_id: 'id3242476764',
			 * 		outAmount: 600,
			 * 		salePrice: 20000
			 *	}
			 * ];
			 * */
			let orderComputeProducts = Object.keys(productGroup).map(key => {
				const computedObj = {};
				const productGroupItem = productGroup[key];
				computedObj['_id'] = key;
				computedObj['outAmount'] = compute(productGroupItem, 'quantity');
				computedObj['salePrice'] = compute(productGroupItem, 'amount');
				/*销售均价*/
				computedObj['averagePrice'] = compute(productGroupItem, 'price') / productGroupItem.length;
				return computedObj;
			});

			Storage.find({}, (err, storages) => {
				const productGroup = {};
				storages
					.map(storage => storage.products)
					.reduce((products, itemProducts) => products.concat(itemProducts), [])
					.map(product => {
						if (productGroup[product['productId']]) {
							productGroup[product['productId']].push(product);
						} else {
							productGroup[product['productId']] = [product];
						}
					});
				let storageComputeProducts = Object.keys(productGroup).map(key => {
					const computedObj = {};
					const productGroupItem = productGroup[key];
					computedObj['_id'] = key;
					computedObj['inAmount'] = compute(productGroupItem, 'quantity');
					computedObj['purchasePrice'] = compute(productGroupItem, 'amount');
					computedObj['storageAveragePrice'] = compute(productGroupItem, 'price') / productGroupItem.length;
					computedObj['unit'] = productGroupItem[0]['unit'];
					return computedObj;
				});

				Product.find({}, (err, products) => {
					const productNameMap = {};
					const productCodeMap = {};
					const productTypeMap = {};
					products.map(product => {
						productNameMap[product['_id']] = product['productName'];
						productCodeMap[product['_id']] = product['productCode'];
						productTypeMap[product['_id']] = product['productType'];
					});
					/*将进货单和出货单中的商品再次进行一次 分组汇总，
					 *将对象属性进行合并， 并得出 计算值数据， 并对商品名称，
					 *商品编码，商品类别进行数据填充
					 * */
					/*将进货单和出货单中的商品再次进行一次 分组汇总*/
					const concatProducts = orderComputeProducts.concat(storageComputeProducts);
					const concatProductGroup = {};
					concatProducts.map(product => {
						if (concatProductGroup[product['_id']]) {
							concatProductGroup[product['_id']].push(product);
						} else {
							concatProductGroup[product['_id']] = [product];
						}
					});

					const productMapResult = Object.keys(concatProductGroup)
						.map(key => {
							return concatProductGroup[key].reduce((assignObj, product) => Object.assign({}, assignObj, product), {});
						})
						.map(product => {
							product['productName'] = productNameMap[product['_id']];
							product['productCode'] = productCodeMap[product['_id']];
							product['productType'] = productTypeMap[product['_id']];

							product['outAmount'] = product['outAmount'] ? product['outAmount']:0;
							product['amount'] = product['inAmount'] - product['outAmount'];

							product['averagePrice'] = product['averagePrice']?product['averagePrice']:product['storageAveragePrice'];
							product['stockFunds'] = product['amount'] * product['averagePrice'];

							product['salePrice'] = product['salePrice'] ? product['salePrice']:0;
							product['profitPrice'] = product['salePrice'] - product['purchasePrice'];

							return product;
						});

					res.send({
						success: true,
						products: productId ? productMapResult.filter(product=> product['_id']==productId):productMapResult
					});

				});
			});
		});
	})
	.post(function (req, res, next) {
		let order = req.body;
		console.log(moment.parseZone(new Date()));
		console.log(moment().local());
		let newOrder = new Order(Object.assign({}, order, {createInstance: new Date()}));
		newOrder.save(function (err, order) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			} else {
				res.send({
					success: true,
					orders: order
				});
			}
		});
	});

module.exports = router;
