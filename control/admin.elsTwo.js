var async = require('async');
var util = require('../util/util.js');
var db = require('../db/db.js');
var formidable = require('formidable');
var URL = require('url');
var path = require('path');
var config = require('../config.default.js');
var fs = require('fs');


var dealGet = function (req, res) {
	var indexData = {};

	res.render('adminElsTwo', {
		adminBase: 'adminBase',
		css: 'adminIndex.adminElsTwo',
		data:　indexData
	});

}

var dealPost = function (req, res) {

	var form = new formidable.IncomingForm();

	form.keepExtensions = true;

	var imgName = 'index';

	form.maxFieldsSize = 2 * 1024 * 1024;   


	var uploadPath = path.join(__dirname, '..' + '/public' + config.uploadFile);

	form.uploadDir = uploadPath;

	form.parse(req, function(err, fields, files) {
		
		var extname = '';

		switch (files.imgFile.type) {
			case 'image/jpeg':
				extname = 'jpg';
				break;
			case 'image/png':
				extname = 'png';
				break;
		}

		async.waterfall([
			function (cb) {
				fs.rename(files.imgFile.path, uploadPath + imgName + '.' + extname, cb(err, 1));
			},
			function (n, cb) {
				var updateObj = {
					table: 'nblog_config',
					blog_right_img: imgName + '.' + extname,
					condition: {
						id: 1
					},
					close: true
				}
				db.update(updateObj, function () {
					res.redirect('/admin/adminIndex/dealRightMenuList/else2')
				});
			}
		], function (err, result) {
			if (err) throw err;
			res.json({error: 0, message: 'ok', url: config.uploadFile + imgName + '.' + extname});
		})
	})
}


module.exports.dealGet= dealGet;

module.exports.dealPost= dealPost;