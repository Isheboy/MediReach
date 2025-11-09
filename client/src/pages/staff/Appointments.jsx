import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Eye,
  Edit,
  XCircle,
  Download,
  Search,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StaffSidebar from "@/components/staff/StaffSidebar";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const StaffAppointments = () => {
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters - Check URL params for initial filter value
  const [selectedDate, setSelectedDate] = useState(null); // No date filter by default
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("filter") || "all"
  );
  const [specialistFilter, setSpecialistFilter] = useState("all");
  const [timeBlockFilter, setTimeBlockFilter] = useState("all");

  // Dialogs
  const [checkInDialog, setCheckInDialog] = useState({
    open: false,
    appointment: null,
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    appointment: null,
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    appointment: null,
  });
  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    appointment: null,
  });
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchAppointments();

    // Setup polling for real-time updates (every 30 seconds)
    const pollInterval = setInterval(() => {
      fetchAppointments();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [selectedDate, statusFilter, specialistFilter, timeBlockFilter]);

  useEffect(() => {
    applyFilters();
  }, [appointments, searchQuery]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params dynamically
      const params = {};

      // Only add date filter if a specific date is selected
      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        params.startDate = startOfDay.toISOString();
        params.endDate = endOfDay.toISOString();
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (specialistFilter !== "all") {
        params.specialist = specialistFilter;
      }

      if (timeBlockFilter !== "all") {
        params.timeBlock = timeBlockFilter;
      }

      const response = await api.get("/api/appointments/staff", { params });

      console.log("✅ Appointments fetched successfully:", response.data);
      console.log("Total appointments:", response.data.length);

      setAppointments(response.data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);

      // Show specific error message
      if (error.response?.status === 403) {
        setError("Access denied. Please ensure you're logged in as staff.");
      } else if (error.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else {
        setError(
          error.response?.data?.error ||
            "Failed to load appointments. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Search filter (client-side for immediate feedback)
    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.patient?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          apt.patient?.phone?.includes(searchQuery) ||
          apt.facility?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200", // Amber for pending - requires action
      confirmed: "bg-blue-100 text-blue-900 border-blue-300",
      completed: "bg-green-100 text-green-900 border-green-300",
      cancelled: "bg-gray-100 text-gray-900 border-gray-300",
      reschedule_pending_patient:
        "bg-purple-100 text-purple-900 border-purple-300", // Staff proposed, awaiting patient
      pending_staff_review: "bg-orange-100 text-orange-900 border-orange-300", // Patient requested, awaiting staff
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      reschedule_pending_patient: "Reschedule (Awaiting Patient)",
      pending_staff_review: "Reschedule (Awaiting Staff)",
    };
    return labels[status] || status;
  };

  const handleCheckIn = async () => {
    const appointmentId = checkInDialog.appointment._id;
    const appointmentService =
      checkInDialog.appointment.specialist || "Appointment";

    try {
      setCheckInDialog({ open: false, appointment: null });

      // Use the new confirm endpoint
      const response = await api.post(
        `/api/appointments/${appointmentId}/confirm`
      );

      console.log("✅ Appointment confirmed:", response.data);

      // Show success message
      alert(
        `✅ ${appointmentService} confirmed successfully! Patient has been notified.`
      );

      // If we're filtering by pending, the confirmed appointment will disappear
      // This is expected behavior - switch to "all" to see it
      if (statusFilter === "pending") {
        console.log(
          "💡 Tip: Switch filter to 'All Statuses' to see confirmed appointment"
        );
      }

      // Re-fetch to get updated data
      await fetchAppointments();
    } catch (error) {
      console.error("❌ Error confirming appointment:", error);
      console.error("Error details:", error.response?.data);

      const errorMessage =
        error.response?.data?.error || "Failed to confirm appointment";
      setError(errorMessage);
      alert(`❌ ${errorMessage}`);

      // Re-fetch to ensure UI is in sync
      await fetchAppointments();
    }
  };

  const handleCancel = async () => {
    const appointmentId = cancelDialog.appointment._id;

    try {
      // Optimistic update
      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: "canceled" } : apt
        )
      );

      setCancelDialog({ open: false, appointment: null });
      setCancelReason("");

      // Server update
      await api.patch(`/api/appointments/${appointmentId}`, {
        status: "canceled",
        cancellationReason: cancelReason,
      });

      // Re-fetch to confirm
      await fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setError("Failed to cancel appointment");
      // Revert optimistic update on error
      await fetchAppointments();
    }
  };

  const specialists = [
    ...new Set(appointments.map((a) => a.specialist)),
  ].filter(Boolean);

  return (
    <div className="flex h-screen bg-background">
      <StaffSidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
          <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
            {/* Mobile spacing for hamburger menu */}
            <div className="lg:hidden w-10" />

            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                Appointments Management
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Manage and track patient appointments
              </p>
            </div>

            {/* Global Search */}
            <div className="relative hidden md:block w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, phone, or facility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" className="gap-2 hidden sm:flex">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Error Alert */}
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}

          {/* Pending Appointments Alert */}
          {appointments.filter((apt) => apt.status === "pending").length >
            0 && (
            <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">
                    {
                      appointments.filter((apt) => apt.status === "pending")
                        .length
                    }{" "}
                    Pending Appointment
                    {appointments.filter((apt) => apt.status === "pending")
                      .length !== 1
                      ? "s"
                      : ""}{" "}
                    Require Action
                  </h3>
                  <p className="text-sm text-amber-700">
                    New appointments are waiting for your review and
                    confirmation.
                  </p>
                </div>
                <Button
                  onClick={() => setStatusFilter("pending")}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  View Pending
                </Button>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Appointments Center</CardTitle>
                  <CardDescription>
                    {filteredAppointments.length} appointment
                    {filteredAppointments.length !== 1 ? "s" : ""} found
                  </CardDescription>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="mt-4 flex flex-wrap gap-4">
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-60 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>All Dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                    {selectedDate && (
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedDate(null)}
                        >
                          Clear Date Filter
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="checked-in">Checked In</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Specialist Filter */}
                <Select
                  value={specialistFilter}
                  onValueChange={setSpecialistFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by specialist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialists</SelectItem>
                    {specialists.map((specialist) => (
                      <SelectItem key={specialist} value={specialist}>
                        {specialist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Time Block Filter */}
                <Select
                  value={timeBlockFilter}
                  onValueChange={setTimeBlockFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Times</SelectItem>
                    <SelectItem value="morning">
                      Morning (6 AM - 12 PM)
                    </SelectItem>
                    <SelectItem value="afternoon">
                      Afternoon (12 PM - 5 PM)
                    </SelectItem>
                    <SelectItem value="evening">
                      Evening (5 PM - 9 PM)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-muted-foreground">
                    Loading appointments...
                  </p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      No appointments found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Facility</TableHead>
                        <TableHead>Specialist</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow
                          key={appointment._id}
                          className={
                            appointment.status === "pending"
                              ? "bg-amber-50/50 hover:bg-amber-100/50 border-l-4 border-l-amber-500"
                              : "hover:bg-muted/50"
                          }
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {format(new Date(appointment.date), "h:mm a")}
                            </div>
                          </TableCell>
                          <TableCell>
                            {appointment.patient?.name || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {appointment.patient?.phone || "N/A"}
                          </TableCell>
                          <TableCell>
                            {appointment.facility?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {appointment.specialist || "General"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(appointment.status)}
                            >
                              {getStatusLabel(appointment.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {appointment.status === "pending" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setCheckInDialog({
                                        open: true,
                                        appointment,
                                      })
                                    }
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                                    Accept & Confirm
                                  </DropdownMenuItem>
                                )}
                                {appointment.status === "scheduled" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setCheckInDialog({
                                        open: true,
                                        appointment,
                                      })
                                    }
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Check In
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    setViewDialog({ open: true, appointment })
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setEditDialog({ open: true, appointment })
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit / Reschedule
                                </DropdownMenuItem>
                                {appointment.status !== "cancelled" &&
                                  appointment.status !== "completed" && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setCancelDialog({
                                            open: true,
                                            appointment,
                                          })
                                        }
                                        className="text-destructive"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancel Appointment
                                      </DropdownMenuItem>
                                    </>
                                  )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Check-In Dialog */}
      <AlertDialog
        open={checkInDialog.open}
        onOpenChange={(open) => setCheckInDialog({ open, appointment: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {checkInDialog.appointment?.status === "pending"
                ? "Accept & Confirm Appointment"
                : "Check In Patient"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {checkInDialog.appointment?.status === "pending" ? (
                <>
                  Are you sure you want to accept and confirm the appointment
                  for {checkInDialog.appointment?.patient?.name}? This will
                  update the status to "Confirmed".
                </>
              ) : (
                <>
                  Are you sure you want to check in{" "}
                  {checkInDialog.appointment?.patient?.name}? This will update
                  the appointment status to "Confirmed".
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCheckIn}>
              {checkInDialog.appointment?.status === "pending"
                ? "Accept & Confirm"
                : "Confirm Check-In"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, appointment: null })}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Complete information about this appointment
            </DialogDescription>
          </DialogHeader>
          {viewDialog.appointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Patient Name</Label>
                  <p className="mt-1 font-medium">
                    {viewDialog.appointment.patient?.name}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone Number</Label>
                  <p className="mt-1 font-medium">
                    {viewDialog.appointment.patient?.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date & Time</Label>
                  <p className="mt-1 font-medium">
                    {format(new Date(viewDialog.appointment.date), "PPP p")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge
                      className={getStatusColor(viewDialog.appointment.status)}
                    >
                      {viewDialog.appointment.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Facility</Label>
                  <p className="mt-1 font-medium">
                    {viewDialog.appointment.facility?.name}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Specialist</Label>
                  <p className="mt-1 font-medium">
                    {viewDialog.appointment.specialist || "General"}
                  </p>
                </div>
              </div>
              {viewDialog.appointment.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="mt-1">{viewDialog.appointment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, appointment: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit / Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Modify appointment details for{" "}
              {editDialog.appointment?.patient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Edit functionality will be implemented with form fields for date,
              time, specialist, etc.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <AlertDialog
        open={cancelDialog.open}
        onOpenChange={(open) => {
          setCancelDialog({ open, appointment: null });
          setCancelReason("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the appointment for{" "}
              {cancelDialog.appointment?.patient?.name}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="cancelReason">Cancellation Reason</Label>
            <Textarea
              id="cancelReason"
              placeholder="Enter reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffAppointments;
