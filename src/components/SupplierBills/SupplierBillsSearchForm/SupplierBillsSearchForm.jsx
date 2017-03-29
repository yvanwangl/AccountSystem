import React, {Component, PropTypes} from 'react';
import {Form, Input, Select, Button, DatePicker} from 'antd';
import {supplierBillsSearchForm} from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const SupplierBillsSearchForm = ({
    onSearch,
	suppliers,
    form: {
        getFieldDecorator,
        validateFields
    }
}) => {
    const onSubmit = (e)=> {
        e.preventDefault();
        validateFields((errors, values)=> {
            if (!!errors) {
                return false;
            }
            onSearch(values);
        })
    };

    return (
        <div className={supplierBillsSearchForm}>
            <Form layout='inline' onSubmit={onSubmit}>
				<FormItem label="供应商名称：">
					{
						getFieldDecorator('supplierId')(
							<Select style={{minWidth: 150}}>
								{
									suppliers.map(({_id, supplierName})=>(
										<Option key={_id}>{supplierName}</Option>
									))
								}
							</Select>
						)
					}
				</FormItem>
                <Button type='primary' htmlType='submit'>搜索</Button>
            </Form>
        </div>
    );
};

SupplierBillsSearchForm.propTypes = {
    form: PropTypes.object,
    onSearch: PropTypes.func,
	suppliers: PropTypes.array
};

export default Form.create()(SupplierBillsSearchForm);