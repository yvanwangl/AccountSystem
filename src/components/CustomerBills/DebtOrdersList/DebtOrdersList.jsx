import React, {Component, PropTypes} from 'react';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import dateFormat from '../../../utils/dateFormat';
import {PAGE_SIZE} from '../../../constants/constants';
import Spliter from '../../Spliter/Spliter';
import numberFormat from '../../../utils/numberFormat';
import * as moment from 'moment';
import {debtOrdersList, debtOrdersListTitle} from './index.css';

class DebtOrdersList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectId: ''
		};
		const {onClearOrder} = this.props;
		this.columns = [
			{
				title: '序号',
				dataIndex: 'serialNumber',
				key: 'serialNumber',
				render: (text, record, index) => <span>{index + 1}</span>
			},
			{
				title: '单据编号',
				dataIndex: 'orderNumber',
				key: 'orderNumber'
			},
			{
				title: '下单日期',
				dataIndex: 'createInstance',
				key: 'createInstance',
				render: (text) => <span>{moment.parseZone(text).local().format('YYYY-MM-DD HH:mm')}</span>
			},
			{
				title: '客户名称',
				dataIndex: 'customerName',
				key: 'customerName'
			},
			{
				title: '应付金额',
				dataIndex: 'totalAmount',
				key: 'totalAmount',
				render: (text, record, index) => numberFormat(text)
			},
			{
				title: '已付金额',
				dataIndex: 'paymentAmount',
				key: 'paymentAmount',
				render: (text, record, index) => numberFormat(text)
			},
			{
				title: '所欠金额',
				dataIndex: 'debtAmount',
				key: 'debtAmount',
				render: (text, record, index) => <span style={{color: 'red'}}>{numberFormat(text)}</span>
			},
			{
				title: '操作',
				key: 'operation',
				render: (text, record) => (
					<p>
						<a onClick={() => onClearOrder(record)}>清单</a>
					</p>
				)
			}
		];
	}

	static propTypes = {
		onClearOrder: PropTypes.func,
		onPageChange: PropTypes.func,
		dataSource: PropTypes.array,
		loading: PropTypes.any,
		total: PropTypes.any,
		current: PropTypes.any
	};

	onPageChange = (page) => {
		const {onPageChange} = this.props;
		onPageChange(page);
	};

	render() {
		const {
			total,
			current,
			loading,
			dataSource
		} = this.props;
		return (
			<div className={debtOrdersList}>
				<h2 className={debtOrdersListTitle}>欠账订单列表</h2>
				<Table
					columns={this.columns}
					dataSource={dataSource}
					loading={loading}
					rowKey={record => record._id}
					pagination={false}
				/>
				<Pagination
					className="ant-table-pagination"
					total={total}
					current={parseInt(current)}
					pageSize={PAGE_SIZE}
					onChange={this.onPageChange}
				/>
			</div>
		)
	}
}

export default DebtOrdersList;