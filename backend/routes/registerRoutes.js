const express = require('express');
const router = express.Router();

// Dummy route for now (replace with real controller later)
router.post('/register', async (req, res) => {
  console.log('📥 Received registration:', req.body);
  res.status(200).json({ message: 'User registered successfully' });
});

module.exports = router;
