import React, {Component, PropTypes} from 'react';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import dateFormat from '../../utils/dateFormat';
import AddOrderTitle from './AddOrderTitle/AddOrderTitle';
import AddOrderForm from './AddOrderForm/AddOrderForm';
import AddOrderGrid from './AddOrderGrid/AddOrderGrid';
import AddRemarkForm from './AddRemarkForm/AddRemarkForm';
import {connect} from 'dva';
import Spliter from '../Spliter/Spliter';
import {addOrder, buttonGroup, confirmButton, cancelButton} from './index.css';

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

    return (
        <div className={addOrder}>
            <AddOrderTitle />
            <AddOrderForm {...addOrderFormProps}/>
            <AddOrderGrid />
            <AddRemarkForm onSetMem={onSetMem}/>
            <div className={buttonGroup}>
                <Button type="primary" className={confirmButton}>确定</Button>
                <Button type="ghost" className={cancelButton}>取消</Button>
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