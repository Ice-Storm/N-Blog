var async = require('async');
var fs = require('fs');
var path = require('path');
var util = require('../util/util.js');
var db = require('../db/db.js');


var dealGet = function (req, res) {
	var urlInfo = util.urlparse(req.url);
	var memory = {};
	async.waterfall([
		function (cb) {
			memory = process.memoryUsage();
			cb(null, memory);
		}/*, function (n, cb) {
			console.log(path.join(__dirname,'..'))
			fs.stat(__filename, function (err, stats) {
				console.log(stats)
				//memory.size = stats.size;
				cb(err, memory);
			})
		}*/
	], function (e, r) {
		console.log(r)
		res.render('adminSta', {
			info: r,
			css: 'adminIndex.adminSta'
		});
	})
}


module.exports.dealGet= dealGet;