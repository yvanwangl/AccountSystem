import {query, doClearOrder, doClearBill} from '../services/bills';
import {parse} from 'qs';
import {routerRedux} from 'dva/router';
export default {

    namespace: 'billsSpace',

    state: {
        list: [],
        total: null,
        loading: false,
        page: 1,
		customerId: '',
        breadcrumbItems: [
            ['/settlement', '首页'],
            ['/settlement', '账单管理'],
        ],
		orders: [],
		bills: [],
		customers: [],
		visible: false,
		editorType: 'clearOrder',
		currentItem: {}
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname == '/bills') {
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
						bills: data.bills,
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
				yield put(routerRedux.push('/bills'));
			}
		},
		*doClearBill({payload}, {call, put}){
			const {customerId} = payload;
			const {data} = yield call(doClearBill, {customerId});
			if (data && data.success) {
				yield put({
					type: 'hideEditor'
				});
				yield put(routerRedux.push('/bills'));
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
		}
    },

}
