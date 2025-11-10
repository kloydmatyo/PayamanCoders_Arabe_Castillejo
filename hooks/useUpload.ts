/**
 * File Upload Related Hooks
 * Custom hooks for file upload operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseMutation } from './useBaseHooks'
import type { UploadResponse, FileUpload } from '@/interfaces'

/**
 * Hook for uploading resume files
 */
export function useUploadResume() {
  const mutation = useBaseMutation<UploadResponse, File>()

  mutation.setMutateFunction(async (file: File) => {
    const formData = new FormData()
    formData.append('resume', file)
    
    return RequestService.uploadFile(API_ENDPOINTS.UPLOAD.RESUME, formData)
  })

  const uploadResume = useCallback(async (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF or DOC file.')
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload a file smaller than 5MB.')
    }

    try {
      const result = await mutation.mutate(file)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    uploadResume,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for uploading avatar images
 */
export function useUploadAvatar() {
  const mutation = useBaseMutation<UploadResponse, File>()

  mutation.setMutateFunction(async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    return RequestService.uploadFile(API_ENDPOINTS.UPLOAD.AVATAR, formData)
  })

  const uploadAvatar = useCallback(async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG, or GIF image.')
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 2MB.')
    }

    try {
      const result = await mutation.mutate(file)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    uploadAvatar,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for uploading general documents
 */
export function useUploadDocument() {
  const mutation = useBaseMutation<UploadResponse, FileUpload>()

  mutation.setMutateFunction(async (fileUpload: FileUpload) => {
    const formData = new FormData()
    formData.append('document', fileUpload.file)
    formData.append('type', fileUpload.type)
    
    return RequestService.uploadFile(API_ENDPOINTS.UPLOAD.DOCUMENTS, formData)
  })

  const uploadDocument = useCallback(async (fileUpload: FileUpload) => {
    const { file, type, maxSize = 10 * 1024 * 1024, allowedTypes = [] } = fileUpload

    // Validate file type if allowedTypes specified
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      throw new Error(`File size too large. Maximum size: ${maxSizeMB}MB`)
    }

    try {
      const result = await mutation.mutate(fileUpload)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    uploadDocument,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for multiple file uploads
 */
export function useUploadMultipleFiles() {
  const mutation = useBaseMutation<UploadResponse[], { files: File[]; type: string }>()

  mutation.setMutateFunction(async ({ files, type }) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('type', type)
      
      return RequestService.uploadFile(API_ENDPOINTS.UPLOAD.DOCUMENTS, formData)
    })

    const responses = await Promise.all(uploadPromises)
    return { success: true, data: responses.map(r => r.data) } as any
  })

  const uploadMultipleFiles = useCallback(async (files: File[], type: string) => {
    try {
      const result = await mutation.mutate({ files, type })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    uploadMultipleFiles,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}