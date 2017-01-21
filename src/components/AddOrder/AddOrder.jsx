import React, {Component, PropTypes} from 'react';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import dateFormat from '../../utils/dateFormat';
import AddOrderTitle from './AddOrderTitle/AddOrderTitle';
import AddOrderForm from './AddOrderForm/AddOrderForm';
import AddOrderGrid from './AddOrderGrid/AddOrderGrid';
import AddRemarkForm from './AddRemarkForm/AddRemarkForm';
import {connect} from 'dva';
import Spliter from '../Spliter/Spliter';
import {addOrder, orderWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';

const AddOrder = ({
    dispatch,
    orders
}) => {
    const {order} = orders;
    const addOrderFormProps = {
        customers:[
            {
                _id:'111',
                name:'wangyafei'
            },
            {
                _id:'222',
                name:'lihuan'
            }
        ],
        onSelect(customerId){
            dispatch({
                type:'orders/setCustomer',
                payload:{
                    customerId
                }
            })
        }
    };

    const onSetMem = (mem)=>{
        dispatch({
            type:'orders/setMem',
            payload:{
                mem: mem
            }
        });
    };

    const handleConfirm = ()=>{
        console.log(order);
        dispatch({
            type:'orders/create',
            payload:{
                order
            }
        });
        dispatch({
            type:'orders/query'
        });
    };

    const handleCancel = ()=>{
        dispatch({
            type:'orders/resetOrder'
        });
    };

    const addOrderGridProps = {
        products: order.products,
        editProducts(products, totalAmount, paymentAmount){
            dispatch({
                type:'orders/setProducts',
                payload:{
                    products,
                    totalAmount,
                    paymentAmount
                }
            });
        }
    };

    return (
        <div className={addOrder}>
            <div className={orderWrapper}>
                <AddOrderTitle orderNumber={order.orderNumber}/>
                <AddOrderForm {...addOrderFormProps}/>
                <AddOrderGrid {...addOrderGridProps}/>
                <AddRemarkForm onSetMem={onSetMem}/>
            </div>
            <div className={buttonGroup}>
                <Button type="primary" className={confirmButton} onClick={handleConfirm}>确定</Button>
                <Button type="ghost" className={cancelButton} onClick={handleCancel}>取消</Button>
            </div>
        </div>
    );
};

AddOrder.propTypes = {
    onPageChange: PropTypes.func,
    onModify: PropTypes.func,
    onDel: PropTypes.func,
    dataSource: PropTypes.array,
    loading: PropTypes.any,
    total: PropTypes.any,
    current: PropTypes.any
};

function mapStateToProps({orders}){
    return {orders};
}

export default connect(mapStateToProps)(AddOrder);