const express = require('express');
const router = express.Router();

const { createHelpRequest } = require('../controllers/helpController');

// POST /api/help/request
router.post('/request', createHelpRequest);

module.exports = router;
