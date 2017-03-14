import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SettlementSearchForm from '../../components/Settlement/SettlementSearchForm/SettlementSearchForm';
import SettlementList from '../../components/Settlement/SettlementList/SettlementList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
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
		breadcrumbItems,
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
		}
	};

	const onSearch = (fieldValues)=>{
		dispatch({
			type:'settlement/query',
			payload:{...fieldValues, page:1}
		});
	};

	return (
		<div className={settlementClass}>
			<BreadcrumbList breadcrumbItems={breadcrumbItems} />
			<div className={settlementContainer}>
				<SearchBar>
					<SettlementSearchForm onSearch={onSearch} users={[]}/>
				</SearchBar>
				<SettlementList {...settlementListProps} />
			</div>
		</div>
	);
}

class Settlement extends Component {
    constructor(props){
        super(props);
    }

	componentWillMount(){
		let {isLogin} = this.props.systemUser;
		return !isLogin && redirect();
	}

    render(){
		let {isLogin} = this.props.systemUser;
		return isLogin && genSettlement(this.props);
    }
}

Settlement.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({settlement, systemUser}) {
    return {settlement, systemUser};
}


export default connect(mapStateToProps)(Settlement);