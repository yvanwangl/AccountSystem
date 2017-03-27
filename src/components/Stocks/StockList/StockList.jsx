import React, {Component, PropTypes} from 'react';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import dateFormat from '../../../utils/dateFormat';
import {PAGE_SIZE} from '../../../constants/constants';
import Spliter from '../../Spliter/Spliter';
import numberFormat from '../../../utils/numberFormat';
import {orderList} from './index.css';



const StockList = ({
    loading,
    dataSource,
}) => {
    const columns = [
        {
            title: '序号',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            render: (text, record, index)=>text=='总计'? text:<span>{index + 1}</span>
        },
        {
            title: '商品编码',
            dataIndex: 'productCode',
            key: 'productCode'
        },
        {
            title: '商品名称',
            dataIndex: 'productName',
            key: 'productName'
        },
        {
            title: '商品类别',
            dataIndex: 'productType',
            key: 'productType'
        },
		{
			title: '商品单位',
			dataIndex: 'productUnit',
			key: 'productUnit'
		},
        {
            title: '入库量',
            dataIndex: 'inAmount',
            key: 'inAmount'
        },
        {
            title: '出库量',
            dataIndex: 'outAmount',
            key: 'outAmount'
        },
        {
            title: '库存量',
            dataIndex: 'amount',
            key: 'amount',
			render: (text)=> <span style={{color: 'red'}}>{text}</span>
        },
		{
			title: '销售均价',
			dataIndex: 'averagePrice',
			key: 'averagePrice',
			render: (text, record, index)=> record._id!='total'?numberFormat(text):null
		},
		{
			title: '库存资金',
			dataIndex: 'stockFunds',
			key: 'stockFunds',
			render: (text)=> <span style={{color: 'red'}}>{numberFormat(text)}</span>
		}
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User',    // Column configuration not to be checked
        }),
    };

	const computeTotal = (dataSource, key)=>{
		return  dataSource.map(data=> data[key]).reduce((total, amount)=> total += amount, 0);
	};

	const getTotalData = (dataSource)=>{
		if(!dataSource.computed){
			let totalData = {
				_id:'total',
				serialNumber: '总计',
				productCode: '',
				productName: '',
				productType: '',
				inAmount: computeTotal(dataSource, 'inAmount'),
				outAmount: computeTotal(dataSource, 'outAmount'),
				amount: computeTotal(dataSource, 'amount'),
				averagePrice: '',
				stockFunds: computeTotal(dataSource, 'stockFunds')
			};
			dataSource.push(totalData);
			dataSource.computed = true;
		}
		return dataSource;
	};

    return (
        <div className={orderList}>
            <Table
                columns={columns}
                dataSource={dataSource && getTotalData(dataSource)}
                loading={loading}
                rowKey={record=>record._id}
                pagination={false}
                rowSelection={rowSelection}
            />
        </div>
    );
};

StockList.propTypes = {
    dataSource: PropTypes.array,
    loading: PropTypes.any
};

export default StockList;