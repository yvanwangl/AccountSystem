import React, { Component, PropTypes } from 'react';
import { Form, Input } from 'antd';
import { formItemLayout } from '../../../../constants/constants';
import { customerForm, formColumn, formTitle } from './index.css';

const FormItem = Form.Item;

const CustomerForm = ({
    customer,
    disabled,
    form: {
        getFieldDecorator,
    }
}) => {

    let { customerName, contactPeople, contactPhone, address, mem, accountName, accountBank, accountNo } = customer;

    return (
        <div className={customerForm}>
            <Form>
                <span className={formColumn}>
                    <h2 className='formTitle'>基础资料</h2>
                    <FormItem label="客户名称：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('customerName', {
                                initialValue: customerName,
                                rules: [
                                    { required: true, message: '客户名称不能为空' }
                                ]
                            })(
                                <Input type='text' disabled={disabled} />
                            )
                        }
                    </FormItem>
                    <FormItem label="联系人：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('contactPeople', {
                                initialValue: contactPeople,
                                rules: [
                                    { required: true, message: '联系人不能为空' }
                                ]
                            })(
                                <Input type='text' disabled={disabled} />
                            )
                        }
                    </FormItem>
                    <FormItem label="联系方式：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('contactPhone', {
                                initialValue: contactPhone,
                                rules: [
                                    { required: true, message: '联系方式不能为空' }
                                ]
                            })(
                                <Input type='text' disabled={disabled} />
                            )
                        }
                    </FormItem>
                    <FormItem label="地址：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('address', {
                                initialValue: address,
                                rules: [
                                    { required: true, message: '地址不能为空' }
                                ]
                            })(
                                <Input type='text' disabled={disabled} />
                            )
                        }
                    </FormItem>
                    <FormItem label="备注：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('mem', {
                                initialValue: mem
                            })(
                                <Input
                                    type='textarea'
                                    disabled={disabled}
                                    rows={4}
                                    style={{ fontSize: 14 }}
                                    placeholder="在此填写备注..."
                                />
                            )
                        }
                    </FormItem>
                </span>
                <span className={formColumn}>
                    <h2 className='formTitle'>财务信息</h2>
                    <FormItem label="开户名称：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('accountName', {
                                initialValue: accountName
                            })(
                                <Input type='text' disabled={disabled} />
                            )
                        }
                    </FormItem>
                    <FormItem label="开户银行：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('accountBank', {
                                initialValue: accountBank
                            })(
                                <Input type='text' disabled={disabled} />
                            )
                        }
                    </FormItem>
                    <FormItem label="银行账号：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('accountNo', {
                                initialValue: accountNo
                            })(
                                <Input type='text' disabled={disabled} />
                            )
                        }
                    </FormItem>
                </span>
            </Form>
        </div>
    );
};

CustomerForm.propTypes = {
    form: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    customer: PropTypes.any
};

export default Form.create()(CustomerForm);
