import request from '../utils/request';

const LOGIN_API = '/system';

export async function doLogin(params) {
    console.log(params);
    return request( `${LOGIN_API}/login`,{
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

export async function doLogout() {
	return request( `${LOGIN_API}/logout`,{
		method: 'POST'
	});
}
