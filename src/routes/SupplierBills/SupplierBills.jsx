import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SupplierBillsSearchForm from '../../components/SupplierBills/SupplierBillsSearchForm/SupplierBillsSearchForm';
import DebtStorageList from '../../components/SupplierBills/DebtStorageList/DebtStorageList';
import SupplierBillsList from '../../components/SupplierBills/SupplierBillsList/SupplierBillsList';
import ClearDebtStorageModal from '../../components/SupplierBills/ClearDebtStorageModal/ClearDebtStorageModal';
import ClearSupplierBillsModal from '../../components/SupplierBills/ClearSupplierBillsModal/ClearSupplierBillsModal';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import {redirect} from '../../utils/webSessionUtils';
import {search, supplierBillsClass, debtStorageListContainer, supplierBillsListContainer} from './index.css';

function genSupplierBills({dispatch, supplierBillsSpace}){
    const {
        total,
        loading,
        current,
		breadcrumbItems,
		storage,
		suppliers,
		supplierBills,
		visible,
		editorType,
		currentItem,
		supplierId
    } = supplierBillsSpace;

	const debtStorageListProps ={
		current,
		total,
		dataSource: storage,
		loading,
		onClearStorage(order){
			dispatch({
				type: 'supplierBillsSpace/clearStorage',
				payload: {
					order
				}
			});
		},
		onPageChange(page){
			dispatch({
				type:'supplierBillsSpace/query',
				payload: {supplierId, page}
			});
		}
	};

	const supplierBillsListProps ={
		dataSource: supplierBills,
		loading,
		onClearBill(bill){
			dispatch({
				type: 'supplierBillsSpace/clearBill',
				payload: {
					bill
				}
			});
		}
	};

	const onSearch = (fieldValues)=>{
		dispatch({
			type:'supplierBillsSpace/query',
			payload:{...fieldValues, page:1}
		});
	};

	const clearModalProps = {
		visible,
		currentItem,
		onConfirm(values){
			dispatch({
				type: `supplierBillsSpace/${editorType=='clearStorage'? 'doClearStorage':'doClearBill'}`,
				payload: {
					...values
				}
			});
		},
		onCancel(){
			dispatch({
				type: 'supplierBillsSpace/hideEditor'
			});
		},
	};

	const ClearDebtStorageModalGen = ()=><ClearDebtStorageModal {...clearModalProps}/>;

	const ClearSupplierBillsModalGen = ()=><ClearSupplierBillsModal {...clearModalProps}/>;

	return (
		<div className={supplierBillsClass}>
			<BreadcrumbList breadcrumbItems={breadcrumbItems} />
			<div className={search}>
				<SupplierBillsSearchForm onSearch={onSearch} suppliers={suppliers}/>
			</div>
			<div className={debtStorageListContainer}>
				<DebtStorageList {...debtStorageListProps} />
			</div>
			<div className={supplierBillsListContainer}>
				<SupplierBillsList {...supplierBillsListProps}/>
			</div>
			{
				editorType=='clearStorage'?
					<ClearDebtStorageModalGen />:
					<ClearSupplierBillsModalGen />
			}
		</div>
	);
}

class SupplierBills extends Component {
    constructor(props){
        super(props);
    }

	componentWillMount(){
		let {isLogin} = this.props.systemUser;
		return !isLogin && redirect();
	}

    render(){
		let {isLogin} = this.props.systemUser;
		return isLogin && genSupplierBills(this.props);
    }
}

SupplierBills.propTypes = {
    storage:PropTypes.object,
};

function mapStateToProps({supplierBillsSpace, systemUser}) {
    return {supplierBillsSpace, systemUser};
}


export default connect(mapStateToProps)(SupplierBills);