const fs = require('fs')
var express = require('express');
var router = express.Router();
var XLSX = require('node-xlsx')
var moment = require('moment');

const Pool = require('pg').Pool
const database = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hatmatz',
  password: 'Er325242',
  port: 5432,
})

let text_to_search = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express', session : req.session });
});

router.post('/login', function(req, res, next){

    let user_name = req.body.user_name;
    let user_password = req.body.user_password;
    if(user_name && user_password)
    {

        query = `
        SELECT * FROM user_login 
        WHERE user_name = '${user_name}'
        `;
        database.query(query, (error, data) => {
            if (error) {
              throw error
            }
            else{
                console.log("i got allll users!");
                if(data.rows.length > 0)
                {
                    for(let count = 0; count < data.rows.length; count++)
                    {
                        if(data.rows[count].user_password == user_password)
                        {
                            req.session.user_id = data.rows[count].user_id;
                            req.session.user_hebrow_name = data.rows[count].hebrow_name;
                            req.session.user_name = user_name;
                            req.session.user_role_id = data.rows[count].user_role_id;
                            res.redirect('welcom');
                        }
                        else
                        {
                            res.send('<h1 style="text-align:center">  הסיסמה איננה נכונה </h1>');
                        }
                    }
                }
                else
                {
                    res.send('<h1 style="text-align:center"> שם המשתמש אינו קיים במערכת</h1>');
                }
                res.end();
            }
        });
    }
    else
    {
        res.send('<h1 style="text-align:center"> נא הכנס שם משתמש וסיסמה </h1>');
        res.end();
    }

});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.redirect("/");
});

router.get('/welcom', function(req, res, next) {
    query = `SELECT *, TO_CHAR(last_update_time, 'HH24:MI DD/MM/YY') AS time_text FROM public.cubes ORDER BY position, last_update_time`;
    database.query(query, (error, data) => {
        if (error) {
          throw error
        }
        else{
            console.log("i got alllll cubes!");
            all_cubes = data.rows;
        } 
    res.render('welcom', { user_hebrow_name: req.session.user_hebrow_name , role_id:req.session.user_role_id, session : req.session, all_cubes : all_cubes, user_text_to_search: text_to_search });
  });
});

router.get('/welcom_search', function(req, res, next) {
    query = `SELECT *, TO_CHAR(last_update_time, 'HH24:MI DD/MM/YY') AS time_text FROM public.cubes WHERE title like '%${text_to_search}%' OR content like '%${text_to_search}%' ORDER BY position, last_update_time`;
    user_text_to_search = text_to_search;
    text_to_search ='';
    database.query(query, (error, data) => {
        if (error) {
          throw error
        }
        else{
            console.log("i got alllll cubes!");
            all_cubes = data.rows;
        } 
    res.render('welcom', { user_text_to_search: user_text_to_search , user_hebrow_name: req.session.user_hebrow_name , role_id:req.session.user_role_id, session : req.session, all_cubes : all_cubes });
  });
});

router.post('/user_search', function(req, res, next){
    text_to_search = req.body.text_to_search;
    res.redirect('welcom_search');
});

router.get('/add_cube', function(req, res, next) {
    res.render('add_cube', {user_hebrow_name: req.session.user_hebrow_name,  user_name: req.session.user_name , role_id:req.session.user_role_id, session : req.session });
});


router.post('/add_cube', function(req, res, next){
    let user_name =  req.session.user_name;
    let cube_title = req.body.cube_title;
    let cube_content = req.body.cube_content;
    let cube_grade = req.body.cube_grade;
    let cube_update_time = moment().format('YYYY-MM-DD HH:mm:ss Z');
    query = ` INSERT INTO public.cubes(
        title, content, grade, user_update, last_update_time)
        VALUES ('${cube_title}', '${cube_content}', '${cube_grade}', '${user_name}', '${cube_update_time}');
        `;

    database.query(query, (error) => {
        if (error) {
            throw error
        }
        else{
            console.log("insertttt!!");
            res.redirect('welcom');
        }
    });
});


router.post('/add_user', function(req, res, next){
    let user_name = req.body.user_name;
    let user_password = req.body.user_password;
    let user_role = req.body.user_role;
    let user_hebrow_name = req.body.user_hebrow_name;
       
    query = ` INSERT INTO public.user_login(
        user_name, user_password, user_role_id, hebrow_name)
        VALUES ('${user_name}', '${user_password}', '${user_role}', '${user_hebrow_name}');
        `;

    database.query(query, (error) => {
        if (error) {
            throw error
        }
        else{
            console.log("new useerrr!!");
            res.redirect('welcom');
        }
    });
});


router.get('/add_user', function(req, res, next) {
    res.render('add_uaer', {user_hebrow_name: req.session.user_hebrow_name,  user_name: req.session.user_name , role_id:req.session.user_role_id, session : req.session });
});


router.post('/delete_cube', function(req, res, next){
    console.log(req);
    let cube_id = req.body.cube_id;
    query = `DELETE FROM public.cubes
	WHERE cube_id = '${cube_id}'`;

    database.query(query, (error) => {
        if (error) {
            throw error
        }
        else{
            console.log("delete cube - ", cube_id);
            res.redirect('welcom');
        }
    });
});

router.post('/edit_cube_form', function(req, res, next){
    console.log(req);
    let cube_id = req.body.cube_id;
    query = `
    SELECT * 
    FROM public.cubes
	WHERE cube_id = '${cube_id}'`;

    database.query(query, (error, data) => {
        if (error) {
            throw error
        }
        else{
            console.log("edit cube - ", cube_id);
            console.log("i got one cubes!");
            one_cube = data.rows[0];
            res.render('edit_cube', { user_hebrow_name: req.session.user_hebrow_name, user_name: req.session.user_name , role_id:req.session.user_role_id, session : req.session, one_cube: one_cube, cube_id: cube_id });
        }
    });
   
});

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



module.exports = router;

