import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import {Search} from '../../components/Search/Search';
import {redirect} from '../../utils/webSessionUtils';
require('./index.css');

function genOrders({dispatch, orders}){
    const {
        list,
        total,
        field,
        keyword,
        loading,
        current,
        currentItem,
        editorVisible,
        editorType,
    } = orders;
    const orderSearch = {
        field,
        keyword,
        onSearch(fieldValues){
            dispatch(routerRedux.push({
                pathname:'/orders',
                query:{...fieldValues, page:1}
            }));
        },
        onAdd(){
            dispatch({
                type:'orders/showEditor',
                payload: {
                    editorType:'create'
                }
            });
        }
    };
    const orderList ={
        current,
        total,
        dataSource: list,
        loading,
        onPageChange(page){
            dispatch(routerRedux.push({
                pathname:'/orders',
                query: {field, keyword, page}
            }));
        },
        onModify(item){
            dispatch({
                type:'orders/showEditor',
                payload:{
                    editorType:'modify',
                    currentItem: item
                }
            });
        },
        onDel(id){
            dispatch({
                type:'orders/del',
                payload: id,
            });
        }
    };
    const orderEditor = {
        item: editorType=='create'? {}:currentItem,
        type: editorType,
        visible: editorVisible,
        onConfirm(data){
            dispatch({
                type: `orders/${editorType}`,
                payload: data,
            });
        },
        onCancel(){
            dispatch({
                type:'orders/hideEditor'
            });
        }
    };

    return (
        <div className='orders' style={{textAlign:'center'}}>
            订单页面
        </div>
    );
}
/*const Orders = ()=>{
    return (
        <div style={{textAlign:'center'}}>
            orders页面
        </div>
    );
};*/

class Orders extends Component{
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        const {isLogin} = this.props.systemUser;
        if(!isLogin){
            redirect();
        }
    }

    render(){
        return (
            <div className='orders' style={{textAlign:'center'}}>
                {genOrders(this.props)}
            </div>
        );
    }
}

Orders.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({orders, systemUser}) {
    return {orders, systemUser};
}

export default connect(mapStateToProps)(Orders);