import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import Job from '@/models/Job'
import Application from '@/models/Application'
import { verifyToken, TokenPayload } from '@/lib/auth'

export async function GET(request: NextRequest) {
  console.log('🔍 Admin stats API called')
  
  try {
    // Check environment variables first
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not found in environment')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment')
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    console.log('✅ Environment variables checked')

    await dbConnect()
    console.log('✅ Database connected')

    // Get token from cookie
    const token = request.cookies.get('token')?.value
    if (!token) {
      console.log('❌ No token found in cookies')
      return NextResponse.json(
        { error: 'Authentication required - no token' },
        { status: 401 }
      )
    }
    console.log('✅ Token found in cookies')

    // Verify token and check admin role
    let decoded: TokenPayload | null = null
    try {
      decoded = await verifyToken(request)
    } catch (tokenError) {
      console.error('❌ Token verification error:', tokenError)
      return NextResponse.json(
        { error: 'Token verification failed' },
        { status: 401 }
      )
    }

    if (!decoded) {
      console.log('❌ Token verification returned null')
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    console.log('✅ Token verified for user:', decoded.userId)

    const user = await User.findById(decoded.userId)
    if (!user) {
      console.log('❌ User not found:', decoded.userId)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role !== 'admin') {
      console.log('❌ Admin access denied for user:', { userId: user._id, role: user.role })
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    console.log('✅ Admin access verified for user:', user.email)

    // Get basic statistics with individual error handling
    console.log('📊 Fetching basic statistics...')
    
    let totalUsers = 0
    let activeUsers = 0
    let totalJobs = 0
    let activeJobs = 0
    let totalApplications = 0
    let pendingApplications = 0
    let usersByRole: any[] = []

    try {
      totalUsers = await User.countDocuments()
      console.log('✅ Total users:', totalUsers)
    } catch (err) {
      console.error('❌ Error counting users:', err)
    }

    try {
      activeUsers = await User.countDocuments({ emailVerified: true })
      console.log('✅ Active users:', activeUsers)
    } catch (err) {
      console.error('❌ Error counting active users:', err)
    }

    try {
      totalJobs = await Job.countDocuments()
      console.log('✅ Total jobs:', totalJobs)
    } catch (err) {
      console.error('❌ Error counting jobs:', err)
    }

    try {
      activeJobs = await Job.countDocuments({ status: 'active' })
      console.log('✅ Active jobs:', activeJobs)
    } catch (err) {
      console.error('❌ Error counting active jobs:', err)
    }

    try {
      totalApplications = await Application.countDocuments()
      console.log('✅ Total applications:', totalApplications)
    } catch (err) {
      console.error('❌ Error counting applications:', err)
    }

    try {
      pendingApplications = await Application.countDocuments({ status: 'pending' })
      console.log('✅ Pending applications:', pendingApplications)
    } catch (err) {
      console.error('❌ Error counting pending applications:', err)
    }

    try {
      usersByRole = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ])
      console.log('✅ User roles aggregated:', usersByRole)
    } catch (err) {
      console.error('❌ Error aggregating user roles:', err)
    }

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

    // Simple recent activity - just return empty array for now to avoid population issues
    const recentActivity: any[] = []

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

    console.log('✅ Admin stats response prepared:', stats)
    return NextResponse.json(stats)

  } catch (error) {
    console.error('❌ Admin stats error:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}