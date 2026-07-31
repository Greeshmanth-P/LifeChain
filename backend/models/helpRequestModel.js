const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema({

  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  responder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  helpType: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  // GeoJSON location
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  // Request status flow
  status: {
    type: String,
    enum: ["pending", "fulfilled", "waiting_verification", "completed"],
    default: "pending"
  }

}, {
  timestamps: true
});

// Geospatial index for nearby search
helpRequestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("HelpRequest", helpRequestSchema);