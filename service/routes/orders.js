var express = require('express');
var router = express.Router();

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
    });

module.exports = router;
