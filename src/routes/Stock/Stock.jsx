import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import StockSearchForm from '../../components/Stocks/StockSearchForm/StockSearchForm';
import StockList from '../../components/Stocks/StockList/StockList';
import {redirect} from '../../utils/webSessionUtils';
import styles from './index.css';

function genStock({dispatch, stocks, loading}) {
	/*const {
		list,
		field,
		keyword,
		loading
	} = stocks;

	const stockSearch = {
		field,
		keyword,
		onSearch(fieldValues){
			dispatch(routerRedux.push({
				pathname: '/stocks',
				query: {...fieldValues, page: 1}
			}));
		}
	};*/
	const stockList = {
		dataSource: stocks,
		loading
	};
	return (
		<div className={styles.stockContainer}>
			<h2 className={styles.stockTitle}>仓库明细表</h2>
			{/*<StockSearchForm {...stockSearch}/>*/}
			<StockList {...stockList} />
		</div>
	);
}
class Stock extends Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
		stocks: PropTypes.array,
	};

	render() {
		return genStock(this.props);
	}
}

export default Stock;