const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.MYSECRETKEY;

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


module.exports = {
    verifyToken,
    checkRole,
};

