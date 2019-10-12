const express = require('express');

const router = express.Router();

var db = require('../config/database').init();

// to /event

router.get('/', (request, response) => {
	response.render('event.hbs', {});
});
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

router.get('/:eventid', (req, res) => {
	let sql = 'select * from event where event_id = ?';

	let event_id = req.params.eventid;

	db.query(sql, event_id, (err, result) => {
		if (err) {
			throw err;
		} else {
			var data = [];
			for (var i = 0; i < result.length; i++) {
				data.push(result[i]);
			}
			if (data) {
				res.send(data);
			} else {
				res.send({});
			}
		}
	});
});

module.exports = router;
