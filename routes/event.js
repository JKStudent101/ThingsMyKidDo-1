const express = require('express');

const router = express.Router();

var db = require('../config/database').init();

// to /event

router.get('/', (request, response) => {
	response.render('event.hbs', {});
});

// get all events
router.get('/getall', (request, response) => {
	let sql = 'SELECT * FROM event';
	db.query(sql, (err, result) => {
		if (err) {
			throw err;
		} else {
			var data = [];
			for (var i = 0; i < result.length; i++) {
				data.push(result[i]);
			}
			response.send(data);
		}
	});
});

// find all event tags
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
			}
		}
	});
});

// find all events with tags based on event names
router.get('/search/tags/:name', (req, res) => {
	let sql = 'select * from event where event = ?';

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

router.get('/search/tags', (req, res) => {
	let sql = 'select distinct category from event';
	db.query(sql, (err, result) => {
		if (err) {
			throw err;
		} else {
			var data = [];
			for (var i = 0; i < result.length; i++) {
				data.push(result[i]);
			}
			response.send(data);
		}
	});
});
module.exports = router;
