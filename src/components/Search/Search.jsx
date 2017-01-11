import React, {Component} from 'react';
import {Button} from 'antd';
import {search, addButton} from './index.css';

const Search = ({onAdd, children}) => {
    return (
        <div className={search}>
            {children}
            <div className={addButton}>
                <Button type="ghost" onClick={onAdd}>添加</Button>
            </div>
        </div>
    );
};

export default Search;