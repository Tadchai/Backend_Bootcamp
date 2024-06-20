const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require("../db");
const { Sequelize, DataTypes } = require('sequelize');
// const dotenv = require('dotenv');
// dotenv.config();

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
    Role: { type: DataTypes.STRING, allowNull: true, defaultValue: 'student'  },
    googleId: { type: DataTypes.STRING, allowNull: false, unique: true }
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
      if (err) { return next(err); }
      if (!user) { return res.redirect('/'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/home');
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