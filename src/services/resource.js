import request from '../utils/request';
import qs from 'qs';

const RESOURCE_API = '/api/resource';

export async function query(params) {
    return request(`${RESOURCE_API}?${qs.stringify(params)}`);
}

export async function onSettlement() {
	return request(RESOURCE_API,{
		method: 'post',
		body: JSON.stringify({})
	});
}