'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { User, Mail, MapPin, Briefcase, GraduationCap, Clock, Globe } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ResumeUpload from '@/components/ResumeUpload'

interface ResumeData {
  filename: string
  url: string
  size: number
  type?: string
  uploadedAt: string
}

interface UserProfile {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  profile: {
    bio?: string
    skills: string[]
    location?: string
    experience?: string
    education?: string
    availability?: string
    remote?: boolean
  }
  resume?: ResumeData
  createdAt: string
}

export default function ProfilePage() {
  const { user: authUser, refreshUser } = useAuth()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: '',
    location: '',
    experience: '',
    education: '',
    availability: '',
    remote: false
  })
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          bio: data.user.profile?.bio || '',
          skills: data.user.profile?.skills?.join(', ') || '',
          location: data.user.profile?.location || '',
          experience: data.user.profile?.experience || '',
          education: data.user.profile?.education || '',
          availability: data.user.profile?.availability || '',
          remote: data.user.profile?.remote || false
        })
      } else {
        setError('Failed to load profile')
      }
    } catch (error) {
      setError('Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          profile: {
            bio: formData.bio,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
            location: formData.location,
            experience: formData.experience,
            education: formData.education,
            availability: formData.availability,
            remote: formData.remote
          }
        }),
      })

      if (response.ok) {
        await fetchProfile()
        setIsEditing(false)
      } else {
        setError('Failed to update profile')
      }
    } catch (error) {
      setError('Error updating profile')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-[floatUp_0.85s_ease-out]">
          <h1 className="auth-title text-3xl font-bold mb-3">Profile Settings</h1>
          <p className="auth-subtitle text-base">Manage your account information and preferences.</p>
        </div>

      {/* Password Management Section */}
      {authUser && (authUser.authProvider === 'google' || authUser.authProvider === 'hybrid') && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Authentication Settings</h2>
          </div>
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Login Methods
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-gray-700">Google Authentication</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium">✓ Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-gray-700">Email & Password</span>
                    </div>
                    {authUser.hasPassword ? (
                      <span className="text-green-600 text-sm font-medium">✓ Active</span>
                    ) : (
                      <Link
                        href="/auth/set-password"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Set Password
                      </Link>
                    )}
                  </div>
                </div>
                
                {!authUser.hasPassword && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Set a Password for More Flexibility
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Currently, you can only login with Google. Setting a password allows you to login with either method, 
                            giving you more options and ensuring you can always access your account.
                          </p>
                        </div>
                        <div className="mt-3">
                          <Link
                            href="/auth/set-password"
                            className="text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded-md font-medium"
                          >
                            Set Password Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Section - Only for job seekers */}
      {user?.role === 'job_seeker' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
            <p className="text-sm text-gray-600 mt-1">
              <span className="text-red-600 font-medium">Required:</span> Upload your resume to apply for jobs. Only PDF and DOCX files are accepted (max 10MB).
            </p>
          </div>
          <div className="p-6">
            <ResumeUpload
              currentResume={user.resume}
              onUploadSuccess={(resume) => {
                setUser(prev => prev ? { ...prev, resume } : null)
              }}
              onDeleteSuccess={() => {
                setUser(prev => prev ? { ...prev, resume: undefined } : null)
              }}
            />
          </div>
        </div>
      )}

      <div className="card overflow-hidden" style={{ '--float-delay': '0.1s' } as CSSProperties}>
        <div className="px-8 py-6 border-b border-primary-500/30 flex justify-between items-center bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-secondary-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent animate-pulse"></div>
          <h2 className="feature-heading text-3xl font-bold relative z-10 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent animate-[headlinePulse_3s_ease-in-out_infinite] drop-shadow-sm">
            Personal Information
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`relative z-10 ${isEditing ? 'btn-secondary' : 'btn-primary'} px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 group`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isEditing ? 'Cancel' : 'Edit Profile'}
              {!isEditing && (
                <div className="h-1.5 w-1.5 rounded-full bg-white/80 group-hover:bg-white animate-pulse"></div>
              )}
            </span>
          </button>
        </div>

        <div className="p-8">
          {isEditing ? (
            <div className="space-y-8 animate-[floatUp_0.5s_ease-out]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                  />
                </div>
                <div className="group">
                  <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                  />
                </div>
              </div>

              <div className="group">
                <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="glass-input w-full px-5 py-3.5 text-base font-medium resize-none transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="group">
                <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                  placeholder="JavaScript, React, Node.js, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                    placeholder="City, State/Country"
                  />
                </div>
                <div className="group">
                  <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="glass-input w-full px-5 py-3.5 text-base font-medium appearance-none bg-white/70 cursor-pointer transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                  >
                    <option value="">Select availability</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  Experience
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={3}
                  className="glass-input w-full px-5 py-3.5 text-base font-medium resize-none transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                  placeholder="Describe your work experience..."
                />
              </div>

              <div className="group">
                <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  Education
                </label>
                <textarea
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  rows={3}
                  className="glass-input w-full px-5 py-3.5 text-base font-medium resize-none transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                  placeholder="Describe your educational background..."
                />
              </div>

              <div className="flex items-center p-6 rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 via-white/50 to-secondary-500/10 backdrop-blur group hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300">
                <input
                  type="checkbox"
                  id="remote"
                  checked={formData.remote}
                  onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                  className="h-6 w-6 text-primary-600 focus:ring-primary-500 border-primary-500/40 rounded-md bg-white/80 cursor-pointer focus:ring-2 focus:ring-primary-500/50 shadow-inner shadow-primary-700/20 transition-all duration-300 checked:bg-primary-600 checked:border-primary-600"
                />
                <label htmlFor="remote" className="ml-4 block text-lg font-semibold text-gray-900 cursor-pointer group-hover:text-primary-600 transition-colors duration-300 flex items-center gap-2">
                  <span>Open to remote work</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </label>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-white/30">
                <button onClick={handleSave} className="btn-primary px-10 py-4 text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-300 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Save Changes
                    <div className="h-1.5 w-1.5 rounded-full bg-white/80 group-hover:bg-white animate-pulse"></div>
                  </span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary px-10 py-4 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center space-x-6 p-6 rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-white/40 to-secondary-500/10 backdrop-blur relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent opacity-50"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white text-3xl font-bold shadow-inner shadow-primary-900/30 ring-4 ring-primary-500/40 group-hover:ring-primary-500/60 transition-all duration-300">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary-700/40 to-transparent"></div>
                  <span className="relative z-10 drop-shadow-lg">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                  <div className="absolute -inset-2 rounded-full bg-primary-500/50 blur-xl animate-pulse"></div>
                  <div className="absolute -inset-1 rounded-full bg-primary-500/40 blur-md"></div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent mb-2 animate-[headlinePulse_3s_ease-in-out_infinite] drop-shadow-sm">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                    <p className="text-lg font-semibold text-secondary-600 capitalize tracking-wide">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="feature-card p-6 flex items-center space-x-5 group hover:border-primary-500/50 transition-all duration-300">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary-500/40 bg-gradient-to-br from-primary-500/20 to-primary-600/20 text-primary-600 shadow-inner shadow-primary-700/30 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300">
                    <Mail className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600 mb-2">Email</div>
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{user?.email}</span>
                  </div>
                </div>
                {user?.profile?.location && (
                  <div className="feature-card p-5 flex items-center space-x-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-700/20">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-secondary-500 mb-1">Location</div>
                      <span className="text-base font-medium text-gray-900">{user.profile.location}</span>
                    </div>
                  </div>
                )}
                {user?.profile?.availability && (
                  <div className="feature-card p-5 flex items-center space-x-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-700/20">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-secondary-500 mb-1">Availability</div>
                      <span className="text-base font-medium text-gray-900 capitalize">
                        {user.profile.availability.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                )}
                {user?.profile?.remote && (
                  <div className="feature-card p-5 flex items-center space-x-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-700/20">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-secondary-500 mb-1">Remote Work</div>
                      <span className="text-base font-medium text-gray-900">Available</span>
                    </div>
                  </div>
                )}
              </div>

              {user?.profile?.bio && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">About</h4>
                  <p className="text-gray-700">{user.profile.bio}</p>
                </div>
              )}

              {user?.profile?.skills && user.profile.skills.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user?.profile?.experience && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Experience
                  </h4>
                  <p className="text-gray-700">{user.profile.experience}</p>
                </div>
              )}

              {user?.profile?.education && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Education
                  </h4>
                  <p className="text-gray-700">{user.profile.education}</p>
                </div>
              )}

              <div className="flex items-center gap-4 p-6 rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 via-white/50 to-secondary-500/10 backdrop-blur group hover:border-primary-500/50 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary-500/40 bg-gradient-to-br from-primary-500/20 to-primary-600/20 text-primary-600 shadow-inner shadow-primary-700/30 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300">
                  <Clock className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600 mb-2">Member Since</div>
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {new Date(user?.createdAt || '').toLocaleDateString() !== "Invalid Date" 
                      ? new Date(user?.createdAt || '').toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}