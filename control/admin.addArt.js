var db = require('../db/db.js');

var path = require('path');

var fs = require('fs');

var URL = require('url');

var formidable = require('formidable');

var dealGet = function (req, res) {
	res.render('adminAddArt', {
		css: 'adminIndex.adminAddArt'
	})
}

var dealPost = function (req, res) {
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
		}
		console.log(URL.parse(req.url))
		fs.rename(files.imgFile.path, uploadPath + imgName + '.' + extname, function (err) {
			res.json({error: 0, message: 'ok', url: '/uploadImg/' + imgName + '.' + extname})
		})

	})
}

module.exports.dealGet = dealGet;

module.exports.dealPost = dealPost;