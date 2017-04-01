import React, {Component, PropTypes} from 'react';
import {Form, Input, Modal} from 'antd';
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
const ClearDebtOrdersModal = ({
	visible,
	onConfirm,
	onCancel,
	currentItem,
	form: {
		getFieldDecorator,
		validateFields
	}
}) => {
	function handleConfirm() {
		validateFields((errors, values) => {
			if (!!errors) {
				return;
			}
			onConfirm({
				orderId: values.orderId,
				paymentAmount: (values.paymentAmount * 1 + values.clearOrderAmount * 1).toFixed(2) * 1,
			});
		})
	}

	const modalOpts = {
		title: '清单操作',
		visible,
		onOk: handleConfirm,
		onCancel
	};

	const {
		_id,
		orderNumber,
		customerId,
		customerName,
		totalAmount,
		paymentAmount
	} = currentItem;

	return (
		<Modal {...modalOpts} className={modal}>
			<Form layout='horizontal'>
				<FormItem {...formItemLayout} style={{margin: 0}}>
					{
						getFieldDecorator('orderId', {
							initialValue: _id
						})(
							<Input type="hidden"/>
						)
					}
				</FormItem>
				<FormItem label='单据编号：' {...formItemLayout}>
					{
						getFieldDecorator('orderNumber', {
							initialValue: orderNumber
						})(
							<Input type="text" disabled={true}/>
						)
					}
				</FormItem>
				<FormItem {...formItemLayout} style={{margin: 0}}>
					{
						getFieldDecorator('customerId', {
							initialValue: customerId
						})(
							<Input type="hidden"/>
						)
					}
				</FormItem>
				<FormItem label='客户名称：' {...formItemLayout}>
					{
						getFieldDecorator('customerName', {
							initialValue: customerName
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
				<FormItem label='清单金额：' hasFeedback {...formItemLayout}>
					{
						getFieldDecorator('clearOrderAmount', {
							initialValue: 0
						})(
							<Input type="text"/>
						)
					}
				</FormItem>
			</Form>
		</Modal>
	);
};

ClearDebtOrdersModal.propTypes = {
	visible: PropTypes.any,
	onConfirm: PropTypes.func,
	onCancel: PropTypes.func,
	currentItem: PropTypes.object,
	form: PropTypes.object.isRequired
};

export default Form.create()(ClearDebtOrdersModal);