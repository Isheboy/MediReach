import React, { useState, useEffect } from "react";
import { appointmentsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock, User, MapPin } from "lucide-react";

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAllForStaff();
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentsAPI.updateStatus(id, status);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setError("Failed to update appointment status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading all appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage All Appointments</h1>
            <p className="text-gray-600 mt-1">
              View, confirm, or cancel any appointment in the system
            </p>
          </div>
          <Link to="/staff/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <Card key={appointment._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">{appointment.patientId?.name || "N/A"}</CardTitle>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(appointment.scheduledAt), "PPP p")}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{appointment.facilityId?.name || "N/A"}</span>
                </div>
                <div className="pt-3 flex gap-2">
                  {appointment.status === "pending" && (
                    <Button size="sm" onClick={() => handleUpdateStatus(appointment._id, "confirmed")}>Confirm</Button>
                  )}
                  {appointment.status !== "cancelled" && (
                    <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(appointment._id, "cancelled")}>Cancel</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
