import React, {Component, PropTypes} from 'react';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import dateFormat from '../../../utils/dateFormat';
import {PAGE_SIZE} from '../../../constants/constants';
import Spliter from '../../Spliter/Spliter';
import numberFormat from '../../../utils/numberFormat';
import {fundsList} from './index.css';

const FundsList = ({
    loading,
    dataSource
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
            title: '购买金额',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
			render: (text, record, index)=> numberFormat(text)
        },
        {
            title: '销售金额',
            dataIndex: 'salePrice',
            key: 'salePrice',
			render: (text, record, index)=> numberFormat(text)
        },
        {
            title: '利润额',
            dataIndex: 'profitPrice',
            key: 'profitPrice',
			render: (text)=> <span style={{color:'red'}}>{numberFormat(text)}</span>
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
				purchasePrice: computeTotal(dataSource, 'purchasePrice'),
				salePrice: computeTotal(dataSource, 'salePrice'),
				profitPrice: computeTotal(dataSource, 'profitPrice')
			};
			dataSource.push(totalData);
			dataSource.computed = true;
		}
		return dataSource;
	};

    return (
        <div className={fundsList}>
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

FundsList.propTypes = {
    dataSource: PropTypes.array,
    loading: PropTypes.any
};

export default FundsList;