import {query, create, modify, del, getNoteNumber, queryStorageById} from '../services/storage';
import * as suppliers from '../services/suppliers';
import * as products from '../services/products';
import {parse} from 'qs';
const defaultProduct = {
	key: '0',
	productId: '',
	productName: '',
	quantity: 0,
	productUnit: '',
	price: 0,
	amount: 0,
	remarks: ''
};

const defaultStorage = {
	sequence: null,
	noteNumber: '',
	supplierId: null,
	products: [
		{...defaultProduct}
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
		supplierId: '',
		noteNumber: '',
		loading: false,
		current: null,
		currentItem: {},
		editorVisible: false,
		editorType: 'create',
		breadcrumbItems: [
			['/', '首页'],
			['/storage', '入库'],
		],
		storageData: {...defaultStorage},
		suppliers:[],
		productList:[]
	},

	subscriptions: {
		setup({dispatch, history}) {
			history.listen(location=> {
				if (location.pathname == '/storage') {
					dispatch({
						type:'getSuppliers'
					});
					dispatch({
						type:'getProducts'
					});
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
			const isLogin = yield select(({systemUser})=> systemUser.isLogin);
			if(!isLogin){
				return;
			}
			yield put({type: 'showLoading'});
			yield put({
				type: 'updateQueryKey',
				payload: {
					page: 1,
					timeRange: [],
					supplierId: '',
					noteNumber: '',
					...payload
				}
			});
			let {page, timeRange, supplierId, noteNumber} = yield select(state=>state.storage);
			supplierId = supplierId=='00000'?'':supplierId;
			const {data} = yield call(query, parse({page, timeRange, supplierId, noteNumber}));
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
			//保存之前清洗数据，对商品条目为空的商品记录进行删除
            const storageData = payload.storageData;
            const {products} = storageData;
            const validProducts = products.filter(product=> product.productId!='');
            storageData['products'] = validProducts;
			const {data} = yield call(create, storageData);
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
			const newStorage = {...payload.storageData, id};
			 //保存之前清洗数据，对商品条目为空的商品记录进行删除
            const {products} = newStorage;
            const validProducts = products.filter(product=> product.productId!='');
            newStorage['products'] = validProducts;
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
						storageData: data.storage
					}
				});
				yield put({
					type: 'addBreadcrumbItem',
					payload: {
						item: ['/storage/modifystorage', '修改入库']
					}
				});
			}
		},
		*getNoteNumber({payload}, {call, put}){
			const {data} = yield call(getNoteNumber, {});
			if (data && data.success) {
				yield put({
					type: 'getNoteNumberSuccess',
					payload: {
						editorType: 'create',
						sequence: data.sequence,
						noteNumber: data.noteNumber,
						editorVisible: true
					}
				});
				yield put({
					type: 'addBreadcrumbItem',
					payload: {
						item: ['/storage/addstorage', '新增入库']
					}
				});
			}
		},
		*getSuppliers({payload}, {select, call, put}){
			const isLogin = yield select(({systemUser})=> systemUser.isLogin);
			if(!isLogin){
				return;
			}
			const {data} = yield call(suppliers.queryAll, {});
			if(data&&data.success){
				yield put({
					type:'getSuppliersSuccess',
					suppliers:data.suppliers
				});
			}
		},
		*getProducts({payload}, {select, call, put}){
			const isLogin = yield select(({systemUser})=> systemUser.isLogin);
			if(!isLogin){
				return;
			}
			const {data} = yield call(products.query, {});
			if(data&&data.success){
				yield put({
					type:'getProductsSuccess',
					productList:data.products
				});
			}
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
			return {...state, breadcrumbItems: newItems};
		},
		setSupplier(state, action){
			let storageData = state['storageData'];
			let newStorage = {...storageData, supplierId: action.payload.supplierId};
			return {...state, storageData: newStorage};
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
			let storageData = Object.assign({}, defaultStorage, {products: [{...defaultProduct}]});
			return {...state, breadcrumbItems: newItems, storageData, editorVisible: false};
		},
		setProducts(state, action){
			let storageData = state['storageData'];
			let {products, totalAmount, paymentAmount} = action.payload;
			let newStorage = {...storageData, products, totalAmount, paymentAmount};
			console.log(newStorage);
			return {...state, storageData: newStorage};
		},
		setMem(state, action){
			let storageData = state['storageData'];
			let newStorage = {...storageData, mem: action.payload.mem};
			return {...state, storageData: newStorage};
		},
		getNoteNumberSuccess(state, action){
			let sequence = action.payload.sequence;
			let noteNumber = action.payload.noteNumber;
			let storageData = state['storageData'];
			let newStorage = {...storageData, sequence, noteNumber};
			return {...state, storageData: newStorage, ...action.payload};
		},
		getSuppliersSuccess(state, action){
			let suppliers = action.suppliers;
			suppliers.unshift({_id:'00000', supplierName:'全部'});
			return {...state, suppliers};
		},
		getProductsSuccess(state, action){
			let productList = action.productList;
			return {...state, productList};
		}
	},

}
