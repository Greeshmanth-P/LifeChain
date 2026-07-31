const HelpRequest = require('../models/helpRequestModel');
const User = require('../models/userModel');

const createHelpRequest = async (req, res) => {
  try {
    const { phone, helpType, description, longitude, latitude } = req.body;

    // 1. Find the requester by phone
    const requester = await User.findOne({ phone });
    if (!requester) {
      return res.status(404).json({ message: 'Requester not found' });
    }

    // 2. Create help request
    const newRequest = new HelpRequest({
      requester: requester._id,
      helpType,
      description,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    await newRequest.save();

    res.status(201).json({
      message: 'Help request created successfully',
      request: newRequest,
    });
  } catch (err) {
    console.error('Error creating help request:', err);
    res.status(500).json({
      message: 'Failed to create help request',
      error: err.message,
    });
  }
};

module.exports = {
  createHelpRequest,
};
