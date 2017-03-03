import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {message} from 'antd';
import AddProductTitle from '../ProductCommon/ProductTitle/ProductTitle';
import AddProductForm from '../ProductCommon/ProductForm/ProductForm';
import {connect} from 'dva';
import {addProduct, productWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';


class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleConfirm() {
        /**
         * 数据保存前，做数据校验,
         * 所有数据均为必填项，包括：客户名称，联系人，联系方式，地址
         */
        let {onConfirm} = this.props;
        this.refs.addProductForm.validateFields((err, values) => {
            if (!!err) {
                return;
            }
            onConfirm(values);
        });
    }

    handleCancel() {
        let {onCancel} = this.props;
        onCancel();
    }

    render() {
        let {product, disabled} = this.props;
        return (
            <div className={addProduct}>
                <div className={productWrapper}>
                    <AddProductTitle titleText={'商品信息'}/>
                    <AddProductForm product={product} disabled={disabled} ref="addProductForm"/>
                </div>
                <div className={buttonGroup}>
					{
						disabled?
							null:
							<Button type="primary" className={confirmButton} onClick={this.handleConfirm}>
								确定
							</Button>
					}

                    <Button type="ghost" className={cancelButton} onClick={this.handleCancel}>取消</Button>
                </div>

            </div>
        );
    }
}

function mapStateToProps({products}) {
    return {products};
}

export default connect(mapStateToProps)(AddProduct);
