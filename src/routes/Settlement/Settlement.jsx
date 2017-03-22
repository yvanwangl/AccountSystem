import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SettlementSearchForm from '../../components/Settlement/SettlementSearchForm/SettlementSearchForm';
import SettlementList from '../../components/Settlement/SettlementList/SettlementList';
import ProductList from '../../components/Stocks/StockList/StockList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import {redirect} from '../../utils/webSessionUtils';
import {search, settlementClass, settlementContainer, addSettlementContainer, modifySettlementContainer, productList, productListTitle} from './index.css';

function genSettlement({dispatch, settlement}){
    const {
        list,
        total,
		timeRange,
        loading,
        current,
		breadcrumbItems,
		settlementItems,
		settlementId
    } = settlement;

	const settlementListProps ={
		current,
		total,
		dataSource: list,
		settlementId,
		loading,
		onSettlementSelect(settlementId){
			dispatch({
				type: 'settlement/settlementSelect',
				payload: {
					settlementId
				}
			});
		},
		onPageChange(page){
			dispatch({
				type:'settlement/query',
				payload: {timeRange, page}
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
				<div className={search}>
					<SettlementSearchForm onSearch={onSearch} users={[]}/>
				</div>
				<SettlementList {...settlementListProps} />
			</div>
			<div className={productList}>
				<h2 className={productListTitle}>结算商品明细</h2>
				<ProductList dataSource={settlementItems}/>
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