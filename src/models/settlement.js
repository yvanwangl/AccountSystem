import {query, querySettlementItem} from '../services/settlement';
import {parse} from 'qs';
export default {

    namespace: 'settlement',

    state: {
        list: [],
        total: null,
		timeRange: [],
		settlementItems: [],
        loading: false,
        current: null,
        breadcrumbItems: [
            ['/settlement', '首页'],
            ['/settlement', '结算管理'],
        ],
		settlementId:''
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
        *settlementSelect({payload}, {call, put}){
            const {data} = yield call(querySettlementItem, {settlementId: payload.settlementId});
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
        	const settlementId = action.payload.list.length>0 ? action.payload.list[0]._id:'';
            return {...state, ...action.payload, settlementId, loading: false};
        },
		querySettlementItemSuccess(state, action){
            return {...state, settlementItems:action.settlementItems, settlementId:action.settlementId, loading: false};
        },
		updateQueryKey(state, action){
			return {...state, ...action.payload};
		},
    },

}
