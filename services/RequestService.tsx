/**
 * RequestService - HTTP service handler for API requests
 * Provides a centralized way to handle all HTTP requests with proper error handling,
 * authentication, and response formatting.
 */

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  credentials?: 'include' | 'omit' | 'same-origin'
  signal?: AbortSignal
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  status: number
}

export class RequestService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  
  /**
   * Default request configuration
   */
  private static defaultConfig: RequestConfig = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Make an HTTP request with proper error handling
   */
  static async request<T = any>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
      const fullUrl = `${this.baseUrl}${url}`
      
      const mergedConfig: RequestInit = {
        ...this.defaultConfig,
        ...config,
        headers: {
          ...this.defaultConfig.headers,
          ...config.headers,
        },
      }

      // Handle body serialization
      if (config.body && typeof config.body === 'object') {
        mergedConfig.body = JSON.stringify(config.body)
      }

      const response = await fetch(fullUrl, mergedConfig)
      
      let data: any = null
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        return {
          success: false,
          error: data?.error || data?.message || `HTTP ${response.status}`,
          status: response.status,
          data: data
        }
      }

      return {
        success: true,
        data,
        status: response.status
      }
    } catch (error) {
      console.error('RequestService error:', error)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request was cancelled',
            status: 0
          }
        }
        
        return {
          success: false,
          error: error.message || 'Network error occurred',
          status: 0
        }
      }
      
      return {
        success: false,
        error: 'Unknown error occurred',
        status: 0
      }
    }
  }

  /**
   * GET request helper
   */
  static async get<T = any>(
    endpoint: string, 
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  /**
   * POST request helper
   */
  static async post<T = any>(
    endpoint: string, 
    body?: any, 
    config?: Omit<RequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  /**
   * PUT request helper
   */
  static async put<T = any>(
    endpoint: string, 
    body?: any, 
    config?: Omit<RequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  /**
   * DELETE request helper
   */
  static async delete<T = any>(
    endpoint: string, 
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  /**
   * PATCH request helper
   */
  static async patch<T = any>(
    endpoint: string, 
    body?: any, 
    config?: Omit<RequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }

  /**
   * Upload file with multipart/form-data
   */
  static async uploadFile<T = any>(
    endpoint: string,
    formData: FormData,
    config?: Omit<RequestConfig, 'method' | 'body' | 'headers'>
  ): Promise<ApiResponse<T>> {
    const uploadConfig: RequestConfig = {
      ...config,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - let browser set it with boundary
        ...config?.headers,
      }
    }
    
    // Remove Content-Type header to let browser set it properly for FormData
    delete uploadConfig.headers?.['Content-Type']
    
    return this.request<T>(endpoint, uploadConfig)
  }

  /**
   * Create an AbortController for cancelling requests
   */
  static createAbortController(): AbortController {
    return new AbortController()
  }

  /**
   * Helper to build query parameters
   */
  static buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })
    
    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ''
  }
}

export default RequestService