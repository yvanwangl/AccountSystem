/**
 * Created by wyf on 2017/1/16.
 */
import request from '../utils/request';
import HTTP_SERVER from '../services/serviceConfig';

const AUTH_API = `${HTTP_SERVER}/api/auth`;

export function getCurrentUser(){
    let localStorage = window.localStorage;
    return JSON.parse(localStorage['userInfo']);
}

export async function fetchIsAuth(){
    return request(`${AUTH_API}?authToken=${getCurrentUser()['authToken']}`);
}