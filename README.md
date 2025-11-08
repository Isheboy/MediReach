# 🏥 MediReach - Healthcare Appointment Management

<div align="center">

![MediReach](https://img.shields.io/badge/Healthcare-Platform-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![SDG](https://img.shields.io/badge/SDG-3_Good_Health-orange?style=for-the-badge)

**Modern healthcare appointment management system with automated SMS reminders**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Demo](#-demo) • [Documentation](#-documentation)

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
  - Check-In patients
  - View detailed appointment information
  - Edit/Reschedule appointments
  - Cancel with reason tracking
- **Optimistic UI**: Instant feedback on actions with server confirmation
- **Export Functionality**: Download appointment data

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

   Create `.env` in the `server` directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database (MongoDB Atlas)
   # SECURITY: Never commit real credentials! Use environment variables.
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/medireach?retryWrites=true&w=majority

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here

   # Africa's Talking
   AT_USERNAME=your_at_username
   AT_API_KEY=your_at_api_key
   AT_SENDER_ID=MediReach

   # Twilio (Optional)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

   Create `.env` in the `client` directory:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Database Setup**

   The application uses **MongoDB Atlas** for cloud database:

   - Connection string is already configured
   - Database name: `medireach`
   - Contains 30+ documents (users, facilities, appointments, reminders)

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
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/docs (if Swagger is installed)

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

#### Login (Staff/Admin - Phone + Password)

```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+255713456789",
  "password": "staff123"
}
```

**Staff Credentials for Testing:**

- Nurse Peter Ndege: `+255754321098` / `staff123`
- Dr. Grace Kimaro: `+255713456789` / `staff123`

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

---

## 🚀 Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables in platform dashboard
2. Connect GitHub repository
3. Deploy from `main` branch
4. Set start command: `cd server && npm start`

### Frontend (Vercel/Netlify)

1. Connect GitHub repository
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`
4. Set environment variable: `VITE_API_URL=https://your-api-url.com`

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Whitelist IP addresses
3. Update `MONGODB_URI` in environment variables

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
