import request from '../utils/request';
import qs from 'qs';

const SUPPLIER_API = `/api/suppliers`;

export async function query(params) {
    return request(`${SUPPLIER_API}?${qs.stringify(params)}`);
}

export async function queryAll() {
    return request(`${SUPPLIER_API}/all`);
}

export async function create(params) {
    return request(SUPPLIER_API, {
        method: 'post',
        body: JSON.stringify(params)
    });
}

export async function modify(params) {
    return request(`${SUPPLIER_API}/${params['id']}`, {
        method: 'put',
        body: JSON.stringify(params)
    });
}

export async function del(params) {
    return request(`${SUPPLIER_API}/${params['id']}`, {
        method: 'delete'
    });
}
