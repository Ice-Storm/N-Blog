var express = require('express');

var path = require('path');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var session = require('express-session');

var logger = require('morgan');

var route = require('./route/routes.js');

var config = require('./config.default.js');

var middlewares = require('./middlewares/auth.js');


/*
 * config
 */
 
 var app = express();
 
 app.set('views', path.join(__dirname, 'views'));
 
 app.set('view engine', 'ejs');
 
 app.use(logger('dev'));
 
 app.use(bodyParser());
 
 app.use(cookieParser());
 
 app.use(session({
	secret: config.sessionSecret
 }));

// session超时登出

 app.use(middlewares.freshSession)
 
 app.use(express.static(path.join(__dirname, 'public')));

/*app.use(function (req, res, next) {
	//req.session.cookie._expires = 1000;
	req.session.test = 'test';
	res.cookie('name', {iteams:{a: 'hh',b : 's', c: 'ds'}}, {maxAge: 1111111});
	res.cookie('n', '<script>alert(1)</script>', {maxAge: 1111111});
	console.log(req.session)
	console.log(req.cookies.name.iteams);
	next();
})*/

//app.use(auth.authAdmin);

 
 var router = express.Router();
 
 app.use('/', router);

 route(router)

 module.exports.app = app;

 app.listen(config.listenerPort);