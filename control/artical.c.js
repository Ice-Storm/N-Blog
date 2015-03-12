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
	},

	insertReplayObj: {
		table: 'nblog_comment',
		/*
		author
		content
		email
		获取当前 time
		*/
		close: 'true'
	},

	selJudgeArticalObj: {
		table: 'nblog_artical',
		field: ['id', 'title'],
		condition: {
			//title = urlinfo.articalName
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
		console.log(result.artical[0].com_p)
		req.session.com_p = result.artical[0].com_p;
		res.render('artical');
		//console.log(result);
	})

	
}

var articalPost = function (req, res) {

	//同一IP提交没加时间限制

	var infoUrl = util.urlparse(req.path);
	async.waterfall([
		function (cb) {
			dataObj.selJudgeArticalObj.condition.title = infoUrl.articalName;
			db.getData(dataObj.selJudgeArticalObj, cb);
		},
		function (data, cb) {
			if (data) {
				dataObj.insertReplayObj.replay_p = data[0].id;
				dataObj.insertReplayObj.foreign_p = req.session.com_p;
				dataObj.insertReplayObj.author = req.body.author;
				dataObj.insertReplayObj.content = req.body.content;
				dataObj.insertReplayObj.email = req.body.email;
				db.insert(dataObj.insertReplayObj, cb);
			} else {
				//插入失败
				//日志记录
			}
		}
	], function (err, result) {
		if (err) throw err;
	});
}

module.exports.articalGet = articalGet;

module.exports.articalPost = articalPost;