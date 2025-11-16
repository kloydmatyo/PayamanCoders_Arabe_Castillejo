'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [urlError, setUrlError] = useState('')
  const [isEntering, setIsEntering] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, error} = useAuth()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'google_oauth_not_configured') {
      setUrlError('Google Sign-In is currently not available. Please use email and password to sign in.')
    } else if (errorParam === 'google_oauth_failed') {
      setUrlError('Google Sign-In failed. Please try again or use email and password.')
    }
  }, [searchParams])

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🔐 Login attempt started')
    console.log('📧 Email:', formData.email)
    console.log('🔑 Password length:', formData.password.length)
    
    setLoading(true)
    setSuccess('')

    try {
      console.log('📡 Sending login request...')
      const result = await login(formData)

      if (result.success) {
        console.log('✅ Login successful!')
        setSuccess('Login successful! Redirecting to your homepage...')
        
        // Redirect to homepage which will show role-specific content
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
        
    } catch (error) {
      console.error('💥 Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="auth-background">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className={`auth-panel space-y-10 auth-panel-pulse ${isEntering ? 'auth-panel-enter' : ''}`}>
        <div className="auth-holo-grid" aria-hidden="true" />
        <div className="space-y-4 text-center">
          <h2 className="auth-title">Sign in to your account</h2>
          <p className="auth-subtitle">
            Continue building your career with real-time opportunities and personalized insights.
          </p>
          <p className="auth-meta">
            Or{' '}
            <Link href="/auth/register" className="auth-link">
              create a new account
            </Link>
          </p>
        </div>

        {(error || urlError) && (
          <div className="glass-alert glass-alert-error">
            <div>{urlError || error}</div>
            {error && error.includes('verify your email') && (
              <div className="mt-2">
                <Link
                  href="/auth/verify-email"
                  className="auth-link"
                >
                  Resend verification email
                </Link>
              </div>
            )}
            {error && error.includes('set a password') && (
              <div className="mt-2 text-sm">
                You can also{' '}
                <Link
                  href="/auth/set-password"
                  className="auth-link"
                >
                  set a password
                </Link>
                {' '}to login with email and password.
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="glass-alert glass-alert-success">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/google'}
            className="glass-button"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="auth-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary auth-button w-full py-3 text-base disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}