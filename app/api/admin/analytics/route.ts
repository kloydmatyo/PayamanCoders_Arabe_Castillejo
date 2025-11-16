import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import Job from '@/models/Job'
import Application from '@/models/Application'
import Assessment from '@/models/Assessment'
import AssessmentAttempt from '@/models/AssessmentAttempt'
import MentorshipRequest from '@/models/MentorshipRequest'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const currentUser = await verifyToken(req)
    
    // Only admins can access analytics
    if (!currentUser?.userId || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    await dbConnect()

    // Get date for "this month" calculations
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // User Statistics
    const totalUsers = await User.countDocuments()
    const jobSeekers = await User.countDocuments({ role: 'job_seeker' })
    const employers = await User.countDocuments({ role: 'employer' })
    const mentors = await User.countDocuments({ role: 'mentor' })
    const students = await User.countDocuments({ role: 'student' })
    const newThisMonth = await User.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    })

    // Jobs & Applications
    const totalJobs = await Job.countDocuments()
    const activeJobs = await Job.countDocuments({ status: 'open' })
    const filledJobs = await Job.countDocuments({ status: 'filled' })
    const totalApplications = await Application.countDocuments()

    // Assessments
    const totalAssessments = await Assessment.countDocuments()
    const totalAttempts = await AssessmentAttempt.countDocuments()
    
    // Calculate average score and pass rate
    const attempts = await AssessmentAttempt.find().lean()
    const averageScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
      : 0
    const passedAttempts = attempts.filter(a => a.passed).length
    const passRate = attempts.length > 0
      ? Math.round((passedAttempts / attempts.length) * 100)
      : 0

    // Mentorship
    const totalMentorshipRequests = await MentorshipRequest.countDocuments()
    const acceptedRequests = await MentorshipRequest.countDocuments({ status: 'accepted' })
    const pendingRequests = await MentorshipRequest.countDocuments({ status: 'pending' })
    const rejectedRequests = await MentorshipRequest.countDocuments({ status: 'rejected' })

    // Verification (from User model)
    const pendingVerification = await User.countDocuments({ 
      role: 'employer',
      'verification.status': 'pending'
    })
    const verifiedUsers = await User.countDocuments({ 
      role: 'employer',
      'verification.status': 'verified'
    })
    const rejectedVerification = await User.countDocuments({ 
      role: 'employer',
      'verification.status': 'rejected'
    })

    const analyticsData = {
      users: {
        total: totalUsers,
        jobSeekers,
        employers,
        mentors,
        students,
        newThisMonth
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        filled: filledJobs,
        applications: totalApplications
      },
      assessments: {
        total: totalAssessments,
        attempts: totalAttempts,
        averageScore,
        passRate
      },
      mentorship: {
        totalRequests: totalMentorshipRequests,
        accepted: acceptedRequests,
        pending: pendingRequests,
        rejected: rejectedRequests
      },
      verification: {
        pending: pendingVerification,
        verified: verifiedUsers,
        rejected: rejectedVerification
      }
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
