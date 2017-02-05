import React, {Component, PropTypes} from 'react';
import {Form, Input} from 'antd';
import {customerForm} from './index.css';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};

const CustomerForm = ({
    customer,
    onAddCustomer,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue
    }
}) => {
    const handleConfirm = ()=> {
        validateFields((errors)=> {
            if (!!errors) {
                return;
            }
            let data = {...getFieldsValue()};
            onAddCustomer(data);
        });
    };

    let {customerName, contactPeople, contactPhone, address, mem} = customer;

    return (
        <div className={customerForm}>
            <Form inline>
                <FormItem label="客户名称：" hasFeedback {...formItemLayout}>
                    {
                        getFieldDecorator('customerName', {
                            initialValue: customerName,
                            rules: [
                                {required: true, message: '客户名称不能为空'}
                            ]
                        })(
                            <Input type='text'/>
                        )
                    }
                </FormItem>
                <FormItem label="联系人：" hasFeedback {...formItemLayout}>
                    {
                        getFieldDecorator('contactPeople', {
                            initialValue: contactPeople,
                            rules: [
                                {required: true, message: '联系人不能为空'}
                            ]
                        })(
                            <Input type='text'/>
                        )
                    }
                </FormItem>
                <FormItem label="联系方式：" hasFeedback {...formItemLayout}>
                    {
                        getFieldDecorator('contactPhone', {
                            initialValue: contactPhone,
                            rules: [
                                {required: true, message: '联系方式不能为空'}
                            ]
                        })(
                            <Input type='text'/>
                        )
                    }
                </FormItem>
                <FormItem label="地址：" hasFeedback {...formItemLayout}>
                    {
                        getFieldDecorator('address', {
                            initialValue: address,
                            rules: [
                                {required: true, message: '地址不能为空'}
                            ]
                        })(
                            <Input type='text'/>
                        )
                    }
                </FormItem>
                <FormItem label="备注：" hasFeedback {...formItemLayout}>
                    {
                        getFieldDecorator('mem', {
                            initialValue: mem
                        })(
                            <Input
                                type='textarea'
                                rows={4}
                                style={{width: 500, fontSize: 14}}
                                placeholder="在此填写备注..."
                            />
                        )
                    }
                </FormItem>
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