require("dotenv").config();

// Validate environment variables before starting
const { validateEnvironment } = require("./config/validation");
validateEnvironment();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const smsRoutes = require("./routes/smsRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// ==========================================
// SECURITY MIDDLEWARE (Production)
// ==========================================
const isProduction = process.env.NODE_ENV === "production";

// Security headers with Helmet
if (isProduction) {
  try {
    const helmet = require("helmet");
    app.use(helmet());
    app.set("trust proxy", 1); // Trust Render/cloud proxy
    console.log("✅ Helmet security headers enabled");
  } catch (e) {
    console.warn("⚠️  helmet not installed. Run: npm install helmet");
  }
}

// Rate limiting to prevent abuse
try {
  const rateLimit = require("express-rate-limit");
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProduction ? 100 : 1000, // Stricter in production
    message: {
      error: "Too many requests from this IP, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);
  console.log("✅ Rate limiting enabled");
} catch (e) {
  console.warn(
    "⚠️  express-rate-limit not installed. Run: npm install express-rate-limit"
  );
}

// MongoDB injection sanitization
try {
  const mongoSanitize = require("express-mongo-sanitize");
  app.use(mongoSanitize());
  console.log("✅ MongoDB injection protection enabled");
} catch (e) {
  console.warn(
    "⚠️  express-mongo-sanitize not installed. Run: npm install express-mongo-sanitize"
  );
}

// ==========================================
// CORS CONFIGURATION
// ==========================================
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
console.log("✅ CORS configured for origins:", allowedOrigins);

// ==========================================
// SWAGGER API DOCUMENTATION
// ==========================================
let swaggerUi;
try {
  swaggerUi = require("swagger-ui-express");
} catch (e) {
  console.warn(
    "⚠️  swagger-ui-express not installed; /docs will be unavailable"
  );
}

// Minimal OpenAPI spec
const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "MediReach API",
    version: "1.0.0",
    description:
      "Healthcare appointment management system with SMS notifications",
  },
  servers: [
    {
      url: isProduction
        ? `https://${
            process.env.RENDER_EXTERNAL_HOSTNAME || "api.medireach.com"
          }`
        : `http://localhost:${PORT}`,
    },
  ],
  paths: {
    "/api/auth/register": { post: { summary: "Register new user" } },
    "/api/auth/login": { post: { summary: "Login user" } },
    "/api/appointments": {
      get: { summary: "Get user appointments" },
      post: { summary: "Create appointment" },
    },
    "/api/facilities": { get: { summary: "Get all facilities" } },
    "/health": { get: { summary: "Health check endpoint" } },
  },
};

app.get("/openapi.json", (req, res) => res.json(openapiSpec));
if (swaggerUi) {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, { explorer: true })
  );
}

// ==========================================
// STANDARD MIDDLEWARE
// ==========================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (simple version)
if (!isProduction) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ==========================================
// API ROUTES
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/users", userRoutes);

// ==========================================
// HEALTH & INFO ENDPOINTS
// ==========================================
app.get("/", (req, res) => {
  res.json({
    name: "MediReach API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      health: "/health",
      docs: "/docs",
      api: "/api/*",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler (MUST BE LAST)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed",
    });
  }

  // Don't leak error details in production
  const statusCode = err.status || err.statusCode || 500;
  const response = {
    error: isProduction ? "Internal Server Error" : err.message,
  };

  // Include stack trace in development
  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

// ==========================================
// DATABASE CONNECTION & SERVER START
// ==========================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log(`   Database: ${mongoose.connection.name}`);

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 MediReach API Server`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`   Health Check: http://localhost:${PORT}/health`);
      if (swaggerUi) {
        console.log(`   API Docs: http://localhost:${PORT}/docs`);
      }
      console.log(`\n📱 SMS Provider: ${process.env.SMS_PROVIDER || "mock"}`);
      console.log(`🕐 Timezone: ${process.env.TZ || "UTC"}\n`);
    });

    // ==========================================
    // GRACEFUL SHUTDOWN
    // ==========================================
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} signal received: closing HTTP server`);
      server.close(() => {
        console.log("HTTP server closed");
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed");
          process.exit(0);
        });
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("Forcing shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check your MONGO_URI in .env file");
    console.error(
      "   2. Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for cloud hosting)"
    );
    console.error("   3. Ensure database user has correct permissions");
    console.error("   4. Check if MongoDB service is running (if local)\n");
    process.exit(1);
  });

module.exports = app;
