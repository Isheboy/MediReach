/**
 * Environment validation for production deployment
 * Validates that all required environment variables are set
 * Exits the process if critical variables are missing
 */

function validateEnvironment() {
  console.log("🔍 Validating environment configuration...");

  // Critical variables that MUST be set
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("\n❌ ERROR: Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error(
      "\n📝 Please set these in your .env file or hosting dashboard."
    );
    console.error(
      "💡 See .env.example for guidance on setting up environment variables.\n"
    );
    process.exit(1);
  }

  // Validate MongoDB URI format
  if (
    !process.env.MONGO_URI.startsWith("mongodb://") &&
    !process.env.MONGO_URI.startsWith("mongodb+srv://")
  ) {
    console.error(
      "\n❌ ERROR: MONGO_URI must start with 'mongodb://' or 'mongodb+srv://'"
    );
    process.exit(1);
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET.length < 32) {
    console.error(
      "\n❌ ERROR: JWT_SECRET must be at least 32 characters long for security"
    );
    console.error(
      "💡 Generate a secure secret with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"\n"
    );
    process.exit(1);
  }

  // Warn about SMS configuration
  if (
    process.env.SMS_PROVIDER === "twilio" &&
    process.env.NODE_ENV === "production"
  ) {
    const twilioVars = [
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_FROM",
    ];
    const missingTwilio = twilioVars.filter((key) => !process.env[key]);

    if (missingTwilio.length > 0) {
      console.warn(
        "\n⚠️  WARNING: Twilio SMS provider selected but missing variables:"
      );
      missingTwilio.forEach((key) => console.warn(`   - ${key}`));
      console.warn("   SMS notifications may not work correctly.\n");
    }
  }

  if (
    process.env.SMS_PROVIDER === "africastalking" &&
    process.env.NODE_ENV === "production"
  ) {
    const atVars = ["AT_USERNAME", "AT_API_KEY"];
    const missingAT = atVars.filter((key) => !process.env[key]);

    if (missingAT.length > 0) {
      console.warn(
        "\n⚠️  WARNING: Africa's Talking SMS provider selected but missing variables:"
      );
      missingAT.forEach((key) => console.warn(`   - ${key}`));
      console.warn("   SMS notifications may not work correctly.\n");
    }
  }

  // Warn about CORS configuration
  if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
    console.warn(
      "\n⚠️  WARNING: FRONTEND_URL not set. CORS may not work correctly."
    );
    console.warn(
      "   Set this to your frontend domain (e.g., https://your-app.vercel.app)\n"
    );
  }

  console.log("✅ Environment validation passed");
  console.log(`📦 Running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`📱 SMS Provider: ${process.env.SMS_PROVIDER || "mock"}`);
  console.log(`🌍 Timezone: ${process.env.TZ || "UTC"}\n`);
}

module.exports = { validateEnvironment };
