import {doLogin} from '../services/systemUser';
import {parse} from 'qs';
export default {

    namespace: 'systemUser',

    state: {
        username: '',
        isLogin: false,
        modalVisible: false,
        authToken:'',
    },

    subscriptions: {
        /*setup({dispatch, history}) {
            history.listen(location=>{
                if(location.pathname == '/orders'){
                    dispatch({
                        type:'query',
                        payload: location.query
                    });
                }
            });
        },*/
    },

    effects: {
        *doLogin({payload}, {call, put}){
            yield put({type:'showLoading'});
            const {data} = yield call(doLogin, payload);
            if(data && data.success){
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
            localStorage.setItem('userInfo',JSON.stringify({}));
            return {...state, user:null, isLogin:false};
        },
        login(state, action){
            return {...state, modalVisible:true};
        },
        loginSuccess(state, action){
            let userInfo = action.payload;
            let localStorage = window.localStorage;
            localStorage.setItem('userInfo',JSON.stringify(userInfo));
            return {...state, ...userInfo, isLogin:true, modalVisible:false};
        },
        hideModal(state){
            return {...state, modalVisible:false};
        }
    },

}
