"use client";

import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Edit,
  ChevronRight,
  Briefcase,
  Calendar,
  TrendingUp,
  Users,
  ExternalLink,
  MapPin,
  BookOpen,
  Target,
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
    experience?: string;
    education?: string;
    availability?: string;
    remote?: boolean;
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
  const [isEntering, setIsEntering] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
    profile_views: 0,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

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
      const response = await fetch('/api/onboarding/status', { credentials: 'include' });
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
          fetch("/api/user/profile", { credentials: 'include' }),
          fetch("/api/dashboard/stats", { credentials: 'include' }),
          fetch("/api/dashboard/applications", { credentials: 'include' }),
          fetch("/api/notifications", { credentials: 'include' }),
        ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserProfile(profileData.user);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setApplicationStats({ applications: statsData.applications || 0 });
        setStats({
          applications: statsData.applications || 0,
          interviews: statsData.interviews || 0,
          offers: statsData.offers || 0,
          profile_views: statsData.profile_views || 0,
        });
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
      
      const response = await fetch('/api/ai/recommendations', { credentials: 'include' });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ AI recommendations received:', data.recommendations?.length || 0);
        setRecommendations(data.recommendations || []);
      } else {
        console.error('❌ Failed to fetch AI recommendations:', response.status);
        // Fallback to regular recommendations if AI fails
        const fallbackRes = await fetch('/api/dashboard/recommendations?limit=6', { credentials: 'include' });
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
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        {isEntering && <div className="auth-entry-overlay" />}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="text-center relative z-10 animate-[floatUp_0.85s_ease-out]">
          <div className="futuristic-loader mx-auto mb-6">
            <div className="futuristic-loader-inner"></div>
          </div>
          <h2 className="auth-title text-2xl font-bold mb-3">
            Loading Your Dashboard...
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
          <div className="glass-alert glass-alert-error">
            {error}
          </div>
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
      
      <div className="hero-gradient relative min-h-screen overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        {isEntering && <div className="auth-entry-overlay" />}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
          <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`mb-8 ${isEntering ? 'auth-panel-enter' : ''}`}>
            <h1 className="auth-title text-3xl font-bold mb-2 animate-[floatUp_0.85s_ease-out]">
              Welcome back, {userProfile?.firstName || user?.firstName || "User"}!
            </h1>
            <p className="auth-subtitle">
              Here's what's happening with your job search.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              className="stat-card"
              style={{ '--float-delay': '0.1s' } as CSSProperties}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                      <Briefcase className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="ml-5 flex-1 min-w-0">
                    <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">Applications</p>
                    <p className="stat-number">
                      {stats.applications}
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
                      <Calendar className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="ml-5 flex-1 min-w-0">
                    <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">Interviews</p>
                    <p className="stat-number">
                      {stats.interviews}
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
                      <TrendingUp className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="ml-5 flex-1 min-w-0">
                    <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">Offers</p>
                    <p className="stat-number">{stats.offers}</p>
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
                      <Users className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="ml-5 flex-1 min-w-0">
                    <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">Profile Views</p>
                    <p className="stat-number">
                      {stats.profile_views}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* User Profile Summary */}
            <div className="card">
              <div className="flex justify-between items-center mb-6 animate-[floatUp_0.85s_ease-out]">
                <h2 className="feature-heading text-xl font-semibold">
                  Your Profile
                </h2>
                <Link
                  href="/profile"
                  className="auth-link text-sm font-medium"
                >
                  Edit Profile
                </Link>
              </div>
              
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500/20 to-primary-500/5 text-primary-600 shadow-inner shadow-primary-900/10">
                    {userProfile?.profile?.profilePicture ? (
                      <img
                        src={userProfile.profile.profilePicture}
                        alt="Profile"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </h3>
                    <p className="text-sm text-secondary-600">{userProfile?.email}</p>
                  </div>
                </div>

                {/* About */}
                {userProfile?.profile?.bio && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-secondary-600">
                      About
                    </h4>
                    <p className="text-sm text-secondary-700 leading-relaxed">
                      {userProfile.profile.bio}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {userProfile?.profile?.experience && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-secondary-600">
                      Experience
                    </h4>
                    <p className="text-sm text-secondary-700">
                      {userProfile.profile.experience}
                    </p>
                  </div>
                )}

                {/* Education */}
                {userProfile?.profile?.education && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-secondary-600">
                      Education
                    </h4>
                    <p className="text-sm text-secondary-700">
                      {userProfile.profile.education}
                    </p>
                  </div>
                )}

                {/* Skills & Interests */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-secondary-600">
                    Skills & Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.profile?.skills?.length ? (
                      userProfile.profile.skills
                        .slice(0, 6)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border text-primary-600 bg-primary-500/20 border-primary-500/30 shadow-inner shadow-primary-700/20"
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
              </div>
            </div>

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
                  <Link href="/jobs" className="btn-primary inline-flex items-center gap-2">
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app, index) => (
                    <div
                      key={app.id}
                      className="feature-card flex justify-between items-center p-5 group"
                      style={{ '--float-delay': `${0.1 + index * 0.08}s` } as CSSProperties}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 text-lg group-hover:text-primary-600 transition-colors">
                          {app.jobTitle}
                        </h3>
                        <p className="text-sm text-secondary-600 mb-2">{app.company}</p>
                        <p className="text-xs text-secondary-500">
                          Applied {new Date(app.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-inner ${
                            app.status === 'pending' 
                              ? 'text-yellow-600 bg-yellow-500/20 border-yellow-500/30 shadow-yellow-700/20'
                              : app.status === 'reviewed'
                              ? 'text-blue-600 bg-blue-500/20 border-blue-500/30 shadow-blue-700/20'
                              : app.status === 'accepted'
                              ? 'text-green-600 bg-green-500/20 border-green-500/30 shadow-green-700/20'
                              : app.status === 'rejected'
                              ? 'text-red-600 bg-red-500/20 border-red-500/30 shadow-red-700/20'
                              : 'text-secondary-600 bg-secondary-500/20 border-secondary-500/30 shadow-secondary-700/20'
                          }`}
                        >
                          {app.status === 'pending' ? 'Under Review' : 
                           app.status === 'reviewed' ? 'Interview Scheduled' :
                           app.status === 'accepted' ? 'Accepted' : 'Not Selected'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Career Webinars */}
            <div className="card group hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/35 bg-purple-500/15 text-purple-500 shadow-inner shadow-purple-700/25">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Career Webinars
                </h3>
              </div>
              <p className="mb-4 text-sm text-secondary-600">
                Learn from industry experts and mentors through live webinars
              </p>
              <Link
                href="/webinars"
                className="btn-secondary w-full px-4 py-2 text-sm inline-flex items-center justify-center gap-2"
              >
                Browse Webinars
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Interview Prep */}
            <div className="card group hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/35 bg-blue-500/15 text-blue-500 shadow-inner shadow-blue-700/25">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Interview Prep
                </h3>
              </div>
              <p className="mb-4 text-sm text-secondary-600">
                Get AI-powered interview tips tailored to your target role
              </p>
              <Link
                href="/interview-prep"
                className="btn-primary w-full px-4 py-2 text-sm inline-flex items-center justify-center gap-2"
              >
                Start Preparing
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Notifications */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 2).map((notification, index) => (
                  <div
                    key={notification.id}
                    className="feature-card p-3 group"
                    style={{ '--float-delay': `${0.1 + index * 0.08}s` } as CSSProperties}
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${
                          notification.read ? 'text-secondary-600' : 'text-gray-900 font-medium'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-secondary-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI-Powered Recommendations */}
          <div className="card">
            <div className="flex justify-between items-center mb-6 animate-[floatUp_0.85s_ease-out]">
              <h2 className="feature-heading text-xl font-semibold">
                Recommended for You
              </h2>
              <Link
                href="/jobs"
                className="auth-link text-sm font-medium"
              >
                View All Jobs
              </Link>
            </div>

            {loadingRecommendations ? (
              <div className="text-center py-12">
                <div className="futuristic-loader mx-auto mb-4" style={{ width: '48px', height: '48px' }}>
                  <div className="futuristic-loader-inner"></div>
                </div>
                <p className="auth-subtitle">Loading recommendations...</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12">
                <div className="feature-icon mx-auto mb-4 w-16 h-16">
                  <TrendingUp className="w-8 h-8 text-primary-500" />
                </div>
                <p className="auth-subtitle mb-2">No recommendations available</p>
                <p className="text-sm text-secondary-500 mb-6">
                  {userProfile?.profile?.skills?.length === 0 
                    ? "Add skills to your profile to get personalized job recommendations"
                    : "Complete your profile to get personalized job recommendations"}
                </p>
                <Link
                  href={userProfile?.profile?.skills?.length === 0 ? "/profile" : "/jobs"}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {userProfile?.profile?.skills?.length === 0 ? "Add Skills" : "Browse All Jobs"}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.slice(0, 4).map((job, index) => (
                  <div
                    key={job._id}
                    className="feature-card p-5 group"
                    style={{ '--float-delay': `${0.1 + index * 0.08}s` } as CSSProperties}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 text-lg group-hover:text-primary-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-secondary-600 mb-3">{job.company}</p>
                      </div>
                      {job.matchScore && (
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                          {Math.round(job.matchScore)}% Match
                        </span>
                      )}
                    </div>
                    
                    {job.matchReason && (
                      <div className="mb-3 rounded-lg bg-blue-50/80 border border-blue-200/50 p-2">
                        <p className="text-xs text-blue-700">
                          💡 {job.matchReason}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-secondary-500">
                        <MapPin className="w-3.5 h-3.5 text-primary-500" />
                        {job.location}
                      </span>
                      {job.remote && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-green-600 font-medium bg-green-500/20 border border-green-500/30 text-xs">Remote</span>
                      )}
                    </div>
                    <Link
                      href={`/jobs/${job._id}`}
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
    </>
  );
}