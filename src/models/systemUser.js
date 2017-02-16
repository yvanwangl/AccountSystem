import {doLogin} from '../services/systemUser';
import {getCurrentUser, fetchIsAuth} from '../utils/webSessionUtils';

export default {

    namespace: 'systemUser',

    state: {
        username: '',
        isLogin: false,
        modalVisible: false,
        authToken: '',
        pathname: '/',
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location=> {
                if (location.pathname == '/') {
                    //权限验证通过
                    fetchIsAuth(function (isAuth) {
                        if (isAuth) {
                            dispatch({
                                type: 'loginSuccess',
                                payload: getCurrentUser()
                            });
                        }
                    });

                }
            });
        },
    },

    effects: {
        *doLogin({payload}, {call, put}){
            yield put({type: 'showLoading'});
            const {data} = yield call(doLogin, payload);
            if (data && data.success) {
                //登录成功
                yield put({
                    type: 'loginSuccess',
                    payload: data.userInfo
                });
            }
        }
    },

    reducers: {
        logout(state, action){
            let localStorage = window.localStorage;
            localStorage.setItem('userInfo', JSON.stringify({}));
            return {...state, user: null, isLogin: false};
        },
        login(state, action){
            return {...state, ...action.payload, modalVisible: true};
        },
        loginSuccess(state, action){
            let userInfo = action.payload;
            let localStorage = window.localStorage;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            return {...state, ...userInfo, isLogin: true, modalVisible: false};
        },
        hideModal(state){
            return {...state, modalVisible: false};
        }
    },

}
