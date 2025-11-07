import React, { useState, useEffect } from "react";
import { format, isPast, isFuture } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Eye,
  Edit,
  X,
  AlertCircle,
} from "lucide-react";
import { appointmentsAPI, facilitiesAPI } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Reschedule form state
  const [rescheduleData, setRescheduleData] = useState({
    scheduledAt: "",
  });

  useEffect(() => {
    loadAppointments();
    loadFacilities();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAll();
      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await facilitiesAPI.getAll();
      setFacilities(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load facilities:", error);
      setFacilities([]);
    }
  };

  const getFacilityName = (facilityId) => {
    const facility = facilities.find((f) => f._id === facilityId);
    return facility ? facility.name : "Unknown Facility";
  };

  const getStatusVariant = (status) => {
    const variants = {
      pending: "warning",
      confirmed: "default",
      completed: "success",
      cancelled: "destructive",
    };
    return variants[status] || "secondary";
  };

  const upcomingAppointments = appointments.filter(
    (apt) =>
      isFuture(new Date(apt.scheduledAt)) &&
      apt.status !== "cancelled" &&
      apt.status !== "completed"
  );

  const pastAppointments = appointments.filter(
    (apt) =>
      isPast(new Date(apt.scheduledAt)) ||
      apt.status === "cancelled" ||
      apt.status === "completed"
  );

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setViewDialogOpen(true);
  };

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      scheduledAt: format(
        new Date(appointment.scheduledAt),
        "yyyy-MM-dd'T'HH:mm"
      ),
    });
    setRescheduleDialogOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    try {
      const scheduledAtISO = new Date(rescheduleData.scheduledAt).toISOString();
      await appointmentsAPI.update(selectedAppointment._id, {
        scheduledAt: scheduledAtISO,
      });
      await loadAppointments();
      setRescheduleDialogOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Failed to reschedule appointment:", error);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await appointmentsAPI.updateStatus(selectedAppointment._id, "cancelled");
      await loadAppointments();
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  // Mobile Card View Component
  const AppointmentCard = ({ appointment }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{appointment.service}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {getFacilityName(appointment.facilityId)}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(appointment.scheduledAt), "PPP")}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {format(new Date(appointment.scheduledAt), "p")}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewDetails(appointment)}
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            {appointment.status === "pending" && activeTab === "upcoming" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRescheduleClick(appointment)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Reschedule
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancelClick(appointment)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Desktop Table View Component
  const AppointmentsTable = ({ appointments }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No appointments found
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {format(new Date(appointment.scheduledAt), "PPP")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(appointment.scheduledAt), "p")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {appointment.service}
                </TableCell>
                <TableCell>{getFacilityName(appointment.facilityId)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(appointment)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {appointment.status === "pending" &&
                        activeTab === "upcoming" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRescheduleClick(appointment)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelClick(appointment)}
                              className="text-destructive focus:text-destructive"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </DropdownMenuItem>
                          </>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {/* Desktop View */}
          <div className="hidden md:block">
            <AppointmentsTable appointments={upcomingAppointments} />
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No upcoming appointments
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {/* Desktop View */}
          <div className="hidden md:block">
            <AppointmentsTable appointments={pastAppointments} />
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No past appointments
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Complete information about your appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={getStatusVariant(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Service</span>
                  <span className="text-sm">{selectedAppointment.service}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Facility</span>
                  <span className="text-sm">
                    {getFacilityName(selectedAppointment.facilityId)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Date</span>
                  <span className="text-sm">
                    {format(new Date(selectedAppointment.scheduledAt), "PPP")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time</span>
                  <span className="text-sm">
                    {format(new Date(selectedAppointment.scheduledAt), "p")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Booked On</span>
                  <span className="text-sm">
                    {format(new Date(selectedAppointment.createdAt), "PPP")}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Choose a new date and time for your appointment
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reschedule-datetime">New Date & Time</Label>
              <Input
                id="reschedule-datetime"
                type="datetime-local"
                value={rescheduleData.scheduledAt}
                onChange={(e) =>
                  setRescheduleData({
                    ...rescheduleData,
                    scheduledAt: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRescheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRescheduleSubmit}>Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Cancel Appointment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedAppointment && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Service:</span>{" "}
                {selectedAppointment.service}
              </div>
              <div className="text-sm">
                <span className="font-medium">Date:</span>{" "}
                {format(new Date(selectedAppointment.scheduledAt), "PPP p")}
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentsTab;
