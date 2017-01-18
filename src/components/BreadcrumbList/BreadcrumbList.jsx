import React, {Component} from 'react';
import {Breadcrumb } from 'antd';
import NavLink from '../NavLink/NavLink';
import {breadcrumb} from './index.css';

const BreadcrumbItem = Breadcrumb.Item;

export default class BreadcrumbList extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let {beadcrumbItems} = this.props;
        return (
            <div className={breadcrumb}>
                <Breadcrumb>
                    {
                        beadcrumbItems.map(([target, linkText], index)=>{
                            return (
                                <BreadcrumbItem key={index}>
                                    <NavLink target={target} linkText={linkText} />
                                </BreadcrumbItem>
                            );
                        })
                    }
                </Breadcrumb>
            </div>
        );
    }

}