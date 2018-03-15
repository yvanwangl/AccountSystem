/**
 * Created by wyf on 2017/1/16.
 */
import request from '../utils/request';
import {message} from 'antd';
import {browserHistory} from 'dva/router';

const AUTH_API = `/api/auth`;

export function getCurrentUser() {
    let sessionStorage = window.sessionStorage;
    if (sessionStorage['userInfo']) {
        return JSON.parse(sessionStorage['userInfo']);
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
    //browserHistory.push 可能会导致路由丢失，推荐使用 reduxRouter
    browserHistory.push('/');
    return null;
}

/*授权验证*/
export function requireAuth(nextState, replace) {
    const userInfo = sessionStorage.getItem('userInfo');
    if(!userInfo || userInfo=='null'){
        message.error('请登录！');
        replace('/');
    }
}
