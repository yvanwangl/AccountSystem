let express = require('express');
let router = express.Router();
let Order = require('../models/orders');
let Orders = require('../models/orders');
let Storage = require('../models/storage');
let moment = require('moment');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

function compute(dataSource, computeKey) {
	return dataSource
			.map(data=> data[computeKey])
			.reduce((total, item)=> total+=item, 0);
}

/* GET orders listing. */
router.route('/')
	.get(function (req, res, next) {
		let {productId} = req.query;
		let queryCondition = {};
		if (productId) {
			queryCondition['productId'] = productId;
		}
		let orderComputeProducts = [];
		let storageComputeProducts = [];
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
				if (productGroup[product['_id']]) {
					productGroup[product['_id']].push(product);
				} else {
					productGroup[product['_id']] = [];
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
			orderComputeProducts = Object.keys(productGroup).map(key=> {
				const computedObj = {};
				computedObj['_id'] = key;
				computedObj['outAmount'] = compute(productGroup[key], 'quantity');
				computedObj['salePrice'] = compute(productGroup[key], 'amount');
			});
		});
		Storage.find({}, (err, storages)=>{
			const productGroup = {};
			storages
				.map(storage=> storage.products)
				.reduce((products, itemProducts)=> products.concat(itemProducts), [])
				.map(product => {
					if(productGroup[product['_id']]){
						productGroup[product['_id']].push(product);
					}else {
						productGroup[product['_id']] = [];
					}
				});
			storageComputeProducts = Object.keys(productGroup).map(key=> {
				const computedObj = {};
				const productGroupItem = productGroup[key];
				computedObj['_id'] = key;
				computedObj['inAmount'] = compute(productGroupItem, 'quantity');
				computedObj['purchasePrice'] = compute(productGroupItem, 'amount');
				computedObj['averagePrice'] = compute(productGroupItem, 'price')/productGroupItem.length;
			})

		});
		/*todo 将进货单和出货单中的商品再次进行一次 分组汇总，将对象属性进行合并， 并得出 计算值数据， 并对商品名称，商品编码，商品类别进行数据填充*/

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
