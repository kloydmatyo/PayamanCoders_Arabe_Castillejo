'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useMessaging } from '@/contexts/MessagingContext'
import Link from 'next/link'
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Calendar,
  Target,
  BookOpen,
  ArrowLeft,
  Mail,
  Send,
} from 'lucide-react'

interface MentorshipRequest {
  _id: string
  mentee: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profile?: {
      profilePicture?: string
    }
  }
  mentor: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profile?: {
      profilePicture?: string
    }
  }
  message: string
  goals: string[]
  preferredTopics: string[]
  meetingFrequency: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  response?: string
  respondedAt?: string
  createdAt: string
}

export default function MyMentorshipPage() {
  const { user } = useAuth()
  const { openChat } = useMessaging()
  const [requests, setRequests] = useState<MentorshipRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingConversation, setCreatingConversation] = useState(false)

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

  const fetchRequests = async () => {
    try {
      const type = 'sent' // Job seekers/students only see sent requests
      const response = await fetch(`/api/mentorship/request?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const startConversation = async (mentorId: string) => {
    try {
      setCreatingConversation(true)
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: mentorId }),
      })

      if (response.ok) {
        const data = await response.json()
        openChat(data.conversation._id)
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
    } finally {
      setCreatingConversation(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    const icons = {
      pending: Clock,
      accepted: CheckCircle,
      rejected: XCircle,
      cancelled: XCircle,
    }
    const Icon = icons[status as keyof typeof icons]
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        <Icon className="h-4 w-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Mentorship Requests
            </h1>
          </div>
          <p className="text-secondary-600">
            Track your mentorship requests and connect with mentors
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Pending</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Accepted</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{acceptedCount}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Declined</p>
                <p className="mt-2 text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="h-10 w-10 text-red-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-24 w-full rounded bg-white/70"></div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="card py-16 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No mentorship requests yet
            </h3>
            <p className="mb-6 text-secondary-600">
              Start your mentorship journey by connecting with experienced professionals
            </p>
            <Link href="/mentors" className="btn-primary inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              Find Mentors
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <div key={request._id} className="feature-card">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {request.mentor.profile?.profilePicture ? (
                      <img
                        src={request.mentor.profile.profilePicture}
                        alt={`${request.mentor.firstName} ${request.mentor.lastName}`}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-white/50"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xl font-bold text-white shadow-lg">
                        {request.mentor.firstName[0]}
                        {request.mentor.lastName[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {request.mentor.firstName} {request.mentor.lastName}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {request.mentor.email}
                      </p>
                      <p className="mt-1 text-xs text-secondary-500">
                        Requested {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {/* Your Message */}
                <div className="mb-4 rounded-lg bg-white/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <MessageCircle className="h-4 w-4 text-primary-500" />
                    Your Message
                  </div>
                  <p className="text-sm text-secondary-700">{request.message}</p>
                </div>

                {/* Details Grid */}
                <div className="mb-4 grid gap-4 md:grid-cols-3">
                  {request.goals.length > 0 && (
                    <div className="rounded-lg bg-white/60 p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-900">
                        <Target className="h-3.5 w-3.5 text-green-500" />
                        Your Goals
                      </div>
                      <ul className="space-y-1">
                        {request.goals.map((goal, idx) => (
                          <li key={idx} className="text-xs text-secondary-700">
                            • {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {request.preferredTopics.length > 0 && (
                    <div className="rounded-lg bg-white/60 p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-900">
                        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                        Topics
                      </div>
                      <ul className="space-y-1">
                        {request.preferredTopics.map((topic, idx) => (
                          <li key={idx} className="text-xs text-secondary-700">
                            • {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-lg bg-white/60 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-900">
                      <Calendar className="h-3.5 w-3.5 text-purple-500" />
                      Frequency
                    </div>
                    <p className="text-xs text-secondary-700">
                      {request.meetingFrequency.charAt(0).toUpperCase() +
                        request.meetingFrequency.slice(1)}{' '}
                      meetings
                    </p>
                  </div>
                </div>

                {/* Mentor Response */}
                {request.response && (
                  <div
                    className={`rounded-lg border-2 p-4 ${
                      request.status === 'accepted'
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Mail className="h-4 w-4" />
                      Mentor's Response
                      {request.respondedAt && (
                        <span className="text-xs font-normal text-secondary-600">
                          • {new Date(request.respondedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-secondary-700">{request.response}</p>
                  </div>
                )}

                {/* Action for accepted requests */}
                {request.status === 'accepted' && (
                  <div className="mt-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-4 border border-green-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      🎉 Congratulations! Your mentorship request was accepted!
                    </p>
                    <p className="text-xs text-secondary-600 mb-3">
                      Start a conversation with your mentor to schedule your first meeting.
                    </p>
                    <button
                      onClick={() => startConversation(request.mentor._id)}
                      disabled={creatingConversation}
                      className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      {creatingConversation ? 'Opening...' : `Message ${request.mentor.firstName}`}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
