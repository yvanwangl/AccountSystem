import request from '../utils/request';
import HTTP_SERVER from './serviceConfig';

const ORDER_API = `${HTTP_SERVER}/api/orders`;

export async function query(params) {
    return request(`${ORDER_API}?${qs.stringify(params)}`);
}

export async function create(params) {
    return request( ORDER_API,{
        method: 'post',
        body: JSON.stringify(params)
    });
}

export async function modify(params) {
    return request( ORDER_API,{
        method: 'put',
        body: JSON.stringify(params)
    });
}

export async function del(params) {
    return request( ORDER_API,{
        method: 'delete',
        body: JSON.stringify(params)
    });
}
