const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();

const db = require('../config/database').init();
router.use(cookieParser());
// to /event

router.get('/', (req, res) => {
	let sql = 'select distinct category from event';
	db.query(sql, (err, result) => {
		if (!req.cookies.i) {
			res.redirect('/login');
		}
		if (err) {
			throw err;
		} else {
			// var data = [];
			// for (var i = 0; i < result.length; i++) {
			// 	data.push(result[i]);
			// }
			res.render('event.hbs', {
				data: result
			});
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

// find all catalogs
router.get('/search/:tags', (req, res) => {
	let sql = 'select * from event where category = ?';

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

// router.get('/search', (request, response) => {
// 	let sql = 'select distinct category from event';
// 	db.query(sql, (err, result) => {
// 		if (err) {
// 			throw err;
// 		} else {
// 			var data = [];
// 			for (var i = 0; i < result.length; i++) {
// 				data.push(result[i]);
// 			}
// 			response.send(data);
// 		}
// 	});
// });
module.exports = router;
