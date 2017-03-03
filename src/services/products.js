import request from '../utils/request';
import qs from 'qs';

const PRODUCT_API = `/api/products`;

export async function query(params) {
    return request(`${PRODUCT_API}?${qs.stringify(params)}`);
}

export async function create(params) {
    return request(PRODUCT_API, {
        method: 'post',
        body: JSON.stringify(params)
    });
}

export async function modify(params) {
    return request(`${PRODUCT_API}/${params['id']}`, {
        method: 'put',
        body: JSON.stringify(params)
    });
}

export async function del(params) {
    return request(`${PRODUCT_API}/${params['id']}`, {
        method: 'delete'
    });
}
