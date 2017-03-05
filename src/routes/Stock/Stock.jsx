import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import StockSearchForm from '../../components/Stocks/StockSearchForm/StockSearchForm';
import SearchForm from '../../components/SearchForm/SearchForm';
import {redirect} from '../../utils/webSessionUtils';
require('./index.css');

function genStock({dispatch, stocks}) {
	const {
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
	};
	const stockList = {
		dataSource: list,
		loading
	};
	return (
		<div className='stocks'>
			<h2>仓库明细表</h2>
			<SearchForm {...stockSearch}/>
		</div>
	);
}
class Stock extends Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
		stocks: PropTypes.object,
	}

	componentWillMount() {
		let {isLogin} = this.props.systemUser;
		if (!isLogin) {
			redirect();
		}
	}

	render() {
		return (
			<div>
				{
					genStock(this.props)
				}
			</div>
		);
	}
}

function mapStateToProps({stocks, systemUser}) {
	return {stocks, systemUser};
}

export default connect(mapStateToProps)(Stock);