import React, {Component} from 'react';
import {browserHistory} from 'dva/router';
import {connect} from 'dva';
import LoginModal from '../LoginModal/LoginModal';
import LogupModal from '../LogupModal/LogupModal';
import {systemInfo, systemName, userName, loginButton, logupButton} from './index.css';

const SystemInfo = ({systemUser, dispatch}) => {
	const {isLogin, username, modalVisible, logupModalVisible} = systemUser;

	const loginClick = () => {
		dispatch({
			type: isLogin ? 'systemUser/logout' : 'systemUser/login'
		});
		browserHistory.push('/');
	};

	const logupClick = () => {
		dispatch({
			type: 'systemUser/logup',
		});
		browserHistory.push('/');
	};

	const loginModalProps = {
		visible: modalVisible,
		onConfirm(userData){
			dispatch({
				type: 'systemUser/doLogin',
				payload: userData
			});
		},
		onCancel(){
			dispatch({
				type: 'systemUser/hideModal'
			});
		}
	};

	const logupModalProps = {
		visible: logupModalVisible,
		onConfirm(userData){
			dispatch({
				type: 'systemUser/doLogup',
				payload: userData
			});
		},
		onCancel(){
			dispatch({
				type: 'systemUser/hideLogupModal'
			});
		}
	};

	const LoginModalGen = () => (<LoginModal {...loginModalProps}/>);
	const LogupModalGen = () => (<LogupModal {...logupModalProps}/>);

	return (
		<div className={systemInfo}>
			<span className={systemName}>铭帝系统门窗管理系统</span>
			<span>
                <span className={userName}>{isLogin ? `欢迎您，${username}` : ''}</span>
                <span className={loginButton} onClick={loginClick}>{isLogin ? "退出" : "登录"}</span>
				<span className={logupButton} onClick={logupClick}>{isLogin ? '' : '注册'}</span>
            </span>
			<LoginModalGen />
			<LogupModalGen />
		</div>
	);
};

function mapStateToProps({systemUser}) {
	return {systemUser};
}

export default connect(mapStateToProps)(SystemInfo);