import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {message} from 'antd';
import AddOrderTitle from '../OrderCommon/OrderTitle/OrderTitle';
import AddOrderForm from '../OrderCommon/OrderForm/OrderForm';
import AddOrderGrid from '../OrderCommon/AddOrderGrid/AddOrderGrid';
import AddRemarkForm from '../OrderCommon/OrderRemarkForm/OrderRemarkForm';
import {connect} from 'dva';
import {addOrder, orderWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';

const AddOrder = ({
	dispatch,
	orders
}) => {
	const {order, customers, productList} = orders;
	const addOrderFormProps = {
		customers,
		disabled: false,
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
		if (customerId == null) {
			message.error('请选择一个客户！');
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
			type: 'orders/create',
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

	const addOrderGridProps = {
		products: order.products,
		productList,
		totalAmount: order.totalAmount,
		paymentAmount: order.paymentAmount,
		disabled: false,
		editProducts(products, totalAmount, paymentAmount){
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
		<div className={addOrder}>
			<div className={orderWrapper}>
				<AddOrderTitle orderNumber={order.orderNumber}/>
				<AddOrderForm {...addOrderFormProps}/>
				<AddOrderGrid {...addOrderGridProps}/>
				<AddRemarkForm disabled={false} onSetMem={onSetMem}/>
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

function mapStateToProps({orders}) {
	return {orders};
}

export default connect(mapStateToProps)(AddOrder);