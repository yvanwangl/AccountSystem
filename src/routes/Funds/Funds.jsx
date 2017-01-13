import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Search} from '../../components/Search/Search';
require('./index.css');

/*function Orders({location, dispatch, orders}){
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
        <div className='orders'>
            订单页面
        </div>
    );
}*/
const Funds = ()=>{
    return (
        <div style={{textAlign:'center'}}>
            funds页面
        </div>
    );
};

Funds.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({funds}) {
    return {funds};
}


//export default connect(mapStateToProps)(Orders);
export default Funds;