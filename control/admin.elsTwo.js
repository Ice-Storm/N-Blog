
var async = require('async');
var util = require('../common/util');
var db = require('../db/db.js');
var formidable = require('formidable');
var URL = require('url');
var path = require('path');
var config = require('../config.default.js');
var fs = require('fs');

var dataObj = {
	updateObj : {
		table: 'nblog_config',
		//blog_right_img: imgName + '.' + extname,
		condition: {
			id: 1
		},
		close: true
	}
}


var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 
	var indexData = {};

	res.render('adminElsTwo', {
		adminBase: 'adminBase',
		css: 'adminIndex.adminElsTwo',
		data:　indexData
	});

}

var dealPost = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	var form = new formidable.IncomingForm();

	form.keepExtensions = true;

	form.maxFieldsSize = 2 * 1024 * 1024; 

	var uploadPath = path.join(__dirname, '..' + '/public' + config.uploadFile);

	form.uploadDir = uploadPath;

	form.parse(req, function(err, fields, files) {

		var imgName = '';

		var extname = '';

		if (files.imgFile) {
			imgName = 'index';
			files.imgFile = files.imgFile;
			switch (files.imgFile.type) {
				case 'image/jpeg':
					extname = 'jpg';
					break;
				case 'image/png':
					extname = 'png';
					break;
			}
			dataObj.updateObj.blog_right_img = imgName + '.' + extname;
		} else if (files.imgFileE) {
			imgName = 'artical';
			files.imgFile = files.imgFileE;
			switch (files.imgFile.type) {
				case 'image/jpeg':
					extname = 'jpg';
					break;
				case 'image/png':
					extname = 'png';
					break;
			}
			dataObj.updateObj.blog_artical_img = imgName + '.' + extname;
		}

		

		async.waterfall([
			function (cb) {
				fs.rename(files.imgFile.path, uploadPath + imgName + '.' + extname, cb(err, 1));
			},
			function (n, cb) {
				db.update(dataObj.updateObj, function () {
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