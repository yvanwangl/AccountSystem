import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import SupplierList from '../../components/Suppliers/SupplierList/SupplierList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import Supplier from '../../components/Suppliers/AddSupplier/AddSupplier';
import {redirect} from '../../utils/webSessionUtils';
import {supplierClass, supplierContainer, addSupplierContainer, modifySupplierContainer} from './index.css';

function genSuppliers({dispatch, suppliers}) {
    const {
        list,
        total,
        supplierName,
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
			dispatch({
				type:'suppliers/query',
				payload: {supplierName, page}
			});
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
        },
		onDetail(supplier){
			dispatch({
				type: 'suppliers/showEditor',
				payload: {
					currentItem: supplier,
					editorType: 'detail'
				}
			});
		}
    };
    const supplierEditor = {
        supplier: editorType == 'create' ? {} : currentItem,
		disabled: editorType == 'detail',
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
                type: 'suppliers/resetSupplier'
            });
        }
    };

	const supplierSearchProps = {
		fieldName: 'supplierName',
		labelName: '供应商名称：',
		onSearch(fieldValues){
			dispatch({
				type:'suppliers/query',
				payload: {...fieldValues, page:1}
			});
		}
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
						<div className={addSupplierContainer}>
							<Supplier {...supplierEditor}/>
						</div>
                    ) :
                    (
                        <div className={supplierContainer}>
                            <SearchBar onAdd={onAdd}>
								<SearchForm {...supplierSearchProps}/>
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

	componentWillMount(){
		let {isLogin} = this.props.systemUser;
		return !isLogin && redirect();
	}

    render() {
		let {isLogin} = this.props.systemUser;
		return isLogin && genSuppliers(this.props);
    }
}

Suppliers.propTypes = {
    Suppliers: PropTypes.object,
};

function mapStateToProps({suppliers, systemUser}) {
    return {suppliers, systemUser};
}

export default connect(mapStateToProps)(Suppliers);
