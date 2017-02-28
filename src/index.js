import './index.html';
import './index.less';
import dva from 'dva';
import {browserHistory} from 'dva/router';

// 1. Initialize
const app = dva();

// 2. Plugins
//app.use({});

// 3. Model
app.model(require('./models/home'));
app.model(require('./models/orders'));
app.model(require('./models/stocks'));
app.model(require('./models/storages'));
app.model(require('./models/funds'));
app.model(require('./models/manage'));
app.model(require('./models/systemUser'));
app.model(require('./models/customers'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
