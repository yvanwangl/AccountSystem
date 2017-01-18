import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import OrderList from '../../components/OrderList/OrderList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import {redirect} from '../../utils/webSessionUtils';
import {orders, orderContainer} from './index.css';

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
        beadcrumbItems
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
    const orderListProps ={
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

    const onSearch = (fieldValues) => {
        dispatch(routerRedux.push({
            pathname:'/orders',
            query:{...fieldValues, page:1}
        }));
    };

    return (
        <div className={orders}>
            <BreadcrumbList beadcrumbItems={beadcrumbItems} />
            <div className={orderContainer}>
                <SearchBar>
                    <SearchForm onSearch={onSearch}/>
                </SearchBar>
                <OrderList {...orderListProps} />
            </div>
        </div>
    );
}

class Orders extends Component{
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let {isLogin} = this.props.systemUser;
        if(!isLogin){
            redirect();
        }
    }

    render(){
        return genOrders(this.props);
    }
}

Orders.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({orders, systemUser}) {
    return {orders, systemUser};
}

export default connect(mapStateToProps)(Orders);