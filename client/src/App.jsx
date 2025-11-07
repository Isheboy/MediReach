import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import StaffRoute from "@/components/StaffRoute";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import StaffLogin from "@/pages/StaffLogin";
import Register from "@/pages/Register";
import Appointments from "@/pages/Appointments";
import Profile from "@/pages/Profile";
import ReminderHistory from "@/pages/ReminderHistory";
import StaffDashboard from "@/pages/StaffDashboard";
import ManageFacilities from "@/pages/ManageFacilities";
import ManageAppointments from "@/pages/ManageAppointments";
import BrowseFacilities from "@/pages/BrowseFacilities";
import ReminderLogs from "@/pages/ReminderLogs";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <ReminderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facilities"
            element={
              <ProtectedRoute>
                <BrowseFacilities />
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <StaffRoute>
                <StaffDashboard />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/facilities"
            element={
              <StaffRoute>
                <ManageFacilities />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/appointments"
            element={
              <StaffRoute>
                <ManageAppointments />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/reminders"
            element={
              <StaffRoute>
                <ReminderLogs />
              </StaffRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
