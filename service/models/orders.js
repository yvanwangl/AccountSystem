/**
 * Created by wyf on 2017/1/13.
 */
let mongoose =  require('mongoose');
let Schema = mongoose.Schema;

let orderSchema = new Schema({
    createInstance: Date,
	sequence: Number,
    orderNumber: String,
    customerId: String,
    customerName: String,
    totalAmount: Number,
    paymentAmount: Number,
    debtAmount: Number,
    mem: String,
    products: Array,
	userId: String
});

/**
 *here can add same methods or statics
 */
orderSchema.statics.findByOrderId=function(orderId, cb){
    return this.find({_id:orderId}, cb);
};

module.exports = mongoose.model('Order', orderSchema);