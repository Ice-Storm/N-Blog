var db = require('../db/db.js');

var path = require('path');

var fs = require('fs');

var URL = require('url');

var formidable = require('formidable');

var db = require('../db/db.js');

var async = require('async');

var dealGet = function (req, res) {
	req.session.articalID = new Date().getTime();

	res.render('adminAddArt', {
		css: 'adminIndex.adminAddArt'
	})
}

var dealPost = function (req, res) {

	var param = URL.parse(req.url, true).query.dir;


	if (param == 'image') {
		var form = new formidable.IncomingForm();

		form.keepExtensions = true;

		var imgName = new Date().getTime();

		form.maxFieldsSize = 2 * 1024 * 1024;   

		var uploadPath = path.join(__dirname, '../public/uploadImg/');

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
				case 'application/octet-stream':
					extname = files.imgFile.name.split('.')[1];
					break;
			}

			async.waterfall([
				function (cb) {
					fs.rename(files.imgFile.path, uploadPath + imgName + '.' + extname, cb(err, 1));
				},
				function (n, cb) {
					var insertObj = {
						table: 'Nblog_img',
						id: null,
						img_name: imgName + '.' + extname,
						foreign_p: req.session.articalID,
						close: 'true'
					}
					db.insert(insertObj, cb(err, 1));
				},
				function (n, cb) {
					var sql = 'select img_name from Nblog_img where foreign_p not in ( select foreign_p from Nblog_img where exists (select * from Nblog_artical where Nblog_img.foreign_p = Nblog_artical.img_p))';
					db.selectAuto(sql, function (err, data) {

						async.each(data, function (i, callback) {
							fs.unlink(uploadPath + i.img_name, callback(err, i))
						}, function (err) {
							cb(err, 'OK')
						});
						
					});
				}
			], function (err, result) {
				if (err) throw err;
				res.json({error: 0, message: 'ok', url: '/uploadImg/' + imgName + '.' + extname});
			})
		})
	} else {	
		var insertObj = {
			table: 'Nblog_artical',
			id: null,
			title: req.body.title,
			content: req.body.content,
			img_p: req.session.articalID,
			close: 'true'
		}

		db.insert(insertObj, function () {
			res.redirect('/admin/adminIndex/dealRightMenuList/art/1/');
		})
	}

	
}

module.exports.dealGet = dealGet;

module.exports.dealPost = dealPost;