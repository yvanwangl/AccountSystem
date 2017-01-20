var express = require('express');
var router = express.Router();
var Order = require('../models/orders');
var utils = require('../utils/utils');

/* GET orders listing. */
router.route('/')
    .get(function(req, res, next){
        var queryData = req.query;
        var timeRange = queryData['timeRange'];
        if(timeRange){
            var startTime = new Date(timeRange[0]);
            var endTime = new Date(timeRange[1]);
        }
        var orders = [];
        [1,2,3,4,5,6,7,8,9,10].map((item, index)=>{
            orders.push({
                id:index,
                createInstance: new Date(),
                orderNumber: 'wxce00000'+index,
                customerName: 'wangyafei',
                totalAmount: 100,
                paymentAmount: 50,
                orderInfo: 'info',
            });
        });
        res.send({
            success:'true',
            orders:orders,
            page:{
                total:100,
                current:1
            }
        });
    })
    .post(function(req, res, next){

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

module.exports = router;
