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
const request = require('request');

var db = require('./routes/database').init();
module.exports.db = db;

// import event routes
const event = require('./routes/event');
const addevent = require('./routes/addevent');
const wishlist = require('./routes/wishlist')
const profile = require('./routes/profilepage');

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
app.use('/savewishlist', wishlist);
app.use('/profile', profile);
const server = require('http').createServer(app);
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

app.get('/', (req, res) => {
    res.redirect('/landing');
});

app.get('/home', (req, res) => {
    res.render('home.hbs', {
        user_type: req.session.user.user_type,
        vendor_id: req.session.user.user_id
    });
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
                else if (result[0].user_type === 'parent') { res.redirect("/home") }
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

app.post('/registerParent', (req, res) => {

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(req.body.p_pass, salt);

    // console.log(req.body)
    // res.render('not finished')

    let new_parent_user = {
        'type': req.body.type,
        'email': req.body.p_email,
        'password': hash
    }
    let childprofile = req.body.childProfile
    // console.log(childprofile)
    // console.log(new_parent_user);
    sql_user = "INSERT INTO user(user_type, email, pass_hash) VALUES (?,?,?)";
    let input_user_values = [new_parent_user.type, new_parent_user.email, new_parent_user.password]

    db.query(sql_user, input_user_values, function (err, result) {
        if (err) throw err; else {
            sql_select_user_parent_type = 'SELECT user_type from user';
            db.query(sql_select_user_parent_type, function (err, result) {
                sql_user_parent_id = 'SELECT last_insert_id() as parent_id';
                db.query(sql_user_parent_id, function (err, result) {
                    let count = 1
                    let parent_id = result[0].parent_id //54
                    let child_user = {}; // child1:S
                    console.log(parent_id)
                    console.log(result)
                    let index = new_parent_user.email.indexOf('@');
                    let email = new_parent_user.email.substring(0, index);
                    // console.log(email)
                    let sql_parent_tabl_insert = 'INSERT INTO parent(user_id, first_name) VALUES (?, ?)';
                    db.query(sql_parent_tabl_insert, [parent_id, new_parent_user.email], function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            db.query('select user_id from parent', function (err, result) {
                                // sql_parent_parent_id = 'SELECT last_insert_id() as user_parent_id';
                                // console.log(parent_id)
                                // db.query(sql_user_parent_id, function(err, result){
                                if (err) {
                                    console.log(err)
                                } else {
                                    // let child_id = result[0].user_parent_id //54
                                    let child_nickname = []
                                    for (let key in childprofile) {
                                        let value = childprofile[key];

                                        child_nickname.push(value[0])
                                    }
                                    let sql_child_table = 'INSERT INTO child(child_nickname ) VALUES (?)';
                                    let sql_child_values = [parent_id, child_nickname[0]]// 54, child + 1

                                    for (let i = 0; i < child_nickname.length; i++) {

                                        let sql_child_table = 'INSERT INTO child(parent_id, child_nickname ) VALUES (?, ?)';
                                        let sql_child_values = [parent_id, child_nickname[i]]// 54, child + 1

                                        setTimeout(() => {
                                            db.query(sql_child_table, sql_child_values, function (err, result) {

                                                // console.log(parent_id)

                                            })
                                        }, 1000);
                                        

                                    }
                                    result = {
                                        user_id: parent_id,
                                        user_type: 'parent'
                                    }
                                    req.session.user = result;
                                    res.redirect('/home')
                                }
                            })
                        }
                    })

                })
            })

        }
    })


})

app.post('/registerVendor', (req, res) => {
    // console.log(req.body)

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(req.body.Password1, salt);
    let new_vendor = { 'firstname': req.body.FirstName, 'lastname': req.body.LastName, 'org': req.body.Oraganization, 'phonenum': req.body.PhoneNumber, 'address': req.body.BusAddress, 'email': req.body.EmailAddress, 'website': req.body.Website, 'password': hash, 'type': req.body.type }
    // console.log(new_vendor)
    // db.query()
    let sql_insert_vendor_users = 'INSERT INTO user(user_type, email, pass_hash) VALUES (?, ?, ?)'
    let user_values = [new_vendor.type, new_vendor.email, new_vendor.password];

    db.query(sql_insert_vendor_users, user_values, function (err, result) {
        if (err) throw err;
        let sql_select_user = 'SELECT type from user';
        db.query(sql_select_user, user_values.type, function (err, result) {
            let sql_user_id = "SELECT last_insert_id() as user_id";
            db.query(sql_user_id, function (err, result) {
                // console.log(result[0].last_insert_id())
                let user_id = result[0].user_id

                let sql_insert_vendor = 'INSERT INTO vendor (user_id, name, contact_name, address, phone_num, website) VALUES (?,?,?,?,?,?) ';

                let insert_user_values = [user_id, new_vendor.org, new_vendor.firstname + ' ' + new_vendor.lastname, new_vendor.address, new_vendor.phonenum, new_vendor.website]

                db.query(sql_insert_vendor, insert_user_values, function (err, result) {
                    if (err) throw err;
                    res.redirect('/register.hbs')
                })
            })
        })
    })

});


app.get('/admin', (req, res) => {
    if (!req.cookies.i || !req.session.user) {
        res.redirect('/logout')
    } else if (req.session.user.user_type != 'admin') {
        res.redirect('/logout')
    } else {
        res.render('admin_home.hbs')
    }
});

app.get('/admin/event', (req, res) => {
    // console.log(req.cookies);
    if (!req.cookies.i || !req.session.user) {
        res.redirect('/logout')
    } else if (req.session.user.user_type != 'admin') {
        res.redirect('/logout')
    } else {
        var sql = 'SELECT a.event_id, d.name as vendor_name, e.email, d.contact_name, a.description, a.name as event_name, a.isApproved, c.name as tag_name, \n' +
            'concat(a.start_date, \' \', a.start_time) as start_date, concat(a.end_date, \' \', a.end_time) as end_date, a.link as event_link, \n' +
            'concat(a.address, \', \', a.city) as address\n' +
            'FROM event a\n' +
            'LEFT JOIN event_tags b ON a.event_id = b.event_id\n' +
            'LEFT JOIN tags c ON b.tag_id = c.tag_id\n' +
            'LEFT JOIN vendor d ON a.vendor_id = d.user_id\n' +
            'left join user e on d.user_id = e.user_id\n' +
            'ORDER BY a.isApproved DESC, vendor_name, a.start_date';
        db.query(sql, (err, result) => {
            if (err) {
                throw err;
            } else {
                res.render('admin_event.hbs', {
                    data: result
                });
            }
        });
    }
});

app.post('/approve-event', (req, res) => {
    if (!req.cookies.i || !req.session.user) {
        res.redirect('/login')
    } else {
        // console.log('approving')
        let event_id = req.body.id
        let sql = "UPDATE event SET isApproved = 'Approved', admin_id =? WHERE event_id = ?";
        db.query(sql, [req.session.user.user_id, event_id], async (err, result) => {
            if (err) {
                throw err;
            } else {
                console.log(`Event ${event_id} approved`);
                await newEventNotify(event_id);
                res.json({ message: 'success' });
            }
        });
    }
});

app.get('/admin/user', (req, res) => {
    if (!req.cookies.i || !req.session.user) {
        res.redirect('/logout')
    } else if (req.session.user.user_type != 'admin') {
        res.redirect('/logout')
    } else {

        var sql_user = "select user.user_id, user.user_type, user.email, vendor.name as vendor_name, vendor.contact_name, " +
            "vendor.address, vendor.phone_num, vendor.website, vendor.isApproved from user\n" +
            "inner join vendor on user.user_id = vendor.user_id";

        db.query(sql_user, (err, result) => {
            if (err) {
                throw err;
            } else {
                var vendor_data = result;

                var sql_parent = "select user.user_id, user.user_type, user.email, concat(parent.first_name, \" \", parent.last_name) as name\n" +
                    "from user inner join parent on user.user_id = parent.user_id";

                db.query(sql_parent, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        res.render('admin_user.hbs', {
                            vendor_data: vendor_data,
                            parent_data: result
                        });
                    }
                });


            }
        });
    }
});

app.post('/approve-user', (req, res) => {
    if (!req.cookies.i || !req.session.user) {
        res.redirect('/login')
    } else {
        // console.log('approving')
        let user_id = req.body.id
        let sql = "UPDATE vendor SET isApproved = 'Approved' WHERE user_id = ?";
        db.query(sql, user_id , async (err, result) => {
            if (err) {
                throw err;
            } else {
                console.log(`Vendor ${user_id} approved`);
                await newVendorNotify(user_id);
                res.json({ message: 'success' });
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

                        var sql = 'SELECT a.event_id, d.name as vendor_name, a.description, a.name as event_name, concat(a.address, \', \', a.city) as address, \n' +
                            'GROUP_CONCAT(c.name SEPARATOR \', \') as tag_name , concat(a.start_date, \' \', a.start_time) as start_date, concat(a.end_date, \' \', a.end_time) as end_date, \n' +
                            'a.isApproved\n' +
                            'FROM event a\n' +
                            'LEFT JOIN event_tags b ON a.event_id = b.event_id\n' +
                            'LEFT JOIN tags c ON b.tag_id = c.tag_id\n' +
                            'LEFT JOIN vendor d ON a.vendor_id = d.user_id\n' +
                            'WHERE vendor_id = ? GROUP BY event_id ORDER BY a.isApproved DESC, start_date';
                        db.query(sql, req.params.vendor_id, (err, result) => {
                            if (err) {
                                throw err;
                            } else {
                                res.render('vendor.hbs', {
                                    data: result,
                                    vendor: vendor_name,
                                    tags: tags_list,
                                    vendor_id: req.session.user.user_id
                                });
                            }
                        });
                    }
                });


            }
        });

    }
});


app.get('/delete/:event_id', (req, res) => {
    if (!req.cookies.i || !req.session.user) {
        res.redirect('/logout')
    } else if ((req.session.user.user_type != 'vendor') && (req.session.user.user_type != 'admin')) {
        res.redirect('/logout')
    } else {
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
                        res.json({ message: 'success' });
                        // console.log(req.session.user.user_id);
                        // if (req.session.user.user_type == 'vendor') {
                        //     res.redirect('/vendor/' + req.session.user.user_id);
                        // } else if (req.session.user.user_type == 'admin') {
                        //     res.redirect('/admin/event');
                        // }

                    }
                });
            }
        });
    }
});

app.get('/edit/:event_id', (req, res) => {
    if (!req.cookies.i || !req.session.user) {
        res.redirect('/logout')
    } else if ((req.session.user.user_type != 'vendor') && (req.session.user.user_type != 'admin')) {
        res.redirect('/logout')
    } else {
        var sql_tags = 'select name from tags';
        db.query(sql_tags, (err, result) => {
            if (err) {
                throw err;
            } else {
                var tags_list = result;

                var sql_query = 'select a.event_id, a.description, a.name as event_name, a.start_time, a.end_time, a.start_date, a.end_date, a.address, a.city, a.province, a.link, c.name as event_tag\n' +
                    'from event a\n' +
                    'LEFT JOIN event_tags b ON a.event_id = b.event_id\n' +
                    'LEFT JOIN tags c ON b.tag_id = c.tag_id\n' +
                    'where a.event_id=?';
                db.query(sql_query, req.params.event_id, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        // console.log(result[0].start_date.toISOString().split('T')[0]);
                        res.render('editevent.hbs', {
                            data: result[0],
                            start_date: result[0].start_date.toISOString().split('T')[0],
                            end_date: result[0].end_date.toISOString().split('T')[0],
                            tags: tags_list,
                            user_type: req.session.user.user_type,
                            vendor_id: req.session.user.user_id,
                            isError: 'false',
                            error: ""
                        })
                    }
                })

            }
        });
    }
});


app.post('/edit/:event_id', (req, res) => {
    try {
        let address = req.body.address.trim();
        let city = req.body.city.trim();
        let province = req.body.province;
        let formed_address = address.replace(/ /g, "+");
        let search_string = "https://maps.googleapis.com/maps/api/geocode/json?address=" + formed_address + ",+" + city + ",+" + province + "&key=AIzaSyAN6q6jOWczlbNgBPd_ljm857YUqpyIoVU";
        let geocode = new Promise((resolve, reject) => {
            request({
                url: search_string,
                json: true
            }, (error, response, body) => {
                if (error) {
                    reject('Cannot connect to Google Maps');
                } else if (body.status === 'ZERO_RESULTS') {
                    reject('Cannot find requested address');
                } else if (body.status === 'OK') {
                    resolve({
                        lat: body.results[0].geometry.location.lat,
                        lng: body.results[0].geometry.location.lng
                    });
                }
            })
        });
        geocode.then(geores => {
            var lat = geores['lat'];
            var lng = geores['lng'];

            let inputs = [
                req.body.description,
                req.body.eventname,
                req.body.start_time,
                req.body.end_time,
                req.body.start_date,
                req.body.end_date,
                lng,
                lat,
                req.body.address,
                req.body.city,
                req.body.province,
                req.body.link,
                req.params.event_id
            ];
            // console.log(inputs);
            var sql_update = 'update event set description=?, name=?, start_time=?, end_time=?, start_date=?, end_date=?, lng=?, lat=?, address=?, city=?, province=?, link=? where event_id=? ';
            db.query(sql_update, inputs, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    var sql_tag_id = 'select tag_id from tags where name = ?';
                    db.query(sql_tag_id, req.body.tag, (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            var tag_id = result[0].tag_id;
                            // console.log(req.body.tag);
                            // console.log(tag_id);
                            // console.log(req.params.event_id);

                            var sql_update_event_tag = 'update event_tags set tag_id = ? where event_id =?';
                            db.query(sql_update_event_tag, [tag_id, req.params.event_id], (err, result) => {
                                if (err) {
                                    throw err;
                                } else {
                                    if (req.session.user.user_type == 'vendor') {
                                        res.redirect('/vendor/' + req.session.user.user_id);
                                    } else if (req.session.user.user_type == 'admin') {
                                        res.redirect('/admin/event');
                                    }
                                }
                            })
                        }
                    });
                }
            })
        }).catch((error) => {
            var form = {
                event_id: req.params.event_id,
                event_name: req.body.eventname,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                event_tag: req.body.tag,
                link: req.body.link,
                address: req.body.address,
                city: req.body.city,
                province: req.body.province,
                description: req.body.description
            };

            var sql_tags = 'select name from tags';

            db.query(sql_tags, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    res.render('editevent.hbs', {
                        tags: result,
                        data: form,
                        start_date: req.body.start_date,
                        end_date: req.body.end_date,
                        user_type: req.session.user.user_type,
                        vendor_id: req.session.user.user_id,
                        isError: 'true',
                        error: "Please provide correct address."
                    })
                }
            })
        });

    }
    catch (err) {
        console.log(err);
    }
});



app.get('/test', (req, res) => {
    res.render('admin_event.hbs')
});

app.get('/landing', (req, res) => {
    res.render('landing.hbs')
});

app.get('/landing', (req, res) => {
    res.render('landing.hbs')
});

const saveToDatabase = async (subscription, user_id) => {
    // console.log(subscription)
    let inputs = [
        user_id,
        subscription.endpoint,
        subscription.keys.p256dh,
        subscription.keys.auth
    ]
    // console.log(inputs)
    let sql = "INSERT INTO subscriptions (user_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)"

    db.query(sql, inputs, (err, result) => {
        if (err) {
            console.log(err)
            // throw err;
        } else {
            console.log("1 subscription added to user " + user_id);
        }
    });
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

const newEventNotify = async (event_id) => {
    // console.log("sending notification")
    let results = await new Promise((resolve, reject) => {
        let sql = "SELECT e.event_id, e.description, c.child_nickname, e.name, s.user_id, s.endpoint, s.expirationTime, s.p256dh, s.auth " +
            "FROM subscriptions as s " +
            "INNER JOIN user as u ON u.user_id = s.user_id " +
            "INNER JOIN parent as p ON p.user_id = u.user_id " +
            "INNER JOIN child as c ON c.parent_id = p.user_id " +
            "INNER JOIN child_tags as ct ON ct.parent_id = c.parent_id " +
            "INNER JOIN tags as t ON t.tag_id = ct.tag_id " +
            "INNER JOIN event_tags as et ON et.tag_id = t.tag_id " +
            "INNER JOIN event as e ON e.event_id = et.event_id " +
            "WHERE et.event_id = ? " +
            "GROUP BY s.user_id, s.endpoint;"
        db.query(sql, event_id, (err, result) => {
            if (err) {
                console.log(err)
                reject(err)
            } else if (result.length == 0) {
                console.log("No subscriptions found for " + user_id);
                resolve([])
            } else {
                resolve(result)
            }

        })

    });
    // console.log(results)
    try {
        for (let i = 0; i < results.length; i++) {
            let subscription = {
                endpoint: results[i].endpoint,
                expirationTime: results[i].expirationTime,
                keys: {
                    p256dh: results[i].p256dh,
                    auth: results[i].auth
                }
            }
            // console.log(subscription)
            let payload = {
                title: `New Event for ${results[i].child_nickname}!\n${results[i].name}`,
                message: results[i].description,
                url: `/event/display/${results[i].event_id}`
            }
            // console.log(payload.url);
            webpush.sendNotification(subscription, JSON.stringify(payload));
            // console.log("Sent!");
        }
    } catch (err) {
        console.log("Error sending notifications")
        console.log(err)
    }
    return results
}

const newVendorNotify = async (vendor_id) => {
    // console.log("sending notification")
    let results = await new Promise((resolve, reject) => {
        let sql = "SELECT v.contact_name, s.user_id, s.endpoint, s.expirationTime, s.p256dh, s.auth " +
            "FROM subscriptions as s " +
            "INNER JOIN user as u ON u.user_id = s.user_id " +
            "INNER JOIN vendor as v ON v.user_id = u.user_id " +
            "WHERE v.user_id = ? " +
            "GROUP BY s.user_id, s.endpoint;"
        db.query(sql, vendor_id, (err, result) => {
            if (err) {
                console.log(err)
                reject(err)
            } else if (result.length == 0) {
                console.log("No subscriptions found for " + vendor_id);
                resolve([])
            } else {
                resolve(result)
            }

        })

    });
    // console.log(results)
    try {
        for (let i = 0; i < results.length; i++) {
            let subscription = {
                endpoint: results[i].endpoint,
                expirationTime: results[i].expirationTime,
                keys: {
                    p256dh: results[i].p256dh,
                    auth: results[i].auth
                }
            }
            // console.log(subscription)
            let payload = {
                title: `Account Approval`,
                message: `Congratulations ${results[i].contact_name}, your account has been approved!\nStart getting the word out about your events now!`,
                url: `/vendor/${results[i].user_id}`
            }
            // console.log(payload.url);
            webpush.sendNotification(subscription, JSON.stringify(payload));
            // console.log("Sent!");
        }
    } catch (err) {
        console.log("Error sending notifications")
        console.log(err)
    }
    return results
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


const deleteFromDatabase = async (subscription, user_id) => {
    // console.log(subscription)
    let inputs = [
        user_id,
        subscription.endpoint,
    ]
    // console.log(inputs)
    let sql = "DELETE FROM subscriptions WHERE (user_id = ?) AND (endpoint = ?)"

    db.query(sql, inputs, (err, result) => {
        if (err) {
            console.log(err)
            // throw err;
        } else {
            console.log("1 subscription deleted from user " + user_id);
        }
    });
};

app.post('/deleteSubscription', async (req, res) => {
    if (!req.cookies.i || !req.session.user) {
        res.redirect('/login')
    } else {
        const subscription = req.body;
        // console.log(subscription)
        await deleteFromDatabase(subscription, req.session.user.user_id);
        res.json({ message: 'success' });
    }
});

const vapidKeys = {
    publicKey: 'BI01Zbibo97CgCD60S9MO6HhlAbcTtfGOIayxUKG3o5QJbfU3eVMT3v_T-i2r7rK6QH8Zbv1So2VrPsT4FTjaes',
    privateKey: 'MlG2jt47B8g9TXDao9AvxKslCn2zwi9Vhe6qDPByzDg'
};

webpush.setVapidDetails('mailto:thingsmykidsdo.bcit@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

// app.post('/text-me', async (req, res) => {
//     if (!req.cookies.i || !req.session.user) {
//         res.redirect('/login')
//     } else {
//         // console.log("trying to send...");
//         let subscriptions = await getSubscriptions(req.session.user.user_id);
//         // console.log(subscriptions)
//         if (subscriptions) {
//             // console.log("got subscription")
//             try {
//                 for (let i = 0; i < subscriptions.length; i++) {
//                     webpush.sendNotification(subscriptions[i], req.body.message);
//                 }
//             } catch (err) {
//                 console.log("BIG ERROR SENDING NOTIFICATIONS (Probably MySQL related)");
//                 res.json({ message: err });
//             }
//             message = "Sent " + req.body.message + " " + subscriptions.length + " times."
//             console.log(message);
//             res.json({ message: message });
//         } else {
//             res.json({ message: "Unsuccesful" })
//         }
//     }
// });

// app.get('/send-notification', (req, res) => {
//     if (!req.cookies.i || !req.session.user) {
//         res.redirect('/login')
//     } else {
//         res.render('notification.hbs', {
//             user_type: req.session.user.user_type,
//             vendor_id: req.session.user.user_id
//         });
//     }
// });

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


