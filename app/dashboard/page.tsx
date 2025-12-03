"use client";

import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import {
  Briefcase,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import AIRecommendations from "@/components/ai/AIRecommendations";

interface Stats {
  applications: number;
  interviews: number;
  offers: number;
  profile_views: number;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
  jobType?: string;
  location?: string;
  remote?: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  type: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    applications: 0,
    interviews: 0,
    offers: 0,
    profile_views: 0,
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    console.log("🏠 Dashboard component mounted");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("📊 Fetching dashboard data...");
      setLoading(true);

      // Fetch all dashboard data in parallel
      console.log("📡 Making API calls...");
      const [statsRes, applicationsRes, recommendationsRes] = await Promise.all(
        [
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/applications"),
          fetch("/api/dashboard/recommendations"),
        ]
      );

      console.log("📨 API responses:", {
        stats: statsRes.status,
        applications: applicationsRes.status,
        recommendations: recommendationsRes.status,
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log("📊 Stats data:", statsData);
        setStats(statsData);
      } else {
        console.log("❌ Stats request failed:", statsRes.status);
      }

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        console.log("📋 Applications data:", applicationsData);
        setApplications(applicationsData.applications);
      } else {
        console.log("❌ Applications request failed:", applicationsRes.status);
      }

      if (recommendationsRes.ok) {
        const recommendationsData = await recommendationsRes.json();
        console.log("🎯 Recommendations data:", recommendationsData);
        setRecommendations(recommendationsData.recommendations);
      } else {
        console.log(
          "❌ Recommendations request failed:",
          recommendationsRes.status
        );
      }

      console.log("✅ Dashboard data fetch completed");
    } catch (error) {
      console.error("💥 Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Under Review";
      case "reviewed":
        return "Interview Scheduled";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Not Selected";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        {isEntering && <div className="auth-entry-overlay" />}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/20 blur-3xl animate-pulse"></div>
          <div
            className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
        <div className="text-center relative z-10 animate-[floatUp_0.85s_ease-out]">
          <div className="futuristic-loader mx-auto mb-6">
            <div className="futuristic-loader-inner"></div>
          </div>
          <h2 className="auth-title text-2xl font-bold mb-3">
            Loading Dashboard...
          </h2>
          <p className="auth-subtitle">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center">
        <div className="auth-background-grid" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-alert glass-alert-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`mb-8 ${isEntering ? "auth-panel-enter" : ""}`}>
          <h1 className="auth-title text-3xl font-bold mb-2 animate-[floatUp_0.85s_ease-out]">
            Welcome back{user ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="auth-subtitle">
            Here's what's happening with your job search.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div
            className="card"
            style={{ "--float-delay": "0.1s" } as CSSProperties}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                  <Briefcase className="h-6 w-6 md:h-7 md:w-7" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1">
                  Applications
                </p>
                <p className="text-2xl md:text-3xl font-bold text-primary-600">
                  {stats.applications}
                </p>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{ "--float-delay": "0.2s" } as CSSProperties}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                  <Calendar className="h-6 w-6 md:h-7 md:w-7" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1">
                  Interviews
                </p>
                <p className="text-2xl md:text-3xl font-bold text-primary-600">
                  {stats.interviews}
                </p>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{ "--float-delay": "0.3s" } as CSSProperties}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                  <TrendingUp className="h-6 w-6 md:h-7 md:w-7" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1">
                  Offers
                </p>
                <p className="text-2xl md:text-3xl font-bold text-primary-600">
                  {stats.offers}
                </p>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{ "--float-delay": "0.4s" } as CSSProperties}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                  <Users className="h-6 w-6 md:h-7 md:w-7" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1">
                  Profile Views
                </p>
                <p className="text-2xl md:text-3xl font-bold text-primary-600">
                  {stats.profile_views}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        <div className="mb-6 md:mb-8">
          <AIRecommendations />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Recent Applications */}
          <div className="card">
            <div className="flex justify-between items-center mb-6 animate-[floatUp_0.85s_ease-out]">
              <h2 className="feature-heading text-xl font-semibold">
                Recent Applications
              </h2>
              <Link
                href="/applications"
                className="auth-link text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="feature-icon mx-auto mb-4 w-16 h-16">
                  <Briefcase className="w-8 h-8 text-primary-500" />
                </div>
                <p className="auth-subtitle mb-6">No applications yet</p>
                <Link
                  href="/jobs"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app, index) => (
                  <div
                    key={app.id}
                    className="feature-card flex justify-between items-center p-5 group"
                    style={
                      {
                        "--float-delay": `${0.1 + index * 0.08}s`,
                      } as CSSProperties
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-lg group-hover:text-primary-600 transition-colors">
                        {app.jobTitle}
                      </h3>
                      <p className="text-sm text-secondary-600 mb-2">
                        {app.company}
                      </p>
                      <p className="text-xs text-secondary-500">
                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-inner ${
                          app.status === "pending"
                            ? "text-yellow-600 bg-yellow-500/20 border-yellow-500/30 shadow-yellow-700/20"
                            : app.status === "reviewed"
                            ? "text-blue-600 bg-blue-500/20 border-blue-500/30 shadow-blue-700/20"
                            : app.status === "accepted"
                            ? "text-green-600 bg-green-500/20 border-green-500/30 shadow-green-700/20"
                            : app.status === "rejected"
                            ? "text-red-600 bg-red-500/20 border-red-500/30 shadow-red-700/20"
                            : "text-secondary-600 bg-secondary-500/20 border-secondary-500/30 shadow-secondary-700/20"
                        }`}
                      >
                        {getStatusText(app.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="card">
            <div className="flex justify-between items-center mb-6 animate-[floatUp_0.85s_ease-out]">
              <h2 className="feature-heading text-xl font-semibold">
                Recommended for You
              </h2>
              <Link href="/jobs" className="auth-link text-sm font-medium">
                View All Jobs
              </Link>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-12">
                <div className="feature-icon mx-auto mb-4 w-16 h-16">
                  <TrendingUp className="w-8 h-8 text-primary-500" />
                </div>
                <p className="auth-subtitle mb-2">
                  No recommendations available
                </p>
                <p className="text-sm text-secondary-500">
                  Complete your profile to get personalized job recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((job, index) => (
                  <div
                    key={job.id}
                    className="feature-card p-5 group"
                    style={
                      {
                        "--float-delay": `${0.1 + index * 0.08}s`,
                      } as CSSProperties
                    }
                  >
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg group-hover:text-primary-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-3">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-secondary-500">
                        <MapPin className="w-3.5 h-3.5 text-primary-500" />
                        {job.location}
                      </span>
                      {job.remote && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-green-600 font-medium bg-green-500/20 border border-green-500/30 text-xs">
                          Remote
                        </span>
                      )}
                      {job.salary &&
                        typeof job.salary.min === "number" &&
                        typeof job.salary.max === "number" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-primary-600 font-medium bg-primary-500/20 border border-primary-500/30 text-xs">
                            ${job.salary.min}-{job.salary.max}/hour
                          </span>
                        )}
                    </div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-2 auth-link text-sm font-medium group/link"
                    >
                      View Details
                      <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
