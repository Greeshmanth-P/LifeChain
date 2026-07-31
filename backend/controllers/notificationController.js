const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// ==========================================
// GET CURRENT USER NOTIFICATIONS
// GET /api/notifications/my?phone=...
// ==========================================
const getMyNotifications = async (req, res) => {
  try {
    const phone = String(req.query.phone || "")
      .replace(/\D/g, "");

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required"
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const notifications = await Notification.find({
      user: user._id
    })
      .populate(
        "helpRequest",
        "helpType description status createdAt"
      )
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter(
      notification => !notification.seen
    ).length;

    res.status(200).json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch notifications"
    });
  }
};

// ==========================================
// MARK ONE NOTIFICATION AS SEEN
// POST /api/notifications/mark-seen
// ==========================================
const markNotificationAsSeen = async (req, res) => {
  try {
    const {
      phone,
      notificationId
    } = req.body;

    const cleanedPhone = String(phone || "")
      .replace(/\D/g, "");

    if (!cleanedPhone || !notificationId) {
      return res.status(400).json({
        message:
          "Phone and notification ID are required"
      });
    }

    const user = await User.findOne({
      phone: cleanedPhone
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          user: user._id
        },
        {
          $set: {
            seen: true
          }
        },
        {
          new: true
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification marked as seen",
      notification
    });
  } catch (error) {
    console.error(
      "Mark notification error:",
      error
    );

    res.status(500).json({
      message: "Failed to update notification"
    });
  }
};

// ==========================================
// MARK ALL NOTIFICATIONS AS SEEN
// POST /api/notifications/mark-all-seen
// ==========================================
const clearAllNotifications = async (
  req,
  res
) => {
  try {
    const cleanedPhone = String(
      req.body.phone || ""
    ).replace(/\D/g, "");

    if (!cleanedPhone) {
      return res.status(400).json({
        message: "Phone number is required"
      });
    }

    const user = await User.findOne({
      phone: cleanedPhone
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const result =
      await Notification.deleteMany({
        user: user._id
      });

    res.status(200).json({
      message: "All notifications cleared",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error(
      "Clear notifications error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to clear notifications"
    });
  }
};

// ==========================================
// DELETE NOTIFICATION AFTER VIEWING
// DELETE /api/notifications/:notificationId
// ==========================================
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const cleanedPhone = String(
      req.query.phone || ""
    ).replace(/\D/g, "");

    if (!cleanedPhone) {
      return res.status(400).json({
        message: "Phone number is required"
      });
    }

    if (!notificationId) {
      return res.status(400).json({
        message: "Notification ID is required"
      });
    }

    const user = await User.findOne({
      phone: cleanedPhone
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const deletedNotification =
      await Notification.findOneAndDelete({
        _id: notificationId,
        user: user._id
      });

    if (!deletedNotification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification removed"
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    res.status(500).json({
      message: "Failed to remove notification"
    });
  }
};



module.exports = {
  getMyNotifications,
  markNotificationAsSeen,
  clearAllNotifications,
  deleteNotification,
  
};