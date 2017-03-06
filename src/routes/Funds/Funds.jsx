import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import FundsSearchForm from '../../components/Funds/FundsSearchForm/FundsSearchForm';
import FundsList from '../../components/Funds/FundsList/FundsList';
import {redirect} from '../../utils/webSessionUtils';
import styles from './index.css';

function genFunds({dispatch, funds}) {
	const {
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
	};
	const fundsList = {
		dataSource: list,
		loading
	};
	return (
		<div className={styles.fundsContainer}>
			<h2 className={styles.fundsTitle}>资金明细表</h2>
			<FundsSearchForm {...fundsSearch}/>
			<FundsList {...fundsList} />
		</div>
	);
}
class Funds extends Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
		funds: PropTypes.object,
	};

	componentWillMount() {
		let {isLogin} = this.props.systemUser;
		if (!isLogin) {
			redirect();
		}
	}

	render() {
		return genFunds(this.props);
	}
}

function mapStateToProps({funds, systemUser}) {
	return {funds, systemUser};
}

export default connect(mapStateToProps)(Funds);