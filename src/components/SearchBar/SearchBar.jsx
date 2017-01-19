import React, {Component} from 'react';
import {Button} from 'antd';
import {search, addButton} from './index.css';

const SearchBar = ({onAdd, children}) => {

    return (
        <div className={search}>
            {children}
            <div className={addButton}>
                <Button type="primary" onClick={onAdd}>添加</Button>
            </div>
        </div>
    );
};

export default SearchBar;