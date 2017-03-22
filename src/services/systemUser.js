import request from '../utils/request';

const LOGIN_API = '/api/login';

export async function doLogin(params) {
    console.log(params);
    return request( LOGIN_API,{
        method: 'POST',
        body: JSON.stringify(params)
    });
}

export async function doLogup(params) {
	return request( `${LOGIN_API}/logup`,{
		method: 'POST',
		body: JSON.stringify(params)
	});
}
