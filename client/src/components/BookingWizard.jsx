import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { facilitiesAPI, appointmentsAPI } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Stethoscope,
} from "lucide-react";

const SERVICES = [
  "General Checkup",
  "Dental Care",
  "Eye Examination",
  "Vaccination",
  "Lab Tests",
  "Physical Therapy",
  "Mental Health Counseling",
  "Other",
];

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export default function BookingWizard({ onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  // Form state
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [customService, setCustomService] = useState("");
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const response = await facilitiesAPI.getAll();
      setFacilities(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load facilities:", error);
      setFacilities([]);
    }
  };

  const progressValue = (step / 4) * 100;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceedFromStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return selectedFacility && selectedService;
      case 2:
        return selectedDate && selectedTime;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const [hours, minutes] = selectedTime.split(":");
      let appointmentDate = new Date(selectedDate);
      appointmentDate = setHours(appointmentDate, parseInt(hours));
      appointmentDate = setMinutes(appointmentDate, parseInt(minutes));

      const payload = {
        facilityId: selectedFacility._id,
        service: selectedService === "Other" ? customService : selectedService,
        scheduledAt: appointmentDate.toISOString(),
      };

      const response = await appointmentsAPI.create(payload);
      setAppointmentDetails(response.data);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to create appointment:", error);
      alert(error.response?.data?.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    if (onComplete) {
      onComplete();
    } else {
      navigate("/profile");
    }
  };

  // Step 1: Select Facility & Service
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Select Healthcare Facility
        </Label>
        <div className="grid md:grid-cols-2 gap-4">
          {facilities.map((facility) => (
            <Card
              key={facility._id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedFacility?._id === facility._id
                  ? "border-2 border-blue-600 bg-blue-50/50"
                  : "border-2 border-transparent"
              }`}
              onClick={() => setSelectedFacility(facility)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {facility.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs truncate">
                        {facility.location}
                      </span>
                    </CardDescription>
                  </div>
                  {selectedFacility?._id === facility._id && (
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-base font-semibold mb-3 block">
          Select Service Type
        </Label>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SERVICES.map((service) => (
            <Button
              key={service}
              variant={selectedService === service ? "default" : "outline"}
              className={`justify-start h-auto py-3 ${
                selectedService === service
                  ? "bg-blue-600 hover:bg-blue-700"
                  : ""
              }`}
              onClick={() => setSelectedService(service)}
            >
              <Stethoscope className="h-4 w-4 mr-2 shrink-0" />
              {service}
            </Button>
          ))}
        </div>

        {selectedService === "Other" && (
          <div className="mt-4">
            <Label htmlFor="custom-service">Specify Service</Label>
            <Input
              id="custom-service"
              placeholder="Enter service type..."
              value={customService}
              onChange={(e) => setCustomService(e.target.value)}
              className="mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );

  // Step 2: Select Date & Time
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Choose Appointment Date
        </Label>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) =>
              date < new Date() || date < addDays(new Date(), -1)
            }
            className="rounded-md border"
            required
          />
        </div>
      </div>

      {selectedDate && (
        <>
          <Separator />
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Select Time Slot
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`h-12 ${
                    selectedTime === time ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Step 3: Review & Confirm
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Review Your Appointment
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">Facility</p>
              <p className="text-base font-semibold text-slate-900">
                {selectedFacility?.name}
              </p>
              <p className="text-sm text-slate-700 flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {selectedFacility?.location}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Stethoscope className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">Service</p>
              <p className="text-base font-semibold text-slate-900">
                {selectedService === "Other" ? customService : selectedService}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">Date & Time</p>
              <p className="text-base font-semibold text-slate-900">
                {format(selectedDate, "PPPP")}
              </p>
              <p className="text-sm text-slate-700 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {selectedTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Note:</strong> You will receive an SMS confirmation once your
          appointment is confirmed by the facility.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b bg-linear-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">Book Appointment</CardTitle>
              <CardDescription className="mt-1">
                Step {step} of 3: {step === 1 && "Select Facility & Service"}
                {step === 2 && "Choose Date & Time"}
                {step === 3 && "Review & Confirm"}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {step}/3
            </Badge>
          </div>
          <Progress value={progressValue} className="h-2" />
        </CardHeader>

        <CardContent className="pt-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedFromStep(step)}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {loading ? "Booking..." : "Confirm Appointment"}
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Appointment Booked!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your appointment has been successfully scheduled.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {appointmentDetails && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 my-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700">Facility:</span>
                <span className="font-medium">{selectedFacility?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-700">Service:</span>
                <span className="font-medium">
                  {selectedService === "Other"
                    ? customService
                    : selectedService}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-700">Date:</span>
                <span className="font-medium">
                  {format(selectedDate, "PPP")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-700">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-slate-700">Status:</span>
                <Badge variant="secondary">Pending Confirmation</Badge>
              </div>
            </div>
          )}

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction
              onClick={handleSuccessClose}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              View My Appointments
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
