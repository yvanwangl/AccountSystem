import fetch from 'dva/fetch';
import {HTTP_SERVER, DEFAULT_OPTIONS} from '../constants/constants';

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
//使用 express-session 时，浏览器端无法写入cookie的原因是：
// 请求头设置模式为跨域，此处存在两个错误：
// 1、开发模式下应该为跨域模式，而生产模式应该为同域模式
// 2、开发模式下的跨越模式如果要写入 cookie 需要配置 credentials: 'include' 属性
// const defaultOptions = {
//     mode: 'cors',
//     credentials: 'include',
//     headers: {
//         'Content-Type': 'application/json'
//     },
// };
export default function request(url, options) {
    return fetch(`${HTTP_SERVER}${url}`, {...DEFAULT_OPTIONS, ...options})
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => ({data}))
        .catch((err) => ({err}));
}
