const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// ส่ง CSRF token กลับไปยัง client ผ่าน cookie
app.get('/csrf-token', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.status(200).json({ csrfToken: req.csrfToken() });
});

// Routes
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
