const express = require("express");
const router = express.Router();

const {
    LoginSignup,
    LoginSignin,

  } =require("../controllers/Login");
  router.post("/signup", LoginSignup);
  router.post("/signin", LoginSignin);
  

module.exports = router;