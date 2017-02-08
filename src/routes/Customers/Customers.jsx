import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import CustomerList from '../../components/Customers/CustomerList/CustomerList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import AddCustomer from '../../components/Customers/AddCustomer/AddCustomer';
import ModifyCustomer from '../../components/Orders/ModifyOrder/ModifyOrder';
import {redirect} from '../../utils/webSessionUtils';
import {customerClass, customerContainer, addCustomerContainer, modifyCustomerContainer} from './index.css';

function genCustomers({dispatch, orders}) {
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
        breadcrumbItems
    } = orders;

    const customerListProps = {
        current,
        total,
        dataSource: list,
        loading,
        onPageChange(page){
            dispatch(routerRedux.push({
                pathname: '/customers',
                query: {field, keyword, page}
            }));
        },
        onModify(customerId){
            dispatch({
                type: 'customers/queryCustomerById',
                payload: {
                    customerId: customerId,
                    editorType: 'modify'
                }
            });
        },
        onDel(customerId){
            dispatch({
                type: 'customers/del',
                payload: customerId,
            });
        }
    };
    const customerEditor = {
        item: editorType == 'create' ? {} : currentItem,
        type: editorType,
        visible: editorVisible,
        onConfirm(data){
            dispatch({
                type: `customers/${editorType}`,
                payload: data,
            });
        },
        onCancel(){
            dispatch({
                type: 'customers/hideEditor'
            });
        }
    };

    const onSearch = (fieldValues)=> {
        dispatch(routerRedux.push({
            pathname: '/orders',
            query: {...fieldValues, page: 1}
        }));
    };

    const onAdd = ()=> {
        dispatch({
            type: 'orders/getOrderNumber'
        });
    };

    return (
        <div className={customerClass}>
            <BreadcrumbList breadcrumbItems={breadcrumbItems}/>
            {
                editorVisible ?
                    (
                        editorType == 'create' ?
                            (
                                <div className={addCustomerContainer}>
                                    <AddCustomer />
                                </div>
                            ) :
                            (
                                <div className={modifyCustomerContainer}>
                                    <ModifyCustomer/>
                                </div>
                            )
                    ) :
                    (
                        <div className={customerContainer}>
                            <SearchBar onAdd={onAdd}>
                            </SearchBar>
                            <CustomerList {...customerListProps} />
                        </div>
                    )
            }

        </div>
    );
}

class Customers extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let {isLogin} = this.props.systemUser;
        if (!isLogin) {
            redirect();
        }
    }

    render() {
        return genCustomers(this.props);
    }
}

Customers.propTypes = {
    customers: PropTypes.object,
};

function mapStateToProps({customers, systemUser}) {
    return {customers, systemUser};
}

export default connect(mapStateToProps)(Customers);