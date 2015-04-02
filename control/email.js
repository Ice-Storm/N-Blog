var db = require('../db/db.js');
var config = require('../config.default.js');
var cryptoInfo = require('../common/cryptoInfo.js');

var dataObj = {
		selUserObj: {
		table: 'nblog_admin',
		field: ['user'],
		condition: {
			// id
		},
		close: 'true'
	}
}

var dealGet = function (req, res) {
	var urlHash = req.params.hash;
	dataObj.selUserObj.condition.id = req.params.id;
	db.getData(dataObj.selUserObj, function (err, data) {
		var checkHash = cryptoInfo.cryptoInfo('sha1', 'hex', data[0] + config.urlsecret);
		if (checkHash == urlHash) {
			//返回修改密码页面
		} else {
			//返回出错页面
		}
	})
}

module.exports.dealGet = dealGet;