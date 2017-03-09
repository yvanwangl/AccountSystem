import React, {Component, PropTypes} from 'react';
import {Form, Input, Select, Button, DatePicker} from 'antd';
import moment from 'moment';
import {searchForm} from './index.css';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const SearchForm = ({
    onSearch,
	customers,
    form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields
    }
}) => {
    const onSubmit = (e)=> {
        e.preventDefault();
        validateFields((errors)=> {
            if (!!errors) {
                return false;
            }
            onSearch(getFieldsValue());
        })
    };

    return (
        <div className={searchForm}>
            <Form inline onSubmit={onSubmit}>
                <FormItem>
                    {
                        getFieldDecorator('timeRange')(
                            <RangePicker size='large'/>
                        )
                    }
                </FormItem>
                <FormItem label="客户名称：">
                    {
                        getFieldDecorator('customerId')(
                            <Select style={{minWidth: 150}}>
								{
									customers.map(({_id, customerName})=>(
										<Option key={_id}>{customerName}</Option>
									))
								}
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="订单编号：">
                    {
                        getFieldDecorator('orderNumber')(
                            <Input type="text"/>
                        )
                    }
                </FormItem>
                <Button type='primary' htmlType='submit'>搜索</Button>
            </Form>
        </div>
    );
};

SearchForm.propTypes = {
    form: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
	customers: PropTypes.array
};

export default Form.create()(SearchForm);