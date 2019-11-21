const express = require('express');
const request = require('request');
const router = express.Router();
const db = require('../app').db;

router.get('/', (req,res)=> {
        if (!req.cookies.i || !req.session.user) {
            res.redirect('/logout')
        } else if (req.session.user.user_type != 'vendor') {
            res.redirect('/logout')
        } else {
            var sql_tags = 'select name from tags';
            db.query(sql_tags, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    res.render('addevent.hbs', {
                        tags: result,
                        user_type: req.session.user.user_type,
                        vendor_id: req.session.user.user_id,
                        isError: 'false',
                        error: ""
                    })
                }
            })

        }
    }
);


router.post('/', (req, res) => {
    try {
        if (!req.cookies.i || !req.session.user) {
            res.redirect('/logout')
        } else if (req.session.user.user_type != 'vendor') {
            res.redirect('/logout')
        } else {
    
            let address = req.body.address.trim();
            let city = req.body.city.trim();
            let province = req.body.province;
            // let admin_id = 0;
            let format_address = address.replace(/ /g, "+");
            let format_city = city.replace(/ /g, "+");
            let search_string = "https://maps.googleapis.com/maps/api/geocode/json?address=" + format_address + ",+" + format_city + ",+" + province + "&key=AIzaSyAN6q6jOWczlbNgBPd_ljm857YUqpyIoVU";
            let user_id = req.session.user.user_id;
            let description = req.body.description;
            let eventname = req.body.eventname;
            let start_time= req.body.start_time;
            let end_time = req.body.end_time;
            let start_date = req.body.start_date;
            let end_date = req.body.end_date;
            let tag = req.body.tag;
            let link = req.body.link;
            let geocode = new Promise((resolve, reject) => {
                request({
                    url: search_string,
                    json: true
                }, (error, response, body) => {
                    if (error) {
                        reject('Cannot connect to Google Maps');
                    } else if (body.status === 'ZERO_RESULTS'){
                        reject('Cannot find requested address');
                    } else if (body.status === 'OK') {
                        resolve({
                            lat: body.results[0].geometry.location.lat,
                            lng: body.results[0].geometry.location.lng
                        });
                    }
                })
            });
            geocode.then(geores=>{
                var lat = geores['lat'];
                var lng = geores['lng'];
                let inputs = [
                    // admin_id,
                    user_id,
                    description,
                    eventname,
                    start_time,
                    end_time,
                    start_date,
                    end_date,
                    "Pending",
                    lng,
                    lat,
                    address,
                    city,
                    province,
                    link,
                    tag,
                ];

                var sql_insert = "INSERT INTO event(vendor_id, description, name, start_time, end_time, start_date, end_date, isApproved, lng, lat, address, city, province, link) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)" ;
                    db.query(sql_insert, inputs, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        var sql_tag_id = 'select tag_id from tags where name = ?';
                        db.query(sql_tag_id, tag, (err, result)=>{
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
                                            }else{
                                                res.redirect('/vendor/' + user_id);
                                            }
                                        })


                                    }
                                })

                            }
                        });


                    }
                });
                
            }).catch((error)=>{
                // console.log(error);
                var form = {
                    event_name : eventname,
                    start_time: start_time,
                    end_time: end_time,
                    start_date: start_date,
                    end_date: end_date,
                    event_tag: tag,
                    link: link,
                    address: address,
                    city: city,
                    province: province,
                    description: description
                };

                var sql_tags = 'select name from tags';

                db.query(sql_tags, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        res.render('addevent_error.hbs', {
                            tags: result,
                            user_type: req.session.user.user_type,
                            vendor_id: req.session.user.user_id,
                            form: form,
                            isError: 'true',
                            error: "Please provide correct address."
                        })
                    }
                })
            });
        }
    }
        
	catch (err) {
        console.log(err);
    }
});



module.exports = router;