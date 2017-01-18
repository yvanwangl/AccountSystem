import React, {Component} from 'react';
import {spliter} from './index.css';

const Spliter = ({spliterText})=>(
    <span className={spliter}>{spliterText}</span>
);

export default Spliter;