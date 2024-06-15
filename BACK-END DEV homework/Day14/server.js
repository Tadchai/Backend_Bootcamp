const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const dotenv =require('dotenv');
dotenv.config();
const app = express();
const port = 3000;
const users = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin' },
    { id: 2, username: 'user', password: 'user', role: 'user' },
    { id: 3, username: 'guest', password: 'guest', role: 'guest' }
];
const secretKey = process.env.MYSECRETKEY
const otpSecrets = {}; // เก็บ OTP secret ของผู้ใช้

app.use(bodyParser.json());

// Create OTP
function generateOTP(secret) {
    return speakeasy.totp({
        secret: secret,
        encoding: process.env.ENCODE,
        step: 120,
    });
}

// Send OTP by Email
async function sendOTPViaEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MYGMAIL,
            pass: process.env.MYPASS,
        },
    });

    const mailOptions = {
        from: process.env.MYGMAIL,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Verify OTP
function verifyOTP(email, otp) {
    const secret = otpSecrets[email];
    if (!secret) {
        return false; // ถ้าไม่มี secret ในรายชื่อ OTP ของผู้ใช้
    }
    return speakeasy.totp.verify({
        secret: secret,
        encoding: process.env.ENCODE,
        token: otp,
        step: 120,
    });
}

// limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: `Require ${role} role` });
        }
    }
}


app.use('/api/', apiLimiter);

app.get('/api/test/all', (req, res) => {
    res.status(200).json({ message: 'Public content' });
});

app.get('/api/test/user', verifyToken, (req, res) => {
    res.status(200).json({ message: 'User content' });
});

app.get('/api/test/admin', verifyToken, checkRole('admin'), (req, res) => {
    res.status(200).json({ message: 'Admin content' });
});
// Register
app.post('/api/auth/signup', (req, res) => {
    const { username, password, role } = req.body;
    users.push({ id: users.length + 1, username, password, role });
    res.json({ message: 'User registered successfully' });
});

// Login
app.post('/api/auth/signin', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, {
            expiresIn: '1h'
        });
        res.status(200).json({ message: 'Login successfully', token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// OTP to Email
app.post('/api/send-otp', async (req, res) =>{
    const { email } = req.body;
    const secret = speakeasy.generateSecret().base32;
    otpSecrets[email] = secret; // เก็บ OTP secret ของผู้ใช้
    const otp = generateOTP(secret);

    try{
        await sendOTPViaEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

//confirm OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const isValid = verifyOTP(email, otp);

    if (isValid) {
        res.status(200).json({ message: 'OTP verification successful' });
    } else {
        res.status(400).json({ error: 'Invalid OTP'});
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
