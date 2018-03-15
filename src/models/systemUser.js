import { doLogin, doLogup, doLogout } from '../services/systemUser';
import { getCurrentUser, fetchIsAuth, redirect } from '../utils/webSessionUtils';
export default {

    namespace: 'systemUser',

    state: {
        username: '',
        isLogin: false,
        modalVisible: false,
        authToken: '',
        pathname: '/',
        logupModalVisible: false
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname == '/') {
                    //权限验证通过
                    if(sessionStorage.getItem('userInfo')){
                        dispatch({
                            type: 'loginSuccess',
                            payload: JSON.parse(sessionStorage.getItem('userInfo')) || {}
                        });
                    }
                }
            });
        },
    },

    effects: {
        *doLogin({ payload }, { call, put }) {
            let {
                userData,
                resolve,
                reject
            } = payload;
            yield put({ type: 'showLoading' });
            const { data } = yield call(doLogin, userData);
            if (data && data.success) {
                let userInfo = data.userInfo;
                yield sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                //登录成功
                yield put({
                    type: 'loginSuccess',
                    payload: userInfo
                });
                resolve();
            } else {
                reject(data);
            }
        },
        *doLogup({ payload }, { call, put }) {
            let {
                userData,
                resolve,
                reject
            } = payload;
            yield put({ type: 'showLoading' });
            const { data } = yield call(doLogup, userData);
            if (data && data.success) {
                let userInfo = data.userInfo;
                yield sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                //注册成功
                yield put({
                    type: 'logupSuccess',
                    payload: userInfo
                });
                resolve();
            } else {
                reject(data);
            }
        },
        *doLogout({ payload }, { call, put }) {
            const { data } = yield call(doLogout);
            if (data && data.success) {
                yield sessionStorage.removeItem('userInfo')
                //退出登录成功
                yield put({
                    type: 'logoutSuccess',
                    payload: data.userInfo
                });
            }
        }
    },

    reducers: {
        login(state, action) {
            return { ...state, modalVisible: true };
        },
        logup(state, action) {
            return { ...state, logupModalVisible: true };
        },
        loginSuccess(state, action) {
            let userInfo = action.payload;
            return { ...state, ...userInfo, isLogin: true, modalVisible: false };
        },
        logupSuccess(state, action) {
            let userInfo = action.payload;
            return { ...state, ...userInfo, isLogin: true, logupModalVisible: false };
        },
        logoutSuccess(state, action) {
            return { ...state, username: '', authToken: '', isLogin: false };
        },
        hideModal(state) {
            return { ...state, modalVisible: false };
        },
        hideLogupModal(state) {
            return { ...state, logupModalVisible: false };
        }
    },

}
