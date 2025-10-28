require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const smsRoutes = require("./routes/smsRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Serve OpenAPI and Swagger UI
let swaggerUi;
try {
  swaggerUi = require("swagger-ui-express");
} catch (e) {
  console.warn(
    "swagger-ui-express not installed; /docs will be unavailable until you run npm install"
  );
}

// Minimal OpenAPI spec embedded to avoid filesystem JSON issues
const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "MediReach API (embedded)",
    version: "1.0.0",
    description: "Embedded minimal API spec for auth and appointments.",
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  paths: {
    "/api/auth/register": { post: { summary: "Register user" } },
    "/api/auth/login": { post: { summary: "Login by phone" } },
    "/api/appointments": { post: { summary: "Create appointment" } },
  },
};

// expose the embedded spec and mount swagger UI if available
app.get("/openapi.json", (req, res) => res.json(openapiSpec));
if (swaggerUi) {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, { explorer: true })
  );
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/sms", smsRoutes);

// Root
app.get("/", (req, res) => {
  res.send("MediReach API — visit /health or the /api/* endpoints");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
