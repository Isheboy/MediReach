import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  UserPlus,
  Clock,
  TrendingUp,
  Activity,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StaffSidebar from "@/components/staff/StaffSidebar";
import api from "@/lib/api";
import { format } from "date-fns";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    todayAppointments: 0,
    upcomingTasks: 0,
    newRegistrations: 0,
    totalPatients: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch today's appointments using the new staff endpoint
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointmentsRes = await api.get("/appointments/staff", {
        params: {
          startDate: today.toISOString(),
          endDate: tomorrow.toISOString(),
        },
      });

      const appointments = appointmentsRes.data;

      // Calculate metrics
      setMetrics({
        todayAppointments: appointments.length,
        upcomingTasks: appointments.filter(
          (a) => a.status === "pending" || a.status === "confirmed"
        ).length,
        newRegistrations: 5, // Placeholder - would come from API
        totalPatients: 124, // Placeholder - would come from API
      });

      // Set today's schedule (first 5 appointments)
      setTodaySchedule(appointments.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-gray-100 text-gray-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex h-screen bg-background">
      <StaffSidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
          <div className="flex h-16 items-center gap-4 px-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </p>
            </div>

            {/* Global Search */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search patients, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Metrics Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Today's Appointments */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Appointments
                </CardTitle>
                <Calendar className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {metrics.todayAppointments}
                </div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12%</span>
                  <span className="ml-1">from yesterday</span>
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming Tasks
                </CardTitle>
                <Clock className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {metrics.upcomingTasks}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Scheduled for today
                </p>
              </CardContent>
            </Card>

            {/* New Registrations */}
            <Card className="border-l-4 border-l-teal-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  New Registrations
                </CardTitle>
                <UserPlus className="h-5 w-5 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {metrics.newRegistrations}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            {/* Total Patients */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Patients
                </CardTitle>
                <Users className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {metrics.totalPatients}
                </div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Activity className="mr-1 h-3 w-3 text-purple-500" />
                  Active patients
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>
                    View and manage today's appointments
                  </CardDescription>
                </div>
                <Button
                  onClick={() => navigate("/staff/appointments")}
                  className="bg-linear-to-r from-blue-500 to-teal-400 text-white hover:opacity-90"
                >
                  View All Appointments
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <p className="text-muted-foreground">Loading schedule...</p>
                </div>
              ) : todaySchedule.length === 0 ? (
                <div className="flex h-32 items-center justify-center">
                  <p className="text-muted-foreground">
                    No appointments scheduled for today
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySchedule.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate("/staff/appointments")}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-r from-blue-500 to-teal-400">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {appointment.patient?.name || "Unknown Patient"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.facility?.name || "Unknown Facility"} •{" "}
                            {appointment.specialist || "General"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-foreground">
                            {format(new Date(appointment.date), "h:mm a")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(appointment.date), "MMM d")}
                          </p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;
