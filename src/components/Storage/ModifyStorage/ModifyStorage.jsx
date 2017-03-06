import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {message} from 'antd';
import ModifyStorageTitle from '../StorageCommon/StorageTitle/StorageTitle';
import ModifyStorageForm from '../StorageCommon/StorageForm/StorageForm';
import AddStorageGrid from '../StorageCommon/AddStorageGrid/AddStorageGrid';
import StorageRemarkForm from '../StorageCommon/StorageRemarkForm/StorageRemarkForm';
import {connect} from 'dva';
import {modifyStorage, storageWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';

const ModifyStorage = ({
    dispatch,
    editorType,
    Storage
}) => {
    const {storage, currentItem} = Storage;
    const disabled = editorType != 'modify';
    const modifyStorageFormProps = {
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
        customerId: currentItem.customerId,
        disabled: disabled,
        onSelect(customerId){
            dispatch({
                type: 'Storage/setCustomer',
                payload: {
                    customerId
                }
            })
        }
    };

    const onSetMem = (mem)=> {
        dispatch({
            type: 'Storage/setMem',
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
        storage['storageNumber'] = currentItem['storageNumber'];
        if (customerId == null) {
            storage['customerId'] = currentItem['customerId'];
        }
        if (products.length == 0) {
            message.error('请至少添加一个商品条目！');
            return null;
        }
        console.log(storage);
        dispatch({
            type: 'Storage/modify',
            payload: {
                storage
            }
        });
        dispatch({
            type: 'Storage/query'
        });
    };

    const handleCancel = ()=> {
        dispatch({
            type: 'Storage/resetStorage'
        });
    };

    const modifyStorageGridProps = {
        products: currentItem.products,
        totalAmount: currentItem.totalAmount,
        paymentAmount: currentItem.paymentAmount,
        disabled: disabled,
        editProducts(products, totalAmount, paymentAmount){
            console.log(totalAmount + '--' + paymentAmount);
            dispatch({
                type: 'Storage/setProducts',
                payload: {
                    products,
                    totalAmount,
                    paymentAmount
                }
            });
        }
    };

    return (
        <div className={modifyStorage}>
            <div className={storageWrapper}>
                <ModifyStorageTitle storageNumber={currentItem.storageNumber}/>
                <ModifyStorageForm {...modifyStorageFormProps}/>
                <AddStorageGrid {...modifyStorageGridProps}/>
                <StorageRemarkForm disabled={disabled} mem={currentItem.mem} onSetMem={onSetMem}/>
            </div>
            <div className={buttonGroup}>
                <Button type="primary" className={confirmButton} onClick={handleConfirm}>确定</Button>
                <Button type="ghost" className={cancelButton} onClick={handleCancel}>取消</Button>
            </div>
        </div>
    );
};

ModifyStorage.propTypes = {
    onPageChange: PropTypes.func,
    onModify: PropTypes.func,
    onDel: PropTypes.func,
    dataSource: PropTypes.array,
    loading: PropTypes.any,
    total: PropTypes.any,
    current: PropTypes.any
};

function mapStateToProps({storage}) {
    return {storage};
}

export default connect(mapStateToProps)(ModifyStorage);