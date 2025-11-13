"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  TrendingUp,
  Brain,
  Plus,
  Smile,
  Frown,
  Meh,
  ChevronRight,
  Target,
  Award,
  X,
  Save,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface MoodEntry {
  _id: string;
  date: string;
  moodType: string;
  moodValue: number;
}

interface Insight {
  id: number;
  title: string;
  description: string;
  priority: string;
}

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [energy, setEnergy] = useState<number>(5);
  const [stress, setStress] = useState<number>(5);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<{ _id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    streak: 0,
    averageMood: 0,
    aiInsightsCount: 0,
    goalsCompleted: 0, // Used for "Mood Logs This Week" stat
  });
  const [moodData, setMoodData] = useState<{ date: string; mood: number }[]>(
    []
  );
  const [moodDistribution, setMoodDistribution] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [aiRecommendations, setAiRecommendations] = useState<Insight[]>([]);
  const router = useRouter();

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

  // Fetch user data and dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          await Promise.all([
            fetchStats(parsedUser._id),
            fetchMoodData(parsedUser._id),
            fetchAIRecommendations(parsedUser._id),
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchStats = async (userId: string) => {
    try {
      const response = await axios.get<{
        streak: number;
        averageMood: number;
        totalEntries: number;
      }>(`/api/moods/stats?userId=${userId}&days=7`);

      setStats((prev) => ({
        ...prev,
        streak: response.data.streak,
        averageMood: response.data.averageMood,
        // Calculate mood log progress (7 days = 100%)
        goalsCompleted: Math.min(response.data.totalEntries, 7),
      }));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchMoodData = async (userId: string) => {
    try {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);

      const response = await axios.get<{ moods: MoodEntry[] }>(
        `/api/moods?userId=${userId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      // Group by day and calculate daily averages for chart
      const dailyGroups: {
        [key: string]: { moods: number[]; date: Date };
      } = {};

      response.data.moods.forEach((entry) => {
        const date = new Date(entry.date);
        const dayKey = date.toDateString();
        if (!dailyGroups[dayKey]) {
          dailyGroups[dayKey] = {
            moods: [],
            date: date,
          };
        }
        dailyGroups[dayKey].moods.push(entry.moodValue);
      });

      // Convert to chart data
      const chartData = Object.values(dailyGroups)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((day) => ({
          date: day.date.toLocaleDateString("en-US", { weekday: "short" }),
          mood:
            day.moods.length > 0
              ? Math.round(
                  (day.moods.reduce((sum, m) => sum + m, 0) /
                    day.moods.length) *
                    10
                ) / 10
              : 0,
        }));

      setMoodData(chartData.length > 0 ? chartData : []);

      // Calculate mood distribution
      const distribution: { [key: string]: number } = {
        Happy: 0,
        Neutral: 0,
        Sad: 0,
      };

      response.data.moods.forEach((entry) => {
        if (entry.moodType === "happy") distribution.Happy++;
        else if (entry.moodType === "neutral") distribution.Neutral++;
        else if (entry.moodType === "sad") distribution.Sad++;
      });

      const total = Object.values(distribution).reduce(
        (sum, val) => sum + val,
        0
      );
      if (total > 0) {
        setMoodDistribution([
          {
            name: "Happy",
            value: Math.round((distribution.Happy / total) * 100),
            color: "#10b981",
          },
          {
            name: "Neutral",
            value: Math.round((distribution.Neutral / total) * 100),
            color: "#f59e0b",
          },
          {
            name: "Sad",
            value: Math.round((distribution.Sad / total) * 100),
            color: "#ef4444",
          },
        ]);
      } else {
        setMoodDistribution([]);
      }
    } catch (error) {
      console.error("Error fetching mood data:", error);
    }
  };

  const fetchAIRecommendations = async (userId: string) => {
    try {
      const response = await axios.get<{ insights: Insight[] }>(
        `/api/ai-insights?userId=${userId}`
      );
      setAiRecommendations(response.data.insights?.slice(0, 3) || []);
      setStats((prev) => ({
        ...prev,
        aiInsightsCount: response.data.insights?.length || 0,
      }));
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setShowMoodModal(true);
  };

  const handleSaveMood = async () => {
    if (!selectedMood || !user) return;

    setSaving(true);
    try {
      const selectedMoodData = moods.find((m) => m.id === selectedMood);
      if (!selectedMoodData) return;

      // Use current date and time by default
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

      // Refresh dashboard data
      await Promise.all([
        fetchStats(user._id),
        fetchMoodData(user._id),
        fetchAIRecommendations(user._id),
      ]);

      // Reset form
      setSelectedMood(null);
      setShowMoodModal(false);
      setEnergy(5);
      setStress(5);
      setNotes("");
      setSelectedDate(new Date().toISOString().split("T")[0]);
    } catch (error: any) {
      console.error("Error saving mood:", error);
      alert(error?.response?.data?.message || "Failed to save mood");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowMoodModal(false);
    setSelectedMood(null);
    setEnergy(5);
    setStress(5);
    setNotes("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <main className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">
          {user
            ? `Welcome back, ${user.name}! Here's your wellness overview.`
            : "Welcome back! Here's your wellness overview."}
        </p>
      </div>
      {/* Quick Mood Check */}
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
          <button
            onClick={() => router.push("/dashboard/mood-tracker")}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-600/50 transition-colors"
            title="Go to Mood Tracker"
          >
            <Plus className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex justify-center space-x-6">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`flex flex-col items-center space-y-2 p-4 rounded-2xl transition-all duration-200 hover:scale-105 ${
                selectedMood === mood.id
                  ? `${mood.bgColor} ${mood.color} scale-110`
                  : "bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/50"
              }`}
            >
              <mood.icon
                className={`w-8 h-8 ${
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
      </div>

      {/* Mood Entry Modal */}
      {showMoodModal && selectedMood && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Log Your Mood
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-600/50 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            {/* Selected Mood Display */}
            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Selected Mood:
              </p>
              <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                {(() => {
                  const moodData = moods.find((m) => m.id === selectedMood);
                  if (!moodData) return null;
                  const MoodIcon = moodData.icon;
                  return (
                    <>
                      <div
                        className={`w-12 h-12 ${moodData.bgColor} rounded-xl flex items-center justify-center`}
                      >
                        <MoodIcon className={`w-6 h-6 ${moodData.color}`} />
                      </div>
                      <span className={`text-lg font-medium ${moodData.color}`}>
                        {moodData.label}
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Date
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="flex-1 px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {selectedDate === new Date().toISOString().split("T")[0] && (
                  <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Today</span>
                  </div>
                )}
              </div>
            </div>

            {/* Energy Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Energy Level: {energy}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Stress Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Stress Level: {stress}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling? What's on your mind?"
                rows={4}
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMood}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? "..." : `${stats.streak} days`}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          {stats.streak > 0 && (
            <div className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              Keep it up!
            </div>
          )}
        </div>

        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Average Mood
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading
                  ? "..."
                  : stats.averageMood > 0
                  ? `${stats.averageMood.toFixed(1)}/5`
                  : "0/5"}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
          </div>
          {stats.averageMood > 0 && (
            <div className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              This week
            </div>
          )}
        </div>

        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                AI Insights
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? "..." : stats.aiInsightsCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Brain className="w-4 h-4 mr-1" />
            {stats.aiInsightsCount > 0
              ? "Available"
              : "Add notes to get insights"}
          </div>
        </div>

        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Mood Logs This Week
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? "..." : `${stats.goalsCompleted}/7`}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            {loading
              ? "..."
              : `${Math.round((stats.goalsCompleted / 7) * 100)}% completion`}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Mood Trend
            </h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-500">Loading chart...</div>
              </div>
            ) : moodData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <p>No mood data yet</p>
                  <p className="text-sm mt-2">
                    Start tracking your mood to see trends!
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
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
            )}
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Mood Distribution
            </h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-500">Loading chart...</div>
              </div>
            ) : moodDistribution.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <p>No mood data yet</p>
                  <p className="text-sm mt-2">
                    Start tracking to see distribution!
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            AI Recommendations
          </h3>
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-slate-500">
              Loading recommendations...
            </div>
          ) : aiRecommendations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No recommendations yet</p>
              <p className="text-sm mt-2">
                Add notes to your mood entries to get AI insights!
              </p>
            </div>
          ) : (
            aiRecommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl border border-white/20 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {rec.title}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === "high"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : rec.priority === "medium"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                        : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {rec.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
