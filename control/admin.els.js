var async = require('async');
var util = require('../util/util.js');
var db = require('../db/db.js');


var dealGet = function (req, res) {
	
	res.render('adminEls', {
		adminBase: 'adminBase',
		css: 'adminIndex.adminEls'
	});

}

var dealPost = function (req, res) {

	if (req.body.blogName) {
	

		var arr = [];

		for (i = 1; i <= 3; i++) {
			var menu = {};
			menu.menu_name = req.body['blogMenu' + i];
			menu.table = 'Nblog_menu';
			menu.close = 'true';
			menu.foreign_p = 1;
			menu.condition = {
				id: i
			}
			arr.push(menu);
		}

		async.waterfall([
			function (cb) {

				var updateObj = {
					table: 'Nblog_config',
					blog_name: req.body.blogName,
					blog_sign: req.body.blogSign,
					blog_rights: req.body.blogRight,
					blog_address: req.body.blogAdmin,
					blog_github: req.body.blogGit,
					blog_menu_p: 1,
					blog_function_p: 1,
					close: 'true',
					condition: {
						id: 1
					}
				}

				async.each(arr, function (i, callback){
					db.update(i, callback(null, 1));
				}, function (err) {
					if (err) throw err;
					cb(null, updateObj);
				})
			}, function (n, cb) {
				db.update(n, cb(null, 1));
			}
		], function (err, cb) {
			if (err) throw err;
			res.redirect('/admin/adminIndex/dealRightMenuList/else');
		})
	}
}


module.exports.dealGet= dealGet;

module.exports.dealPost= dealPost;