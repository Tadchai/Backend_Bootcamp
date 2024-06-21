const express = require("express");
const bcrypt = require('bcrypt');
const db = require("../db");
const router = express.Router();
const saltRounds = 10;
const otp = require("../utils/otp");
const speakeasy = require('speakeasy');

router.get('/', (req, res) => {
    res.render('login.ejs');
  });

router.get('/home', (req, res) => {
    res.render('home.ejs');
  });

router.get('/register', (req,res) =>{
  res.render('register.ejs')
})

router.get('/repassword', (req,res) =>{
  res.render('repassword.ejs')
})

router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
      return res.status(400).send({ error: true, message: 'Please provide complete details' });
  }

  // Hash the password before saving to the database
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
          return res.status(500).send({ error: true, message: 'Error hashing password' });
      }

      const sql = 'INSERT INTO Users (Username, Password, Email, Role) VALUES (?, ?, ?, "user")';
      db.query(sql, [username, hashedPassword, email], (err, result) => {
          if (err) {
              return res.status(500).send({ error: true, message: 'Database error' });
          }
          res.redirect(303,'/');
          //res.send({ error: false, message: 'User registered successfully', data: result.insertId });
      });
  });
});


    



module.exports = router;