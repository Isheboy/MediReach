import React, { useState, useEffect } from "react";
import { remindersAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function ReminderLogs() {
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
      setError("Failed to load reminders");
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
        <div className="text-lg">Loading reminder logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Reminder Logs</h1>
          <p className="text-gray-600 mt-1">View the status of all SMS reminders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <Card key={reminder._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">To: {reminder.patient?.name || "N/A"}</CardTitle>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reminder.status)}`}>
                  {reminder.status}
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{reminder.message}</p>
                <div className="text-xs text-gray-500">
                  Sent at: {format(new Date(reminder.sentAt), "PPP p")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
