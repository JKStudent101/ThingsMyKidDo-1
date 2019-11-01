const express = require('express');
const port = process.env.PORT || 10000;
const host = '0.0.0.0';
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();
// const session = require('client-sessions');
const mysql = require('mysql');
const webpush = require('web-push');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
const { body, check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');


// import event routes
const event = require('./routes/event');
const addevent = require('./routes/addevent')

var db = require('./routes/database').init();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname + '/views'));
app.use('/scripts', express.static('build'));
app.use('/css', express.static('style'));

app.use(cookieParser());
app.use(session({
	secret: 'love',
	resave: false,
	saveUninitialized: true,
}))
app.use(express.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use('/event', event);
app.use('/addevent', addevent);
const server = require('http').createServer(app);
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res) => {
	res.redirect('/login');
});

app.get('/home', (req, res) => {
	res.render('home.hbs', {});
});
app.get('/login', (req, res) => {
	res.render('login.hbs', {});
});

app.post('/login-form', [
	body('email')
		.isAlphanumeric()
		.trim()
		.not().isEmpty()
		.escape(),
	body('password')
		.not().isEmpty()
		.escape()
], (req, res) => {
	// console.log(req.body)
	let email = req.body.email;
	let password = req.body.password;
	let sql = 'SELECT u.user_id, u.user_type, u.email, u.pass_hash FROM thingsKidsDoModified.user as u ' +
		'WHERE email = ?';
	db.query(sql, email, (err, result) => {
		if (err) {
			throw err;
		} else {
			// console.log(result);
			// console.log(result.length)
			// console.log(result[0].user_type);
			if (result.length === 0) {
				res.send("User not found")
			} else if (bcrypt.compareSync(password, result[0].pass_hash)) {
				let salt = bcrypt.genSaltSync(saltRounds);
				res.cookie('i', bcrypt.hashSync(email, salt));
				req.session.user = result[0];
				if (result[0].user_type === 'admin') { res.redirect("/admin") }
				else if (result[0].user_type === 'vendor') { res.redirect(`/vendor/${result[0].user_id}`) }
				else if (result[0].user_type === 'parent') { res.redirect("/event") }
				else {
					res.cookie('i', true, { expires: new Date() });
					res.send("Error: no user type")
				}
			} else {
				res.send("Incorrect password")
			}

		}
	})
});

app.post('/sign-up-form', (req, res) => {
	let salt = bcrypt.genSaltSync(saltRounds);
	let hash = bcrypt.hashSync('password', salt);
	res.render('not finished')
})

app.get('/register', (req, res) => {
	res.render('register.hbs', {});
});

app.get('/profile', (req, res) => {
	if (!req.cookies.i) {
		res.redirect('/login')
	} else {
		res.render('profile.hbs', {});
	}
});

app.get('/admin', (req, res) => {
	// console.log(req.cookies);
	if (!req.cookies.i || !req.session.user) {
		res.redirect('/logout')
	} else if (req.session.user.user_type != 'admin') {
		res.redirect('/logout')
	} else {
		var sql = 'SELECT a.event_id, d.name as vendor_name, a.description, a.name as event, \n' +
			'c.name as tag_name, date_format(a.start_date, "%Y/%m/%d") as start_date, date_format(a.end_date, "%Y/%m/%d") as end_date, \n' +
			'a.isApproved\n' +
			'FROM event a\n' +
			'LEFT JOIN event_tags b ON a.event_id = b.event_id\n' +
			'LEFT JOIN tags c ON b.tag_id = c.tag_id\n' +
			'LEFT JOIN vendor d ON a.vendor_id = d.user_id';
		db.query(sql, (err, result) => {
			if (err) {
				throw err;
			} else {
				res.render('admin.hbs', {
					data: result
				});
			}
		});
	}
});

app.get('/vendor/:vendor_id', (req, res) => {
	if (!req.cookies.i || !req.session.user) {
		res.redirect('/logout')
	} else if (req.params.vendor_id != req.session.user.user_id || req.session.user.user_type != 'vendor') {
		res.redirect('/logout')
	} else {
		var sql_vendor_name = 'select name from vendor where user_id = ?';
		db.query(sql_vendor_name, req.session.user.user_id, (err, result) => {
			if (err) {
				throw err;
			} else {
				var vendor_name = result[0].name;

				var sql_tags = 'select name from tags';
				db.query(sql_tags, (err, result) => {
					if (err) {
						throw err;
					} else {
						var tags_list = result;

						var sql = 'SELECT a.event_id, d.name as vendor_name, a.description, a.name as event, \n' +
							'GROUP_CONCAT(c.name SEPARATOR \', \') as tag_name , date_format(a.start_date, "%Y/%m/%d") as start_date, date_format(a.end_date, "%Y/%m/%d") as end_date, \n' +
							'a.isApproved\n' +
							'FROM event a\n' +
							'LEFT JOIN event_tags b ON a.event_id = b.event_id\n' +
							'LEFT JOIN tags c ON b.tag_id = c.tag_id\n' +
							'LEFT JOIN vendor d ON a.vendor_id = d.user_id\n' +
							'WHERE vendor_id = ? GROUP BY event_id ORDER BY start_date';
						db.query(sql, req.params.vendor_id, (err, result) => {
							if (err) {
								throw err;
							} else {
								// console.log(req.session.user)
								// console.log(result[0])
								// console.log(result[0].vendor_name);
								// let vendorName = "";
								// if (result.length !== 0) {
								// 	let vendorName = result[0].vendor_name;
								// }
								res.render('vendor.hbs', {
									data: result,
									vendor: vendor_name,
									tags: tags_list
								});
							}
						});
					}
				});


			}
		});

	}
});
//
// app.post('/add_event', (req, res)=>{
// 	var sql_add = 'insert into event set ?';
//
// 	var data = req.body;
// 	console.log(data);
//     db.query(sql_add,data, (err, result) => {
//         if (err) {
//             throw err;
//         } else {
//             res.redirect('/');
//         }
//     });
// });

app.get('/delete/:event_id', (req, res) => {
	var sql_delete_tag = 'delete from event_tags where event_id = ?';
	db.query(sql_delete_tag, req.params.event_id, (err, result) => {
		if (err) {
			throw err;
		} else {
			var sql_delete_event = 'delete from event where event_id = ?';
			db.query(sql_delete_event, req.params.event_id, (err, result) => {
				if (err) {
					throw err;
				} else {
					// console.log(req.session.user.user_id);
					res.redirect('/vendor/' + req.session.user.user_id);
				}
			});
		}
	});

});

app.get('/editor', (req, res) => {
	if (!req.cookies.i) {
		res.redirect('/login')
	} else {
		res.render('editor.hbs', {});
	}
});

// const dummyDB = { subscription: null }; //dummy db, for test purposes

const saveToDatabase = async (subscription, user_id) => {
	// console.log(subscription)
	let inputs = [
		user_id,
		subscription.endpoint,
		subscription.keys.p256dh,
		subscription.keys.auth
	]
	// console.log(inputs)
	let sql = "INSERT INTO subscriptions (parent_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)"

	db.query(sql, inputs, (err, result) => {
		if (err) {
			console.log(err)
			// throw err;
		} else {
			console.log("1 subscription added to user " + user_id);
		}
	});
	// console.log(test == subscription);
	// dummyDB.subscription = subscription;
};

const getSubscriptions = async (user_id) => {
	let result = await new Promise((resolve, reject) => {
		let sql = "SELECT * FROM subscriptions WHERE parent_id = ?"
		db.query(sql, user_id, (err, result) => {
			if (err) {
				console.log(err)
				reject(err)
			} else if (result.length == 0) {
				console.log("No subscriptions found for " + user_id);
				resolve([])
			} else {
				let subscriptions = []
				let temp = {
					endpoint: "",
					expirationTime: null,
					keys: {
						p256dh: "",
						auth: ""
					}
				}
				for (let i = 0; i < result.length; i++) {
					temp.endpoint = result[i].endpoint;
					temp.expirationTime = result[i].expirationTime;
					temp.keys.p256dh = result[i].p256dh;
					temp.keys.auth = result[i].auth;
					subscriptions.push(temp);
				}
				resolve(subscriptions)
			}

		})

	});
	// console.log(result);
	return result
}

app.post('/saveSubscription', async (req, res) => {
	if (!req.cookies.i || !req.session.user) {
		res.redirect('/login')
	} else {
		const subscription = req.body;
		// console.log(subscription)
		await saveToDatabase(subscription, req.session.user.user_id);
		res.json({ message: 'success' });
	}
});

const vapidKeys = {
	publicKey:
		'BI01Zbibo97CgCD60S9MO6HhlAbcTtfGOIayxUKG3o5QJbfU3eVMT3v_T-i2r7rK6QH8Zbv1So2VrPsT4FTjaes',
	privateKey: 'MlG2jt47B8g9TXDao9AvxKslCn2zwi9Vhe6qDPByzDg'
};

webpush.setVapidDetails('mailto:thingsmykidsdo.bcit@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

app.post('/text-me', async (req, res) => {
	if (!req.cookies.i || !req.session.user) {
		res.redirect('/login')
	} else {
		// console.log("trying to send...");
		let subscriptions = await getSubscriptions(req.session.user.user_id);
		// console.log(subscriptions)
		if (subscriptions) {
			// console.log("got subscription")
			try {
				for (let i = 0; i < subscriptions.length; i++) {
					webpush.sendNotification(subscriptions[i], req.body.message);
				}
			} catch (err) {
				console.log("BIG ERROR SENDING NOTIFICATIONS (Probably MySQL related)");
				res.json({ message: err });
			}
			message = "Sent " + req.body.message + " " + subscriptions.length + " times."
			console.log(message);
			res.json({ message: message });
		} else {
			res.json({ message: "Unsuccesful" })
		}
	}
});

app.get('/send-notification', (req, res) => {
	if (!req.cookies.i || !req.session.user) {
		res.redirect('/login')
	} else {
		res.render('notification.hbs', {});
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.cookie('i', true, { expires: new Date() });
	res.redirect('/login');
});


server.listen(port, function (err) {
	if (err) {
		console.log(err);
		return false;
	}

	console.log(port + ' is running');
	db;
});
