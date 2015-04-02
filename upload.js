var formidable = require('formidable');
var config = require('../config.default.js');
var deepmerge = require('deepmerge');

/*
	
	params req, obj, cb

	{

		keepExtensions = true,
		maxFieldsSize = 2 * 1024 * 1024,
		uploadPath
		fileName
		uploadFormName
	}

*/
/*var uploadImg = function (req, paramsObj, cb) {
	var form = new formidable.IncomingForm();

	// 默认

	var defaultParam = {

		keepExtensions: true,

		maxFieldsSize: 2 * 1024 * 1024, 

		uploadPath: path.join(__dirname, '../public' + config.uploadFile);

	}

	// 合并

	var params = deepmerge(defaultParam, {
		a: '123',
		keepExtensions: false
	})

	console.log(params)

	uploadDir = uploadPath;

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
		} 
}*/

	var defaultParam = {

		keepExtensions: true,

		maxFieldsSize: 2 * 1024 * 1024, 

		uploadPath: path.join(__dirname, '../public' + config.uploadFile);

	}

	// 合并

	var params = deepmerge(defaultParam, {
		a: '123',
		keepExtensions: false
	})
