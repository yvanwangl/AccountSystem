let express = require('express');
let router = express.Router();
let Order = require('../models/orders');
let Customer = require('../models/customers');
let moment = require('moment');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

/* GET orders listing. */
router.route('/')
    .get(function (req, res, next) {
    	let {page, customerId} = req.query;
    	let limit = constants.PAGE_SIZE;
    	let skip = (page-1)*limit;
        let currentUser = global[Symbol.for('currentUser')];
		let queryCondition = {
			userId: currentUser['_id']
		};
		if(customerId){
			queryCondition['customerId'] = customerId;
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
                    		//欠债订单
                    		const debtOrders = orders.filter(order=> order.totalAmount!==order.paymentAmount);
							const debtOrdersClone = [...debtOrders];
							const customerObj = {};
							//按照客户对订单进行归类
							debtOrdersClone.map(order=> {
								if(customerObj[order['customerId']]){
									customerObj[order['customerId']].push(order);
								}else {
									customerObj[order['customerId']] = [order];
								}
							});

							//欠债的客户列表
							const debtCustomers = Object.keys(customerObj).map(key=>{
								let debtCustomer = {};
								debtCustomer['_id'] = key;
								return debtCustomer;
							});

							//账单列表
							const bills = Object.keys(customerObj).map(key=> {
								let billObj = {};
								billObj['_id'] = key;
								billObj['customerId'] = key;
								billObj['totalAmount'] = customerObj[key].reduce((total, order)=> total+=order.totalAmount, 0);
								billObj['paymentAmount'] = customerObj[key].reduce((total, order)=> total+=order.paymentAmount, 0);
								billObj['debtAmount'] = billObj['totalAmount']-billObj['paymentAmount'];
								return billObj;
							});

                    		const customerMap = {};
                    		Customer.find({}, function (err, customers) {
								customers.map((customer)=>
									customerMap[customer['_id']] = customer['customerName']
								);
								debtOrders.map((order) => {
									order['debtAmount'] = order['totalAmount']-order['paymentAmount'];
									order['customerName'] = customerMap[order['customerId']];
								});
								debtCustomers.map((customer) =>
									customer['customerName'] = customerMap[customer['_id']]
								);
								bills.map((bill) =>
									bill['customerName'] = customerMap[bill['customerId']]
								);
								res.send({
									success: true,
									orders: debtOrders,
									customers: debtCustomers,
									bills: bills,
									page: {
										total: debtOrders.length,
										current: page
									}
								});
							});
						}else {
							res.send({
								success: true,
								orders: [],
								customers: [],
								bills: [],
								page: {
									total: 0,
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
		let currentUser = global[Symbol.for('currentUser')];
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
		let currentUser = global[Symbol.for('currentUser')];
        Order.find({userId: currentUser['_id']},function (error, orders) {
            if (error) {
                res.send({
                    success: false,
                    error: error
                });
            } else {
				res.send({
					success: true,
					orderNumber: utils.getOrderNumber(orders.length + 1)
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
