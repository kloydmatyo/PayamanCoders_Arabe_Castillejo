"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink,
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
      const [statsRes, applicationsRes, recommendationsRes] =
        await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/applications"),
          fetch("/api/dashboard/recommendations"),
        ]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Dashboard...
          </h2>
          <p className="text-gray-600">Please wait while we fetch your data</p>
        </div>
        <div className="animate-pulse mt-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{user ? `, ${user.firstName}` : ""}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your job search.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.applications}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.interviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.profile_views}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="mb-8">
        <AIRecommendations />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Applications
            </h2>
            <Link
              href="/applications"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No applications yet</p>
              <Link href="/jobs" className="btn-primary">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {app.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-600">{app.company}</p>
                    <p className="text-xs text-gray-500">
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {getStatusText(app.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recommended for You
            </h2>
            <Link
              href="/jobs"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All Jobs
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No recommendations available</p>
              <p className="text-sm text-gray-400">
                Complete your profile to get personalized job recommendations
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {job.location} {job.remote && "• Remote"}
                    {job.salary && typeof job.salary.min === 'number' && typeof job.salary.max === 'number' &&
                      ` • $${job.salary.min}-${job.salary.max}/hour`}
                  </p>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Details
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
