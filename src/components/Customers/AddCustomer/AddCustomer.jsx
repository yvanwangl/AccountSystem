import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {message} from 'antd';
import AddCustomerTitle from '../CustomerCommon/CustomerTitle/CustomerTitle';
import AddCustomerForm from '../CustomerCommon/CustomerForm/CustomerForm';
import {connect} from 'dva';
import {addCustomer, customerWrapper, buttonGroup, confirmButton, cancelButton} from './index.css';


class AddCustomer extends Component {
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
        this.refs.addCustomerForm.validateFields((err, values) => {
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
        let {customer, disabled} = this.props;
        return (
            <div className={addCustomer}>
                <div className={customerWrapper}>
                    <AddCustomerTitle titleText={'客户资料'}/>
                    <AddCustomerForm customer={customer} disabled={disabled} ref="addCustomerForm"/>
                </div>
                <div className={buttonGroup}>
					{
						disabled ?
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

function mapStateToProps({customers}) {
    return {customers};
}

export default connect(mapStateToProps)(AddCustomer);
