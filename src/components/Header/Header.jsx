import React, {Component} from 'react';
import {Menu} from 'antd';
import NavLink from '../NavLink/NavLink';
import {menuList} from './index.css';

const MenuItem = Menu.Item;

const menus = [
    ['index', '/', '首页'],
    ['orders', '/orders', '订单'],
    ['storage', '/storage', '入库'],
    ['stock', '/stock', '仓库'],
    ['manage', '/manage', '管理'],
];
const Header = ()=>{
    return (
        <div className={menuList}>
            <ul>
                {
                    menus.map(([key, path, text],index)=>
                    (
                        <li key={key}>
                            <NavLink target={path} linkText={text}/>
                        </li>)
                    )
                }
            </ul>
        </div>
    );
};

export default Header;