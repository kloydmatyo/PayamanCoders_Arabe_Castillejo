'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Briefcase, Calendar, MapPin, Building, ExternalLink, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface Application {
  id: string
  jobTitle: string
  company: string
  status: string
  appliedDate: string
  jobType?: string
  location?: string
  remote?: boolean
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/applications', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      } else {
        setError('Failed to load applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/40 shadow-lg shadow-yellow-500/20'
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-600 border border-blue-500/40 shadow-lg shadow-blue-500/20'
      case 'accepted':
        return 'bg-green-500/20 text-green-600 border border-green-500/40 shadow-lg shadow-green-500/20'
      case 'rejected':
        return 'bg-red-500/20 text-red-600 border border-red-500/40 shadow-lg shadow-red-500/20'
      default:
        return 'bg-gray-500/20 text-gray-600 border border-gray-500/40 shadow-lg shadow-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />
      case 'rejected':
        return <XCircle className="w-5 h-5" />
      case 'reviewed':
        return <Eye className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Under Review'
      case 'reviewed':
        return 'Reviewed'
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Not Selected'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid"></div>
        <div className="auth-entry-overlay"></div>
        <div className="futuristic-loader">
          <div className="futuristic-loader-inner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid"></div>
        <div className="auth-entry-overlay"></div>
        <div className="card p-8 max-w-md mx-auto">
          <div className="text-red-600 text-center">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid"></div>
      <div className="auth-entry-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8 auth-panel" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <h1 className="auth-title text-4xl font-bold mb-3">My Applications</h1>
          <p className="auth-subtitle text-base text-secondary-600/90">
            Track the status of your job applications and stay updated on your progress.
          </p>
        </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="card p-12 text-center relative overflow-hidden group/empty animate-[floatUp_0.6s_ease-out_0.3s_both]" style={{ '--float-delay': '0.2s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="feature-icon mx-auto mb-6 w-20 h-20 group-hover/empty:scale-110 transition-transform duration-500">
              <Briefcase className="h-10 w-10" />
            </div>
            <h3 className="feature-heading text-2xl font-bold mb-3">No applications yet</h3>
            <p className="auth-subtitle text-base mb-8 max-w-md mx-auto">
              Start applying to jobs to see your applications here.
            </p>
            <Link
              href="/jobs"
              className="btn-primary px-8 py-3.5 text-base font-semibold group/btn inline-flex items-center gap-2"
            >
              <span>Browse Jobs</span>
              <ExternalLink className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/80 group-hover/btn:bg-white animate-pulse"></div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application, index) => (
            <div 
              key={application.id} 
              className="card p-8 group/app hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 relative overflow-hidden"
              style={{ '--float-delay': `${0.3 + index * 0.1}s` } as CSSProperties}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/app:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="feature-heading text-2xl font-bold mb-3 group-hover/app:text-primary-600 transition-colors duration-300">
                      {application.jobTitle}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4 gap-2">
                      <div className="feature-icon">
                        <Building className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">{application.company}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-5 text-base text-secondary-600/90">
                      {application.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary-500" />
                          <span>{application.location}</span>
                          {application.remote && (
                            <span className="px-2 py-1 bg-green-500/20 border border-green-500/40 text-green-600 rounded-full text-xs font-bold">Remote</span>
                          )}
                        </div>
                      )}
                      
                      {application.jobType && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary-500" />
                          <span>{application.jobType.replace('_', ' ').toUpperCase()}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary-500" />
                        <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex-shrink-0">
                    <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span>{getStatusText(application.status)}</span>
                    </span>
                  </div>
                </div>

                {/* Application Timeline */}
                <div className="border-t border-white/30 pt-5">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="text-base text-secondary-600/90">
                      <span className="font-bold text-gray-900">Status:</span> {getStatusText(application.status)}
                      {application.status === 'pending' && (
                        <span className="ml-3 text-blue-600 font-semibold flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                          Waiting for employer review
                        </span>
                      )}
                      {application.status === 'reviewed' && (
                        <span className="ml-3 text-blue-600 font-semibold flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                          Under consideration
                        </span>
                      )}
                      {application.status === 'accepted' && (
                        <span className="ml-3 text-green-600 font-semibold flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          Congratulations! You got the job
                        </span>
                      )}
                      {application.status === 'rejected' && (
                        <span className="ml-3 text-gray-600 font-semibold flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-500"></div>
                          Keep applying to other opportunities
                        </span>
                      )}
                    </div>
                    
                    <div className="text-base text-secondary-600/90 font-medium">
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {applications.length > 0 && (
        <div className="mt-8 card p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500" style={{ '--float-delay': '0.4s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h3 className="feature-heading text-2xl font-bold mb-6 group-hover:text-primary-600 transition-colors duration-300">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/jobs"
                className="btn-primary px-6 py-3.5 text-base font-semibold group/btn inline-flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                <span>Browse More Jobs</span>
                <div className="h-1.5 w-1.5 rounded-full bg-white/80 group-hover/btn:bg-white animate-pulse"></div>
              </Link>
              <Link
                href="/profile"
                className="btn-secondary px-6 py-3.5 text-base font-semibold group/btn inline-flex items-center gap-2"
              >
                <span>Update Profile</span>
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500/80 group-hover/btn:bg-primary-500 animate-pulse"></div>
              </Link>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}