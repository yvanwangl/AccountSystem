import React, {Component, PropTypes} from 'react';
import {Table, Popconfirm, Icon, Form, Input} from 'antd';
import EditableCell from '../../EditableCell/EditableCell';
import Spliter from '../../Spliter/Spliter';
import {addOrderGrid, rowClassName, totalAmountClass, remarkClass} from './index.css';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};

class AddOrderGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[
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
            ],
            count:2,
            totalAmount:0,
            paymentAmount:0,
            remarks:''
        };
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
                    <p style={{textAlign:'center'}}>
                        <a type='ghost' onClick={this.handleAdd.bind(this)}><Icon type="plus"/></a>
                        <Spliter />
                        <Popconfirm title="确定删除该条记录？" onConfirm={this.onDelete(index)}>
                            <a type='ghost'><Icon type="minus"/></a>
                        </Popconfirm>
                    </p>
                )
            },
            {
                title: '商品名称',
                dataIndex: 'productName',
                key: 'productName',
                render: (text, record, index)=>(
                    <EditableCell
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
                        value={text}
                        onChange={this.onLinkCellChange(index, 'price')}
                    />
                )
            },
            {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount'
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                render: (text, record, index)=>(
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(index, 'remarks')}
                    />
                )
            }
        ];
    }
    onCellChange(index, key){
        return (value)=>{
            const dataSource = [...this.state.dataSource];
            dataSource[index][key] = value;
            this.setState({dataSource});
        }
    }

    onLinkCellChange(index, key){
        return (value)=>{
            let dataSource = [...this.state.dataSource];
            let record = dataSource[index];
            if(key=='quantity'){
                let price = record.price;
                if(price!=null){
                    record.amount = parseInt(value)*parseInt(price);
                }
            }else if(key=='price'){
                let quantity = record.quantity;
                if(quantity!=null){
                    record.amount = parseInt(value)*parseInt(quantity);
                }
            }
            record[key] = value;
            this.setState({ dataSource });
            let totalAmount = this.getTotalAmount();
            this.setState({ totalAmount });
        }
    }

    getTotalAmount(){
        const dataSource = [...this.state.dataSource];
        let totalAmount = 0;
        dataSource.map((data, index)=> totalAmount+=data['amount']);
        return totalAmount;
    }

    onDelete(index){
        return ()=>{
            const dataSource = [...this.state.dataSource];
            dataSource.splice(index,1);
            this.setState({dataSource});
        }
    }

    handleAdd(){
        let {dataSource, count} = this.state;
        let newData = {
            key:count,
            productName:'铝合金',
            quantity:10,
            unit:'吨',
            price:10,
            amount:100,
            remarks:''
        };
        this.setState({
            dataSource:[...dataSource, newData],
            count: count+1
        });
    }

    setRemarks(e){
        this.setState({
            remarks: e.target.value
        });
    }

    render(){
        let {dataSource, totalAmount,paymentAmount,remarks} = this.state;
        let columns = this.columns;
        return (
            <div className={addOrderGrid}>
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination = {false}
                    footer={() => <div className={totalAmountClass}><p>合计金额：￥{totalAmount}</p><p>支付金额：￥{paymentAmount}</p></div>}
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