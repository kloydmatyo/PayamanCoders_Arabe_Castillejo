/**
 * Job Related Interfaces
 */

export interface Job {
  _id?: string
  id?: string
  title: string
  company: string
  description: string
  requirements?: string[]
  responsibilities?: string[]
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  remote: boolean
  salary?: {
    min?: number
    max?: number
    currency?: string
    period?: 'hourly' | 'monthly' | 'yearly'
  }
  skills?: string[]
  experience?: string
  employerId: string
  employer?: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  status: 'active' | 'closed' | 'draft'
  applicantCount?: number
  views?: number
  deadline?: string
  createdAt: string
  updatedAt?: string
}

/**
 * Job Creation/Update Interface
 */
export interface JobFormData {
  title: string
  company: string
  description: string
  requirements?: string[]
  responsibilities?: string[]
  location: string
  type: Job['type']
  remote: boolean
  salary?: Job['salary']
  skills?: string[]
  experience?: string
  deadline?: string
}

/**
 * Job Query Parameters
 */
export interface JobQueryParams {
  page?: number
  limit?: number
  search?: string
  type?: Job['type']
  location?: string
  remote?: boolean
  skills?: string
  employer?: boolean | string
  status?: Job['status']
  sort?: 'createdAt' | 'title' | 'company' | 'salary'
  order?: 'asc' | 'desc'
}

/**
 * Job Statistics Interface
 */
export interface JobStats {
  total: number
  active: number
  closed: number
  draft: number
  byType: Record<Job['type'], number>
  byLocation: Record<string, number>
}