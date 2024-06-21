const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const otpSecrets = {};

// Send OTP by Email
async function sendOTPViaEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MYGMAIL,
            pass: process.env.MYPASS,
        },
    });

    const mailOptions = {
        from: process.env.MYGMAIL,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

function generateOTP(secret) {
    return speakeasy.totp({
        secret: secret,
        encoding: process.env.ENCODE,
        step: 120,
    });
}

function verifyOTP(email, otp) {
    const secret = otpSecrets[email];
    if (!secret) {
        return false;
    }
    return speakeasy.totp.verify({
        secret: secret,
        encoding: process.env.ENCODE,
        token: otp,
        step: 120,
    });
}

function storeOTPSecret(email, secret) {
    otpSecrets[email] = secret;
}

// OTP to Email
exports.SendOTP = async (req, res) =>{
    const { email } = req.body;
    const secret = speakeasy.generateSecret().base32;
    otpSecrets[email] = secret; // เก็บ OTP secret ของผู้ใช้
    const otp = generateOTP(secret);
  
    try{
        await sendOTPViaEmail(email, otp);
        //res.redirect(200,'/repassword');
        //res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
  };
  
  //confirm OTP
  exports.VerifyOTP= async (req, res) => {
    const { email, otp } = req.body;
    const isValid = verifyOTP(email, otp);
  
    if (isValid) {
        res.status(200).json({ message: 'OTP verification successful' });
    } else {
        res.status(400).json({ error: `Invalid OTP ${email},${otp}` });
    }
  };

// New Password 
exports.NewPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const username = Number(req.params.username);
    const sql =
      "UPDATE Users SET Password = ? WHERE username = ?";
    db.query(
      sql,
      [
        Users.Password,
        username,
      ],
      (err, result) => {
        if (err) {
          res.status(500).json({
            message: "Error occurred while updating product.",
            error: err,
          });
        } else {
          res.status(200).json({ message: "Product updated successfully." });
        }
      }
    );
  };