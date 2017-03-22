/**
 * Created by wyf on 2017/2/28.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let customerSchema = new Schema({
    customerName: String,
    contactPeople: String,
    contactPhone: String,
    address: String,
    mem: String,
    accountName: String,
    accountBank: String,
    accountNo: String,
	userId: String
});

/**
 *here can add same methods or statics
 */
customerSchema.statics.findById = function (customerId, cb) {
    return this.find({_id:customerId}, cb);
};

module.exports = mongoose.model('Customer', customerSchema);