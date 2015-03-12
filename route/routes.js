var indexCon = require('../control/index.c.js');

var artical = require('../control/artical.c.js');

var adminMan = require('../control/admin.man.js');

var adminSta = require('../control/admin.sta.js');

var adminArt = require('../control/admin.art.js');

var adminAddArt = require('../control/admin.addArt.js');

var adminEls = require('../control/admin.els.js');

var adminElsTwo = require('../control/admin.elsTwo.js');

var articalRegExp = /artical\/(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)\/.+/i

module.exports = function (router) {
	router.get('/', indexCon.index);

	router.get(articalRegExp, artical.articalGet);

	router.post(articalRegExp, artical.articalPost)

	router.get('/admin/adminindex', function (req, res) {
		res.render("adminindex.ejs", {
			adminBase: 'adminBase',
			css: 'adminAdmin'
		})
	});

	router.get(/admin\/adminIndex\/dealRightMenuList\/man\/\w+/, adminMan.dealGet);

	router.get('/admin/adminIndex/dealRightMenuList/status', adminSta.dealGet);

	router.get(/admin\/adminIndex\/dealRightMenuList\/art\/\w+/, adminArt.dealGet);

	router.get('/admin/adminIndex/content/addArtical', adminAddArt.dealGet);

	router.post('/admin/adminIndex/content/addArtical', adminAddArt.dealPost);
	
	router.get('/admin/adminIndex/dealRightMenuList/else', adminEls.dealGet);

	router.post('/admin/adminIndex/dealRightMenuList/else', adminEls.dealPost);

	router.get('/admin/adminIndex/dealRightMenuList/else2', adminElsTwo.dealGet);

	router.post('/admin/adminIndex/dealRightMenuList/else2', adminElsTwo.dealPost);

	router.get('/index/page/N');

	
}
