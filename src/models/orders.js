import {query, create, modify, del} from '../services/orders';
import {parse} from 'qs';
export default {

    namespace: 'orders',

    state: {
        list:[],
        total:null,
        timeRange:[],
        field: '',
        keyword: '',
        loading: false,
        current: null,
        currentItem: {},
        editorVisible: false,
        editorType: 'create',
        breadcrumbItems:[
            ['/','首页'],
            ['/orders','订单'],
        ],
        order:{
            customerId:null,
            products:[],
            mem:''
        }
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location=>{
                if(location.pathname == '/orders'){
                    dispatch({
                        type:'query',
                        payload: location.query
                    });
                    dispatch({
                        type:'resetBreadcrumbItem'
                    });
                    dispatch({
                        type:'hideEditor'
                    });
                }else if(location.pathname == '/orders/addorder'){
                    dispatch({
                        type:'showEditor'
                    });
                }
            });
        },
    },

    effects: {
        *query({payload}, {call,put}){
            yield put({type:'showLoading'});
            yield put({
                type: 'updateQueryKey',
                payload: {
                    page:1,
                    timeRange:[],
                    field: '',
                    keyword: '',
                    ...payload
                }
            });
            const {data} = yield call(query, parse(payload));
            if(data){
                yield put({
                    type:'querySuccess',
                    payload: {
                        list: data.orders,
                        total: data.page.total,
                        current: data.page.current
                    }
                });
            }
        },
        *create({payload}, {call, put}){
            yield put({type:'hideEditor'});
            yield put({type:'showLoading'});
            const {data} = call(create, payload);
            if(data && data.success){
                yield put({
                    type:'createSuccess',
                    payload: {
                        list: data.data,
                        total: data.page.total,
                        current: data.page.current,
                        timeRange:[],
                        field: '',
                        keyword: '',
                    }
                });
            }
        },
        *modify({payload}, {select, call, put}){
            yield put({type:'hideEditor'});
            yield put({type:'showLoading'});
            const id = yield select(({order})=>order.currentItem.id);
            const newOrder = {...payload, id};
            const {data} = yield call(modify, newOrder);
            if(data && data.success){
                yield put({
                    type: 'modifySuccess',
                    payload: newOrder
                });
            }
        },
        *del({payload}, {call, put}){
            yield put({type:'showLoading'});
            const {data} = yield call(del, {id:payload});
            if(data && data.success){
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
            return {...state, ...action.payload, editorVisible:true};
        },
        hideEditor(state, action){
            return {...state, editorVisible:false};
        },
        querySuccess(state, action){
            return {...state, ...action.payload, loading:false};
        },
        createSuccess(state, action){
            return {...state, ...action.payload, loading:false};
        },
        modifySuccess(state, action){
            const updateOrder = action.payload;
            const newList = state.list.map(order=>order.id == updateOrder.id? {...order, ...updateOrder}:order);
            return {...state, list: newList, loading:false};
        },
        delSuccess(state, action){
            const newList = state.list.filter(order=> order.id!=action.payload);
            return {...state, list:newList, loading:false};
        },
        updateQueryKey(state, action){
            return {...state, ...action.payload};
        },
        addBreadcrumbItem(state, action){
            let breadcrumbItems = state['breadcrumbItems'];
            let newItems = [...breadcrumbItems, action.payload.item];
            return {...state, breadcrumbItems:newItems};
        },
        resetBreadcrumbItem(state, action){
            let newItems = [
                ['/','首页'],
                ['/orders','订单'],
            ];
            return {...state, breadcrumbItems:newItems};
        },
        setCustomer(state, action){
            let order = state['order'];
            let newOrder = {...order, customerId: action.payload.customerId};
            console.log(newOrder);
            return {...state, order:newOrder};
        },
        setProducts(state, action){
            let order = state['order'];
            let newOrder = {...order, products:action.payload.products};
            return {...state, order:newOrder};
        },
        setMem(state, action){
            let order = state['order'];
            let newOrder = {...order, mem:action.payload.mem};
            console.log(newOrder);
            return {...state, order:newOrder};
        }
    },

}
