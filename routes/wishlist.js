const express = require('express');
const router = express.Router();
const db = require('./database').init();

router.post('/', (req, res) => {
    let user_id = req.session.user.user_id;
    let event_id = req.body.eventid;
    let childname = req.body.childname
    let array = [user_id, childname]     
    var sql_select_wishlist = 'select wishlist from child where parent_id = ? AND child_nickname = ?';
    
    db.query(sql_select_wishlist, array, (err, result)=>{
        if (result[0].wishlist != null){
            let wishlist_array = result[0].wishlist.split(",")
            if (wishlist_array.includes(String(event_id))){
                var string = encodeURIComponent('already in wishlist');
                res.redirect('/event?valid=' + string);
            } else {
                wishlist_array.push(String(event_id));
                let wishlist_string = wishlist_array.toString();
                let update_array = [wishlist_string, user_id, childname]
                var sql_update_wishlist = 'update child set wishlist = ? where parent_id = ? and child_nickname = ?';
                db.query(sql_update_wishlist, update_array, (err, result)=>{
                    if(err){
                        console.log(err);
                    }
                    var string = encodeURIComponent('added in wishlist');
                    res.redirect('/event?valid=' + string);
                });
            }
        } else {
            let sql_insert_wishlist = 'update child set wishlist = ? where parent_id = ? and child_nickname = ?';
            let insert_array = [event_id, user_id, childname]
            console.log(insert_array)
            db.query(sql_insert_wishlist, insert_array, (err, result) => {
                if(err){
                    var string = encodeURIComponent('database error');
                    res.redirect('/event?valid=' + string);
                }
                var string = encodeURIComponent('added in wishlist');
                res.redirect('/event?valid=' + string);
            })
        }
    }); 
});

router.post('/delete', (req, res) => {
    let event_id = req.body.eventid;
    let user_id = req.session.user.user_id;
    let nickname = req.body.nickname;
    let array = [user_id, nickname]   
    var sql_select_wishlist = 'select wishlist from child where parent_id = ? AND child_nickname = ?';
    
    db.query(sql_select_wishlist, array, (err, result)=>{
        if (result.length > 0){
            let wishlist_array = result[0].wishlist.split(",");
            let wishlist_array_updated = [];
            for( var i = 0; i < wishlist_array.length; i++){ 
                if ( wishlist_array[i] != String(event_id)) {
                  wishlist_array_updated.push(wishlist_array[i]); 
                }
            }
            let wishlist_string = wishlist_array_updated.toString();
            let sql_update_wishlist = 'update child set wishlist = ? where parent_id = ? AND child_nickname = ?';
            let update_array = [wishlist_string, user_id, nickname]
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
