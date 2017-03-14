import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import CustomerList from '../../components/Customers/CustomerList/CustomerList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import Customer from '../../components/Customers/AddCustomer/AddCustomer';
import {redirect} from '../../utils/webSessionUtils';
import {customerClass, customerContainer, addCustomerContainer, modifyCustomerContainer} from './index.css';

function genCustomers({dispatch, customers}) {
    const {
        list,
        total,
        customerName,
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
            dispatch({
            	type:'customers/query',
				payload: {customerName, page}
			});
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
        },
		onDetail(customer){
			dispatch({
				type: 'customers/showEditor',
				payload: {
					currentItem: customer,
					editorType: 'detail'
				}
			});
		}
    };
    const customerEditor = {
        customer: editorType == 'create' ? {} : currentItem,
        type: editorType,
		disabled: editorType == 'detail',
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
                type: 'customers/resetCustomer'
            });
        }
    };

    const customerSearchProps = {
    	fieldName: 'customerName',
		labelName: '客户名称：',
		onSearch(fieldValues){
			dispatch({
				type:'customers/query',
				payload: {...fieldValues, page:1}
			});
		}
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
						(
							<div className={addCustomerContainer}>
								<Customer {...customerEditor}/>
							</div>
						)
                    ) :
                    (
                        <div className={customerContainer}>
                            <SearchBar onAdd={onAdd}>
								<SearchForm {...customerSearchProps}/>
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

	componentWillMount(){
		let {isLogin} = this.props.systemUser;
		return !isLogin && redirect();
	}

    render() {
		let {isLogin} = this.props.systemUser;
		return isLogin && genCustomers(this.props);
    }
}

Customers.propTypes = {
    customers: PropTypes.object,
};

function mapStateToProps({customers, systemUser}) {
    return {customers, systemUser};
}

export default connect(mapStateToProps)(Customers);
