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

app.get('/', (request, response) => {
	response.redirect('/login');
});

app.get('/login', (request, response) => {
	response.render('login.hbs', {});
});

app.get('/register', (request, response) => {
	response.render('register.hbs', {});
});

app.get('/profile', (request, response) => {
	response.render('profile.hbs', {});
});

app.get('/admin', (request, response) => {
    var sql = 'SELECT a.event_id, a.vendor_id, a.description, a.name, c.name as tag_name \n' +
        'FROM event a\n' +
        'LEFT JOIN event_tags b ON a.event_id = b.event_id\n' +
        'LEFT JOIN tags c ON b.tag_id = c.tag_id ';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else {
            response.render('admin.hbs', {
                data: result
            });
        }
    });
});


app.get('/editor', (request, response) => {
	response.render('editor.hbs', {});
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

app.get('/editor', (request, response) => {
	response.render('editor.hbs', {});
});

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
