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
import Bills from './routes/Bills/Bills';
import CustomerBills from './routes/CustomerBills/CustomerBills';
import SupplierBills from './routes/SupplierBills/SupplierBills';
import Manage from './routes/Manage/Manage';
import Customers from './routes/Customers/Customers';
import Products from './routes/Products/Products';
import Suppliers from './routes/Suppliers/Suppliers';
import {requireAuth} from './utils/webSessionUtils';

export default function ({history}) {
    return (
        <Router history={history}>
            <Route path="/" component={HomePage}>

                <IndexRoute component={IndexPage}/>

                <Route path="/orders" onEnter={requireAuth} component={Orders}>
                    <Route path="/orders/*" onEnter={requireAuth} component={Orders}/>
                </Route>

                <Route path="/storage" onEnter={requireAuth} component={Storage}/>

               {/* <Route path="/stock" component={Stock}/>

                <Route path="/funds" component={Funds}/>*/}

                <Route path="/resource" onEnter={requireAuth} component={Resource}/>

				<Route path="/settlement" onEnter={requireAuth} component={Settlement}/>

				<Route path="/bills" onEnter={requireAuth} component={Bills}/>
				<Route component={Bills}>
					<Route path="/customerBills" onEnter={requireAuth} component={CustomerBills}/>
					<Route path="/supplierBills" onEnter={requireAuth} component={SupplierBills}/>
				</Route>

                <Route path="/manage" onEnter={requireAuth} component={Manage}/>

                <Route component={Manage}>
                    <Route path="/customer" onEnter={requireAuth} component={Customers}/>
                    <Route path="/product" onEnter={requireAuth} component={Products}/>
                    <Route path="/supplier" onEnter={requireAuth} component={Suppliers}/>
                </Route>

            </Route>
        </Router>
    );
};
