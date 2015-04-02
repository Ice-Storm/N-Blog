var async = require('async');
var util = require('../common/util');
var db = require('../db/db.js');

var dataObj = {
	selConfigObj: {
		table: 'nblog_config',
		condition: {
			all: '*'
		},
		close: 'true'
	},

	selMenuObj: {
		table: 'nblog_menu',
		field: ['menu_name'],
		close: 'true'
	},

	selPubArticalObj: {
		table: 'nblog_artical',
		field: ['title'],
		condition: {
			1:1,
			skip: 1,
			limit: 7,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'	
	},

	selWords: {
		table: 'nblog_words',
		field: ['content'],
		condition: {
			id: 1
		},
		close: 'true'	
	},

	selPersonInfo: {
		table: 'nblog_admin',
		field: ['email', 'qq'],
		condition: {
			id: 1
		},
		close: 'true'	
	}
}

var dealGet = function (req, res) {
	async.auto({
		config: function (cb) {
			db.getData(dataObj.selConfigObj, cb);
		},
		menu: function (cb) {
			db.getData(dataObj.selMenuObj, cb);
		},
		pubArtical: function (cb) {
			db.getData(dataObj.selPubArticalObj, cb);	
		},
		words: function (cb) {
			db.getData(dataObj.selWords, cb);
		},
		personInfo: function (cb) {
			db.getData(dataObj.selPersonInfo, cb);
		}
	}, function (err, result) {
		console.log(result);
		res.render('whoAmI', {
			data: result
		});
	})
}


module.exports.dealGet= dealGet;