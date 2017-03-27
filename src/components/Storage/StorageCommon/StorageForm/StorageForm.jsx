import React, {Component, PropTypes} from 'react';
import {Form, Select} from 'antd';
import {storageForm} from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;

const StorageForm = ({
	suppliers,
	supplierId,
    onSelect,
    disabled,
    form: {
        getFieldDecorator
    }
}) => {
    const handleChange = (value)=> {
        onSelect(value);
    };

    return (
        <div className={storageForm}>
            <Form layout='inline'>
                <FormItem label="供应商名称：">
                    {
                        getFieldDecorator('supplierId', {
                            initialValue: supplierId,
							rules:[
								{
									required: true,
									message: '供应商名称不能为空'
								}
							]
                        })(
                            <Select
                                showSearch
                                style={{width: 340}}
                                placeholder="选择一个供应商"
                                onChange={handleChange}
                                onSelect={handleChange}
                                disabled={disabled || false}
                            >
                                {
									suppliers.filter(supplier=> supplier['_id']!='00000').map((supplier, index)=>
                                        <Option key={index} value={supplier['_id']}>{supplier['supplierName']}</Option>
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

StorageForm.propTypes = {
    form: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    customers: PropTypes.any
};

export default Form.create()(StorageForm);