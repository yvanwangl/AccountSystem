import React, {Component, PropTypes} from 'react';
import {customerTitle} from './index.css';

const CustomerTitle = ({titleText}) => {

    return (
        <div className={customerTitle}>
            {titleText}
        </div>
    );
};

export default CustomerTitle;