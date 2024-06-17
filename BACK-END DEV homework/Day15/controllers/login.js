const jwt = require('jsonwebtoken');
const db = require("../db");
const secretKey = process.env.MYSECRETKEY

// Register
exports.LoginSignup = async (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, "user")';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error inserting user' });
        }
        res.json({ message: 'User registered successfully' });
    });
};

// Login
exports.LoginSignin = async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying user:', err);
            return res.status(500).json({ message: 'Error querying user' });
        }
        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, {
                expiresIn: '1h'
            });
            res.status(200).json({ message: 'Login successfully', token });
            
        } else {
            res.status(401).json({ message: `Invalid username or password ${username} , ${password}` });
        }
    });
};
