import {query} from '../services/resource';
import * as products from '../services/products';
import {parse} from 'qs';
export default {

    namespace: 'resource',

    state: {
		products:[],
		stocks: [],
		funds: [],
		loading: false,
        breadcrumbItems: [
            ['/resource', '首页'],
            ['/resource', '物资管理'],
        ]
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
				if(location.pathname=='/resource'){
					dispatch({
						type: 'queryProducts'
					});
				}
            });
        },
    },

    effects: {
    	*query({payload}, {select, call, put}){
    		yield put({
    			type: 'showLoading'
			});
			const {data} = yield call(query, payload);
			if(data && data.success) {
				yield put({
					type: 'querySuccess',
					stocks: data.stocks,
					funds: data.funds
				});
			}
		},
    	*queryProducts({payload}, {select, call, put}){
			const {data} = yield call(products.query, {});
			if(data && data.success){
				yield put({
					type: 'queryProductsSuccess',
					products: data.products
				});
			}
		},
        *onSettlement({payload}, {select, call, put}){

        }
    },

    reducers: {
		querySuccess(state, action){
			return {...state, stocks: action.stocks, funds: action.funds, loading: false};
		},
		queryProductsSuccess(state, action){
			return {...state, products: action.products};
		},
        settlementSuccess(state, action){
            return {...state, ...action.payload};
        },
		showLoading(state, action){
        	return {...state, loading: true};
		},
    },

}
