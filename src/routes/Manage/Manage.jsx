import React, {Component,PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Search} from '../../components/SearchBar/SearchBar';
import {redirect} from '../../utils/webSessionUtils';
require('./index.css');

class Manage extends Component{
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let {isLogin} = this.props.systemUser;
        if(!isLogin){
            redirect();
        }
    }

    render(){
        return (
            <div className='manage'>
                {this.props.children}
            </div>
        );
    }
}

Manage.propTypes = {
    orders:PropTypes.object,
};

function mapStateToProps({systemUser}) {
    return {systemUser};
}

export default connect(mapStateToProps)(Manage);