import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {message} from 'antd';
import ModifyStorageTitle from '../StorageCommon/StorageTitle/StorageTitle';
import ModifyStorageForm from '../StorageCommon/StorageForm/StorageForm';
import ModifyStorageGrid from '../StorageCommon/AddStorageGrid/AddStorageGrid';
import StorageRemarkForm from '../StorageCommon/StorageRemarkForm/StorageRemarkForm';
import {connect} from 'dva';
import {modifyStorage, storageWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';

const ModifyStorage = ({
    dispatch,
    editorType,
    storage
}) => {
    const {storageData, currentItem, suppliers, productList} = storage;
    const disabled = editorType != 'modify';
    const modifyStorageFormProps = {
		suppliers,
        supplierId: currentItem.supplierId,
        disabled: disabled,
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
		storageData['noteNumber'] = currentItem['noteNumber'];
        if (supplierId == null) {
			storageData['supplierId'] = currentItem['supplierId'];
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
            type: 'storage/modify',
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

    const modifyStorageGridProps = {
        products: currentItem.products,
		productList,
        totalAmount: currentItem.totalAmount,
        paymentAmount: currentItem.paymentAmount,
        disabled: disabled,
        editProducts(products, totalAmount, paymentAmount){
            console.log(totalAmount + '--' + paymentAmount);
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
        <div className={modifyStorage}>
            <div className={storageWrapper}>
                <ModifyStorageTitle storageNumber={currentItem.noteNumber}/>
                <ModifyStorageForm {...modifyStorageFormProps}/>
                <ModifyStorageGrid {...modifyStorageGridProps}/>
                <StorageRemarkForm disabled={disabled} mem={currentItem.mem} onSetMem={onSetMem}/>
            </div>
            <div className={buttonGroup}>
				{
					editorType=='modify' && <Button type="primary" className={confirmButton} onClick={handleConfirm}>确定</Button>
				}
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