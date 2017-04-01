import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {message} from 'antd';
import ModifyOrderTitle from '../OrderCommon/OrderTitle/OrderTitle';
import ModifyOrderForm from '../OrderCommon/OrderForm/OrderForm';
import ModifyOrderGrid from '../OrderCommon/AddOrderGrid/AddOrderGrid';
import OrderRemarkForm from '../OrderCommon/OrderRemarkForm/OrderRemarkForm';
import {connect} from 'dva';
import {modifyOrder, orderWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';

const ModifyOrder = ({
	dispatch,
	editorType,
	orders
}) => {
	const {order, currentItem, customers, productList} = orders;
	const disabled = editorType != 'modify';
	const modifyOrderFormProps = {
		customers,
		customerId: currentItem.customerId,
		disabled: disabled,
		onSelect(customerId){
			dispatch({
				type: 'orders/setCustomer',
				payload: {
					customerId
				}
			})
		}
	};

	const onSetMem = (mem) => {
		dispatch({
			type: 'orders/setMem',
			payload: {
				mem: mem
			}
		});
	};

	const handleConfirm = () => {
		/**
		 * 数据保存前，做数据校验,
		 * 用户不允许为空，并且至少需要保存一条商品数据
		 */
		const {customerId, products, totalAmount} = order;
		order['orderNumber'] = currentItem['orderNumber'];
		if (customerId == null) {
			order['customerId'] = currentItem['customerId'];
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
			type: 'orders/modify',
			payload: {
				order
			}
		});
		dispatch({
			type: 'orders/query'
		});
	};

	const handleCancel = () => {
		dispatch({
			type: 'orders/resetOrder'
		});
	};

	const modifyOrderGridProps = {
		products: currentItem.products,
		productList,
		totalAmount: currentItem.totalAmount,
		paymentAmount: currentItem.paymentAmount,
		disabled: disabled,
		editProducts(products, totalAmount, paymentAmount){
			console.log(totalAmount + '--' + paymentAmount);
			dispatch({
				type: 'orders/setProducts',
				payload: {
					products,
					totalAmount,
					paymentAmount
				}
			});
		}
	};

	return (
		<div className={modifyOrder}>
			<div className={orderWrapper}>
				<ModifyOrderTitle orderNumber={currentItem.orderNumber}/>
				<ModifyOrderForm {...modifyOrderFormProps}/>
				<ModifyOrderGrid {...modifyOrderGridProps}/>
				<OrderRemarkForm disabled={disabled} mem={currentItem.mem} onSetMem={onSetMem}/>
			</div>
			<div className={buttonGroup}>
				{
					editorType == 'modify' &&
					<Button type="primary" className={confirmButton} onClick={handleConfirm}>确定</Button>
				}
				<Button type="ghost" className={cancelButton} onClick={handleCancel}>取消</Button>
			</div>
		</div>
	);
};

ModifyOrder.propTypes = {
	onPageChange: PropTypes.func,
	onModify: PropTypes.func,
	onDel: PropTypes.func,
	dataSource: PropTypes.array,
	loading: PropTypes.any,
	total: PropTypes.any,
	current: PropTypes.any
};

function mapStateToProps({orders}) {
	return {orders};
}

export default connect(mapStateToProps)(ModifyOrder);