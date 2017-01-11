import React, {Component} from 'react';
import Header from '../../components/Header/Header';
import {homePage} from './index.css';

const HomePage = ({children})=>{
    return (
        <div className={homePage}>
            <Header/>
            {children}
        </div>
    );
};

export default HomePage;