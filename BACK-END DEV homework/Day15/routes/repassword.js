const express = require("express");
const router = express.Router();

const {
    SendOTP,
    SendNoti,
    VerifyOTP,
    NewPassword

  } =require("../controllers/repassword");

  /**
 * @swagger
 * /repass/send-otp:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Repassword]
 *     description: Generates an OTP and sends it to the provided email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to which OTP will be sent.
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to send OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

  router.post("/send-otp", SendOTP);

  /**
 * @swagger
 * /repass/send-noti:
 *   post:
 *     summary: Send notification to email
 *     tags: [Repassword]
 *     description: Sends a notification email to the provided email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to which the notification will be sent.
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to send notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
  router.post("/send-noti", SendNoti);

  /**
 * @swagger
 * /repass/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Repassword]
 *     description: Verifies the provided OTP for the given email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address associated with the OTP.
 *               otp:
 *                 type: string
 *                 description: The OTP to be verified.
 *     responses:
 *       200:
 *         description: OTP verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
  router.post("/verify-otp", VerifyOTP);

  /**
 * @swagger
 * /repass/newpass:
 *   post:
 *     summary: Set new password
 *     tags: [Repassword]
 *     description: Updates the password for the user with the given username.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password to set.
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the new password.
 *               username:
 *                 type: string
 *                 description: The username of the user whose password is to be updated.
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Passwords don't match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error occurred while processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
  router.post("/newpass", NewPassword);
  

module.exports = router;