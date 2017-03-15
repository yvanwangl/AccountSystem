import request from '../utils/request';
import qs from 'qs';

const RESOURCE_API = '/api/resource';

export async function query(params) {
    console.log(params);
    console.log(qs.stringify(params));
    return request(`${RESOURCE_API}?${qs.stringify(params)}`);
}