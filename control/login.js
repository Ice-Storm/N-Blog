var async = require('async');
var util = require('../util/util.js');
var db = require('../db/db.js');
var middlewares = require('../middlewares/auth.js');

var dataObj = {
	seluserObj: {
		table: 'nblog_admin',
		field: ['user', 'password'],
		condition: {
			// user
			// password
		},
		close: 'true'
	}
}

var dealGet = function (req, res, next) {
	res.render('login', {
		info: ''
	});
}


var dealPost = function (req, res, next) {

	// 多次错误登录锁账号 未完成

	
	dataObj.seluserObj.condition.user = req.body.username;
	dataObj.seluserObj.condition.password = req.body.password;

	db.getData(dataObj.seluserObj, function (err, data) {
		if (data.length) {
			
			//访问控制

			req.session.user = data[0].user;


			req.session.isAdmin = true;
			
			res.redirect('/admin/adminIndex/dealRightMenuList/man/1/');
		} else {
			res.render('login', {
				info: '账号或密码错误'
			})
		};
	})

}

module.exports.dealGet = dealGet;

module.exports.dealPost = dealPost;