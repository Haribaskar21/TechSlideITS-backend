// routes/formRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Endpoint: POST /api/contact
router.post('/contact', async (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    website,
    type,
    live,
    integration,
    message
  } = req.body;

  const mailOptions = {
    from: `"${name || 'Contact Form'}" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: `New Form Submission from ${name || 'Someone'}`,
    html: `
      <h2>📝 Contact Details</h2>
      <p><strong>Name:</strong> ${name || '-'}</p>
      <p><strong>Email:</strong> ${email || '-'}</p>
      <p><strong>Phone:</strong> ${phone || '-'}</p>
      <p><strong>Company:</strong> ${company || '-'}</p>
      <p><strong>Website:</strong> ${website || '-'}</p>
      <p><strong>Type:</strong> ${type || '-'}</p>
      <p><strong>Live:</strong> ${live || '-'}</p>
      <p><strong>Integration:</strong> ${integration || '-'}</p>
      <p><strong>Message:</strong><br>${message || '-'}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Email Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

router.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"TechSlide Mailer" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: "✅ SMTP Test Email",
      html: "<h3>This is a test email from TechSlide server. If you're seeing this, SMTP is working.</h3>",
    });

    res.status(200).send("✅ Test email sent successfully!");
  } catch (error) {
    console.error("❌ SMTP Test Failed:", error.message);
    res.status(500).send("❌ SMTP test failed: " + error.message);
  }
});


module.exports = router;
