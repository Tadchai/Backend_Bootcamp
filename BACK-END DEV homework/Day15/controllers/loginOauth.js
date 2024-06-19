const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require("../db");

// เส้นทางสำหรับเริ่มต้นการล็อกอินด้วย Google
exports.AuthGoogle = (req, res, next) => {
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })(req, res, next);
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


  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/loginOauth/google/callback'
  }, async function(accessToken, refreshToken, profile, done) {
    try {
      // ค้นหาผู้ใช้ในฐานข้อมูล MySQL ด้วย googleId
      const [rows, fields] = await db.execute('SELECT * FROM Users WHERE googleId = ?', [profile.id]);
      
      let user;
  
      // ถ้าไม่มีผู้ใช้ ให้สร้างผู้ใช้ใหม่
      if (rows.length === 0) {
        const [insertedRows, insertFields] = await db.execute('INSERT INTO Users (googleId, username) VALUES (?, ?)', [profile.id, profile.displayName]);
        
        user = {
          id: insertedRows.insertId,
          googleId: profile.id,
          username: profile.displayName
        };
      } else {
        user = rows[0];
      }
  
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
      const [rows, fields] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) {
        // ผู้ใช้ไม่พบ จัดการกรณีนี้ (เช่น ส่งข้อความแจ้งเตือน)
        return done(null, false);
      }
      const user = rows[0];
      done(null, user);
    } catch (err) {
      done(err);
    }
  });