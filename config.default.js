var config = {

	listenerPort: 3000,
	sessionSecret: 'test',

	//mysql default config
	mysql: {
		host: 'localhost',
		port: 3306,
		database: 'NBlog',
		user: 'root',
		password: '',
		//mysql poll config
		waitForConnections: true,
		connectionLimit: 10,
		queryLimit: 10,
		multipleStatements: false
	},

	uploadFile: '/uploadImg/'
}


module.exports = config;