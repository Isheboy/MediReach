# 🏥 MediReach - Healthcare Appointment Management

<div align="center">

![MediReach](https://img.shields.io/badge/Healthcare-Platform-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![SDG](https://img.shields.io/badge/SDG-3_Good_Health-orange?style=for-the-badge)

**Modern healthcare appointment management system with automated SMS reminders**

🌐 **[Live Demo](https://medi-reach-liart.vercel.app/)** | 📚 **[API Docs](https://medireach-hehm.onrender.com/health)**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**MediReach** is a comprehensive healthcare appointment management platform designed to improve access to quality healthcare services in Tanzania and beyond. Built with modern web technologies, it provides a seamless experience for patients to book appointments, manage their healthcare visits, and receive automated SMS reminders.

### 🎯 Alignment with SDG 3 (Good Health and Well-being)

MediReach directly contributes to **Sustainable Development Goal 3** by:

- **Improving Healthcare Access**: Simplifying the appointment booking process
- **Reducing No-Shows**: Automated SMS reminders ensure patients don't miss appointments
- **Digital Health Records**: Centralized platform for managing healthcare information
- **Facility Connectivity**: Connecting patients with multiple healthcare providers

---

## ✨ Features

### 👥 For Patients

#### 🗓️ **Appointment Management**

- **Multi-Step Booking Wizard**: Intuitive 3-step process (Select Facility → Choose Date/Time → Confirm)
- **Real-time Availability**: Interactive calendar with available time slots
- **View & Track**: Dashboard to view upcoming and past appointments
- **Reschedule & Cancel**: Easy appointment modifications with confirmation dialogs

#### 📱 **SMS Notifications**

- **Automated Reminders**: Receive SMS alerts before appointments
- **Confirmation Messages**: Instant booking confirmations via SMS
- **Consent-Based**: Opt-in/opt-out of SMS notifications anytime

#### 🏥 **Facility Discovery**

- **Browse Facilities**: Explore available healthcare providers
- **Location Details**: View facility information and locations
- **Service Types**: Filter by medical services offered

#### 👤 **User Profile**

- **Professional Dashboard**: Medireach-style interface with tabs (Appointments, Records, Settings)
- **Personal Information**: Update name, contact details, and preferences
- **Notification Preferences**: Control SMS reminder settings
- **Medical Records**: (Coming soon) Access to health documents

### 🏢 For Healthcare Staff

#### 📊 **Staff Dashboard**

- **Dashboard Overview**: Real-time metrics (Today's Appointments, Upcoming Tasks, New Registrations, Total Patients)
- **Today's Schedule Widget**: Quick view of daily appointments with status badges
- **Trending Analytics**: Visual indicators showing appointment trends

#### 📅 **Appointments Management Center**

- **Advanced DataTable**: Comprehensive appointment list with sorting and filtering
- **Smart Filters**:
  - Date Picker with calendar component
  - Status filter (All, Pending, Confirmed, Completed, Canceled)
  - Specialist/Service filter
  - Time block filter (Morning, Afternoon, Evening)
- **Real-time Updates**: Auto-refresh every 30 seconds to catch new bookings
- **Global Search**: Instant search by patient name, phone, or facility
- **Quick Actions**:
  - Check-In patients (confirm appointments with automatic notifications)
  - View detailed appointment information
  - Edit/Reschedule appointments
  - Cancel with reason tracking
- **Optimistic UI**: Instant feedback on actions with server confirmation
- **Export Functionality**: Download appointment data

#### 🔄 **Appointment Workflow Management**

- **Confirmation System**: One-click appointment confirmation with automatic patient notification
- **Staff-Initiated Rescheduling**: Propose new appointment times when schedules change
- **Approval Workflow**: Review and respond to patient reschedule requests
- **Availability Validation**: Automatic conflict checking prevents double-booking
- **Reschedule History**: Complete audit trail of all appointment changes
- **Multi-Channel Notifications**: SMS notifications for all workflow actions (email and push ready for future)

#### 👤 **Staff Profile Management**

- **Professional Profile Header**: Avatar, name, role, department, and status badges
- **Tabbed Information Organization**:
  - **Details & Contact**: Employee ID, contact information, emergency contacts
  - **Credentials & Licensing**: DataTable for professional licenses and certifications with expiration tracking
  - **Schedule & Availability**: Calendar view and recurring work schedule management
- **Credential Management**: Add new credentials with document upload
- **Password Management**: Secure password change functionality
- **Availability Adjustment**: Update work hours and request time off

#### 🏥 **Facility Management**

- **Facility CRUD**: Create, read, update, and delete healthcare facilities
- **Service Management**: Add and manage medical services offered

#### 📈 **Reports & Analytics** (Coming Soon)

- **Appointment Statistics**: Completion rates, patient satisfaction
- **Custom Reports**: Generate and export various reports

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Version | Purpose                          |
| ---------------- | ------- | -------------------------------- |
| **React**        | 18.3    | UI framework with hooks          |
| **Vite**         | 6.0     | Fast build tool and dev server   |
| **React Router** | 6.28    | Client-side routing              |
| **Tailwind CSS** | 4.1     | Utility-first styling framework  |
| **shadcn/ui**    | Latest  | High-quality React components    |
| **Radix UI**     | Latest  | Accessible component primitives  |
| **Axios**        | 1.7     | HTTP client for API requests     |
| **date-fns**     | 4.1     | Date formatting and manipulation |
| **Lucide React** | Latest  | Icon library                     |

### Backend

| Technology   | Version | Purpose                   |
| ------------ | ------- | ------------------------- |
| **Node.js**  | 20+     | Runtime environment       |
| **Express**  | 4.21    | Web application framework |
| **MongoDB**  | 6+      | NoSQL database            |
| **Mongoose** | 8.8     | MongoDB ODM               |
| **JWT**      | 9.0     | Authentication tokens     |
| **bcryptjs** | 2.4     | Password hashing          |
| **dotenv**   | 16.4    | Environment configuration |

### Database

| Provider          | Purpose                    |
| ----------------- | -------------------------- |
| **MongoDB**       | Local development database |
| **MongoDB Atlas** | Cloud production database  |

### SMS Integration

| Provider             | Purpose                               |
| -------------------- | ------------------------------------- |
| **Africa's Talking** | Primary SMS provider for East Africa  |
| **Twilio**           | Alternative SMS provider (configured) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **MongoDB** (v6 or higher)
- **npm** or **yarn**
- **Africa's Talking** API credentials (for SMS)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Isheboy/MediReach.git
   cd MediReach
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create `.env` in the `server` directory (see `.env.example` for reference):

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   # Get your MongoDB Atlas connection string from: https://cloud.mongodb.com
   # Replace <username>, <password>, and <cluster> with your actual credentials
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

   # JWT Authentication
   # Generate a secure random string (e.g., using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   JWT_SECRET=<your_secure_random_string>

   # SMS Provider Configuration (Africa's Talking)
   # Sign up at: https://africastalking.com
   AT_USERNAME=<your_africastalking_username>
   AT_API_KEY=<your_africastalking_api_key>
   AT_SENDER_ID=MediReach

   # Alternative SMS Provider (Twilio) - Optional
   # Sign up at: https://www.twilio.com
   TWILIO_ACCOUNT_SID=<your_twilio_sid>
   TWILIO_AUTH_TOKEN=<your_twilio_token>
   TWILIO_PHONE_NUMBER=<your_twilio_number>
   ```

   **⚠️ SECURITY WARNING:**

   - **NEVER** commit your `.env` file to version control
   - **NEVER** share your API keys or database credentials publicly
   - Use environment-specific `.env` files (development, staging, production)
   - Add `.env` to your `.gitignore` (already configured)

   Create `.env` in the `client` directory:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Database Setup**

   The application uses **MongoDB Atlas** for cloud database hosting:

   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a database user with read/write permissions
   - Whitelist your IP address (or use 0.0.0.0/0 for development only)
   - Copy your connection string and add it to `.env` as `MONGO_URI`
   - Database name: `medireach`

   **Initial Data Seeding** (Optional):

   ```bash
   cd server
   node src/scripts/seed.js
   ```

   This will populate your database with sample facilities and test users.

6. **Start the development servers**

   Terminal 1 (Backend):

   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - **Local Frontend**: http://localhost:3000
   - **Local Backend**: http://localhost:5000
   - **Production Frontend**: https://medi-reach-liart.vercel.app/
   - **Production Backend**: https://medireach-hehm.onrender.com
   - **API Health Check**: https://medireach-hehm.onrender.com/health

---

## 📁 Project Structure

```
MediReach/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/            # shadcn/ui components (18 components)
│   │   │   │   ├── accordion.jsx
│   │   │   │   ├── alert-dialog.jsx
│   │   │   │   ├── avatar.jsx
│   │   │   │   ├── badge.jsx
│   │   │   │   ├── button.jsx
│   │   │   │   ├── calendar.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── command.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── dropdown-menu.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── popover.jsx
│   │   │   │   ├── progress.jsx
│   │   │   │   ├── select.jsx
│   │   │   │   ├── separator.jsx
│   │   │   │   ├── table.jsx
│   │   │   │   ├── tabs.jsx
│   │   │   │   ├── textarea.jsx
│   │   │   │   └── toggle-group.jsx
│   │   │   ├── staff/         # Staff-specific components
│   │   │   │   └── StaffSidebar.jsx
│   │   │   ├── AppointmentsTab.jsx
│   │   │   ├── BookingWizard.jsx
│   │   │   ├── FacilityForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StaffRoute.jsx
│   │   ├── contexts/          # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── lib/               # Utilities
│   │   │   ├── api.js         # API client
│   │   │   └── utils.js       # Helper functions
│   │   ├── pages/             # Page components
│   │   │   ├── staff/         # Staff dashboard pages
│   │   │   │   ├── Dashboard.jsx      # Staff overview
│   │   │   │   ├── Appointments.jsx   # Appointments management
│   │   │   │   ├── Patients.jsx       # Patient management
│   │   │   │   ├── Facilities.jsx     # Facility management
│   │   │   │   ├── Reports.jsx        # Reports & analytics
│   │   │   │   └── Profile.jsx        # Staff profile
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── BrowseFacilities.jsx
│   │   │   ├── ReminderHistory.jsx
│   │   │   ├── StaffLogin.jsx
│   │   │   ├── StaffDashboard.jsx
│   │   │   ├── ManageAppointments.jsx
│   │   │   ├── ManageFacilities.jsx
│   │   │   └── ReminderLogs.jsx
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles (Tailwind v4)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── appointmentController.js
│   │   │   ├── authController.js
│   │   │   ├── facilityController.js
│   │   │   └── userController.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── isStaff.js
│   │   ├── models/            # Mongoose models
│   │   │   ├── Appointment.js
│   │   │   ├── Facility.js
│   │   │   ├── Reminder.js
│   │   │   └── User.js
│   │   ├── routes/            # API routes
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── facilityRoutes.js
│   │   │   ├── reminderRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── scripts/           # Utility scripts
│   │   │   ├── seed.js
│   │   │   ├── migrateToAtlas.js
│   │   │   └── addStaffPasswords.js
│   │   ├── services/          # Business logic
│   │   │   ├── reminderService.js
│   │   │   └── smsService.js
│   │   ├── sms/               # SMS provider adapters
│   │   │   ├── africasTalkingAdapter.js
│   │   │   ├── twilioAdapter.js
│   │   │   └── mockAdapter.js
│   │   └── server.js          # Server entry point
│   └── package.json
│
└── README.md                  # This file
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+255123456789",
  "role": "patient"
}
```

**Note:** Phone-based registration for patients. Staff/Admin accounts require password.

#### Login (Patient - Phone Only)

```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+255123456789"
}
```

#### Login (Staff/Admin - Email/Phone + Password)

```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "nurse@medireach.com",
  "password": "password123"
}
```

**OR**

```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+255754321098",
  "password": "password123"
}
```

**Test Staff Credentials:**

- **Nurse Peter Ndege**:
  - Email: `nurse@medireach.com`
  - Phone: `+255754321098`
  - Password: `password123`
  - Role: `staff`

### Appointment Endpoints

#### Get User Appointments (Patient)

```http
GET /api/appointments
Authorization: Bearer <token>
```

#### Get Staff Appointments (Staff Dashboard)

```http
GET /api/appointments/staff?startDate=2025-11-07&endDate=2025-11-08&status=pending
Authorization: Bearer <token>
```

**Query Parameters:**

- `startDate` (optional): Start date for filtering (ISO 8601 format)
- `endDate` (optional): End date for filtering (ISO 8601 format)
- `status` (optional): Filter by status (pending, confirmed, completed, canceled, all)
- `specialist` (optional): Filter by service/specialist type
- `timeBlock` (optional): Filter by time (morning, afternoon, evening)

**Note:** Defaults to current day if no dates provided

#### Create Appointment

```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "facilityId": "facility_id_here",
  "service": "General Checkup",
  "scheduledAt": "2025-11-10T10:00:00.000Z"
}
```

#### Update Appointment Status

```http
PATCH /api/appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### Send Test SMS

```http
POST /api/appointments/:id/send-test-sms
Authorization: Bearer <token>
```

### Facility Endpoints

#### Get All Facilities

```http
GET /api/facilities
```

#### Create Facility (Staff only)

```http
POST /api/facilities
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "City Hospital",
  "location": "Dar es Salaam",
  "services": ["General Medicine", "Pediatrics"]
}
```

### User Endpoints

#### Get Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "consentSms": true
}
```

---

## 🔐 Environment Variables

### Server (.env)

| Variable              | Description               | Required | Example             |
| --------------------- | ------------------------- | -------- | ------------------- |
| `PORT`                | Server port               | No       | `5000`              |
| `MONGO_URI`           | MongoDB Atlas connection  | Yes      | `mongodb+srv://...` |
| `JWT_SECRET`          | Secret for JWT signing    | Yes      | `your_secret_key`   |
| `AT_USERNAME`         | Africa's Talking username | Yes\*    | `sandbox`           |
| `AT_API_KEY`          | Africa's Talking API key  | Yes\*    | `your_api_key`      |
| `AT_SENDER_ID`        | Sender ID for SMS         | No       | `MediReach`         |
| `TWILIO_ACCOUNT_SID`  | Twilio Account SID        | No       | `ACxxxx`            |
| `TWILIO_AUTH_TOKEN`   | Twilio Auth Token         | No       | `your_token`        |
| `TWILIO_PHONE_NUMBER` | Twilio Phone Number       | No       | `+1234567890`       |

\*Required if using Africa's Talking for SMS

### Client (.env)

| Variable       | Description     | Required | Example                 |
| -------------- | --------------- | -------- | ----------------------- |
| `VITE_API_URL` | Backend API URL | Yes      | `http://localhost:5000` |

---

## 🎨 Design & UX

MediReach follows **Medireach-style** design principles:

- **Healthcare-Focused Color Palette**: Professional blue/indigo gradients
- **Mobile-First Responsive Design**: Optimized for all screen sizes
- **Accessibility (A11y)**: WCAG compliant with ARIA labels and keyboard navigation
- **Modern UI Components**: Built with shadcn/ui for consistency
- **Progressive Disclosure**: Multi-step wizards reduce cognitive load
- **Clear Visual Hierarchy**: Professional medical platform aesthetic

### Key UI Features

- ✅ Sticky navigation with backdrop blur
- ✅ Gradient backgrounds and accent colors (Tailwind v4 syntax)
- ✅ Interactive calendars and time slot selectors
- ✅ DataTable with sorting and filtering (desktop)
- ✅ Card-based layouts for mobile responsiveness
- ✅ Status badges with semantic colors
- ✅ Modal dialogs for confirmations
- ✅ Toast notifications for feedback
- ✅ Real-time polling for live data updates
- ✅ Optimistic UI updates for instant feedback
- ✅ Avatar components with gradient fallbacks
- ✅ Tabbed interfaces for organized information

### shadcn/ui Components Used

The application uses **20 shadcn/ui components**:

1. Accordion
2. Alert Dialog
3. Avatar
4. Badge
5. Button
6. Calendar
7. Card
8. Command
9. Dialog
10. Dropdown Menu
11. Input
12. Label
13. Popover
14. Progress
15. Select
16. Separator
17. Table
18. Tabs
19. Textarea
20. Toggle Group

---

## 📝 Recent Updates

### Version 1.2.0 (November 2025)

#### ✨ New Features

- **Staff Appointment Confirmation**: Healthcare staff can now confirm pending appointments with automatic patient notifications
- **Patient Reschedule Requests**: Patients can request appointment rescheduling with availability validation
- **Staff-Initiated Rescheduling**: Staff can propose new appointment times when schedules change
- **Reschedule History Tracking**: Complete audit trail of all reschedule requests and responses
- **Availability Validation**: Automatic conflict checking prevents double-booking within 30-minute windows
- **Multi-Channel Notifications**: New notification service with SMS integration (email and push notifications ready for future implementation)

#### 🔌 New API Endpoints

- `POST /api/appointments/:id/confirm` - Staff confirms pending appointment
- `POST /api/appointments/:id/reschedule/staff` - Staff proposes reschedule
- `POST /api/appointments/:id/reschedule/patient` - Patient requests reschedule
- `POST /api/appointments/:id/reschedule/respond` - Approve/reject reschedule
- `GET /api/appointments/:id/reschedule/history` - View reschedule history

#### 🔧 Technical Improvements

- **Status State Machine**: Implemented 6-state appointment workflow (pending, confirmed, completed, cancelled, reschedule_pending_patient, pending_staff_review)
- **Notification Service**: Centralized notification handling with channel abstraction
- **Enhanced Data Model**: Added reschedule history array and cancellation reason tracking
- **Staff Assignment**: Patients can now see assigned staff member details on confirmed appointments

#### 📚 Documentation

- **Comprehensive Workflow Guide**: Added `APPOINTMENT_WORKFLOW.md` with complete API reference, use cases, and testing scenarios
- **End-to-End Testing**: All workflow features tested and verified working
- **Security Documentation**: Role-based access control documented for all endpoints

#### ✅ Verified Working

All new features have been thoroughly tested and are production-ready.

---

### Version 1.1.0 (November 2025)

#### ✨ New Features

- **Staff Dual Authentication**: Staff can now login using either email or phone number
- **Enhanced Appointment Filtering**: Removed default date filtering to show all appointments by default
- **Improved UX Design**: Updated notification colors from red to amber/orange for better visual hierarchy

#### 🐛 Bug Fixes

- **Fixed Staff Login**: Resolved bcrypt double-hashing issue that prevented staff authentication
- **Fixed Appointment Display**: Staff appointments now show all dates by default instead of only today
- **Fixed Password Validation**: Corrected password comparison logic in authentication flow

#### 🎨 UI/UX Improvements

- **Amber Notification Theme**: Changed pending appointments from red to amber for less alarming appearance
- **Table Row Highlighting**: Added left border accent on pending appointment rows
- **Better Status Badges**: Updated badge colors for better semantic meaning
- **Notification Banner**: Redesigned with amber color scheme and improved contrast

#### 🔧 Technical Improvements

- **Cleaned Debug Code**: Removed all console.log debugging statements from production code
- **Removed Test Files**: Cleaned up temporary test scripts and PowerShell files
- **Better Error Messages**: Enhanced error handling with specific user-facing messages
- **Code Organization**: Improved code structure and removed unused imports

---

## 🧪 Testing

### Manual Testing Checklist

#### Patient Features

- [ ] User registration (phone-based)
- [ ] Patient login
- [ ] Appointment booking (complete 3-step wizard)
- [ ] View upcoming/past appointments
- [ ] Reschedule appointment
- [ ] Cancel appointment
- [ ] Update profile information
- [ ] Toggle SMS consent
- [ ] Browse facilities
- [ ] Receive SMS reminders

#### Staff Features

- [ ] Staff login (phone + password)
- [ ] View dashboard with metrics
- [ ] View today's schedule
- [ ] Filter appointments (date, status, specialist, time)
- [ ] Search appointments (patient, phone, facility)
- [ ] Check-in patient
- [ ] View appointment details
- [ ] Cancel appointment with reason
- [ ] View staff profile
- [ ] Manage credentials
- [ ] View work schedule
- [ ] Auto-refresh functionality (30s polling)

#### System Features

- [ ] Real-time data synchronization
- [ ] Optimistic UI updates
- [ ] Error handling and recovery
- [ ] Mobile responsiveness
- [ ] MongoDB Atlas cloud database connection

## 🚀 Deployment

### Production Environment

MediReach is currently deployed and live:

- **Frontend**: [https://medi-reach-liart.vercel.app/](https://medi-reach-liart.vercel.app/) (Vercel)
- **Backend API**: [https://medireach-hehm.onrender.com](https://medireach-hehm.onrender.com) (Render)
- **Database**: MongoDB Atlas (Cloud)
- **SMS Provider**: Twilio (Production)

### Backend Deployment (Render)

**Current Setup:**

1. **Service**: Web Service on Render
2. **Repository**: Connected to GitHub `Isheboy/MediReach`
3. **Branch**: `main` (auto-deploy enabled)
4. **Build Command**: `cd server && npm install`
5. **Start Command**: `cd server && npm start`
6. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGO_URI=mongodb+srv://...` (MongoDB Atlas connection)
   - `JWT_SECRET=<secure_random_string>`
   - `FRONTEND_URL=http://localhost:3000,https://medi-reach-liart.vercel.app`
   - `SMS_PROVIDER=twilio`
   - `TWILIO_ACCOUNT_SID=<your_sid>`
   - `TWILIO_AUTH_TOKEN=<your_token>`
   - `TWILIO_FROM=<your_phone>`
   - `TZ=Africa/Dar_es_Salaam`

**To Deploy Your Own:**

```bash
# 1. Create account on Render.com
# 2. New Web Service → Connect GitHub repository
# 3. Configure:
Root Directory: server
Build Command: npm install
Start Command: npm start
# 4. Add all environment variables from server/.env.example
# 5. Deploy
```

### Frontend Deployment (Vercel)

**Current Setup:**

1. **Platform**: Vercel
2. **Repository**: Connected to GitHub `Isheboy/MediReach`
3. **Branch**: `main` (auto-deploy enabled)
4. **Framework**: Vite
5. **Root Directory**: `client`
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Environment Variables**:
   - `VITE_API_URL=https://medireach-hehm.onrender.com`

**Important Configuration Files:**

- `client/vercel.json` - Configures SPA routing (rewrites all routes to index.html)

**To Deploy Your Own:**

```bash
# 1. Create account on Vercel.com
# 2. Import repository → Select MediReach
# 3. Configure:
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
# 4. Add environment variable:
VITE_API_URL: https://your-backend-url.onrender.com
# 5. Deploy
```

### Database (MongoDB Atlas)

**Current Setup:**

1. **Cluster**: M0 Free Tier (Shared)
2. **Region**: AWS / us-east-1
3. **Database**: `medireach`
4. **Collections**: `users`, `facilities`, `appointments`, `reminders`
5. **Network Access**: Whitelist 0.0.0.0/0 (all IPs) for Render/Vercel

**To Set Up Your Own:**

```bash
# 1. Create free account at https://www.mongodb.com/cloud/atlas
# 2. Create New Cluster (M0 Free Tier)
# 3. Database Access → Create Database User
# 4. Network Access → Add IP Address (0.0.0.0/0 for cloud deployments)
# 5. Connect → Get connection string
# 6. Update MONGO_URI in Render environment variables
```

### CORS Configuration

**Backend must allow frontend origin:**

```javascript
// server/.env
FRONTEND_URL=http://localhost:3000,https://medi-reach-liart.vercel.app
```

**Note**: Remove trailing slashes from URLs to avoid CORS errors!

### Continuous Deployment

Both frontend and backend auto-deploy on push to `main` branch:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel: ~1 minute build + deploy
# Render: ~2 minutes build + deploy
```

### Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production` on backend
- [ ] Update `MONGO_URI` to MongoDB Atlas connection string
- [ ] Generate secure `JWT_SECRET` (64+ characters)
- [ ] Configure SMS provider credentials (Africa's Talking or Twilio)
- [ ] Set correct `FRONTEND_URL` with deployed frontend URL (no trailing slash!)
- [ ] Set `VITE_API_URL` to deployed backend URL on Vercel
- [ ] Add `vercel.json` for SPA routing
- [ ] Whitelist Render/Vercel IPs in MongoDB Atlas
- [ ] Test all authentication flows
- [ ] Test appointment booking end-to-end
- [ ] Verify SMS notifications work
- [ ] Check CORS headers allow frontend origin
- [ ] Monitor error logs for first 24 hours

### Monitoring & Logs

**Render Dashboard:**

- View real-time logs: `Logs` tab in service dashboard
- Monitor deployment status: `Events` tab
- Check health: https://medireach-hehm.onrender.com/health

**Vercel Dashboard:**

- View build logs: Click on deployment
- Monitor analytics: `Analytics` tab
- Check deployment status: `Deployments` page

### Troubleshooting

**Common Issues:**

1. **CORS Errors**: Ensure `FRONTEND_URL` matches exactly (no trailing slash)
2. **404 on Refresh**: Add `vercel.json` with rewrites configuration
3. **API Connection Failed**: Check `VITE_API_URL` is correct
4. **MongoDB Connection Error**: Whitelist IP 0.0.0.0/0 in Atlas
5. **SMS Not Sending**: Verify SMS provider credentials in environment variables
6. Whitelist IP addresses
7. Update `MONGODB_URI` in environment variables

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful and accessible UI components
- **Africa's Talking** - Reliable SMS API for Africa
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **MongoDB** - Flexible NoSQL database

---

## 📧 Contact

**Project Maintainer**: Isheboy  
**GitHub**: [@Isheboy](https://github.com/Isheboy)  
**Repository**: [MediReach](https://github.com/Isheboy/MediReach)

---

<div align="center">

**Made with ❤️ for better healthcare access in Tanzania**

Supporting **SDG 3: Good Health and Well-being**

</div>
