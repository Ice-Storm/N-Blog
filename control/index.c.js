var async = require('async');

var db = require('../db/db.js');

var util = require('../common/util');

//首页查询数据

var dataObj = {

	selConfigObj: {
		table: 'nblog_config',
		condition: {
			all: '*'
		},
		close: 'true'
	},

	selTagObj: {
		table: 'nblog_tag',
		field: ['tag_name'],
		close: 'true'
	},

	selMenuObj: {
		table: 'nblog_menu',
		field: ['menu_name'],
		close: 'true'
	},

	selFlagObj: {
		table: 'nblog_artical',
		field: ['id'],
		condition: {
			flag: 1
		},
		close: 'true'
	},

	selArticalObj: {
		table: 'nblog_artical',
		field: ['title', 'author', 'time', 'content', 'img_p', 'com_p'],
		fun: {
			unix_timestamp: 'time'
			//from_unixtime: 'time'
		},
		condition: {
			flag: 0,
			limit: 4,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'
	},

	selFlagArticalObj: {
		table: 'nblog_artical',
		field: ['title', 'author', 'time', 'content', 'img_p', 'com_p'],
		fun: {
			unix_timestamp: 'time'
		},
		condition: {
			flag: 1
		},
		close: 'true'
	},

	selArticalImgObj: {
		table: 'nblog_img',
		field: ['img_name'],
		condition: {
			//foreign_p: item.img_p, 函数动态生成
		},
		close: 'true'
	},

	selArticalFlagImgObj: {
		table: 'nblog_img',
		field: ['img_name'],
		condition: {
			//foreign_p: item.img_p, 同上
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
	
	regExp: /\<img\s+src.+\/\>/i //文章截取处不出现图片
}


var index = function (req, res) {
	async.auto({
		config: function (cb) {
			db.getData(dataObj.selConfigObj, cb);
		},
		tag: function (cb) {
			db.getData(dataObj.selTagObj, cb);
		},
		menu: function (cb) {
			db.getData(dataObj.selMenuObj, cb);
		},
		flag: function (cb) {
			db.getData(dataObj.selFlagObj, cb);
		},
		artical: ['flag', function (cb, result) {
			if (result.flag.length < 4) {
				dataObj.selArticalObj.condition.limit = 4 - result.flag.length;
			}
			db.getData(dataObj.selArticalObj, cb);
		}],
		flagArtical: function (cb) {
			db.getData(dataObj.selFlagArticalObj, cb);
		},
		articalImg: ['artical', function (cb, result) {
			async.map(result.artical, function (item, callback) {

				dataObj.selArticalImgObj.condition.foreign_p = item.img_p;

				db.getData(dataObj.selArticalImgObj, callback);

			}, function (err, result) {

				cb(null, result);
			})
		}],
		commCount: ['artical', 'flagArtical', function (cb, result) {
			
			var com_p = [];

			for (var i = 0; i < result.flagArtical.length; i++) {
				com_p.unshift(result.flagArtical[i].com_p);
			}

			for (var i = 0; i < result.artical.length; i++) {
				com_p.push(result.artical[i].com_p);
			}

			async.map(com_p, function (item, callback) {
				dataObj.countObj.condition.foreign_p = com_p[item];

				db.getResultCount(dataObj.countObj, callback);

			}, function (err, result) {
				cb(null, result);
			});
		}],
		articalFlagImg: ['flag', 'artical', 'articalImg', function (cb, result){
			async.map(result.flagArtical, function (item, callback) {

				dataObj.selArticalFlagImgObj.condition.foreign_p = item.img_p;

				db.getData(dataObj.selArticalFlagImgObj, callback);

			}, function (err, result) {
				cb(null, result);
			})
		}]
	}, function (err, result) {

		//合并 artical 和 flagArtical 对象 方便前端渲染

		for (var i = 0; i < result.flagArtical.length; i++) {
			result.artical.unshift(result.flagArtical[i])
		}

		delete result.flagArtical;

		//合并 articalImg 和 flagArticalImg 对象

		for (var i = 0; i < result.articalFlagImg.length; i++) {
			result.articalImg.unshift(result.articalFlagImg[i])
		}

		delete result.articalFlagImg;

		//合并 文章和图片 artical   articalImg 对象 
		//截取文章前一部分
		//把评论数挂在artical上
		//去除截取部分图片

		for (var i = 0; i < result.artical.length; i++) {
			
			if (result.articalImg[i][0]) {
				result.artical[i].img = result.articalImg[i][0].img_name;
			} else {
				result.artical[i].img = '';
			}

			delete result.artical[i].img_p;

			delete result.artical[i].com_p;

			result.artical[i].content = result.artical[i].content.split('\n', 15).join('');

			
			if (dataObj.regExp.exec(result.artical[i].content)) {
				result.artical[i].content = result.artical[i].content.replace(dataObj.regExp, '');
			}

			result.artical[i].comCount = result.commCount[i][0].count;

			//格式化时间

			if (result.artical[i].time.toString().length == 10) {
				result.artical[i].time = util.dateFormat(result.artical[i].time * 1000);
			} else {
				result.artical[i].time = util.dateFormat(result.artical[i].time);
			}
			

			
		}

		delete result.commCount;

		delete result.articalImg;

		delete result.flag;

		res.render('index', {
			data: result
		});
	})
} 

module.exports.index = index;