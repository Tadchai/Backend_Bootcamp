const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
 
const secretKey = "SECRET_KEY";
 
app.use(bodyParser.json());
 
app.get("/", (req, res) => {
  res.send("Hello World!");
});
 
const users = [
  { id: 1, username: "admin", password: "admin", role: "admin" },
  { id: 2, username: "user", password: "user", role: "user" },
  { id: 3, username: "guest", password: "guest", role: "guest" },
];
 
//register
app.post("/api/auth/signup", (req, res) => {
  const { username, password, role } = req.body;
  users.push({ id: users.length + 1, username, password, role });
  res.json({ message: "User registered successfully" });
});
 
//login
app.post("/api/auth/signin", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
 
  if (user) {
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ message: "Login successfully", token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});
 
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
 
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
 
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
 
app.get("/api/test/all", (req, res) => {
  res.status(200).json({ message: "Public content" });
});
 
app.get("/api/test/user", verifyToken, (req, res) => {
  res.status(200).json({ message: "User content" });
});
 
app.get("/api/test/admin", verifyToken, (req, res) => {
  if (req.user.role === "admin") {
    res.status(200).json({ message: "Admin content" });
  } else {
    res.status(403).json({ message: "Require admin role" });
  }
});
 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;