// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// // ======================================
// // VERIFY JWT TOKEN
// // ======================================
// const protect = async (req, res, next) => {
//   try {
//     const authorizationHeader =
//       req.headers.authorization;

//     if (
//       !authorizationHeader ||
//       !authorizationHeader.startsWith("Bearer ")
//     ) {
//       return res.status(401).json({
//         message: "Authentication token is required"
//       });
//     }

//     const token = authorizationHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         message: "Authentication token is required"
//       });
//     }

//     const decodedToken = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     const user = await User.findById(
//       decodedToken.userId
//     ).select("-__v");

//     if (!user) {
//       return res.status(401).json({
//         message: "User belonging to this token no longer exists"
//       });
//     }

//     // Authenticated user is now available
//     // inside controllers as req.user
//     req.user = user;

//     next();
//   } catch (error) {
//     console.error(
//       "JWT authentication error:",
//       error.message
//     );

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         message: "Your session has expired. Please login again."
//       });
//     }

//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({
//         message: "Invalid authentication token"
//       });
//     }

//     return res.status(500).json({
//       message: "Authentication failed"
//     });
//   }
// };

// // ======================================
// // ADMIN AUTHORIZATION
// // ======================================
// const adminOnly = (req, res, next) => {
//   const roles = Array.isArray(req.user?.role)
//     ? req.user.role
//     : [];

//   if (!roles.includes("admin")) {
//     return res.status(403).json({
//       message: "Admin access is required"
//     });
//   }

//   next();
// };

// // ======================================
// // RESPONDER AUTHORIZATION
// // ======================================
// const responderOnly = (req, res, next) => {
//   const roles = Array.isArray(req.user?.role)
//     ? req.user.role
//     : [];

//   if (
//     !roles.includes("responder") &&
//     !roles.includes("admin")
//   ) {
//     return res.status(403).json({
//       message: "Responder access is required"
//     });
//   }

//   next();
// };

// // ======================================
// // REQUESTER AUTHORIZATION
// // ======================================
// const requesterOnly = (req, res, next) => {
//   const roles = Array.isArray(req.user?.role)
//     ? req.user.role
//     : [];

//   if (
//     !roles.includes("requester") &&
//     !roles.includes("admin")
//   ) {
//     return res.status(403).json({
//       message: "Requester access is required"
//     });
//   }

//   next();
// };

// module.exports = {
//   protect,
//   adminOnly,
//   responderOnly,
//   requesterOnly
// };









// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (
//       !authHeader ||
//       !authHeader.startsWith("Bearer ")
//     ) {
//       return res.status(401).json({
//         message: "Authentication token is required"
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         message: "Authentication token is required"
//       });
//     }

//     if (!process.env.JWT_SECRET) {
//       console.error("JWT_SECRET is missing");

//       return res.status(500).json({
//         message: "Server authentication configuration error"
//       });
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     const userId = decoded.userId || decoded.id;

//     if (!userId) {
//       return res.status(401).json({
//         message: "Invalid token payload"
//       });
//     }

//     const user = await User.findById(userId).select("-__v");

//     if (!user) {
//       return res.status(401).json({
//         message: "User account no longer exists"
//       });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.error(
//       "Authentication error:",
//       error.name,
//       error.message
//     );

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         message: "Session expired. Please login again."
//       });
//     }

//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({
//         message: "Invalid authentication token"
//       });
//     }

//     if (error.name === "CastError") {
//       return res.status(401).json({
//         message: "Invalid user information in token"
//       });
//     }

//     return res.status(500).json({
//       message: "Authentication failed"
//     });
//   }
// };

// const adminOnly = (req, res, next) => {
//   if (
//     !req.user ||
//     !Array.isArray(req.user.role) ||
//     !req.user.role.includes("admin")
//   ) {
//     return res.status(403).json({
//       message: "Admin access required"
//     });
//   }

//   next();
// };

// module.exports = {
//   protect,
//   adminOnly
// };





const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Authentication token is required"
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is required"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Server authentication configuration error"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.userId) {
      return res.status(401).json({
        message: "Invalid token payload"
      });
    }

    const user = await User.findById(
      decoded.userId
    ).select("-__v");

    if (!user) {
      return res.status(401).json({
        message: "User account no longer exists"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.name,
      error.message
    );

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again."
      });
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "SyntaxError"
    ) {
      return res.status(401).json({
        message: "Invalid authentication token"
      });
    }

    if (error.name === "CastError") {
      return res.status(401).json({
        message: "Invalid user information in token"
      });
    }

    return res.status(500).json({
      message: "Authentication failed"
    });
  }
};

const adminOnly = (req, res, next) => {
  if (
    !req.user ||
    !Array.isArray(req.user.role) ||
    !req.user.role.includes("admin")
  ) {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly
};