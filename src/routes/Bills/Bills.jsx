import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import BillsSearchForm from '../../components/Bills/BillsSearchForm/BillsSearchForm';
import DebtOrdersList from '../../components/Bills/DebtOrdersList/DebtOrdersList';
import BillsList from '../../components/Bills/BillsList/BillsList';
import ClearDebtOrdersModal from '../../components/Bills/ClearDebtOrdersModal/ClearDebtOrdersModal';
import ClearBillsModal from '../../components/Bills/ClearBillsModal/ClearBillsModal';
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
		visible,
		editorType,
		currentItem
    } = billsSpace;

	const debtOrdersListProps ={
		current,
		total,
		dataSource: orders,
		loading,
		onClearOrder(order){
			dispatch({
				type: 'billsSpace/clearOrder',
				payload: {
					order
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
		onClearBill(bill){
			dispatch({
				type: 'billsSpace/clearBill',
				payload: {
					bill
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

	const clearModalProps = {
		visible,
		currentItem,
		onConfirm(values){
			dispatch({
				type: `billsSpace/${editorType=='clearOrder'? 'doClearOrder':'doClearBill'}`,
				payload: {
					...values
				}
			});
		},
		onCancel(){
			dispatch({
				type: 'billsSpace/hideEditor'
			});
		},
	};

	const ClearDebtOrdersModalGen = ()=><ClearDebtOrdersModal {...clearModalProps}/>;

	const ClearBillsModalGen = ()=><ClearBillsModal {...clearModalProps}/>;

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
			{
				editorType=='clearOrder'?
					<ClearDebtOrdersModalGen />:
					<ClearBillsModalGen />
			}
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