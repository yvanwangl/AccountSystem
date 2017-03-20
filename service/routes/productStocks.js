/**
 * Created by hanlu on 2017/2/28.
 */
let express = require('express');
let router = express.Router();
let ProductStocks = require('../models/productStocks');

router.route('/')
    .get((req, res, next)=>{
		ProductStocks.find({type:'in'},(err, productStocks)=>{
			if(err){
				res.send({
					success: false,
					error: err
				});
			}else {
				let productDuplicates = [];
				let products = productStocks.map(product=> {
					if(productDuplicates.indexOf(product['productId'])==-1){
						productDuplicates.push(product['productId']);
						return product;
					}
				});
				res.send({
					success: true,
					products: products
				});
			}
		});
    });

module.exports = router;
