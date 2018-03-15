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
const LoginModal =({
    visible,
    onConfirm,
    onCancel,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue
    }
})=>{
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
        title: '系统用户登录',
        visible,
        onOk:handleConfirm,
        onCancel
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
                                }
                            ]
                        })(
                            <Input type="password" onKeyDown={handleKeyDown} />
                        )
                    }
                </FormItem>
            </Form>
        </Modal>
    );
};

LoginModal.propTypes = {
    visible:PropTypes.any,
    onConfirm:PropTypes.func,
    onCancel:PropTypes.func,
    form:PropTypes.object.isRequired
};
export default Form.create()(LoginModal);