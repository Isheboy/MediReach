import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { appointmentsAPI, facilitiesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { format } from "date-fns";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    scheduledAt: "",
    facilityId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchFacilities();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await facilitiesAPI.getAll();
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // convert datetime-local local value to ISO if present
      const payload = {
        ...formData,
        scheduledAt: formData.scheduledAt
          ? new Date(formData.scheduledAt).toISOString()
          : undefined,
      };

      await appointmentsAPI.create(payload);
      setShowCreateForm(false);
      setFormData({ service: "", scheduledAt: "", facilityId: "" });
      fetchAppointments();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create appointment");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentsAPI.updateStatus(id, status);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleSendTestSMS = async (id) => {
    try {
      await appointmentsAPI.sendTestSMS(id);
      alert("Test SMS sent successfully!");
    } catch (error) {
      alert(
        "Failed to send SMS: " +
          (error.response?.data?.message || error.message)
      );
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
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header - Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Appointments
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage your healthcare appointments
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full sm:w-auto"
            >
              {showCreateForm ? "Cancel" : "New Appointment"}
            </Button>
          </div>

          {/* Navigation Links - Responsive Grid */}
          <nav
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
            aria-label="Quick navigation"
          >
            <Link to="/facilities" className="w-full">
              <Button variant="outline" className="w-full" size="sm">
                Browse Facilities
              </Button>
            </Link>
            <Link to="/profile" className="w-full">
              <Button variant="outline" className="w-full" size="sm">
                Profile
              </Button>
            </Link>
            <Link to="/reminders" className="col-span-2 sm:col-span-1 w-full">
              <Button variant="outline" className="w-full" size="sm">
                Reminder History
              </Button>
            </Link>
          </nav>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm sm:text-base"
          >
            {error}
          </div>
        )}

        {showCreateForm && (
          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                Create New Appointment
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Schedule a new healthcare appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service / Reason</Label>
                  <Input
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    placeholder="e.g., General Checkup"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Date & Time</Label>
                  <Input
                    id="scheduledAt"
                    name="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledAt: e.target.value })
                    }
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilityId">Facility</Label>
                  <Select
                    value={formData.facilityId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, facilityId: value })
                    }
                    required
                  >
                    <SelectTrigger
                      id="facilityId"
                      aria-label="Select healthcare facility"
                    >
                      <SelectValue placeholder="Select a facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility._id} value={facility._id}>
                          {facility.name} - {facility.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create Appointment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No appointments found. Create your first appointment!
            </div>
          ) : (
            appointments.map((appointment) => (
              <Card
                key={appointment._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <User
                        className="h-5 w-5 text-gray-500 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <CardTitle className="text-base sm:text-lg truncate">
                        {appointment.patientId
                          ? appointment.patientId.name
                          : "Unknown patient"}
                      </CardTitle>
                    </div>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                        appointment.status
                      )}`}
                      aria-label={`Status: ${appointment.status}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <Calendar
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      {format(new Date(appointment.scheduledAt), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <Clock
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      {format(new Date(appointment.scheduledAt), "p")}
                    </span>
                  </div>
                  {(appointment.facilityId || appointment.facility) && (
                    <div className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600">
                      <MapPin
                        className="h-4 w-4 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="break-words">
                        {appointment.facilityId
                          ? appointment.facilityId.name
                          : appointment.facility?.name}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 flex flex-col sm:flex-row gap-2">
                    {appointment.status !== "cancelled" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(appointment._id, "cancelled")
                        }
                        className="w-full sm:flex-1"
                        aria-label={`Cancel appointment on ${format(
                          new Date(appointment.scheduledAt),
                          "PPP"
                        )}`}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
