import request from '../utils/request';
import qs from 'qs';

export async function query(params) {
    return request(`/api/orders?${qs.stringify(params)}`);
}

export async function create(params) {
    return request('/api/orders',{
        method: 'post',
        body: qs.stringify(params)
    });
}

export async function modify(params) {
    return request('/api/orders',{
        method: 'put',
        body: qs.stringify(params)
    });
}

export async function del(params) {
    return request('/api/orders',{
        method: 'delete',
        body: qs.stringify(params)
    });
}
