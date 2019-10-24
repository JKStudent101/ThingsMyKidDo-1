const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();

const db = require('../config/database').init();
router.use(cookieParser());
// to /event

router.get('/', (req, res) => {
	let sql =
		'SELECT DISTINCT t.name  \n' +
		'FROM event e \n' +
		'INNER JOIN event_tags et \n' +
		'ON e.event_id = et.event_id \n' +
		'INNER JOIN tags t\n' +
		'ON et.event_id = t.tag_id';
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
			console.log(result);
			console.log(data);

			res.render('event.hbs', {
				data: result
			});
			// res.send(data);
		}
	});
	// response.render('event.hbs', {});
});

// get all events
router.get('/getall', (req, res) => {
	let sql = 'SELECT * FROM event';
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

// find all catalogs by catalog option
router.get('/search/:tags', (req, res) => {
	let sql =
		'select e.*, t.name as category from event as e\n' +
		'inner join event_tags as et on e.event_id = et.event_id \n' +
		'inner join tags as t on et.tag_id = t.tag_id \n' +
		'where t.name = ?';

	let event_tag = req.params.tags;

	db.query(sql, event_tag, (err, result) => {
		if (err) {
			throw err;
		} else {
			var data = [];
			for (var i = 0; i < result.length; i++) {
				data.push(result[i]);
			}
			if (data) {
				res.send(data);
				req;
			}
		}
	});
});

// find all events with tags based on event names
router.get('/search/name/:name', (req, res) => {
	let sql = 'select * from event';
	let db = require('./database').init();
	let event_tag = req.params.name;

	db.query(sql, event_tag, (err, result) => {
		if (err) {
			throw err;
		} else {
			var data = [];
			for (var i = 0; i < result.length; i++) {
				data.push(result[i]);
			}
			if (data) {
				res.send(data);
			}
		}
	});
});

module.exports = router;
