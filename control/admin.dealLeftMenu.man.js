var db = require('../db/db.js');
var async = require('async');

var dealMan = function (s) {
	var par = {
		table: 'Nblog_admin',
		field: ['user', 'password', 'flag', 'ip', 'time'],
		condition: {
			1: 1,
			limit: 10,
			skip: s - 1
		},
		close: 'true'
	}


	db.getData(par, function (err, data) {
		return data;
	})
}

module.exports.dealMan = dealMan;