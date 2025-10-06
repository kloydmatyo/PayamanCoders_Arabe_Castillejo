'use client'

import { useState } from 'react'
import { 
  Download, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Database,
  FileSpreadsheet
} from 'lucide-react'

export default function ExportSection() {
  const [loading, setLoading] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const exportData = async (type: 'users' | 'jobs' | 'applications') => {
    try {
      setLoading(type)
      setError('')
      setSuccess('')

      const response = await fetch(`/api/admin/export/${type}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`)
      } else {
        const data = await response.json()
        setError(data.error || `Failed to export ${type}`)
      }
    } catch (error) {
      setError(`Error exporting ${type}`)
      console.error(`Export ${type} error:`, error)
    } finally {
      setLoading(null)
    }
  }

  const exportOptions = [
    {
      id: 'users',
      title: 'Export Users',
      description: 'Download complete user database with profiles, authentication methods, and activity data',
      icon: Users,
      color: 'blue',
      fields: [
        'User ID', 'Name', 'Email', 'Role', 'Status', 'Auth Provider', 
        'Email Verified', 'Location', 'Skills', 'Registration Date'
      ]
    },
    {
      id: 'jobs',
      title: 'Export Jobs',
      description: 'Download all job postings with employer information, requirements, and application statistics',
      icon: Briefcase,
      color: 'green',
      fields: [
        'Job ID', 'Title', 'Company', 'Type', 'Location', 'Remote', 'Status',
        'Salary Range', 'Description', 'Requirements', 'Employer Info', 'Posted Date'
      ]
    },
    {
      id: 'applications',
      title: 'Export Applications',
      description: 'Download all job applications with candidate details, cover letters, and application status',
      icon: FileText,
      color: 'purple',
      fields: [
        'Application ID', 'Applicant Name', 'Applicant Email', 'Job Title', 
        'Company', 'Employer Info', 'Status', 'Cover Letter', 'Applied Date'
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Data Export</h2>
        <p className="text-sm text-gray-500">Export platform data to CSV files for analysis and reporting</p>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportOptions.map((option) => (
          <div key={option.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  option.color === 'blue' ? 'bg-blue-100' :
                  option.color === 'green' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  <option.icon className={`h-6 w-6 ${
                    option.color === 'blue' ? 'text-blue-600' :
                    option.color === 'green' ? 'text-green-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{option.title}</h3>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">{option.description}</p>
              
              {/* Fields Preview */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Included Fields:</h4>
                <div className="flex flex-wrap gap-1">
                  {option.fields.slice(0, 4).map((field, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {field}
                    </span>
                  ))}
                  {option.fields.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{option.fields.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => exportData(option.id as any)}
                disabled={loading === option.id}
                className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                  option.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' :
                  option.color === 'green' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                  'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                }`}
              >
                {loading === option.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Export Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                File Format
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSV (Comma Separated Values)</li>
                <li>• UTF-8 encoding for international characters</li>
                <li>• Headers included in first row</li>
                <li>• Compatible with Excel, Google Sheets, and other tools</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Data Scope
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All historical data included</li>
                <li>• Real-time data as of export time</li>
                <li>• Sensitive data (passwords) excluded</li>
                <li>• Formatted for easy analysis</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Data Privacy Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Exported data contains personal information. Please ensure compliance with data protection 
                    regulations (GDPR, CCPA, etc.) when handling, storing, or sharing exported files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Files are automatically named with export date: {`data_export_${new Date().toISOString().split('T')[0]}.csv`}
          </div>
        </div>
      </div>
    </div>
  )
}