import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import CustomerList from '../../components/Customers/CustomerList/CustomerList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import AddCustomer from '../../components/Customers/AddCustomer/AddCustomer';
import ModifyCustomer from '../../components/Customers/AddCustomer/AddCustomer';
import {redirect} from '../../utils/webSessionUtils';
import {customerClass, customerContainer, addCustomerContainer, modifyCustomerContainer} from './index.css';

function genCustomers({dispatch, customers}) {
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
    } = customers;

    const customerListProps = {
        current,
        total,
        dataSource: list,
        loading,
        onPageChange(page){
            dispatch(routerRedux.push({
                pathname: '/customer',
                query: {field, keyword, page}
            }));
        },
        onModify(customer){
            dispatch({
                type: 'customers/showEditor',
                payload: {
                    currentItem: customer,
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
        customer: editorType == 'create' ? {} : currentItem,
        type: editorType,
        visible: editorVisible,
        onConfirm(data){
            console.log(customers);
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
            pathname: '/customer',
            query: {...fieldValues, page: 1}
        }));
    };

    const onAdd = ()=> {
        dispatch({
            type: 'customers/showEditor'
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
                                    <AddCustomer {...customerEditor}/>
                                </div>
                            ) :
                            (
                                <div className={modifyCustomerContainer}>
                                    <ModifyCustomer {...customerEditor}/>
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
