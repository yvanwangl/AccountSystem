import React, {Component, PropTypes} from 'react';
import {Input, Icon, Select} from 'antd';
import {editCell, editLine, inputWrapper, textWrapper, checkIcon, editIcon, hiddenIcon} from './index.css';

const Option = Select.Option;

class ListEditableCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
			name: '',
            editable: false
        };
    }

	handleSelect = (value) => {
        this.setState({value});
    };

    check = () => {
        this.setState({
            editable: false
        });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    };

    edit = () => {
        let {disabled} = this.props;
        if (disabled) {
            return false;
        }
        this.setState({
            editable: true
        });
    };

    render() {
        let {value, editable} = this.state;
        let { disabled, productList} = this.props;
        return (
            <div className={editCell}>
                {
                    editable ?
                        (
                            <div className={inputWrapper}>
								<Select
									defaultValue={{ key: value.key }}
									onSelect={this.handleSelect}
									onBlur={this.check}
									style={{ minWidth: 120, width:'100%' }}
									disabled={disabled || false}
									labelInValue
								>
									{
										productList.map(({_id, productName, productUnit})=>
											<Option key={_id}>{`${productName} (${productUnit})`}</Option>
										)
									}
								</Select>
                                <Icon
                                    type="check"
                                    className={checkIcon}
                                    onClick={this.check}
                                />
                            </div>
                        ) :
                        (
                            <div className={textWrapper} onDoubleClick={this.edit}>
                                {value.label}
                                <Icon
                                    type="edit"
                                    className={!disabled?editIcon:hiddenIcon}
                                    onClick={this.edit}
                                />
                            </div>
                        )

                }
            </div>
        );
    }
}

ListEditableCell.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
};

export default ListEditableCell;