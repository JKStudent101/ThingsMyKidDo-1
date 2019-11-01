const mysql = require('mysql');

module.exports.init = ()=>{
    var pool = mysql.createPool({
		connectionLimit: 100,
        host: 'thingmykidsdo.ckcstihnhz8i.us-west-2.rds.amazonaws.com',
        user: 'admin',
        password: 'Password',
        database: 'thingsKidsDoModified'
    });


	pool.getConnection((err) => {
		if (err) {
			throw err;
		}
		console.log('Successfully connected to MySQL');
	});



	return pool;
};
