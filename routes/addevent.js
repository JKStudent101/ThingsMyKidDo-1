const express = require('express');

const router = express.Router();
const db = require('./database').init();

router.post('/', (req, res) => {
    try {
        let inputs = [
            req.session.user.user_id,
            req.body.description,
            req.body.eventname,
            req.body.start_time,
            req.body.end_time,
            req.body.start_date,
            req.body.end_date,
            "Pending",
            req.body.tag
        ];

        var sql_insert = "INSERT INTO event(vendor_id, description, name, start_time, end_time, start_date, end_date, isApproved) VALUES (?,?,?,?,?,?,?,?)" ;
            db.query(sql_insert, inputs, (err, result) => {
            if (err) {
                throw err;
            } else {
                var sql_tag_id = 'select tag_id from tags where name = ?';
                db.query(sql_tag_id, req.body.tag, (err, result)=>{
                    if (err) {
                        throw err;
                    } else {
                        var tag_id = result[0].tag_id;
                        var sql_event_id = 'select last_insert_id() as event_id';
                        db.query(sql_event_id, (err, result)=>{
                            if (err) {
                                throw err;
                            } else {
                                var event_id = result[0].event_id;
                                var values =[
                                    event_id,
                                    tag_id
                                ];
                                var sql_insert_event_tag = 'insert into event_tags (event_id, tag_id) values (?,?)';
                                db.query(sql_insert_event_tag, values, (err, result)=>{
                                    if (err) {
                                        throw err;
                                    } else {
                                        res.redirect('/vendor/' + req.session.user.user_id);
                                    }
                                })


                            }
                        })

                    }
                });


            }
        });
    }
	catch (err) {
        console.log(err);
    }
});

module.exports = router;