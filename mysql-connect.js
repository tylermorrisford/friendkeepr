const express = require('express');
var mysql = require('mysql');
var cors = require('cors')
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express()
const port = 3005

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {console.log(`Listening on port ${port}`)})

var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "contacts"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Db is connected!");
});

app.post('/api/login', (req, res) => {
    console.log('user requests auth', req.body);
    let email = req.body.email
    let password = req.body.password
    let sql = "SELECT * FROM users WHERE user_email = ?"
    con.query(sql, [email], function (err, result) {
        if (err) throw err;
        if (!result.length) {return res.send({match: false, user_id: 'not found'})}
        let hash = result[0].user_pass;
        let user_id = result[0].user_id
        console.log('id', result[0].user_id);
        bcrypt.compare(password, hash, function(err, result) {
            if (err) throw err;
            res.send({
                match: result, 
                user: user_id
            })
        });
    });
})

// get all friends (READ)
app.get('/api/all_friends', (req, res) => {
    console.log('...getting friends');
    con.query("SELECT * FROM friends", function (err, result, fields) {
        if (err) throw err;
        let data = result;
        res.send({data: data})
    });
})

// add a new friend (CREATE)
app.post('/api/add_new_friend', (req, res) => {
    console.log('(create)request body', req.body)
    let name = req.body.friend_name
    let note = req.body.friend_note.toString()
    let known = parseInt(req.body.known_years)
    let date = new Date().toISOString().split('T')[0]
    let values = [[name, note, known, date]]
    let sql = "INSERT INTO friends (friend_name, friend_note, known_years, submission_date) VALUES ?;"
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        res.send({data: result.affectedRows});
      });
})

// (DELETE) a friend ...sad
app.post('/api/delete_friend', (req, res) => {
    console.log('(delete) request body', req.body)
    let id = req.body.friend_id
    let deleteQuery = `DELETE FROM friends WHERE id = ?`
    con.query(deleteQuery, [id], (err, result) => {
        if (err) throw err;
        res.send({data: result.affectedRows});
    })
})

// (UPDATE) a friend
app.post('/api/update_friend', (req, res) => {
    console.log('(update) request body', req.body)
    let id = req.body.id
    let name = req.body.friend_name
    let note = req.body.friend_note.toString()
    let known = parseInt(req.body.known_years)
    let updateQuery = `UPDATE friends SET friend_name = ?, friend_note = ?, known_years = ? WHERE id = ?`
    con.query(updateQuery, [name, note, known, id], function (err, result) {
        if (err) throw err;
        res.send({data: result.affectedRows});
      });
})


