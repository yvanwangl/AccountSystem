import {query, doClearOrder, doClearBill} from '../services/customerBills';
import {parse} from 'qs';
import {routerRedux} from 'dva/router';
export default {

    namespace: 'customerBillsSpace',

    state: {
        list: [],
        total: null,
        loading: false,
        page: 1,
		customerId: '',
        breadcrumbItems: [
            ['/customerBills', '首页'],
            ['/customerBills', '账单管理'],
        ],
		orders: [],
		customerBills: [],
		customers: [],
		visible: false,
		editorType: 'clearOrder',
		currentItem: {}
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname == '/customerBills') {
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
			let {page, customerId} = payload;
			customerId = customerId=='00000'?'':customerId;
            const {data} = yield call(query, parse({page, customerId}));
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        orders: data.orders,
						customers: data.customers,
						customerBills: data.customerBills,
                        total: data.page.total,
                        current: data.page.current
                    }
                });
            }
        },
		*doClearOrder({payload}, {call, put}){
        	let {orderId, paymentAmount} = payload;
			const {data} = yield call(doClearOrder, {orderId, paymentAmount});
			if (data && data.success) {
				yield put({
					type: 'hideEditor'
				});
				yield put(routerRedux.push('/customerBills'));
			}
		},
		*doClearBill({payload}, {call, put}){
			const {customerId} = payload;
			const {data} = yield call(doClearBill, {customerId});
			if (data && data.success) {
				yield put({
					type: 'hideEditor'
				});
				yield put(routerRedux.push('/customerBills'));
			}
		},
    },

    reducers: {
        showLoading(state, action){
            return {...state, loading: true};
        },
        querySuccess(state, action){
        	const customers = action.payload.customers;
			customers.unshift({
				_id:'00000',
				customerName: '全部'
			});
            return {...state, ...action.payload, loading: false};
        },
		clearOrder(state, action){
			const currentItem = action.payload.order;
			return {...state, currentItem, editorType:'clearOrder', visible: true};
		},
		clearBill(state, action){
			const currentItem = action.payload.bill;
			return {...state, currentItem, editorType:'clearBill', visible: true};
		},
		hideEditor(state, action){
			return {...state, currentItem:{}, editorType:'clearOrder', visible: false};
		},
		updateQueryKey(state, action){
			return {...state, ...action.payload};
		}
    },

}
