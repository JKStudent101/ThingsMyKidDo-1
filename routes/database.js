const mysql = require('mysql');
const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('config.json'))

module.exports.init = ()=>{
    var pool = mysql.createPool({
		connectionLimit: 100,
        host: credentials.db.host,
        user: credentials.db.user,
        password: credentials.db.password,
        database: credentials.db.database
    });


	pool.getConnection((err) => {
		if (err) {
			throw err;
		}
		console.log('Successfully connected to MySQL');
	});



	return pool;
};
