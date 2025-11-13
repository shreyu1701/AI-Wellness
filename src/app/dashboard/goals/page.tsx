"use client";
import { useState } from "react";
import {
  Target,
  Plus,
  Calendar,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  Award,
  Edit,
  Trash2,
} from "lucide-react";

export default function GoalsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: 100,
    category: "wellness",
  });

  const goals = [
    {
      id: 1,
      name: "Daily Mood Log",
      progress: 85,
      target: 100,
      category: "tracking",
      icon: Calendar,
      color: "from-emerald-500 to-cyan-500",
      deadline: "2024-12-31",
      completed: false,
    },
    {
      id: 2,
      name: "Mindfulness Practice",
      progress: 60,
      target: 100,
      category: "wellness",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      deadline: "2024-12-31",
      completed: false,
    },
    {
      id: 3,
      name: "Exercise Routine",
      progress: 40,
      target: 100,
      category: "activity",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      deadline: "2024-12-31",
      completed: false,
    },
    {
      id: 4,
      name: "Sleep Quality",
      progress: 75,
      target: 100,
      category: "wellness",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      deadline: "2024-12-31",
      completed: false,
    },
    {
      id: 5,
      name: "Weekly Reflection",
      progress: 100,
      target: 100,
      category: "reflection",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      deadline: "2024-12-31",
      completed: true,
    },
  ];

  const categories = [
    { id: "all", label: "All Goals", count: goals.length },
    {
      id: "wellness",
      label: "Wellness",
      count: goals.filter((g) => g.category === "wellness").length,
    },
    {
      id: "activity",
      label: "Activity",
      count: goals.filter((g) => g.category === "activity").length,
    },
    {
      id: "tracking",
      label: "Tracking",
      count: goals.filter((g) => g.category === "tracking").length,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredGoals =
    selectedCategory === "all"
      ? goals
      : goals.filter((goal) => goal.category === selectedCategory);

  const completedGoals = goals.filter((g) => g.completed).length;
  const totalProgress =
    goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;

  const handleAddGoal = () => {
    // Here you would typically save to backend
    setShowAddModal(false);
    setNewGoal({ name: "", target: 100, category: "wellness" });
  };

  return (
    <main className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Goals
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Set and track your wellness goals to achieve better mental health
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Overall Progress
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {Math.round(totalProgress)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Active Goals
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {goals.length - completedGoals}
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
                Completed
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {completedGoals}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
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
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => {
          const Icon = goal.icon;
          return (
            <div
              key={goal.id}
              className={`glass backdrop-blur-md border border-white/20 rounded-2xl p-6 ${
                goal.completed ? "opacity-75" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${goal.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {goal.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Progress
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${goal.color} h-3 rounded-full transition-all duration-300 ${
                      goal.completed ? "opacity-50" : ""
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {goal.completed && (
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Goal Completed!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
          <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            No goals found for this category.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Create New Goal
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Daily Meditation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Value
                </label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                >
                  Create Goal
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


