var dealMan = require('./admin.dealLeftMenu.man.js');

var dealControl = function (target,skip) {
	switch (target) {
		case '管理员账号':
			return dealMan.dealMan(skip);
			break;

	};
}

module.exports.dealControl = dealControl;