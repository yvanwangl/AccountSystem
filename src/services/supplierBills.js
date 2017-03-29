import request from '../utils/request';
import qs from 'qs';

const ORDER_API = '/api/supplierBills';

export async function query(params) {
    return request(`${ORDER_API}?${qs.stringify(params)}`);
}

export async function doClearStorage(params) {
    return request(`${ORDER_API}/doClearStorage`, {
        method: 'post',
        body: JSON.stringify(params)
    });
}

export async function doClearBill(params) {
	return request(`${ORDER_API}/doClearBill`, {
		method: 'post',
		body: JSON.stringify(params)
	});
}


