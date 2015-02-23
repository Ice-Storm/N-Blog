var async = require('async');
var util = require('../util/util.js');
var db = require('../db/db.js');


var dealGet = function (req, res) {
	var urlInfo = util.urlparse(req.url);
	async.waterfall([
		function (cb) {
			var par = {
				table: 'Nblog_artical',
				field: ['id', 'title', 'author', 'sort', 'flag', 'time'],
				condition: {
					1: 1,
					limit: 10,
					skip: urlInfo.page - 1
				},
				close: 'true'
			}

			cb(null, par);

		}, function (n, cb) {
			db.getData(n, cb);
		}
	], function (e, r) {
		for (i = 0; i < r.length; i++) {
			r[i].time = r[i].time.toString().split(' ')[3] + '--' + r[i].time.toString().split(' ')[4];
		}

		res.render('adminArt', {
			info: r,
			adminBase: 'adminBase',
			css: 'adminIndex.adminArt'
		});
	})
}


module.exports.dealGet= dealGet;