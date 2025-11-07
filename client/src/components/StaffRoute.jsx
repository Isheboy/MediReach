import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const StaffRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "staff" && user.role !== "admin") {
    return <Navigate to="/appointments" replace />;
  }

  return children;
};

export default StaffRoute;
