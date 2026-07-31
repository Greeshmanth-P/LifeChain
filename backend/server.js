// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const connectDB = require('./config/db');

// const userRoutes = require('./routes/userRoutes');
// const helpRequestRoutes = require('./routes/helpRequestRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const loginRoutes = require('./routes/loginRoutes');
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// connectDB();

// app.use('/api/users', userRoutes);
// app.use('/api/help-requests', helpRequestRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/login', loginRoutes);
// app.use("/api/admin", adminRoutes);

// app.get('/', (req, res) => {
//   res.send('✅ LifeChain backend is running');
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));



const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const helpRequestRoutes = require("./routes/helpRequestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const loginRoutes = require("./routes/loginRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allows Thunder Client, Postman and server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("This website is not allowed by CORS")
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/help-requests", helpRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("✅ LifeChain backend is running");
});

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found"
  });
});

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (error.message === "This website is not allowed by CORS") {
    return res.status(403).json({
      message: "Origin not allowed"
    });
  }

  res.status(500).json({
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});