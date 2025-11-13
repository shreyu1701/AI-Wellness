"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  BarChart3,
  Calendar,
  Brain,
  Target,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const loadUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        router.push("/signin");
      }
    } else {
      // No user data, redirect to signin
      router.push("/signin");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initial load
    loadUserData();
  }, []);

  useEffect(() => {
    // Listen for storage changes (when user data is updated in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        loadUserData();
      }
    };

    // Listen for custom event (for same-tab updates)
    const handleUserUpdate = () => {
      loadUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  // Refresh user data when pathname changes (e.g., navigating back from settings)
  useEffect(() => {
    if (loading) return; // Don't update if still loading initial data

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [pathname]); // Only depend on pathname, check loading inside

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/dashboard/mood-tracker", label: "Mood Tracker", icon: Calendar },
    { href: "/dashboard/ai-insights", label: "AI Insights", icon: Brain },
    // { href: "/dashboard/goals", label: "Goals", icon: Target },
    // { href: "/dashboard/community", label: "Community", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-r border-white/20 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">WellnessAI</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    active
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className={active ? "font-medium" : ""}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/20">
            {loading ? (
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-700">
                <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-slate-300 dark:bg-slate-600 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-slate-300 dark:bg-slate-600 rounded animate-pulse"></div>
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-700">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span className="block h-0.5 w-6 bg-slate-700 dark:bg-slate-300"></span>
                  <span className="block h-0.5 w-6 bg-slate-700 dark:bg-slate-300"></span>
                  <span className="block h-0.5 w-6 bg-slate-700 dark:bg-slate-300"></span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
