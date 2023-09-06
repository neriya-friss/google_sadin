const fs = require('fs')
var express = require('express');
var router = express.Router();
var XLSX = require('node-xlsx')
var moment = require('moment');

const Pool = require('pg').Pool
const database = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'google_sadin',
  password: 'Er325242',
  port: 5432,
})

let text_to_search = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage', { title: 'home page', session : req.session });
});

/*
router.post('/edit_cube', function(req, res, next){
    let cube_id = req.body.cube_id;
    let cube_title = req.body.cube_title;
    let cube_content = req.body.cube_content;
    let cube_grade = req.body.cube_grade;
    let user_update = req.session.user_name;
    let cube_position = req.body.cube_position;
    let cube_update_time = moment().format('YYYY-MM-DD HH:mm:ss Z');

    if(cube_position ==''){
        query = ` 
        UPDATE public.cubes
        SET title= '${cube_title}', content='${cube_content}', grade='${cube_grade}', user_update='${user_update}', last_update_time='${cube_update_time}'
        WHERE cube_id = '${cube_id}'`;
    }
    else{
        query = ` 
        UPDATE public.cubes
        SET title= '${cube_title}', content='${cube_content}', grade='${cube_grade}', user_update='${user_update}', last_update_time='${cube_update_time}', position='${cube_position}'
        WHERE cube_id = '${cube_id}'`;
    }
    console.log(query);
    database.query(query, (error) => {
        if (error) {
            throw error
        }
        else{
            console.log("update cube - ", cube_id);
        }
    });
    res.redirect('welcom');
});

*/

module.exports = router;

