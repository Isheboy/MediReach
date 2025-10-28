import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Heart, MessageSquare, Shield } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments with healthcare facilities in seconds",
    },
    {
      icon: MessageSquare,
      title: "SMS Reminders",
      description: "Automatic reminders so you never miss an appointment",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health information is protected and confidential",
    },
    {
      icon: Heart,
      title: "Better Healthcare",
      description: "Improve access to quality healthcare services",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">MediReach</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/appointments">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Healthcare Appointments Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with healthcare facilities, schedule appointments, and
            receive automatic SMS reminders. MediReach makes healthcare access
            easy and reliable.
          </p>
          {!isAuthenticated && (
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" className="px-8">
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join MediReach today and experience hassle-free healthcare
            appointment management.
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6" />
              <span className="text-xl font-bold">MediReach</span>
            </div>
            <p className="text-gray-400">
              © 2025 MediReach. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
