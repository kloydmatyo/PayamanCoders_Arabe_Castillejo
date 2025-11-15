"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Edit,
  Home,
  Briefcase,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    bio?: string;
    skills: string[];
    location?: string;
    profilePicture?: string;
  };
}

interface ApplicationStats {
  applications: number;
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

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface AIRecommendation {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  remote: boolean;
  matchScore?: number;
  matchReason?: string;
}

export default function JobSeekerHomepage() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    applications: 0,
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Check onboarding status when user is available
    if (user?.role === 'job_seeker') {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      console.log('🔍 Checking onboarding status...');
      const response = await fetch('/api/onboarding/status');
      console.log('📡 Onboarding API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Onboarding status data:', data);
        
        // Show onboarding if not completed
        if (!data.onboarding?.completed) {
          console.log('🎯 Opening onboarding modal - onboarding not completed');
          setShowOnboarding(true);
        } else {
          console.log('✔️ Onboarding already completed, skipping modal');
        }
      } else {
        console.error('❌ Onboarding API returned error:', response.status);
      }
    } catch (error) {
      console.error('❌ Failed to check onboarding status:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [profileRes, statsRes, applicationsRes, notificationsRes] =
        await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/applications"),
          fetch("/api/notifications"),
        ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserProfile(profileData.user);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setApplicationStats({ applications: statsData.applications || 0 });
      }

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData.applications || []);
      }

      // Mock notifications if API doesn't exist
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
      } else {
        // Fallback mock notifications
        setNotifications([
          {
            id: "1",
            message: "New job match found for your skills",
            createdAt: new Date().toISOString(),
            read: false,
          },
          {
            id: "2",
            message: "Application status updated for Frontend Developer role",
            createdAt: new Date().toISOString(),
            read: false,
          },
          {
            id: "3",
            message: "Profile viewed by 3 employers this week",
            createdAt: new Date().toISOString(),
            read: true,
          },
        ]);
      }

      // Fetch AI recommendations separately after profile is loaded
      fetchAIRecommendations();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      console.log('🤖 Fetching AI-powered recommendations based on skills...');
      
      const response = await fetch('/api/ai/recommendations');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ AI recommendations received:', data.recommendations?.length || 0);
        setRecommendations(data.recommendations || []);
      } else {
        console.error('❌ Failed to fetch AI recommendations:', response.status);
        // Fallback to regular recommendations if AI fails
        const fallbackRes = await fetch('/api/dashboard/recommendations?limit=6');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setRecommendations(fallbackData.recommendations || []);
        }
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Navigation Bar */}
        <nav className="border-b border-white/30 bg-white/60 shadow-lg shadow-primary-900/10 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <span className="rounded-xl border border-white/40 bg-white/70 px-3 py-1 text-2xl font-bold text-primary-600 shadow-inner shadow-primary-900/5">
                  WorkQit
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/60"></div>
              <div className="h-4 w-20 animate-pulse rounded-full bg-white/60"></div>
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/60"></div>
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/60"></div>
            </div>
          </div>
        </nav>

        {/* Loading Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 rounded-full bg-white/60"></div>
            <div className="h-4 w-1/2 rounded-full bg-white/60"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-primary-900/10">
                <div className="h-32 rounded-2xl bg-white/70"></div>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-primary-900/10 lg:col-span-2">
                <div className="h-64 rounded-2xl bg-white/70"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
        <div className="surface-panel max-w-md border-red-300/40 text-center text-red-600 shadow-red-900/10">
          <h3 className="mb-3 text-lg font-semibold text-red-600">Error Loading Dashboard</h3>
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn-primary mt-6 bg-gradient-to-r from-red-600 to-red-500 px-6 py-2 text-sm hover:from-red-500 hover:to-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false);
          fetchDashboardData();
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-[-40%] h-56 w-56 rounded-full bg-primary-500/20 blur-3xl"></div>
          <div className="absolute left-[-20%] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-secondary-500/15 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Welcome back, {userProfile?.firstName || "User"}!
          </h1>
          <p className="text-secondary-600">
            Ready to find your next career opportunity? Here's what's new today.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: User Profile Summary */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="card text-center">
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500/20 to-primary-500/5 text-primary-600 shadow-inner shadow-primary-900/10">
                  {userProfile?.profile?.profilePicture ? (
                    <img
                      src={userProfile.profile.profilePicture}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10" />
                  )}
                </div>

                {/* User Name */}
                <h3 className="text-lg font-semibold text-gray-900">
                  {userProfile?.firstName} {userProfile?.lastName}
                </h3>

                {/* Application Summary */}
                <div>
                  <div className="text-3xl font-bold text-primary-600">
                    {applicationStats.applications}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-secondary-500">
                    Applications
                  </div>
                </div>

                {/* Career Interests */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-secondary-600">
                    Career Interests
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {userProfile?.profile?.skills?.length ? (
                      userProfile.profile.skills
                        .slice(0, 4)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="badge bg-primary-500/10 text-primary-600"
                          >
                            {skill}
                          </span>
                        ))
                    ) : (
                      <span className="text-sm text-secondary-500">
                        No skills added yet
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Profile Button */}
                <Link
                  href="/profile"
                  className="btn-primary px-6 py-2 text-sm"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Applications
                </h3>
                {applications.length > 0 && (
                  <Link
                    href="/applications"
                    className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-500"
                  >
                    View All
                  </Link>
                )}
              </div>
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-primary-500/40 bg-white/40 py-8 text-center backdrop-blur">
                    <p className="mb-4 text-secondary-500">
                      No applications yet
                    </p>
                    <Link
                      href="/jobs"
                      className="btn-secondary px-5 py-2 text-sm"
                    >
                      <span>Browse Jobs to Apply</span>
                    </Link>
                  </div>
                ) : (
                  applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/60 p-4 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-300 hover:border-primary-500/40"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {app.jobTitle}
                        </h4>
                        <p className="text-sm text-secondary-600">{app.company}</p>
                        <p className="text-xs text-secondary-500">
                          Applied {new Date(app.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {app.status === 'pending' ? 'Under Review' : 
                         app.status === 'reviewed' ? 'Reviewed' :
                         app.status === 'accepted' ? 'Accepted' : 'Not Selected'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Career Webinars */}
            <div className="card border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-white">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  📚 Career Webinars
                </h3>
                <Link
                  href="/webinars"
                  className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-500"
                >
                  View All
                </Link>
              </div>
              <p className="mb-4 text-sm text-secondary-600">
                Learn from industry experts and mentors through live webinars
              </p>
              <Link
                href="/webinars"
                className="btn-secondary w-full px-4 py-2 text-sm"
              >
                Browse Webinars
              </Link>
            </div>

            {/* Notifications */}
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Recent Notifications
              </h3>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 rounded-2xl border border-white/30 bg-white/60 p-3 shadow-inner shadow-primary-900/5 backdrop-blur"
                  >
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                      notification.read ? 'bg-white/50 text-secondary-500' : 'bg-primary-500/15 text-primary-600'
                    }`}>
                      <Bell className={`h-4 w-4 ${
                        notification.read ? '' : ''
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${
                        notification.read ? 'text-secondary-600' : 'text-gray-900'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-secondary-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI-Powered Recommendations */}
          <div className="lg:col-span-2">
            <div className="surface-panel">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    🤖 AI-Powered Recommendations
                  </h2>
                  <p className="mt-1 text-sm text-secondary-600">
                    Personalized job matches based on your skills and profile
                  </p>
                </div>
                {userProfile?.profile?.skills?.length === 0 && (
                  <Link
                    href="/profile"
                    className="btn-secondary px-4 py-2 text-xs"
                  >
                    Add Skills
                  </Link>
                )}
              </div>

              {/* Loading State */}
              {loadingRecommendations && (
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl border border-white/40 bg-white/60 p-5"
                    >
                      <div className="mb-2 h-6 w-3/4 rounded bg-white/70"></div>
                      <div className="mb-2 h-4 w-1/2 rounded bg-white/70"></div>
                      <div className="mb-4 h-4 w-full rounded bg-white/70"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-1/3 rounded bg-white/70"></div>
                        <div className="h-8 w-24 rounded bg-white/70"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations Grid */}
              {!loadingRecommendations && (
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {recommendations.length > 0 ? (
                    recommendations.slice(0, 6).map((job) => (
                      <div
                        key={job._id}
                        className="group relative rounded-2xl border border-white/40 bg-white/60 p-5 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-400 hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-900/10"
                      >
                        {/* Match Score Badge */}
                        {job.matchScore && (
                          <div className="absolute right-3 top-3">
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                              {Math.round(job.matchScore)}% Match
                            </span>
                          </div>
                        )}

                        <h3 className="mb-2 pr-20 text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="mb-2 text-sm font-medium text-secondary-600">
                          {job.company}
                        </p>
                        
                        {/* Match Reason */}
                        {job.matchReason && (
                          <div className="mb-3 rounded-lg bg-blue-50/50 p-2">
                            <p className="text-xs text-blue-700">
                              💡 {job.matchReason}
                            </p>
                          </div>
                        )}

                        <p className="mb-4 line-clamp-2 text-sm text-secondary-600">
                          {job.description ||
                            "Exciting opportunity to grow your career and gain valuable experience."}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wide text-secondary-500">
                            {job.location}{" "}
                            {job.remote && "• Remote"}
                          </span>
                          <Link
                            href={`/jobs/${job._id}`}
                            className="btn-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                          >
                            View Details
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 rounded-3xl border border-dashed border-primary-500/40 bg-white/40 py-10 text-center backdrop-blur">
                      {userProfile?.profile?.skills?.length === 0 ? (
                        <>
                          <div className="mb-4 text-4xl">🎯</div>
                          <p className="mb-2 font-medium text-gray-900">
                            Add skills to get personalized recommendations
                          </p>
                          <p className="mb-4 text-sm text-secondary-500">
                            Our AI will match you with the best opportunities based on your skills
                          </p>
                          <Link
                            href="/profile"
                            className="btn-primary px-5 py-2 text-sm"
                          >
                            Add Your Skills
                          </Link>
                        </>
                      ) : (
                        <>
                          <p className="mb-4 text-secondary-500">
                            No AI recommendations available at the moment
                          </p>
                          <Link
                            href="/jobs"
                            className="btn-secondary px-5 py-2 text-sm"
                          >
                            Browse All Opportunities
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* View All Jobs Link */}
              {recommendations.length > 0 && (
                <div className="text-center">
                  <Link
                    href="/jobs"
                    className="btn-ghost px-6 py-2 text-sm uppercase tracking-wide"
                  >
                    View All Job Opportunities
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
