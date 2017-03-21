import request from '../utils/request';
import qs from 'qs';

const SETTLEMENT_API = '/api/settlement';

export async function query(params) {
    return request(`${SETTLEMENT_API}?${qs.stringify(params)}`);
}
