import React, {Component} from 'react';
import Header from '../../components/Header/Header';
import SystemInfo from '../../components/SystemInfo/SystemInfo';
import {homePage,container} from './index.css';

const HomePage = ({children})=>{
    return (
        <div className={homePage}>
            <Header/>
            <SystemInfo/>
            <div className={container}>
                {children}
            </div>
        </div>
    );
};

export default HomePage;