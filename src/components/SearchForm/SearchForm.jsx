import React, {Component, PropTypes} from 'react';
import {Form, Input, Select, Button, DatePicker} from 'antd';
import {searchForm} from './index.css';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const SearchForm = ({
    onSearch,
	fieldName,
	labelName,
    form: {
        getFieldDecorator,
		getFieldsValue
    }
}) => {
    const onSubmit = (e)=> {
        e.preventDefault();
		onSearch(getFieldsValue());
    };

    return (
        <div className={searchForm}>
            <Form layout='inline' onSubmit={onSubmit}>
                <FormItem label={labelName}>
                    {
                        getFieldDecorator(fieldName)(
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
    form: PropTypes.object,
    onSearch: PropTypes.func,
	customers: PropTypes.array
};

export default Form.create()(SearchForm);