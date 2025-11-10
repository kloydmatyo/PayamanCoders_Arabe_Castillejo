/**
 * User Related Interfaces
 */

export interface User {
  id?: string
  _id?: string
  firstName: string
  lastName: string
  email: string
  role: 'job_seeker' | 'employer' | 'admin'
  authProvider?: 'local' | 'google' | 'hybrid'
  hasPassword?: boolean
  googleId?: string
  profile?: UserProfile
  createdAt?: string
  updatedAt?: string
}

export interface UserProfile {
  bio?: string
  skills?: string[]
  experience?: string
  location?: string
  phone?: string
  website?: string
  linkedIn?: string
  github?: string
  resume?: {
    filename: string
    url: string
    publicId?: string
  }
  avatar?: {
    filename: string
    url: string
    publicId?: string
  }
}

/**
 * Authentication Interfaces
 */
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'job_seeker' | 'employer'
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
  token?: string
}

/**
 * Profile Update Interface
 */
export interface ProfileUpdateData {
  firstName?: string
  lastName?: string
  email?: string
  profile?: Partial<UserProfile>
}