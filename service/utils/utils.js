/**
 * Created by wyf on 2017/1/13.
 */
function getAuthToken(len){
    var tokenStr = '0123456789abcdefghijklmnopqrstuvwxy';
    var token ='';
    for(var i=0; i<len; i++){
        token += tokenStr[Math.floor(Math.random()*tokenStr.length)];
    }
    return token;
}

module.exports ={
    getAuthToken: getAuthToken
};