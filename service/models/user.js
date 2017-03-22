/**
 * Created by wyf on 2017/1/13.
 */
let mongoose =  require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: String,
    password: String,
    salt: String,
	admin: Boolean
});

/**
 *here can add same methods or statics
 */
userSchema.statics.findByUserName=function(username, cb){
    return this.find({username:new RegExp(username, 'i')}, cb);
};

module.exports = mongoose.model('User', userSchema);