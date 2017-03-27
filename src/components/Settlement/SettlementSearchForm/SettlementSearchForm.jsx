import React, {Component, PropTypes} from 'react';
import {Form, Input, Select, Button, DatePicker} from 'antd';
import {settlementSearchForm} from './index.css';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const SettlementSearchForm = ({
    onSearch,
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
            if(values['timeRange']){
            	values['timeRange'] = values['timeRange'].map((time)=> time.toLocaleString());
			}
            onSearch(values);
        })
    };

    return (
        <div className={settlementSearchForm}>
            <Form layout='inline' onSubmit={onSubmit}>
                <FormItem>
                    {
                        getFieldDecorator('timeRange')(
                            <RangePicker size='large'/>
                        )
                    }
                </FormItem>
                <Button type='primary' htmlType='submit'>搜索</Button>
            </Form>
        </div>
    );
};

SettlementSearchForm.propTypes = {
    form: PropTypes.object,
    onSearch: PropTypes.func,
	customers: PropTypes.array
};

export default Form.create()(SettlementSearchForm);