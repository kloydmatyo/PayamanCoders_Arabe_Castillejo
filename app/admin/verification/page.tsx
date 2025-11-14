'use client'

import { useState, useEffect } from 'react'
import VerificationBadge from '@/components/verification/VerificationBadge'

export default function AdminVerificationPage() {
  const [employers, setEmployers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    fetchEmployers()
  }, [filter])

  const fetchEmployers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/verification/pending?status=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setEmployers(data.employers)
      }
    } catch (error) {
      console.error('Failed to fetch employers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (employerId: string, action: string) => {
    setReviewing(true)
    try {
      const response = await fetch('/api/admin/verification/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerId,
          action,
          notes: reviewNotes
        })
      })

      if (response.ok) {
        alert(`Employer ${action}ed successfully`)
        setSelectedEmployer(null)
        setReviewNotes('')
        fetchEmployers()
      } else {
        const data = await response.json()
        alert(data.error || 'Review failed')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Employer Verification Management</h1>
          <p className="mt-2 text-gray-600">Review and manage employer verification requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['pending', 'verified', 'rejected', 'suspended', 'unverified'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    filter === status
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Employers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading employers...</p>
          </div>
        ) : employers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No employers found with status: {filter}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {employers.map((employer) => (
              <div key={employer.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{employer.name}</h3>
                      <VerificationBadge 
                        status={employer.verification?.status || 'unverified'}
                        trustScore={employer.verification?.trustScore}
                      />
                    </div>
                    <p className="text-gray-600">{employer.companyName}</p>
                    <p className="text-sm text-gray-500">{employer.email}</p>
                    
                    {employer.verification && (
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Trust Score:</span>
                          <span className="ml-2 font-medium">{employer.verification.trustScore}/100</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Reports:</span>
                          <span className="ml-2 font-medium">{employer.verification.reports || 0}</span>
                        </div>
                        {employer.verification.businessRegistrationNumber && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Business Reg:</span>
                            <span className="ml-2 font-medium">{employer.verification.businessRegistrationNumber}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {employer.verification?.flags && employer.verification.flags.length > 0 && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-sm font-medium text-yellow-900 mb-2">⚠️ Flags:</p>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          {employer.verification.flags.map((flag: any, idx: number) => (
                            <li key={idx}>• {flag.description}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedEmployer(employer)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedEmployer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Review Employer</h2>
                  <p className="text-gray-600">{selectedEmployer.name} - {selectedEmployer.companyName}</p>
                </div>
                <button
                  onClick={() => setSelectedEmployer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Verification Details</h3>
                  <div className="bg-gray-50 rounded p-4 space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {selectedEmployer.verification?.officialEmail || selectedEmployer.email}</p>
                    <p><span className="font-medium">Domain:</span> {selectedEmployer.verification?.emailDomain || 'N/A'}</p>
                    <p><span className="font-medium">Business Reg:</span> {selectedEmployer.verification?.businessRegistrationNumber || 'N/A'}</p>
                    <p><span className="font-medium">LinkedIn:</span> {selectedEmployer.verification?.linkedInProfile || 'N/A'}</p>
                    <p><span className="font-medium">Trust Score:</span> {selectedEmployer.verification?.trustScore || 0}/100</p>
                  </div>
                </div>

                {selectedEmployer.verification?.verificationChecks && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Automated Checks</h3>
                    <div className="bg-gray-50 rounded p-4 space-y-2 text-sm">
                      <CheckStatus label="Email Domain" passed={selectedEmployer.verification.verificationChecks.emailDomainVerified} />
                      <CheckStatus label="Business Registry" passed={selectedEmployer.verification.verificationChecks.businessRegistryChecked} />
                      <CheckStatus label="LinkedIn" passed={selectedEmployer.verification.verificationChecks.linkedInVerified} />
                      <CheckStatus label="Website" passed={selectedEmployer.verification.verificationChecks.websiteVerified} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add notes about this review..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleReview(selectedEmployer.id, 'approve')}
                  disabled={reviewing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReview(selectedEmployer.id, 'reject')}
                  disabled={reviewing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReview(selectedEmployer.id, 'suspend')}
                  disabled={reviewing}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckStatus({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className={passed ? 'text-green-600' : 'text-gray-400'}>
        {passed ? '✓' : '○'}
      </span>
    </div>
  )
}
