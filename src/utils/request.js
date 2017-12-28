import fetch from 'dva/fetch';
import {HTTP_SERVER} from '../constants/constants';

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
const defaultOptions = {
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
};
export default function request(url, options) {
    return fetch(`${HTTP_SERVER}${url}`, {...defaultOptions, ...options})
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => ({data}))
        .catch((err) => ({err}));
}
