var util = require('../util/util.js');


var admin = function (req, res) {
	var urlInfo = util.urlparse(req.path);
	res.render(urlInfo.page)
}


module.exports.admin= admin;