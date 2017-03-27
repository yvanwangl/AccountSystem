import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import BillsSearchForm from '../../components/Bills/BillsSearchForm/BillsSearchForm';
import DebtOrdersList from '../../components/Bills/DebtOrdersList/DebtOrdersList';
import BillsList from '../../components/Bills/BillsList/BillsList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import {redirect} from '../../utils/webSessionUtils';
import {search, billsClass, debtOrdersListContainer, billsListContainer} from './index.css';

function genBills({dispatch, billsSpace}){
    const {
        total,
        loading,
        current,
		breadcrumbItems,
		orders,
		customers,
		bills,
		customerId
    } = billsSpace;

	const debtOrdersListProps ={
		current,
		total,
		dataSource: orders,
		loading,
		onClearOrder(orderId){
			dispatch({
				type: 'billsSpace/clearOrder',
				payload: {
					orderId
				}
			});
		},
		onPageChange(page){
			dispatch({
				type:'billsSpace/query',
				payload: {customerId, page}
			});
		}
	};

	const billsListProps ={
		dataSource: bills,
		loading,
		onClearBill(billId){
			dispatch({
				type: 'billsSpace/clearBill',
				payload: {
					billId
				}
			});
		}
	};

	const onSearch = (fieldValues)=>{
		dispatch({
			type:'billsSpace/query',
			payload:{...fieldValues, page:1}
		});
	};

	return (
		<div className={billsClass}>
			<BreadcrumbList breadcrumbItems={breadcrumbItems} />
			<div className={search}>
				<BillsSearchForm onSearch={onSearch} customers={customers}/>
			</div>
			<div className={debtOrdersListContainer}>
				<DebtOrdersList {...debtOrdersListProps} />
			</div>
			<div className={billsListContainer}>
				<BillsList {...billsListProps}/>
			</div>
		</div>
	);
}

class Bills extends Component {
    constructor(props){
        super(props);
    }

	componentWillMount(){
		let {isLogin} = this.props.systemUser;
		return !isLogin && redirect();
	}

    render(){
		let {isLogin} = this.props.systemUser;
		return isLogin && genBills(this.props);
    }
}

Bills.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({billsSpace, systemUser}) {
    return {billsSpace, systemUser};
}


export default connect(mapStateToProps)(Bills);