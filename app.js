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
const addevent = require('./routes/addevent');

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
		extended: false
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
	body('username')
		.isAlphanumeric()
		.trim()
		.not().isEmpty()
		.escape(),
	body('password')
		.not().isEmpty()
		.escape()
], (req, res) => {
	// console.log(req.body)
	var username = req.body.username;
	var password = req.body.password;
	var sql = 'SELECT u.user_id, u.user_type, u.username, u.pass_hash FROM thingsKidsDoModified.user as u ' +
		'WHERE username = ?';
	db.query(sql, username, (err, result) => {
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
				res.cookie('i', bcrypt.hashSync(username, salt));
				req.session.user = result[0];
				if (result[0].user_type === 'admin') {  res.redirect("/admin") }
				else if (result[0].user_type === 'vendor') {  res.redirect(`/vendor/${result[0].user_id}`) }
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
	} else if ( req.session.user.user_type != 'admin'){
		res.redirect('/logout')
	} else {
		var sql = 'SELECT a.event_id, d.name as vendor_name, a.description, a.name as event, \n' +
        'c.name as tag_name, date_format(a.start_date, "%Y/%m/%d") as start_date, date_format(a.end_date, "%Y/%m/%d") as end_date, \n'+
        'a.status, a.isApproved\n'+
        'FROM event a\n' +
        'LEFT JOIN event_tags b ON a.event_id = b.event_id\n' +
        'LEFT JOIN tags c ON b.tag_id = c.tag_id\n'+
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
	} else if (req.params.vendor_id != req.session.user.user_id || req.session.user.user_type != 'vendor'){
		res.redirect('/logout')
	} else {
		var sql_vendor_name = 'select name from vendor where user_id = ?';
		db.query(sql_vendor_name, req.session.user.user_id, (err, result)=>{
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
                                    // whichpartial: ()=> {
                                    // 	return 'addevent';
                                    //  }
                                });
                            }
                        });
                    }
                });


            }
		});

	}
});


app.get('/delete/:event_id', (req, res)=>{
	var sql_delete_tag = 'delete from event_tags where event_id = ?';
    db.query(sql_delete_tag, req.params.event_id,(err, result) => {
        if (err) {
            throw err;
        } else {
        	var sql_delete_event = 'delete from event where event_id = ?';
            db.query(sql_delete_event, req.params.event_id,(err, result) => {
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

app.get('/edit/:event_id', (req, res)=>{
    var sql_tags = 'select name from tags';
    db.query(sql_tags, (err,result)=>{
        if(err){
            throw err;
        } else{
            var tags_list = result;

            var sql_query = 'select a.event_id, a.description, a.name, a.start_time, a.end_time, a.start_date, a.end_date, c.name as event_tag\n'+
            'from event a\n'+
            'LEFT JOIN event_tags b ON a.event_id = b.event_id\n'+
            'LEFT JOIN tags c ON b.tag_id = c.tag_id\n'+
            'where a.event_id=?';
            db.query(sql_query, req.params.event_id, (err, result)=>{
                if(err){
                    throw err;
                } else{
                    // console.log(result[0].start_time);
                    res.render('./partials/editevent.hbs',{
                        data: result[0],
                        start_date: result[0].start_date.toISOString().split('T')[0],
                        end_date: result[0].end_date.toISOString().split('T')[0],
                        tags: tags_list
                        // whichpartial: ()=> {
                        //     return 'editevent';
                        // }
                    })
                }
            })

        }
	});
});

app.post('/edit/:event_id', (req, res)=>{
    var inputs = [
        req.body.description,
        req.body.eventname,
        req.body.start_time,
        req.body.end_time,
        req.body.start_date,
        req.body.end_date,
        req.params.event_id
    ];
	// console.log(inputs);
    var sql_update = 'update event set description = ?, name = ?, start_time = ?, end_time = ?, start_date = ?, end_date = ? where event_id = ? ';
    db.query(sql_update, inputs,(err, result)=>{
        if(err){
            throw err;
        } else{
        	var sql_tag_id = 'select tag_id from tags where name = ?';
        	db.query(sql_tag_id, req.body.tag, (err, result)=>{
                if(err){
                    throw err;
                } else{
                	var tag_id = result[0].tag_id;
                	// console.log(req.body.tag);
                	// console.log(tag_id);
                	// console.log(req.params.event_id);

                	var sql_update_event_tag = 'update event_tags set tag_id = ? where event_id =?';
                	db.query(sql_update_event_tag, [tag_id, req.params.event_id], (err,result)=>{
                        if(err){
                            throw err;
                        } else{
                            res.redirect('/vendor/' + req.session.user.user_id);
                        }
					})
                }
			});

        }
	})

});

app.get('/editor', (req, res) => {
	if (!req.cookies.i) {
		res.redirect('/login')
	} else {
		res.render('editor.hbs', {});
	}
});

const dummyDB = { subscription: null }; //dummy db, for test purposes

const saveToDatabase = async (subscription) => {
	dummyDB.subscription = subscription;
};

app.post('/saveSubscription', async (req, res) => {
	if (!req.cookies.i) {
		res.redirect('/login')
	} else {
		const subscription = req.body;
		await saveToDatabase(subscription);
		res.json({ message: 'success' });
	}
});

const vapidKeys = {
	publicKey:
		'BI01Zbibo97CgCD60S9MO6HhlAbcTtfGOIayxUKG3o5QJbfU3eVMT3v_T-i2r7rK6QH8Zbv1So2VrPsT4FTjaes',
	privateKey: 'MlG2jt47B8g9TXDao9AvxKslCn2zwi9Vhe6qDPByzDg'
};

webpush.setVapidDetails('mailto:thingsmykidsdo.bcit@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

app.post('/text-me', (req, res) => {
	if (!req.cookies.i) {
		res.redirect('/login')
	} else {
		webpush.sendNotification(dummyDB.subscription, req.body.message);
		res.json({ message: req.body.message });
	}
});

app.get('/send-notification', (req, res) => {
	if (!req.cookies.i) {
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
