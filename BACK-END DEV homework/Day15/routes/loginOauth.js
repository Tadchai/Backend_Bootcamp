const express = require("express");
const router = express.Router();

const {
    AuthGoogle,
    AuthGoogleCallback
  } =require("../controllers/loginOauth");
  router.get("/google", AuthGoogle);
  router.get("/google/callback", AuthGoogleCallback);
  

module.exports = router;