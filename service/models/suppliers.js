/**
 * Created by wyf on 2017/2/28.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let supplierSchema = new Schema({
    supplierName: String,
    contactPeople: String,
    contactPhone: String,
    address: String,
    mem: String,
    accountName: String,
    accountBank: String,
    accountNo: String
});

/**
 *here can add same methods or statics
 */
supplierSchema.statics.findById = function (supplierId, cb) {
    return this.find({_id:supplierId}, cb);
};

module.exports = mongoose.model('Supplier', supplierSchema);