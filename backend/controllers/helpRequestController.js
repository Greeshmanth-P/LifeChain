const HelpRequest = require("../models/helpRequestModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");


// =============================
// CREATE HELP REQUEST
// =============================
const createHelpRequest = async (req, res) => {
  try {
    const {
      phone,
      description,
      helpType,
      latitude,
      longitude
    } = req.body;

    if (
      !phone ||
      !helpType ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Phone, help type, latitude and longitude are required"
      });
    }

    const cleanedPhone = String(phone).replace(
      /\D/g,
      ""
    );

    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      return res.status(400).json({
        message:
          "Enter a valid 10-digit Indian mobile number"
      });
    }

    const numericLatitude = Number(latitude);
    const numericLongitude = Number(longitude);

    if (
      !Number.isFinite(numericLatitude) ||
      !Number.isFinite(numericLongitude) ||
      numericLatitude < -90 ||
      numericLatitude > 90 ||
      numericLongitude < -180 ||
      numericLongitude > 180
    ) {
      return res.status(400).json({
        message: "Invalid location coordinates"
      });
    }

    const requester = await User.findOne({
      phone: cleanedPhone
    });

    if (!requester) {
      return res.status(404).json({
        message: "Requester not found"
      });
    }

    const cleanedHelpType = String(
      helpType || ""
    ).trim();

    const cleanedDescription = String(
      description || ""
    ).trim();

    if (!cleanedHelpType) {
      return res.status(400).json({
        message: "Help type is required"
      });
    }

    const location = {
      type: "Point",
      coordinates: [
        numericLongitude,
        numericLatitude
      ]
    };

    const helpRequest = await HelpRequest.create({
      requester: requester._id,
      helpType: cleanedHelpType,
      description: cleanedDescription,
      location,
      status: "pending"
    });

    // Find nearby users within 5 km.
    // Do not include role: "responder" because
    // normal users can act as either role.
    const nearbyResponders = await User.find({
      _id: {
        $ne: requester._id
      },
      location: {
        $near: {
          $geometry: location,
          $maxDistance: 5000
        }
      }
    }).select("_id name phone");

    if (nearbyResponders.length > 0) {
      const responderNotifications =
        nearbyResponders.map(responder => ({
          user: responder._id,
          helpRequest: helpRequest._id,
          message:
            `New ${cleanedHelpType} help request available nearby`
        }));

      await Notification.insertMany(
        responderNotifications
      );
    }

    return res.status(201).json({
      message:
        "Help request created successfully",
      helpRequest,
      nearbyUsersNotified:
        nearbyResponders.length
    });
  } catch (error) {
    console.error(
      "Create help request error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create help request"
    });
  }
};



// =============================
// FIND NEARBY REQUESTS
// =============================
// =============================
// FIND NEARBY REQUESTS
// =============================
// =============================
// FIND NEARBY REQUESTS
// =============================
const findNearbyHelpRequests = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Responder phone is required"
      });
    }

    const responder = await User.findOne({ phone });

    if (!responder) {
      return res.status(404).json({
        message: "Responder not found"
      });
    }

    if (
      !responder.location ||
      !Array.isArray(responder.location.coordinates) ||
      responder.location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message: "Responder location is not available"
      });
    }

    const [longitude, latitude] =
      responder.location.coordinates;

    /*
      Return all active nearby requests:

      pending:
      Any responder can accept.

      fulfilled:
      Assigned responder sees Mark Completed.
      Other responders see Accepted by someone.

      waiting_verification:
      Assigned responder sees Waiting for verification.
      Other responders see Completed by another responder.

      completed:
      Not returned, so it disappears from everyone.
    */
    const requests = await HelpRequest.find({
      requester: { $ne: responder._id },

      status: {
        $in: [
          "pending",
          "fulfilled",
          "waiting_verification"
        ]
      },

      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000
        }
      }
    })
      .populate("requester", "name phone location")
      .populate("responder", "name phone location");

    res.json({ requests });

  } catch (err) {
    console.error("Nearby requests error:", err);

    res.status(500).json({
      message: "Failed to fetch requests"
    });
  }
};

// =============================
// ACCEPT HELP REQUEST
// =============================
// =============================
// ACCEPT HELP REQUEST
// =============================
const acceptHelpRequest = async (req, res) => {
  try {
    const { requestId, responderPhone } = req.body;

    const responder = await User.findOne({ phone: responderPhone });

    if (!responder) {
      return res.status(404).json({ message: "Responder not found" });
    }

    // ✅ Atomic update: only accept if still pending
    const request = await HelpRequest.findOneAndUpdate(
      {
        _id: requestId,
        status: "pending"
      },
      {
        $set: {
          status: "fulfilled",
          responder: responder._id
        }
      },
      {
        new: true
      }
    ).populate("requester", "name phone location");

    if (!request) {
      return res.status(400).json({
        message: "Request already accepted or completed"
      });
    }

    await Notification.create({
      user: request.requester._id,
      helpRequest: request._id,
      message: `Your request was accepted by ${responder.name}`
    });

    res.json({
      message: "Request accepted",
      requesterLocation: request.requester.location,
      responderLocation: responder.location,
      requestId: request._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Accept failed" });
  }
};



// =============================
// REQUESTER VIEW (MY REQUESTS)
// =============================
const getMyRequests = async (req, res) => {
  try {

    const { phone } = req.query;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const requests = await HelpRequest.find({
    requester: user._id,
    status: { $ne: "completed" }
}).populate("responder", "name phone location");

    res.json({ requests });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch requests"
    });

  }
};



// =============================
// COMPLETE REQUEST
// =============================
const completeHelpRequest = async (req, res) => {
  try {
    const { requestId, responderPhone } = req.body;

    const responder = await User.findOne({ phone: responderPhone });

    if (!responder) {
      return res.status(404).json({ message: "Responder not found" });
    }

    const request = await HelpRequest.findOneAndUpdate(
      {
        _id: requestId,
        responder: responder._id,
        status: "fulfilled"
      },
      {
        $set: {
          status: "waiting_verification"
        }
      },
      {
        new: true
      }
    ).populate("requester", "name phone location");

    if (!request) {
      return res.status(400).json({
        message: "Only the assigned responder can complete this request"
      });
    }

    await Notification.create({
      user: request.requester._id,
      helpRequest: request._id,
      message: "Responder marked help as completed. Please verify."
    });

    res.json({
      message: "Waiting for requester verification"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to mark completion"
    });
  }
};





const verifyCompletion = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        message: "Request ID is required"
      });
    }

    const request =
      await HelpRequest.findOneAndUpdate(
        {
          _id: requestId,
          status: "waiting_verification"
        },
        {
          $set: {
            status: "completed"
          }
        },
        {
          new: true
        }
      )
        .populate("requester", "name phone")
        .populate("responder", "name phone");

    if (!request) {
      return res.status(400).json({
        message:
          "Request not found or is not waiting for verification"
      });
    }

    if (request.responder?._id) {
      await Notification.create({
        user: request.responder._id,
        helpRequest: request._id,
        message:
          `${request.requester?.name || "The requester"} verified your help. Request completed successfully.`
      });
    }

    res.status(200).json({
      message:
        "Request verified and completed"
    });
  } catch (error) {
    console.error(
      "Verification error:",
      error
    );

    res.status(500).json({
      message: "Verification failed"
    });
  }
};


// =============================
// EXPORT
// =============================
module.exports = {
  createHelpRequest,
  findNearbyHelpRequests,
  acceptHelpRequest,
  getMyRequests,
  completeHelpRequest,
  verifyCompletion
};