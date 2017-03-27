import {query, onSettlement} from '../services/resource';
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
					dispatch({
						type: 'query'
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
    		yield put({
    			type: 'showLoading'
			});
			let productId = payload && payload.productId!='00000'?payload.productId:'';
			const {data} = yield call(query, {productId});
			if(data && data.success) {
				yield put({
					type: 'querySuccess',
					stocks: [...data.products],
					funds: [...data.products]
				});
			}
		},
    	*queryProducts({payload}, {select, call, put}){
			const isLogin = yield select(({systemUser})=> systemUser.isLogin);
			if(!isLogin){
				return;
			}
			const {data} = yield call(products.query, {});
			if(data && data.success){
				yield put({
					type: 'queryProductsSuccess',
					products: data.products
				});
			}
		},
        *onSettlement({payload}, {select, call, put}){
			const {data} = yield call(onSettlement);
			if(data && data.success){
				const {data} = yield call(query, {});
				if(data && data.success) {
					yield put({
						type: 'querySuccess',
						stocks: [...data.products],
						funds: [...data.products]
					});
				}
			}
        }
    },

    reducers: {
		querySuccess(state, action){
			return {...state, stocks: action.stocks, funds: action.funds, loading: false};
		},
		queryProductsSuccess(state, action){
			const products = action.products;
			products.unshift({'_id':'00000', productName:'全部'});
			return {...state, products};
		},
        settlementSuccess(state, action){
            return {...state, ...action.payload};
        },
		showLoading(state, action){
        	return {...state, loading: true};
		},
    },

}
