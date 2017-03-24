import {query, create, modify, del} from '../services/products';
import {parse} from 'qs';
export default {

    namespace: 'products',

    state: {
        list: [],
        total: null,
        productName: '',
        loading: false,
        current: null,
        currentItem: {},
        breadcrumbItems: [
            ['/product', '首页'],
            ['/product', '商品管理'],
        ],
        editorVisible: false,
        editorType: 'create'
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname == '/product') {
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
					productName: '',
                    ...payload
                }
            });
            const {data} = yield call(query, parse(payload));
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.products,
                        total: data.page.total,
                        current: data.page.current
                    }
                });
            }
        },
        *create({payload}, {call, put}){
        	console.log(payload);
            yield put({type: 'hideEditor'});
            yield put({type: 'showLoading'});
            let product = payload;
            product['productImg'] = product['productImg']?product['productImg'][0]['response']:'';
            const {data} = yield call(create, product);
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
            const id = yield select(({products}) => products.currentItem['_id']);
            const newProduct = {...payload, id};
			newProduct['productImg'] = newProduct['productImg']?newProduct['productImg'][0]['response']:'';
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
            const updateProduct = action.payload;
            const newList = state.list.map(product => product._id == updateProduct.id ? {...product, ...updateProduct} : product);
            return {...state, list: newList, loading: false};
        },
        delSuccess(state, action){
            const newList = state.list.filter(product => product._id != action.payload);
            return {...state, list: newList, loading: false};
        },
        updateQueryKey(state, action){
            return {...state, ...action.payload};
        },
        resetProduct(state, action){
            return {...state, currentItem: {}, editorVisible: false, editorType: 'create'};
        }
    },

}
