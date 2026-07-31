// // backend/routes/loginRoutes.js

// const express = require('express');
// const router = express.Router();
// const User = require('../models/userModel'); // Make sure the path to your User model is correct

// // POST /api/login - User Login
// router.post('/', async (req, res) => {
//     const { phone } = req.body;

//     try {
//         const user = await User.findOne({ phone });

//         if (!user) {
//             return res.status(404).json({ message: "User not found with that phone number." });
//         }

//         // In a real app, you would also check a password here
//         // For now, we just confirm the user exists

//         res.status(200).json({
//             message: "Login successful!",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 phone: user.phone,
//                 roles: user.roles // Ensure roles are sent back
//             }
//         });

//     } catch (error) {
//         console.error("Server error during login:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;







// const express = require('express');
// const router = express.Router();
// const User = require('../models/userModel');

// // POST /api/login
// router.post('/', async (req, res) => {
//   try {

//     const { phone } = req.body;

//     if (!phone) {
//       return res.status(400).json({
//         message: "Phone number required"
//       });
//     }

//     const user = await User.findOne({ phone });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     // ✅ SEND ROLE CORRECTLY (IMPORTANT)
//     res.status(200).json({
//       id: user._id,
//       name: user.name,
//       phone: user.phone,
//       role: user.role   // 🔥 FIX
//     });

//   } catch (error) {

//     console.error("Login error:", error);

//     res.status(500).json({
//       message: "Server error"
//     });

//   }
// });

// module.exports = router;




const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const router = express.Router();

// ============================
// POST /api/login
// ============================

router.post("/", async (req, res) => {
  try {
    const cleanedPhone = String(
      req.body.phone || ""
    ).replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      return res.status(400).json({
        message:
          "Enter a valid 10-digit Indian mobile number",
      });
    }

    const user = await User.findOne({
      phone: cleanedPhone,
    });

    if (!user) {
      return res.status(404).json({
        message:
          "No account was found with this phone number",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from the backend environment"
      );

      return res.status(500).json({
        message:
          "Server authentication configuration is missing",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        phone: user.phone,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

module.exports = router;