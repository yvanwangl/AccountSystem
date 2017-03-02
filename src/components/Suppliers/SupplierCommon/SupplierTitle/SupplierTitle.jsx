import React, {Component, PropTypes} from 'react';
import {supplierTitle} from './index.css';

const SupplierTitle = ({titleText}) => {

    return (
        <div className={supplierTitle}>
            {titleText}
        </div>
    );
};

export default SupplierTitle;