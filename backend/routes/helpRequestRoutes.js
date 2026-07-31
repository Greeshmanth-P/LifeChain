console.log('✅ helpRequestRoutes loaded');

const express = require('express');
const router = express.Router();

const {
  createHelpRequest,
  findNearbyHelpRequests,
  acceptHelpRequest,
  getMyRequests,
  completeHelpRequest,
  verifyCompletion
} = require('../controllers/helpRequestController');

router.post('/create', createHelpRequest);
router.post('/nearby', findNearbyHelpRequests);
router.post('/accept', acceptHelpRequest);
router.post('/complete', completeHelpRequest);
router.get('/my', getMyRequests);
router.post("/verify", verifyCompletion);

module.exports = router;