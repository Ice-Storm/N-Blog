var artical = 'create table Nblog_artical (' +
'id int primary key not null auto_increment,' +
'title varchar(30) unique not null,' +
'content text,' +
'author char(15) not null default "",' + 
'sort tinyint not null default 0,' +
'time timestamp not null default NOW(), ' +
'img_p bigint not null default 0, ' +
'com_p bigint not null default 0, ' +
'flag tinyint not null default 0' +
') engine innoDB charset utf8' 

var comment = 'create table Nblog_comment (' +
'id int primary key not null auto_increment, ' +
'content varchar(500) not null default "", ' +
'time timestamp not null default NOW(), ' +
'author char(15) not null default "",' + 
'email char(22) not null default "",' +
'to int not null default 0,' +  //谁回复谁
'foreign_p bigint not null default 0' + 
') engine innoDB charset utf8' 

var admin = 'create table Nblog_admin (' +
'id int primary key not null auto_increment,' +
'name char(8) not null unique,' + //昵称
'user char(15) not null unique default "",' +
'password char(15) not null default "",' +
'flag tinyint not null default 0,' +
'ip char(15) not null default "",' +
'time timestamp not null default NOW(),' + 
'email char(22) not null default "",' +
'answer_one char(6) not null default"",' +
'answer_two char(6) not null default"",' +
'answer_three char(6) not null default""' +
') engine innoDB charset utf8' 

var img = 'create table Nblog_img (' +
'id int primary key not null auto_increment,' +
'img_name char(17) not null default "",' +
'foreign_p bigint not null default 0' + 
') engine innoDB charset utf8'

var tag = 'create table Nblog_tag (' +
'id int primary key not null auto_increment,' +
'tag_name char(10) default""' +
'foreign_p int not null default 0' + 
') engine innoDB charset utf8'

var config = 'create table Nblog_config (' +
'id int primary key not null auto_increment,' +
'blog_name char(10) not null default"",' +
'blog_sign char(30) not null default"",' +
'blog_rights char(50) not null default "",' +
'blog_right_img int not null default"",' +
'blog_address varchar(100) not null default "",'+
'blog_github varchar(100) not null default "",'+
'blog_menu_p int not null default 0,' + //首页上面三个主菜单选项
'blog_menu_min_p int not null default 0,' + // 首页下面的两个子菜单
'blog_tag_p int not null default 0,' +
'blog_function_p int not null default 0' +	
') engine innoDB charset utf8'

var menu = 'create table Nblog_menu (' +
'id int primary key not null auto_increment,' +
'menu_name char(10) not null default"",' +
'foreign_p int not null default 0' + 
') engine innoDB charset utf8'

var fun = 'create table Nblog_img (' +
'id int primary key not null auto_increment,' +
'fun_name char(10) not null default"",' +
'fun_url varchar(350) not null default"",' +
'foreign_p tinyint not null default 0' + 
') engine innoDB charset utf8'

var rightMenuList = 'create table Nblog_left_menu_list (' +
'id int primary key not null auto_increment,' +
'list_name char(10) unique not null default""' +
') engine innoDB charset utf8'





module.exports.artical = artical;

module.exports.admin = admin;

module.exports.config = config;

module.exports.menu = menu;

module.exports.img = img;

module.exports.fun = fun;

module.exports.tag = tag;
