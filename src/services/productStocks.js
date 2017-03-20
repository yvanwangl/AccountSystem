import request from '../utils/request';
import qs from 'qs';

const PRODUCT_STOCKS_API = `/api/productStocks`;

export async function query() {
    return request(`${PRODUCT_STOCKS_API}`);
}

