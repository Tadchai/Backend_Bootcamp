const bcrypt = require('bcrypt');
const db = require("../db");
const saltRounds = 10;


// Register
exports.LoginSignup = async  (req, res) => {
    const { username, password, email } = req.body;
  
    if (!username || !password || !email) {
        return res.status(400).send({ error: true, message: 'Please provide complete details' });
    }
  
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
  };

// Login
 exports.LoginSignin = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
        return res.status(400).send({ error: true, message: 'Please provide complete details' });
    }
  
    const sql = 'SELECT * FROM Users WHERE Username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).send({ error: true, message: 'Database error' });
        }
  
        if (results.length === 0) {
            return res.status(401).send({ error: true, message: 'Invalid username or password' });
        }
  
        const user = results[0];
        
        bcrypt.compare(password, user.Password, (err, isMatch) => {
            if (err) {
                return res.status(500).send({ error: true, message: 'Error comparing passwords' });
            }
  
            if (!isMatch) {
                return res.status(401).send({ error: true, message: 'Invalid username or password' });
            }
  
            res.send({ error: false, message: 'Login successful', user: { id: user.id, username: user.Username, email: user.Email, role: user.Role } });
        });
    });
  };




