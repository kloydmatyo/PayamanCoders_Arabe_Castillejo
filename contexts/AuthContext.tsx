'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id?: string
  firstName: string
  lastName: string
  role: string
  email?: string
  authProvider?: 'local' | 'google' | 'hybrid'
  hasPassword?: boolean
  googleId?: string
}

export interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // AbortController for cancelling requests
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const fetchUserProfile = async (signal?: AbortSignal): Promise<User | null> => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
        signal
      })

      if (response.ok) {
        const data = await response.json()
        return data.user
      } else if (response.status === 401) {
        return null
      } else {
        throw new Error('Failed to fetch user profile')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error
      }
      console.error('Error fetching user profile:', error)
      throw new Error('Failed to fetch user profile')
    }
  }

  const refreshUser = async (): Promise<void> => {
    try {
      setError(null)
      const userData = await fetchUserProfile()
      setUser(userData)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      setError(error instanceof Error ? error.message : 'Failed to refresh user')
      setUser(null)
    }
  }

  const login = async (credentials: { email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh user data after successful login
        await refreshUser()
        return { success: true }
      } else {
        const errorMessage = data.error || 'Login failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setError(null)
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear user state even if logout request fails
      setUser(null)
      setError(error instanceof Error ? error.message : 'Logout failed')
    }
  }

  // Initial user profile fetch on mount
  useEffect(() => {
    const controller = new AbortController()
    abortControllerRef.current = controller

    const initializeAuth = async () => {
      try {
        setLoading(true)
        setError(null)
        const userData = await fetchUserProfile(controller.signal)
        setUser(userData)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        console.error('Error initializing auth:', error)
        setError(error instanceof Error ? error.message : 'Failed to initialize authentication')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    return () => {
      controller.abort()
      abortControllerRef.current = null
    }
  }, [])

  const contextValue: AuthContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}