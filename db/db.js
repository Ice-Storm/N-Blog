var mysql = require('mysql');

var config = require('../config.default.js');

var pool = mysql.createPool(config.mysql);

var e = function (value, isEscapeId) {
	var isE = false;
	isE = isEscapeId;
	if (isE) {
		return pool.escapeId(value);
	} else {
		return pool.escape(value);
	}
}

var judgeObjLen = function (obj) {
	if (typeof obj != "object") {
		throw 'insert parameter type err';
	}

	var count = 0;

	for (i in obj) {
		count++;
	}

	if (count) {
		return 1;
	} else {
		return 0;
	}
}

var insert = function (valueCol, cb) {

	// valueCol like

	/*	
		{
			table: 'nblogtest',
			id: 1,
			name: 'hh',
			close: true
		}
	*/


	//应该写一个类似 JQEURY 的 extend 函数 替换默认值用

	if (typeof valueCol != "object") {
		throw 'insert parameter type err';
	}

	if (!valueCol.table){
		throw 'Table name is not exists';
	}

	var fieldStr = '';
	var valStr = '';
	var sql = '';

	for (i in valueCol) {
		if (i != 'table' && i != 'close') {
			fieldStr += e(i, true) + ',';
			valStr += e(valueCol[i], false) + ',';
		}
	}

	fieldStr = fieldStr.slice(0, fieldStr.length - 1);
	valStr = valStr.slice(0, valStr.length - 1);

	
	sql = 'INSERT INTO ' + valueCol.table + ' ( ' + fieldStr + ' ) VALUES ( ' + valStr +' )';  
	
	pool.getConnection(function (err, conn) {
		if (err) console.log('mysql connection error');
		conn.query(sql, function (err) {
			if (err) throw err;
			if (valueCol.close) conn.release();
			if (typeof cb == 'function') cb(null, 1);
		})
	});
}


var getData = function (valueCol, cb) {

	//valueCol like

	/*
		{
			table: 'nblogtest',
			field: ['id', 'name'],
			condition: {
				id: 1,
				name: 'hh',
				limit: 5,
				skip: 5,
				order: 'desc',
				orderField: id
			},
			close: true
		}
	*/

	if (typeof valueCol != "object") {
		throw 'Insert parameter type err';
	}

	if (!valueCol.table){
		throw 'Table name is not exists';
	}

	if (!valueCol.condition){
		throw 'Condition is not exists';
	}

	if (!valueCol.field && valueCol.field.constructor != '[Function: Array]') {
		throw 'Field is not exists or type error';
	}

	var judge = judgeObjLen(valueCol.condition);

	if (!judge) {
		throw 'No condition';
	}

	var fieldStr = '';
	var sql = '';
	var condition = '';
	var fieldArr = valueCol.field;
	var vc = valueCol.condition;

	for (var i = 0; i < fieldArr.length; i++) {
		fieldStr += e(fieldArr[i], true) + ',';	
	}

	fieldStr = fieldStr.slice(0, fieldStr.length - 1);

	for (i in vc) {
		if (i != 'limit' && i != 'order' && i != 'skip' && i != 'orderField') {
			condition += i + ' = ' + e(valueCol.condition[i], false) + ' and ';
		}
	}

	condition = condition.slice(0, condition.length - 5);

	sql = 'SELECT ' + fieldStr + ' FROM ' + valueCol.table + ' WHERE ' + condition;


	if (vc.order && vc.orderField && vc.limit && vc.skip) {
		sql += e(vc.orderField) + ' ' + vc.order + ' limit ' + vc.skip + ' , ' + vc.limit; 
	} else if (!vc.order && !vc.orderField && vc.limit && vc.skip) {
		sql += ' LIMIT ' + vc.skip + ' , ' + vc.limit;
	} else if (!vc.order && !vc.orderField && vc.limit && !vc.skip) {
		sql += ' LIMIT ' +  vc.limit;
	} else if (vc.order && vc.orderField && !vc.limit && !vc.skip) {
		sql += ' ORDER BY ' + e(vc.orderField) + ' ' + vc.order;
	} else if (!vc.order && vc.orderField && !vc.limit && !vc.skip) {
		sql += ' ORDER BY ' + e(vc.orderField);
	} else if (!vc.order && vc.orderField && vc.limit && !vc.skip) {
		sql += ' ORDER BY ' + e(vc.orderField) + ' LIMIT ' + vc.limit;
	} else if (!vc.order && !vc.orderField && !vc.limit && !vc.skip){
		sql = sql;
	} else {
		throw 'SQL Error'
	}

	pool.getConnection(function (err, conn) {
		if (err) console.log('mysql connection error');
		conn.query(sql, function (err, data) {
			if (err) throw err;
			if (valueCol.close) conn.release();
			if (typeof cb == 'function') cb(null, data);
		})
	});
}

var del = function (valueCol, cb) {
	if (typeof valueCol != "object") {
		throw 'Del parameter type err';
	}

	if (!valueCol.table){
		throw 'Table name is not exists';
	}

	if (!valueCol.condition){
		throw 'Condition is not exists';
	}

	var condition = '';
	var fieldStr = '';

	for (i in valueCol.condition) {
		condition += i + ' = ' + e(valueCol.condition[i], false) + ' and ';
	}

	condition = condition.slice(0, condition.length - 5);

	sql = 'DELETE ' + fieldStr + ' FROM ' + valueCol.table + ' WHERE ' + condition;

	pool.getConnection(function (err, conn) {
		if (err) console.log('mysql connection error');
		conn.query(sql, function (err) {
			if (err) throw err;
			if (valueCol.close) conn.release();
			if (typeof cb == 'function') cb(null, 1);
		})
	});
} 


var update = function (valueCol, cb) {
	if (typeof valueCol != "object") {
		throw 'Del parameter type err';
	}

	if (!valueCol.table){
		throw 'Table name is not exists';
	}

	if (!valueCol.condition){
		throw 'Condition is not exists';
	}

	var condition = '';
	var updateStr = '';
	var sql = '';

	for (i in valueCol) {
		if (i != 'close' && i != 'condition' && i != 'table' ) {
			updateStr += i + ' = ' + e(valueCol[i], false) + ',';
		}
	}

	updateStr = updateStr.slice(0, updateStr.length - 1);

	for (i in valueCol.condition) {
		condition += i + ' = ' + e(valueCol.condition[i], false) + ' and ';
	}

	condition = condition.slice(0, condition.length - 5);

	sql = 'UPDATE ' + valueCol.table + ' SET ' + updateStr + ' WHERE ' + condition;

	pool.getConnection(function (err, conn) {
		if (err) console.log('mysql connection error');
		conn.query(sql, function (err) {
			if (err) throw err;
			if (valueCol.close) conn.release();
			if (typeof cb == 'function') cb(null, 1);
		})
	});
}

var getResultCount = function (valueCol, cb) {
	if (!valueCol.table) {
		throw 'Table not exists';
	} 

	var sql = '';

	if (valueCol.rename) {
		sql = 'SELECT  COUNT (*) AS ' + valueCol.rename + ' FROM ' + valueCol.table;
	} else {
		sql = 'SELECT  COUNT (*) FROM ' + valueCol.table;
	}

	pool.getConnection(function (err, conn) {
		if (err) console.log('mysql connection error');
		conn.query(sql, function (err, data) {
			if (err) throw err;
			if (valueCol.close) conn.release();
			if (typeof cb == 'function') cb(null, data);
		})
	});
}

var selectAuto = function (sql, cb) {
	pool.getConnection(function (err, conn) {
		if (err) console.log('mysql connection error');
		conn.query(sql, function (err, data) {
			if (err) throw err;
			conn.release();
			if (typeof cb == 'function') cb(null, data);
		})
	});
}

module.exports.insert = insert;

module.exports.getData = getData;

module.exports.del = del;

module.exports.update = update;

module.exports.getResultCount = getResultCount;

module.exports.selectAuto = selectAuto;