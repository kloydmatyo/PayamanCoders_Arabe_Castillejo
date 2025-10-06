import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import Job from '@/models/Job'
import Application from '@/models/Application'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get token from cookie
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token and check admin role
    const decoded = await verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await User.findById(decoded.userId)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get statistics
    const [
      totalUsers,
      activeUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      usersByRole
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ emailVerified: true }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ])
    ])

    // Format user role counts
    const roleStats = {
      job_seeker: 0,
      employer: 0,
      mentor: 0,
      admin: 0
    }

    usersByRole.forEach((role: any) => {
      if (role._id in roleStats) {
        roleStats[role._id as keyof typeof roleStats] = role.count
      }
    })

    // Get recent activity (last 50 activities)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName email createdAt role')

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('employer', 'firstName lastName email')
      .select('title company createdAt employer')

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('applicant', 'firstName lastName email')
      .populate('job', 'title company')
      .select('applicant job createdAt status')

    // Format recent activity
    const recentActivity = [
      ...recentUsers.map(user => ({
        id: user._id.toString(),
        type: 'user_registration' as const,
        description: `${user.firstName} ${user.lastName} registered as ${user.role}`,
        timestamp: user.createdAt.toISOString(),
        userId: user._id.toString(),
        userName: `${user.firstName} ${user.lastName}`
      })),
      ...recentJobs.map(job => ({
        id: job._id.toString(),
        type: 'job_posted' as const,
        description: `New job posted: ${job.title} at ${job.company}`,
        timestamp: job.createdAt.toISOString(),
        userId: job.employer._id.toString(),
        userName: `${job.employer.firstName} ${job.employer.lastName}`
      })),
      ...recentApplications.map(app => ({
        id: app._id.toString(),
        type: 'application_submitted' as const,
        description: `${app.applicant.firstName} ${app.applicant.lastName} applied to ${app.job.title}`,
        timestamp: app.createdAt.toISOString(),
        userId: app.applicant._id.toString(),
        userName: `${app.applicant.firstName} ${app.applicant.lastName}`
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20)

    const stats = {
      totalUsers,
      activeUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      usersByRole: roleStats,
      recentActivity
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}