// const express = require("express");
// const router = express.Router();

// const {
//   getDashboardStats,
//   getAllUsers,
//   updateUser,
//   deleteUser,
//   getAllRequests,
//   updateRequest,
//   deleteRequest
// } = require("../controllers/adminController");

// // Dashboard statistics
// router.get("/stats", getDashboardStats);

// // User management
// router.get("/users", getAllUsers);
// router.put("/users/:userId", updateUser);
// router.delete("/users/:userId", deleteUser);

// // Help request management
// router.get("/requests", getAllRequests);
// router.put("/requests/:requestId", updateRequest);
// router.delete("/requests/:requestId", deleteRequest);

// module.exports = router;







const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllRequests,
  updateRequest,
  deleteRequest
} = require("../controllers/adminController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

// Every route below requires:
// 1. Valid JWT
// 2. Admin role
router.use(protect);
router.use(adminOnly);

// Dashboard statistics
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

// Help request management
router.get("/requests", getAllRequests);
router.put("/requests/:requestId", updateRequest);
router.delete("/requests/:requestId", deleteRequest);

module.exports = router;