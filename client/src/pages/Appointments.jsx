import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">
              Manage your healthcare appointments
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Cancel" : "New Appointment"}
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Appointment</CardTitle>
              <CardDescription>
                Schedule a new healthcare appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service / Reason</Label>
                  <Input
                    id="service"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Date & Time</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledAt: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilityId">Facility</Label>
                  <Select
                    value={formData.facilityId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, facilityId: value })
                    }
                  >
                    <SelectTrigger>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">
                        {appointment.patientId
                          ? appointment.patientId.name
                          : "Unknown patient"}
                      </CardTitle>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(appointment.scheduledAt), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(appointment.scheduledAt), "p")}
                    </span>
                  </div>
                  {(appointment.facilityId || appointment.facility) && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {appointment.facilityId
                          ? appointment.facilityId.name
                          : appointment.facility?.name}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendTestSMS(appointment._id)}
                      className="flex-1"
                    >
                      Send SMS
                    </Button>
                    {appointment.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(appointment._id, "confirmed")
                        }
                        className="flex-1"
                      >
                        Confirm
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
