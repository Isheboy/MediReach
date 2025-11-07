import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/staff/facilities">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Manage Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>View, create, update, and delete healthcare facilities.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/staff/appointments">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Manage Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p>View and manage all patient appointments.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/staff/reminders">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Reminder Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p>View all SMS reminder logs and delivery status.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
