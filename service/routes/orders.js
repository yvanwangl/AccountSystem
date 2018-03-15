let express = require('express');
let router = express.Router();
let Order = require('../models/orders');
let Customer = require('../models/customers');
let Product = require('../models/products');
let ProductStocks = require('../models/productStocks');
let moment = require('moment');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

/* GET orders listing. */
router.route('/')
    .get(function (req, res, next) {
        let {page, timeRange, customerId, orderNumber} = req.query;
        let limit = constants.PAGE_SIZE;
        let skip = (page - 1) * limit;
        let currentUser = req.session.userInfo;
		let queryCondition = {
			userId: currentUser['_id']
        };
        if (timeRange) {
            let startTime = new Date(timeRange[0]);
            let endTime = new Date(timeRange[1]);
            console.log(startTime);
			queryCondition['createInstance'] = {
				"$gte" : startTime,
				"$lte": endTime
			};
        }
        if(customerId){
			queryCondition['customerId'] = customerId;
		}
		if(orderNumber){
			queryCondition['orderNumber'] = new RegExp(orderNumber);
		}
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
		let currentUser = req.session.userInfo;
        let newOrder = new Order(Object.assign({}, order, {userId: currentUser['_id'], createInstance: new Date()}));
		let products = order['products'];
		let productStocks = products
			.filter(product=> product.productId && product.productId!='')
			.map(product=> {
				product['userId'] = currentUser['_id'];
				product['type'] = 'out';
				return new ProductStocks(product);
			});
        newOrder.save(function (err, order) {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            } else {
            	if(productStocks.length>0){
					ProductStocks.insertMany(productStocks, (err)=>{
						if(err){
							res.send({
								success: false,
								error: err
							});
						}else {
							res.send({
								success: true,
								order: order
							});
						}
					});
				}else {
					res.send({
						success: true,
						order: order
					});
				}
            }
        });
    });

router.route('/getOrderNumber')
    .get(function (req, res, next) {
		let currentUser = req.session.userInfo;
        Order.find({userId: currentUser['_id']},function (error, orders) {
            if (error) {
                res.send({
                    success: false,
                    error: error
                });
            } else {
            	let sequence;
            	if(orders.length==0){
					sequence = 1;
				} else if(orders.length==1) {
					sequence = orders[0].sequence+1;
				} else {
					sequence = orders.sort((o1, o2) => o2.sequence - o1.sequence)[0].sequence+1;
				}
				res.send({
					success: true,
					sequence: sequence,
					orderNumber: utils.getOrderNumber(sequence)
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
				res.send({
					success: true,
					order: order
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
