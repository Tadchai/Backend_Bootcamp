const speakeasy = require('speakeasy');
const otpSecrets = {};

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

module.exports = {
    generateOTP,
    verifyOTP,
    storeOTPSecret,
};
