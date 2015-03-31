var nodemailer = require('nodemailer');

var config = require('../config.default.js');

var transport = nodemailer.createTransport('SMTP', config.email);

var sendMail = function (data, n) {
		transport.sendMail(data, function (err, info) {
			if (err) {
				sendMail(data, n - 1);
			} else {
				return;
			};
		})
}

var sendResetPassMail = function (who, token, name, n) {
	var from = '020140wcwz < ' + config.email.auth.user + ' > ';
	var to = who;
	var subject = 'N-blog 密码重置';
	var html = '<p>您好：' + name + '</p>' +
    '<p>N-blog密码找回</p>' +
    '<p>请点击下面的链接来重置帐户：</p>' +
    '<a href="">激活链接</a>' +
    '<p>若您没有在N-blog注册,说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>';
  
  sendMail({
  	from: from,
  	to: to,
  	subject: subject,
  	html: html
  }, n);

}

module.exports.sendResetPassMail = sendResetPassMail;

module.exports.sendMail = sendMail;