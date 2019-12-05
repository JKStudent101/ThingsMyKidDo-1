const express = require('express');
const router = express.Router();
const db = require('../app').db;

router.get('/', (req, res) => {
    if (!req.session.user) {
		req.session.url = '/profile';
		res.redirect('/login')
	} else {
        let user_id = req.session.user.user_id;
        var sql_select_wishlist = 'select wishlist from child where parent_id = ?';
        db.query(sql_select_wishlist, user_id, (err, result) => {
            if (result.length > 0) {
                let sql =
                    'SELECT DISTINCT child_nickname as nickname \n' +
                    'FROM child \n' +
                    'WHERE parent_id =' + user_id;
                db.query(sql, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        let data = [];
                        for (var i = 0; i < result.length; i++) {
                            data.push(result[i]);
                        }
                        res.render('profile.hbs', {
                            data: data,
                            user_type: req.session.user.user_type,
                            vendor_id: req.session.user.user_id
                        });
                    }
                });
            } else {
                res.render('profile.hbs', {
                    user_type: req.session.user.user_type,
                    vendor_id: req.session.user.user_id
                });
            }
        })

    }
});

router.get('/:nickname', (req, res) => {
    if (!req.session.user) {
		req.session.url = `/profile/${req.params.nickname}`;
		res.redirect('/login')
	} else if (req.session.user.user_type != 'parent') {
        res.redirect('/logout')
    } else {
        let nickname = req.params.nickname
        let user_id = req.session.user.user_id;
        let sql_array = [user_id, nickname]
        let sql_select_wishlist = 'select wishlist from child where parent_id = ? AND child_nickname = ?';
        let data = [];
        let events = [];
        let event_sql =
            'select e.*, t.name as category, v.name as vendorname from event as e \n' +
            'inner join event_tags as et on e.event_id = et.event_id \n' +
            'inner join vendor as v on e.vendor_id = v.user_id \n' +
            'inner join tags as t on et.tag_id = t.tag_id;';
        db.query(sql_select_wishlist, sql_array, (err, result) => {
            if (result[0].wishlist != null) {
                let wishlist_array = result[0].wishlist.split(",")
                let name_sql =
                    'SELECT DISTINCT child_nickname as nickname\n' +
                    'FROM child \n' +
                    'WHERE parent_id =' + user_id;
                db.query(name_sql, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        for (var i = 0; i < result.length; i++) {
                            data.push(result[i]);
                        }

                        db.query(event_sql, (err, result) => {
                            if (err) {
                                throw err;
                            } else {
                                for (var i = 0; i < result.length; i++) {
                                    let event_id = result[i].event_id;
                                    if (wishlist_array.includes(String(event_id))) {
                                        result[i].nickname = nickname
                                        if (result[i].category.includes(" ")){
                                            result[i].category = result[i].category.replace(" ", "_")
                                        }
                                        result[i].category = result[i].category.toLowerCase()
                                        events.push(result[i]);
                                    }
                                }
                                res.render('profile.hbs', {
                                    data: data,
                                    events: events,
                                    nickname: nickname,
                                    user_type: req.session.user.user_type,
                                    vendor_id: req.session.user.user_id
                                });
                            }
                        });

                    }
                });

            } else {
                let name_sql =
                    'SELECT DISTINCT child_nickname as nickname\n' +
                    'FROM child \n' +
                    'WHERE parent_id =' + user_id;
                db.query(name_sql, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        for (var i = 0; i < result.length; i++) {
                            data.push(result[i]);
                        }
                        res.render('profile.hbs', {
                            data: data,
                            nickname: nickname,
                            user_type: req.session.user.user_type,
                            vendor_id: req.session.user.user_id
                        });

                    }
                });
            }
        })
    }
});
module.exports = router;
