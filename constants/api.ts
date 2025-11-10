/**
 * API Endpoints Constants
 * Centralized location for all API endpoint definitions
 */

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/user/profile',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
    TEST_AUTH: '/api/test-auth',
  },

  // User endpoints
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
  },

  // Jobs endpoints
  JOBS: {
    LIST: '/api/jobs',
    CREATE: '/api/jobs',
    BY_ID: (id: string) => `/api/jobs/${id}`,
    UPDATE: (id: string) => `/api/jobs/${id}`,
    DELETE: (id: string) => `/api/jobs/${id}`,
    APPLY: (id: string) => `/api/jobs/${id}/apply`,
    APPLICANTS: (id: string) => `/api/jobs/${id}/applicants`,
  },

  // Applications endpoints
  APPLICATIONS: {
    LIST: '/api/applications',
    BY_ID: (id: string) => `/api/applications/${id}`,
    UPDATE_STATUS: (id: string) => `/api/applications/${id}/status`,
    FEEDBACK: (id: string) => `/api/applications/${id}/feedback`,
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    APPLICATIONS: '/api/dashboard/applications',
    RECOMMENDATIONS: '/api/dashboard/recommendations',
  },

  // Admin endpoints
  ADMIN: {
    STATS: '/api/admin/stats',
    JOBS: '/api/admin/jobs',
    USERS: '/api/admin/users',
    APPLICATIONS: '/api/admin/applications',
    EXPORT: (type: string) => `/api/admin/export/${type}`,
  },

  // File upload endpoints
  UPLOAD: {
    RESUME: '/api/upload/resume',
    AVATAR: '/api/upload/avatar',
    DOCUMENTS: '/api/upload/documents',
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: '/api/notifications/mark-read',
  },

  // Team endpoints
  TEAM: {
    LIST: '/api/team',
    INVITE: '/api/team/invite',
  },

  // Debug endpoints
  DEBUG: {
    DB_TEST: '/api/test-db',
    AUTH_DEBUG: '/api/debug/auth',
  },
} as const

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const

/**
 * Application Status Types
 */
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const

/**
 * Job Status Types
 */
export const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  DRAFT: 'draft',
} as const

/**
 * User Roles
 */
export const USER_ROLES = {
  JOB_SEEKER: 'job_seeker',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
} as const

/**
 * Job Types
 */
export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  INTERNSHIP: 'internship',
} as const

/**
 * Request Configuration Defaults
 */
export const REQUEST_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

/**
 * Query Keys for React Query (if you decide to use it later)
 */
export const QUERY_KEYS = {
  AUTH: {
    PROFILE: 'auth.profile',
  },
  JOBS: {
    LIST: 'jobs.list',
    DETAIL: (id: string) => ['jobs.detail', id],
    APPLICANTS: (id: string) => ['jobs.applicants', id],
  },
  APPLICATIONS: {
    LIST: 'applications.list',
    DETAIL: (id: string) => ['applications.detail', id],
  },
  DASHBOARD: {
    STATS: 'dashboard.stats',
    APPLICATIONS: 'dashboard.applications',
    RECOMMENDATIONS: 'dashboard.recommendations',
  },
  ADMIN: {
    STATS: 'admin.stats',
    JOBS: 'admin.jobs',
    USERS: 'admin.users',
    APPLICATIONS: 'admin.applications',
  },
  NOTIFICATIONS: {
    LIST: 'notifications.list',
  },
} as const

export default API_ENDPOINTS