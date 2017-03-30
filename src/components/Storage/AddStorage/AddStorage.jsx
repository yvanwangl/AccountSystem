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
	storage
}) => {
    const {storageData, suppliers, productList} = storage;
    const addStorageFormProps = {
        suppliers,
        disabled: false,
        onSelect(supplierId){
            dispatch({
                type: 'storage/setSupplier',
                payload: {
					supplierId
                }
            })
        }
    };

    const onSetMem = (mem)=> {
        dispatch({
            type: 'storage/setMem',
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
        const {supplierId, products, totalAmount} = storageData;
        if (supplierId == null) {
            message.error('请选择一个供应商！');
            return null;
        }
        if (products.length == 0) {
            message.error('请至少添加一个商品条目！');
            return null;
        }
		if (totalAmount == 0) {
			message.error('合计金额应大于0元！');
			return null;
		}
        dispatch({
            type: 'storage/create',
            payload: {
				storageData
            }
        });
        dispatch({
            type: 'storage/query'
        });
    };

    const handleCancel = ()=> {
        dispatch({
            type: 'storage/resetStorage'
        });
    };

    const addStorageGridProps = {
        products: storageData.products,
		productList,
        totalAmount: storageData.totalAmount,
        paymentAmount: storageData.paymentAmount,
        disabled: false,
        editProducts(products, totalAmount, paymentAmount){
            dispatch({
                type: 'storage/setProducts',
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
                <AddStorageTitle storageNumber={storageData.noteNumber}/>
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

function mapStateToProps({storage}) {
    return {storage};
}

export default connect(mapStateToProps)(AddStorage);