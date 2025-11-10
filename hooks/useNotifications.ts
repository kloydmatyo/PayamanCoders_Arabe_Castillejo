/**
 * Notification Related Hooks
 * Custom hooks for notification operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseMutation, useBaseQuery } from './useBaseHooks'
import type { Notification } from '@/interfaces'

/**
 * Hook for fetching notifications
 */
export function useNotifications() {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ notifications: Notification[] }>(
      API_ENDPOINTS.NOTIFICATIONS.LIST
    )
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    notifications: query.data?.notifications || [],
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for marking notifications as read
 */
export function useMarkNotificationsRead() {
  const mutation = useBaseMutation<{ success: boolean }, string[]>()

  mutation.setMutateFunction(async (notificationIds: string[]) => {
    return RequestService.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, {
      notificationIds
    })
  })

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      const result = await mutation.mutate(notificationIds)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    markAsRead,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}