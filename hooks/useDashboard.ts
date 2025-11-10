/**
 * Dashboard Related Hooks
 * Custom hooks for dashboard operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseQuery } from './useBaseHooks'
import type { 
  DashboardStats, 
  DashboardApplication, 
  JobRecommendation 
} from '@/interfaces'

/**
 * Hook for fetching dashboard statistics
 */
export function useDashboardStats() {
  const queryFn = useCallback(async () => {
    return RequestService.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS)
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
 * Hook for fetching dashboard applications (overview)
 */
export function useDashboardApplicationsOverview() {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ applications: DashboardApplication[] }>(
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
 * Hook for fetching job recommendations
 */
export function useJobRecommendations() {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ recommendations: JobRecommendation[] }>(
      API_ENDPOINTS.DASHBOARD.RECOMMENDATIONS
    )
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    recommendations: query.data?.recommendations || [],
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}