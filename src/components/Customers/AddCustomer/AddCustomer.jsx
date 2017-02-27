import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {message} from 'antd';
import AddCustomerTitle from '../CustomerCommon/CustomerTitle/CustomerTitle';
import AddCustomerForm from '../CustomerCommon/CustomerForm/CustomerForm';
import {connect} from 'dva';
import {addCustomer, customerWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';

const AddCustomer = ({
    dispatch,
    customers
}) => {
    const {customer} = customers;
    const addCustomerFormProps = {
        onAddCustomer(customer){
            dispatch({
                type: 'customers/addCustomer',
                payload: {
                    customer
                }
            })
        }
    };

    const handleConfirm = ()=> {
        /**
         * 数据保存前，做数据校验,
         * 所有数据均为必填项，包括：客户名称，联系人，联系方式，地址
         */
        dispatch({
            type: 'customers/create',
            payload: {
                customer
            }
        });
        dispatch({
            type: 'customers/query'
        });
    };

    const handleCancel = ()=> {
        dispatch({
            type: 'customers/resetCustomer'
        });
    };

    return (
        <div className={addCustomer}>
            <div className={customerWrapper}>
                <AddCustomerTitle titleText={'客户资料'}/>
                <AddCustomerForm {...addCustomerFormProps}/>
            </div>
            <div className={buttonGroup}>
                <Button type="primary" className={confirmButton} onClick={handleConfirm}>确定</Button>
                <Button type="ghost" className={cancelButton} onClick={handleCancel}>取消</Button>
            </div>
        </div>
    );
};

function mapStateToProps({customers}) {
    return {customers};
}

export default connect(mapStateToProps)(AddCustomer);