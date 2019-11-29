const express = require('express');
// const cookieParser = require('cookie-parser');
const router = express.Router();
const db = require('../app').db;
// router.use(cookieParser());
// to /event

router.get('/display/:id', async (req, res) => {
	if (!req.session.user) {
		req.session.url = `/event/display/${req.params.id}`;
		res.redirect('/login')
	} else {
		let event = await new Promise((resolve, reject) => {
			let sql = "select e.name, e.description, e.link, e.isApproved, v.name as 'vendor_name', v.website " +
				"from event e " +
				"inner join vendor v on e.vendor_id = v.user_id " +
				"where event_id = ?;"
			db.query(sql, req.params.id, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result)
				}
			})
		})

		if (event.length > 0) {
			if (event[0].isApproved === "Approved") {
				let sql = "select name from " +
					"event_tags et " +
					"inner join tags t on et.tag_id = t.tag_id " +
					"where et.event_id = 6;"
				db.query(sql, req.params.id, (err, result) => {
					if (err) {
						console.log(err);
					} else {
						req.session.display_event = event[0];
						req.session.display_event.tags = result
						if (!req.session.display_event.link.includes("https://")) {
							req.session.display_event.link = "https://" + req.session.display_event.link;
						}
						if (!req.session.display_event.website.includes("https://")) {
							req.session.display_event.website = "https://" + req.session.display_event.website;
							// console.log(req.session.display_event.website)
						}
						req.session.loadedOnce = false;
						res.redirect('/event')
					}
				})
			}
		}
	}
});

router.get('/', (req, res) => {
	if (!req.session.user) {
		req.session.url = '/event';
		res.redirect('/login')
	} else {
		if (!req.session.loadedOnce) {
			req.session.loadedOnce = true
		} else {
			delete req.session.display_event
		}
		let sql =
			'SELECT DISTINCT t.name  \n' +
			'FROM event e \n' +
			'INNER JOIN event_tags et \n' +
			'ON e.event_id = et.event_id \n' +
			'INNER JOIN tags t\n' +
			'ON et.tag_id = t.tag_id \n' +
			'ORDER BY t.name		';
		db.query(sql, (err, result) => {
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
						vendor_id: req.session.user.user_id,
						display_event: req.session.display_event
					});
				} else {
					res.render('event.hbs', {
						data: result,
						user_type: req.session.user.user_type,
						vendor_id: req.session.user.user_id,
						display_event: req.session.display_event
					});
				}
			}
		});
	}
});

// get all events
router.get('/getall', (req, res) => {
	if (!req.session.user) {
		res.redirect('/logout')
	} else {
		let sql =
			'select e.*, t.name as category from event as e \n' +
			'inner join event_tags as et on e.event_id = et.event_id \n' +
			'inner join tags as t on et.tag_id = t.tag_id \n' +
			'where e.isApproved = "Approved";';
		db.query(sql, (err, result) => {
			if (err) {
				throw err;
			} else {
				var data = [];
				for (var i = 0; i < result.length; i++) {
					data.push(result[i]);
				}
			}
		});
	}
});

router.get('/gettags', (req, res) => {
	if (!req.session.user) {
		res.redirect('/logout')
	} else {
		let sql =
			'SELECT DISTINCT t.name  \n' +
			'FROM event e \n' +
			'INNER JOIN event_tags et \n' +
			'ON e.event_id = et.event_id \n' +
			'INNER JOIN tags t\n' +
			'ON et.tag_id = t.tag_id \n' +
			'ORDER BY t.name		';
		db.query(sql, (err, result) => {
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
	}
});

router.get('/getnames', (req, res) => {
	if (!req.session.user) {
		res.redirect('/logout')
	} else {
		let user_id = req.session.user.user_id;
		let sql =
			'SELECT DISTINCT child_nickname  \n' +
			'FROM child \n' +
			'WHERE parent_id =' + user_id;
		db.query(sql, (err, result) => {
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
	}
});

module.exports = router;
