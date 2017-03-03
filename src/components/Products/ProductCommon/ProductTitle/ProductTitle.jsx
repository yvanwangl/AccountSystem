import React, {Component, PropTypes} from 'react';
import {productTitle} from './index.css';

const ProductTitle = ({titleText}) => {

    return (
        <div className={productTitle}>
            {titleText}
        </div>
    );
};

export default ProductTitle;