import React, {Component} from 'react';
import {Link} from 'dva/router';
import {activeLink, link} from './index.css';

const NavLink = ({target, linkText})=>(
    <Link to={target} className={link}>{linkText}</Link>
);

export default NavLink;