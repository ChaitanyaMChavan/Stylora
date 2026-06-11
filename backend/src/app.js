const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const designerRoutes = require("./routes/designerRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// 1. Basic Middlewares
app.use(cors());
app.use(express.json());

// 2. Route Integrations
app.get("/api/health", (req, res) => {
  res.json({ message: "Stylora backend is healthy" });
});

app.use("/api/auth", authRoutes);

app.use("/api/designers", designerRoutes);

app.use("/api/portfolio", portfolioRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/reviews",reviewRoutes);

// 3. Centralized JSON Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log stack trace for internal server errors
  if (statusCode === 500) {
    console.error("Unhandled Server Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
