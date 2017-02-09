/**
 * Created by wyf on 2017/1/13.
 */
function getAuthToken(len) {
    var tokenStr = '0123456789abcdefghijklmnopqrstuvwxy';
    var token = '';
    for (var i = 0; i < len; i++) {
        token += tokenStr[Math.floor(Math.random() * tokenStr.length)];
    }
    return token;
}

function getOrderNumber(number) {
    var prefix = 'MDC';
    var date = new Date();
    var year = date.getFullYear();
    var month = prefixO(date.getMonth() + 1);
    var day = prefixO(date.getDate() + 1);
    return prefix + year + month + day + (prefixOOO(number));
}

function prefixO(number) {
    return ('0' + number).substr(-2);
}

function prefixOOO(number) {
    return ('000' + number).substr(-4);
}


module.exports = {
    getAuthToken: getAuthToken,
    getOrderNumber: getOrderNumber
};