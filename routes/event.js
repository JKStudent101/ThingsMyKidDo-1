const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const db = require('./database').init();
router.use(cookieParser());
// to /event

router.get('/', (req, res) => {
	let sql =
		'SELECT DISTINCT t.name  \n' +
		'FROM event e \n' +
		'INNER JOIN event_tags et \n' +
		'ON e.event_id = et.event_id \n' +
		'INNER JOIN tags t\n' +
		'ON et.tag_id = t.tag_id \n' +
		'ORDER BY t.name		';
	db.query(sql, (err, result) => {
		if (!req.cookies.i) {
			res.redirect('/login');
		}
		if (err) {
			throw err;
		} else {
			var data = [];
			for (var i = 0; i < result.length; i++) {
				data.push(result[i]);
			}
			var passedVariable = req.query.valid;
			if (passedVariable) {
				res.render('event.hbs', {
					data: result,
					message: passedVariable,
					user_type: req.session.user.user_type,
					vendor_id: req.session.user.user_id
				});
			} else {
				res.render('event.hbs', {
					data: result,
					user_type: req.session.user.user_type,
					vendor_id: req.session.user.user_id
				});
			}
		}
	});
});

// get all events
router.get('/getall', (req, res) => {
	let sql =
		'select e.*, t.name as category from event as e \n' +
		'inner join event_tags as et on e.event_id = et.event_id \n' +
		'inner join tags as t on et.tag_id = t.tag_id;';
	db.query(sql, (err, result) => {
		if (err) {
			throw err;
		} else {
			var data = [];
			for (var i = 0; i < result.length; i++) {
				data.push(result[i]);
			}
			res.send(data);
		}
	});
});

router.get('/gettags', (req, res) => {
	let sql =
		'SELECT DISTINCT t.name  \n' +
		'FROM event e \n' +
		'INNER JOIN event_tags et \n' +
		'ON e.event_id = et.event_id \n' +
		'INNER JOIN tags t\n' +
		'ON et.tag_id = t.tag_id \n' +
		'ORDER BY t.name		';
	db.query(sql, (err, result) => {
		if (!req.cookies.i) {
			res.redirect('/login');
		}else{
			if (err) {
				throw err;
			} else {
				var data = [];
				for (var i = 0; i < result.length; i++) {
					data.push(result[i]);
					// console.log(i);
				}
	
				res.send(data);
			}
		}
		
	});
});

router.get('/getnames', (req, res) => {
	let user_id = req.session.user.user_id;
	let sql =
		'SELECT DISTINCT child_nickname  \n' +
		'FROM child \n' +
		'WHERE parent_id =' + user_id ;
	db.query(sql, (err, result) => {
		if (!req.cookies.i) {
			res.redirect('/login');
		}
		if (err) {
			throw err;
		} else {
			var data = [];
			for (var i = 0; i < result.length; i++) {
				data.push(result[i]);
				// console.log(i);
			}

			res.send(data);
		}
	});
});

module.exports = router;
