import {query, queryDebtOrders} from '../services/bills';
import {parse} from 'qs';
export default {

    namespace: 'billsSpace',

    state: {
        list: [],
        total: null,
        loading: false,
        current: null,
        breadcrumbItems: [
            ['/settlement', '首页'],
            ['/settlement', '账单管理'],
        ],
		orders: [],
		bills: [],
		customers: [],
		customerId: null
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
        *filterOrders({payload}, {call, put}){
            const {data} = yield call(queryDebtOrders, {customerId: payload.customerId});
            if (data && data.success) {
                yield put({
                    type: 'querySettlementItemSuccess',
					settlementItems: data.settlementItems,
					settlementId: payload.settlementId
                });
            }
        }
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

		}
    },

}
