let express = require('express');
let router = express.Router();
let Storage = require('../models/storage');
let Supplier = require('../models/suppliers');
let moment = require('moment');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

/* GET orders listing. */
router.route('/')
    .get(function (req, res, next) {
    	let {page, supplierId} = req.query;
    	let limit = constants.PAGE_SIZE;
    	let skip = (page-1)*limit;
        let currentUser = req.session.userInfo;
		let queryCondition = {
			userId: currentUser['_id']
		};
		if(supplierId){
			queryCondition['supplierId'] = supplierId;
		}
		Storage.count(queryCondition, function (err, count) {
			Storage.find(queryCondition)
                .sort('-createInstance')
                .limit(limit)
                .skip(skip)
                .exec(function (err, storages) {
                    if (err) {
                        res.send({
                            success: false,
                            error: err
                        });
                    } else {
                    	if(count>0){
                    		//负债入库单
                    		const debtStorages = storages.filter(storage=> storage.totalAmount!==storage.paymentAmount);
							const debtStoragesClone = [...debtStorages];
							const supplierObj = {};
							//按照客户对订单进行归类
							debtStoragesClone.map(storage=> {
                                //只有供应商标识不为空才是正常的入库单，为空的入库单为结算生成的
                                if(storage['supplierId']){
                                    if(supplierObj[storage['supplierId']]){
                                        supplierObj[storage['supplierId']].push(storage);
                                    }else {
                                        supplierObj[storage['supplierId']] = [storage];
                                    }
                                }
							});

							//负债的供应商列表
							const debtSuppliers = Object.keys(supplierObj).map(key=>{
								let debtSupplier = {};
								debtSupplier['_id'] = key;
								return debtSupplier;
							});

							//负债账单列表
							const bills = Object.keys(supplierObj).map(key=> {
								let billObj = {};
								billObj['_id'] = key;
								billObj['supplierId'] = key;
								billObj['totalAmount'] = supplierObj[key].reduce((total, storage)=> total+=storage.totalAmount, 0);
								billObj['paymentAmount'] = supplierObj[key].reduce((total, storage)=> total+=storage.paymentAmount, 0);
								billObj['debtAmount'] = billObj['totalAmount']-billObj['paymentAmount'];
								return billObj;
							});

                    		const supplierMap = {};
                    		Supplier.find({}, function (err, suppliers) {
								suppliers.map((supplier)=>
									supplierMap[supplier['_id']] = supplier['supplierName']
								);
								debtStorages.map((storage) => {
									storage['debtAmount'] = storage['totalAmount']-storage['paymentAmount'];
									storage['supplierName'] = supplierMap[storage['supplierId']];
								});
								debtSuppliers.map((supplier) =>
									supplier['supplierName'] = supplierMap[supplier['_id']]
								);
								bills.map((bill) =>
									bill['supplierName'] = supplierMap[bill['supplierId']]
								);
								res.send({
									success: true,
									storage: debtStorages,
									suppliers: debtSuppliers,
									supplierBills: bills,
									page: {
										total: debtStorages.length,
										current: page
									}
								});
							});
						}else {
							res.send({
								success: true,
								storage: [],
								suppliers: [],
								supplierBills: [],
								page: {
									total: 0,
									current: page
								}
							});
						}
                    }
                });
        });
    });

router.route('/doClearStorage')
    .post(function (req, res, next) {
		let currentUser = req.session.userInfo;
		let {storageId, paymentAmount} = req.body;
		let newStorage = {
			paymentAmount: paymentAmount,
			modifyInstance: new Date()
		};
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
    });

router.route('/doClearBill')
	.post(function (req, res, next) {
		let currentUser = req.session.userInfo;
		let {supplierId} = req.body;
		let queryCondition = {
			userId: currentUser['_id'],
			supplierId: supplierId
		};
		Storage.find(queryCondition, (err, storages)=>{
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}else {
				const modifySuccessItems = storages.map(storage=> {
					const newStorage = {
						paymentAmount: storage.totalAmount,
						modifyInstance: new Date()
					};
					Storage.findOneAndUpdate({_id: storage['_id']}, newStorage, {new: true}, function (err, storage) {
						if (err) {
							res.send({
								success: false,
								error: err
							});
						}
					});
					return 'success';
				});
				if(modifySuccessItems.length == storages.length){
					res.send({
						success: true
					});
				}
			}
		});
	});

module.exports = router;
