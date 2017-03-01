/**
 * Created by hanlu on 2017/2/28.
 */
let express = require('express');
let router = express.Router();
let Customer = require('../models/customers');
let constants = require('../constants/constants');

router.route('/')
    .get((req, res, next)=>{
        let queryData = req.query;
        let page = queryData['page'];
        let limit = constants.PAGE_SIZE;
        let skip = (page - 1) * limit;
        let queryCondition = {};
        Customer.count(queryCondition, (err, count)=>{
            Customer.find(queryCondition)
                .limit(limit)
                .skip(skip)
                .exec((err, customers)=>{
                    if(err){
                        res.send({
                            success: false,
                            error: err
                        });
                    }else {
                        res.send({
                            success: true,
                            customers: customers,
                            page: {
                                total: count,
                                current: page
                            }
                        });
                    }
                });
        });
    })
    .post((req, res, next)=>{
        let customer = req.body;
        console.log(customer);
        let newCustomer = new Customer(Object.assign({}, customer));
        newCustomer.save((err, customer)=>{
            if(err){
                res.send({
                    success: false,
                    error: err
                });
            }else {
                res.send({
                    success: true,
                    customer: customer
                });
            }
        });
    });

router.route('/:customerId')
    .put((req, res, next)=>{
        let customerId = req.params.customerId;
        let customer = req.body;
        let newCustomer = Object.assign({},customer);
        console.log(customerId);
        Customer.findOneAndUpdate({_id:customerId}, newCustomer, {new: true}, (err, customer)=>{
            console.log(customer['_id']);
            if(err){
                res.send({
                    success: false,
                    error: err
                });
            }else {
                res.send({
                    success: true,
                    customer: customer
                });
            }
        });
    })
    .delete((req, res, next)=>{
        let customerId = req.params.customerId;
        Customer.remove({_id: customerId}, (err)=>{
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
