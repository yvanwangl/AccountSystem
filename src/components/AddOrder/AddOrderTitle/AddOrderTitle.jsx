import React, {Component, PropTypes} from 'react';
import {addOrderTitle, orderNumberClass} from './index.css';

const AddOrderTitle = ({orderNumber}) => {

    return (
        <div className={addOrderTitle}>
            铭帝系统门窗出货单
            <span className={orderNumberClass}>单据编号：{orderNumber}</span>
        </div>
    );
};

export default AddOrderTitle;