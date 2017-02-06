import React, {Component} from 'react';
import {browserHistory} from 'dva/router';
import {connect} from 'dva';
import LoginModal from '../LoginModal/LoginModal';
import {systemInfo, systemName, userName, loginButton} from './index.css';

const SystemInfo = ({systemUser, dispatch})=> {
    const {isLogin, username, modalVisible} = systemUser;

    const logClick = ()=> {
        dispatch({
            type: isLogin ? 'systemUser/logout' : 'systemUser/login'
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

    const LoginModalGen = ()=>(<LoginModal {...loginModalProps}/>);

    return (
        <div className={systemInfo}>
            <span className={systemName}>铭帝系统门窗管理系统</span>
            <span>
                <span className={userName}>{isLogin ? `欢迎您，${username}` : '请登录'}</span>
                <span className={loginButton} onClick={logClick}>{isLogin ? "退出" : "登录"}</span>
            </span>
            <LoginModalGen />
        </div>
    );
};

function mapStateToProps({systemUser}) {
    return {systemUser};
}

export default connect(mapStateToProps)(SystemInfo);