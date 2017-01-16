import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux, browserHistory} from 'dva/router';
import {Search} from '../../components/Search/Search';
import {getCurrentUser} from '../../utils/webSessionUtils';
require('./index.css');

function genOrders({location, dispatch, orders}){
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

    componentWillMount() {
        let currentUser = getCurrentUser();
        if (!currentUser['authToken']) {
            alert('请登录');
            browserHistory.push('/');
        }
    }

    render(){
        return (
            <div className='orders' style={{textAlign:'center'}}>
                订单页面
            </div>
        );
    }
}

Orders.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({orders}) {
    return {orders};
}

export default connect(mapStateToProps)(Orders);