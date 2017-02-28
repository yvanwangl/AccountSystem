import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import NavLink from '../NavLink/NavLink';
import {header, menuList, menuItem, activeItem} from './index.css';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const menus = [
    ['index', '/', '首页','home'],
    ['orders', '/orders', '订单','solution'],
    ['storage', '/storage', '入库','upload'],
    ['stock', '/stock', '仓库', 'folder'],
    ['funds', '/funds', '资金', 'pay-circle-o'],
    ['manage', '/manage', '管理', 'setting'],
];

const manageChildMenus = [
    ['customer', '/customer','客户', 'user'],
    ['product', '/product','商品', 'inbox'],
    ['supplier', '/supplier','供应商', 'team'],
];

export default class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeIndex: 0
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            activeIndex: nextProps.activeIndex
        });
    }

    render(){
        return (
            <div className={header}>
                <Menu
                    defaultSelectedKeys={['index']}
                    mode="inline"
                    theme="dark"
                    className={menuList}
                >
                    {
                        menus.map(([key, path, text, icon],index)=>(
                                key!=='manage'?
                                    (
                                        <MenuItem key={key}>
                                            <NavLink target={path} linkText={<span><Icon type={icon} /><span>{text}</span></span>}/>
                                        </MenuItem>
                                    ):
                                    (
                                        <SubMenu key={key} title={<span><Icon type="setting" /><span>{text}</span></span>}>
                                            {
                                                manageChildMenus.map(([key, path, text, icon], index)=>(
                                                    <MenuItem key={key}>
                                                        <NavLink target={path} linkText={<span><Icon type={icon} /><span>{text}</span></span>}/>
                                                    </MenuItem>
                                                ))
                                            }
                                        </SubMenu>
                                    )
                            )
                        )
                    }
                </Menu>
            </div>
        );
    }

}