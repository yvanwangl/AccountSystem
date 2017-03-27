import React, {Component, PropTypes} from 'react';
import {Form, Input} from 'antd';
import {orderRemarkForm} from './index.css';

const FormItem = Form.Item;

const OrderRemarkForm = ({
    onSetMem,
    mem,
    disabled,
    form: {
        getFieldDecorator
    }
}) => {
    const handleChange = (e)=> {
        onSetMem(e.target.value);
    };

    return (
        <div className={orderRemarkForm}>
            <Form layout='inline'>
                <FormItem label="填写备注：">
                    {
                        getFieldDecorator('mem', {
                            initialValue: mem
                        })(
                            <Input
                                type='textarea'
                                rows={4}
                                style={{width: 500, fontSize: 14}}
                                onBlur={handleChange}
                                placeholder="在此填写备注..."
                                disabled={disabled || false}
                            />
                        )
                    }
                </FormItem>
            </Form>
        </div>
    );
};

OrderRemarkForm.propTypes = {
    form: PropTypes.object.isRequired,
    onSetMem: PropTypes.func
};

export default Form.create()(OrderRemarkForm);