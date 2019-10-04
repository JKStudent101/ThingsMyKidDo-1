const express = require('express');
const port = process.env.PORT || 10000;
const hbs = require('hbs');
const bodyParser = require("body-parser");
const app = express();
const session = require('client-sessions');
const mysql = require('mysql');

var db = require('./config/database').init();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname + '/views'));
app.use("/scripts", express.static("build"));
app.use("/css", express.static("style"));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended:true
}));


const server = require("http").createServer(app);
hbs.registerPartials(__dirname + '/views/partials');


app.get('/', (request, response) => {
    response.redirect('/login');
});


app.get('/event', (request, response) => {
    response.render('event.hbs', {
        
    });
})

app.get('/login', (request, response) => {
    response.render('login.hbs', {
        
    });
})

app.get('/profile', (request, response) => {
    response.render('profile.hbs', {
        

    });
});


app.get('/admin', (request, response) => {
    var sql = 'SHOW COLUMNS FROM Events';
    db.query(sql, (err, result)=>{
        if (err){
            throw err;
        }else{
            var text = "";
            for (var i =0; i<result.length; i++){
                text += result[i].Field + " ";
            }
            // response.send(result[0]);
            response.render('admin.hbs', {
                result: text
            });
        }

    });
});

app.get('/editor', (request, response) => {
    response.render('editor.hbs', {


    });
});

app.get('/logout', (request, response) => {
    
    response.redirect('/login');
});

server.listen(10000, function(err){
    if(err){
        console.log(err);
        return false;
    }
    
    console.log(port+" is running");
    db;
});