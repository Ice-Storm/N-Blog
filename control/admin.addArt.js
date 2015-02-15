var dealGet = function (req, res) {
	res.render('adminAddArt', {
		css: 'adminIndex.adminAddArt'
	})
}

var dealPost = function (req, res) {
	console.log(req)
}

module.exports.dealGet = dealGet;

module.exports.dealPost = dealPost;