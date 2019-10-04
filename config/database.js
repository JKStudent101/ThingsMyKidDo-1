const mysql = require("mysql");

module.exports.init = function(){
    var db = mysql.createConnection({
        host: 'thingmykidsdo.ckcstihnhz8i.us-west-2.rds.amazonaws.com',
        user: 'admin',
        password: 'Password',
        database: 'thingsKidsDo'
    });

    db.connect((err)=>{
        if(err){
            throw err;
        }
        console.log('Successfully connected to MySQL')
    });
};