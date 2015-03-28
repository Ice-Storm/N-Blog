var async = require('async');
var util = require('../util/util.js');
var db = require('../db/db.js');

var dataObj = {
	selAdminInfo: {
		table: 'Nblog_admin',
		field: ['id', 'user', 'password', 'flag', 'ip', 'time'],
		condition: {
			1: 1,
			limit: 10,
		},
		close: 'true'
	}
}


var dealGet = function (req, res) {
	console.log(req.session)

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 
	
	var urlInfo = util.urlparse(req.url);
	async.waterfall([
		function (cb) {
			dataObj.selAdminInfo.condition.skip = urlInfo.page - 1;
			cb(null, dataObj.selAdminInfo);
		}, function (n, cb) {
			db.getData(n, cb);
		}
	], function (e, r) {
		for (i = 0; i < r.length; i++) {
			r[i].time = r[i].time.toString().split(' ')[3] + '--' + r[i].time.toString().split(' ')[4];
		}

		res.render('adminMan', {
			info: r,
			adminBase: 'adminBase',
			css: 'adminIndex.adminMan'
		});
	})
}


module.exports.dealGet= dealGet;