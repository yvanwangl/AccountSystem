import request from '../utils/request';
import qs from 'qs';

const STORAGE_API = '/api/storage';

export async function query(params) {
    console.log(params);
    console.log(qs.stringify(params));
    return request(`${STORAGE_API}?${qs.stringify(params)}`);
}

export async function create(params) {
    return request(STORAGE_API, {
        method: 'post',
        body: JSON.stringify(params)
    });
}

export async function modify(params) {
    return request(`${STORAGE_API}/${params['id']}`, {
        method: 'put',
        body: JSON.stringify(params)
    });
}

export async function del(params) {
    return request(`${STORAGE_API}/${params['id']}`, {
        method: 'delete'
    });
}

export async function getNoteNumber() {
    return request(`${STORAGE_API}/getNoteNumber`);
}

export async function queryStorageById(storageId) {
    console.log(storageId);
    return request(`${STORAGE_API}/${storageId}`);
}
