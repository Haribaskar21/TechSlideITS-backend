// routes/formRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Reusable function to render any fields
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

  const mailOptions = {
    from: `"TechSlide Web Form" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: `📝 Form Submission from ${formData.name || 'Website'}`,
    html: generateEmailHTML(formData)
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Email Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;
