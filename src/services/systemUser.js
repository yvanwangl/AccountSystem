import request from '../utils/request';
import HTTP_SERVER from './serviceConfig';

const LOGIN_API = `${HTTP_SERVER}/api/login`;

export async function doLogin(params) {
    console.log(params);
    return request( LOGIN_API,{
        method: 'POST',
        body: JSON.stringify(params)
    });
}
