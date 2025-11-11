# 🚀 MediReach Deployment Checklist

## Pre-Deployment Requirements

### 1. Security Hardening

#### Install Security Packages

```bash
cd server
npm install helmet express-rate-limit express-mongo-sanitize
```

#### Update server.js

Add after `const app = express();`:

```javascript
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// Security middleware
if (process.env.NODE_ENV === "production") {
  app.use(helmet()); // Security headers
  app.set("trust proxy", 1); // Trust Render proxy
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use("/api/", limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
```

---

### 2. Environment Configuration

#### Create render.yaml

```yaml
services:
  - type: web
    name: medireach-api
    env: node
    region: oregon
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: SMS_PROVIDER
        value: twilio
      - key: TWILIO_ACCOUNT_SID
        sync: false
      - key: TWILIO_AUTH_TOKEN
        sync: false
      - key: TWILIO_FROM
        sync: false
      - key: TWILIO_MESSAGING_SERVICE_SID
        sync: false
      - key: FRONTEND_URL
        value: https://your-app.vercel.app
      - key: TZ
        value: Africa/Dar_es_Salaam
    healthCheckPath: /health
```

#### Update .env.example

```bash
# Server
PORT=5000
NODE_ENV=development

# Database (REQUIRED)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medireach?retryWrites=true&w=majority

# JWT (REQUIRED - Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_64_character_random_string_here

# Frontend URL (REQUIRED for CORS)
FRONTEND_URL=http://localhost:3000,https://your-production-domain.com

# SMS Provider: 'mock' | 'africastalking' | 'twilio'
SMS_PROVIDER=twilio

# Africa's Talking (if SMS_PROVIDER=africastalking)
AT_USERNAME=sandbox
AT_API_KEY=your_api_key
AT_FROM=MEDIREACH

# Twilio (if SMS_PROVIDER=twilio)
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_FROM=+1234567890
TWILIO_MESSAGING_SERVICE_SID=MGxxxx

# Scheduler
REMINDER_POLL_INTERVAL_SECONDS=60

# Timezone
TZ=Africa/Dar_es_Salaam
```

---

### 3. Add Startup Validation

Create `server/src/config/validation.js`:

```javascript
function validateEnvironment() {
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error("\nPlease set these in your .env file or Render dashboard.");
    process.exit(1);
  }

  // Warn about SMS configuration
  if (process.env.SMS_PROVIDER === "twilio") {
    const twilioVars = [
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_FROM",
    ];
    const missingTwilio = twilioVars.filter((key) => !process.env[key]);

    if (missingTwilio.length > 0) {
      console.warn("⚠️  Twilio SMS provider selected but missing:");
      missingTwilio.forEach((key) => console.warn(`   - ${key}`));
    }
  }

  console.log("✅ Environment validation passed");
}

module.exports = { validateEnvironment };
```

Add to `server/src/server.js` (at the top after dotenv):

```javascript
const { validateEnvironment } = require("./config/validation");
validateEnvironment();
```

---

### 4. Production Error Handling

Update error handler in `server.js`:

```javascript
// Error handler (must be LAST middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Don't leak error details in production
  const isDev = process.env.NODE_ENV !== "production";

  res.status(err.status || 500).json({
    error: isDev ? err.message : "Internal Server Error",
    ...(isDev && { stack: err.stack }),
  });
});
```

---

### 5. Graceful Shutdown

Add at the end of `server.js`:

```javascript
// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  mongoose.connection.close(false, () => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});
```

---

## 🔒 Render Dashboard Configuration

### Environment Variables to Set:

| Variable                       | Value                                | Secret? |
| ------------------------------ | ------------------------------------ | ------- |
| `NODE_ENV`                     | `production`                         | No      |
| `MONGO_URI`                    | Your MongoDB Atlas connection string | **YES** |
| `JWT_SECRET`                   | 64-character random string           | **YES** |
| `FRONTEND_URL`                 | `https://your-app.vercel.app`        | No      |
| `SMS_PROVIDER`                 | `twilio` or `africastalking`         | No      |
| `TWILIO_ACCOUNT_SID`           | Your Twilio SID                      | **YES** |
| `TWILIO_AUTH_TOKEN`            | Your Twilio token                    | **YES** |
| `TWILIO_FROM`                  | Your Twilio phone                    | No      |
| `TWILIO_MESSAGING_SERVICE_SID` | Your Messaging Service SID           | No      |
| `TZ`                           | `Africa/Dar_es_Salaam`               | No      |

---

## ✅ Final Verification

Before deploying, check:

- [ ] All security packages installed
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Helmet security headers added
- [ ] MongoDB injection sanitization enabled
- [ ] Environment validation script added
- [ ] Production error handling updated
- [ ] Graceful shutdown handlers added
- [ ] render.yaml created
- [ ] .env.example updated
- [ ] MongoDB Atlas IP whitelist configured (0.0.0.0/0 or Render IPs)
- [ ] All environment variables set in Render dashboard
- [ ] Health check endpoint working (`/health`)
- [ ] Git repository connected to Render
- [ ] SMS provider credentials tested

---

## 🚀 Deployment Steps

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "feat: add production security and Render configuration"
   git push origin main
   ```

2. **Create Render Web Service**

   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically
   - Or manually set:
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Environment**: Node

3. **Configure Environment Variables**

   - Add all variables from table above
   - Mark sensitive ones as "Secret"

4. **Deploy**

   - Click "Create Web Service"
   - Wait for build to complete (~3-5 minutes)
   - Check logs for errors

5. **Test Deployment**

   ```bash
   # Test health endpoint
   curl https://your-app.onrender.com/health

   # Test API
   curl https://your-app.onrender.com/api/facilities
   ```

6. **Update Frontend**
   - Set `VITE_API_URL=https://your-app.onrender.com` in Vercel/Netlify
   - Redeploy frontend

---

## 🐛 Troubleshooting

### Build Fails

- Check logs in Render dashboard
- Verify all dependencies in package.json
- Ensure Node version compatible (20+)

### Connection Refused

- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check MONGO_URI environment variable
- Ensure MongoDB Atlas user has correct permissions

### CORS Errors

- Verify FRONTEND_URL matches your frontend domain
- Check browser console for specific CORS error
- Ensure credentials: true in CORS config

### SMS Not Sending

- Verify SMS_PROVIDER environment variable
- Check Twilio/Africa's Talking credentials
- Review logs for SMS errors
- Ensure phone numbers in E.164 format (+255...)

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Production Checklist](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
