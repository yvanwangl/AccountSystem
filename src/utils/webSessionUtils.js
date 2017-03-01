/**
 * Created by wyf on 2017/1/16.
 */
import request from '../utils/request';
import {message} from 'antd';
import {browserHistory} from 'dva/router';

const AUTH_API = `/api/auth`;

export function getCurrentUser() {
    let localStorage = window.localStorage;
    if (localStorage['userInfo']) {
        return JSON.parse(localStorage['userInfo']);
    }
    return {};
}

export async function fetchIsAuth(callback) {
    return request(`${AUTH_API}?authToken=${getCurrentUser()['authToken']}`)
        .then(data => callback(data.data.isAuth))
        .catch(e => console.log(e));
}

export function redirect() {
    message.error('请登录！');
    browserHistory.push('/');
    return null;
}
