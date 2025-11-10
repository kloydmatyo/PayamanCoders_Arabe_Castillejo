/**
 * Admin Related Hooks
 * Custom hooks for admin operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseMutation, useBaseQuery } from './useBaseHooks'
import type { 
  DashboardStats,
  AdminUser,
  AdminJob,
  AdminApplication,
  SystemHealth,
  PaginatedResponse,
  JobQueryParams,
  ApplicationQueryParams
} from '@/interfaces'

/**
 * Hook for fetching admin dashboard statistics
 */
export function useAdminStats() {
  const queryFn = useCallback(async () => {
    return RequestService.get<DashboardStats>(API_ENDPOINTS.ADMIN.STATS)
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

/**
 * Hook for fetching admin jobs list
 */
export function useAdminJobs(params: JobQueryParams = {}) {
  const queryFn = useCallback(async () => {
    const queryString = RequestService.buildQueryParams(params)
    const endpoint = `${API_ENDPOINTS.ADMIN.JOBS}${queryString}`
    return RequestService.get<PaginatedResponse<AdminJob>>(endpoint)
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
 * Hook for fetching admin users list
 */
export function useAdminUsers(params: any = {}) {
  const queryFn = useCallback(async () => {
    const queryString = RequestService.buildQueryParams(params)
    const endpoint = `${API_ENDPOINTS.ADMIN.USERS}${queryString}`
    return RequestService.get<PaginatedResponse<AdminUser>>(endpoint)
  }, [params])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    users: query.data?.data || [],
    pagination: query.data?.pagination || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for fetching admin applications list
 */
export function useAdminApplications(params: ApplicationQueryParams = {}) {
  const queryFn = useCallback(async () => {
    const queryString = RequestService.buildQueryParams(params)
    const endpoint = `${API_ENDPOINTS.ADMIN.APPLICATIONS}${queryString}`
    return RequestService.get<PaginatedResponse<AdminApplication>>(endpoint)
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
 * Hook for updating user status (admin only)
 */
export function useUpdateUserStatus() {
  const mutation = useBaseMutation<{ user: AdminUser }, { id: string; status: string }>()

  mutation.setMutateFunction(async ({ id, status }) => {
    return RequestService.put(`/api/admin/users/${id}/status`, { status })
  })

  const updateUserStatus = useCallback(async (id: string, status: string) => {
    try {
      const result = await mutation.mutate({ id, status })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    updateUserStatus,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for updating job status (admin only)
 */
export function useUpdateJobStatus() {
  const mutation = useBaseMutation<{ job: AdminJob }, { id: string; status: string }>()

  mutation.setMutateFunction(async ({ id, status }) => {
    return RequestService.put(`/api/admin/jobs/${id}/status`, { status })
  })

  const updateJobStatus = useCallback(async (id: string, status: string) => {
    try {
      const result = await mutation.mutate({ id, status })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    updateJobStatus,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for exporting data (admin only)
 */
export function useExportData() {
  const mutation = useBaseMutation<{ url: string }, { type: string; format?: string }>()

  mutation.setMutateFunction(async ({ type, format = 'csv' }) => {
    return RequestService.get(API_ENDPOINTS.ADMIN.EXPORT(type), {
      headers: {
        'Accept': format === 'json' ? 'application/json' : 'text/csv'
      }
    })
  })

  const exportData = useCallback(async (type: string, format = 'csv') => {
    try {
      const result = await mutation.mutate({ type, format })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    exportData,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for fetching system health (admin only)
 */
export function useSystemHealth() {
  const queryFn = useCallback(async () => {
    return RequestService.get<SystemHealth>('/api/admin/health')
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    health: query.data || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for deleting user (admin only)
 */
export function useDeleteUser() {
  const mutation = useBaseMutation<{ success: boolean }, string>()

  mutation.setMutateFunction(async (id: string) => {
    return RequestService.delete(`/api/admin/users/${id}`)
  })

  const deleteUser = useCallback(async (id: string) => {
    try {
      const result = await mutation.mutate(id)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    deleteUser,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for deleting job (admin only)
 */
export function useDeleteJobAdmin() {
  const mutation = useBaseMutation<{ success: boolean }, string>()

  mutation.setMutateFunction(async (id: string) => {
    return RequestService.delete(`/api/admin/jobs/${id}`)
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