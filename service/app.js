let express = require('express');
let compression = require('compression');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let systemConfig = require('../system.config');
mongoose.connect(systemConfig.mongooseConnect, {useMongoClient: true});

let routes = require('./routes/index');
let users = require('./routes/users');
let login = require('./routes/login');
let auth = require('./routes/auth');
let orders = require('./routes/orders');
let storage = require('./routes/storage');
let customers = require('./routes/customers');
let products = require('./routes/products');
let productStocks = require('./routes/productStocks');
let uploadProductImg = require('./routes/uploadProductImg');
let suppliers = require('./routes/suppliers');
let resource = require('./routes/resource');
let settlement = require('./routes/settlement');
let customerBills = require('./routes/customerBills');
let supplierBills = require('./routes/supplierBills');

let app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

if(app.get('env') === 'development'){
	app.use(function (req, res, next) {

		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', true);

		// Pass to next layer of middleware
		next();
	});
}


/*(function () {

 // Step 1: Create & configure a webpack compiler
 let webpack = require('webpack');
 let webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../webpack.config');
 let compiler = webpack(webpackConfig);

 // Step 2: Attach the dev middleware to the compiler & the server
 app.use(require("webpack-dev-middleware")(compiler, {
 noInfo: true, publicPath: webpackConfig.output.publicPath
 }));

 // Step 3: Attach the hot middleware to the compiler & the server
 app.use(require("webpack-hot-middleware")(compiler, {
 log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
 }));
 })();*/

/*app.use('/', routes);*/
app.use('/api/users', users);
app.use('/api/orders', orders);
app.use('/api/storage', storage);
app.use('/api/customers', customers);
app.use('/api/products', products);
app.use('/api/productStocks', productStocks);
app.use('/api/resource', resource);
app.use('/api/settlement', settlement);
app.use('/api/suppliers', suppliers);
app.use('/api/customerBills', customerBills);
app.use('/api/supplierBills', supplierBills);
app.use('/api/uploadProductImg', uploadProductImg);
app.use('/api/login', login);
app.use('/api/auth', auth);
//确保react-router刷新正确路由
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
