/**
 * Created by wyf on 2017/3/5.
 */
import React, {PropTypes} from 'react';
import {Form, Button, Select} from 'antd';
import styles  from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;

function StockSearchForm({
	onSearch,
	form: {
		getFieldDecorator,
		getFieldsValue,
		validateFields
	}
}){
	const onSubmit = (e)=>{
		e.preventDefault();
		validateFields((err, values)=>{
			if(!!err){
				return;
			}
			onSearch(values);
		});
	};

	return (
		<div className={styles.stockSearchForm}>
			<Form layout='inline' onSubmit={onSubmit}>
				<FormItem>
					{
						getFieldDecorator('productType', {
							initialValue: '1'
						})(
							<Select>
								<Option value='1'>铝合金</Option>
								<Option value='2'>铁合金</Option>
							</Select>
						)
					}
				</FormItem>
				<FormItem>
					{
						getFieldDecorator('productName', {
							initialValue: '1'
						})(
							<Select>
								<Option value='1'>铝合金门窗</Option>
								<Option value='2'>铁合金门窗</Option>
							</Select>
						)
					}
				</FormItem>
				<Button type='primary' htmlType='submit'>搜索</Button>
			</Form>
		</div>
	);
}

StockSearchForm.propTypes = {};

export default Form.create()(StockSearchForm);