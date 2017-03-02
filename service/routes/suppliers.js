/**
 * Created by hanlu on 2017/2/28.
 */
let express = require('express');
let router = express.Router();
let Supplier = require('../models/suppliers');
let constants = require('../constants/constants');

router.route('/')
    .get((req, res, next)=>{
        let queryData = req.query;
        let page = queryData['page'];
        let limit = constants.PAGE_SIZE;
        let skip = (page - 1) * limit;
        let queryCondition = {};
		Supplier.count(queryCondition, (err, count)=>{
			Supplier.find(queryCondition)
                .limit(limit)
                .skip(skip)
                .exec((err, suppliers)=>{
                    if(err){
                        res.send({
                            success: false,
                            error: err
                        });
                    }else {
                        res.send({
                            success: true,
                            suppliers: suppliers,
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
        let supplier = req.body;
        let newSupplier = new Supplier(Object.assign({}, supplier));
		newSupplier.save((err, supplier)=>{
            if(err){
                res.send({
                    success: false,
                    error: err
                });
            }else {
                res.send({
                    success: true,
                    supplier: supplier
                });
            }
        });
    });

router.route('/:supplierId')
    .put((req, res, next)=>{
        let supplierId = req.params.supplierId;
        let supplier = req.body;
        let newSupplier = Object.assign({},supplier);
        console.log(supplierId);
		Supplier.findOneAndUpdate({_id:supplierId}, newSupplier, {new: true}, (err, supplier)=>{
            console.log(supplier['_id']);
            if(err){
                res.send({
                    success: false,
                    error: err
                });
            }else {
                res.send({
                    success: true,
                    supplier: supplier
                });
            }
        });
    })
    .delete((req, res, next)=>{
        let supplierId = req.params.supplierId;
		Supplier.remove({_id: supplierId}, (err)=>{
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
