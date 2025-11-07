import { useState, useEffect } from "react";
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
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
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
  }, [selectedDate]);

  useEffect(() => {
    applyFilters();
  }, [
    appointments,
    searchQuery,
    statusFilter,
    specialistFilter,
    timeBlockFilter,
  ]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await api.get("/appointments", {
        params: {
          startDate: startOfDay.toISOString(),
          endDate: endOfDay.toISOString(),
        },
      });

      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Search filter
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

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Specialist filter
    if (specialistFilter !== "all") {
      filtered = filtered.filter((apt) => apt.specialist === specialistFilter);
    }

    // Time block filter
    if (timeBlockFilter !== "all") {
      filtered = filtered.filter((apt) => {
        const hour = new Date(apt.date).getHours();
        if (timeBlockFilter === "morning") return hour >= 6 && hour < 12;
        if (timeBlockFilter === "afternoon") return hour >= 12 && hour < 17;
        if (timeBlockFilter === "evening") return hour >= 17 && hour < 21;
        return true;
      });
    }

    setFilteredAppointments(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      "checked-in": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleCheckIn = async () => {
    try {
      await api.put(`/appointments/${checkInDialog.appointment._id}`, {
        status: "checked-in",
      });

      setCheckInDialog({ open: false, appointment: null });
      fetchAppointments();
    } catch (error) {
      console.error("Error checking in appointment:", error);
    }
  };

  const handleCancel = async () => {
    try {
      await api.put(`/appointments/${cancelDialog.appointment._id}`, {
        status: "cancelled",
        cancellationReason: cancelReason,
      });

      setCancelDialog({ open: false, appointment: null });
      setCancelReason("");
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
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
          <div className="flex h-16 items-center gap-4 px-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Appointments Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and track patient appointments
              </p>
            </div>

            {/* Global Search */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, phone, or facility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
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
                        <span>Pick a date</span>
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
                        <TableRow key={appointment._id}>
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
                              {appointment.status}
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
            <AlertDialogTitle>Check In Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to check in{" "}
              {checkInDialog.appointment?.patient?.name}? This will update the
              appointment status to "Checked In".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCheckIn}>
              Confirm Check-In
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
