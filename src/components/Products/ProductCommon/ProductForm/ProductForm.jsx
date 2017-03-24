import React, {Component, PropTypes} from 'react';
import {Form, Input, Button, Upload, Icon} from 'antd';
import {formItemLayout, HTTP_SERVER} from '../../../../constants/constants';
import {productForm, formColumn, formTitle} from './index.css';

const FormItem = Form.Item;

const ProductForm = ({
    product,
	disabled,
    form
}) => {

    let {productCode, productName, productType, productUnit, productImg} = product;
    let {getFieldDecorator} = form;

	const normFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	};

	/*const uploadProductImg = (info)=>{
		if(info.file.status == 'done'){
			form.setFieldsValue({'productImg': info.file.response});
		}
	};*/

    return (
        <div className={productForm}>
            <Form>
                <span className={formColumn}>
                    <h2 className='formTitle'>基础资料</h2>
                    <FormItem label="商品编号：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('productCode', {
                                initialValue: productCode
                            })(
                                <Input type='text' disabled={disabled}/>
                            )
                        }
                    </FormItem>
                    <FormItem label="商品名称：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('productName', {
                                initialValue: productName,
                                rules: [
                                    {required: true, message: '商品名称不能为空'}
                                ]
                            })(
                                <Input type='text' disabled={disabled}/>
                            )
                        }
                    </FormItem>
                    <FormItem label="商品类别：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('productType', {
                                initialValue: productType,
                                rules: [
                                    {required: true, message: '商品类别不能为空'}
                                ]
                            })(
                                <Input type='text' disabled={disabled}/>
                            )
                        }
                    </FormItem>
                    <FormItem label="商品单位：" hasFeedback={!disabled} {...formItemLayout}>
                        {
                            getFieldDecorator('productUnit', {
                                initialValue: productUnit,
                                rules: [
                                    {required: true, message: '商品单位不能为空'}
                                ]
                            })(
                                <Input type='text' disabled={disabled}/>
                            )
                        }
                    </FormItem>
					<FormItem label="商品图片：" hasFeedback={!disabled} {...formItemLayout}>
                        {getFieldDecorator('productImg', {
							valuePropName: 'fileList',
							getValueFromEvent: normFile
						})(
							<Upload name="logo" action={`${HTTP_SERVER}/api/uploadProductImg`} listType="picture" disabled={disabled}>
								<Button>
									<Icon type="upload" /> 上传
								</Button>
							</Upload>
						)}
                    </FormItem>
                </span>
            </Form>
        </div>
    );
};

ProductForm.propTypes = {
    form: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    product: PropTypes.any
};

export default Form.create()(ProductForm);
