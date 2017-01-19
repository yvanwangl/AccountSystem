import React, {Component, PropTypes} from 'react';
import {addOrderTitle,orderNumber} from './index.css';

const AddOrderTitle = () => {

    return (
        <div className={addOrderTitle}>
            铭帝系统门窗出货单
            <span className={orderNumber}>单据编号：{'MDC201701100001'}</span>
        </div>
    );
};

export default AddOrderTitle;