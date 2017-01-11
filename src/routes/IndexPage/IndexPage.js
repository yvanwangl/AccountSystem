import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {normal, title, welcome, list} from './index.css';

function IndexPage() {
    return (
        <div className={normal}>
            <h1 className={title}>Yay! Welcome to dva!</h1>
            <div className={welcome}/>
            <ul className={list}>
                <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
                <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md" target="_blank">Getting
                    Started</a></li>
            </ul>
        </div>
    );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
