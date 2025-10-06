import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import Job from '@/models/Job'
import { verifyToken } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const adminUser = await User.findById(decoded.userId)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { action } = await request.json()
    const jobId = params.id

    // Find target job
    const job = await Job.findById(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'activate':
        job.status = 'active'
        await job.save()
        break

      case 'deactivate':
        job.status = 'inactive'
        await job.save()
        break

      case 'close':
        job.status = 'closed'
        await job.save()
        break

      case 'delete':
        await Job.findByIdAndDelete(jobId)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `Job ${action} successful`,
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
        status: job.status
      }
    })

  } catch (error) {
    console.error('Admin job action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}