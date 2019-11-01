const express = require('express');
const router = express.Router();
const db = require('./database').init();

router.post('/', (req, res) => {
    let user_id = req.session.user.user_id;
    let event_id = req.body.eventid;
    var sql_select_wishlist = 'select wishlist from child where parent_id = ?';
    
    db.query(sql_select_wishlist, user_id, (err, result)=>{
        if (result.length > 0){
            let wishlist_array = result[0].wishlist.split(",")
            if (wishlist_array.includes(String(event_id))){
                res.redirect('/event');
            } else {
                wishlist_array.push(String(event_id));
                let wishlist_string = wishlist_array.toString();
                let update_array = [wishlist_string, user_id]
                var sql_update_wishlist = 'update child set wishlist = ? where parent_id = ?';
                db.query(sql_update_wishlist, update_array, (err, result)=>{
                    if(err){
                        console.log(err);
                    }
                    res.redirect('/event');
                });
            }
        } else {
            let sql_insert_wishlist = 'insert into child(parent_id, wishlist) values (?,?)';
            let insert_array = [user_id, event_id]
            db.query(sql_insert_wishlist, insert_array, (err, result) => {
                if(err){
                    console.log(err);
                }
                res.redirect('/event');
            })
        }
    }); 
});

router.post('/delete', (req, res) => {
    let event_id = req.body.eventid;
    let user_id = req.session.user.user_id;
    var sql_select_wishlist = 'select wishlist from child where parent_id = ?';
    
    db.query(sql_select_wishlist, user_id, (err, result)=>{
        if (result.length > 0){
            let wishlist_array = result[0].wishlist.split(",");
            let wishlist_array_updated = [];
            for( var i = 0; i < wishlist_array.length; i++){ 
                if ( wishlist_array[i] != String(event_id)) {
                  wishlist_array_updated.push(wishlist_array[i]); 
                }
            }
            let wishlist_string = wishlist_array_updated.toString();
            let sql_update_wishlist = 'update child set wishlist = ? where parent_id = ?';
            let update_array = [wishlist_string, user_id]
            db.query(sql_update_wishlist, update_array, (err, result)=>{
                if(err){
                    console.log(err);
                }
                res.redirect('/profile');
            });
        }else{
            console.log('error')
        }
    })

});
module.exports = router;
