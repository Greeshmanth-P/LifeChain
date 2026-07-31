// const mongoose = require("mongoose");
// const User = require("../models/userModel");

// // ============================
// // VALIDATION HELPERS
// // ============================

// const cleanPhoneNumber = (phone) => {
//   return String(phone || "").replace(/\D/g, "");
// };

// const isValidIndianPhone = (phone) => {
//   return /^[6-9]\d{9}$/.test(phone);
// };

// const isValidName = (name) => {
//   /*
//     Supports English and other language letters.
//     Allows spaces, apostrophes, periods and hyphens.
//     Minimum: 2 characters
//     Maximum: 50 characters
//   */
//   return /^[\p{L}][\p{L}\s.'-]{1,49}$/u.test(name);
// };

// const validateCoordinates = (latitude, longitude) => {
//   const numericLatitude = Number(latitude);
//   const numericLongitude = Number(longitude);

//   const valid =
//     Number.isFinite(numericLatitude) &&
//     Number.isFinite(numericLongitude) &&
//     numericLatitude >= -90 &&
//     numericLatitude <= 90 &&
//     numericLongitude >= -180 &&
//     numericLongitude <= 180;

//   return {
//     valid,
//     numericLatitude,
//     numericLongitude,
//   };
// };

// // ============================
// // REGISTER
// // ============================

// const registerUser = async (req, res) => {
//   try {
//     console.log("Incoming registration data:", req.body);

//     const {
//       name,
//       phone,
//       skills = [],
//       latitude,
//       longitude,
//     } = req.body;

//     if (
//       !name ||
//       !phone ||
//       latitude === undefined ||
//       longitude === undefined
//     ) {
//       return res.status(400).json({
//         message:
//           "Name, phone number and location are required",
//       });
//     }

//     const cleanedName = String(name).trim();
//     const cleanedPhone = cleanPhoneNumber(phone);

//     if (!isValidName(cleanedName)) {
//       return res.status(400).json({
//         message:
//           "Name must contain valid letters and spaces and must be between 2 and 50 characters",
//       });
//     }

//     if (!isValidIndianPhone(cleanedPhone)) {
//       return res.status(400).json({
//         message:
//           "Enter a valid 10-digit Indian mobile number",
//       });
//     }

//     const {
//       valid: validCoordinates,
//       numericLatitude,
//       numericLongitude,
//     } = validateCoordinates(latitude, longitude);

//     if (!validCoordinates) {
//       return res.status(400).json({
//         message: "Invalid location coordinates",
//       });
//     }

//     const existingUser = await User.findOne({
//       phone: cleanedPhone,
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         message:
//           "A user already exists with this phone number",
//       });
//     }

//     const cleanedSkills = Array.isArray(skills)
//       ? skills
//           .map((skill) => String(skill).trim())
//           .filter(Boolean)
//       : [];

//     const user = await User.create({
//       name: cleanedName,
//       phone: cleanedPhone,

//       // One LifeChain account can act as both roles.
//       role: ["requester", "responder"],

//       skills: cleanedSkills,

//       location: {
//         type: "Point",
//         coordinates: [
//           numericLongitude,
//           numericLatitude,
//         ],
//       },
//     });

//     return res.status(201).json({
//       message: "Registration successful",

//       user: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone,
//         role: user.role,
//         skills: user.skills,
//         location: user.location,
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         message:
//           "A user already exists with this phone number",
//       });
//     }

//     if (error instanceof mongoose.Error.ValidationError) {
//       return res.status(400).json({
//         message: "Invalid registration information",
//       });
//     }

//     return res.status(500).json({
//       message: "Registration failed",
//     });
//   }
// };

// // ============================
// // GET USER BY PHONE
// // ============================

// const getUser = async (req, res) => {
//   try {
//     const cleanedPhone = cleanPhoneNumber(
//       req.body.phone
//     );

//     if (!isValidIndianPhone(cleanedPhone)) {
//       return res.status(400).json({
//         message:
//           "Enter a valid 10-digit Indian mobile number",
//       });
//     }

//     const user = await User.findOne({
//       phone: cleanedPhone,
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       id: user._id,
//       name: user.name,
//       phone: user.phone,
//       role: user.role,
//     });
//   } catch (error) {
//     console.error("Get user error:", error);

//     return res.status(500).json({
//       message: "Failed to retrieve user",
//     });
//   }
// };

// // ============================
// // UPDATE LIVE LOCATION
// // ============================

// const updateLocation = async (req, res) => {
//   try {
//     const {
//       phone,
//       latitude,
//       longitude,
//     } = req.body;

//     const cleanedPhone = cleanPhoneNumber(phone);

//     if (!isValidIndianPhone(cleanedPhone)) {
//       return res.status(400).json({
//         message:
//           "Enter a valid 10-digit Indian mobile number",
//       });
//     }

//     if (
//       latitude === undefined ||
//       longitude === undefined
//     ) {
//       return res.status(400).json({
//         message:
//           "Latitude and longitude are required",
//       });
//     }

//     const {
//       valid: validCoordinates,
//       numericLatitude,
//       numericLongitude,
//     } = validateCoordinates(latitude, longitude);

//     if (!validCoordinates) {
//       return res.status(400).json({
//         message: "Invalid location coordinates",
//       });
//     }

//     const user = await User.findOneAndUpdate(
//       {
//         phone: cleanedPhone,
//       },
//       {
//         $set: {
//           location: {
//             type: "Point",
//             coordinates: [
//               numericLongitude,
//               numericLatitude,
//             ],
//           },
//         },
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       message: "Location updated successfully",
//       location: user.location,
//     });
//   } catch (error) {
//     console.error("Location update error:", error);

//     return res.status(500).json({
//       message: "Failed to update location",
//     });
//   }
// };

// // ============================
// // EXPORTS
// // ============================

// module.exports = {
//   registerUser,
//   getUser,
//   updateLocation,
// };






const User = require("../models/userModel");

// ============================
// HELPERS
// ============================

const cleanPhone = (phone) => {
  return String(phone || "").replace(/\D/g, "");
};

const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

const isValidName = (name) => {
  return /^[\p{L}][\p{L}\s.'-]{1,49}$/u.test(
    name
  );
};

const parseCoordinates = (latitude, longitude) => {
  const numericLatitude = Number(latitude);
  const numericLongitude = Number(longitude);

  const valid =
    Number.isFinite(numericLatitude) &&
    Number.isFinite(numericLongitude) &&
    numericLatitude >= -90 &&
    numericLatitude <= 90 &&
    numericLongitude >= -180 &&
    numericLongitude <= 180;

  return {
    valid,
    numericLatitude,
    numericLongitude,
  };
};

// ============================
// REGISTER USER
// ============================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      skills = [],
      latitude,
      longitude,
    } = req.body;

    if (
      name === undefined ||
      phone === undefined ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Name, phone and location are required",
      });
    }

    const cleanedName = String(name).trim();
    const cleanedPhone = cleanPhone(phone);

    if (!isValidName(cleanedName)) {
      return res.status(400).json({
        message:
          "Name must contain letters only and be between 2 and 50 characters",
      });
    }

    if (!isValidPhone(cleanedPhone)) {
      return res.status(400).json({
        message:
          "Enter a valid 10-digit Indian mobile number",
      });
    }

    const {
      valid,
      numericLatitude,
      numericLongitude,
    } = parseCoordinates(latitude, longitude);

    if (!valid) {
      return res.status(400).json({
        message: "Invalid location coordinates",
      });
    }

    const existingUser = await User.findOne({
      phone: cleanedPhone,
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "User already exists with this phone number",
      });
    }

    const cleanedSkills = Array.isArray(skills)
      ? skills
          .map((skill) => String(skill).trim())
          .filter(Boolean)
      : [];

    const user = await User.create({
      name: cleanedName,
      phone: cleanedPhone,
      role: ["requester", "responder"],
      skills: cleanedSkills,
      location: {
        type: "Point",
        coordinates: [
          numericLongitude,
          numericLatitude,
        ],
      },
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        skills: user.skills,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "User already exists with this phone number",
      });
    }

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

// ============================
// UPDATE LOCATION
// ============================

const updateLocation = async (req, res) => {
  try {
    const {
      phone,
      latitude,
      longitude,
    } = req.body;

    const cleanedPhone = cleanPhone(phone);

    if (!isValidPhone(cleanedPhone)) {
      return res.status(400).json({
        message:
          "Enter a valid 10-digit Indian mobile number",
      });
    }

    const {
      valid,
      numericLatitude,
      numericLongitude,
    } = parseCoordinates(latitude, longitude);

    if (!valid) {
      return res.status(400).json({
        message: "Invalid location coordinates",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        phone: cleanedPhone,
      },
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [
              numericLongitude,
              numericLatitude,
            ],
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      location: user.location,
    });
  } catch (error) {
    console.error(
      "Location update error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update location",
    });
  }
};

module.exports = {
  registerUser,
  updateLocation,
};