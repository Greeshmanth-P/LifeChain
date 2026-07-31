const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: [String],
    enum: ['requester', 'responder','admin'],
    required: true,
  },
  skills: {
    type: [String],
    default: []
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true  // ✅ This is important!
    },
    coordinates: {
      type: [Number],  // ✅ Should always be [longitude, latitude]
      required: true   // ✅ Make sure this is enforced
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
