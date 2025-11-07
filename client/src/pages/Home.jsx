import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Heart,
  MessageSquare,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    if (isAuthenticated) {
      navigate("/appointments");
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Book appointments 24/7 with real-time availability",
    },
    {
      icon: MessageSquare,
      title: "SMS Reminders",
      description: "Automatic notifications to keep you on track",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your health data is encrypted and secure",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "No more phone calls or long waiting times",
    },
  ];

  const benefits = [
    "Book appointments in under 2 minutes",
    "Access to multiple healthcare facilities",
    "Receive appointment confirmations instantly",
    "Manage all your appointments in one place",
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MediReach
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/appointments">
                    <Button variant="ghost">My Appointments</Button>
                  </Link>
                  <Link to="/profile">
                    <Button>Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-linear-to-r from-blue-600 to-indigo-600">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Trusted by thousands of patients
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Your Health,{" "}
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed">
              Book appointments with top healthcare facilities in seconds.
              MediReach connects you to quality care with automatic reminders
              and seamless appointment management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg h-auto group"
                onClick={handleBookAppointment}
              >
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to="/facilities">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg h-auto border-2"
                >
                  Browse Facilities
                </Button>
              </Link>
            </div>

            {/* Benefits List */}
            <div className="grid sm:grid-cols-2 gap-3 pt-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Card */}
          <div className="lg:pl-8">
            <Card className="border-2 shadow-2xl">
              <CardHeader className="bg-linear-to-br from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Quick Booking</CardTitle>
                    <CardDescription>Schedule in 3 easy steps</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  { step: "1", title: "Choose Facility", icon: MapPin },
                  { step: "2", title: "Select Date & Time", icon: Calendar },
                  {
                    step: "3",
                    title: "Confirm Appointment",
                    icon: CheckCircle2,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <item.icon className="h-5 w-5 text-slate-600" />
                      <span className="font-medium text-slate-900">
                        {item.title}
                      </span>
                    </div>
                    {index < 2 && <div className="h-8 w-px bg-slate-200" />}
                  </div>
                ))}
                <Button
                  className="w-full mt-4 bg-linear-to-r from-blue-600 to-indigo-600"
                  size="lg"
                  onClick={handleBookAppointment}
                >
                  Get Started Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Why Choose MediReach?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Modern healthcare appointment management designed for your
              convenience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-linear-to-br from-blue-600 to-indigo-600 text-white border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48" />
          <CardContent className="p-12 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Take Control of Your Healthcare?
              </h2>
              <p className="text-xl mb-8 text-blue-50">
                Join thousands of patients who trust MediReach for their
                healthcare appointments
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    variant="secondary"
                    className="px-8 py-6 text-lg h-auto"
                    onClick={handleBookAppointment}
                  >
                    Book Your Appointment
                  </Button>
                ) : (
                  <>
                    <Link to="/register">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="px-8 py-6 text-lg h-auto"
                      >
                        Create Free Account
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="px-8 py-6 text-lg h-auto border-2 border-white text-white hover:bg-white/10"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">MediReach</span>
            </div>
            <p className="text-slate-400">
              © 2025 MediReach. Simplifying Healthcare Access.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
