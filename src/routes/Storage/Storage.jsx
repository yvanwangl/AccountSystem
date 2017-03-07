import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchForm from '../../components/SearchForm/SearchForm';
import StorageList from '../../components/Storage/StorageList/StorageList';
import {routerRedux} from 'dva/router';
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList';
import AddStorage from '../../components/Storage/AddStorage/AddStorage';
import ModifyStorage from '../../components/Storage/ModifyStorage/ModifyStorage';
import {redirect} from '../../utils/webSessionUtils';
import {storageClass, storageContainer, addStorageContainer, modifyStorageContainer} from './index.css';

function genStorage({dispatch, storage}){
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
    } = storage;

	const storageListProps ={
		current,
		total,
		dataSource: list,
		loading,
		onPageChange(page){
			dispatch(routerRedux.push({
				pathname:'/storage',
				query: {field, keyword, page}
			}));
		},
		onModify(storageId){
			dispatch({
				type:'storage/queryStorageById',
				payload: {
					storageId: storageId,
					editorType: 'modify'
				}
			});
		},
		onReadOnly(storageId){
			dispatch({
				type:'storage/queryStorageById',
				payload: {
					storageId: storageId,
					editorType: 'detail'
				}
			});
		},
		onDel(storageId){
			dispatch({
				type:'storage/del',
				payload: storageId,
			});
		}
	};
	const storageEditor = {
		item: editorType=='create'? {}:currentItem,
		type: editorType,
		visible: editorVisible,
		onConfirm(data){
			dispatch({
				type: `storage/${editorType}`,
				payload: data,
			});
		},
		onCancel(){
			dispatch({
				type:'storage/hideEditor'
			});
		}
	};

	const onSearch = (fieldValues)=>{
		dispatch(routerRedux.push({
			pathname:'/storage',
			query:{...fieldValues, page:1}
		}));
	};

	const onAdd = ()=>{
		dispatch({
			type:'storage/getNoteNumber'
		});
	};

	return (
		<div className={storageClass}>
			<BreadcrumbList breadcrumbItems={breadcrumbItems} />
			{
				editorVisible?
					(
						editorType=='create'?
							(
								<div className={addStorageContainer}>
									<AddStorage />
								</div>
							):
							(
								<div className={modifyStorageContainer}>
									<ModifyStorage editorType={editorType}/>
								</div>
							)
					):
					(
						<div className={storageContainer}>
							<SearchBar onAdd={onAdd}>
								<SearchForm onSearch={onSearch}/>
							</SearchBar>
							<StorageList {...storageListProps} />
						</div>
					)
			}

		</div>
	);
}

class Storage extends Component {
    constructor(props){
        super(props);
    }

    componentWillMount(){
        let {isLogin} = this.props.systemUser;
        if(!isLogin){
            redirect();
        }
    }

    render(){
        return genStorage(this.props);
    }
}

Storage.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({storage, systemUser}) {
    return {storage, systemUser};
}


export default connect(mapStateToProps)(Storage);