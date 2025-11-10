/**
 * Job Related Hooks
 * Custom hooks for job operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseMutation, useBaseQuery } from './useBaseHooks'
import type { 
  Job, 
  JobFormData, 
  JobQueryParams, 
  PaginatedResponse,
  ApiResponse 
} from '@/interfaces'

/**
 * Hook for fetching jobs list with pagination and filters
 */
export function useJobs(params: JobQueryParams = {}) {
  const queryFn = useCallback(async () => {
    const queryString = RequestService.buildQueryParams(params)
    const endpoint = `${API_ENDPOINTS.JOBS.LIST}${queryString}`
    return RequestService.get<PaginatedResponse<Job>>(endpoint)
  }, [params])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    jobs: query.data?.data || [],
    pagination: query.data?.pagination || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for fetching a single job by ID
 */
export function useJob(id: string, options?: { enabled?: boolean }) {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ job: Job }>(API_ENDPOINTS.JOBS.BY_ID(id))
  }, [id])

  const query = useBaseQuery(queryFn, {
    enabled: (options?.enabled ?? true) && !!id,
    refetchOnMount: true,
  })

  return {
    job: query.data?.job || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for creating a new job
 */
export function useCreateJob() {
  const mutation = useBaseMutation<{ job: Job }, JobFormData>()

  mutation.setMutateFunction(async (data: JobFormData) => {
    return RequestService.post(API_ENDPOINTS.JOBS.CREATE, data)
  })

  const createJob = useCallback(async (data: JobFormData) => {
    try {
      const result = await mutation.mutate(data)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    createJob,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for updating a job
 */
export function useUpdateJob() {
  const mutation = useBaseMutation<{ job: Job }, { id: string; data: Partial<JobFormData> }>()

  mutation.setMutateFunction(async ({ id, data }) => {
    return RequestService.put(API_ENDPOINTS.JOBS.UPDATE(id), data)
  })

  const updateJob = useCallback(async (id: string, data: Partial<JobFormData>) => {
    try {
      const result = await mutation.mutate({ id, data })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    updateJob,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for deleting a job
 */
export function useDeleteJob() {
  const mutation = useBaseMutation<{ success: boolean }, string>()

  mutation.setMutateFunction(async (id: string) => {
    return RequestService.delete(API_ENDPOINTS.JOBS.DELETE(id))
  })

  const deleteJob = useCallback(async (id: string) => {
    try {
      const result = await mutation.mutate(id)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    deleteJob,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for applying to a job
 */
export function useApplyToJob() {
  const mutation = useBaseMutation<{ application: any }, { jobId: string; coverLetter?: string }>()

  mutation.setMutateFunction(async ({ jobId, coverLetter }) => {
    return RequestService.post(API_ENDPOINTS.JOBS.APPLY(jobId), { coverLetter })
  })

  const applyToJob = useCallback(async (jobId: string, coverLetter?: string) => {
    try {
      const result = await mutation.mutate({ jobId, coverLetter })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    applyToJob,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for fetching job applicants (employer only)
 */
export function useJobApplicants(jobId: string, options?: { enabled?: boolean }) {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ job: Job; applicants: any[] }>(
      API_ENDPOINTS.JOBS.APPLICANTS(jobId)
    )
  }, [jobId])

  const query = useBaseQuery(queryFn, {
    enabled: (options?.enabled ?? true) && !!jobId,
    refetchOnMount: true,
  })

  return {
    job: query.data?.job || null,
    applicants: query.data?.applicants || [],
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for fetching employer's jobs
 */
export function useEmployerJobs(params: JobQueryParams = {}) {
  const employerParams = { ...params, employer: true }
  
  const queryFn = useCallback(async () => {
    const queryString = RequestService.buildQueryParams(employerParams)
    const endpoint = `${API_ENDPOINTS.JOBS.LIST}${queryString}`
    return RequestService.get<PaginatedResponse<Job>>(endpoint)
  }, [employerParams])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    jobs: query.data?.data || [],
    pagination: query.data?.pagination || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for job search with debouncing
 */
export function useJobSearch(searchParams: JobQueryParams) {
  const queryFn = useCallback(async () => {
    const queryString = RequestService.buildQueryParams(searchParams)
    const endpoint = `${API_ENDPOINTS.JOBS.LIST}${queryString}`
    return RequestService.get<PaginatedResponse<Job>>(endpoint)
  }, [searchParams])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: false,
  })

  return {
    jobs: query.data?.data || [],
    pagination: query.data?.pagination || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}