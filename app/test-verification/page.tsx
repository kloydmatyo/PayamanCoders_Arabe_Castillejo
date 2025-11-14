'use client'

import { useState } from 'react'

export default function TestVerificationPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toISOString() }])
  }

  const clearResults = () => setResults([])

  // Test 1: Check verification status
  const testVerificationStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/verification/status')
      const data = await response.json()
      
      if (response.ok) {
        addResult('Verification Status', 'success', 'Status retrieved successfully', data)
      } else {
        addResult('Verification Status', 'error', data.error || 'Failed to get status', data)
      }
    } catch (error) {
      addResult('Verification Status', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
    setLoading(false)
  }

  // Test 2: Submit verification (with test data)
  const testSubmitVerification = async () => {
    setLoading(true)
    try {
      const testData = {
        businessRegistrationNumber: 'TEST-REG-12345',
        linkedInProfile: 'https://linkedin.com/company/test-company',
        officialEmail: 'contact@testcompany.com',
        documents: []
      }

      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      const data = await response.json()
      
      if (response.ok) {
        addResult('Submit Verification', 'success', data.message, data)
      } else {
        addResult('Submit Verification', 'error', data.error || 'Submission failed', data)
      }
    } catch (error) {
      addResult('Submit Verification', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
    setLoading(false)
  }

  // Test 3: Test email domain validation
  const testEmailValidation = async () => {
    setLoading(true)
    const testEmails = [
      { email: 'test@gmail.com', expected: 'fail', reason: 'Free provider' },
      { email: 'contact@company.com', expected: 'pass', reason: 'Corporate domain' },
      { email: 'admin@yahoo.com', expected: 'fail', reason: 'Free provider' }
    ]

    for (const test of testEmails) {
      addResult(
        'Email Validation',
        'info',
        `Testing ${test.email} - Expected: ${test.expected} (${test.reason})`
      )
    }
    setLoading(false)
  }

  // Test 4: Try to post a job (should check verification)
  const testJobPosting = async () => {
    setLoading(true)
    try {
      const testJob = {
        title: 'Test Job Position',
        description: 'This is a test job posting to verify the verification system',
        company: 'Test Company',
        type: 'full_time',
        location: 'Test City',
        remote: false,
        skills: ['Testing', 'Verification'],
        requirements: ['Test requirement']
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testJob)
      })
      const data = await response.json()
      
      if (response.ok) {
        addResult('Job Posting', 'success', data.message, data)
      } else if (response.status === 403) {
        addResult('Job Posting', 'info', '✓ Verification check working: ' + data.message, data)
      } else {
        addResult('Job Posting', 'error', data.error || 'Failed', data)
      }
    } catch (error) {
      addResult('Job Posting', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
    setLoading(false)
  }

  // Test 5: Test admin endpoints (if admin)
  const testAdminEndpoints = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/verification/pending?status=pending')
      const data = await response.json()
      
      if (response.ok) {
        addResult('Admin Endpoints', 'success', `Found ${data.employers?.length || 0} pending verifications`, data)
      } else if (response.status === 401) {
        addResult('Admin Endpoints', 'info', '✓ Auth check working: Admin access required', data)
      } else {
        addResult('Admin Endpoints', 'error', data.error || 'Failed', data)
      }
    } catch (error) {
      addResult('Admin Endpoints', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
    setLoading(false)
  }

  // Test 6: Test reporting system
  const testReporting = async () => {
    setLoading(true)
    try {
      const reportData = {
        employerId: '507f1f77bcf86cd799439011', // Dummy ID
        reason: 'Suspicious behavior',
        description: 'This is a test report to verify the reporting system'
      }

      const response = await fetch('/api/verification/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      })
      const data = await response.json()
      
      if (response.ok) {
        addResult('Reporting System', 'success', data.message, data)
      } else {
        addResult('Reporting System', 'error', data.error || 'Failed', data)
      }
    } catch (error) {
      addResult('Reporting System', 'error', error instanceof Error ? error.message : 'Unknown error')
    }
    setLoading(false)
  }

  const runAllTests = async () => {
    clearResults()
    addResult('Test Suite', 'info', 'Starting all tests...')
    await testVerificationStatus()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testEmailValidation()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testJobPosting()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testAdminEndpoints()
    await new Promise(resolve => setTimeout(resolve, 500))
    addResult('Test Suite', 'info', 'All tests completed!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Verification System Test Suite</h1>
          <p className="mt-2 text-gray-600">
            Test the employer verification system functionality
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={testVerificationStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              1. Check Status
            </button>
            <button
              onClick={testSubmitVerification}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              2. Submit Verification
            </button>
            <button
              onClick={testEmailValidation}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              3. Email Validation
            </button>
            <button
              onClick={testJobPosting}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              4. Job Posting
            </button>
            <button
              onClick={testAdminEndpoints}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              5. Admin Access
            </button>
            <button
              onClick={testReporting}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              6. Reporting
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Running Tests...' : 'Run All Tests'}
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/verification"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center text-sm"
            >
              Verification Page
            </a>
            <a
              href="/admin/verification"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center text-sm"
            >
              Admin Dashboard
            </a>
            <a
              href="/jobs/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center text-sm"
            >
              Post Job
            </a>
            <a
              href="/jobs"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center text-sm"
            >
              View Jobs
            </a>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          {results.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tests run yet. Click a test button above to start.</p>
          ) : (
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`border-l-4 p-4 rounded ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-500'
                      : result.status === 'error'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{result.test}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        result.status === 'success'
                          ? 'text-green-800'
                          : result.status === 'error'
                          ? 'text-red-800'
                          : 'text-blue-800'
                      }`}>
                        {result.message}
                      </p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                            View Details
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Testing Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Testing Instructions</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Prerequisites:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>You must be logged in as an employer to test verification submission</li>
                <li>You must be logged in as an admin to test admin endpoints</li>
                <li>Make sure your database is connected</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Test Scenarios:</h3>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li><strong>As Unverified Employer:</strong> Try to post a job - should be blocked</li>
                <li><strong>Submit Verification:</strong> Fill out verification form with test data</li>
                <li><strong>As Admin:</strong> Review pending verifications and approve/reject</li>
                <li><strong>As Verified Employer:</strong> Post a job - should succeed</li>
                <li><strong>As Job Seeker:</strong> Report a suspicious employer</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Expected Behaviors:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Unverified employers cannot post active jobs</li>
                <li>Free email domains (Gmail, Yahoo) should fail verification</li>
                <li>Corporate email domains should pass initial checks</li>
                <li>Trust scores should be calculated based on verification checks</li>
                <li>Multiple reports should trigger suspension</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
