const express = require('express');
const port = process.env.PORT || 10000;
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();
const session = require('client-sessions');
const mysql = require('mysql');
const webpush = require('web-push');

// import event routes
const event = require('./routes/event');
app.use('/event', event);

var db = require('./routes/database').init();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname + '/views'));
app.use('/scripts', express.static('build'));
app.use('/css', express.static('style'));

app.use(express.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

const server = require('http').createServer(app);
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res) => {
	res.redirect('/login');
});

app.get('/login', (req, res) => {
	res.render('login.hbs', {});
});

app.get('/register', (req, res) => {
	res.render('register.hbs', {});
});

app.get('/profile', (req, res) => {
	res.render('profile.hbs', {});
});

app.get('/vendor/:vendor_id', (req, res) => {
    var vendor_id = req.params.vendor_id;

	var sql = 'SELECT a.event_id, d.name as vendor_name, a.description, a.name as event, \n' +
		'c.name as tag_name, date_format(a.start_date, "%Y/%m/%d") as start_date, date_format(a.end_date, "%Y/%m/%d") as end_date, \n'+
        'a.status, a.isApproved\n'+
		'FROM event a\n' +
        'LEFT JOIN event_tags b ON a.event_id = b.event_id\n' +
        'LEFT JOIN tags c ON b.tag_id = c.tag_id\n'+
        'LEFT JOIN vendor d ON a.vendor_id = d.user_id\n'+
		'WHERE vendor_id = ?';
    db.query(sql, vendor_id,(err, result) => {
        if (err) {
            throw err;
        } else {
        	// console.log(result[0].vendor_name);
            res.render('vendor.hbs', {
                data: result,
				vendor: result[0].vendor_name
            });
        }
    });
});


app.get('/admin', (req, res) => {
	res.render('admin.hbs', {});
});


// app.get('/admin', (request, response) => {
// 	var sql = 'SHOW COLUMNS FROM Events';
// 	db.query(sql, (err, result) => {
// 		if (err) {
// 			throw err;
// 		} else {
// 			var text = '';
// 			for (var i = 0; i < result.length; i++) {
// 				text += result[i].Field + ' ';
// 			}
// 			// response.send(result[0]);
// 			response.render('admin.hbs', {
				
// 				result: text
// 			});
// 		}
// 	});
// });

// app.get('/editor', (request, response) => {
// 	response.render('editor.hbs', {});
// });

app.get('/logout', (request, response) => {
	response.redirect('/login');
});

const dummyDB = { subscription: null }; //dummy db, for test purposes

const saveToDatabase = async (subscription) => {
	dummyDB.subscription = subscription;
};

app.post('/saveSubscription', async (req, res) => {
	const subscription = req.body;
	await saveToDatabase(subscription);
	res.json({ message: 'success' });
});

const vapidKeys = {
	publicKey:
		'BI01Zbibo97CgCD60S9MO6HhlAbcTtfGOIayxUKG3o5QJbfU3eVMT3v_T-i2r7rK6QH8Zbv1So2VrPsT4FTjaes',
	privateKey: 'MlG2jt47B8g9TXDao9AvxKslCn2zwi9Vhe6qDPByzDg'
};

webpush.setVapidDetails('mailto:myuserid@email.com', vapidKeys.publicKey, vapidKeys.privateKey);

app.post('/text-me', (req, res) => {
	webpush.sendNotification(dummyDB.subscription, req.body.message);
	res.json({ message: req.body.message });
});

app.get('/send-notification', (req, res) => {
	res.render('notification.hbs', {});
});

server.listen(10000, function(err) {
	if (err) {
		console.log(err);
		return false;
	}

	console.log(port + ' is running');
	db;
});
