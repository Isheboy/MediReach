import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { appointmentsAPI, facilitiesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingWizard from "@/components/BookingWizard";
import { Calendar, Clock, MapPin, User, ArrowLeft } from "lucide-react";
import { format, isPast } from "date-fns";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingComplete = () => {
    setShowBookingWizard(false);
    fetchAppointments();
  };

  const upcomingAppointments = appointments.filter(
    (apt) =>
      !isPast(new Date(apt.scheduledAt)) &&
      apt.status !== "cancelled" &&
      apt.status !== "completed"
  );

  const pastAppointments = appointments.filter(
    (apt) =>
      isPast(new Date(apt.scheduledAt)) ||
      apt.status === "cancelled" ||
      apt.status === "completed"
  );

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "cancelled":
        return "destructive";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white">
        <div className="text-lg text-slate-600">Loading appointments...</div>
      </div>
    );
  }

  if (showBookingWizard) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto mb-6">
          <Button
            variant="ghost"
            onClick={() => setShowBookingWizard(false)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments
          </Button>
        </div>
        <BookingWizard onComplete={handleBookingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Appointments
              </h1>
              <p className="text-slate-600 mt-2">
                Manage and track your healthcare appointments
              </p>
            </div>
            <Button
              onClick={() => setShowBookingWizard(true)}
              size="lg"
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book New Appointment
            </Button>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-wrap gap-2">
            <Link to="/facilities">
              <Button variant="outline" size="sm">
                Browse Facilities
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                My Profile
              </Button>
            </Link>
            <Link to="/reminders">
              <Button variant="outline" size="sm">
                SMS History
              </Button>
            </Link>
          </div>
        </div>

        {/* Appointments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-slate-600 text-center mb-6 max-w-md">
                    Schedule your first appointment to get started with your
                    healthcare journey
                  </p>
                  <Button
                    onClick={() => setShowBookingWizard(true)}
                    className="bg-linear-to-r from-blue-600 to-indigo-600"
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    getStatusVariant={getStatusVariant}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No past appointments
                  </h3>
                  <p className="text-slate-600 text-center">
                    Your appointment history will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    getStatusVariant={getStatusVariant}
                    isPast
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({ appointment, getStatusVariant, isPast = false }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{appointment.service}</CardTitle>
            <CardDescription className="mt-1">
              {appointment.facilityId?.name || "Unknown Facility"}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span>{format(new Date(appointment.scheduledAt), "PPP")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="h-4 w-4 text-blue-600" />
          <span>{format(new Date(appointment.scheduledAt), "p")}</span>
        </div>
        {appointment.facilityId?.location && (
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <span className="line-clamp-2">
              {appointment.facilityId.location}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
