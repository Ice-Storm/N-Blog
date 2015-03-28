var async = require('async');
var util = require('../util/util.js');
var db = require('../db/db.js');
var URL = require('url');


var dataObj = {
	selArtical: {
		table: 'Nblog_artical',
		field: ['id', 'title', 'author', 'sort', 'flag', 'time'],
		condition: {
			1: 1,
			limit: 10,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'
	},

	delArtical: {
		table: 'Nblog_artical',
		condition: {
			//id 动态获取
		},
		close: 'true'
	},

	selEditorArtical: {
		table: 'Nblog_artical',
		field: ['title', 'content', 'flag'],
		condition: {
			// id 动态获取
		},
		close: 'true'
	},

	updateArtical: {
		table: 'Nblog_artical',
		condition: {
			// id 动态获取
		},
		close: 'true'	
	},

	articalCount: {
		table: 'nblog_artical',
		rename: 'count',
		condition: {
			1:1
		},
		close: 'true'
	}
}

var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	function isEmpty(obj){
		for (var name in obj) {
			return false;
		}
		return true;
	};

	var urlInfo = util.urlparse(req.url);

	var query = URL.parse(req.url, true).query;

	if (isEmpty(query)) {
		//正常GET请求

		if(urlInfo.page <= 0) {
			urlInfo.page = 1;
		} else {
			dataObj.selArtical.condition.skip = (urlInfo.page - 1) * 10;
		}

		
		async.parallel({
			artical: function (cb) {
				db.getData(dataObj.selArtical, cb);
			},
			articalCount: function (cb) {
				db.getResultCount(dataObj.articalCount, cb);
			}
		}, function (e, result) {
			console.log(result)
			var t;
			for (var i = 0; i < result.artical.length; i++) {
				var articalTime = result.artical[i].time.toString();
				if (articalTime.length == 10) {
					t = new Date(result.artical[i].time * 1000);
				} else {
					t = new Date(result.artical[i].time);
				}
				var time = t.getFullYear() + '-' + eval(t.getMonth() + 1) + '-' + t.getDate() + '  ' + t.getHours() + ':' + t.getMinutes();
				result.artical[i].time = time;

				if (result.artical[i].flag == 1) {
					result.artical[i].flag = '顶';
				} else {
					result.artical[i].flag = '---';
				}
			}

			//处理分页
			var count = result.articalCount[0].count;

			function pageChange (count, currentPage, pageSize) {
				var pageInfo = {};
				var hasNextPage = false;
				var hasPreviousPage = false;

				if ((count % pageSize) == 0) {
					pageInfo.totalPage = count / pageSize;
				} else {
					pageInfo.totalPage = Math.ceil(count / pageSize);					
				}

				if(currentPage >= pageInfo.totalPage) {
					hasNextPage = false;
					pageInfo.currentPage = pageInfo.totalPage;
				} else {
					hasNextPage = true;
				}

				if (currentPage <= 1) {
					hasPreviousPage = false;
					currentPage = 1;
				} else {
					hasPreviousPage = true;
				}

				pageInfo.nextPage = currentPage + 1;

				if (pageInfo.nextPage >= pageInfo.totalPage) {
					pageInfo.nextPage = pageInfo.totalPage;
				}

				pageInfo.previousPage = currentPage - 1;

				if (pageInfo.previousPage <= 1) {
					pageInfo.previousPage = 1;
				}

				return pageInfo;
			}
				
			var pageObj= pageChange(count, urlInfo.page, 10);

			console.log(pageObj)

			res.render('adminArt', {
				info: result.artical,
				page: pageObj,
				adminBase: 'adminBase',
				css: 'adminIndex.adminArt'
			});
		})
	} else {
		// 编辑或者删除请求
		if(query.editor) {
			dataObj.selEditorArtical.condition.id = query.id;
			db.getData(dataObj.selEditorArtical, function (err, result) {
				res.send(result)
			})
		} else if (query.delete) {
			dataObj.delArtical.condition.id = query.id;
			db.del(dataObj.delArtical, function (err, r) {
				res.redirect('/admin/adminIndex/dealRightMenuList/art/1');
			})
		}
	}
}

var dealPost = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 
	
	dataObj.updateArtical.title = req.body.title;
	dataObj.updateArtical.content = req.body.content;
	dataObj.updateArtical.flag = req.body.flag;
	dataObj.updateArtical.condition.id = req.body.id;
	db.update(dataObj.updateArtical, function (err, flag) {
		res.redirect('/admin/adminIndex/dealRightMenuList/art/1/');
	})
}


module.exports.dealGet= dealGet;

module.exports.dealPost= dealPost;