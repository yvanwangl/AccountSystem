import React, {PropTypes} from 'react';
import {Router, Route, IndexRoute, Link} from 'dva/router';
import HomePage from './routes/HomePage/HomePage';
import IndexPage from './routes/IndexPage/IndexPage';
import Orders from './routes/Orders/Orders';
import Storage from './routes/Storage/Storage';
import Stock from './routes/Stock/Stock';
import Funds from './routes/Funds/Funds';
import Resource from './routes/Resource/Resource';
import Settlement from './routes/Settlement/Settlement';
import Manage from './routes/Manage/Manage';
import Customers from './routes/Customers/Customers';
import Products from './routes/Products/Products';
import Suppliers from './routes/Suppliers/Suppliers';

export default function ({history}) {
    return (
        <Router history={history}>
            <Route path="/" component={HomePage}>
                <IndexRoute component={IndexPage}/>

                <Route path="/orders" component={Orders}>
                    <Route path="/orders/*" component={Orders}/>
                </Route>

                <Route path="/storage" component={Storage}/>

               {/* <Route path="/stock" component={Stock}/>

                <Route path="/funds" component={Funds}/>*/}

                <Route path="/resource" component={Resource}/>

				<Route path="/settlement" component={Settlement}/>

                <Route path="/manage" component={Manage}/>

                <Route component={Manage}>
                    <Route path="/customer" component={Customers}/>
                    <Route path="/product" component={Products}/>
                    <Route path="/supplier" component={Suppliers}/>
                </Route>

            </Route>
        </Router>
    );
};
