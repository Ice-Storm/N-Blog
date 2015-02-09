var URL = require('url');

var urlparse = function (path) {
	var results = {};
	var urlArr = path.split('/');

	

	switch (urlArr[1].toLowerCase) {
		case 'artical':
			results.sort = urlArr[1];
			results.date = urlArr[2];
			results.articalName = decodeURI(urlArr[3]);
			break;
		case 'admin':
			results.sort = urlArr[1];
			results.page = urlArr[2];
			if (urlArr[3]) {
				results.action = urlArr[3];
			} else if (urlArr[3] && urlArr[4]) {
				results.action = urlArr[3];
				results.target = urlArr[4];
			}	
			break;
		case 'index':
			results.sort = urlArr[1];
			results.action = urlArr[2];
			results.page = url[3];
			break;
		default:
			results.err = '404';
	}

	

	return results;
} 

module.exports.urlparse = urlparse;
