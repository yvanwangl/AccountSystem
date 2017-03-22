/**
 * Created by wyf on 2017/1/13.
 */
let mongoose =  require('mongoose');
let Schema = mongoose.Schema;

let settlementSchema = new Schema({
    createInstance: Date,
    userId: String,
    userName: String,
    settlementAmount: Number,
	products: Array,
	userId: String
});

/**
 *here can add same methods or statics
 */
/*settlementSchema.statics.findByOrderId=function(orderId, cb){
    return this.find({_id:orderId}, cb);
};*/

module.exports = mongoose.model('Settlement', settlementSchema);