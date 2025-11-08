import { useState } from "react";
import { Search, FileText, Download, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StaffSidebar from "@/components/staff/StaffSidebar";

const StaffReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [reportType, setReportType] = useState("all");

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
                Reports & Analytics
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground">
                View insights and generate reports
              </p>
            </div>

            {/* Global Search */}
            <div className="relative hidden md:block w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" className="gap-2 hidden sm:flex">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Appointments
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">1,234</div>
                <p className="mt-1 text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-teal-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">87%</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  +5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Patient Satisfaction
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">4.8/5</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on 456 reviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reports Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>
                    Generate and download various reports
                  </CardDescription>
                </div>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="appointments">Appointments</SelectItem>
                    <SelectItem value="patients">Patients</SelectItem>
                    <SelectItem value="facilities">Facilities</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    Reports and analytics interface - Coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StaffReports;
