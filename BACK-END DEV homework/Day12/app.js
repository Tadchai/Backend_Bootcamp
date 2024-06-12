const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // ไลบรารีที่ใช้ในการเข้ารหัสและตรวจสอบรหัสผ่าน
const session = require('express-session');
const ejs = require('ejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const app = express();
const port = 3000;

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/PROJECT');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
// ตั้งค่า session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// ตั้งค่า Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hashed_password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// ตั้งค่า Passport LocalStrategy สำหรับการตรวจสอบผู้ใช้
passport.use(new LocalStrategy(async function(username, password, done) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      return done(null, false, { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
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
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ใช้ / เรียก index.ejs
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body; // ดึงข้อมูลจาก req.body
  const salt = await bcrypt.genSalt(10); // สร้างเกลือ (salt) สำหรับการเข้ารหัส
  const hashedPassword = await bcrypt.hash(password, salt); // เข้ารหัสรหัสผ่านที่ถูกส่งมา

  const user = new User({ username, hashed_password: hashedPassword });
  await user.save();

  res.redirect('/');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/'
}));

app.get('/home', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('home.ejs');
  } else {
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
