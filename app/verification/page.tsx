'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VerificationBadge from '@/components/verification/VerificationBadge'
import VerificationForm from '@/components/verification/VerificationForm'

export default function VerificationPage() {
  const router = useRouter()
  const [verificationData, setVerificationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/verification/status')
      if (response.ok) {
        const data = await response.json()
        setVerificationData(data)
      }
    } catch (error) {
      console.error('Failed to fetch verification status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    setSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: data.message || 'Verification submitted successfully' 
        })
        await fetchVerificationStatus()
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Verification submission failed' 
        })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An error occurred. Please try again.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification status...</p>
        </div>
      </div>
    )
  }

  const verification = verificationData?.verification
  const status = verification?.status || 'unverified'

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Employer Verification</h1>
          <p className="mt-2 text-gray-600">
            Verify your company to build trust with job seekers and unlock full platform features
          </p>
        </div>

        {/* Current Status Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Verification Status</h2>
            <VerificationBadge 
              status={status} 
              trustScore={verification?.trustScore}
              showScore={status === 'verified'}
            />
          </div>

          {status === 'verified' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✓ Your company is verified! Job seekers can see your verified badge on all job postings.
              </p>
              {verification?.verifiedAt && (
                <p className="text-sm text-green-700 mt-2">
                  Verified on {new Date(verification.verifiedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                ⏳ Your verification is under review. We'll notify you once the review is complete.
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                This usually takes 24-48 hours.
              </p>
            </div>
          )}

          {status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                ✗ Verification was not approved
              </p>
              {verification?.rejectionReason && (
                <p className="text-sm text-red-700 mt-2">
                  Reason: {verification.rejectionReason}
                </p>
              )}
              <p className="text-sm text-red-700 mt-2">
                Please update your information and resubmit.
              </p>
            </div>
          )}

          {status === 'suspended' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                ⊘ Your verification has been suspended
              </p>
              <p className="text-sm text-red-700 mt-2">
                Please contact support for more information.
              </p>
            </div>
          )}
        </div>

        {/* Verification Checks */}
        {verification?.verificationChecks && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Checks</h2>
            <div className="space-y-3">
              <CheckItem 
                label="Email Domain" 
                passed={verification.verificationChecks.emailDomainVerified}
              />
              <CheckItem 
                label="Business Registry" 
                passed={verification.verificationChecks.businessRegistryChecked}
              />
              <CheckItem 
                label="LinkedIn Profile" 
                passed={verification.verificationChecks.linkedInVerified}
              />
              <CheckItem 
                label="Website Verification" 
                passed={verification.verificationChecks.websiteVerified}
              />
            </div>
          </div>
        )}

        {/* Verification Form */}
        {(status === 'unverified' || status === 'rejected') && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {status === 'rejected' ? 'Resubmit Verification' : 'Submit for Verification'}
            </h2>
            
            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <VerificationForm 
              onSubmit={handleSubmit}
              initialData={verification}
            />
          </div>
        )}

        {/* Benefits Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3">Benefits of Verification</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Verified badge on all your job postings</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Higher trust score increases application rates</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Priority placement in job search results</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Access to premium features and analytics</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-700">{label}</span>
      <span className={`text-sm font-medium ${passed ? 'text-green-600' : 'text-gray-400'}`}>
        {passed ? '✓ Verified' : '○ Not verified'}
      </span>
    </div>
  )
}
