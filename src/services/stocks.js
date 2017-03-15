import request from '../utils/request';
import qs from 'qs';

const STOCK_API = '/api/stocks';

export async function query(params) {
    console.log(params);
    console.log(qs.stringify(params));
    return request(`${STOCK_API}?${qs.stringify(params)}`);
}