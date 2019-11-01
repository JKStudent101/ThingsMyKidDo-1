const express = require('express');
const request = require('request');
const router = express.Router();
const db = require('./database').init();

router.post('/', (req, res) => {
    try {
        let address = req.body.address.trim();
        let city = req.body.city.trim();
        let province = req.body.province;
        let admin_id = 1;
        let formed_address = address.replace(/ /g, "+");
        let search_string = "https://maps.googleapis.com/maps/api/geocode/json?address="+formed_address+",+"+city+",+"+province+"&key=AIzaSyAN6q6jOWczlbNgBPd_ljm857YUqpyIoVU";
        let user_id = req.session.user.user_id;
        let description = req.body.description;
        let eventname = req.body.eventname;
        let start_time= req.body.start_time;
        let end_time = req.body.end_time;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let tag = req.body.tag;
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
        geocode.then(res=>{
            var lat = res['lat'];
            var lng = res['lng'];
            let inputs = [
                admin_id,
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
                tag,
            ];

            var sql_insert = "INSERT INTO event(admin_id, vendor_id, description, name, start_time, end_time, start_date, end_date, isApproved, lng, lat, address) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)" ;
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
                                        }
                                    })


                                }
                            })

                        }
                    });


                }
            });
            
        })
        res.redirect('/vendor/' + user_id);        
    }
        
	catch (err) {
        console.log(err);
    }
});

module.exports = router;