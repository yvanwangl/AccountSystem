import React, {Component, PropTypes} from 'react';
import {Form, Select} from 'antd';
import {addOrderForm} from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;

const AddOrderForm = ({
    customers,
    onSelect,
    form: {
        getFieldDecorator
    }
}) => {
    const handleChange = (value)=>{
        onSelect(value);
    };

    return (
        <div className={addOrderForm}>
            <Form inline >
                <FormItem label="客户名称：">
                    {
                        getFieldDecorator('customerId', {
                            initialValue: ''
                        })(
                            <Select
                                showSearch
                                style={{ width: 340 }}
                                placeholder="选择一个客户"
                                onChange={handleChange}
                            >
                                {
                                    customers.map((customer, index)=>
                                        <Option key={index} value={customer['_id']}>{customer['name']}</Option>
                                    )
                                }

                            </Select>
                        )
                    }
                </FormItem>
            </Form>
        </div>
    );
};

AddOrderForm.propTypes = {
    form: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    customers:PropTypes.any
};

export default Form.create()(AddOrderForm);