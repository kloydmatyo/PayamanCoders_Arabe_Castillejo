import { User } from './user'
import { Job } from './job'

/**
 * Application Related Interfaces
 */

export interface Application {
  _id?: string
  id?: string
  jobId: string
  applicantId: string
  job?: Job
  applicant?: User
  coverLetter?: string
  resume?: {
    filename: string
    url: string
    publicId?: string
  }
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  feedback?: ApplicationFeedback
  createdAt: string
  updatedAt?: string
}

export interface ApplicationFeedback {
  rating?: number
  notes?: string
  reviewedBy?: string
  reviewedAt?: string
}

/**
 * Application Creation Interface
 */
export interface ApplicationData {
  jobId: string
  coverLetter?: string
  resume?: File
}

/**
 * Application Status Update Interface
 */
export interface ApplicationStatusUpdate {
  status: Application['status']
  feedback?: ApplicationFeedback
}

/**
 * Application Query Parameters
 */
export interface ApplicationQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: Application['status']
  jobId?: string
  applicantId?: string
  sort?: 'createdAt' | 'status'
  order?: 'asc' | 'desc'
}

/**
 * Application Statistics Interface
 */
export interface ApplicationStats {
  total: number
  pending: number
  reviewed: number
  accepted: number
  rejected: number
  byJob: Record<string, number>
  recent: Application[]
}

/**
 * Applicant with additional info for employer view
 */
export interface ApplicantInfo extends User {
  application?: Application
  appliedDate?: string
  applicationStatus?: Application['status']
}