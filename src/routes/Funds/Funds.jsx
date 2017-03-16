import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import FundsSearchForm from '../../components/Funds/FundsSearchForm/FundsSearchForm';
import FundsList from '../../components/Funds/FundsList/FundsList';
import {redirect} from '../../utils/webSessionUtils';
import styles from './index.css';

function genFunds({dispatch, funds, loading}) {
	/*const {
		list,
		field,
		keyword,
		loading
	} = funds;

	const fundsSearch = {
		field,
		keyword,
		onSearch(fieldValues){
			dispatch(routerRedux.push({
				pathname: '/funds',
				query: {...fieldValues, page: 1}
			}));
		}
	};*/
	const fundsList = {
		dataSource: funds,
		loading
	};
	return (
		<div className={styles.fundsContainer}>
			<h2 className={styles.fundsTitle}>资金明细表</h2>
			{/*<FundsSearchForm {...fundsSearch}/>*/}
			<FundsList {...fundsList} />
		</div>
	);
}
class Funds extends Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
		stocks: PropTypes.array,
	};

	render() {
		return genFunds(this.props);
	}
}

export default Funds;