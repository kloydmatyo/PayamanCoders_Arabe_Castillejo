import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import Job from '@/models/Job'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Verify admin access
    const decoded = await verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Authentication required' },
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build query
    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Get jobs with pagination and populate employer
    const jobs = await Job.find(query)
      .populate('employer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const totalJobs = await Job.countDocuments(query)
    const totalPages = Math.ceil(totalJobs / limit)

    // Format jobs data with application count
    const formattedJobs = await Promise.all(
      jobs.map(async (job) => {
        const Application = (await import('@/models/Application')).default
        const applicantCount = await Application.countDocuments({ job: job._id })
        
        return {
          ...job,
          applicantCount,
          views: job.views || 0
        }
      })
    )

    return NextResponse.json({
      jobs: formattedJobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Admin jobs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}