# 🔔 Firebase Cloud Messaging (FCM) Setup Guide

## Why FCM Instead of SMS?

| Feature              | SMS (Paid)        | FCM (Free)               |
| -------------------- | ----------------- | ------------------------ |
| Cost                 | $0.05 per message | **FREE Forever**         |
| Speed                | 1-5 seconds       | Instant                  |
| Rich Content         | Text only         | Images, buttons, actions |
| Delivery Tracking    | Basic             | Detailed analytics       |
| User Action Required | Phone number      | Browser permission       |

---

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: "MediReach"
4. Disable Google Analytics (optional)
5. Click "Create project"

---

## Step 2: Get Firebase Config

1. In Firebase Console, click ⚙️ Settings → Project settings
2. Scroll to "Your apps" section
3. Click Web icon (</>) to add web app
4. Register app name: "MediReach Web"
5. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "medireach-xxxxx.firebaseapp.com",
  projectId: "medireach-xxxxx",
  storageBucket: "medireach-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxx",
};
```

---

## Step 3: Get Server Key

1. Go to Project Settings → Cloud Messaging
2. Under "Cloud Messaging API (Legacy)", enable it if needed
3. Copy the **Server Key** (starts with `AAAA...`)

---

## Step 4: Install Dependencies

```bash
# Backend
cd server
npm install firebase-admin

# Frontend
cd ../client
npm install firebase
```

---

## Step 5: Configure Backend

Create `server/src/services/fcmService.js`:

```javascript
const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

class FCMService {
  async sendNotification(deviceToken, title, body, data = {}) {
    try {
      const message = {
        notification: { title, body },
        data: { ...data },
        token: deviceToken,
      };

      const response = await messaging.send(message);
      console.log("✅ FCM notification sent:", response);

      return { success: true, messageId: response };
    } catch (error) {
      console.error("❌ FCM error:", error);
      throw error;
    }
  }

  async sendToMultiple(tokens, title, body, data = {}) {
    try {
      const message = {
        notification: { title, body },
        data: { ...data },
        tokens: tokens,
      };

      const response = await messaging.sendMulticast(message);
      console.log(`✅ Sent to ${response.successCount}/${tokens.length}`);

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error("❌ FCM batch error:", error);
      throw error;
    }
  }
}

module.exports = new FCMService();
```

---

## Step 6: Update .env

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=medireach-xxxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@medireach-xxxxx.iam.gserviceaccount.com
```

---

## Step 7: Configure Frontend

Create `client/src/services/fcm.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      console.log("✅ FCM Token:", token);
      return token;
    }

    return null;
  } catch (error) {
    console.error("❌ FCM permission error:", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
```

---

## Step 8: Add to User Model

```javascript
// server/src/models/User.js
const userSchema = new mongoose.Schema({
  // ... existing fields

  fcmToken: {
    type: String,
    default: null,
  },

  notificationPreferences: {
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
  },
});
```

---

## Step 9: Update Notification Service

```javascript
// server/src/services/notificationService.js
const fcmService = require("./fcmService");
const smsService = require("./smsService");

const sendConfirmationNotification = async (appointmentId, status) => {
  const appointment = await Appointment.findById(appointmentId).populate(
    "patientId facilityId staffId"
  );

  const patient = appointment.patientId;

  // Try FCM first (free)
  if (patient.fcmToken && patient.notificationPreferences.push) {
    await fcmService.sendNotification(
      patient.fcmToken,
      "✅ Appointment Confirmed",
      `Your appointment at ${appointment.facilityId.name} has been confirmed!`,
      { appointmentId: appointmentId.toString(), type: "confirmation" }
    );
  }

  // Fallback to SMS if enabled and consented
  if (patient.consentSms && patient.notificationPreferences.sms) {
    await smsService.sendSms(patient.phone, message);
  }
};
```

---

## Step 10: Frontend Integration

```javascript
// In your Login/Register component
import { requestNotificationPermission } from "../services/fcm";

const handleLogin = async () => {
  // ... existing login logic

  // Request notification permission after login
  const fcmToken = await requestNotificationPermission();

  if (fcmToken) {
    // Save token to user profile
    await api.patch("/api/users/profile", { fcmToken });
  }
};
```

---

## Testing

1. **Start your app**
2. **Login as patient**
3. **Allow notifications** when browser prompts
4. **Book appointment**
5. **Login as staff** (different browser)
6. **Confirm appointment**
7. **Check patient browser** - should see notification!

---

## Advantages Over SMS

✅ **100% Free** - No costs ever
✅ **Instant Delivery** - No delays
✅ **Rich Content** - Images, actions, buttons
✅ **Works Offline** - Queued until online
✅ **Analytics** - Track delivery and engagement
✅ **Interactive** - Users can click to open app

---

## Limitations

⚠️ **Requires Internet** - No SMS fallback for offline users
⚠️ **Browser Permission** - Users must allow notifications
⚠️ **Web Only** - Requires open browser (can be solved with PWA)

---

## Production Deployment

For production, you'll need to:

1. **Enable PWA** - Install as app for persistent notifications
2. **Add Service Worker** - Background notification handling
3. **Configure HTTPS** - Required for notifications
4. **Test on Mobile** - Different behavior than desktop
