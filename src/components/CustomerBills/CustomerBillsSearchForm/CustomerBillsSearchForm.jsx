import React, {Component, PropTypes} from 'react';
import {Form, Input, Select, Button, DatePicker} from 'antd';
import {customerBillsSearchForm} from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const CustomerBillsSearchForm = ({
	onSearch,
	customers,
	form: {
		getFieldDecorator,
		validateFields
	}
}) => {
	const onSubmit = (e) => {
		e.preventDefault();
		validateFields((errors, values) => {
			if (!!errors) {
				return false;
			}
			onSearch(values);
		})
	};

	return (
		<div className={customerBillsSearchForm}>
			<Form layout='inline' onSubmit={onSubmit}>
				<FormItem label="客户名称：">
					{
						getFieldDecorator('customerId')(
							<Select style={{minWidth: 150}}>
								{
									customers.map(({_id, customerName}) => (
										<Option key={_id}>{customerName}</Option>
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

CustomerBillsSearchForm.propTypes = {
	form: PropTypes.object,
	onSearch: PropTypes.func,
	customers: PropTypes.array
};

export default Form.create()(CustomerBillsSearchForm);