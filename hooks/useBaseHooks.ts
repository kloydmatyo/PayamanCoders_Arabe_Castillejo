/**
 * Base Hook Utilities
 * Provides common functionality for all API hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiResponse, HookState, MutationState, HookOptions } from '@/interfaces'

/**
 * Base hook state management
 */
export function useBaseState<T>(initialData: T | null = null): HookState<T> & {
  setData: (data: T | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
} {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setData(initialData)
    setLoading(false)
    setError(null)
  }, [initialData])

  return {
    data,
    loading,
    error,
    setData,
    setLoading,
    setError,
    reset,
  }
}

/**
 * Base mutation hook for create/update/delete operations
 */
export function useBaseMutation<TData, TVariables = any>(): MutationState & {
  mutate: (variables: TVariables) => Promise<TData>
  reset: () => void
  setMutateFunction: (fn: (variables: TVariables) => Promise<ApiResponse<TData>>) => void
} {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mutateFunction = useRef<((variables: TVariables) => Promise<ApiResponse<TData>>) | null>(null)

  const setMutateFunction = useCallback((fn: (variables: TVariables) => Promise<ApiResponse<TData>>) => {
    mutateFunction.current = fn
  }, [])

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    if (!mutateFunction.current) {
      throw new Error('Mutate function not set')
    }

    setLoading(true)
    setError(null)

    try {
      const response = await mutateFunction.current(variables)
      
      if (!response.success) {
        throw new Error(response.error || 'Mutation failed')
      }

      return response.data as TData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return {
    loading,
    error,
    mutate,
    reset,
    setMutateFunction,
  }
}

/**
 * Base query hook for fetching data
 */
export function useBaseQuery<T>(
  queryFn: () => Promise<ApiResponse<T>>,
  options: HookOptions = {}
) {
  const {
    enabled = true,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    retry = 1,
    retryDelay = 1000,
  } = options

  const state = useBaseState<T>()
  const { setData, setLoading, setError, reset } = state
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)
  const mountedRef = useRef(true)

  const executeQuery = useCallback(async (isRetry = false) => {
    if (!enabled) return
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    
    if (!isRetry) {
      setLoading(true)
      setError(null)
      retryCountRef.current = 0
    }

    try {
      const response = await queryFn()
      
      if (!mountedRef.current) return
      
      if (response.success) {
        setData(response.data as T)
        setError(null)
        retryCountRef.current = 0
      } else {
        throw new Error(response.error || 'Query failed')
      }
    } catch (err) {
      if (!mountedRef.current) return
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      
      // Retry logic
      if (retryCountRef.current < retry && errorMessage !== 'Request was cancelled') {
        retryCountRef.current++
        setTimeout(() => {
          if (mountedRef.current) {
            executeQuery(true)
          }
        }, retryDelay)
        return
      }
      
      setError(errorMessage)
    } finally {
      if (mountedRef.current && !isRetry) {
        setLoading(false)
      }
    }
  }, [enabled, queryFn, retry, retryDelay, setData, setLoading, setError])

  // Initial fetch
  useEffect(() => {
    if (enabled && refetchOnMount) {
      executeQuery()
    }
  }, [enabled, refetchOnMount, executeQuery])

  // Window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return

    const handleFocus = () => {
      executeQuery()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchOnWindowFocus, enabled, executeQuery])

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const refetch = useCallback(() => {
    executeQuery()
  }, [executeQuery])

  return {
    ...state,
    refetch,
  }
}

/**
 * Debounced value hook
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Local storage hook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}