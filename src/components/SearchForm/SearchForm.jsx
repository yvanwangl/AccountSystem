import React, {Component, PropTypes} from 'react';
import {Form, Input, Select, Button, DatePicker} from 'antd';
import moment from 'moment';
import {searchForm} from './index.css';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const SearchForm = ({
    onSearch,
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
                <FormItem>
                    {
                        getFieldDecorator('field', {
                            initialValue: 'customer'
                        })(
                            <Select>
                                <Option value='customer'>客户名称</Option>
                                <Option value='ordernumber'>单据编号</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('keyword', {
                            initialValue: ''
                        })(
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
    onSearch: PropTypes.func
};

export default Form.create()(SearchForm);