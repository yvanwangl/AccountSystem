import React, {Component, PropTypes} from 'react';
import {Form, Input, Modal} from 'antd'
import numberFormat from '../../../utils/numberFormat';
import {modal} from './index.css';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};
const ClearSupplierBillsModal =({
    visible,
    onConfirm,
    onCancel,
	currentItem,
    form: {
        getFieldDecorator,
        validateFields
    }
})=>{
    function handleConfirm() {
        validateFields((errors, values)=>{
            if(!!errors){
                return;
            }
            onConfirm({supplierId: values.supplierId});
        })
    }

    const modalOpts = {
        title: '清账操作',
        visible,
        onOk:handleConfirm,
        onCancel
    };

    const {
		supplierId,
		supplierName,
		totalAmount,
		paymentAmount,
	} = currentItem;

    const clearBillAmount = (totalAmount-paymentAmount).toFixed(2);

    return (
        <Modal {...modalOpts} className={modal}>
            <Form layout='horizontal'>
				<FormItem {...formItemLayout} style={{margin: 0}}>
					{
						getFieldDecorator('supplierId', {
							initialValue: supplierId
						})(
							<Input type="hidden"/>
						)
					}
				</FormItem>
                <FormItem label='客户名称：' {...formItemLayout}>
                    {
                        getFieldDecorator('supplierName', {
							initialValue: supplierName
						})(
                            <Input type="text" disabled={true}/>
                        )
                    }
                </FormItem>
				<FormItem label='应付金额：' {...formItemLayout}>
					{
						getFieldDecorator('totalAmount', {
							initialValue: numberFormat(totalAmount)
						})(
							<Input type="text" disabled={true}/>
						)
					}
				</FormItem>
				<FormItem label='已付金额：' {...formItemLayout}>
					{
						getFieldDecorator('paymentAmount', {
							initialValue: numberFormat(paymentAmount)
						})(
							<Input type="text" disabled={true}/>
						)
					}
				</FormItem>
				<FormItem label='清账金额：' {...formItemLayout}>
					{
						getFieldDecorator('clearBillAmount', {
							initialValue: numberFormat(clearBillAmount)
						})(
							<Input type="text" disabled={true}/>
						)
					}
				</FormItem>
            </Form>
        </Modal>
    );
};

ClearSupplierBillsModal.propTypes = {
    visible:PropTypes.any,
    onConfirm:PropTypes.func,
    onCancel:PropTypes.func,
	currentItem:PropTypes.object,
    form:PropTypes.object.isRequired
};
export default Form.create()(ClearSupplierBillsModal);