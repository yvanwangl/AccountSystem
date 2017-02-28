/**
 * Created by wyf on 2017/1/13.
 */
let mongoose =  require('mongoose');
let Schema = mongoose.Schema;

let orderSchema = new Schema({
    createInstance: Date,
    orderNumber: String,
    customerId: String,
    totalAmount: Number,
    paymentAmount: Number,
    mem: String,
    products: Array,
});

/**
 *here can add same methods or statics
 */
orderSchema.statics.findByOrderId=function(orderId, cb){
    return this.find({_id:orderId}, cb);
};

module.exports = mongoose.model('Order', orderSchema);