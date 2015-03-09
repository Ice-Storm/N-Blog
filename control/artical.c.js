var util = require('../util/util.js');

var artical = function (req, res) {
	console.log(req)
	var infoUrl = util.urlparse(req.path);
	//res.send(infoUrl.articalName);
	console.log('-------------')
	res.render('artical');
}

module.exports.artical = artical;