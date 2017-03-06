import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {message} from 'antd';
import AddStorageTitle from '../StorageCommon/StorageTitle/StorageTitle';
import AddStorageForm from '../StorageCommon/StorageForm/StorageForm';
import AddStorageGrid from '../StorageCommon/AddStorageGrid/AddStorageGrid';
import AddRemarkForm from '../StorageCommon/StorageRemarkForm/StorageRemarkForm';
import {connect} from 'dva';
import {addStorage, storageWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';

const AddStorage = ({
    dispatch,
    storages
}) => {
    const {storage} = storages;
    const addStorageFormProps = {
        customers: [
            {
                _id: '111',
                name: 'wangyafei'
            },
            {
                _id: '222',
                name: 'lihuan'
            }
        ],
        disabled: false,
        onSelect(customerId){
            dispatch({
                type: 'storages/setCustomer',
                payload: {
                    customerId
                }
            })
        }
    };

    const onSetMem = (mem)=> {
        dispatch({
            type: 'storages/setMem',
            payload: {
                mem: mem
            }
        });
    };

    const handleConfirm = ()=> {
        /**
         * 数据保存前，做数据校验,
         * 用户不允许为空，并且至少需要保存一条商品数据
         */
        const {customerId, products} = storage;
        if (customerId == null) {
            message.error('请选择一个客户！');
            return null;
        }
        if (products.length == 0) {
            message.error('请至少添加一个商品条目！');
            return null;
        }
        dispatch({
            type: 'storages/create',
            payload: {
                storage
            }
        });
        dispatch({
            type: 'storages/query'
        });
    };

    const handleCancel = ()=> {
        dispatch({
            type: 'storages/resetStorage'
        });
    };

    const addStorageGridProps = {
        products: storage.products,
        totalAmount: storage.totalAmount,
        paymentAmount: storage.paymentAmount,
        disabled: false,
        editProducts(products, totalAmount, paymentAmount){
            dispatch({
                type: 'storages/setProducts',
                payload: {
                    products,
                    totalAmount,
                    paymentAmount
                }
            });
        }
    };

    return (
        <div className={addStorage}>
            <div className={storageWrapper}>
                <AddStorageTitle storageNumber={storage.storageNumber}/>
                <AddStorageForm {...addStorageFormProps}/>
                <AddStorageGrid {...addStorageGridProps}/>
                <AddRemarkForm disabled={false} onSetMem={onSetMem}/>
            </div>
            <div className={buttonGroup}>
                <Button type="primary" className={confirmButton} onClick={handleConfirm}>确定</Button>
                <Button type="ghost" className={cancelButton} onClick={handleCancel}>取消</Button>
            </div>
        </div>
    );
};

AddStorage.propTypes = {
    onPageChange: PropTypes.func,
    onModify: PropTypes.func,
    onDel: PropTypes.func,
    dataSource: PropTypes.array,
    loading: PropTypes.any,
    total: PropTypes.any,
    current: PropTypes.any
};

function mapStateToProps({storages}) {
    return {storages};
}

export default connect(mapStateToProps)(AddStorage);