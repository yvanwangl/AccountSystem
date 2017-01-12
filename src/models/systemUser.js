import {doLogin} from '../services/systemUser';
import {parse} from 'qs';
export default {

    namespace: 'systemUser',

    state: {
        user: '王亚飞',
        isLogin: true,
        modalVisible: false,
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
            console.log(payload);
            const {data} = yield call(doLogin, payload);
            if(data && data.success){
                yield put({
                    type: 'modifySuccess',
                    payload: newOrder
                });
            }
        }
    },

    reducers: {
        logout(state, action){
            return {...state, user:null, isLogin:false};
        },
        login(state, action){
            return {...state, modalVisible:true};
        },
        loginSuccess(state){
            return {...state, modalVisible:false};
        },
        hideModal(state){
            return {...state, modalVisible:false};
        }
    },

}
