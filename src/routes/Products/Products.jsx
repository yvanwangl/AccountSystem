import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/Orders/OrderSearchForm/OrderSearchForm';
import ProductList from '../../components/products/ProductList/ProductList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import Product from '../../components/products/AddProduct/AddProduct';
import {redirect} from '../../utils/webSessionUtils';
import {productClass, productContainer, addProductContainer, modifyProductContainer} from './index.css';

function genProducts({dispatch, products}) {
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
    } = products;

    const productListProps = {
        current,
        total,
        dataSource: list,
        loading,
        onPageChange(page){
            dispatch(routerRedux.push({
                pathname: '/products',
                query: {field, keyword, page}
            }));
        },
        onModify(product){
            dispatch({
                type: 'products/showEditor',
                payload: {
                    currentItem: product,
                    editorType: 'modify'
                }
            });
        },
        onDel(productId){
            dispatch({
                type: 'products/del',
                payload: productId,
            });
        },
		onDetail(product){
			dispatch({
				type: 'products/showEditor',
				payload: {
					currentItem: product,
					editorType: 'detail'
				}
			});
		}
    };
    const productEditor = {
        product: editorType == 'create' ? {} : currentItem,
		disabled: editorType == 'detail',
        type: editorType,
        visible: editorVisible,
        onConfirm(data){
            dispatch({
                type: `products/${editorType}`,
                payload: data,
            });
        },
        onCancel(){
            dispatch({
                type: 'products/resetProduct'
            });
        }
    };

    const onSearch = (fieldValues)=> {
        dispatch(routerRedux.push({
            pathname: '/product',
            query: {...fieldValues, page: 1}
        }));
    };

    const onAdd = ()=> {
        dispatch({
            type: 'products/showEditor'
        });
    };

    return (
        <div className={productClass}>
            <BreadcrumbList breadcrumbItems={breadcrumbItems}/>
            {
                editorVisible ?
                    (
						<div className={addProductContainer}>
							<Product {...productEditor}/>
						</div>
                    ) :
                    (
                        <div className={productContainer}>
                            <SearchBar onAdd={onAdd}>
                            </SearchBar>
                            <ProductList {...productListProps} />
                        </div>
                    )
            }

        </div>
    );
}

class Products extends Component {
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
        return genProducts(this.props);
    }
}

Products.propTypes = {
    products: PropTypes.object,
};

function mapStateToProps({products, systemUser}) {
    return {products, systemUser};
}

export default connect(mapStateToProps)(Products);
