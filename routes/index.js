const fs = require('fs')
var express = require('express');
var router = express.Router();

////// define the connection by use public/db_connection.json
const { Pool } = require('pg');
let database;
// Read the config.json file
fs.readFile('public/db_connection.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading db_connection file:', err);
    return;
  }
  try {
    const config = JSON.parse(data);
    // Create a database connection using the extracted parameters
    database = new Pool(config);
  } catch (parseErr) {
    console.error('Error parsing db_connection JSON:', parseErr);
  }
});

let text_to_search = '';

/* GET home page. */
router.get('/', function(req, res, next) {
    query = `SELECT * 
    FROM public.google_sadin 
    LIMIT 10;`
    user_text_to_search = text_to_search;
    database.query(query, (error, data) => {
        if (error) {
          throw error
        }
        else{
            console.log("sucsses!!");
            results = data.rows;
        } 
        console.log(results)
        res.render('homepage', { user_text_to_search: user_text_to_search , results : '' });
    });
});

router.post('/user_search', function(req, res, next){
    text_to_search = req.body.search_value
    console.log("text_to_search:", text_to_search);
    res.redirect('/homepage_search');
});

router.get('/homepage_search', function(req, res, next) {
    query = `
    SELECT *, similarity(REPLACE('${text_to_search}', '?', ''), question) AS relevance_score
    FROM public.google_sadin
    WHERE REPLACE('${text_to_search}', '?', '') % question 
    /* WHERE similarity(REPLACE('${text_to_search}', '?', ''), question) > 0 */
    ORDER BY relevance_score DESC
    LIMIT 10;`

    user_text_to_search = text_to_search;
    text_to_search ='';
    database.query(query, (error, data) => {
        if (error) {
          throw error
        }
        else{
            console.log("sucsses!!");
            results = data.rows;
        } 
        //console.log(results)
    //res.render('homepage', { user_text_to_search: user_text_to_search , results : results });
    res.render('results', { user_text_to_search: user_text_to_search , results : results });
  });
});

router.post('/user_view_result', function(req, res, next){
  query = `
    UPDATE public.google_sadin
    SET search_counter = search_counter+1
    WHERE id='${req.body.id}';
    `
        database.query(query, (error, data) => {
          if (error) {
            throw error
          }
          else{
            console.log("user open id:",  req.body.id);
              results = data.rows;
          } 
      res.redirect('/homepage_search');
    });
});

module.exports = router;

