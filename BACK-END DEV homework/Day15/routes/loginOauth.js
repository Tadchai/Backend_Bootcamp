const express = require("express");
const router = express.Router();

const {
    AuthGoogle,
    AuthGoogleCallback,
    AuthFacebook,
    AuthFacebookCallback
    
  } =require("../controllers/loginOauth");

  /**
 * @swagger
 * /loginOauth/google:
 *   get:
 *     summary: Initiate Google login
 *     tags: [Authentication]
 *     description: Redirects the user to Google for authentication.
 *     responses:
 *       302:
 *         description: Redirected to Google for login
 *       500:
 *         description: An error occurred during Google login process
 */
  router.get("/google", AuthGoogle);

  /**
 * @swagger
 * /loginOauth/google/callback:
 *   get:
 *     summary: Google login callback
 *     tags: [Authentication]
 *     description: Handles the callback after Google authentication.
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   description: The authenticated user's details
 *       401:
 *         description: No user found matching Google credentials
 *       500:
 *         description: An error occurred during login
 */
  router.get("/google/callback", AuthGoogleCallback);

  /**
 * @swagger
 * /loginOauth/facebook:
 *   get:
 *     summary: Initiate Facebook login
 *     tags: [Authentication]
 *     description: Redirects the user to Facebook for authentication.
 *     responses:
 *       302:
 *         description: Redirected to Facebook for login
 *       500:
 *         description: An error occurred during Facebook login process
 */
  router.get("/facebook", AuthFacebook);

  /**
 * @swagger
 * /loginOauth/facebook/callback:
 *   get:
 *     summary: Facebook login callback
 *     tags: [Authentication]
 *     description: Handles the callback after Facebook authentication.
 *     responses:
 *       200:
 *         description: Facebook login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   description: The authenticated user's details
 *       401:
 *         description: No user found matching Facebook credentials
 *       500:
 *         description: An error occurred during login
 */
  router.get("/facebook/callback", AuthFacebookCallback);
  

module.exports = router;