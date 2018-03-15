import React, {Component} from 'react';
import { Button, Avatar, Modal } from 'antd';
import {browserHistory} from 'dva/router';
import {connect} from 'dva';
import LoginModal from '../LoginModal/LoginModal';
import LogupModal from '../LogupModal/LogupModal';
import {register} from '../../../system.config.js';
import {systemInfo, systemName, userInfo, userName, loginButton, logupButton} from './index.css';

const SystemInfo = ({systemUser, dispatch}) => {
	const {isLogin, username, modalVisible, logupModalVisible} = systemUser;

	const loginClick = () => {
		dispatch({
			type: isLogin ? 'systemUser/doLogout' : 'systemUser/login'
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
			new Promise(function(resolve, reject){
				dispatch({
					type: 'systemUser/doLogin',
					payload: {
						userData,
						resolve,
						reject
					}
				});
			}).then(null, (data)=>{
				Modal.error({
					title: '错误提示',
					content: <p style={{fontSize: 14}}>用户名 或 密码 错误！</p>
				});
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
			new Promise(function(resolve, reject){
				dispatch({
					type: 'systemUser/doLogup',
					payload: {
						userData,
						resolve,
						reject
					}
				});
			}).then(null, (data)=> {
				//code 为 3 表示用户名已被注册
				if(!data.success && data.code == 3){
					Modal.error({
						title: '错误提示',
						content: <p style={{fontSize: 14}}>该用户名已被注册！</p>
					});
				}
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
			<span className={userInfo}>
                <span className={userName}>
                    {
                        isLogin ? 
                        <span><Avatar style={{marginRight: '4px'}} size="small" icon="user" /> {username} </span> : null
                    }
                </span>
                <Button type="primary" className={loginButton} onClick={loginClick}>{isLogin ? "退出" : "登录"}</Button>
				{
					register && !isLogin ?
						<Button className={logupButton} onClick={logupClick}>{isLogin ? '' : '注册'}</Button>:
						null
				}	
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