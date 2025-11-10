/**
 * Dashboard Related Interfaces
 */

export interface DashboardStats {
  // Common stats
  totalApplications?: number
  pendingApplications?: number
  
  // Job seeker specific stats
  appliedJobs?: number
  interviewRequests?: number
  jobOffers?: number
  profileViews?: number
  
  // Employer specific stats
  jobsPosted?: number
  activeJobs?: number
  totalApplicants?: number
  interviews?: number
  offers?: number
  
  // Admin specific stats
  totalUsers?: number
  activeUsers?: number
  totalJobs?: number
  recentSignups?: number
  systemHealth?: 'healthy' | 'warning' | 'error'
}

/**
 * Dashboard Application Interface
 */
export interface DashboardApplication {
  id: string
  jobTitle: string
  company: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  appliedDate: string
  jobType?: string
  location?: string
  remote?: boolean
}

/**
 * Dashboard Job Recommendation
 */
export interface JobRecommendation {
  job: {
    _id: string
    title: string
    company: string
    location: string
    type: string
    remote: boolean
    skills?: string[]
  }
  matchScore: number
  matchReasons: string[]
}

/**
 * Admin Dashboard Interfaces
 */
export interface AdminUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'job_seeker' | 'employer' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin?: string
  jobsPosted?: number
  applicationsSubmitted?: number
}

export interface AdminJob {
  _id: string
  title: string
  company: string
  employer: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  status: 'active' | 'closed' | 'draft'
  applicantCount: number
  views: number
  createdAt: string
}

export interface AdminApplication {
  _id: string
  job: {
    _id: string
    title: string
    company: string
  }
  applicant: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt: string
}

/**
 * System Health Interface
 */
export interface SystemHealth {
  database: 'connected' | 'disconnected' | 'error'
  storage: 'available' | 'limited' | 'error'
  email: 'working' | 'error'
  authentication: 'working' | 'error'
  overallStatus: 'healthy' | 'warning' | 'error'
  uptime: number
  version: string
}