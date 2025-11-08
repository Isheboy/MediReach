import { useState } from "react";
import {
  Search,
  Edit,
  Lock,
  Plus,
  FileText,
  Calendar as CalendarIcon,
  Clock,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { useAuth } from "@/contexts/AuthContext";

const StaffProfile = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [editBasicInfoOpen, setEditBasicInfoOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [addCredentialOpen, setAddCredentialOpen] = useState(false);
  const [adjustAvailabilityOpen, setAdjustAvailabilityOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock staff data - would come from API
  const staffData = {
    name: user?.name || "Dr. Grace Kimaro",
    role: user?.role === "admin" ? "Administrator" : "Medical Professional",
    department: "Cardiology",
    employeeId: "EMP-2024-001",
    status: "Active",
    location: "Muhimbili National Hospital",
    email: "grace.kimaro@medireach.tz",
    phone: user?.phone || "+255 713 456 789",
    dateOfHire: "2023-01-15",
    emergencyContact: "+255 713 999 888",
    emergencyContactName: "John Kimaro",
  };

  const credentials = [
    {
      id: 1,
      name: "Medical License",
      issuingBody: "Tanzania Medical Council",
      expirationDate: "2026-12-31",
      status: "Valid",
    },
    {
      id: 2,
      name: "BLS Certification",
      issuingBody: "American Heart Association",
      expirationDate: "2025-03-15",
      status: "Valid",
    },
    {
      id: 3,
      name: "ACLS Certification",
      issuingBody: "American Heart Association",
      expirationDate: "2024-12-01",
      status: "Expiring Soon",
    },
  ];

  const schedule = [
    {
      day: "Monday",
      hours: "8:00 AM - 5:00 PM",
      location: "Muhimbili National Hospital",
    },
    {
      day: "Tuesday",
      hours: "8:00 AM - 5:00 PM",
      location: "Muhimbili National Hospital",
    },
    {
      day: "Wednesday",
      hours: "8:00 AM - 5:00 PM",
      location: "Muhimbili National Hospital",
    },
    {
      day: "Thursday",
      hours: "8:00 AM - 2:00 PM",
      location: "Muhimbili National Hospital",
    },
    {
      day: "Friday",
      hours: "8:00 AM - 5:00 PM",
      location: "Muhimbili National Hospital",
    },
  ];

  const getCredentialBadge = (status) => {
    if (status === "Valid") return "bg-green-100 text-green-800";
    if (status === "Expiring Soon") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
                My Profile
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Manage your professional information and credentials
              </p>
            </div>

            {/* Global Search */}
            <div className="relative hidden md:block w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          {/* Profile Header Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-lg">
                  <AvatarImage src="" alt={staffData.name} />
                  <AvatarFallback className="bg-linear-to-r from-blue-500 to-teal-400 text-xl sm:text-2xl font-bold text-white">
                    {getInitials(staffData.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Basic Info */}
                <div className="flex-1 w-full">
                  <div className="mb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        {staffData.name}
                      </h2>
                      <p className="text-base sm:text-lg text-muted-foreground">
                        {staffData.role} • {staffData.department}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditBasicInfoOpen(true)}
                      className="gap-2 w-full sm:w-auto"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit Basic Info</span>
                      <span className="sm:hidden">Edit Info</span>
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      className={
                        staffData.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      {staffData.status}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {staffData.location}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Briefcase className="h-3 w-3" />
                      {staffData.employeeId}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Details & Contact</span>
                <span className="sm:hidden">Details</span>
              </TabsTrigger>
              <TabsTrigger value="credentials" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">
                  Credentials & Licensing
                </span>
                <span className="sm:hidden">Credentials</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">
                  Schedule & Availability
                </span>
                <span className="sm:hidden">Schedule</span>
              </TabsTrigger>
            </TabsList>

            {/* Details & Contact Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your contact details and employment information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input value={staffData.email} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input value={staffData.phone} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        Employee ID
                      </Label>
                      <Input value={staffData.employeeId} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        Date of Hire
                      </Label>
                      <Input
                        value={format(new Date(staffData.dateOfHire), "PPP")}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <UserIcon className="h-4 w-4" />
                        Emergency Contact Name
                      </Label>
                      <Input value={staffData.emergencyContactName} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        Emergency Contact Phone
                      </Label>
                      <Input value={staffData.emergencyContact} disabled />
                    </div>
                  </div>

                  <div className="flex justify-end border-t pt-4">
                    <Button
                      onClick={() => setChangePasswordOpen(true)}
                      className="gap-2 bg-linear-to-r from-blue-500 to-teal-400 text-white hover:opacity-90"
                    >
                      <Lock className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Credentials & Licensing Tab */}
            <TabsContent value="credentials" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle>Professional Credentials</CardTitle>
                      <CardDescription>
                        Manage your licenses, certifications, and compliance
                        training
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setAddCredentialOpen(true)}
                      className="gap-2 bg-linear-to-r from-blue-500 to-teal-400 text-white hover:opacity-90 w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        Add New Credential
                      </span>
                      <span className="sm:hidden">Add Credential</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Desktop Table */}
                  <div className="hidden rounded-md border md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Credential Name</TableHead>
                          <TableHead>Issuing Body</TableHead>
                          <TableHead>Expiration Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {credentials.map((credential) => (
                          <TableRow key={credential.id}>
                            <TableCell className="font-medium">
                              {credential.name}
                            </TableCell>
                            <TableCell>{credential.issuingBody}</TableCell>
                            <TableCell>
                              {format(
                                new Date(credential.expirationDate),
                                "PPP"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getCredentialBadge(
                                  credential.status
                                )}
                              >
                                {credential.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                View Document
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="space-y-4 md:hidden">
                    {credentials.map((credential) => (
                      <Card key={credential.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">
                              {credential.name}
                            </CardTitle>
                            <Badge
                              className={getCredentialBadge(credential.status)}
                            >
                              {credential.status}
                            </Badge>
                          </div>
                          <CardDescription>
                            {credential.issuingBody}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Expires:
                              </span>
                              <span className="font-medium">
                                {format(
                                  new Date(credential.expirationDate),
                                  "PPP"
                                )}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              View Document
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule & Availability Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar View</CardTitle>
                    <CardDescription>
                      Select a date to view scheduled appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                {/* Work Schedule */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <CardTitle>Recurring Work Schedule</CardTitle>
                        <CardDescription>
                          Your standard weekly hours
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setAdjustAvailabilityOpen(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          Adjust Availability
                        </span>
                        <span className="sm:hidden">Edit Schedule</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {schedule.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {item.day}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.location}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium text-foreground">
                            {item.hours}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Edit Basic Info Dialog */}
      <Dialog open={editBasicInfoOpen} onOpenChange={setEditBasicInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Basic Information</DialogTitle>
            <DialogDescription>
              Update your contact details and personal information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={staffData.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue={staffData.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency-name">Emergency Contact Name</Label>
              <Input
                id="emergency-name"
                defaultValue={staffData.emergencyContactName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
              <Input
                id="emergency-phone"
                type="tel"
                defaultValue={staffData.emergencyContact}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditBasicInfoOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-linear-to-r from-blue-500 to-teal-400 text-white hover:opacity-90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your account password for security
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangePasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-linear-to-r from-blue-500 to-teal-400 text-white hover:opacity-90">
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Credential Dialog */}
      <Dialog open={addCredentialOpen} onOpenChange={setAddCredentialOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Credential</DialogTitle>
            <DialogDescription>
              Add a new professional license or certification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credential-name">Credential Name</Label>
              <Input id="credential-name" placeholder="e.g., Medical License" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuing-body">Issuing Body</Label>
              <Input
                id="issuing-body"
                placeholder="e.g., Tanzania Medical Council"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiration-date">Expiration Date</Label>
              <Input id="expiration-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">Upload Document</Label>
              <Input id="document" type="file" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddCredentialOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-linear-to-r from-blue-500 to-teal-400 text-white hover:opacity-90">
              Add Credential
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Availability Dialog */}
      <Dialog
        open={adjustAvailabilityOpen}
        onOpenChange={setAdjustAvailabilityOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Availability</DialogTitle>
            <DialogDescription>
              Update your work schedule and time off
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Schedule adjustment functionality will allow you to modify your
              recurring work hours and request time off.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdjustAvailabilityOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffProfile;
