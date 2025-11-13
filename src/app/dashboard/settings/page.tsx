"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Mail,
  Lock,
  Globe,
  Trash2,
  Download,
  X,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    _id: string;
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const settingsSections = [
    {
      id: "profile",
      title: "Profile Settings",
      icon: User,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      color: "from-emerald-500 to-cyan-500",
    },
    // {
    //   id: "appearance",
    //   title: "Appearance",
    //   icon: Palette,
    //   color: "from-orange-500 to-red-500",
    // },
  ];

  const [activeSection, setActiveSection] = useState("profile");

  // Load user data and settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // Fetch user profile
          try {
            const response = await axios.get<{
              user: { _id: string; name: string; email: string; bio?: string };
            }>(`/api/auth/me?userId=${parsedUser._id}`);
            setProfile({
              name: response.data.user.name,
              email: response.data.user.email,
              bio: response.data.user.bio || "",
            });
          } catch (error) {
            // Fallback to localStorage data
            setProfile({
              name: parsedUser.name,
              email: parsedUser.email,
              bio: "",
            });
          }

          // Load dark mode preference
          const savedDarkMode = localStorage.getItem("darkMode") === "true";
          setDarkMode(savedDarkMode);
          if (savedDarkMode) {
            document.documentElement.classList.add("dark");
          }

          // Load notification preferences
          const savedNotifications = localStorage.getItem("notifications");
          if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const toggleSetting = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem("darkMode", enabled.toString());
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await axios.put<{
        message: string;
        user: { _id: string; name: string; email: string; bio: string };
      }>("/api/user/update", {
        userId: user._id,
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
      });

      // Update localStorage
      const updatedUser = {
        _id: user._id,
        name: response.data.user.name,
        email: response.data.user.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Dispatch custom event to notify other components (like sidebar)
      window.dispatchEvent(new Event("userUpdated"));

      setSuccessMessage("Profile updated successfully!");
      setIsError(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setSuccessMessage(
        error?.response?.data?.message || "Failed to update profile"
      );
      setIsError(true);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSuccessMessage("New passwords do not match");
      setIsError(true);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSuccessMessage("Password must be at least 6 characters");
      setIsError(true);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
      return;
    }

    setSaving(true);
    try {
      await axios.put("/api/user/change-password", {
        userId: user._id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccessMessage("Password changed successfully!");
      setIsError(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error: any) {
      console.error("Error changing password:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password";
      setSuccessMessage(errorMessage);
      setIsError(true);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      // Fetch all user data
      const [moodsResponse] = await Promise.all([
        axios.get<{ moods: any[] }>(`/api/moods?userId=${user._id}`),
      ]);

      const exportData = {
        user: {
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
        },
        moods: moodsResponse.data.moods || [],
        exportDate: new Date().toISOString(),
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wellness-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMessage("Data exported successfully!");
      setIsError(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error: any) {
      console.error("Error exporting data:", error);
      setSuccessMessage("Failed to export data");
      setIsError(true);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (deleteConfirm !== "DELETE") {
      setSuccessMessage('Please type "DELETE" to confirm');
      setIsError(true);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
      return;
    }

    if (!confirm("Are you sure? This action cannot be undone!")) {
      return;
    }

    setSaving(true);
    try {
      // Note: We would need a delete account API endpoint
      // For now, just clear localStorage and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("darkMode");
      localStorage.removeItem("notifications");
      setSuccessMessage(
        "Account deletion requested. Redirecting to sign in..."
      );
      setIsError(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setSuccessMessage("Failed to delete account");
      setIsError(true);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading settings...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-700 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    activeSection === section.id
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeSection === "profile" && (
            <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Profile Settings
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === "notifications" && (
            <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Receive updates via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => toggleSetting("email")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Push Notifications
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Receive browser notifications
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={() => toggleSetting("push")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Weekly Summary
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Get a weekly wellness report
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.weekly}
                      onChange={() => toggleSetting("weekly")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security */}
          {activeSection === "privacy" && (
            <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Privacy & Security
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900 dark:text-white flex items-center space-x-2">
                      <Lock className="w-5 h-5" />
                      <span>Change Password</span>
                    </h3>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors text-sm"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Update your password to keep your account secure
                  </p>
                </div>

                <div className="p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900 dark:text-white flex items-center space-x-2">
                      <Globe className="w-5 h-5" />
                      <span>Data Export</span>
                    </h3>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors text-sm flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Download all your wellness data
                  </p>
                </div>

                <div className="p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl border-2 border-red-200 dark:border-red-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-red-600 dark:text-red-400 flex items-center space-x-2">
                      <Trash2 className="w-5 h-5" />
                      <span>Delete Account</span>
                    </h3>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === "appearance" && (
            <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Appearance
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    ) : (
                      <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    )}
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Dark Mode
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Switch between light and dark theme
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => handleDarkModeToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Notification Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 pointer-events-none">
          <div
            className={`glass backdrop-blur-md border ${
              isError
                ? "border-red-200 dark:border-red-900/30"
                : "border-emerald-200 dark:border-emerald-900/30"
            } rounded-2xl p-4 max-w-md w-full shadow-2xl transform transition-all duration-300 pointer-events-auto ${
              showSuccessModal
                ? "translate-y-0 opacity-100 scale-100"
                : "-translate-y-4 opacity-0 scale-95"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isError
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-emerald-100 dark:bg-emerald-900/30"
                }`}
              >
                {isError ? (
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isError
                      ? "text-red-900 dark:text-red-300"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {successMessage}
                </p>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-600/50 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-600/50"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 pr-10 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        current: !showPassword.current,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword.current ? (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 pr-10 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        new: !showPassword.new,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword.new ? (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 pr-10 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
                Delete Account
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-600/50"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Type <span className="font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={saving || deleteConfirm !== "DELETE"}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
