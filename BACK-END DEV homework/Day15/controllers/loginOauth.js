const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

// สร้างโมเดล User
const User = sequelize.define('User', {
    User_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Username: { type: DataTypes.STRING, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: true },
    Email: { type: DataTypes.STRING, allowNull: false, unique: true },
    Role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'student' },
    googleId: { type: DataTypes.STRING, allowNull: true, unique: true },
    facebookId: { type: DataTypes.STRING, allowNull: true, unique: true }
}, {
    timestamps: false,
    tableName: 'Users'
});

// เส้นทางสำหรับเริ่มต้นการล็อกอินด้วย Google
exports.AuthGoogle = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};
  
// เส้นทางสำหรับการเรียกกลับหลังจากล็อกอินสำเร็จ
exports.AuthGoogleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
        if (err) { 
            return res.status(500).json({ message: 'An error occurred during Google login process', error: err });
        }
        if (!user) { 
            return res.status(401).json({ message: 'No user found matching Google credentials' });
        }
        req.logIn(user, function(err) {
            if (err) { 
                return res.status(500).json({ message: 'An error occurred during login', error: err });
            }
            return res.status(200).json({ message: 'Google login successful', user });
        });
    })(req, res, next);
};

// เส้นทางสำหรับเริ่มต้นการล็อกอินด้วย Facebook
exports.AuthFacebook = (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
};

// เส้นทางสำหรับการเรียกกลับหลังจากล็อกอินสำเร็จ
exports.AuthFacebookCallback = (req, res, next) => {
    passport.authenticate('facebook', { failureRedirect: '/' }, (err, user, info) => {
        if (err) { 
            return res.status(500).json({ message: 'An error occurred during Facebook login process', error: err });
        }
        if (!user) { 
            return res.status(401).json({ message: 'No user found matching Facebook credentials' });
        }
        req.logIn(user, function(err) {
            if (err) { 
                return res.status(500).json({ message: 'An error occurred during login', error: err });
            }
            return res.status(200).json({ message: 'Facebook login successful', user });
        });
    })(req, res, next);
};

    // ตั้งค่า Passport Strategy สำหรับ Google OAuth
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/loginOauth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            //console.log(profile); // ตรวจสอบข้อมูลโปรไฟล์ที่ได้รับจาก Google
    
            let email = profile.emails && profile.emails[0] && profile.emails[0].value;
            if (!email) {
                console.error("No email found in Google profile");
                return done(new Error("No email associated with this Google account"));
            }
    
            let user = await User.findOne({ where: { googleId: profile.id } });
            if (user) {
                done(null, user);
            } else {
                user = await User.create({
                    Username: profile.displayName,
                    Email: email,
                    googleId: profile.id
                });
                done(null, user);
            }
        } catch (error) {
            done(error, null);
        }
    }));

// ตั้งค่า Passport Strategy สำหรับ Facebook OAuth
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/loginOauth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
            console.error("No email found in Facebook profile");
            return done(new Error("No email associated with this Facebook account"));
        }

        let user = await User.findOne({ where: { facebookId: profile.id } });
        if (user) {
            done(null, user);
        } else {
            user = await User.create({
                Username: profile.displayName,
                Email: email,
                facebookId: profile.id
            });
            done(null, user);
        }
    } catch (error) {
        done(error, null);
    }
}));


// Serialize และ Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.User_ID);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});