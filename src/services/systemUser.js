import request from '../utils/request';
import qs from 'qs';

export async function doLogin(params) {
    return request('http:localhost:3000/api/login',{
        method: 'post',
        body: qs.stringify(params)
    });
}
