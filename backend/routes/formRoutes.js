const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

console.log('📦 SMTP Config:');
console.log('HOST:', process.env.SMTP_HOST);
console.log('PORT:', process.env.SMTP_PORT);
console.log('USER:', process.env.SMTP_USER);
console.log('RECEIVER:', process.env.EMAIL_RECEIVER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateEmailHTML = (data) => {
  return `
    <h2>📨 New Form Submission</h2>
    <ul style="line-height: 1.8;">
      ${Object.entries(data).map(([key, val]) =>
        `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val || '-'}</li>`).join('')}
    </ul>
  `;
};

router.post('/contact', async (req, res) => {
  const formData = req.body;

  console.log('📥 Received form data:', formData);

  const mailOptions = {
    from: `"${formData.name || 'Website Form'}" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: `New Form Submission${formData.name ? ' from ' + formData.name : ''}`,
    html: generateEmailHTML(formData),
  };

  console.log('📧 Prepared email:', mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId || info);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Email Error:', err.message, err);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;
