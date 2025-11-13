"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb,
  Activity,
  Heart,
  Moon,
  RefreshCw,
} from "lucide-react";

// Types
interface Insight {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  actionable: boolean;
  date: string;
}

// Fix: 'Completed' is not the same as 'actionable'
function formatDate(dateStr: string) {
  // Basic YYYY-MM-DD to readable, fallback to raw string
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString();
}

export default function AIInsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ _id: string } | null>(null);

  const categories = [
    { id: "all", label: "All Insights" },
    { id: "mindfulness", label: "Mindfulness" },
    { id: "activity", label: "Activity" },
    { id: "sleep", label: "Sleep" },
    { id: "nutrition", label: "Nutrition" },
    { id: "social", label: "Social" },
    { id: "other", label: "Other" },
  ];

  // Icon mapping for categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mindfulness":
        return Brain;
      case "activity":
        return Activity;
      case "sleep":
        return Moon;
      case "nutrition":
        return Heart;
      case "social":
        return Heart;
      default:
        return Lightbulb;
    }
  };

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          await loadInsights(parsedUser._id);
        } else {
          setError("User not found. Please sign in again.");
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
        setError("Failed to load insights");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
    // eslint-disable-next-line
  }, []);

  const loadInsights = async (userId: string) => {
    try {
      setError(null);
      const response = await axios.get<{
        insights: Insight[];
        message?: string;
      }>(`/api/ai-insights?userId=${userId}`);
      setInsights(
        Array.isArray(response.data.insights) ? response.data.insights : []
      );
      if (response.data.message) setError(response.data.message);
    } catch (err: any) {
      console.error("Error loading insights:", err);
      setError(err?.response?.data?.message || "Failed to load insights");
    }
  };

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      await loadInsights(user._id);
    } catch {
      // error is handled inside loadInsights
    } finally {
      setRefreshing(false);
    }
  };

  // Filtering
  const filteredInsights =
    selectedCategory === "all"
      ? insights
      : insights.filter((insight) => insight.category === selectedCategory);

  // Bug: The stats.completed was assigned 'actionable'. If tracked (e.g., a field called 'completed'), should use that.
  const stats = {
    totalInsights: insights.length,
    highPriority: insights.filter((i) => i.priority === "high").length,
    actionable: insights.filter((i) => i.actionable).length,
    // For now, completed == 0; should update if API supports completion marking.
    completed: 0,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
      case "low":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <main className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              AI Insights
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Personalized recommendations powered by AI analysis of your mood notes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Total Insights
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {stats.totalInsights}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                High Priority
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {stats.highPriority}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Actionable
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {stats.actionable}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Completed
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {stats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              selectedCategory === category.id
                ? "bg-emerald-500 text-white"
                : "bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-600/50"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass backdrop-blur-md border border-amber-200 dark:border-amber-800 rounded-2xl p-4 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              Analyzing your mood notes and generating insights...
            </p>
          </div>
        ) : filteredInsights.length === 0 ? (
          <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-300">
              No insights found for this category. Keep tracking your mood with
              notes to receive personalized AI recommendations!
            </p>
          </div>
        ) : (
          filteredInsights.map((insight) => {
            const Icon = getCategoryIcon(insight.category);
            return (
              <div
                key={insight.id}
                className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {insight.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            insight.priority
                          )}`}
                        >
                          {insight.priority}
                        </span>
                        {insight.actionable && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            Actionable
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-3">
                        {insight.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(insight.date)}</span>
                        </div>
                        <span className="capitalize">{insight.category}</span>
                      </div>
                    </div>
                  </div>
                  {insight.actionable && (
                    <button className="ml-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors flex-shrink-0">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
