/**
 * Created by wyf on 2017/2/28.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
	productCode: String,
	productName: String,
	productType: String,
	productUnit: String,
	productImg: String,
	userId: String
});

/**
 *here can add same methods or statics
 */
productSchema.statics.findById = function (supplierId, cb) {
    return this.find({_id:supplierId}, cb);
};

module.exports = mongoose.model('Product', productSchema);