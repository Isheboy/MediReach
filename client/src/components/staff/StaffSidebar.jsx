import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  FileText,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StaffSidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      to: "/staff/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      to: "/staff/appointments",
      icon: Calendar,
      label: "Appointments",
    },
    {
      to: "/staff/patients",
      icon: Users,
      label: "Patients",
    },
    {
      to: "/staff/facilities",
      icon: Building2,
      label: "Facilities",
    },
    {
      to: "/staff/reports",
      icon: FileText,
      label: "Reports",
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo & Brand */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-blue-500 to-teal-400">
          <Stethoscope className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">MediReach</h1>
          <p className="text-xs text-muted-foreground">Staff Portal</p>
        </div>
      </div>

      {/* User Info */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-teal-400">
            <span className="text-sm font-semibold text-white">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "ST"}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">
              {user?.name || "Staff Member"}
            </p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {user?.role || "Staff"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-linear-to-r from-blue-500 to-teal-400 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn("h-5 w-5", isActive && "text-white")}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default StaffSidebar;
