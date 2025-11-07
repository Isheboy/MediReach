import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import AppointmentsTab from "@/components/AppointmentsTab";
import {
  User,
  Settings,
  Calendar,
  FileText,
  LogOut,
  Mail,
  Phone,
  Shield,
  Bell,
} from "lucide-react";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", consentSms: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, consentSms: user.consentSms });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await userAPI.updateProfile(formData);
      updateUser(response.data);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
              <p className="text-blue-100 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mb-8">
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Medical Records</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  My Appointments
                </h2>
                <p className="text-slate-600 mt-1">
                  View and manage your healthcare appointments
                </p>
              </div>
              <Link to="/appointments">
                <Button className="bg-linear-to-r from-blue-600 to-indigo-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book New
                </Button>
              </Link>
            </div>
            <AppointmentsTab />
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Medical Records</CardTitle>
                    <CardDescription>
                      Access your health documents and records
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No Records Available
                  </h3>
                  <p className="text-slate-600 text-center max-w-md">
                    Your medical records and documents will appear here once
                    they are uploaded by your healthcare provider.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Profile Settings Card */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal details
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
                        {success}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-600" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-600" />
                        Email Address
                      </Label>
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="bg-slate-50 border-2"
                      />
                      <p className="text-xs text-slate-500">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-600" />
                        Phone Number
                      </Label>
                      <Input
                        value={user?.phoneNumber || ""}
                        disabled
                        className="bg-slate-50 border-2"
                      />
                    </div>

                    <Separator />

                    <Button
                      type="submit"
                      className="w-full bg-linear-to-r from-blue-600 to-indigo-600"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Notifications & Privacy Card */}
              <div className="space-y-6">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                          Manage your notification preferences
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <input
                        id="consentSms"
                        name="consentSms"
                        type="checkbox"
                        checked={formData.consentSms}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="consentSms"
                          className="text-sm font-medium text-slate-900 cursor-pointer"
                        >
                          SMS Reminders
                        </Label>
                        <p className="text-sm text-slate-600 mt-1">
                          Receive appointment reminders via SMS
                        </p>
                      </div>
                      {formData.consentSms && (
                        <Badge variant="default" className="bg-green-600">
                          Active
                        </Badge>
                      )}
                    </div>

                    <Button
                      onClick={handleSubmit}
                      variant="outline"
                      className="w-full"
                      disabled={loading}
                    >
                      Update Preferences
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-red-900">
                          Account Security
                        </CardTitle>
                        <CardDescription>
                          Manage your account access
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/appointments" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Book Appointment
                    </p>
                    <p className="text-sm text-slate-600">Schedule new visit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/facilities" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Find Facilities
                    </p>
                    <p className="text-sm text-slate-600">Browse providers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reminders" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">SMS History</p>
                    <p className="text-sm text-slate-600">View reminders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Home</p>
                    <p className="text-sm text-slate-600">Return to homepage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
