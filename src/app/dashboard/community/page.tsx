"use client";
import { useState } from "react";
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Search,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Posts" },
    { id: "recent", label: "Recent" },
    { id: "popular", label: "Popular" },
    { id: "trending", label: "Trending" },
  ];

  const posts = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "SM",
      time: "2 hours ago",
      content:
        "Just completed my 30-day meditation streak! 🧘‍♀️ Feeling so much more centered and calm. The daily practice has really helped me manage my stress levels. Keep going everyone!",
      likes: 24,
      comments: 8,
      shares: 3,
      category: "wellness",
      trending: true,
    },
    {
      id: 2,
      author: "Mike T.",
      avatar: "MT",
      time: "5 hours ago",
      content:
        "Started using gratitude journaling last week and it's been a game changer. Writing down three things I'm grateful for each day has shifted my perspective. Highly recommend!",
      likes: 18,
      comments: 5,
      shares: 2,
      category: "reflection",
      trending: false,
    },
    {
      id: 3,
      author: "Emma L.",
      avatar: "EL",
      time: "1 day ago",
      content:
        "Had a really tough week, but the community support here has been incredible. Thank you all for the kind words and encouragement. We're in this together! 💚",
      likes: 42,
      comments: 15,
      shares: 7,
      category: "support",
      trending: true,
    },
    {
      id: 4,
      author: "David K.",
      avatar: "DK",
      time: "2 days ago",
      content:
        "Sharing a tip that worked for me: morning walks have significantly improved my mood. Even just 15 minutes makes a difference. Nature + movement = magic! 🌳",
      likes: 31,
      comments: 12,
      shares: 5,
      category: "activity",
      trending: false,
    },
    {
      id: 5,
      author: "Lisa P.",
      avatar: "LP",
      time: "3 days ago",
      content:
        "Celebrating small wins is important! Today I managed my anxiety better during a stressful meeting. Progress isn't always linear, but every step counts. 🎉",
      likes: 28,
      comments: 9,
      shares: 4,
      category: "wellness",
      trending: true,
    },
  ];

  const stats = {
    totalMembers: 1248,
    activeToday: 156,
    postsToday: 23,
  };

  const filteredPosts =
    selectedFilter === "all"
      ? posts
      : selectedFilter === "trending"
      ? posts.filter((p) => p.trending)
      : selectedFilter === "popular"
      ? posts.sort((a, b) => b.likes - a.likes)
      : posts;

  const searchedPosts = filteredPosts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Community
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Connect with others on their wellness journey and share your
          experiences
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Total Members
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {stats.totalMembers.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Active Today
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {stats.activeToday}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Posts Today
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {stats.postsToday}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-3 rounded-xl transition-colors flex items-center space-x-2 ${
                selectedFilter === filter.id
                  ? "bg-emerald-500 text-white"
                  : "bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-600/50"
              }`}
            >
              {filter.id === "trending" && <TrendingUp className="w-4 h-4" />}
              {filter.id === "popular" && <Award className="w-4 h-4" />}
              {filter.id === "recent" && <Clock className="w-4 h-4" />}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Button */}
      <button className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2">
        <MessageCircle className="w-5 h-5" />
        <span>Share Your Wellness Journey</span>
      </button>

      {/* Posts Feed */}
      <div className="space-y-4">
        {searchedPosts.map((post) => (
          <div
            key={post.id}
            className="glass backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">{post.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {post.author}
                  </h3>
                  {post.trending && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.time}</span>
                </p>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 mb-4">
              {post.content}
            </p>

            <div className="flex items-center space-x-6 pt-4 border-t border-white/20 dark:border-slate-700">
              <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Heart className="w-5 h-5" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>{post.shares}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {searchedPosts.length === 0 && (
        <div className="glass backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">
            No posts found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </main>
  );
}
