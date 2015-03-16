var util = require('../util/util.js');
var async = require('async');
var db = require('../db/db.js');
var URL = require('url');

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
		field: ['title'],
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
		field: ['id', 'content', 'author', 'time', 'replay_p', 'foreign_p'],
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
		field: ['title'],
		condition: {
			//title = urlinfo.articalName
		},
		close: 'true'
	},

	selRecentlyReplay: {
		table: 'nblog_comment',
		field: ['author', 'foreign_p'],
		condition: {
			1:1,
			skip: 1,
			limit: 7,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'
	},

	selRecentlyRepTit: {
		table: 'nblog_artical',
		field: ['title'],
		condition: {
			// foreign_p
		},
		close: 'true'
	},

	countObj: {
		table: 'nblog_comment',
		rename: 'count',
		condition: {
			//foreign_p: com_p[item]
		},
		close: 'true'
	},

}

var articalGet = function (req, res) {
	var param = URL.parse(req.url, true).query.replay;

	if (param) {
		req.session.replayId = param;
		res.send('1');
	} else {
		var infoUrl = util.urlparse(req.path);

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
			recentlyReplay: function (cb) {
				db.getData(dataObj.selRecentlyReplay, cb);
			},
			commentCount:['artical' ,function (cb, result) {
				dataObj.countObj.condition.foreign_p = result.artical[0].com_p;
				db.getResultCount(dataObj.countObj, cb);
			}],
			comment: ['artical', function (cb, result) {
				dataObj.selCommObj.condition.foreign_p = result.artical[0].com_p;
				db.getData(dataObj.selCommObj, cb);
			}],
			recentlyReplayTitle: ['recentlyReplay', function (cb, result) {
				async.map(result.recentlyReplay, function (item, callback) {
					dataObj.selRecentlyRepTit.condition.com_p = item.foreign_p;
					delete item.foreign_p;
					db.getData(dataObj.selRecentlyRepTit, callback)
				}, function (err, data) {
					cb (err, data);
				})
			}]
		}, function (err, result) {
			req.session.com_p = result.artical[0].com_p;
			// 合并结果集
			for (var i = 0; i < result.recentlyReplayTitle.length; i++) {
				result.recentlyReplayTitle[i] = result.recentlyReplayTitle[i][0];
				result.recentlyReplay[i].title = result.recentlyReplayTitle[i].title;
			} 

			delete result.recentlyReplayTitle;

			result.artical[0].count = result.commentCount[0].count;

			delete result.commentCount;

			delete result.artical[0].com_p;

			for (var i = 0; i < result.comment.length; i++) {
				result.comment[i].rep = [];
				for (var j = 0; j < result.comment.length; j++) {
					if (result.comment[i].id == result.comment[j].replay_p) {
						result.comment[i].rep.push(result.comment.slice(j, j + 1));
						result.comment[j].id = -1;
					}
				}
			}
			//console.log(data.comment[].rep);
			console.log(result.comment[result.comment.length - 1]);
			console.log('-------------------')
			console.log(result.comment[result.comment.length - 1].rep[0][0]);


			res.render('artical', {
				data: result
			});
		});
	}
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
			if (data[0]) {
				//回复评论的ID
				if (req.session.replayId) {
					dataObj.insertReplayObj.replay_p = req.session.replayId;
				}
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

		res.redirect(req.url);
	});
}

module.exports.articalGet = articalGet;

module.exports.articalPost = articalPost;