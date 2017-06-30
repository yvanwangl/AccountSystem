import {query, create, modify, del, getOrderNumber, queryOrderById} from '../services/orders';
import * as customers from '../services/customers';
import * as resource from '../services/resource';
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

const defaultOrder = {
	sequence: null,
    orderNumber: '',
    customerId: null,
    products: [
		{...defaultProduct}
    ],
    totalAmount: 0,
    paymentAmount: 0,
    mem: ''
};

export default {

    namespace: 'orders',

    state: {
        list: [],
        total: null,
		timeRange: [],
        customerId: '',
        orderNumber: '',
        loading: false,
        current: null,
        currentItem: {},
        editorVisible: false,
        editorType: 'create',
        breadcrumbItems: [
            ['/', '首页'],
            ['/orders', '订单'],
        ],
        order: {...defaultOrder},
		customers:[],
		productList:[]
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location=> {
                if (location.pathname == '/orders') {
                	dispatch({
                		type:'getCustomers'
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
                        type: 'resetOrder'
                    });
                } else if (location.pathname == '/orders/addorder') {
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
                    customerId: '',
                    orderNumber: '',
                    ...payload
                }
            });
            let {page, timeRange, customerId, orderNumber} = yield select(state=>state.orders);
			customerId = customerId=='00000'?'':customerId;
            const {data} = yield call(query, parse({page, timeRange, customerId, orderNumber}));
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.orders,
                        total: data.page.total,
                        current: data.page.current
                    }
                });
            }
        },
        *create({payload}, {call, put}){
            yield put({type: 'showLoading'});
            //保存之前清洗数据，对商品条目为空的商品记录进行删除
            const order = payload.order;
            const {products} = order;
            const validProducts = products.filter(product=> product.productId!='');
            order['products'] = validProducts;
            const {data} = yield call(create, order);
            if (data && data.success) {
                yield put({
                    type: 'createSuccess',
                    payload: {
                        order: data.order
                    }
                });
                yield put({
                    type: 'resetOrder'
                });
            }
        },
        *modify({payload}, {select, call, put}){
            yield put({type: 'hideEditor'});
            yield put({type: 'showLoading'});
            const id = yield select(({orders})=>orders.currentItem['_id']);
            const newOrder = {...payload.order, id};
            //保存之前清洗数据，对商品条目为空的商品记录进行删除
            const {products} = newOrder;
            const validProducts = products.filter(product=> product.productId!='');
            newOrder['products'] = validProducts;
            const {data} = yield call(modify, newOrder);
            if (data && data.success) {
                yield put({
                    type: 'modifySuccess',
                    payload: {
                        order: data.order
                    }
                });
                yield put({
                    type: 'resetOrder'
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
        *queryOrderById({payload}, {call, put}) {
            const {data} = yield call(queryOrderById, payload.orderId);
            if (data && data.success) {
                yield put({
                    type: 'queryOrderByIdSuccess',
                    payload: {
                        editorType: payload.editorType,
                        currentItem: data.order,
                        editorVisible: true,
                        order: data.order
                    }
                });
                yield put({
                    type: 'addBreadcrumbItem',
                    payload: {
                        item: ['/orders/modifyorder', '修改订单']
                    }
                });
            }
        },
        *getOrderNumber({payload}, {call, put}){
            const {data} = yield call(getOrderNumber, {});
            if (data && data.success) {
                yield put({
                    type: 'getOrderNumberSuccess',
                    payload: {
                        editorType: 'create',
						sequence: data.sequence,
                        orderNumber: data.orderNumber,
                        editorVisible: true
                    }
                });
                yield put({
                    type: 'addBreadcrumbItem',
                    payload: {
                        item: ['/orders/addorder', '新增订单']
                    }
                });
            }
        },
		*getCustomers({payload}, {select, call, put}){
			const isLogin = yield select(({systemUser})=> systemUser.isLogin);
			if(!isLogin){
				return;
			}
			const {data} = yield call(customers.queryAll, {});
			if(data && data.success){
				yield put({
					type:'getCustomersSuccess',
					customers: data.customers
				});
			}
		},
		*getProducts({payload}, {select, call, put}){
			const isLogin = yield select(({systemUser})=> systemUser.isLogin);
			if(!isLogin){
				return;
			}
			const {data} = yield call(resource.query, {});
			if(data && data.success){
				yield put({
					type:'getProductsSuccess',
					productList: data.products
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
        queryOrderByIdSuccess(state, action){
            return {...state, ...action.payload};
        },
        createSuccess(state, action){
            return {...state, loading: false};
        },
        modifySuccess(state, action){
            /*            const updateOrder = action.payload.order;
             const newList = state.list.map(order=>order.id == updateOrder.id? {...order, ...updateOrder}:order);
             return {...state, list: newList, loading:false};*/
            return {...state, loading: false};
        },
        delSuccess(state, action){
            const newList = state.list.filter(order=> order._id != action.payload);
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
        getOrderNumberSuccess(state, action){
			let sequence = action.payload.sequence;
			let orderNumber = action.payload.orderNumber;
            let order = state['order'];
            let newOrder = {...order, sequence, orderNumber};
            return {...state, order: newOrder, ...action.payload};
        },
		getCustomersSuccess(state, action){
        	let customers = action.customers;
        	customers.unshift({_id:'00000', customerName:'全部'});
        	return {...state, customers};
		},
		getProductsSuccess(state, action){
			return {...state, productList: action.productList};
		},
        setCustomer(state, action){
            let order = state['order'];
            let newOrder = {...order, customerId: action.payload.customerId};
            return {...state, order: newOrder};
        },
        resetBreadcrumbItem(state, action){
            let newItems = [
                ['/', '首页'],
                ['/orders', '订单'],
            ];
            return {...state, breadcrumbItems: newItems, editorVisible: false};
        },
        resetOrder(state, action){
            let newItems = [
                ['/', '首页'],
                ['/orders', '订单'],
            ];
			let order = Object.assign({}, defaultOrder, {products: [{...defaultProduct}]});
            return {...state, breadcrumbItems: newItems, order, editorVisible: false};
        },
        setProducts(state, action){
            let order = state['order'];
            let {products, totalAmount, paymentAmount} = action.payload;
            let newOrder = {...order, products, totalAmount, paymentAmount};
            console.log(newOrder);
            return {...state, order: newOrder};
        },
        setMem(state, action){
            let order = state['order'];
            let newOrder = {...order, mem: action.payload.mem};
            return {...state, order: newOrder};
        }
    },

}
