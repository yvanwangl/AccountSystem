/**
 * Created by hanlu on 2017/2/28.
 */
let express = require('express');
let router = express.Router();
let ProductStocks = require('../models/productStocks');

router.route('/')
    .get((req, res, next)=>{
		let currentUser = req.session.userInfo;
		let queryCondition = {
			userId: currentUser['_id'],
			type:'in'
		};
		ProductStocks.find(queryCondition,(err, productStocks)=>{
			if(err){
				res.send({
					success: false,
					error: err
				});
			}else {
				let productDuplicates = [];
				let products = [];
				productStocks.map(product=> {
					if(productDuplicates.indexOf(product['productId'])==-1){
						let newProduct = {
							_id: product['productId'],
							productName: product['productName'],
							productUnit: product['productUnit'],
						};
						productDuplicates.push(product['productId']);
						products.push(newProduct);
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
