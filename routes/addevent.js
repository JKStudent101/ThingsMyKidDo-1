const express = require('express');

const router = express.Router();
const db = require('./database');

router.post('/', (req, res) => {
    try {
        let inputs = [
            req.body.description,
            req.body.eventname,
            req.body.starttime,
            req.body.endtime,
            req.body.startdate,
            req.body.enddate,
            req.body.category,
        ]
        let sql = "INSERT INTO thingsKidsDoModified.event(description, name, start_time, end_time, start_date, end_date, category) VALUES (?,?,?,?,?,?,?);"
            db.init().query(sql, inputs, (err, res) => {
            if (err) {
                throw err;
            } else {
                console.log("Add Event Successfully");
            }
        });
    }
	catch (err) {
        console.log(err);
    }
});

module.exports = router;