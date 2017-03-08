let express = require('express');
let router = express.Router();
let Order = require('../models/orders');
let Customer = require('../models/customers');
let Product = require('../models/products');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

/* GET orders listing. */
router.route('/')
    .get(function (req, res, next) {
        let queryData = req.query;
        let page = queryData['page'];
        let timeRange = queryData['timeRange'];
        let limit = constants.PAGE_SIZE;
        let skip = (page - 1) * limit;
        console.log(queryData);
        if (timeRange) {
            let startTime = new Date(timeRange[0]);
            let endTime = new Date(timeRange[1]);
        }
        let queryCondition = {};
        Order.count(queryCondition, function (err, count) {
            Order.find(queryCondition)
                .sort('-createInstance')
                .limit(limit)
                .skip(skip)
                .exec(function (err, orders) {
                    if (err) {
                        res.send({
                            success: false,
                            error: err
                        });
                    } else {
                    	if(count>0){
                    		const customerMap = {};
                    		Customer.find({}, function (err, customers) {
								customers.map((customer)=>
									customerMap[customer['_id']] = customer['customerName']
								);
								orders.map((order) =>
									order['customerName'] = customerMap[order['customerId']]
								);
								res.send({
									success: true,
									orders: orders,
									page: {
										total: count,
										current: page
									}
								});
							});
						}else {
							res.send({
								success: true,
								orders: orders,
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
        let order = req.body;
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

router.route('/getOrderNumber')
    .get(function (req, res, next) {
        Order.find(function (error, orders) {
            if (error) {
                res.send({
                    success: false,
                    error: error
                });
            } else {
				Customer.find({},function(err, customers){
					if (error) {
						res.send({
							success: false,
							error: error
						});
					}else {
						Product.find({},function (err, products) {
							if(err){
								res.send({
									success: false,
									error: error
								});
							}else {
								res.send({
									success: true,
									orderNumber: utils.getOrderNumber(orders.length + 1),
									customers: customers,
									productList: products
								});
							}
						});

					}
				});
            }
        });
    });

router.route('/:orderId')
    .get(function (req, res, next) {
        let orderId = req.params.orderId;
        Order.findById(orderId, function (err, order) {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            }else {
            	Customer.find({}, function (err, customers) {
            		if(err){
						res.send({
							success: false,
							error: err
						});
					}else {
						Product.find({}, function (err, products) {
							if(err){
								res.send({
									success: false,
									error: err
								});
							}else {
								res.send({
									success: true,
									order: order,
									customers: customers,
									productList: products
								});
							}
						});
					}
				});
			}
        })
    })
    .put(function (req, res, next) {
        let orderId = req.params.orderId;
        let order = req.body;
        let newOrder = Object.assign({}, order, {modifyInstance: new Date()});
        Order.findOneAndUpdate({_id: orderId}, newOrder, {new: true}, function (err, order) {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            }
            res.send({
                success: true,
                order: order
            });
        });
    })
    .delete(function (req, res, next) {
        let orderId = req.params.orderId;
        Order.remove({_id: orderId}, function (err) {
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
