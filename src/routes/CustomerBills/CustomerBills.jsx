import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import CustomerBillsSearchForm from '../../components/CustomerBills/CustomerBillsSearchForm/CustomerBillsSearchForm';
import DebtOrdersList from '../../components/CustomerBills/DebtOrdersList/DebtOrdersList';
import CustomerBillsList from '../../components/CustomerBills/CustomerBillsList/CustomerBillsList';
import ClearDebtOrdersModal from '../../components/CustomerBills/ClearDebtOrdersModal/ClearDebtOrdersModal';
import ClearCustomerBillsModal from '../../components/CustomerBills/ClearCustomerBillsModal/ClearCustomerBillsModal';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import {redirect} from '../../utils/webSessionUtils';
import {search, customerBillsClass, debtOrdersListContainer, customerBillsListContainer} from './index.css';

function genCustomerBills({dispatch, customerBillsSpace}){
    const {
        total,
        loading,
        current,
		breadcrumbItems,
		orders,
		customers,
		customerBills,
		visible,
		editorType,
		currentItem,
		customerId
    } = customerBillsSpace;

	const debtOrdersListProps ={
		current,
		total,
		dataSource: orders,
		loading,
		onClearOrder(order){
			dispatch({
				type: 'customerBillsSpace/clearOrder',
				payload: {
					order
				}
			});
		},
		onPageChange(page){
			dispatch({
				type:'customerBillsSpace/query',
				payload: {customerId, page}
			});
		}
	};

	const customerBillsListProps ={
		dataSource: customerBills,
		loading,
		onClearBill(bill){
			dispatch({
				type: 'customerBillsSpace/clearBill',
				payload: {
					bill
				}
			});
		}
	};

	const onSearch = (fieldValues)=>{
		dispatch({
			type:'customerBillsSpace/query',
			payload:{...fieldValues, page:1}
		});
	};

	const clearModalProps = {
		visible,
		currentItem,
		onConfirm(values){
			dispatch({
				type: `customerBillsSpace/${editorType=='clearOrder'? 'doClearOrder':'doClearBill'}`,
				payload: {
					...values
				}
			});
		},
		onCancel(){
			dispatch({
				type: 'customerBillsSpace/hideEditor'
			});
		},
	};

	const ClearDebtOrdersModalGen = ()=><ClearDebtOrdersModal {...clearModalProps}/>;

	const ClearCustomerBillsModalGen = ()=><ClearCustomerBillsModal {...clearModalProps}/>;

	return (
		<div className={customerBillsClass}>
			<BreadcrumbList breadcrumbItems={breadcrumbItems} />
			<div className={search}>
				<CustomerBillsSearchForm onSearch={onSearch} customers={customers}/>
			</div>
			<div className={debtOrdersListContainer}>
				<DebtOrdersList {...debtOrdersListProps} />
			</div>
			<div className={customerBillsListContainer}>
				<CustomerBillsList {...customerBillsListProps}/>
			</div>
			{
				editorType=='clearOrder'?
					<ClearDebtOrdersModalGen />:
					<ClearCustomerBillsModalGen />
			}
		</div>
	);
}

class CustomerBills extends Component {
    constructor(props){
        super(props);
    }

	componentWillMount(){
		let {isLogin} = this.props.systemUser;
		return !isLogin && redirect();
	}

    render(){
		let {isLogin} = this.props.systemUser;
		return isLogin && genCustomerBills(this.props);
    }
}

CustomerBills.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({customerBillsSpace, systemUser}) {
    return {customerBillsSpace, systemUser};
}


export default connect(mapStateToProps)(CustomerBills);