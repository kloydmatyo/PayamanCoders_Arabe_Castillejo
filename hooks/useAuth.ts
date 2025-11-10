/**
 * Authentication Related Hooks
 * Custom hooks for authentication operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseMutation, useBaseQuery } from './useBaseHooks'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ProfileUpdateData 
} from '@/interfaces'

/**
 * Hook for user login
 */
export function useLogin() {
  const mutation = useBaseMutation<AuthResponse, LoginCredentials>()

  mutation.setMutateFunction(async (credentials: LoginCredentials) => {
    return RequestService.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
  })

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await mutation.mutate(credentials)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    login,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const mutation = useBaseMutation<AuthResponse, RegisterData>()

  mutation.setMutateFunction(async (data: RegisterData) => {
    return RequestService.post(API_ENDPOINTS.AUTH.REGISTER, data)
  })

  const register = useCallback(async (data: RegisterData) => {
    try {
      const result = await mutation.mutate(data)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    register,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const mutation = useBaseMutation<{ success: boolean }, void>()

  mutation.setMutateFunction(async () => {
    return RequestService.post(API_ENDPOINTS.AUTH.LOGOUT)
  })

  const logout = useCallback(async () => {
    try {
      const result = await mutation.mutate()
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    logout,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for fetching user profile
 */
export function useProfile(options?: { enabled?: boolean }) {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ user: User }>(API_ENDPOINTS.AUTH.PROFILE)
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: options?.enabled ?? true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  return {
    user: query.data?.user || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const mutation = useBaseMutation<{ user: User }, ProfileUpdateData>()

  mutation.setMutateFunction(async (data: ProfileUpdateData) => {
    return RequestService.put(API_ENDPOINTS.USER.UPDATE, data)
  })

  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    try {
      const result = await mutation.mutate(data)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    updateProfile,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for Google OAuth callback
 */
export function useGoogleCallback() {
  const mutation = useBaseMutation<AuthResponse, { code: string; state?: string }>()

  mutation.setMutateFunction(async (params: { code: string; state?: string }) => {
    return RequestService.post(API_ENDPOINTS.AUTH.GOOGLE_CALLBACK, params)
  })

  const handleCallback = useCallback(async (code: string, state?: string) => {
    try {
      const result = await mutation.mutate({ code, state })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    handleCallback,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for testing authentication status
 */
export function useTestAuth() {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ authenticated: boolean; user: User }>(
      API_ENDPOINTS.AUTH.TEST_AUTH
    )
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: false, // Manual trigger only
    refetchOnMount: false,
  })

  const testAuth = useCallback(() => {
    query.refetch()
  }, [query.refetch])

  return {
    authenticated: query.data?.authenticated || false,
    user: query.data?.user || null,
    loading: query.loading,
    error: query.error,
    testAuth,
  }
}