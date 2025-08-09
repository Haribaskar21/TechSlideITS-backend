const express = require('express');
const router = express.Router();

router.get('/run', async (req, res) => {
  try {
    // 🔁 Cron logic here — minimal logging
    console.log('✅ Cron job triggered successfully');

    // Example: silent DB cleanup, job, or API call
    // await SomeModel.deleteMany({ expired: true });

    res.status(200).json({ message: '✅ Cron executed' });
  } catch (err) {
    console.error('❌ Cron job error:');
    res.status(500).json({ message: 'Cron failed' });
  }
});

module.exports = router;
