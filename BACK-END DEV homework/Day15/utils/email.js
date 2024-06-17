const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

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

module.exports = {
    sendOTPViaEmail,
};
