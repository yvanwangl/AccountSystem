import {query, create, modify, del} from '../services/customers';
import {parse} from 'qs';
export default {

    namespace: 'customers',

    state: {
        list: [],
        total: null,
        customerName: '',
        loading: false,
        current: null,
        currentItem: {},
        breadcrumbItems: [
            ['/customer', '首页'],
            ['/customer', '客户管理'],
        ],
        editorVisible: false,
        editorType: 'create'
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname == '/customer') {
                    dispatch({
                        type: 'query',
                        payload: location.query
                    });
                }
            });
        },
    },

    effects: {
        *query({payload}, {select, call, put}){
			const isLogin = yield select(({systemUser})=> systemUser.isLogin);
			if(!isLogin){
				return;
			}
            yield put({type: 'showLoading'});
            yield put({
                type: 'updateQueryKey',
                payload: {
                    page: 1,
					customerName: '',
                    ...payload
                }
            });
            const {data} = yield call(query, parse(payload));
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.customers,
                        total: data.page.total,
                        current: data.page.current
                    }
                });
            }
        },
        *create({payload}, {call, put}){
            yield put({type: 'hideEditor'});
            yield put({type: 'showLoading'});
            const {data} = yield call(create, payload);
            if (data && data.success) {
                yield put({
                    type: 'query',
                    payload: {
                        page: 1,
                        field: '',
                        keyword: ''
                    }
                });
            }
        },
        *modify({payload}, {select, call, put}){
            yield put({type: 'hideEditor'});
            yield put({type: 'showLoading'});
            const id = yield select(({customers}) => customers.currentItem['_id']);
            const newCustomer = {...payload, id};
            const {data} = yield call(modify, newCustomer);
            if (data && data.success) {
                yield put({
                    type: 'modifySuccess',
                    payload: newCustomer
                });
                yield put({
                	type: 'resetCustomer'
				});
            }
        },
        *del({payload}, {call, put}){
            yield put({type: 'showLoading'});
            const {data} = yield call(del, {id: payload});
            if (data && data.success) {
                yield put({
                    type: 'delSuccess',
                    payload
                });
            }
        },
        *fetchRemote({payload}, {call, put}) {
        },
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.payload};
        },
        showLoading(state, action){
            return {...state, loading: true};
        },
        showEditor(state, action){
            return {...state, ...action.payload, editorVisible: true};
        },
        hideEditor(state, action){
            return {...state, editorVisible: false};
        },
        querySuccess(state, action){
            return {...state, ...action.payload, loading: false};
        },
        createSuccess(state, action){
            return {...state, ...action.payload, loading: false};
        },
        doModify(state, action){
            const currentItem = {...action.payload.currentItem};
            const editorType = action.payload.editorType;
            return {...state, currentItem: currentItem, editorType, editorVisible: true};
        },
        modifySuccess(state, action){
            const updateCustomer = action.payload;
            const newList = state.list.map(customer => customer._id == updateCustomer.id ? {...customer, ...updateCustomer} : customer);
            return {...state, list: newList, loading: false};
        },
        delSuccess(state, action){
            const newList = state.list.filter(customer => customer._id != action.payload);
            return {...state, list: newList, loading: false};
        },
        updateQueryKey(state, action){
            return {...state, ...action.payload};
        },
        resetCustomer(state, action){
            return {...state, currentItem: {}, editorVisible: false, editorType: 'create'};
        }
    },

}
