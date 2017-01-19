import React, {Component, PropTypes} from 'react';
import {Form, Input} from 'antd';
import {addRemarkForm} from './index.css';

const FormItem = Form.Item;

const AddRemarkForm = ({
    onSetMem,
    form: {
        getFieldDecorator
    }
}) => {
    const handleChange = (e)=>{
        onSetMem(e.target.value);
    };

    return (
        <div className={addRemarkForm}>
            <Form inline >
                <FormItem label="填写备注：">
                    {
                        getFieldDecorator('mem', {
                            initialValue: ''
                        })(
                            <Input
                                type='textarea'
                                rows={4}
                                style={{ width: 500, fontSize:14 }}
                                onBlur={handleChange}
                                placeholder="在此填写备注..."/>
                        )
                    }
                </FormItem>
            </Form>
        </div>
    );
};

AddRemarkForm.propTypes = {
    form: PropTypes.object.isRequired,
    onSetMem: PropTypes.func
};

export default Form.create()(AddRemarkForm);