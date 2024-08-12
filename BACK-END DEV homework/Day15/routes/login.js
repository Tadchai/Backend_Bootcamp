const express = require("express");
const router = express.Router();

const {
    LoginSignup,
    LoginSignin,

  } =require("../controllers/login");

  /**
 * @swagger
 * /login/signup:
 *  post:
 *     summary: Register a new user
 *     tags: [Login]
 *     description: Create a new user account by providing a username, password, and email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       303:
 *         description: The user was registered successfully and redirected to the homepage.
 *       400:
 *         description: Incomplete request data. Username, password, and email are required.
 *       500:
 *         description: Error occurred while hashing password or inserting into the database.
 */
  router.post("/signup", LoginSignup);

  /**
 * @swagger
 * /login/signin:
 *  post:
 *     summary: User login
 *     tags: [Login]
 *     description: Authenticate a user by their username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful. Returns user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "user123"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       400:
 *         description: Incomplete request data. Username and password are required.
 *       401:
 *         description: Invalid username or password.
 *       500:
 *         description: Error occurred while processing the request.
 */

  router.post("/signin", LoginSignin);
  

module.exports = router;