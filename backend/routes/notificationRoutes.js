const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsSeen,
  clearAllNotifications,
  deleteNotification
} = require("../controllers/notificationController");

router.get("/my", getMyNotifications);

router.post(
  "/mark-seen",
  markNotificationAsSeen
);

// router.post(
//   "/mark-all-seen",
//   markAllNotificationsAsSeen
// );

router.delete(
  "/clear/all",
  clearAllNotifications
);

router.delete(
  "/:notificationId",
  deleteNotification
);

module.exports = router;