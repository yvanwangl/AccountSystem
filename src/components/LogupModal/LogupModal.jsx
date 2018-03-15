import React, {Component, PropTypes} from 'react';
import {Form, Input, Modal} from 'antd'
import {modal} from './index.css';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};
const LogupModal =({
    visible,
    onConfirm,
    onCancel,
    form
})=>{

	const {
		getFieldDecorator,
		validateFields,
		getFieldsValue
	} = form;

    function handleConfirm() {
        validateFields((errors)=>{
            if(!!errors){
                return;
            }
            let userData = {...getFieldsValue()};
            onConfirm(userData);
        })
    }

    function handleKeyDown(e){
        if(e.keyCode == 13) {
            handleConfirm();
        }
    }

    const modalOpts = {
        title: '系统用户注册',
        visible,
        onOk:handleConfirm,
        onCancel
    };

	const checkPass = (rule, value, callback)=>{
		if(value){
			if(value.length<6){
				callback('密码长度不能小于6位！');
			}
			if (!/^([\d]+[a-zA-Z]+)|([a-zA-Z]+[\d]+)$/.test(value)) {
				return callback('密码必须由数字和字母组成！');
			}
			callback();
		}else {
			callback();
		}
	};

    const checkConfirmPass = (rule, value, callback)=>{
    	if(value && value!==form.getFieldValue('password')){
    		callback('确认密码与密码不一致！');
		}
		callback();
	};

    return (
        <Modal {...modalOpts} className={modal}>
            <Form layout='horizontal'>
                <FormItem label='用户名：' hasFeedback {...formItemLayout}>
                    {
                        getFieldDecorator('username',{
                            rules:[
                                {
									required:true,
									message:'请输入用户名！'
                                }
                            ]
                        })(
                            <Input type="text" onKeyDown={handleKeyDown}/>
                        )
                    }
                </FormItem>
                <FormItem label='密码：' hasFeedback {...formItemLayout}>
                    {
                        getFieldDecorator('password',{
                            rules:[
                                {
									required:true,
									message:'请输入密码！'
                                },
								{
									validator: checkPass
								}
                            ]
                        })(
                            <Input type="password" onKeyDown={handleKeyDown}/>
                        )
                    }
                </FormItem>
				<FormItem label='确认密码：' hasFeedback {...formItemLayout}>
					{
						getFieldDecorator('confirmPassword',{
							rules:[
								{
									required:true,
									message:'请重新输入密码！'
								},
								{
									validator: checkConfirmPass
								}
							]
						})(
							<Input type="password" onKeyDown={handleKeyDown}/>
						)
					}
				</FormItem>
            </Form>
        </Modal>
    );
};

LogupModal.propTypes = {
    visible:PropTypes.any,
    onConfirm:PropTypes.func,
    onCancel:PropTypes.func,
    form:PropTypes.object.isRequired
};
export default Form.create()(LogupModal);