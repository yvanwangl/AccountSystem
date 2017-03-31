/**
 * Created by wyf on 2017/1/13.
 */

function getAuthToken(len) {
    let tokenStr = '0123456789abcdefghijklmnopqrstuvwxy';
    let token = '';
    for (let i = 0; i < len; i++) {
        token += tokenStr[Math.floor(Math.random() * tokenStr.length)];
    }
    return token;
}

function getOrderNumber(number) {
	return getNumber('MDC', number);
}

function getNoteNumber(number) {
	return getNumber('MDS', number);
}

function getNumber(prefix, number) {
	let date = new Date();
	let year = date.getFullYear();
	let month = prefixO(date.getMonth() + 1);
	let day = prefixO(date.getDate());
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
    getOrderNumber: getOrderNumber,
	getNoteNumber: getNoteNumber
};