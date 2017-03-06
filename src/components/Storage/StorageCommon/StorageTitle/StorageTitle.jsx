import React, {Component, PropTypes} from 'react';
import {storageTitle, storageNumberClass} from './index.css';

const StorageTitle = ({storageNumber}) => {

    return (
        <div className={storageTitle}>
            铭帝系统门窗出货单
            <span className={storageNumberClass}>单据编号：{storageNumber}</span>
        </div>
    );
};

export default StorageTitle;