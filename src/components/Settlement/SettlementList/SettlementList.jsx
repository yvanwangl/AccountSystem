import React, {Component, PropTypes} from 'react';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import dateFormat from '../../../utils/dateFormat';
import {PAGE_SIZE} from '../../../constants/constants';
import Spliter from '../../Spliter/Spliter';
import * as moment from 'moment';
import {settlementList} from './index.css';

const SettlementList = ({
    total,
    current,
    loading,
    dataSource,
    onPageChange
}) => {
    const columns = [
        {
            title: '序号',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            render: (text, record, index)=><span>{index + 1}</span>
        },
        {
            title: '结算日期',
            dataIndex: 'createInstance',
            key: 'createInstance',
            render: (text)=><span>{moment.parseZone(text).local().format('YYYY-MM-DD HH:mm')}</span>
        },
		{
			title: '结算金额',
			dataIndex: 'settlementAmount',
			key: 'settlementAmount'
		},
        {
            title: '结算操作员',
            dataIndex: 'userName',
            key: 'userName'
        },

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

    return (
        <div className={settlementList}>
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                rowKey={record=>record._id}
                pagination={false}
                rowSelection={rowSelection}
            />
            <Pagination
                className="ant-table-pagination"
                total={total}
                current={parseInt(current)}
                pageSize={PAGE_SIZE}
                onChange={onPageChange}
            />
        </div>
    );
};

SettlementList.propTypes = {
    onPageChange: PropTypes.func,
    dataSource: PropTypes.array,
    loading: PropTypes.any,
    total: PropTypes.any,
    current: PropTypes.any
};

export default SettlementList;