/**
 * Notification Related Interfaces
 */

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
}

/**
 * Upload Related Interfaces
 */
export interface UploadResponse {
  success: boolean
  file?: {
    filename: string
    url: string
    publicId?: string
    size: number
    mimetype: string
  }
  error?: string
}

/**
 * File Upload Interface
 */
export interface FileUpload {
  file: File
  type: 'resume' | 'avatar' | 'document'
  maxSize?: number
  allowedTypes?: string[]
}

/**
 * Export All Interfaces
 */
export * from './common'
export * from './user'
export * from './job'
export * from './application'
export * from './dashboard'