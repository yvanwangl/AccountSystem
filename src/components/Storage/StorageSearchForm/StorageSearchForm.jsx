import React, {Component, PropTypes} from 'react';
import {Form, Input, Select, Button, DatePicker} from 'antd';
import {storageSearchForm} from './index.css';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const StorageSearchForm = ({
    onSearch,
	suppliers,
    form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields
    }
}) => {
    const onSubmit = (e)=> {
        e.preventDefault();
        validateFields((errors, values)=> {
            if (!!errors) {
                return false;
            }
            if(values['timeRange']){
            	values['timeRange'] = values['timeRange'].map((time)=> time.toLocaleString());
			}
            onSearch(values);
        })
    };

    return (
        <div className={storageSearchForm}>
            <Form layout='inline' onSubmit={onSubmit}>
                <FormItem>
                    {
                        getFieldDecorator('timeRange')(
                            <RangePicker size='large'/>
                        )
                    }
                </FormItem>
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
                <FormItem label="订单编号：">
                    {
                        getFieldDecorator('noteNumber')(
                            <Input type="text"/>
                        )
                    }
                </FormItem>
                <Button type='primary' htmlType='submit'>搜索</Button>
            </Form>
        </div>
    );
};

StorageSearchForm.propTypes = {
    form: PropTypes.object,
    onSearch: PropTypes.func,
	customers: PropTypes.array
};

export default Form.create()(StorageSearchForm);