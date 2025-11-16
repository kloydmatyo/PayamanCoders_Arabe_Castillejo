'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, MapPin, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import ResumePreviewModal from '@/components/ResumePreviewModal'
import { createPortal } from 'react-dom'

interface Applicant {
  applicationId: string
  applicant: {
    id: string
    firstName: string
    lastName: string
    email: string
    bio: string
    skills: string[]
    experience: string
    location: string
  }
  application: {
    status: string
    coverLetter: string
    appliedDate: string
    feedbacks: any[]
    resume?: {
      filename: string
      cloudinaryUrl: string
      uploadedAt: string
    }
  }
}

interface JobInfo {
  id: string
  title: string
  company: string
}

export default function JobApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [previewResume, setPreviewResume] = useState<{
    url: string;
    filename: string;
    applicantName: string;
  } | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Check if component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if not employer
  useEffect(() => {
    if (user && user.role !== 'employer') {
      router.push('/')
      return
    }
  }, [user, router])

  useEffect(() => {
    if (params.id && user?.role === 'employer') {
      fetchApplicants(params.id as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, user])

  const fetchApplicants = async (jobId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/jobs/${jobId}/applicants`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setJobInfo(data.job)
        setApplicants(data.applicants)
      } else if (response.status === 401 || response.status === 403) {
        setError('Unauthorized access')
        router.push('/')
      } else {
        setError('Failed to load applicants')
      }
    } catch (error) {
      console.error('Error fetching applicants:', error)
      setError('Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: string, feedback?: any) => {
    console.log('Updating application status:', { applicationId, status, jobId: params.id })
    
    try {
      setUpdatingStatus(applicationId)
      const response = await fetch(`/api/jobs/${params.id}/applicants`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          applicationId,
          status,
          feedback
        })
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Update successful:', data)
        
        // Update the local state
        setApplicants(prev => prev.map(applicant => 
          applicant.applicationId === applicationId 
            ? { ...applicant, application: { ...applicant.application, status } }
            : applicant
        ))
        
        // Close modal if open
        setSelectedApplicant(null)
        
        alert(`Application ${status} successfully!`)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to update:', errorData)
        alert(`Failed to update application status: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert(`Failed to update application status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'reviewed':
        return <Eye className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true"></div>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
        </div>
        <div className="relative z-10">
          <div className="futuristic-loader">
            <div className="futuristic-loader-inner"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true"></div>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/20 blur-3xl"></div>
        </div>
        <div className="card p-8 max-w-md mx-auto relative z-10">
          <div className="text-red-600 text-center font-semibold">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true"></div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8 auth-panel" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <Link 
            href="/"
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 mb-6 group/back transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover/back:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold group-hover/back:text-primary-600 transition-colors duration-300">Back to Dashboard</span>
          </Link>
          
          {jobInfo && (
            <div>
              <h1 className="auth-title text-4xl font-bold mb-3">
                Applicants for "{jobInfo.title}"
              </h1>
              <p className="auth-subtitle text-base text-secondary-600/90">
                {jobInfo.company} • {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <div className="card p-12 text-center relative overflow-hidden group/empty animate-[floatUp_0.6s_ease-out_0.3s_both]" style={{ '--float-delay': '0.2s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="feature-icon mx-auto mb-6 w-20 h-20 group-hover/empty:scale-110 transition-transform duration-500">
              <User className="h-10 w-10" />
            </div>
            <h3 className="feature-heading text-2xl font-bold mb-3">No applicants yet</h3>
            <p className="auth-subtitle text-base max-w-md mx-auto">
              When candidates apply to this job, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applicants.map((applicant, index) => (
            <div 
              key={applicant.applicationId} 
              className="relative rounded-2xl border border-white/40 bg-white/60 p-6 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-900/10 group"
              style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform duration-300">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {applicant.applicant.firstName} {applicant.applicant.lastName}
                    </h3>
                    <div className="flex items-center text-secondary-600 text-sm mt-1">
                      <Mail className="w-4 h-4 mr-1.5 text-blue-500" />
                      {applicant.applicant.email}
                    </div>
                    {applicant.applicant.location && (
                      <div className="flex items-center text-secondary-600 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1.5 text-green-500" />
                        {applicant.applicant.location}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(applicant.application.status)}`}>
                    {getStatusIcon(applicant.application.status)}
                    <span className="capitalize">{applicant.application.status}</span>
                  </span>
                  <button
                    onClick={() => setSelectedApplicant(applicant)}
                    className="auth-link text-sm font-semibold pointer-events-auto cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Skills */}
              {applicant.applicant.skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2.5">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {applicant.applicant.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {applicant.applicant.skills.length > 5 && (
                      <span className="text-secondary-600 text-sm font-medium">
                        +{applicant.applicant.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Resume */}
              {applicant.application.resume && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2.5">Resume</h4>
                  <div className="flex items-center flex-wrap gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <button
                      onClick={() => setPreviewResume({
                        url: applicant.application.resume!.cloudinaryUrl,
                        filename: applicant.application.resume!.filename,
                        applicantName: `${applicant.applicant.firstName} ${applicant.applicant.lastName}`
                      })}
                      className="auth-link text-sm font-medium"
                    >
                      {applicant.application.resume.filename}
                    </button>
                    <button
                      onClick={() => setPreviewResume({
                        url: applicant.application.resume!.cloudinaryUrl,
                        filename: applicant.application.resume!.filename,
                        applicantName: `${applicant.applicant.firstName} ${applicant.applicant.lastName}`
                      })}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors pointer-events-auto cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <span className="text-secondary-500 text-xs">
                      Uploaded {applicant.application.resume.uploadedAt ? new Date(applicant.application.resume.uploadedAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              )}

              {/* Cover Letter Preview */}
              {applicant.application.coverLetter && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2.5">Cover Letter</h4>
                  <p className="text-secondary-700 text-sm line-clamp-2">
                    {applicant.application.coverLetter}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/40">
                <div className="text-sm text-secondary-600 font-medium">
                  Applied {new Date(applicant.application.appliedDate).toLocaleDateString()}
                </div>
                
                <div className="flex gap-2">
                  {applicant.application.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(applicant.applicationId, 'reviewed')}
                        disabled={updatingStatus === applicant.applicationId}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow-md pointer-events-auto cursor-pointer"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(applicant.applicationId, 'rejected')}
                        disabled={updatingStatus === applicant.applicationId}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow-md pointer-events-auto cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {applicant.application.status === 'reviewed' && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(applicant.applicationId, 'accepted')}
                        disabled={updatingStatus === applicant.applicationId}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow-md pointer-events-auto cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(applicant.applicationId, 'rejected')}
                        disabled={updatingStatus === applicant.applicationId}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow-md pointer-events-auto cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Detail Modal */}
      {isMounted && selectedApplicant && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[99999] animate-[fadeIn_0.3s_ease-out]" style={{ zIndex: 99999 }}>
          <div className="relative rounded-2xl border-2 border-white/40 bg-white backdrop-blur-xl max-w-3xl w-full max-h-[90vh] shadow-2xl animate-[floatUp_0.5s_ease-out] flex flex-col">
            {/* Modal Header with Gradient Background */}
            <div className="relative bg-gradient-to-br from-primary-500 to-secondary-500 p-6 pb-8 rounded-t-2xl flex-shrink-0">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 rounded-t-2xl"></div>
              <div className="relative flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/30">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedApplicant.applicant.firstName} {selectedApplicant.applicant.lastName}
                    </h2>
                    <p className="text-white/90 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedApplicant.applicant.email}
                    </p>
                    {selectedApplicant.applicant.location && (
                      <p className="text-white/80 flex items-center gap-2 mt-1 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedApplicant.applicant.location}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="relative mt-4">
                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getStatusColor(selectedApplicant.application.status)} bg-white`}>
                  {getStatusIcon(selectedApplicant.application.status)}
                  <span className="capitalize">{selectedApplicant.application.status}</span>
                </span>
                <span className="ml-3 text-white/80 text-sm">
                  Applied {new Date(selectedApplicant.application.appliedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6 bg-gray-50">

              <div className="space-y-6">
                {/* About Section */}
                {selectedApplicant.applicant.bio && (
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 border-2 border-blue-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">About</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">{selectedApplicant.applicant.bio}</p>
                  </div>
                )}

                {/* Experience Section */}
                {selectedApplicant.applicant.experience && (
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/30 p-6 border-2 border-purple-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-md">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Experience</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">{selectedApplicant.applicant.experience}</p>
                  </div>
                )}

                {/* Skills Section */}
                {selectedApplicant.applicant.skills.length > 0 && (
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100/30 p-6 border-2 border-green-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-md">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedApplicant.applicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-white border-2 border-green-300 text-green-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Letter Section */}
                {selectedApplicant.application.coverLetter && (
                  <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/30 p-6 border-2 border-orange-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Cover Letter</h3>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-2 border-orange-200/50 shadow-inner">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                        {selectedApplicant.application.coverLetter}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="border-t-2 border-gray-200 bg-white p-6 rounded-b-2xl flex-shrink-0">
              <div className="flex justify-end gap-3">
                {selectedApplicant.application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplicant.applicationId, 'reviewed')}
                      disabled={updatingStatus === selectedApplicant.applicationId}
                      className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg pointer-events-auto cursor-pointer flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Mark as Reviewed
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplicant.applicationId, 'rejected')}
                      disabled={updatingStatus === selectedApplicant.applicationId}
                      className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg pointer-events-auto cursor-pointer flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                
                {selectedApplicant.application.status === 'reviewed' && (
                  <>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplicant.applicationId, 'accepted')}
                      disabled={updatingStatus === selectedApplicant.applicationId}
                      className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg pointer-events-auto cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplicant.applicationId, 'rejected')}
                      disabled={updatingStatus === selectedApplicant.applicationId}
                      className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg pointer-events-auto cursor-pointer flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Resume Preview Modal */}
      {previewResume && (
        <ResumePreviewModal
          isOpen={!!previewResume}
          onClose={() => setPreviewResume(null)}
          resumeUrl={previewResume.url}
          filename={previewResume.filename}
          applicantName={previewResume.applicantName}
        />
      )}
      </div>
    </div>
  )
}