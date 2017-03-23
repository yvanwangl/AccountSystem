/**
 * Created by wyf on 2017/2/28.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productStocksSchema = new Schema({
	productId: String,
	productName: String,
	quantity: String,
	price: Number,
	amount: Number,
	productUnit: String,
	type: String,
	userId: String
});

/**
 *here can add same methods or statics
 */
productStocksSchema.statics.findById = function (productId, cb) {
    return this.find({productId:productId}, cb);
};

module.exports = mongoose.model('ProductStocks', productStocksSchema);