// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/dashboard', verifyAdmin, (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});

module.exports = router;
