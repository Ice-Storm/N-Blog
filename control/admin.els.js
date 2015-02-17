var async = require('async');
var util = require('../util/util.js');
var db = require('../db/db.js');


var dealGet = function (req, res) {
	
	res.render('adminEls', {
		css: 'adminIndex.adminEls'
	});

}


module.exports.dealGet= dealGet;