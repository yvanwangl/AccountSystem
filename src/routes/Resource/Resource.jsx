import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import ResourceSearchForm from '../../components/Resource/ResourceSearchForm/ResourceSearchForm';
import Stock from '../Stock/Stock';
import Funds from '../Funds/Funds';
import {Button} from 'antd';
import {redirect} from '../../utils/webSessionUtils';
import styles from './index.css';

function genResource({dispatch, resource}) {

	const {
		breadcrumbItems,
		products,
		stocks,
		funds,
		loading
	} = resource;

	const onSearch = (fieldValues) => {
		dispatch({
			type: 'resource/query',
			payload: fieldValues
		});
	};

	const onSettlement = ()=>{
		dispatch({
			type: 'resource/onSettlement'
		});
	};

	return (
		<div>
			<BreadcrumbList breadcrumbItems={breadcrumbItems} />
			<div className={styles.search}>
				<ResourceSearchForm onSearch={onSearch} products={products}/>
				<div className={styles.settlementButton}>
					<Button type="primary" onClick={onSettlement}>结算</Button>
				</div>
			</div>
			<Stock stocks={stocks} loading={loading}/>
			<Funds funds={funds} loading={loading}/>
		</div>
	);
}
class Resource extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount(){
		let {isLogin} = this.props.systemUser;
		return !isLogin && redirect();
	}

	render() {
		let {isLogin} = this.props.systemUser;
		return isLogin && genResource(this.props);
	}
}

function mapStateToProps({resource, stocks, funds,  systemUser}) {
	return {resource, systemUser};
}

export default connect(mapStateToProps)(Resource);