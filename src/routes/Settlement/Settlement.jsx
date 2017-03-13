import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SettlementSearchForm from '../../components/Settlement/SettlementSearchForm/SettlementSearchForm';
import SettlementList from '../../components/Settlement/SettlementList/SettlementList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import AddSettlement from '../../components/Settlement/AddSettlement/AddSettlement';
import ModifySettlement from '../../components/Settlement/ModifySettlement/ModifySettlement';
import {redirect} from '../../utils/webSessionUtils';
import {settlementClass, settlementContainer, addSettlementContainer, modifySettlementContainer} from './index.css';

function genSettlement({dispatch, settlement}){
    const {
        list,
        total,
		timeRange,
        supplierId,
        noteNumber,
        loading,
        current,
        currentItem,
        editorVisible,
        editorType,
		breadcrumbItems,
		suppliers
    } = settlement;

	const settlementListProps ={
		current,
		total,
		dataSource: list,
		loading,
		onPageChange(page){
			dispatch({
				type:'settlement/query',
				payload: {timeRange, supplierId, noteNumber, page}
			});
		},
		onModify(settlementId){
			dispatch({
				type:'settlement/querySettlementById',
				payload: {
					settlementId: settlementId,
					editorType: 'modify'
				}
			});
		},
		onReadOnly(settlementId){
			dispatch({
				type:'settlement/querySettlementById',
				payload: {
					settlementId: settlementId,
					editorType: 'detail'
				}
			});
		},
		onDel(settlementId){
			dispatch({
				type:'settlement/del',
				payload: settlementId,
			});
		}
	};
	const settlementEditor = {
		item: editorType=='create'? {}:currentItem,
		type: editorType,
		visible: editorVisible,
		onConfirm(data){
			dispatch({
				type: `settlement/${editorType}`,
				payload: data,
			});
		},
		onCancel(){
			dispatch({
				type:'settlement/hideEditor'
			});
		}
	};

	const onSearch = (fieldValues)=>{
		dispatch({
			type:'settlement/query',
			payload:{...fieldValues, page:1}
		});
	};

	const onAdd = ()=>{
		dispatch({
			type:'settlement/getNoteNumber'
		});
	};

	return (
		<div className={settlementClass}>
			<BreadcrumbList breadcrumbItems={breadcrumbItems} />
			{
				editorVisible?
					(
						editorType=='create'?
							(
								<div className={addSettlementContainer}>
									<AddSettlement />
								</div>
							):
							(
								<div className={modifySettlementContainer}>
									<ModifySettlement editorType={editorType}/>
								</div>
							)
					):
					(
						<div className={settlementContainer}>
							<SearchBar onAdd={onAdd}>
								<SettlementSearchForm onSearch={onSearch} suppliers={suppliers}/>
							</SearchBar>
							<SettlementList {...settlementListProps} />
						</div>
					)
			}

		</div>
	);
}

class Settlement extends Component {
    constructor(props){
        super(props);
    }

    render(){
		let {isLogin} = this.props.systemUser;
		return isLogin? genSettlement(this.props): redirect();
    }
}

Settlement.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({settlement, systemUser}) {
    return {settlement, systemUser};
}


export default connect(mapStateToProps)(Settlement);