import {query, create, modify, del} from '../services/products';
import {parse} from 'qs';
export default {

    namespace: 'settlement',

    state: {
        list: [],
        total: null,
		timeRange: [],
        products: [],
        loading: false,
        current: null,
        breadcrumbItems: [
            ['/settlement', '首页'],
            ['/settlement', '结算管理'],
        ],
        editorVisible: false,
        editorType: 'create'
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname == '/settlement') {
                    dispatch({
                        type: 'query',
                        payload: location.query
                    });
                }
            });
        },
    },

    effects: {
        *query({payload}, {call, put}){
            yield put({type: 'showLoading'});
            yield put({
                type: 'updateQueryKey',
                payload: {
                    page: 1,
					timeRange: '',
                    ...payload
                }
            });
            const {data} = yield call(query, parse(payload));
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.settlements,
                        total: data.page.total,
                        current: data.page.current
                    }
                });
            }
        },
        *settlementSelect({payload}, {select, call, put}){
            yield put({type: 'hideEditor'});
            yield put({type: 'showLoading'});
            const id = yield select(({products}) => products.currentItem['_id']);
            const newProduct = {...payload, id};
            const {data} = yield call(modify, newProduct);
            if (data && data.success) {
                yield put({
                    type: 'modifySuccess',
                    payload: newProduct
                });
                yield put({
                	type: 'resetProduct'
				});
            }
        }
    },

    reducers: {
        showLoading(state, action){
            return {...state, loading: true};
        },
        querySuccess(state, action){
            return {...state, ...action.payload, loading: false};
        },
        updateQueryKey(state, action){
            return {...state, ...action.payload};
        }
    },

}
