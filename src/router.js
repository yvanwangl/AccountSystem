import React, {PropTypes} from 'react';
import {Router, Route, IndexRoute, Link} from 'dva/router';
import HomePage from './routes/HomePage/HomePage';
import IndexPage from './routes/IndexPage/IndexPage';
import Orders from './routes/Orders/Orders';

export default function ({history}) {
    return (
        <Router history={history}>
            <Route path="/" component={HomePage}>
                <IndexRoute component={IndexPage}/>
                <Route path="/orders" component={Orders}/>
            </Route>
        </Router>
    );
};
