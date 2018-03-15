let express = require('express');
let router = express.Router();
let Order = require('../models/orders');
let Storage = require('../models/storage');
let Product = require('../models/products');
let ProductStocks = require('../models/productStocks');
let Settlement = require('../models/settlement');
let moment = require('moment');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

function compute(dataSource, computeKey) {
	return dataSource
		.map(data => data[computeKey])
		.reduce((total, item) => {
			if(item){
				return total += item*1;
			}else {
				return total += 0;
			}
		}, 0);
}

function getResource(queryCondition, callback) {
	Order.find(queryCondition, (err, orders) => {
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

		Storage.find(queryCondition, (err, storages) => {
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
				computedObj['productUnit'] = productGroupItem[0]['productUnit'];
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

				console.log(concatProductGroup);
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

				if(callback){
					callback(productMapResult);
				}
				return productMapResult;
			});
		});
	});
}

/* GET orders listing. */
router.route('/')
	.get(function (req, res, next) {
		let currentUser = req.session.userInfo;
		let {productId} = req.query;
		Settlement.find({userId: currentUser['_id']})
			.sort('-createInstance')
			.exec(function (err, settlements) {
				if (err) {
					res.send({
						success: false,
						error: err
					});
				}else {
					let queryCondition = {
						userId: currentUser['_id']
					};
					if(settlements.length>0){
						queryCondition['createInstance'] = {
							"$gte" : settlements[0]['createInstance']
						}
					}
					getResource(queryCondition, (productMapResult)=>{
						res.send({
							success: true,
							products: productId ? productMapResult.filter(product=> product['_id']==productId):productMapResult
						});
					});
				}
			});
	})
	/*
	* 资源结算：
	* 第一步，生成出货单，
	* 第二步，生成结算单，打上时间戳
	* 第三步，生成入库单
	* */
	.post(function (req, res, next) {
		/*
		*第一步，生成出货单，
		*获取系统中当前资源信息，包括库存商品数量及销售利润额
		* */
		let currentUser = req.session.userInfo;
		Settlement.find({userId: currentUser['_id']})
			.sort('-createInstance')
			.exec(function (err, settlements) {
				if (err) {
					res.send({
						success: false,
						error: err
					});
				}else {
					let queryCondition = {
						userId: currentUser['_id']
					};
					if(settlements.length>0){
						queryCondition['createInstance'] = {
							"$gte" : settlements[0]['createInstance']
						}
					}
					getResource(queryCondition, (productMapResult)=> {
						Order.find({userId: currentUser['_id']},function (error, orders) {
							if (error) {
								res.send({
									success: false,
									error: error
								});
							} else {
								/*生成订单*/
								let products = productMapResult.map((product, index)=> {
									return {
										remarks: '结算商品',
										amount: 0,
										price: 0,
										productUnit: product['productUnit'],
										quantity: product['amount'],
										productName: product['productName'],
										productId: product['_id'],
										key: index
									};
                                });
                                let sequence;
                                if(orders.length==0){
                                    sequence = 1;
                                } else if(orders.length==1) {
                                    sequence = orders[0].sequence+1;
                                } else {
                                    sequence = orders.sort((o1, o2) => o2.sequence - o1.sequence)[0].sequence+1;
                                }
								const order = new Order({
                                    sequence: sequence,
									orderNumber: utils.getOrderNumber(sequence),
									customerId: '',
									totalAmount: 0,
									paymentAmount: 0,
									mem: '结算生成的出货单，所以出货单金额及付款金额均为0元',
									createInstance: new Date(),
									products: products,
									userId: currentUser['_id']
								});
								let productStocks = products
									.filter(product=> product.productId!='')
									.map(product=> {
										product['userId'] = currentUser['_id'];
										product['type'] = 'out';
										return new ProductStocks(product);
									});
								order.save((err, order)=>{
									if(err){
										res.send({
											success: false,
											error: error
										});
									}else {
										/*先保存库存商品记录*/
										ProductStocks.insertMany(productStocks, (err)=>{
											if(err){
												res.send({
													success: false,
													error: err
												});
											}else {
												/*第二步，生成结算单*/
												const settlementAmount = productMapResult.reduce((total, product)=> total += product['profitPrice'], 0);
												const settlement = new Settlement({
													createInstance: new Date(),
													userName: currentUser['username'],
													settlementAmount: settlementAmount,
													products: productMapResult,
													userId: currentUser['_id']
												});
												settlement.save((err, settlement)=>{
													if(err){
														res.send({
															success: false,
															error: error
														});
													}else {
														/*第三步，生成入库单*/
														Storage.find({userId: currentUser['_id']},function (error, storages) {
															if (error) {
																res.send({
																	success: false,
																	error: error
																});
															} else {
																/*let products = productMapResult.map((product, index)=> {
																	return {
																		remarks: '结算商品',
																		amount: 0,
																		price: 0,
																		productUnit: product['productUnit'],
																		quantity: product['amount'],
																		productName: product['productName'],
																		productId: product['_id'],
																		key: index
																	};
                                                                });*/
                                                                let sequence;
                                                                if(storages.length==0){
                                                                    sequence = 1;
                                                                }else if(storages.length==1) {
                                                                    sequence = storages[0].sequence+1;
                                                                }else {
                                                                    sequence = storages.sort((s1, s2) => s2.sequence - s1.sequence)[0].sequence+1;
                                                                }
																const storage = new Storage({
                                                                    sequence: sequence,
																	noteNumber: utils.getNoteNumber(sequence),
																	supplierId: '',
																	totalAmount: 0,
																	paymentAmount: 0,
																	mem: '结算生成的入库单，所以出货单金额及付款金额均为0元',
																	createInstance: new Date(),
																	products: products,
																	userId: currentUser['_id']
																});
																let productStocks = products
																	.filter(product=> product.productId!='')
																	.map(product=> {
																		product['userId'] = currentUser['_id'];
																		product['type'] = 'in';
																		return new ProductStocks(product);
																	});
																storage.save((err, storage)=>{
																	if(err){
																		res.send({
																			success: false,
																			error: error
																		});
																	}else {
																		ProductStocks.insertMany(productStocks,(err)=> {
																			if (err) {
																				res.send({
																					success: false,
																					error: err
																				});
																			} else {
																				res.send({
																					success: true
																				});
																			}
																		});
																	}
																});
															}
														});
													}
												});
											}
										});
									}
								});
							}
						});
					});
				}
			});
	});

module.exports = router;
