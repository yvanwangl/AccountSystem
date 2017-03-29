import './index.html';
import './index.less';
import dva from 'dva';
import {browserHistory} from 'dva/router';

// 1. Initialize
const app = dva({
	history: browserHistory
});

// 2. Plugins
//app.use({});

// 3. Model
app.model(require('./models/home'));
app.model(require('./models/orders'));
/*app.model(require('./models/stocks'));*/
app.model(require('./models/storage'));
/*app.model(require('./models/funds'));*/
app.model(require('./models/manage'));
app.model(require('./models/systemUser'));
app.model(require('./models/customers'));
app.model(require('./models/products'));
app.model(require('./models/suppliers'));
app.model(require('./models/settlement'));
app.model(require('./models/resource'));
app.model(require('./models/customerBills'));
app.model(require('./models/supplierBills'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
