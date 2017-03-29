import {query, doClearStorage, doClearBill} from '../services/supplierBills';
import {parse} from 'qs';
import {routerRedux} from 'dva/router';
export default {

    namespace: 'supplierBillsSpace',

    state: {
        list: [],
        total: null,
        loading: false,
        page: 1,
		supplierId: '',
        breadcrumbItems: [
            ['/supplierBills', '首页'],
            ['/supplierBills', '账单管理'],
        ],
		storage: [],
		supplierBills: [],
		suppliers: [],
		visible: false,
		editorType: 'clearStorage',
		currentItem: {}
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname == '/supplierBills') {
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
                    ...payload
                }
            });
			let {page, supplierId} = payload;
			supplierId = supplierId=='00000'?'':supplierId;
            const {data} = yield call(query, parse({page, supplierId}));
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        storage: data.storage,
						suppliers: data.suppliers,
						supplierBills: data.supplierBills,
                        total: data.page.total,
                        current: data.page.current
                    }
                });
            }
        },
		*doClearStorage({payload}, {call, put}){
        	let {storageId, paymentAmount} = payload;
			const {data} = yield call(doClearStorage, {storageId, paymentAmount});
			if (data && data.success) {
				yield put({
					type: 'hideEditor'
				});
				yield put(routerRedux.push('/supplierBills'));
			}
		},
		*doClearBill({payload}, {call, put}){
			const {supplierId} = payload;
			const {data} = yield call(doClearBill, {supplierId});
			if (data && data.success) {
				yield put({
					type: 'hideEditor'
				});
				yield put(routerRedux.push('/supplierBills'));
			}
		},
    },

    reducers: {
        showLoading(state, action){
            return {...state, loading: true};
        },
        querySuccess(state, action){
        	const suppliers = action.payload.suppliers;
			suppliers.unshift({
				_id:'00000',
				supplierName: '全部'
			});
            return {...state, ...action.payload, loading: false};
        },
		clearStorage(state, action){
			const currentItem = action.payload.order;
			return {...state, currentItem, editorType:'clearStorage', visible: true};
		},
		clearBill(state, action){
			const currentItem = action.payload.bill;
			return {...state, currentItem, editorType:'clearBill', visible: true};
		},
		hideEditor(state, action){
			return {...state, currentItem:{}, editorType:'clearStorage', visible: false};
		},
		updateQueryKey(state, action){
			return {...state, ...action.payload};
		}
    },

}
