import React, {Component, PropTypes} from 'react';
import {Table, Popconfirm, Icon} from 'antd';
import EditableCell from '../../../EditableCell/EditableCell';
import Spliter from '../../../Spliter/Spliter';
import {addOrderGrid, rowClassName, totalAmountClass, remarkClass, paymentAmountClass} from './index.css';


class AddOrderGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /*dataSource:[
             {
             key:'0',
             productName:'铝合金',
             quantity:10,
             unit:'吨',
             price:10,
             amount:100,
             remarks:''
             },
             {
             key:'1',
             productName:'铝合金',
             quantity:10,
             unit:'吨',
             price:10,
             amount:100,
             remarks:''
             }
             ],*/
            dataSource: this.props.products,
            count: 1,
            totalAmount: this.props.totalAmount,
            paymentAmount: this.props.paymentAmount,
            remarks: ''
        };
        let disabled = this.props.disabled || false;
        this.columns = [
            {
                title: '序号',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
                render: (text, record, index)=><span>{index + 1}</span>
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index)=>(
                    !disabled ? (
                        <p style={{textAlign: 'center'}}>
                            <a type='ghost' onClick={this.handleAdd.bind(this)}><Icon type="plus"/></a>
                            <Spliter />
                            <Popconfirm title="确定删除该条记录？" onConfirm={this.onDelete(index)}>
                                <a type='ghost'><Icon type="minus"/></a>
                            </Popconfirm>
                        </p>
                    ) : null
                )
            },
            {
                title: '商品名称',
                dataIndex: 'productName',
                key: 'productName',
                render: (text, record, index)=>(
                    <EditableCell
                        disabled={disabled}
                        editType='editCell'
                        value={text}
                        onChange={this.onCellChange(index, 'productName')}
                    />
                )
            },
            {
                title: '数量',
                dataIndex: 'quantity',
                key: 'quantity',
                render: (text, record, index)=>(
                    <EditableCell
                        disabled={disabled}
                        editType='editCell'
                        value={text}
                        onChange={this.onLinkCellChange(index, 'quantity')}
                    />
                )
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                render: (text, record, index)=>(
                    <EditableCell
                        disabled={disabled}
                        editType='editCell'
                        value={text}
                        onChange={this.onCellChange(index, 'unit')}
                    />
                )
            },
            {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                render: (text, record, index)=>(
                    <EditableCell
                        disabled={disabled}
                        editType='editCell'
                        value={text}
                        onChange={this.onLinkCellChange(index, 'price')}
                    />
                )
            },
            {
                title: '金额 / 元',
                dataIndex: 'amount',
                key: 'amount'
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                render: (text, record, index)=>(
                    <EditableCell
                        disabled={disabled}
                        editType='editCell'
                        value={text}
                        onChange={this.onCellChange(index, 'remarks')}
                    />
                )
            }
        ];
    }

    onCellChange(index, key) {
        const {editProducts} = this.props;
        const {totalAmount, paymentAmount} = this.state;
        return (value)=> {
            const dataSource = [...this.state.dataSource];
            dataSource[index][key] = value;
            this.setState({dataSource});
            editProducts(dataSource, totalAmount, paymentAmount);
        }
    }

    onLinkCellChange(index, key) {
        const {editProducts} = this.props;
        const {paymentAmount} = this.state;
        return (value)=> {
            let dataSource = [...this.state.dataSource];
            let record = dataSource[index];
            if (key == 'quantity') {
                let price = record.price;
                if (price != null) {
                    record.amount = parseInt(value) * parseInt(price);
                }
            } else if (key == 'price') {
                let quantity = record.quantity;
                if (quantity != null) {
                    record.amount = parseInt(value) * parseInt(quantity);
                }
            }
            record[key] = value;
            this.setState({dataSource});
            let totalAmount = this.getTotalAmount();
            this.setState({totalAmount});
            editProducts(dataSource, totalAmount, paymentAmount);
        }
    }

    getTotalAmount() {
        const dataSource = [...this.state.dataSource];
        let totalAmount = 0;
        dataSource.map((data, index)=> totalAmount += data['amount']);
        return totalAmount;
    }

    onDelete(index) {
        const {editProducts} = this.props;
        const {totalAmount, paymentAmount} = this.state;
        return ()=> {
            const dataSource = [...this.state.dataSource];
            dataSource.splice(index, 1);
            this.setState({dataSource});
            editProducts(dataSource, totalAmount, paymentAmount);
        }
    }

    handleAdd() {
        let {dataSource, count} = this.state;
        let newData = {
            key: count,
            productName: '铝合金',
            quantity: 0,
            unit: '吨',
            price: 0,
            amount: 0,
            remarks: ''
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1
        });
    }

    handlePaymentAmount() {
        const {editProducts} = this.props;
        const {dataSource, totalAmount} = this.state;
        return (paymentValue)=> {
            this.setState({
                paymentAmount: paymentValue
            });
            editProducts(dataSource, totalAmount, paymentValue);
        };
    }


    render() {
        let {dataSource, totalAmount, paymentAmount} = this.state;
        let columns = this.columns;
        let {disabled} = this.props;
        return (
            <div className={addOrderGrid}>
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    footer={() =>
                        <div className={totalAmountClass}>
                            <div>合计金额：￥{totalAmount}</div>
                            <div className={paymentAmountClass}>支付金额：￥<EditableCell disabled={disabled}
                                                                                    editType='editLine'
                                                                                    onChange={this.handlePaymentAmount()}
                                                                                    value={paymentAmount}/></div>
                        </div>
                    }
                    size="small"
                    rowClassName={()=>rowClassName}
                />
            </div>
        );
    }

}

/*AddOrderGrid.propTypes = {
 onPageChange: PropTypes.func,
 onModify: PropTypes.func,
 onDel: PropTypes.func,
 dataSource: PropTypes.array,
 loading: PropTypes.any,
 total: PropTypes.any,
 current: PropTypes.any
 };*/

export default AddOrderGrid;