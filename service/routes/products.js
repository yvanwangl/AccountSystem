/**
 * Created by hanlu on 2017/2/28.
 */
let express = require('express');
let router = express.Router();
let Product = require('../models/products');
let constants = require('../constants/constants');

router.route('/')
    .get((req, res, next)=>{
        let {page, productName}=req.query;
        let limit = constants.PAGE_SIZE;
        let skip = (page - 1) * limit;
		let currentUser = req.session.userInfo;
		let queryCondition = {
			userId: currentUser['_id']
		};
        if(productName){
			queryCondition['productName'] = new RegExp(productName);
		}
		Product.count(queryCondition, (err, count)=>{
			Product.find(queryCondition)
                .limit(limit)
                .skip(skip)
                .exec((err, products)=>{
                    if(err){
                        res.send({
                            success: false,
                            error: err
                        });
                    }else {
                        res.send({
                            success: true,
                            products: products,
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
        let product = req.body;
		let currentUser = req.session.userInfo;
        let newProduct = new Product(Object.assign({}, product, {userId: currentUser['_id']}));
		newProduct.save((err, product)=>{
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
    });

router.route('/:productId')
    .put((req, res, next)=>{
        let productId = req.params.productId;
        let product = req.body;
        let newProduct = Object.assign({}, product);
		Product.findOneAndUpdate({_id:productId}, newProduct, {new: true}, (err, product)=>{
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
		Product.remove({_id: productId}, (err)=>{
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
