# MediReach Client

Modern healthcare appointment management frontend built with React 18, Vite, Tailwind CSS v4, and shadcn/ui.

## Features

- 🔐 **Authentication**: Secure login and registration with JWT
- 📅 **Appointment Management**: Create, view, and manage healthcare appointments
- 💬 **SMS Integration**: Send test SMS reminders to patients
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library built with Radix UI
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon set
- **date-fns** - Date formatting utilities

## Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:5000` (see `../server/README.md`)

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your backend API URL:

   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── lib/
│   │   ├── api.js           # API client and endpoints
│   │   └── utils.js         # Utility functions
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   └── Appointments.jsx # Appointments dashboard
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles with Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Usage

### Register a New Account

1. Navigate to `/register`
2. Fill in your name, phone number (format: +254700000000), and password
3. Click "Register"

### Login

1. Navigate to `/login`
2. Enter your phone number and password
3. Click "Login"

### Manage Appointments

1. After logging in, you'll be redirected to `/appointments`
2. Click "New Appointment" to create an appointment
3. Fill in patient name, date/time, and select a facility
4. View your appointments in the dashboard
5. Use "Send SMS" to send test reminders
6. Confirm pending appointments

## API Integration

The client communicates with the backend through these endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/facilities` - List all facilities
- `GET /api/appointments` - List user's appointments
- `POST /api/appointments` - Create new appointment
- `PATCH /api/appointments/:id/status` - Update appointment status
- `POST /api/appointments/:id/send-test-sms` - Send test SMS

## Customization

### Tailwind Theme

Edit `tailwind.config.js` to customize colors, spacing, and other design tokens.

### Adding Components

Use shadcn/ui CLI to add more components:

```bash
npx shadcn-ui@latest add [component-name]
```

## Deployment

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. The `dist/` folder contains the production-ready static files

3. Deploy to your hosting provider (Vercel, Netlify, etc.)

4. Update `VITE_API_URL` to point to your production backend

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your backend server has CORS enabled for your frontend origin.

### API Connection Failed

- Verify the backend server is running
- Check `VITE_API_URL` in `.env` matches your backend URL
- Ensure network connectivity

### Authentication Not Working

- Clear browser localStorage and try again
- Check browser console for error messages
- Verify JWT_SECRET matches between frontend storage and backend

## License

MIT
