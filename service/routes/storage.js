let express = require('express');
let router = express.Router();
let Storage = require('../models/storage');
let Supplier = require('../models/suppliers');
let Product = require('../models/products');
let ProductStocks = require('../models/productStocks');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

/* GET storage listing. */
router.route('/')
	.get(function (req, res, next) {
		let queryData = req.query;
		let {page, timeRange, supplierId, noteNumber} = queryData;
		let limit = constants.PAGE_SIZE;
		let skip = (page - 1) * limit;
		let currentUser = req.session.userInfo;
		let queryCondition = {
			userId: currentUser['_id']
		};
		if (timeRange) {
			let startTime = new Date(timeRange[0]);
			let endTime = new Date(timeRange[1]);
			queryCondition['createInstance'] = {
				"$gte": startTime,
				"$lte": endTime
			};
		}
		if(supplierId){
			queryCondition['supplierId'] = supplierId;
		}
		if(noteNumber){
			queryCondition['noteNumber'] = new RegExp(noteNumber);
		}
		Storage.count(queryCondition, function (err, count) {
			Storage.find(queryCondition)
				.sort('-createInstance')
				.limit(limit)
				.skip(skip)
				.exec(function (err, storage) {
					if (err) {
						res.send({
							success: false,
							error: err
						});
					} else {
						if(count>0){
							const supplierMap = {};
							Supplier.find({}, function(err, suppliers){
								if(err){
									res.send({
										success: false,
										error: err
									});
								}
								suppliers.map((supplier)=>
									supplierMap[supplier['_id']] = supplier['supplierName']
								);
								storage.map((item)=>
									item['supplierName'] = supplierMap[item['supplierId']]
								);
								res.send({
									success: true,
									storage: storage,
									page: {
										total: count,
										current: page
									}
								});
							});
						}else {
							res.send({
								success: true,
								storage: storage,
								page: {
									total: count,
									current: page
								}
							});
						}
					}
				});
		});
	})
	.post(function (req, res, next) {
		let storage = req.body;
		let currentUser = req.session.userInfo;
		let newStorage = new Storage(Object.assign({}, storage, {userId: currentUser['_id'], createInstance: new Date()}));
		let products = storage['products'];
		let productStocks = products
			.filter(product=> product.productId && product.productId!='')
			.map(product=> {
				product['userId'] = currentUser['_id'];
				product['type'] = 'in';
				return new ProductStocks(product);
			});
		newStorage.save(function (err, storage) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			} else {
				if(productStocks.length){
					ProductStocks.insertMany(productStocks,(err)=>{
						if(err){
							res.send({
								success: false,
								error: err
							});
						}else {
							res.send({
								success: true,
								storage: storage
							});
						}
					});
				}else {
					res.send({
						success: true,
						storage: storage
					});
				}
			}
		});
	});

router.route('/getNoteNumber')
	.get(function (req, res, next) {
		let currentUser = req.session.userInfo;
		Storage.find({userId: currentUser['_id']},function (error, storages) {
			if (error) {
				res.send({
					success: false,
					error: error
				});
			} else {
				let sequence;
				if(storages.length==0){
					sequence = 1;
				}else if(storages.length==1) {
					sequence = storages[0].sequence+1;
				}else {
					sequence = storages.sort((s1, s2) => s2.sequence - s1.sequence)[0].sequence+1;
				}
				res.send({
					success: true,
					sequence: sequence,
					noteNumber: utils.getNoteNumber(sequence)
				});
			}
		});
	});

router.route('/:storageId')
	.get(function (req, res, next) {
		let storageId = req.params.storageId;
		Storage.findById(storageId, function (err, storage) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}else {
				res.send({
					success: true,
					storage: storage
				});
			}
		})
	})
	.put(function (req, res, next) {
		let storageId = req.params.storageId;
		let storage = req.body;
		let newStorage = Object.assign({}, storage, {modifyInstance: new Date()});
		Storage.findOneAndUpdate({_id: storageId}, newStorage, {new: true}, function (err, storage) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}
			res.send({
				success: true,
				storage: storage
			});
		});
	})
	.delete(function (req, res, next) {
		let storageId = req.params.storageId;
		Storage.remove({_id: storageId}, function (err) {
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
	});

module.exports = router;
