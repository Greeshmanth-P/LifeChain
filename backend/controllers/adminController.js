const mongoose = require("mongoose");
const User = require("../models/userModel");
const HelpRequest = require("../models/helpRequestModel");

// ===============================
// ADMIN DASHBOARD STATISTICS
// ===============================
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      requesters,
      responders,
      admins,
      totalRequests,
      pendingRequests,
      fulfilledRequests,
      waitingVerificationRequests,
      completedRequests
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "requester" }),
      User.countDocuments({ role: "responder" }),
      User.countDocuments({ role: "admin" }),

      HelpRequest.countDocuments(),
      HelpRequest.countDocuments({ status: "pending" }),
      HelpRequest.countDocuments({ status: "fulfilled" }),
      HelpRequest.countDocuments({ status: "waiting_verification" }),
      HelpRequest.countDocuments({ status: "completed" })
    ]);

    res.json({
      users: {
        total: totalUsers,
        requesters,
        responders,
        admins
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        fulfilled: fulfilledRequests,
        waitingVerification: waitingVerificationRequests,
        completed: completedRequests
      }
    });
  } catch (err) {
    console.error("Dashboard statistics error:", err);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics"
    });
  }
};

// ===============================
// GET ALL USERS
// ===============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);

    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
};

// ===============================
// UPDATE USER
// ===============================
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, role, skills, location } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (phone && phone !== existingUser.phone) {
      const phoneAlreadyExists = await User.findOne({
        phone,
        _id: { $ne: userId }
      });

      if (phoneAlreadyExists) {
        return res.status(400).json({
          message: "Another user already uses this phone number"
        });
      }
    }

    const allowedRoles = ["requester", "responder", "admin"];

    if (role) {
      if (!Array.isArray(role) || role.length === 0) {
        return res.status(400).json({
          message: "Role must be a non-empty array"
        });
      }

      const invalidRole = role.some(
        userRole => !allowedRoles.includes(userRole)
      );

      if (invalidRole) {
        return res.status(400).json({
          message: "Invalid role provided"
        });
      }
    }

    if (location) {
      const coordinates = location.coordinates;

      if (
        !coordinates ||
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        coordinates.some(coordinate => typeof coordinate !== "number")
      ) {
        return res.status(400).json({
          message: "Location coordinates must be [longitude, latitude]"
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(role !== undefined && { role }),
        ...(skills !== undefined && { skills }),
        ...(location !== undefined && { location })
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-__v");

    res.json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Update user error:", err);

    res.status(500).json({
      message: "Failed to update user"
    });
  }
};

// ===============================
// DELETE USER
// ===============================
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Prevent the logged-in admin from deleting their own account
    if (
      req.user &&
      req.user._id &&
      req.user._id.toString() === userId
    ) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const requesterRequestCount =
      await HelpRequest.countDocuments({
        requester: userId,
      });

    const responderRequestCount =
      await HelpRequest.countDocuments({
        responder: userId,
        status: {
          $in: ["fulfilled", "waiting_verification"],
        },
      });

    if (
      requesterRequestCount > 0 ||
      responderRequestCount > 0
    ) {
      return res.status(400).json({
        message:
          "This user is connected to help requests. Reassign or delete those requests before deleting the user.",
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err);

    return res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

// ===============================
// GET ALL HELP REQUESTS
// ===============================
const getAllRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find()
      .populate("requester", "name phone location")
      .populate("responder", "name phone location")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Get requests error:", err);

    res.status(500).json({
      message: "Failed to fetch requests"
    });
  }
};

// ===============================
// UPDATE HELP REQUEST
// ===============================
const updateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const {
      helpType,
      description,
      status,
      responderId,
      location
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID"
      });
    }

    const request = await HelpRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Help request not found"
      });
    }

    const allowedStatuses = [
      "pending",
      "fulfilled",
      "waiting_verification",
      "completed"
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid request status"
      });
    }

    if (responderId) {
      if (!mongoose.Types.ObjectId.isValid(responderId)) {
        return res.status(400).json({
          message: "Invalid responder ID"
        });
      }

      const responder = await User.findById(responderId);

      if (!responder || !responder.role.includes("responder")) {
        return res.status(400).json({
          message: "Selected user is not a valid responder"
        });
      }

      request.responder = responderId;

      if (request.status === "pending" && !status) {
        request.status = "fulfilled";
      }
    }

    if (status === "pending") {
      request.responder = null;
    }

    if (
      status &&
      ["fulfilled", "waiting_verification", "completed"].includes(status) &&
      !request.responder &&
      !responderId
    ) {
      return res.status(400).json({
        message: "A responder must be assigned for this status"
      });
    }

    if (location) {
      const coordinates = location.coordinates;

      if (
        !coordinates ||
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        coordinates.some(coordinate => typeof coordinate !== "number")
      ) {
        return res.status(400).json({
          message: "Location coordinates must be [longitude, latitude]"
        });
      }

      request.location = location;
    }

    if (helpType !== undefined) {
      request.helpType = helpType;
    }

    if (description !== undefined) {
      request.description = description;
    }

    if (status !== undefined) {
      request.status = status;
    }

    await request.save();

    const updatedRequest = await HelpRequest.findById(requestId)
      .populate("requester", "name phone location")
      .populate("responder", "name phone location");

    res.json({
      message: "Help request updated successfully",
      request: updatedRequest
    });
  } catch (err) {
    console.error("Update request error:", err);

    res.status(500).json({
      message: "Failed to update help request"
    });
  }
};

// ===============================
// DELETE HELP REQUEST
// ===============================
const deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID"
      });
    }

    const request = await HelpRequest.findByIdAndDelete(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Help request not found"
      });
    }

    res.json({
      message: "Help request deleted successfully"
    });
  } catch (err) {
    console.error("Delete request error:", err);

    res.status(500).json({
      message: "Failed to delete request"
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllRequests,
  updateRequest,
  deleteRequest
};