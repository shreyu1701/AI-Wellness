"use client";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Heart,
  Lightbulb,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Get personalized recommendations based on your mood patterns and wellness goals.",
    },
    {
      icon: BarChart3,
      title: "Mood Tracking",
      description:
        "Track your daily emotions and visualize trends with beautiful, interactive charts.",
    },
    {
      icon: Lightbulb,
      title: "Wellness Tips",
      description:
        "Receive curated mindfulness exercises, relaxation techniques, and wellness content.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your mental health data is encrypted and secure. Your privacy is our priority.",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Connect with others on similar wellness journeys in a supportive environment.",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description:
        "See your growth over time with detailed analytics and progress tracking.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content:
        "This app has transformed how I understand my mental health. The AI insights are incredibly accurate.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Student",
      content:
        "The mood tracking feature helps me identify patterns I never noticed before. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Teacher",
      content:
        "The wellness tips are so helpful. I feel more in control of my mental well-being now.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                WellnessAI
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                Testimonials
              </Link>
              {/* <Link
                href="#pricing"
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                Pricing
              </Link> */}
              <Link
                href="/signin"
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span
                  className={`block h-0.5 w-6 bg-slate-700 dark:bg-slate-300 transition-all ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-slate-700 dark:bg-slate-300 transition-all ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-slate-700 dark:bg-slate-300 transition-all ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/20">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="#features"
                className="block text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="block text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="block text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                Pricing
              </Link>
              <div className="pt-4 space-y-2">
                <Link
                  href="/signin"
                  className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full text-center hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Mental Wellness
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Transform Your
              <span className="block gradient-text">Mental Wellness</span>
              Journey
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track your moods, discover patterns, and receive personalized
              AI-driven insights to improve your mental well-being. Start your
              journey to better mental health today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-full font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  10K+
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  95%
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Satisfaction Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  24/7
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  AI Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features for Your Wellness
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need to understand and improve your mental health,
              powered by cutting-edge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Join thousands of users who have transformed their mental wellness
              journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4 italic">
                  {testimonial.content}
                </p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-500 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of users who are already improving their mental
            health with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/signin"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">WellnessAI</span>
              </div>
              <p className="text-slate-400 mb-4">
                Empowering mental wellness through AI-driven insights and
                personalized recommendations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 WellnessAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
