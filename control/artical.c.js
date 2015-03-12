var util = require('../util/util.js');
var async = require('async');
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

	selArticalObj: {
		table: 'nblog_artical',
		field: ['title', 'content', 'author', 'time', 'com_p'],
		condition: {
			//title:  动态添加
		},
		close: 'true'	
	},

	selPubArticalObj: {
		table: 'nblog_artical',
		field: ['id', 'title'],
		condition: {
			1:1,
			skip: 1,
			limit: 5,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'	
	},

	selCommObj: {
		table: 'nblog_comment',
		field: ['id', 'content', 'author', 'time', 'replay_p'],
		condition: {
			// foreign_p 动态添加
		},
		close: 'true'
	},

	selReplayObj: {
		table: 'nblog_comment',
		field: ['id', 'content', 'author', 'time', 'replay_p'],
		condition: {
			// foreign_p 动态添加
		},
		close: 'true'
	}

}

var articalGet = function (req, res) {
	var infoUrl = util.urlparse(req.path);
	console.log(infoUrl)

	async.auto({
		config: function (cb) {
			db.getData(dataObj.selConfigObj, cb);
		},
		menu: function (cb) {
			db.getData(dataObj.selMenuObj, cb);
		},
		artical: function (cb) {
			dataObj.selArticalObj.condition.title = infoUrl.articalName;
			db.getData(dataObj.selArticalObj, cb);	
		},
		pubArtical: function (cb) {
			db.getData(dataObj.selPubArticalObj, cb);	
		},
		comment: ['artical', function (cb, result) {
			dataObj.selCommObj.condition.foreign_p = result.artical[0].com_p;
			db.getData(dataObj.selCommObj, cb);
		}]/*,
		commentReplay: ['comment', function (cb, result) {
			if (result.comment[0].replay_p) {
			循环查找
			}
		}]*/
	}, function (err, result) {
		console.log(result);
	})

	res.render('artical');
}

var articalPost = function (req,res) {
	console.log(req.body);
	res.redirect(req.url);
}

module.exports.articalGet = articalGet;

module.exports.articalPost = articalPost;