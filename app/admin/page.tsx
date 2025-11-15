"use client";

import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  Download,
  Search,
  RefreshCw,
  Eye,
  UserCheck,
  UserX,
  MapPin,
  Calendar,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  usersByRole: {
    job_seeker: number;
    employer: number;
    mentor: number;
    admin: number;
  };
  recentActivity: Array<{
    id: string;
    type: "user_registration" | "job_posted" | "application_submitted";
    description: string;
    timestamp: string;
    userName?: string;
  }>;
}

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  emailVerified: boolean;
  authProvider: string;
  hasPassword: boolean;
  createdAt: string;
  isActive: boolean;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  remote: boolean;
  status: "active" | "inactive" | "closed";
  applicantCount: number;
  createdAt: string;
  employer: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "jobs" | "analytics" | "export"
  >("overview");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchAdminData();
  }, [user, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch admin statistics with credentials
      const statsResponse = await fetch("/api/admin/stats", {
        credentials: "include",
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        const errorData = await statsResponse.json().catch(() => ({}));
        setError(errorData.error || "Failed to load admin statistics");
        console.error("Stats API error:", statsResponse.status, errorData);
      }

      // Fetch users
      const usersResponse = await fetch("/api/admin/users", {
        credentials: "include",
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      // Fetch jobs
      const jobsResponse = await fetch("/api/admin/jobs", {
        credentials: "include",
      });
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.jobs || []);
      }
    } catch (error) {
      setError("Failed to load admin data");
      console.error("Admin data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: "users" | "jobs" | "applications") => {
    try {
      const response = await fetch(`/api/admin/export/${type}`, {
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}_export_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSuccess(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } exported successfully!`
        );
      } else {
        setError(`Failed to export ${type}`);
      }
    } catch (error) {
      setError(`Error exporting ${type}`);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Access Denied
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="text-center relative z-10 animate-[floatUp_0.85s_ease-out]">
          <div className="futuristic-loader mx-auto mb-6">
            <div className="futuristic-loader-inner">
              <Shield className="absolute inset-0 m-auto h-6 w-6 text-primary-500" />
            </div>
          </div>
          <h2 className="auth-title text-2xl font-bold mb-2">
            Loading Admin Dashboard
          </h2>
          <p className="auth-subtitle text-base">
            Initializing platform analytics...
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
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
      
      {/* Header */}
      <div className="relative z-10 border-b border-white/30 bg-white/60 shadow-lg shadow-primary-900/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 ${isEntering ? 'auth-panel-enter' : ''}`}>
            <div className="flex items-center animate-[floatUp_0.85s_ease-out]">
              <div className="feature-icon mr-3">
                <Shield className="h-8 w-8 text-primary-500" />
              </div>
              <div>
                <h1 className="auth-title text-2xl font-bold md:text-3xl">
                  Admin Dashboard
                </h1>
                <p className="auth-subtitle text-sm">
                  WorkQit Platform Administration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAdminData}
                className="btn-secondary inline-flex items-center px-4 py-2 text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="glass-alert glass-alert-error">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="glass-alert glass-alert-success">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-white/30">
          <nav className="-mb-px flex flex-wrap gap-4 sm:gap-8" aria-label="Tabs">
            {[
              { id: "overview", name: "Overview", icon: BarChart3 },
              { id: "users", name: "Users", icon: Users },
              { id: "jobs", name: "Jobs", icon: Briefcase },
              { id: "analytics", name: "Analytics", icon: TrendingUp },
              { id: "export", name: "Export", icon: Download },
            ].map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`admin-tab ${
                  activeTab === tab.id
                    ? "admin-tab-active"
                    : "admin-tab-inactive"
                }`}
                style={{ '--float-delay': `${index * 0.05}s` } as CSSProperties}
              >
                <tab.icon className="admin-tab-icon h-6 w-6 transition-all duration-300" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                  className="stat-card"
                  style={{ '--float-delay': '0.1s' } as CSSProperties}
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <Users className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="ml-5 flex-1 min-w-0">
                        <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                          Total Users
                        </p>
                        <p className="stat-number">
                          {stats.totalUsers}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="stat-card"
                  style={{ '--float-delay': '0.2s' } as CSSProperties}
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <Briefcase className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="ml-5 flex-1 min-w-0">
                        <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                          Active Jobs
                        </p>
                        <p className="stat-number">
                          {stats.activeJobs}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="stat-card"
                  style={{ '--float-delay': '0.3s' } as CSSProperties}
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <FileText className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="ml-5 flex-1 min-w-0">
                        <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                          Applications
                        </p>
                        <p className="stat-number">
                          {stats.totalApplications}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="stat-card"
                  style={{ '--float-delay': '0.4s' } as CSSProperties}
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <Activity className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="ml-5 flex-1 min-w-0">
                        <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                          Pending
                        </p>
                        <p className="stat-number">
                          {stats.pendingApplications}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {stats?.recentActivity && (
              <div className="card">
                <div className="px-6 py-6">
                  <h3 className="feature-heading text-xl font-semibold mb-6">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {stats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-4 p-4 bg-white/40 rounded-lg border border-white/40 backdrop-blur transition-all duration-300 hover:bg-white/60 hover:border-primary-500/40"
                        style={{ '--float-delay': `${0.5 + index * 0.08}s` } as CSSProperties}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {activity.type === "user_registration" && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/35 bg-green-500/15 text-green-500 shadow-inner shadow-green-700/25">
                              <UserCheck className="h-5 w-5" />
                            </div>
                          )}
                          {activity.type === "job_posted" && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/35 bg-blue-500/15 text-blue-500 shadow-inner shadow-blue-700/25">
                              <Briefcase className="h-5 w-5" />
                            </div>
                          )}
                          {activity.type === "application_submitted" && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/35 bg-purple-500/15 text-purple-500 shadow-inner shadow-purple-700/25">
                              <FileText className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="card">
            <div className="px-8 py-8">
              <h3 className="feature-heading text-2xl font-semibold mb-8 animate-[floatUp_0.85s_ease-out]">
                User Management
              </h3>
              <div className="space-y-4">
                {users.slice(0, 10).map((user, index) => (
                  <div
                    key={user._id}
                    className="feature-card p-6 group"
                    style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                  >
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-5 mb-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                              <Users className="h-8 w-8" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.email}
                            </div>
                            <div className="text-base text-secondary-600 truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider border shadow-inner ${
                            user.role === "admin"
                              ? "text-red-600 bg-red-500/20 border-red-500/30 shadow-red-700/20"
                              : user.role === "employer"
                              ? "text-blue-600 bg-blue-500/20 border-blue-500/30 shadow-blue-700/20"
                              : "text-green-600 bg-green-500/20 border-green-500/30 shadow-green-700/20"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider border shadow-inner ${
                            user.emailVerified
                              ? "text-green-600 bg-green-500/20 border-green-500/30 shadow-green-700/20"
                              : "text-yellow-600 bg-yellow-500/20 border-yellow-500/30 shadow-yellow-700/20"
                          }`}
                        >
                          {user.emailVerified ? "Verified" : "Pending"}
                        </span>
                        <span className="text-base text-secondary-500 whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString() !== "Invalid Date" 
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="card">
            <div className="px-8 py-8">
              <h3 className="feature-heading text-2xl font-semibold mb-8 animate-[floatUp_0.85s_ease-out]">
                Job Management
              </h3>
              <div className="space-y-4">
                {jobs.slice(0, 10).map((job, index) => (
                  <div
                    key={job._id}
                    className="feature-card p-6 group"
                    style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                  >
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-5 mb-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                              <Briefcase className="h-8 w-8" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                              {job.title}
                            </div>
                            <div className="text-base text-secondary-600 mb-2">
                              {job.company}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {job.employer?.firstName && job.employer?.lastName
                                ? `${job.employer.firstName} ${job.employer.lastName}`
                                : job.employer?.email || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-primary-600 bg-primary-500/20 border border-primary-500/30 shadow-inner shadow-primary-700/20">
                          {job.applicantCount || 0} {job.applicantCount === 1 ? 'Application' : 'Applications'}
                        </span>
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider border shadow-inner ${
                            job.status === "active"
                              ? "text-green-600 bg-green-500/20 border-green-500/30 shadow-green-700/20"
                              : job.status === "inactive" || job.status === "draft"
                              ? "text-yellow-600 bg-yellow-500/20 border-yellow-500/30 shadow-yellow-700/20"
                              : "text-red-600 bg-red-500/20 border-red-500/30 shadow-red-700/20"
                          }`}
                        >
                          {job.status}
                        </span>
                        <span className="text-base text-secondary-500 whitespace-nowrap">
                          {new Date(job.createdAt).toLocaleDateString() !== "Invalid Date" 
                            ? new Date(job.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="card">
              <div className="px-8 py-8">
                <h3 className="feature-heading text-3xl font-semibold mb-10 animate-[floatUp_0.85s_ease-out]">
                  Platform Analytics
                </h3>
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="feature-card p-8" style={{ '--float-delay': '0.1s' } as CSSProperties}>
                      <div className="flex items-center gap-5 mb-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <Users className="h-10 w-10" />
                        </div>
                        <h4 className="text-2xl font-semibold text-gray-900">
                          User Distribution
                        </h4>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 rounded-xl border border-white/40 bg-white/40 backdrop-blur">
                          <div className="flex items-center gap-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/15 text-green-600">
                              <UserCheck className="h-7 w-7" />
                            </div>
                            <span className="text-xl font-medium text-gray-700">
                              Job Seekers
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-primary-600">
                            {stats.usersByRole?.job_seeker || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-xl border border-white/40 bg-white/40 backdrop-blur">
                          <div className="flex items-center gap-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/15 text-blue-600">
                              <Briefcase className="h-7 w-7" />
                            </div>
                            <span className="text-xl font-medium text-gray-700">
                              Employers
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-primary-600">
                            {stats.usersByRole?.employer || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-xl border border-white/40 bg-white/40 backdrop-blur">
                          <div className="flex items-center gap-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/15 text-red-600">
                              <Shield className="h-7 w-7" />
                            </div>
                            <span className="text-xl font-medium text-gray-700">
                              Admins
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-primary-600">
                            {stats.usersByRole?.admin || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="feature-card p-8" style={{ '--float-delay': '0.15s' } as CSSProperties}>
                      <div className="flex items-center gap-5 mb-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <Activity className="h-10 w-10" />
                        </div>
                        <h4 className="text-2xl font-semibold text-gray-900">
                          Platform Health
                        </h4>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 rounded-xl border border-white/40 bg-white/40 backdrop-blur">
                          <div className="flex items-center gap-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/15 text-green-600">
                              <Users className="h-7 w-7" />
                            </div>
                            <span className="text-xl font-medium text-gray-700">
                              Active Users
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-primary-600">
                            {stats.activeUsers}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-xl border border-white/40 bg-white/40 backdrop-blur">
                          <div className="flex items-center gap-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/15 text-blue-600">
                              <Briefcase className="h-7 w-7" />
                            </div>
                            <span className="text-xl font-medium text-gray-700">
                              Active Jobs
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-primary-600">
                            {stats.activeJobs}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-xl border border-white/40 bg-white/40 backdrop-blur">
                          <div className="flex items-center gap-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-yellow-500/30 bg-yellow-500/15 text-yellow-600">
                              <FileText className="h-7 w-7" />
                            </div>
                            <span className="text-xl font-medium text-gray-700">
                              Pending Applications
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-primary-600">
                            {stats.pendingApplications}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "export" && (
          <div className="card">
            <div className="px-8 py-8">
              <h3 className="feature-heading text-2xl font-semibold mb-8 animate-[floatUp_0.85s_ease-out]">
                Data Export
              </h3>
              <div className="space-y-4">
                <div
                  className="feature-card p-6 group"
                  style={{ '--float-delay': '0.1s' } as CSSProperties}
                >
                  <div className="flex items-center justify-between gap-6 flex-wrap">
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <Users className="h-8 w-8" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          Export Users
                        </h4>
                        <p className="text-base text-secondary-600">
                          Download all user data as CSV
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportData("users")}
                      className="btn-primary inline-flex items-center gap-3 px-6 py-3 text-base font-semibold"
                    >
                      <Download className="h-5 w-5" />
                      Export
                    </button>
                  </div>
                </div>

                <div
                  className="feature-card p-6 group"
                  style={{ '--float-delay': '0.15s' } as CSSProperties}
                >
                  <div className="flex items-center justify-between gap-6 flex-wrap">
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <Briefcase className="h-8 w-8" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          Export Jobs
                        </h4>
                        <p className="text-base text-secondary-600">
                          Download all job postings as CSV
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportData("jobs")}
                      className="btn-primary inline-flex items-center gap-3 px-6 py-3 text-base font-semibold"
                    >
                      <Download className="h-5 w-5" />
                      Export
                    </button>
                  </div>
                </div>

                <div
                  className="feature-card p-6 group"
                  style={{ '--float-delay': '0.2s' } as CSSProperties}
                >
                  <div className="flex items-center justify-between gap-6 flex-wrap">
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                          <FileText className="h-8 w-8" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          Export Applications
                        </h4>
                        <p className="text-base text-secondary-600">
                          Download all job applications as CSV
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportData("applications")}
                      className="btn-primary inline-flex items-center gap-3 px-6 py-3 text-base font-semibold"
                    >
                      <Download className="h-5 w-5" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
