const nodemailer = require('nodemailer');
const config = require('../config/env');
require('dotenv').config({ path: '../.env' });
// Create transporter
// NOTE: For Gmail, you need to use App Password, not your login password.
// See: https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

/**
 * Send OTP Email
 * @param {String} to - Receiver email
 * @param {String} otp - OTP Code
 */
const sendOtpEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: `"Choux Cream" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>It will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
        console.log('================================================');
        console.log(`[DEV MODE] Skipping email send. OTP for ${to}: ${otp}`);
        console.log('================================================');
        return;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // In dev mode, we don't want to block the flow if email fails
    if (process.env.NODE_ENV === 'development') {
        return; 
    }
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
};
