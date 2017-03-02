import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import SupplierList from '../../components/Suppliers/SupplierList/SupplierList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import AddSupplier from '../../components/Suppliers/AddSupplier/AddSupplier';
import ModifySupplier from '../../components/Suppliers/AddSupplier/AddSupplier';
import {redirect} from '../../utils/webSessionUtils';
import {supplierClass, supplierContainer, addSupplierContainer, modifySupplierContainer} from './index.css';

function genSuppliers({dispatch, suppliers}) {
    const {
        list,
        total,
        field,
        keyword,
        loading,
        current,
        currentItem,
        editorVisible,
        editorType,
        breadcrumbItems
    } = suppliers;

    const supplierListProps = {
        current,
        total,
        dataSource: list,
        loading,
        onPageChange(page){
            dispatch(routerRedux.push({
                pathname: '/suppliers',
                query: {field, keyword, page}
            }));
        },
        onModify(supplier){
            dispatch({
                type: 'suppliers/showEditor',
                payload: {
                    currentItem: supplier,
                    editorType: 'modify'
                }
            });
        },
        onDel(supplierId){
            dispatch({
                type: 'suppliers/del',
                payload: supplierId,
            });
        }
    };
    const supplierEditor = {
        supplier: editorType == 'create' ? {} : currentItem,
        type: editorType,
        visible: editorVisible,
        onConfirm(data){
            dispatch({
                type: `suppliers/${editorType}`,
                payload: data,
            });
        },
        onCancel(){
            dispatch({
                type: 'suppliers/hideEditor'
            });
        }
    };

    const onSearch = (fieldValues)=> {
        dispatch(routerRedux.push({
            pathname: '/supplier',
            query: {...fieldValues, page: 1}
        }));
    };

    const onAdd = ()=> {
        dispatch({
            type: 'suppliers/showEditor'
        });
    };

    return (
        <div className={supplierClass}>
            <BreadcrumbList breadcrumbItems={breadcrumbItems}/>
            {
                editorVisible ?
                    (
                        editorType == 'create' ?
                            (
                                <div className={addSupplierContainer}>
                                    <AddSupplier {...supplierEditor}/>
                                </div>
                            ) :
                            (
                                <div className={modifySupplierContainer}>
                                    <ModifySupplier {...supplierEditor}/>
                                </div>
                            )
                    ) :
                    (
                        <div className={supplierContainer}>
                            <SearchBar onAdd={onAdd}>
                            </SearchBar>
                            <SupplierList {...supplierListProps} />
                        </div>
                    )
            }

        </div>
    );
}

class Suppliers extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let {isLogin} = this.props.systemUser;
        if (!isLogin) {
            redirect();
        }
    }

    render() {
        return genSuppliers(this.props);
    }
}

Suppliers.propTypes = {
    Suppliers: PropTypes.object,
};

function mapStateToProps({suppliers, systemUser}) {
    return {suppliers, systemUser};
}

export default connect(mapStateToProps)(Suppliers);
