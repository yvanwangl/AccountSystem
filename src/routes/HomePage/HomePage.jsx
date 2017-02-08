import React, {Component} from 'react';
import Header from '../../components/Header/Header';
import {connect} from 'dva';
import SystemInfo from '../../components/SystemInfo/SystemInfo';
import {homePage, container} from './index.css';

const HomePage = ({children, home})=> {
    const {activeIndex} = home;
    const height = window.innerHeight - 64;
    return (
        <div className={homePage}>
            <Header activeIndex={activeIndex}/>
            <SystemInfo/>
            <div className={container} style={{height}}>
                {children}
            </div>
        </div>
    );
};

function mapStateToProps({home}) {
    return {home};
}

export default connect(mapStateToProps)(HomePage);