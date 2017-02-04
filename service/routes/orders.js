var express = require('express');
var router = express.Router();
var Order = require('../models/orders');
var utils = require('../utils/utils');
var constants = require('../constants/constants');

/* GET orders listing. */
router.route('/')
    .get(function(req, res, next){
        var queryData = req.query;
        var page = queryData['page'];
        var timeRange = queryData['timeRange'];
        var limit = constants.PAGE_SIZE;
        var skip = (page-1)*limit;
        console.log(queryData);
        if(timeRange){
            var startTime = new Date(timeRange[0]);
            var endTime = new Date(timeRange[1]);
        }
        var queryCondition = {};
        Order.count(queryCondition, function(err, count){
            Order.find(queryCondition)
                .sort('-createInstance')
                .limit(limit)
                .skip(skip)
                .exec(function(err, orders){
                    if(err){
                        res.send({
                            success: false,
                            error:err
                        });
                    }else {
                        res.send({
                            success: true,
                            orders:orders,
                            page:{
                                total: count,
                                current: page
                            }
                        });
                    }
                });
        });
    })
    .post(function(req, res, next){
        var order = req.body;
        var newOrder = new Order(Object.assign({},order,{createInstance:new Date()}));
        newOrder.save(function(err, order){
            if(err){
                res.send({
                    success: false,
                    error:err
                });
            }else {
                res.send({
                    success:true,
                    orders:order
                });
            }
        });
    });

router.route('/getOrderNumber')
    .get(function(req, res, next){
        Order.find(function(error, orders){
            if(error){
                res.send({
                    success: false,
                    error: error
                });
            }else {
                res.send({
                    success: true,
                    orderNumber: utils.getOrderNumber(orders.length+1)
                });
            }
        });
    });

router.route('/:orderId')
    .get(function(req, res, next){
        var orderId = req.params.orderId;
        Order.findById(orderId, function(err, order){
            if(err){
                res.send({
                    success: false,
                    error: err
                });
            }
            res.send({
                success: true,
                order: order
            });
        })
    })
    .put(function(req, res, next){
        var orderId = req.params.orderId;
        var order = req.body;
        var newOrder = Object.assign({}, order, {modifyInstance: new Date()});
        Order.findOneAndUpdate({_id:orderId}, newOrder, {new:true}, function(err, order){
            if(err){
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
    .delete(function(req, res, next){
        var orderId = req.params.orderId;
        Order.remove({_id:orderId}, function(err){
            if(err){
                res.send({
                    success:false,
                    error: err
                });
            }else {
                res.send({
                    success: true
                });
            }
        });
    });

module.exports = router;
