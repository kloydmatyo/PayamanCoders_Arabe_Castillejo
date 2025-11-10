/**
 * Common API Response Interfaces
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  status: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasNext?: boolean
  hasPrev?: boolean
  currentPage?: number
  totalPages?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationMeta
}

/**
 * Query Parameters Interface
 */
export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  [key: string]: any
}

/**
 * Hook State Interface
 */
export interface HookState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface MutationState {
  loading: boolean
  error: string | null
}

/**
 * Hook Options Interface
 */
export interface HookOptions {
  enabled?: boolean
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  retry?: number
  retryDelay?: number
}