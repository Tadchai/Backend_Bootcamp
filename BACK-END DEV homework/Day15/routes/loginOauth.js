const express = require("express");
const router = express.Router();

const {
    AuthGoogle,
    AuthGoogleCallback,
    AuthFacebook,
    AuthFacebookCallback
  } =require("../controllers/loginOauth");
  router.get("/google", AuthGoogle);
  router.get("/google/callback", AuthGoogleCallback);
  router.get("/facebook", AuthFacebook);
  router.get("/facebook/callback", AuthFacebookCallback);
  

module.exports = router;