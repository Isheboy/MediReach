import React, { useState, useEffect } from "react";
import { remindersAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock, Send } from "lucide-react";

export default function ReminderHistory() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await remindersAPI.getAll();
      setReminders(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setError("Failed to load reminder history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading reminder history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SMS Reminder History</h1>
            <p className="text-gray-600 mt-1">
              View the status of your appointment reminders
            </p>
          </div>
          <Link to="/appointments">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Back to Appointments</button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reminders.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No reminders found.
            </div>
          ) : (
            reminders.map((reminder) => (
              <Card key={reminder._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Send className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">
                        {reminder.appointmentId?.service || "Appointment Reminder"}
                      </CardTitle>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reminder.status)}`}
                    >
                      {reminder.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Scheduled for: {format(new Date(reminder.scheduledSendAt), "PPP p")}
                    </span>
                  </div>
                  {reminder.sentAt && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Sent at: {format(new Date(reminder.sentAt), "PPP p")}</span>
                    </div>
                  )}
                  {reminder.appointmentId && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Appointment: {format(new Date(reminder.appointmentId.scheduledAt), "PPP p")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
