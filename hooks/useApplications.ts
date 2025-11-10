/**
 * Application Related Hooks
 * Custom hooks for job application operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseMutation, useBaseQuery } from './useBaseHooks'
import type { 
  Application, 
  ApplicationData, 
  ApplicationStatusUpdate, 
  ApplicationQueryParams, 
  ApplicationStats,
  PaginatedResponse 
} from '@/interfaces'

/**
 * Hook for fetching applications list
 */
export function useApplications(params: ApplicationQueryParams = {}) {
  const queryFn = useCallback(async () => {
    const queryString = RequestService.buildQueryParams(params)
    const endpoint = `${API_ENDPOINTS.APPLICATIONS.LIST}${queryString}`
    return RequestService.get<PaginatedResponse<Application>>(endpoint)
  }, [params])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    applications: query.data?.data || [],
    pagination: query.data?.pagination || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for fetching a single application by ID
 */
export function useApplication(id: string, options?: { enabled?: boolean }) {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ application: Application }>(
      API_ENDPOINTS.APPLICATIONS.BY_ID(id)
    )
  }, [id])

  const query = useBaseQuery(queryFn, {
    enabled: (options?.enabled ?? true) && !!id,
    refetchOnMount: true,
  })

  return {
    application: query.data?.application || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for submitting a job application
 */
export function useSubmitApplication() {
  const mutation = useBaseMutation<{ application: Application }, ApplicationData>()

  mutation.setMutateFunction(async (data: ApplicationData) => {
    // If there's a resume file, use FormData
    if (data.resume) {
      const formData = new FormData()
      formData.append('jobId', data.jobId)
      if (data.coverLetter) {
        formData.append('coverLetter', data.coverLetter)
      }
      formData.append('resume', data.resume)
      
      return RequestService.uploadFile(
        API_ENDPOINTS.JOBS.APPLY(data.jobId),
        formData
      )
    } else {
      // Regular JSON request
      return RequestService.post(API_ENDPOINTS.JOBS.APPLY(data.jobId), {
        coverLetter: data.coverLetter,
      })
    }
  })

  const submitApplication = useCallback(async (data: ApplicationData) => {
    try {
      const result = await mutation.mutate(data)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    submitApplication,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for updating application status (employer/admin only)
 */
export function useUpdateApplicationStatus() {
  const mutation = useBaseMutation<{ application: Application }, { id: string; update: ApplicationStatusUpdate }>()

  mutation.setMutateFunction(async ({ id, update }) => {
    return RequestService.put(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id), update)
  })

  const updateStatus = useCallback(async (id: string, update: ApplicationStatusUpdate) => {
    try {
      const result = await mutation.mutate({ id, update })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    updateStatus,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for adding feedback to an application
 */
export function useAddApplicationFeedback() {
  const mutation = useBaseMutation<{ success: boolean }, { id: string; feedback: any }>()

  mutation.setMutateFunction(async ({ id, feedback }) => {
    return RequestService.post(API_ENDPOINTS.APPLICATIONS.FEEDBACK(id), feedback)
  })

  const addFeedback = useCallback(async (id: string, feedback: any) => {
    try {
      const result = await mutation.mutate({ id, feedback })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    addFeedback,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for fetching user's applications (dashboard)
 */
export function useDashboardApplications() {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ applications: Application[] }>(
      API_ENDPOINTS.DASHBOARD.APPLICATIONS
    )
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    applications: query.data?.applications || [],
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for checking if user has applied to a specific job
 */
export function useApplicationStatus(jobId: string, options?: { enabled?: boolean }) {
  const queryFn = useCallback(async () => {
    const params = { jobId, applicantId: 'me' } // 'me' indicates current user
    const queryString = RequestService.buildQueryParams(params)
    const endpoint = `${API_ENDPOINTS.APPLICATIONS.LIST}${queryString}`
    return RequestService.get<{ applications: Application[] }>(endpoint)
  }, [jobId])

  const query = useBaseQuery(queryFn, {
    enabled: (options?.enabled ?? true) && !!jobId,
    refetchOnMount: true,
  })

  const hasApplied = (query.data?.applications?.length || 0) > 0
  const application = query.data?.applications?.[0] || null

  return {
    hasApplied,
    application,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for fetching application statistics
 */
export function useApplicationStats() {
  const queryFn = useCallback(async () => {
    return RequestService.get<ApplicationStats>('/api/applications/stats')
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    stats: query.data || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}