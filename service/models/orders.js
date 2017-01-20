/**
 * Created by wyf on 2017/1/13.
 */
var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
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
orderSchema.statics.findByUserId=function(userId, cb){
    return this.find({_id:userId}, cb);
};

module.exports = mongoose.model('Order', orderSchema);