// const express = require('express');
// const router = express.Router();

// const {
//   registerUser,
//   getUser,
//   updateLocation
// } = require('../controllers/userController');

// // REGISTER (new user)
// router.post('/register', registerUser);

// // LOGIN (phone only)
// router.post('/login', getUser);

// // UPDATE USER LOCATION
// router.post('/update-location', updateLocation);

// module.exports = router;

const express = require("express");

const {
  registerUser,
  updateLocation,
} = require("../controllers/userController");

const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/update-location
router.post("/update-location", updateLocation);

module.exports = router;