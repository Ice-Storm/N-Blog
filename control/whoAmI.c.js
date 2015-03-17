var async = require('async');
var util = require('../util/util.js');
var db = require('../db/db.js');


var dealGet = function (req, res) {
	res.render('whoAmI');
}


module.exports.dealGet= dealGet;