require('dotenv').config({ path: '../.env' });

const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'your_email@gmail.com',
  subject: 'Test Mail',
  text: 'Hello from Nodemailer',
}).then(() => {
  console.log('✅ Email sent successfully');
}).catch(console.error);
