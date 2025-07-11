const express = require('express');
const router = express.Router();

// Replace this with your actual cron job logic
router.get('/run', async (req, res) => {
  try {
    console.log('🔁 Cron job triggered');

    // Example task: console log or DB cleanup
    // await YourModel.deleteMany({ condition });

    res.json({ success: true, message: '✅ Cron job executed successfully' });
  } catch (err) {
    console.error('❌ Cron job error:', err.message);
    res.status(500).json({ success: false, message: 'Cron job failed' });
  }
});

module.exports = router;
