import {query, create, modify, del, getStorageNumber, queryStorageById} from '../services/storage';
import {parse} from 'qs';
const defaultProduct = {
	key: '0',
	productName: '铝合金',
	quantity: 0,
	unit: '吨',
	price: 0,
	amount: 0,
	remarks: ''
};

const defaultStorage = {
	storageNumber: '',
	customerId: null,
	products: [
		defaultProduct
	],
	totalAmount: 0,
	paymentAmount: 0,
	mem: ''
};

export default {

	namespace: 'storage',

	state: {
		list: [],
		total: null,
		timeRange: [],
		field: '',
		keyword: '',
		loading: false,
		current: null,
		currentItem: {},
		editorVisible: false,
		editorType: 'create',
		breadcrumbItems: [
			['/', '首页'],
			['/storage', '入库'],
		],
		storage: defaultStorage
	},

	subscriptions: {
		setup({dispatch, history}) {
			history.listen(location=> {
				if (location.pathname == '/storage') {
					dispatch({
						type: 'query',
						payload: location.query
					});
					dispatch({
						type: 'hideEditor'
					});
					dispatch({
						type: 'resetStorage'
					});
				} else if (location.pathname == '/storage/addstorage') {
					dispatch({
						type: 'showEditor'
					});
				}
			});
		},
	},

	effects: {
		*query({payload}, {call, put, select}){
			yield put({type: 'showLoading'});
			yield put({
				type: 'updateQueryKey',
				payload: {
					page: 1,
					timeRange: [],
					field: '',
					keyword: '',
					...payload
				}
			});
			const {page, timeRange, field, keyword} = yield select(state=>state.storage);
			const {data} = yield call(query, parse({page, timeRange, field, keyword}));
			if (data) {
				yield put({
					type: 'querySuccess',
					payload: {
						list: data.storage,
						total: data.page.total,
						current: data.page.current
					}
				});
			}
		},
		*create({payload}, {call, put}){
			yield put({type: 'showLoading'});
			const {data} = yield call(create, payload.storage);
			if (data && data.success) {
				yield put({
					type: 'createSuccess',
					payload: {
						storage: data.storage
					}
				});
				yield put({
					type: 'resetStorage'
				});
			}
		},
		*modify({payload}, {select, call, put}){
			yield put({type: 'hideEditor'});
			yield put({type: 'showLoading'});
			const id = yield select(({storage})=>storage.currentItem['_id']);
			const newStorage = {...payload.storage, id};
			const {data} = yield call(modify, newStorage);
			if (data && data.success) {
				yield put({
					type: 'modifySuccess',
					payload: {
						storage: data.storage
					}
				});
				yield put({
					type: 'resetStorage'
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
		*queryStorageById({payload}, {call, put}) {
			const {data} = yield call(queryStorageById, payload.storageId);
			if (data && data.success) {
				yield put({
					type: 'queryStorageByIdSuccess',
					payload: {
						editorType: payload.editorType,
						currentItem: data.storage,
						editorVisible: true,
						storage: data.storage
					}
				});
				yield put({
					type: 'addBreadcrumbItem',
					payload: {
						item: ['/storage/modifystorage', '修改入库']
					}
				});
			}
		}
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
		queryStorageByIdSuccess(state, action){
			return {...state, ...action.payload};
		},
		createSuccess(state, action){
			return {...state, loading: false};
		},
		modifySuccess(state, action){
			/*            const updateStorage = action.payload.storage;
			 const newList = state.list.map(storage=>storage.id == updateStorage.id? {...storage, ...updateStorage}:storage);
			 return {...state, list: newList, loading:false};*/
			return {...state, loading: false};
		},
		delSuccess(state, action){
			const newList = state.list.filter(storage=> storage._id != action.payload);
			return {...state, list: newList, loading: false};
		},
		updateQueryKey(state, action){
			return {...state, ...action.payload};
		},
		addBreadcrumbItem(state, action){
			let breadcrumbItems = state['breadcrumbItems'];
			let newItems = [...breadcrumbItems, action.payload.item];
			let editorType = action.payload.editorType;
			return {...state, breadcrumbItems: newItems, editorType, editorVisible: true};
		},
		setCustomer(state, action){
			let storage = state['storage'];
			let newStorage = {...storage, customerId: action.payload.customerId};
			return {...state, storage: newStorage};
		},
		resetBreadcrumbItem(state, action){
			let newItems = [
				['/', '首页'],
				['/storage', '订单'],
			];
			return {...state, breadcrumbItems: newItems, editorVisible: false};
		},
		resetStorage(state, action){
			let newItems = [
				['/', '首页'],
				['/storage', '入库'],
			];
			let newStorage = {
				...defaultStorage, products: [{
					key: '0',
					productName: '铝合金',
					quantity: 0,
					unit: '吨',
					price: 0,
					amount: 0,
					remarks: ''
				}]
			};
			return {...state, breadcrumbItems: newItems, storage: newStorage, editorVisible: false};
		},
		setProducts(state, action){
			let storage = state['storage'];
			let {products, totalAmount, paymentAmount} = action.payload;
			let newStorage = {...storage, products, totalAmount, paymentAmount};
			console.log(newStorage);
			return {...state, storage: newStorage};
		},
		setMem(state, action){
			let storage = state['storage'];
			let newStorage = {...storage, mem: action.payload.mem};
			return {...state, storage: newStorage};
		}
	},

}
