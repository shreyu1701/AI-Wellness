"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Smile,
  Frown,
  Meh,
  Plus,
  TrendingUp,
  Clock,
  Heart,
  X,
  Save,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface MoodEntry {
  _id: string;
  date: string;
  moodType: string;
  moodValue: number;
  energy?: number;
  stress?: number;
  notes?: string;
}

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [user, setUser] = useState<{
    _id: string;
    name: string;
    email: string;
  } | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    averageMood: 0,
    bestDay: "N/A",
    worstDay: "N/A",
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [energy, setEnergy] = useState<number>(5);
  const [stress, setStress] = useState<number>(5);
  const [notes, setNotes] = useState("");

  const moods = [
    {
      id: "happy",
      label: "Happy",
      icon: Smile,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      value: 5,
    },
    {
      id: "neutral",
      label: "Neutral",
      icon: Meh,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      value: 3,
    },
    {
      id: "sad",
      label: "Sad",
      icon: Frown,
      color: "text-red-500",
      bgColor: "bg-red-100",
      value: 1,
    },
  ];

  // Fetch user data and mood entries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // Fetch mood entries
          await fetchMoodEntries(parsedUser._id);
          // Fetch stats
          await fetchStats(parsedUser._id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchMoodEntries = async (userId: string) => {
    try {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Fetch last 30 days for better history
      startDate.setHours(0, 0, 0, 0);

      const response = await axios.get<{ moods: MoodEntry[] }>(
        `/api/moods?userId=${userId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      // Sort by date and time descending (most recent first) for display
      // Ensure proper sorting by timestamp including time component
      const sortedMoods = (response.data.moods || []).sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        // Sort by most recent first (descending order by timestamp)
        // If timestamps are equal, sort by _id as tiebreaker
        if (dateB === dateA) {
          return a._id.localeCompare(b._id);
        }
        return dateB - dateA;
      });
      setMoodHistory(sortedMoods);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    }
  };

  const fetchStats = async (userId: string) => {
    try {
      const response = await axios.get<{
        averageMood: number;
        bestDay: string | null;
        worstDay: string | null;
        streak: number;
        totalEntries: number;
      }>(`/api/moods/stats?userId=${userId}&days=7`);
      setWeeklyStats({
        averageMood: response.data.averageMood,
        bestDay: response.data.bestDay || "N/A",
        worstDay: response.data.worstDay || "N/A",
        streak: response.data.streak,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setShowDetails(true);
  };

  const handleSaveMood = async () => {
    if (!selectedMood || !user) return;

    setSaving(true);
    try {
      const selectedMoodData = moods.find((m) => m.id === selectedMood);
      if (!selectedMoodData) return;

      // Use current date and time by default
      // Create date object from selected date and set to current time
      const now = new Date();
      const selectedDateTime = new Date(selectedDate);

      // Set the time to current time (allows multiple entries per day with different times)
      selectedDateTime.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );

      await axios.post("/api/moods", {
        userId: user._id,
        date: selectedDateTime.toISOString(),
        moodType: selectedMood,
        moodValue: selectedMoodData.value,
        energy: energy,
        stress: stress,
        notes: notes.trim() || undefined,
      });

      // Refresh data
      await fetchMoodEntries(user._id);
      await fetchStats(user._id);

      // Reset form and set date back to today
      setSelectedMood(null);
      setShowDetails(false);
      setEnergy(5);
      setStress(5);
      setNotes("");
      setSelectedDate(new Date().toISOString().split("T")[0]); // Reset to today's date
    } catch (error: any) {
      console.error("Error saving mood:", error);
      alert(error?.response?.data?.message || "Failed to save mood");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedMood(null);
    setShowDetails(false);
    setEnergy(5);
    setStress(5);
    setNotes("");
  };

  // Format mood history for charts
  // Group by day and calculate daily averages for better visualization
  // Show last 7 days for weekly view
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const dailyGroups: {
    [key: string]: {
      moods: number[];
      energies: number[];
      stresses: number[];
      date: Date;
    };
  } = {};

  moodHistory.forEach((entry) => {
    const date = new Date(entry.date);
    // Only include entries from last 7 days
    if (date >= sevenDaysAgo) {
      const dayKey = date.toDateString();

      if (!dailyGroups[dayKey]) {
        dailyGroups[dayKey] = {
          moods: [],
          energies: [],
          stresses: [],
          date: date,
        };
      }

      dailyGroups[dayKey].moods.push(entry.moodValue);
      if (entry.energy) dailyGroups[dayKey].energies.push(entry.energy);
      if (entry.stress) dailyGroups[dayKey].stresses.push(entry.stress);
    }
  });

  // Convert to chart data with daily averages, sorted chronologically
  const chartData = Object.values(dailyGroups)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((day) => ({
      date: day.date.toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: day.date.toISOString().split("T")[0],
      mood:
        day.moods.length > 0
          ? Math.round(
              (day.moods.reduce((sum, m) => sum + m, 0) / day.moods.length) * 10
            ) / 10
          : 0,
      energy:
        day.energies.length > 0
          ? Math.round(
              (day.energies.reduce((sum, e) => sum + e, 0) /
                day.energies.length) *
                10
            ) / 10
          : 0,
      stress:
        day.stresses.length > 0
          ? Math.round(
              (day.stresses.reduce((sum, s) => sum + s, 0) /
                day.stresses.length) *
                10
            ) / 10
          : 0,
    }));

  return (
    <main className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Mood Tracker
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">
          Track your daily moods and emotions to understand your wellness
          patterns
        </p>
      </div>

      {/* Quick Mood Log */}
      <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              How are you feeling today?
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Log your current mood to track your wellness journey
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
              className="px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-1">
              {selectedDate === new Date().toISOString().split("T")[0] ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Today (current time will be used)</span>
                </>
              ) : (
                <span>Selected date (current time will be used)</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-6">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              disabled={saving}
              className={`flex flex-col items-center space-y-2 p-6 rounded-2xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedMood === mood.id
                  ? `${mood.bgColor} ${mood.color} scale-110`
                  : "bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/50"
              }`}
            >
              <mood.icon
                className={`w-12 h-12 ${
                  selectedMood === mood.id
                    ? mood.color
                    : "text-slate-600 dark:text-slate-300"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  selectedMood === mood.id
                    ? mood.color
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        {/* Additional Details Form */}
        {showDetails && selectedMood && (
          <div className="mt-6 p-6 bg-white/50 dark:bg-slate-700/50 rounded-xl border border-white/20 dark:border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Add More Details (Optional)
              </h3>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Energy Level */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Energy Level: {energy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Stress Level */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Stress Level: {stress}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? What's on your mind?"
                  className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={3}
                  maxLength={500}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  {notes.length}/500 characters
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMood}
                  disabled={saving}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Mood</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Average Mood
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {loading
                  ? "..."
                  : weeklyStats.averageMood > 0
                  ? `${weeklyStats.averageMood.toFixed(1)}/5`
                  : "0/5"}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Current Streak
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {weeklyStats.streak} days
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Best Day This Week
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                {weeklyStats.bestDay}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Weekly Mood Trend
            </h3>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  chartData.length > 0
                    ? chartData
                    : [{ date: "No data", mood: 0 }]
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy & Stress Chart */}
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Energy & Stress Levels
            </h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  chartData.length > 0
                    ? chartData
                    : [{ date: "No data", energy: 0, stress: 0 }]
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="energy" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="stress" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Mood History */}
      <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Mood Entries
          </h3>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-slate-500">
              Loading mood entries...
            </div>
          ) : moodHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No mood entries yet. Start tracking your mood above!
            </div>
          ) : (
            moodHistory.map((entry) => {
              const date = new Date(entry.date);
              const moodConfig = moods.find((m) => m.id === entry.moodType);
              return (
                <div
                  key={entry._id}
                  className="p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl border border-white/20 dark:border-slate-600 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${
                        moodConfig?.bgColor || "bg-slate-200"
                      } rounded-xl flex items-center justify-center`}
                    >
                      <span
                        className={`${
                          moodConfig?.color || "text-slate-600"
                        } font-bold`}
                      >
                        {entry.moodValue}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {entry.notes || "No notes"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    {entry.energy && (
                      <div className="text-slate-600 dark:text-slate-300">
                        Energy: {entry.energy}/10
                      </div>
                    )}
                    {entry.stress && (
                      <div className="text-slate-600 dark:text-slate-300">
                        Stress: {entry.stress}/10
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
