'use client'

import { useState } from 'react'

interface VerificationFormProps {
  onSubmit: (data: any) => Promise<void>
  initialData?: any
}

export default function VerificationForm({ onSubmit, initialData }: VerificationFormProps) {
  const [formData, setFormData] = useState({
    businessRegistrationNumber: initialData?.businessRegistrationNumber || '',
    linkedInProfile: initialData?.linkedInProfile || '',
    officialEmail: initialData?.officialEmail || '',
    documents: initialData?.documents || []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Registration Number *
        </label>
        <input
          type="text"
          required
          value={formData.businessRegistrationNumber}
          onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your business registration number"
        />
        <p className="mt-1 text-sm text-gray-500">
          Your official business/company registration number
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Official Company Email *
        </label>
        <input
          type="email"
          required
          value={formData.officialEmail}
          onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="contact@yourcompany.com"
        />
        <p className="mt-1 text-sm text-gray-500">
          Must use your company domain (not Gmail, Yahoo, etc.)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LinkedIn Company Profile
        </label>
        <input
          type="url"
          value={formData.linkedInProfile}
          onChange={(e) => setFormData({ ...formData, linkedInProfile: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://linkedin.com/company/your-company"
        />
        <p className="mt-1 text-sm text-gray-500">
          Your company's LinkedIn page URL
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">📄 Supporting Documents</h3>
        <p className="text-sm text-blue-700 mb-3">
          Upload documents to speed up verification (optional but recommended):
        </p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Business registration certificate</li>
          <li>Tax identification documents</li>
          <li>Certificate of incorporation</li>
        </ul>
        <p className="text-xs text-blue-600 mt-3">
          Note: Document upload functionality will be available in the next update
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Verification Process</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>We'll verify your email domain and business information</li>
          <li>Automated checks will validate your company details</li>
          <li>If needed, our team will manually review your application</li>
          <li>You'll receive verification status within 24-48 hours</li>
        </ol>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Submitting...' : 'Submit for Verification'}
      </button>
    </form>
  )
}
