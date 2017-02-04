import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import OrderList from '../../components/Orders/OrderList/OrderList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import AddOrder from '../../components/Orders/AddOrder/AddOrder';
import ModifyOrder from '../../components/Orders/ModifyOrder/ModifyOrder';
import {redirect} from '../../utils/webSessionUtils';
import {orderClass, orderContainer, addOrderContainer, modifyOrderContainer} from './index.css';

function genOrders({dispatch, orders}){
    const {
        list,
        total,
        field,
        keyword,
        loading,
        current,
        currentItem,
        editorVisible,
        editorType,
        breadcrumbItems
    } = orders;

    const orderListProps ={
        current,
        total,
        dataSource: list,
        loading,
        onPageChange(page){
            dispatch(routerRedux.push({
                pathname:'/orders',
                query: {field, keyword, page}
            }));
        },
        onModify(orderId){
            dispatch({
                type:'orders/queryOrderById',
                payload: {
                    orderId: orderId,
                    editorType: 'modify'
                }
            });
        },
        onReadOnly(orderId){
            dispatch({
                type:'orders/queryOrderById',
                payload: {
                    orderId: orderId,
                    editorType: 'detail'
                }
            });
        },
        onDel(orderId){
            dispatch({
                type:'orders/del',
                payload: orderId,
            });
        }
    };
    const orderEditor = {
        item: editorType=='create'? {}:currentItem,
        type: editorType,
        visible: editorVisible,
        onConfirm(data){
            dispatch({
                type: `orders/${editorType}`,
                payload: data,
            });
        },
        onCancel(){
            dispatch({
                type:'orders/hideEditor'
            });
        }
    };

    const onSearch = (fieldValues)=>{
        dispatch(routerRedux.push({
            pathname:'/orders',
            query:{...fieldValues, page:1}
        }));
    };

    const onAdd = ()=>{
        dispatch({
            type:'orders/getOrderNumber'
        });
    };

    return (
        <div className={orderClass}>
            <BreadcrumbList breadcrumbItems={breadcrumbItems} />
            {
                editorVisible?
                    (
                        editorType=='create'?
                            (
                                <div className={addOrderContainer}>
                                    <AddOrder />
                                </div>
                            ):
                            (
                                <div className={modifyOrderContainer}>
                                    <ModifyOrder editorType={editorType}/>
                                </div>
                            )
                    ):
                    (
                        <div className={orderContainer}>
                            <SearchBar onAdd={onAdd}>
                                <SearchForm onSearch={onSearch}/>
                            </SearchBar>
                            <OrderList {...orderListProps} />
                        </div>
                    )
            }

        </div>
    );
}

class Orders extends Component{
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let {isLogin} = this.props.systemUser;
        if(!isLogin){
            redirect();
        }
    }

    render(){
        return genOrders(this.props);
    }
}

Orders.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({orders, systemUser}) {
    return {orders, systemUser};
}

export default connect(mapStateToProps)(Orders);