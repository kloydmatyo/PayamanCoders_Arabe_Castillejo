'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Shield } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    
    if (user.role !== 'admin') {
      router.push('/')
      return
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">WorkQit Platform Administration</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">User Management</h3>
              <p className="text-blue-700">Manage platform users, roles, and permissions.</p>
              <div className="mt-4">
                <p className="text-sm text-blue-600">API Endpoints Ready:</p>
                <ul className="text-xs text-blue-500 mt-1">
                  <li>• GET /api/admin/users - List users</li>
                  <li>• PATCH /api/admin/users/[id] - Manage users</li>
                  <li>• GET /api/admin/stats - Platform statistics</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 mb-2">Job Management</h3>
              <p className="text-green-700">Oversee job postings and applications.</p>
              <div className="mt-4">
                <p className="text-sm text-green-600">API Endpoints Ready:</p>
                <ul className="text-xs text-green-500 mt-1">
                  <li>• GET /api/admin/jobs - List jobs</li>
                  <li>• PATCH /api/admin/jobs/[id] - Manage jobs</li>
                  <li>• GET /api/admin/export/[type] - Export data</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900 mb-2">Analytics & Export</h3>
              <p className="text-purple-700">View platform statistics and export data.</p>
              <div className="mt-4">
                <p className="text-sm text-purple-600">Features Available:</p>
                <ul className="text-xs text-purple-500 mt-1">
                  <li>• CSV export for users, jobs, applications</li>
                  <li>• Real-time platform statistics</li>
                  <li>• Activity logs and monitoring</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="text-yellow-800 font-medium mb-2">Admin System Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-yellow-800 font-medium">✅ Backend APIs Complete:</p>
                <ul className="text-yellow-700 mt-1 space-y-1">
                  <li>• Admin authentication & authorization</li>
                  <li>• User management (activate/deactivate/delete)</li>
                  <li>• Job management (activate/deactivate/delete)</li>
                  <li>• Platform statistics and analytics</li>
                  <li>• Data export functionality (CSV)</li>
                </ul>
              </div>
              <div>
                <p className="text-yellow-800 font-medium">🚧 Frontend UI:</p>
                <ul className="text-yellow-700 mt-1 space-y-1">
                  <li>• Basic admin page working</li>
                  <li>• Full dashboard UI ready for implementation</li>
                  <li>• All components and interfaces designed</li>
                  <li>• Responsive design with Tailwind CSS</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="text-green-800 font-medium mb-2">🎯 Admin Capabilities Implemented</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <p className="font-medium">User Management:</p>
                <ul className="mt-1 space-y-1">
                  <li>• View all users with filtering</li>
                  <li>• Activate/deactivate user accounts</li>
                  <li>• Reset user passwords</li>
                  <li>• View authentication methods</li>
                  <li>• Export user data to CSV</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Job & Platform Management:</p>
                <ul className="mt-1 space-y-1">
                  <li>• View all jobs with filtering</li>
                  <li>• Activate/deactivate/delete jobs</li>
                  <li>• Monitor application statistics</li>
                  <li>• Export jobs and applications data</li>
                  <li>• Real-time activity monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}