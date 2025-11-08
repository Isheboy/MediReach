import { useState } from "react";
import { Search, UserPlus, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StaffSidebar from "@/components/staff/StaffSidebar";

const StaffPatients = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
                Patients Management
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground">
                View and manage patient records
              </p>
            </div>

            {/* Global Search */}
            <div className="relative hidden md:block w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button className="gap-2 bg-linear-to-r from-blue-500 to-teal-400 text-white hover:opacity-90 hidden sm:flex">
              <UserPlus className="h-4 w-4" />
              Add Patient
            </Button>

            <Button variant="outline" className="gap-2 hidden sm:flex">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>
                Complete patient database and medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">
                  Patients management interface - Coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StaffPatients;
