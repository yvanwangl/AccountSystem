/**
 * Created by hanlu on 2017/2/28.
 */
let express = require('express');
let router = express.Router();
let Settlement = require('../models/settlement');
let constants = require('../constants/constants');

router.route('/')
    .get((req, res, next)=>{
        let {page, productName}=req.query;
        let limit = constants.PAGE_SIZE;
        let skip = (page - 1) * limit;
        let queryCondition = {};
        if(productName){
			queryCondition['productName'] = new RegExp(productName);
		}
		Settlement.count(queryCondition, (err, count)=>{
			Settlement.find(queryCondition)
                .limit(limit)
                .skip(skip)
                .exec((err, settlements)=>{
                    if(err){
                        res.send({
                            success: false,
                            error: err
                        });
                    }else {
                        res.send({
                            success: true,
                            settlements: settlements,
                            page: {
                                total: count,
                                current: page
                            }
                        });
                    }
                });
        });
    });

router.route('/:settlementId')
    .put((req, res, next)=>{
        let productId = req.params.productId;
        let product = req.body;
        let newProduct = Object.assign({},product);
		Settlement.findOneAndUpdate({_id:productId}, newProduct, {new: true}, (err, product)=>{
            if(err){
                res.send({
                    success: false,
                    error: err
                });
            }else {
                res.send({
                    success: true,
					product: product
                });
            }
        });
    })
    .delete((req, res, next)=>{
        let productId = req.params.productId;
		Settlement.remove({_id: productId}, (err)=>{
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
