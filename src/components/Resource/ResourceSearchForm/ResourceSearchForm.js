/**
 * Created by wyf on 2017/3/5.
 */
import React, {PropTypes} from 'react';
import {Form, Button, Select} from 'antd';
import styles  from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;

function ResourceSearchForm({
	onSearch,
	products,
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
		<div className={styles.resourceSearchForm}>
			<Form layout='inline' onSubmit={onSubmit}>
				<FormItem label="商品名称：">
					{
						getFieldDecorator('productId')(
							<Select style={{minWidth: 150}}>
								{
									products.map(({_id, productName})=>(
										<Option key={_id}>{productName}</Option>
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
}

ResourceSearchForm.propTypes = {};

export default Form.create()(ResourceSearchForm);